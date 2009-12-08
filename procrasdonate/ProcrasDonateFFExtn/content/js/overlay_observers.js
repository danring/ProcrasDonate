
/**
 * Listens for Firefox application load, which occurs once per window (?).
 * Initializes and un-initializes other listeners.
 * #@TODOs
 * ? any concurrency issues with having multiple windows open 
 * and doing uninits?
 * ? what's the effect of force quit and other problems? maybe we should
 *  have periodic callback anyway (rather than rely on sleep/wake)
 *  in order to catch bad shutdowns and hangups.
 */
var InitListener = function InitListener() {
	this.VERSION = -1;
	
	this.register();
};
InitListener.prototype = {};
_extend(InitListener.prototype, {
	register: function() {
		var self = this;
		window.addEventListener("load", function(event) { self.init(event); }, false);
		window.addEventListener("unload", function(event) { self.uninit(event); }, false);
	},
	
	/**
	 * unharmful but unnecessary to call this.
	 * listeners are automatically removed when listeners are triggered.
	 */
	unregister: function() { 
		var self = this;
		window.removeEventListener("load", function(event) { self.init(event); }, false);
		window.removeEventListener("unload", function(event) { self.uninit(event); }, false);
	},
	
	/**
	 * Firefox Application window initialization.
	 *  . install database
	 *  . create extension objects and listeners
	 *  . install generated input
	 *  . do install, update if necessary
	 *  . remove init ('load') listener
	 */
	init: function(event) {
		logger("init");
		var self = this;

		// connect to database. creates database and tables if necessary.
		this.pddb = new PDDB("procrasdonate.0.sqlite");
		this.pddb.init_db();
		
		this.prefs = new PreferenceManager("ProcrasDonate.", {});
		this.pd_api = new ProcrasDonate_API(this.pddb, this.prefs);
		this.controller = new Controller(this.pddb, this.prefs, this.pd_api);
		this.schedule = new Schedule(this.pddb, this.prefs, this.pd_api);
		this.time_tracker = new TimeTracker(this.pddb, this.prefs);
		this.toolbar_manager = new ToolbarManager(this.pddb, this.prefs);
		
		// install generated input.
		// we need to do this every time so that the PD domain are set.
		// don't set preselected charities yet because charities might
		// not be received from server.
		// #@TODO do we need to do this in init rather than constructor?
		this.install_generated_input(false);
		
		// create listeners
		this.observerService = Cc['@mozilla.org/observer-service;1'].getService(
				Components.interfaces.nsIObserverService);
		this.idleService = Components.classes["@mozilla.org/widget/idleservice;1"].getService(
				Components.interfaces.nsIIdleService);

		this.page_load_listener = new PageLoadListener(this.pddb, this.toolbar_manager, this.controller);
		this.url_bar_listener = new URLBarListener(this.pddb, this.prefs, this.toolbar_manager, this.schedule, this.time_tracker);
		this.blur_focus_listener = new BlurFocusListener(this.pddb, this.prefs, this.time_tracker);
		this.sleep_wake_listener = new SleepWakeListener(this.observerService, this.pddb, this.prefs, this.time_tracker);
		this.idle_back_noflash_listener = new IdleBack_NoFlash_Listener(this.idleService, this.pddb, this.prefs, this.time_tracker, constants.DEFAULT_MAX_IDLE);
		this.idle_back_flash_listener = new IdleBack_Flash_Listener(this.idleService, this.pddb, this.prefs, this.time_tracker, constants.DEFAULT_FLASH_MAX_IDLE);
		
		this.uninstall_listener = new UninstallListener(this.observerService, this.pddb, this.prefs, this.toolbar_manager);
		
		// cannot initialize toolbar here because chrome toolbar is not set up, which 
		// means that document.getElementById returns null.
		//this.toolbar_manager.initialize();

		// do install, update if necessary
		this.checkVersion();
		
		// remove listener (load only happens once anyway)
		window.removeEventListener("load", function(event) { self.init(event); }, false);
	},
	
	/**
	 * called on every window close
	 *  . stop time tracking
	 *  . remove listeners
	 *  . remove uninit ('unload') listener
	 */
	uninit: function(event) {
		logger("uninit");
		var self = this;

		// stop recording
		this.time_tracker.stop_recording(this.pddb.Visit.CLOSE_WINDOW);
		
		// remove listeners
		this.page_load_listener.unregister();
		this.url_bar_listener.unregister();
		this.blur_focus_listener.unregister();
		this.sleep_wake_listener.unregister();
		this.uninstall_listener.unregister();
		this.idle_back_noflash_listener.unregister();
		this.idle_back_flash_listener.unregister();
		
		// remove listener (unload only happens once anyway)
		window.removeEventListener("unload", function(event) { self.uninit(event); }, false);
	},
	
	checkVersion: function() {
		logger("check version");
		var ver = -1, firstrun = true;
		
		var gExtensionManager = Components.
		    classes["@mozilla.org/extensions/manager;1"].
		    getService(Components.interfaces.nsIExtensionManager);
		
		var current = gExtensionManager.getItemForID(constants.ProcrasDonate__UUID).version;
		
		try {
			ver = this.prefs.get("version", null);
			firstrun = this.prefs.get("firstrun", null);
		} catch(e) {
			//nothing
		} finally {
			if (firstrun) {
				this.doInstall();
				
				this.prefs.set("firstrun",false);
				this.prefs.set("version",current);
				
				// Insert code for first run here
				this.onInstall(current);
			}
			
			if (ver != current && !firstrun) {
				this.doUpgrade(ver);
				// !firstrun ensures that this section does not get loaded if its a first run.
				this.prefs.set("version",current);
				
				// Insert code if version is different here => upgrade
				this.onUpgrade(ver, current);
			}
		}
	},
	
	install_generated_input: function(set_preselected_charities) {
		logger("install generated input");
		var self = this;
		var data = generated_input()[0];
		
		constants.PD_URL = data.constants_PD_URL;
		constants.PD_API_URL = data.constants_PD_API_URL;
		
		if (!data.is_update) {
			if (!this.prefs.exists("private_key")) {
				// just in case
				this.prefs.set("private_key", data.private_key);
			}
			
			if (set_preselected_charities && !this.prefs.exists("set_preselected_charities")) {
				this.prefs.set("set_preselected_charities", true);
				_iterate(value, function(k, recip_pct, idx) {
					self.pddb.RecipientPercent.process_object(recip_pct);
				});
			}
		}
	},
	
	doInstall: function() { // 
		logger("Overlay.doInstall::");
		
		this.toolbar_manager.install_toolbar();
	},
	onInstall: function(version) { // execute on first run
		var self = this;
		this.pddb.orthogonals.log("install ProcrasDonate version "+version, "extn_sys");
		
		// The example below loads a page by opening a new tab.
		// Useful for loading a mini tutorial
		window.setTimeout(function() {
			gBrowser.selectedTab = gBrowser.addTab(constants.PD_URL + constants.AFTER_INSTALL_URL + version + "/");
		}, 1500); //Firefox 2 fix - or else tab will get closed
		
		// initialize state
		this.controller.initialize_state();
		
		// receive data from server to populate database
		// received tables: sitegroups, categories, recipients (user can add their own eventually)
		// after success, set default recipient percent
		this.pddb.page.pd_api.request_data_updates(
			function() {
				// after success

				// install generated input
				// pre-selected charities will now be installed
				self.install_generated_input(true);
				
			}, function() {
				// after failure
			}
		);
		
		// we send an email address as soon as user enters an email
		// address in the first register tab
		
		// send data to server (log install)
		//this.pddb.schedule.do_once_daily_tasks();
		this.pddb.page.pd_api.send_data();
	},
	
	/**
	 * make any necessary changes for a new version (upgrade)
	 * @param version: old version
	 */
	doUpgrade: function(version) {
		this.pddb.orthogonals.log("prepare "+version+" for upgrade", "extn_sys");
	},
	
	/**
	 *  execute after each new version (upgrade)
	 *  @param old_version: old version
	 *  @param version: new version
	 */
	onUpgrade: function(old_version, version) {
		var self = this;
		
		this.pddb.orthogonals.log("upgrade version "+old_version+" to version "+version, "extn_sys");
		
		var old_version_number = this.version_to_number(old_version);
		var version_number = this.version_to_number(version);
		
		if (old_version_number < this.version_to_number("0.3.3")) {
			this.pddb.Visit.add_column("enter_type", "VARCHAR");
			this.pddb.Visit.add_column("leave_type", "VARCHAR");
			this.pddb.Visit.select({}, function(row) {
				self.pddb.Visit.set({
					enter_type: self.pddb.Visit.UNKNOWN,
					leave_type: self.pddb.Visit.UNKNOWN
				}, {
					id: row.id
				});
			})
		}
		
		
		// initialize new state (initialize_state initializes state if necessary.
		this.controller.initialize_state();
		
		// The example below loads a page by opening a new tab.
		// Useful for loading a mini tutorial
		window.setTimeout(function() {
			gBrowser.selectedTab = gBrowser.addTab(constants.PD_URL + constants.AFTER_UPGRADE_URL + version + "/");
		}, 1500); //Firefox 2 fix - or else tab will get closed
		
	},
	
	/**
	 * turns a version, eg 1.14.8, into a number, in this case 11408.
	 * version components should never go above 99 or the ordering of version
	 * numbers will be messed up.
	 */
	version_to_number: function(version) {
		var parts = version.split(".");
		var ret = 0;
		_iterate(parts, function(key, value, index) {
			var v = parseInt(value);
			ret += v*(Math.pow(10, index*2))
		});
		logger("version is "+version+"     ret is "+ret);
		return ret
	}
	
});

