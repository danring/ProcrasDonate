
$(document).ready( function() {
	
	///
	/// Charts
	///
	//$.plot($("#placeholder"), data, options);

	
	///
	/// Automatic hover on username input field if there is one.
	/// If there isn't one, then automatic hover on zipcode or theme name.
	///
	$("#comment_textarea").focus();
	
	/// move StartButtonDiv below banner on home page
	var banner = $("#TheBanner");
	var startnow = $("#StartButtonDiv");
	if (banner.length && startnow.length) {
		//var bannerclone = banner.clone();
		//startnow.before(bannerclone);
		//banner.remove();
		var startnowclone = startnow.clone();
		banner.after(startnowclone);
		startnow.remove();
	}
	
	var current_browser = $("#current_browser");
	if (current_browser.length) {
		var browser_info = get_browser_info();
		current_browser.text(browser_info.browser);
	}
	
	// see notes in css
	//$("#wrapper").prepend("<div id=\"large_video\"></div>");
	//$("#large_video").prepend("<div id=\"inside\"></div>");
	//$("#large_video #inside").prepend("<img src=\"/procrasdonate_media/img/FireWall.png\">");
	//$("#content").prepend("<div id=\"large_video_floatifier\"></div>");
});

function is_windows() { return navigator.appVersion.indexOf("Win")!=-1; }
function is_mac() { return navigator.appVersion.indexOf("Mac")!=-1; }
function is_linux() { return navigator.appVersion.indexOf("Linux")!=-1; }
function is_unix() { return navigator.appVersion.indexOf("X11")!=-1; }

///
/// Friendly dialogue for installing xpi.
///
function install(anchor_class) {
	var browser_info = get_browser_info();
	if (!browser_info.browser_ok) {
		var href = "";
		if (is_windows()) {
			href = "http://download.mozilla.org/?product=firefox-3.5.3&os=win&lang=en-US";
		} else if (is_mac()) {
			href = "http://download.mozilla.org/?product=firefox-3.5.3&os=osx&lang=en-US";
		} else if (is_linux()) {
			href = "http://download.mozilla.org/?product=firefox-3.5.3&os=linux&lang=en-US";
		} else {
			href = "http://releases.mozilla.org/pub/mozilla.org/firefox/releases/3.5.3/contrib/";
		}
		
		location.href = "/start_now/"
		return false
		
	} else {
		// NOT READY FOR INSTALL YET
		// return not_ready_to_install();
		var item = $("."+anchor_class).slice(0,1);
		var xpi_url = item.attr("href");
		var xpi_hash = $.trim(item.children(".hash").text());
		
		// get recipient slug if on recipient page
		// /r/PD/ --> ['', 'r', 'PD', '']
		var cur_url = location.pathname.split("/");
		var slug = "__none__";
		if (cur_url.length >= 3 && cur_url[cur_url.length-3].trim() == "r") {
			slug = cur_url[cur_url.length-2].trim();
		}
		$.post("/generate_xpi/"+slug,
				{},
				function(data) {
					/*var s = "";
					for (var k in data) {
						s += k+"="+data[k]+"\n";
					}
					alert(s);*/
					if (data && data.xpi_url && data.xpi_hash) {
						xpi_url = data.xpi_url;
						xpi_hash = data.xpi_hash;
					}
					//alert("url "+xpi_url+"\nhash "+xpi_hash);
					var params = {
						"ProcrasDonate, a charitable incentive for good time management": {
							URL: xpi_url,
							IconURL: item.attr("iconURL"),
							Hash: xpi_hash,
							toString: function() { return this.URL; }
						}
					};
					InstallTrigger.install( params );
				},
				"json");
		return false
	}
}

function not_ready_to_install() {
	alert("Payments through our service have been temporarily suspended because " +
			"the third party payment service we've been using has gone out of " +
			"business.\n\nWe are hard at work integrating with a new payment system.\n\n" +
			"We will release this shortly.");
	return false;
}

function get_browser_info() {
	var browser_ok = false;
	var browser = "Unknown";
	var ff_version_ok = false;
	var ff_version = "Unknown";
	
	if ($.browser.mozilla) {
		browser_ok = true;
		browser = "Firefox";
		var v = $.browser.version.split(".");
		if (v[0] >= 1 && v[1] >= 9 && v[2] >= 1) {
			// FF 3.5 uses gecko 1.9.1
			// good. all is up to date....or futuristic
			browser_version_ok = true;
			ff_version = "3.5";
		} else if (v[0] >= 1 && v[1] >= 9 && v[2] >= 0) {
			// FF 3.0 uses gecko 1.9.0
			ff_version = "3.0";
		} else {
			ff_version = "old";
		}
	}
	if (!browser_ok) {
		if ($.browser.msie) browser = "Internet Explorer";
		else if ($.browser.safari) browser = "Safari";
		else if ($.browser.opera) browser = "Opera";
	}
	return {
		browser_ok: browser_ok,
		browser: browser,
		ff_version_ok: ff_version_ok,
		ff_version: ff_version
	}
}
