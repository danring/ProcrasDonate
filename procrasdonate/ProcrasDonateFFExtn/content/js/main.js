
/**
 * 
 * @return
 */
function Overlay() {
	//logger("Overlay()");
	//logger([window, document, gBrowser]);

	this.toolbar_manager = {};
	
	// InitListener takes a post init callback argument.
	// Overlay needs a toolbar_manager field for the xul overlay toolbar function calls.
	var self = this;
	this.init_listener = new InitListener(_bind(self, self.init_callback));
};

Overlay.prototype = {
	init_callback: function(init_listener) {
		_pprint_keys(this.toolbar_manager, " INIT CALLBACK --before-- ");
		this.toolbar_manager = init_listener.toolbar_manager;
		_pprint_keys(this.toolbar_manager, " INIT CALLBACK --after-- ");
		_pprint_keys(this, " THIS ");
	}
};

var PDDB = function PDDB(db_filename) {
	this.db_filename = db_filename;

	this.orthogonals = new Orthogonals(this);
};

PDDB.prototype = {
	init_db: function() {
		logger("PDDB.init_db()");
		var db = new Backend__Firefox();
		db.connect(this.db_filename);
		this.db = db;
		this.models = load_models(db, this);
		
		var self = this;
		_iterate(this.models, function(name, model) {
			//logger("model: "+name);
			self[name] = model; //new Model(db, name, spec);
			
			var already_exists = false;
			self.db.execute("SELECT * FROM sqlite_master", {}, function(row) {
				if (row[1] == model.table_name)
					already_exists = true;
			});
			if (!already_exists) {
				model.create_table();
			}
		});
		
		// install data if not already installed.
		
		// NOTE: onInstall will receive data from server after this method (init_db)
		// is called.
		
		/////// TAGS ////////
		this.Unsorted      = this.Tag.get_or_create({ tag: "Unsorted" })
		this.ProcrasDonate = this.Tag.get_or_create({ tag: "ProcrasDonate" })
		this.TimeWellSpent = this.Tag.get_or_create({ tag: "TimeWellSpent" })
		
		////// TIMETYPES ////////
		this.Daily   = this.TimeType.get_or_create({ timetype: "Daily" });
		this.Weekly  = this.TimeType.get_or_create({ timetype: "Weekly" });
		this.Yearly  = this.TimeType.get_or_create({ timetype: "Yearly" });
		this.Forever = this.TimeType.get_or_create({ timetype: "Forever" });
		
		////// PAYMENT SERVICES ////////
		this.AmazonFPS = this.PaymentService.get_or_create({
			name: "Amazon Flexible Payments Service",
			user_url: constants.AMAZON_USER_URL
		});

		////// CONTENTTYPES ////////
		this.content_types = {};
		if (this.ContentType.count() == 0) {
			var contenttype_names = ['Site', 'SiteGroup', 'Recipient', 'Tag'];
			for (var i=0; i < contenttype_names.length; i++) {
				var ct = this.ContentType.create({ modelname: contenttype_names[i] });
				this.content_types[ct.id] = this[ct.modelname];
			}
		}
	},
};

var Orthogonals = function Orthogonals(pddb) {
	this.pddb = pddb;
};
Orthogonals.prototype = {
	_record: function(type, msg, detail_type) {
		detail_type = detail_type || "default";
		this.pddb.Log.create({
			datetime: _dbify_date(new Date()),
			type: type,
			detail_type: detail_type,
			message: msg
		});
		logger("Orthogonal."+type+" ("+detail_type+"): "+msg);
	},
	
	info: function(msg, detail_type) {
		this._record("INFO", msg, detail_type);
	},
	
	debug: function(msg, detail_type) {
		this._record("DEBUG", msg, detail_type);
	},
	
	log: function(msg, detail_type) {
		/*try {
			this.FAIL(); // we expect this to fail because we haven't defined a FAIL property!
		} catch (e) {
			logger("Orthogonals lOOOOOOOg: "+detail_type+": "+msg+"\n"+e.stack);
		}*/
		this._record("LOG", msg, detail_type);
	},
	
	warn: function(msg, detail_type) {
		this._record("WARN", msg, detail_type);
	},
	
	fail: function(msg, detail_type) {
		this._record("FAIL", msg, detail_type);
	},
	
	error: function(msg, detail_type) {
		//logger("Orthogonal.ErRoR ("+detail_type+"): "+msg);
		this._record("ERROR", msg, detail_type);
		try {
			this.FAIL(); // we expect this to fail because we haven't defined a FAIL property!
		} catch (e) {
			logger("Orthogonals ERROR: "+detail_type+": "+msg+"\n"+e.stack);
		}
		throw "Orthogonals ERROR: "+detail_type+": "+msg
	},
	
	UserStudy: function(type, msg, quant) {
		/*
		 * @param quant: some quantity (float)
		 */
		this.pddb.UserStudy.create({
			datetime: _dbify_date(new Date()),
			type: type,
			message: msg,
			quant: quant
		});
		logger("Orthogonal.UserStudy"+type+": "+msg+" ("+quant+")");
	}
	
}

var myOverlay = new Overlay();