var URLBarListener = function URLBarListener(pddb, prefs, toolbar_manager, schedule, time_tracker) {
	this.pddb = pddb;
	this.prefs = prefs;
	this.toolbar_manager = toolbar_manager;
	this.schedule = schedule;
	this.time_tracker = time_tracker;
	
	this.register();
};
URLBarListener.prototype = {};
_extend(URLBarListener.prototype, {
	register: function() {
		// Listen for webpage loads
		gBrowser.addProgressListener(
				this,
				Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
		
		// Only works in 3.5+
		//gBrowser.addTabsProgressListener(
		//		Overlay_urlBarListener,
		//		Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
	},
	
	unregister: function() {
		gBrowser.removeProgressListener(this);
	},
	
	QueryInterface: function(aIID) {
		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
			aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
			aIID.equals(Components.interfaces.nsISupports)) {
			//logger("QueryInterface:: " + aIID);
			return this;
		}
		throw Components.results.NS_NOINTERFACE;
	},
	
	onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
		// If you use myListener for more than one tab/window, use
		// aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
		var msg = "onStateChange:: ";
		if (aFlag & constants.STATE_START) {
			// This fires when the load event is initiated
			msg += "load_start ";
			//logger("onStateChange::load_start: " + aWebProgress.DOMWindow.location.href);
		}
		if (aFlag & constants.STATE_STOP) {
			// This fires when the load finishes
			msg += "load_stop ";
			//logger("onStateChange::load_end: " + aWebProgress.DOMWindow.location.href);
		}
		//logger(msg);
	},
	
	onLocationChange: function(aProgress, aRequest, aURI) {
		// This fires when the location bar changes; i.e load event is confirmed
		// or when the user switches tabs. If you use myListener for more than one tab/window,
		// use aProgress.DOMWindow to obtain the tab/window which triggered the change.
		var href = aProgress.DOMWindow.location.href;
		logger("onLocationChange:: href=" + href);
		//logger(jQuery(aProgress.DOMWindow,
		//if (aURI == "about:config")
		//	return;
		if  (aURI == "") {
			return
		}
		//logger(window);
		//logger(document);
		//logger(gBrowser);
		//logger(gBrowser.contentWindow);
		//logger(gBrowser.contentWindow.document);
		//logger(gBrowser.contentDocument);
		
		//logger(jQuery("*", gBrowser.contentWindow.document).length);
		//logger([]);
		//logger([aProgress.DOMWindow.content]);
		
		//logger(" location changed. start recording: "+href);
		this.time_tracker.stop_recording(this.pddb.Visit.URL);
		this.time_tracker.start_recording(href, this.pddb.Visit.URL);

		this.toolbar_manager.updateButtons({ url: href });
		this.processNewURL(aProgress.DOMWindow, aURI);
	},
	
	processNewURL: function(win, url) {
		//logger(jQuery("#content", win.document.defaultView).length);
		this.schedule.run();
	},
	
	// For definitions of the remaining functions see XULPlanet.com
	onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {
	},
	
	onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {
	},
	
	onSecurityChange: function(aWebProgress, aRequest, aState) {
	}
	
});


