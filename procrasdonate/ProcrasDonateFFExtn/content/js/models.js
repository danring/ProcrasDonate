/*
 * deep_dict: returns dictionary of fields 
 *   fetches <foo>_id fields via deep_dict()
 *   flattens some fields, eg <foo>.tag() returns tag.tag string
 *   calls _un_dbify_bool, _un_dbify_date, parseInt and parseFloat as appropriate
 *     (#@TODO would be nice to make the getting and setting of fields automatic.
 *         tricky part is handling dates v INTEGER correctly)
 *   
 * deep field instance methods never flatten. thus, <foo>() always returns a row factory
 */

function load_models(db, pddb) {
	
	var Site = new Model(db, "Site", {
		// Model metadata
		table_name: "sites",
		columns: {
			_order: ["id", "sitegroup_id", "url", "flash", "max_idle"],
			id: "INTEGER PRIMARY KEY",
			sitegroup_id: "INTEGER",
			url: "VARCHAR",
			flash: "INTEGER", // boolean
			max_idle: "INTEGER", // in seconds
		},
		indexes: []
	}, {
		// Instance methods
		tag: function() {
			// we expect a site to always have a tag (via its sitegroup)
			var sitegroup = this.sitegroup();
			return sitegroup.tag();
		},
		
		sitegroup: function(notrequired) {
			// we expect a site to always have a sitegroup
			var self = this;
			var sitegroup = SiteGroup.get_or_null({ 'id': self.sitegroup_id });
			if (!sitegroup) {
				if (notrequired) {
					return null;
				} else {
					pddb.orthogonals.error("no SiteGroup found for site = "+this);
				}
			}
			return sitegroup;
		},
		
		has_flash: function() {
			return _un_dbify_bool(this.flash)
		},
		
		deep_dict: function() {
			return {
				id: this.id,
				sitegroup: this.sitegroup().deep_dict(),
				url: this.url,
				tag: this.tag().tag,
				has_flash: this.has_flash(),
				max_idle: this.max_idle
			}
		}
		
	}, {
		// Model-class methods
		get_or_make: function(url, has_flash, max_idle) {
			var site = this.get_or_null({url__eq: url});
			if (!site) {
				var host = _host(url);
				var sitegroup = this.SiteGroup.get_or_create({
					host: host
				}, {
					name: host,
					host: host,
					tag_id: pddb.Unsorted.id
				});
	
				site = this.create({
					url: url,
					sitegroup_id: sitegroup.id,
					flash: _dbify_bool(has_flash),
					max_idle: max_idle || this.prefs.get("DEFAULT_MAX_IDLE")
				});
				return site
				
			} else {
				// overwrite flash and idle times if necessary
				if (site.has_flash() != has_flash || site.max_idle != max_idle) {
					this.set({
						flash: _dbify_bool(has_flash),
						max_idle: max_idle
					}, {
						url: url
					});
					return this.get_or_null({url__eq: url});
				} else {
					return site
				}
				
				/*if (site.has_flash() != has_flash || site.max_idle != max_idle) {
					logger("Site existed. did not override flash\n"+
							"existing site: "+site+
							"\nnew values: "+has_flash+" "+max_idle+" "+url);
				}*/
			}
		}
	});
	
	var SiteGroup = new Model(db, "SiteGroup", {
		table_name: "sitegroups",
		columns: {
			_order: ["id", "name", "host", "url_re", "tag_id", "tax_exempt_status"],
			id: "INTEGER PRIMARY KEY",
			name: "VARCHAR",
			host: "VARCHAR",
			url_re: "VARCHAR",
			tag_id: "INTEGER",
			tax_exempt_status: "INTEGER", // boolean 0=false
		},
		indexes: []
	}, {
		// instance methods
		tag: function() {
			// we expect a site to always have a tag (via its sitegroup)
			var self = this;
			var tag = Tag.get_or_null({ id: self.tag_id })
			if (!tag) {
				pddb.orthogonals.error("no Tag found for sitegroup = "+this);
			}
			return tag
		},
		
		has_tax_exempt_status: function() {
			return _un_dbify_bool(this.tax_exempt_status);
		},
		
		deep_dict: function() {
			return {
				id: this.id,
				name: this.name,
				host: this.host,
				url_re: this.url_re,
				tag: this.tag().tag,
				tax_exempt_status: this.has_tax_exempt_status()
			}
		}
	}, {
		// class methods
	});
	
	var Recipient = new Model(db, "Recipient", {
		table_name: "recipients",
		columns: {
			_order: ["id", "slug", "name", "category_id", "mission",
			         "description", "url", "logo", "twitter_name", "facebook_name", 
			         "is_visible", "pd_registered", "tax_exempt_status"],
			id: "INTEGER PRIMARY KEY",
			slug: "VARCHAR",
			name: "VARCHAR",
			category_id: "INTEGER",
			mission: "VARCHAR",
			description: "VARCHAR",
			url: "VARCHAR",
			logo: "VARCHAR", // url to img uploaded onto server
			twitter_name: "VARCHAR",
			facebook_name: "VARCHAR",
			is_visible: "INTEGER", // boolean 0=false
			pd_registered: "INTEGER", // boolean 0=false
			tax_exempt_status: "INTEGER", // boolean 0=false
		},
		indexes: []
	}, {
		// instance methods
		category: function() {
			var self = this;
			var category = Category.get_or_null({ id: self.category_id })
			if (!category) {
				pddb.orthogonals.error("no Category found for recipient = "+this);
			}
			return category
		},
		
		has_tax_exempt_status: function() {
			return _un_dbify_bool(this.tax_exempt_status);
		},
		
		bool_is_visible: function() {
			return _un_dbify_bool(this.is_visible);
		},
		
		is_pd_registered: function() {
			return _un_dbify_bool(this.pd_registered);
		},
		
		deep_dict: function() {
			return {
				id: this.id,
				slug: this.slug,
				name: this.name,
				category: this.category().category,
				mission: this.mission,
				description: this.description,
				url: this.url,
				logo: this.logo,
				twitter_name: this.twitter_name,
				facebook_name: this.facebook_name,
				is_visible: _un_dbify_bool(this.is_visible),
				pd_registered: _un_dbify_bool(this.pd_registered),
				tax_exempt_status: this.has_tax_exempt_status(),
			}
		},
		
		html_description: function() {
			logger("b=<p>"+this.description.replace("\n\n", "</p><p>")+"</p>");
			return "<p>"+this.description.replace("\n\n", "</p><p>")+"</p>"
		}
	}, {
		// class methods
		process_object: function(r, last_receive_time, return_row) {
			// @param r: object from server. json already loaded
			// @param last_receive_time: time last received data. 
			//		if r.last_modified is older than last receive time,
			//		only add row if doesn't exist. no need to overwrite data.
			// @param return_row: if true, will return the created row
			// @return: if return_row, returns created row
		
			last_modified = new Date(r.last_modified);
			var recipient = pddb.Recipient.get_or_create({
				slug: r.slug
			});
			if (last_receive_time &&
					last_receive_time > new Date(last_modified) &&
					recipient) {
				return null
			} // else, unknown or modified recipient
			
			var category = pddb.Category.get_or_create({
				category: r.category
			});
			pddb.Recipient.set({
				name: r.name,
				category_id: category.id,
				mission: r.mission,
                description: r.description,
                url: r.url,
                logo: r.logo,
                twitter_name: r.twitter_name,
                facebook_name: r.facebook_name,
                is_visible: _dbify_bool(r.is_visible),
                pd_registered: _dbify_bool(r.pd_registered),
                tax_exempt_status: _dbify_bool(r.tax_exempt_status),
			}, {
				slug: r.slug
			});
			if (return_row) {
				return pddb.Recipient.get_or_create({
					slug: r.slug
				});
			}
		}
	});
	
	// recipient has 1 category
	var Category = new Model(db, "Category", {
		table_name: "categories",
		columns: {
			_order: ["id", "category"],
			id: "INTEGER PRIMARY KEY",
			category: "VARCHAR"
		},
		indexes: []
	}, {
		// instance methods
	}, {
		// class methods
	});
	
	var RecipientPercent = new Model(db, "RecipientPercent", {
		table_name: "recipientpercents",
		columns: {
			_order: ["id", "recipient_id", "percent"],
			id: "INTEGER PRIMARY KEY",
			recipient_id: "INTEGER",
			percent: "REAL" // 100% = 1
		},
		indexes: []
	}, {
		// instance methods
		recipient: function() {
			// we expect a RecipientPercent to always have a recipient
			var self = this;
			var recipient = Recipient.get_or_null({ id: self.recipient_id })
			if (!recipient) {
				pddb.orthogonals.error("no Recipient found for recipientpercent = "+this);
			}
			return recipient
		},
		
		display_percent: function() {
			return this.percent * 100
		},
		
		deep_dict: function() {
			return {
				id: this.id,
				recipient: this.recipient().deep_dict(),
				percent: parseFloat(this.percent),
			}
		}
	}, {
		// class methods
	});
	
	// sitegroup has 1 tag
	var Tag = new Model(db, "Tag", {
		table_name: "tags",
		columns: {
			_order: ["id", "tag"],
			id: "INTEGER PRIMARY KEY",
			tag: "VARCHAR"
		},
		indexes: []
	}, {
		// instance methods
	}, {
		// class methods
	});
	
	/*
	var SiteGroupTagging = new Model(db, "SiteGroupTagging", {
		table_name: "sitegrouptaggings",
		columns: {
			_order: ["id", "sitegroup_id", "tag_id"],
			id: "INTEGER PRIMARY KEY",
			sitegroup_id: "INTEGER",
			tag_id: "INTEGER"
		},
		indexes: []
	});
	*/
	
	var Visit = new Model(db, "Visit", {
		table_name: "visits",
		columns: {
			_order: ["id", "site_id", "enter_at", "duration"],
			id: "INTEGER PRIMARY KEY",
			site_id: "INTEGER",
			enter_at: "INTEGER", //"DATETIME",
			duration: "INTEGER", //seconds
		},
		indexes: []
	}, {
		site: function() {
			// we expect a Visit to always have a site
			var self = this;
			var site = Site.get_or_null({ id: self.site_id })
			if (!site) {
				pddb.orthogonals.error("no Site found for visit = "+this);
			}
			return site
		},
		
		deep_dict: function() {
			return {
				id: this.id,
				site: this.site().deep_dict(),
				enter_at: _un_dbify_date(this.enter_at),
				duration: parseInt(this.duration)
			}
		}
	}, {
		// class methods
	});
	
	// Aggregates visits in different ways
	// Crosses different model slices (tags, recipients, sites, sitegroups)
	// with different time spans (daily, weekly, forever)
	var Total = new Model(db, "Total", {
		table_name: "totals",
		columns: {
			_order: ["id","contenttype_id", "content_id", "total_time", 
			         "total_amount", "datetime", "timetype_id"],
			         
			id: "INTEGER PRIMARY KEY",

			// generic table
			contenttype_id: "INTEGER",
			// id of row in generic table
			content_id: "INTEGER",
			
			total_time: "INTEGER", //seconds
			total_amount: "REAL", //cents
			datetime: "INTEGER", //"DATETIME"
			timetype_id: "INTEGER"
		}
	}, {
		dollars: function() {
			return parseFloat(this.total_amount) / 100.0;
		},
		
		hours: function() {
			return parseFloat(this.total_time) / (60*60);
		},
		
		// instance methods
		contenttype: function() {
			// all Totals have a contenttype
			var self = this;
			var contenttype = pddb.ContentType.get_or_null({ id: self.contenttype_id });
			if (!contenttype) {
				pddb.orthogonals.error("no contenttype found for total = "+this);
			}
			return contenttype
		},
		
		cached_content: null,
		content: function() {
			// all Totals have a content
			var self = this;
			if (!self.cached_content) {
				var content = pddb[self.contenttype().modelname].get_or_null({ id: self.content_id });
				if (!content) {
					pddb.orthogonals.error("no content found for total = "+self);
				} else {
					self.cached_content = content;
				}
			}
			return self.cached_content;
		},
		
		recipient: function() {
			// @returns Recipient row factory or null if not Recipient contenttype
			if (this.contenttype().modelname == "Recipient") {
				return this.content();
			}
			return null;
		},
		
		site: function() {
			// @returns Site row factory or null if not Site contenttype
			if (this.contenttype().modelname == "Site") {
				return this.content();
			}
			return null;
		},
		
		sitegroup: function() {
			// @returns SiteGroup row factory or null if not SiteGroup contenttype
			if (this.contenttype().modelname == "SiteGroup") {
				return this.content();
			}
			return null;
		}, 
		
		tag: function() {
			// @returns Tag row factory or null if not Tag contenttype
			if (this.contenttype().modelname == "Tag") {
				return this.content();
			}
			return null;
		},
		
		timetype: function() {
			// all Totals have a timetype
			var self = this;
			var timetype = pddb.TimeType.get_or_null({ id: self.timetype_id });
			if (!timetype) {
				pddb.orthogonals.error("no timetype found for total = "+this);
			}
			return timetype
		},
		
		_payments: function(deep_dictify) {
			// Totals may have Payments
			// @returns list of Payment row factories
			// @param deep_dictify: if true, returns dicts instead of row objects
			var self = this;
			var payments = [];
			pddb.PaymentTotalTagging.select({ total_id: self.id }, function(row) {
				if (deep_dictify) {
					payments.push(row.payment().deep_dict());
				} else {
					payments.push(row.payment());
				}
			});
			return payments
		},
		
		payments: function() {
			return this._payments(false);
		},
		
		payment_dicts: function() {
			return this._payments(true);
		},
		
		deep_dict: function() {
			/*
			 * Extracts foreign keys.
			 * @return dictionary, not a row factory
			 */
			return {
				id: this.id,
				contenttype: this.contenttype().modelname,
				content: this.content().deep_dict(),
				total_time: parseInt(this.total_time),
				total_amount: parseFloat(this.total_amount),
				datetime: parseInt(this.datetime),
				timetype: this.timetype().timetype,
				payments: this.payment_dicts()
			}
		}
	}, {
		// class methods
	});
	
	
	var PaymentService = new Model(db, "PaymentService", {
		table_name: "paymentservices",
		columns: {
			_order: ["id", "name", "user_url"],
			id: "INTEGER PRIMARY KEY",
			name: "VARCHAR",
			user_url: "VARCHAR"
		}
	}, {
		// instance methods
	}, {
		// class methods
	});
	
	// if balance can only partially cover payment, 
	// then two payments will be created for total.
	// one will be paid, one will be unpaid (initially)
	var Payment = new Model(db, "Payment", {
		table_name: "payments",
		columns: {
			_order: ["id", "payment_service_id", "transaction_id",
			         "sent_to_service", "settled",
			         "total_amount_paid", "amount_paid",
			         "amount_paid_in_fees", "amount_paid_tax_deductibly",
			         "datetime"],
			id: "INTEGER PRIMARY KEY",
			payment_service_id: "INTEGER",
			transaction_id: "INTEGER",
			sent_to_service: "INTEGER", // boolean 0=false
			settled: "INTEGER", // boolean 0=false
			total_amount_paid: "REAL",
			amount_paid: "REAL",
			amount_paid_in_fees: "REAL",
			amount_paid_tax_deductibly: "REAL",
			datetime: "INTEGER" //"DATETIME"
		}
	}, {
		// instance methods
		payment_service: function() {
			// all Payment have a payment_service
			var self = this;
			var payment_service = pddb.PaymentService.get_or_null({ id: self.payment_service_id });
			if (!payment_service) {
				pddb.orthogonals.error("no payment_service found for payment = "+this);
			}
			return payment_service
		},
		
		deep_dict: function() {
			// #@TODO do this instead of listing all fields??
			//var ret = this.prototype.deep_dict()
			// return _extend(ret, {})
			return {
				id: this.id,
				payment_service: this.payment_service(),
				transaction_id: parseInt(this.transaction_id),
				sent_to_service: _un_dbify_bool(this.sent_to_service),
				settled: _un_dbify_bool(this.settled),
				total_amount_paid: parseFloat(this.total_amount_paid),
				amount_paid: parseFloat(this.amount_paid),
				amount_paid_in_fees: parseFloat(this.amount_paid_in_fees),
				amount_paid_tax_deductibly: parseFloatt(this.amount_paid_tax_deductibly),
				datetime: _un_dbify_date(this.datetime)
			}
		},
		
		_totals: function(deep_dictify) {
			// Payments may have Totals
			// @returns list of Totals row factories
			// @param deep_dictify: if true, returns dicts instead of row objects
			var self = this;
			var totals = [];
			pddb.PaymentTotalTagging.select({ payment_id: self.id }, function(row) {
				if (deep_dictify) {
					totals.push(row.total().deep_dict());
				} else {
					totals.push(row.total());
				}
			});
			return totals
		},
		
		totals: function() {
			return this._totals(false);
		},
		
		totals_dicts: function() {
			return this._totals(true);
		},
	}, {
		// class methods
	});
	
	/*
	 * Index of totals that require Payments-- that is, no PaymentTotalTagging
	 * exists yet.
	 * 
	 * Currently, payments are only made for yesterday and older totals. This
	 * means that we expect partially_paid to always be false.
	 * 
	 * RequiresPayment are attached to Totals upon creation.
	 * Whenever payments are made, that's when PaymentTotalTaggings are created.
	 * When a PaymentTotalTagging is created. As long as the Total is more than a day old,
	 * that means it won't change, and that means we won't pay it only to have that amount 
	 * become a partial payment. Thus, when a PaymentTotalTagging is created (and
	 * of course the corresponding Payment), the RequiresPayment can be deleted. 
	 */
	var RequiresPayment = new Model(db, "RequiresPayment", {
		table_name: "requirespayments",
		columns: {
			_order: ["id", "total_id", "partially_paid"],
			
			id: "INTEGER PRIMARY KEY",
			total_id: "INTEGER",
			partially_paid: "INTEGER", // boolean 0=false
			pending: "INTEGER", // boolean 0=false
		}
	}, {
		// instance methods
		total: function() {
			// all RequiresPayment have a total
			var self = this;
			var total = pddb.Total.get_or_null({ id: self.total_id });
			if (!total) {
				pddb.orthogonals.error("no total found for RequiresPayment = "+this);
			}
			return total
		},
		
		// returns boolean value
		is_partially_paid: function() {
			return _un_dbify_bool(this.partially_paid)
		},
		
		// returns boolean value
		is_pending: function() {
			return _un_dbify_bool(this.pending)
		},
	
		deep_dict: function() {
			return {
				id: this.id,
				total: this.total().deep_dict(),
				partially_paid: this.is_partially_paid(),
				pending: this.is_pending()
			}
		}
	}, {
		// class methods
		
		///
		/// Applies fn to all requirespayments that are partially paid
		/// @param fn: function that takes a row
		///
		partially_paids: function(fn) {
			this.select({
				partially_paid: _dbify_bool(true)
			}, fn);
		},
		
		// @returns count of partially paid totals
		partially_paids_count: function() {
			var count = 0
			this.select({
				partially_paid: _dbify_bool(true)
			}, function(row) {
				count += 1;
			});
			return count
		}
	});
	
	var PaymentTotalTagging = new Model(db, "PaymentTotalTagging", {
		table_name: "paymenttotaltagging",
		columns: {
			_order: ["id", "payment_id", "total_id"],
			id: "INTEGER PRIMARY KEY",
			payment_id: "INTEGER",
			total_id: "INTEGER"
		},
		indexes: []
	}, {
		// instance methods
		total: function() {
			// we expect a PaymentTotalTagging to always have a total
			var self = this;
			var total = Total.get_or_null({ id: self.total_id })
			if (!total) {
				pddb.orthogonals.error("no Total found for PaymentTotalTagging = "+this);
			}
			return total
		},
		
		payment: function() {
			// we expect a PaymentTotalTagging to always have a payment
			var self = this;
			var payment = Payment.get_or_null({ id: self.payment_id })
			if (!payment) {
				pddb.orthogonals.error("no payment found for PaymentTotalTagging = "+this);
			}
			return payment
		}
	}, {
		// class methods
	});
	
	
	// eg: daily, weekly or forever
	var TimeType = new Model(db, "TimeType", {
		table_name: "timetypes",
		columns: {
			_order: ["id", "timetype"],
			id: "INTEGER PRIMARY KEY",
			timetype: "VARCHAR"
		},
		indexes: []
	}, {
		// instance methods
	}, {
		// class methods
	});
	
	var ContentType = new Model(db, "ContentType", {
		table_name: "contenttypes",
		columns: {
			_order: ["id", "modelname"],
			id: "INTEGER PRIMARY KEY",
			modelname: "VARCHAR"
		}
	}, {
		// instance methods
	}, {
		// class methods
	});

	var Log = new Model(db, "Log", {
		table_name: "logs",
		columns: {
			_order: ["id", "datetime", "type", "detail_type", "message"],
			id: "INTEGER PRIMARY KEY",
			datetime: "INTEGER", //"DATETIME"
			type: "VARCHAR",
			detail_type: "VARCHAR",
			message: "VARCHAR"
		}
	}, {
		// instance methods
	}, {
		// class methods
	});

	var UserStudy = new Model(db, "UserStudy", {
		table_name: "userstudies",
		columns: {
			_order: ["id", "datetime", "type", "message", "quant"],
			id: "INTEGER PRIMARY KEY",
			datetime: "INTEGER", //"DATETIME"
			type: "VARCHAR",
			message: "VARCHAR",
			quant: "REAL"
		}
	}, {
		// instance methods
	}, {
		// class methods
	});
	
	var FPSMultiuseAuthorization = new Model(db, "FPSMultiuseAuthorization", {
		table_name: "fpsmultiuseauthorizations",
		columns: {
			_order: ["id", "timestamp", "caller_reference", "global_amount_limit",
			         "is_recipient_cobranding", "payment_method", "payment_reason",
			         "recipient_slug_list",
			         "status", "token_id", "error_message"],
			id: "INTEGER PRIMARY KEY",
			timestamp: "INTEGER", //"DATETIME"
			caller_reference: "VARCHAR",
			global_amount_limit: "VARCHAR",
			is_recipient_cobranding: "INTEGER", //BOOLEAN 0=false
			payment_method: "VARCHAR",
			payment_reason: "VARCHAR",
			recipient_slug_list: "VARCHAR",
			
			status: "VARCHAR", // 
			token_id: "VARCHAR",
			error_message: "VARCHAR"
		}
	}, {
		// instance methods
		success_abt: function() { return this.status == FPSMultiuseAuthorization.SUCCESS_ABT },
		success_ach: function() { return this.status == FPSMultiuseAuthorization.SUCCESS_ACH },
		success_cc: function() { return this.status == FPSMultiuseAuthorization.SUCCESS_CC },
		system_error: function() { return this.status == FPSMultiuseAuthorization.SYSTEM_ERROR },
		aborted: function() { return this.status == FPSMultiuseAuthorization.ABORTED },
		caller_error: function() { return this.status == FPSMultiuseAuthorization.CALLER_ERROR },
		payment_method_error: function() { return this.status == FPSMultiuseAuthorization.PAYMENT_METHOD_ERROR },
		payment_error: function() { return this.status == FPSMultiuseAuthorization.PAYMENT_ERROR },
		developer_error: function() { return this.status == FPSMultiuseAuthorization.DEVELOPER_ERROR },
		response_not_received: function() { return this.status == FPSMultiuseAuthorization.RESPONSE_NOT_RECEIVED },
		response_error: function() { return this.status == FPSMultiuseAuthorization.RESPONSE_ERROR },
		cancelled: function() { return this.status == FPSMultiuseAuthorization.CANCELLED },
		expired: function() { return this.status == FPSMultiuseAuthorization.EXPIRED },
		
		good_to_go: function() {
			return this.success_abt() || this.success_ach() || this.success_cc()
		},
		
		error: function() {
			return this.system_error() || this.aborted() || this.caller_error() || this.response_error() ||
				this.payment_error() || this.developer_error() || this.payment_method_error()
		},
		
		deep_dict: function() {
			return {
				id: this.id,
				timestamp: _un_dbify_date(this.timestamp),
				caller_reference: this.caller_reference,
				global_amount_limit: this.global_amount_limit,
				is_recipient_cobranding: _un_dbify_bool(this.is_recipient_cobranding),
				payment_method: this.payment_method,
				payment_reason: this.payment_reason,
				recipient_slug_list: this.recipient_slug_list,
				status: this.status,
				token_id: this.token_id,
				error_message: this.error_message,
			}
		},
		
	}, {
		// class methods
		SUCCESS_ABT: 'SA', // success for Amazon account payment method
		SUCCESS_ACH: 'SB', // success for bank account payment method
        SUCCESS_CC: 'SC', // success for credit card payment method
        SYSTEM_ERROR: 'SE',
        ABORTED: 'A', // buyer aborted pipeline
        CALLER_ERROR: 'CE',
        PAYMENT_METHOD_ERROR: 'PE', // buyer does not have payment method requested
        PAYMENT_ERROR: 'NP',
        DEVELOPER_ERROR: 'NM',
        RESPONSE_NOT_RECEIVED: '0',
        RESPONSE_ERROR: '1',
        CANCELLED: 'C',
        EXPIRED: 'EX',
        
        most_recent: function() {
			// iterate over rows in timestamp order and return the most recent one
			// return null if no rows
			var ret = [];
			FPSMultiuseAuthorization.select({}, function(row) {
				ret.push(row);
			}, "-timestamp");
			
			if (ret.length > 0) {
				return ret[0];
			} else {
				return null;
			}
		},
		
		get_latest_success: function() {
			var success = null;
			FPSMultiuseAuthorization.select({}, function(row) {
				if (row.good_to_go() && !success) {
					success = row;
				}
			}, "-timestamp");
			return success;
		},
		
		has_success: function() {
			// iterate over tokens and return true if found successful one
			var ret = false;
			FPSMultiuseAuthorization.select({}, function(row) {
				if (row.good_to_go()) {
					ret = true
				}
			});
			return ret;
		},
		
		process_object: function(ma) {
			// @param ma: object from server. json already loaded
			// @return: {diff: true or false if status changed,
			//           multi_auth: multi auth row}
			// incoming timestampe are from self.timestamp.ctime():
			//              Sat Sep 19 14:42:25 2009
			// the above string can transformed to dates with new Date(ctimestr)
			//
			// not this, which is "%s" % self.timestamp -->2009-09-19 14:38:03.799905
			
			logger("multiauth process object: ");
			_pprint(ma);
			var multi_auth = pddb.FPSMultiuseAuthorization.get_or_null({
				caller_reference: ma.caller_reference
			});
			if (!multi_auth) {
				logger(" NO MULTI AUTH IN CLIENT TO MATCH SERVER ");
				// we shouldn't have to create an auth.
				// #@TODO maybe we should check for database destruction elsewhere...
				// or backup data?
				return null;
			    /* shouldn't have to create ma
	                'timestamp': self.timestamp,
	                'payment_reason': self.payment_reason,
	                'global_amount_limit': self.global_amount_limit,
	                'recipient_slug_list': self.recipient_slug_list,
	                'token_id': self.token_id,
	                'expiry': self.expiry,
	                'status': self.status}
	              */
			}

			var testsc = "SC";
			logger(" about to set status "+testsc+", "+ma.status+", for id="+multi_auth.id);
			pddb.FPSMultiuseAuthorization.set({
				status: ma.status,
				token_id: ma.token_id,
				error_message: ma.error_message
			}, {
				id: multi_auth.id
			});
			
			multi_auth = pddb.FPSMultiuseAuthorization.get_or_null({
				id: multi_auth.id
			});
			
			return multi_auth
		}
	});
	
	var FPSMultiusePay = new Model(db, "FPSMultiusePay", {
		table_name: "fpsmultiusepays",
		columns: {
			_order: ["id", "timestamp", "caller_reference", "marketplace_fixed_fee",
			         "marketplace_variable_fee", "transaction_amount", "recipient_slug",
			         "sender_token_id",
			         "caller_description", "charge_fee_to", "descriptor_policy", "sender_description",
			         "request_id", "transaction_id",
			         "transaction_status", "error_message", "error_code"],
			id: "INTEGER PRIMARY KEY",
			timestamp: "INTEGER", //"DATETIME"
			caller_reference: "VARCHAR", // (128 char)
			marketplace_fixed_fee: "VARCHAR", // (Amount)
			marketplace_variable_fee: "VARCHAR", // (Decimal)
			transaction_amount: "VARCHAR", // (amount)
			recipient_slug: "VARCHAR", 
			sender_token_id: "VARCHAR",  // (multiuse tokenID)
			
			/////// these get populated by server
			caller_description: "VARCHAR",  // (160 chars)
			charge_fee_to: "VARCHAR", // "Recipient" or "Caller"
			descriptor_policy: "VARCHAR",
			//recipient_token_id: "VARCHAR",
			//refund_token_id: "VARCHAR",
			sender_description: "VARCHAR", // (160 chars)
			
			request_id: "VARCHAR",
			transaction_id: "VARCHAR",
			transaction_status: "VARCHAR",
			error_message: "VARCHAR",
			error_code: "VARCHAR"				
		}
	}, {
		// instance methods
		success: function() { return this.transaction_status == FPSMultiuseAuthorization.SUCCESS },
		waiting: function() { return this.transaction_status == FPSMultiuseAuthorization.WAITING},
		refunded: function() { return this.transaction_status == FPSMultiuseAuthorization.REFUNDED },
		cancelled: function() { return this.transaction_status == FPSMultiuseAuthorization.CANCELLED },
		error: function() { return this.transaction_status == FPSMultiuseAuthorization.ERROR },

		deep_dict: function() {
			return {
				id: this.id,
				timestamp: _un_dbify_date(this.timestamp),
				caller_reference: this.caller_reference,
				marketplace_fixed_fee: this.marketplace_fixed_fee,
				marketplace_variable_fee: this.marketplace_variable_fee,
				transaction_amount: this.transaction_amount,
				recipient_slug: this.recipient_slug,
				sender_token_id: this.sender_token_id,
				
				caller_description: this.caller_description,
				charge_fee_to: this.charge_fee_to,
				descriptor_policy: this.descriptor_policy,
				sender_description: this.sender_description,
				
				request_id: this.request_id,
				transaction_id: this.transaction_id,
				transaction_status: this.transaction_status,
				error_message: this.error_message, 
				error_code: this.error_code
			}
		},
		
	}, {
		// class methods
		SUCCESS: 'S',
		WAITING: 'W', // waiting for response from amazon
		REFUNDED: 'R', // the transaction was refunded.... maybe this should be a refund transaction.
		CANCELLED: 'C',
		PENDING: 'P', // reserve request succeed
		RESERVED: 'V',
		FAILURE: 'F', // success
		
		process_object: function(p) {
			// @param p: object from server. json already loaded
			// @return: nothing
		
			// incoming timestampe are from self.timestamp.ctime():
			//              Sat Sep 19 14:42:25 2009
			// the above string can transformed to dates with new Date(ctimestr)
			logger("pay process object: ");
			_pprint(pay);
			
			var pay = pddb.FPSMultiusePay.get_or_null({
				caller_reference: p.caller_reference
				//#@ TODO: use timestamp as id
			});
			if (pay) {
				logger("pay already exists");
				// currently this should not occur
				pddb.FPSMultiusePay.set({
					request_id: p.request_id,
					transaction_status: p.transaction_status,
					error_message: p.error_message,
					error_code: p.error_code,
				}, {
					caller_reference: pay.caller_reference,
				});
				
			} else {
				logger("pay does not exist");
				// currently this should not occur
				return null;
				pddb.FPSMultiusePay.create({
					timestamp: p.timestamp,
					caller_description: p.caller_description,
					caller_reference: p.caller_reference,
					charge_fee_to: p.charge_fee_to,
					descriptor_policy: p.descriptor_policy,
					marketplace_fixed_fee: p.marketplace_fixed_fee,
					marketplace_variable_fee: p.marketplace_variable_fee,
					recipient_token_id: p.recipient_token_id,
					refund_token_id: p.refund_token_id,
					sender_description: p.sender_description,
					sender_token_id: p.sender_token_id,
					transaction_amount: p.transaction_amount,
					
					request_id: p.request_id,
					transaction_status: p.transaction_status,
					error_message: p.error_message,
					error_code: p.error_code,
				});
			}
		}
	});
	
	return {
        _order: ["Site", "SiteGroup",
                 "Recipient", "Category", "RecipientPercent",
                 "Tag", "Visit", "Total", 
                 "PaymentService", "Payment", "RequiresPayment", "PaymentTotalTagging",
				 "TimeType", "ContentType",
				 "Log", "UserStudy",
				 "FPSMultiuseAuthorization", "FPSMultiusePay"],
        
        Site                : Site,
		SiteGroup           : SiteGroup,
		Recipient           : Recipient,
		Category            : Category,
		RecipientPercent    : RecipientPercent,
        Tag                 : Tag,
        Visit               : Visit,
		Total               : Total,
		PaymentService      : PaymentService,
		Payment             : Payment,
		RequiresPayment     : RequiresPayment,
		PaymentTotalTagging : PaymentTotalTagging,
		TimeType            : TimeType,
		ContentType         : ContentType,
		Log                 : Log,
		UserStudy           : UserStudy,
		FPSMultiuseAuthorization : FPSMultiuseAuthorization,
		FPSMultiusePay      : FPSMultiusePay
	};
}