/**
 * 
 */
var PageLoadListener = function PageLoadListener(pddb, toolbar_manager, controller) {
	logger("PAGE LOAD LISTENER");
	this.pddb = pddb;
	this.toolbar_manager = toolbar_manager;
	this.controller = controller;
	
	this.register();
};
PageLoadListener.prototype = {};
_extend(PageLoadListener.prototype, {
	register: function() {
		var self = this;
		
		var appcontent = document.getElementById("appcontent");   // browser
		if (appcontent && !appcontent.seen_by_ProcrasDonate) {
			appcontent.seen_by_ProcrasDonate = true;

			// use anonymous function for memory reasons
			// https://developer.mozilla.org/en/DOM/element.addEventListener

			// DOMContentLoaded - fires when DOM is ready but images not loaded
			appcontent.addEventListener(
				"DOMContentLoaded",
				function(event) { self.onPageLoad(event); },
				true);
			// load - fires after pageload is complete
			//appcontent.addEventListener(
			//	"load", _bind(this, this.onLoad), false);
			
			//appcontent.addEventListener("pageshow", Overlay.onPageShow, false);
			//appcontent.addEventListener("pagehide", Overlay.onPageHide, false);
			
			//appcontent.addEventListener(
			//	"unload", _bind(this, this.onUnload), false);
		}
	},
	
	unregister: function() {
		var self = this;
		
		var appcontent = document.getElementById("appcontent");   // browser
		if (appcontent) {
			appcontent.removeEventListener(
				"DOMContentLoaded",
				function(event) { self.onPageLoad(event); },
				true);
		}
	},

	onPageLoad: function(event) {
		// We only care about page load (DOMContentLoaded) when we're
		// going to display a page.
		var msg = "Overlay.onPageLoad:: ";
		//logger(msg);
		
		// initialize toolbar
		if (!this.toolbar_manager.initialized) {
			this.toolbar_manager.initialize();
		}
		
		var unsafeWin = event.target.defaultView;
		if (unsafeWin.wrappedJSObject)
			unsafeWin = unsafeWin.wrappedJSObject;
		
		var href = new XPCNativeWrapper(
			new XPCNativeWrapper(unsafeWin, "location").location, "href").href;
		
		// record if there is flash on page so that appropriate max idle time is used
		var request = new PageRequest(href, event);
		var has_flash = null;
		var max_idle = null;
		request.jQuery("*[type=application/x-shockwave-flash]").after("<H1>BOOM</h1>");
		if (request.jQuery("[type=application/x-shockwave-flash]").length > 0) {
			has_flash = true;
			max_idle = constants.DEFAULT_FLASH_MAX_IDLE;
			logger("flash on page");
		} else {
			has_flash = false;
			max_idle = constants.DEFAULT_MAX_IDLE;
			logger("NO flash on page");
		}
		// create site if necessary and overwrite flash and max idle
		var site = this.pddb.Site.get_or_make(href, has_flash, max_idle);
		
		return this.dispatch(href, event);
	},
	

	onPageUnload: function(event) {
		var msg = "Overlay.onPageUnload:: ";
		var doc = event.originalTarget;
		if (event.originalTarget instanceof HTMLDocument) {
			msg += "HTML "
			//var doc = event.originalTarget;
			//logger("page unloaded:" + doc.location.href);
		}
		//logger(msg);
	},

	dispatch: function(href, event) {
		var i, controller, request, response;
		request = new PageRequest(href, event);
		response = this.controller.handle(request);
		if (response) {
			return response;
		} else {
			return null;
		}
	},
	
	onLoad: function() {
	},
	
	onUnload: function() {
	},
	
	onPageShow: function() {
	},
	
	onPageHide: function() {
	},
});


/**
 * 
 */
var UninstallListener = function UninstallListener(observerService, pddb, prefs, toolbar_manager) {
	this.observerService = observerService;
	this.pddb = pddb;
	this.prefs = prefs;
	this.toolbar_manager = toolbar_manager;

	// we need this flag because we don't want to uninstall before
	// the user has a chance to cancel.
	this._uninstall = false;
	
	this.register();
};
UninstallListener.prototype = {};
_extend(UninstallListener.prototype, {
	register: function() {
		this.observerService.addObserver(this, "em-action-requested", false);
		this.observerService.addObserver(this, "quit-application-granted", false);
	},
	
	unregister: function() {
		this.observerService.removeObserver(this, "em-action-requested", false);
		this.observerService.removeObserver(this, "quit-application-granted", false);
	},
	
	observe: function(subject, topic, data) {
		/*
		 * the tricky thing is that there are a few different kinds of uninstall events
		 * https://developer.mozilla.org/en/Observer_Notifications
		 * 	 
		 *   TOPIC: em-action-requested
		 *      DATA:
		 *      	item-uninstalled
		 *      	item-cancel-action (eg, cancel uninstall)
		 *      	item-enabled
		 *      	item-disabled
		 *      
		 *   TOPIC: quit-application-granted (observers have agreed to shutdown app<-FF)
		 *   
		 * when item-uninstalled or item-cancel-action is called, we set or unset a flag.
		 * when quit-application-granted is called, we call uninstall if flag is set
		 */
		var self = this;
		
		if (topic == "em-action-requested") {
			// this gets called for every uninstall, so we need to check
			// that the request is for ProcrasDonate
			subject.QueryInterface(Components.interfaces.nsIUpdateItem);
			if (subject.id != constants.ProcrasDonate__UUID) {
				return;
			}
			
			if (data == "item-uninstalled") {
				self.pddb.orthogonals.log("uninstall requested", "extn_sys");
				self._uninstall = true;
			} else if (data == "item-cancel-action") {
				self.pddb.orthogonals.log("uninstall cancelled", "extn_sys");
				self._uninstall = false;
			}
			
		} else if (topic == "quit-application-granted") {
			if (self._uninstall) {
				self.uninstall();
				self.unregister();
			}
		}
	},
	
	/*
	 * uninstall app, including:
	 *     delete database
	 *     delete preferences
	 *     remove toolbar icons
	 *     sends logs to pd server
	 *     opens feedback tab
	 */
	uninstall: function() {
		var self = this;
		
		// send logs to pd server
		this.pddb.orthogonals.log("doing uninstall...", "extn_sys");
		this.pddb.page.pd_api.send_data();
		
		// opens feedback tab
		gBrowser.selectedTab = gBrowser.addTab(constants.PD_URL + constants.FEEDBACK_URL);

		// delete all preferences
		// note that three prefs are not deleted....probably
		// caused by focus/blur timeout?
		this.prefs.remove("");

		// delete database (or rather, drop all the tables)
		_iterate(self.pddb.models, function(key, value, index) {
			logger("key = "+key+" value = "+value);
			if (key != "_order") {
				value.drop_table();
			}
		});
		
		// remove toolbar items
		this.toolbar_manager.uninstall_toolbar();
	},
});

