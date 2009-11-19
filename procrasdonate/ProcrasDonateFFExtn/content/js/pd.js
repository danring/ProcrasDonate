
// PD_API
// * handles interaction with ProcrasDonate.com
var ProcrasDonate_API = function(prefs, pddb) {
	this.prefs = prefs;
	this.pddb = pddb;
	//API.apply(this, arguments);
};

ProcrasDonate_API.prototype = new API();
_extend(ProcrasDonate_API.prototype, {
	/*
	 * 
	 * 
	 */
	
	send_data: function() {
	//#@TODO - send email, tos, weekly_affirmations, org_thank_yous, org_newsletters prefs
	//        always, or triggered by send_data parameter when register_updates processor calls send_data?
		var self = this;
		var models_to_methods = {
			"Total": "_get_totals",
		    "UserStudy": "_get_user_studies",
            "Log": "_get_logs",
            "Payment": "_get_payments",
            "RequiresPayment": "_get_requires_payments"
		};
		
		var data = {
			private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY)
		}
		
		_iterate(models_to_methods, function(key, value, index) {
			var items = self[value]();
			data[self.pddb[key].table_name] = JSON.stringify(items);
		});
		
		var url = constants.PD_API_URL + constants.SEND_DATA_URL;
		logger("pd.js:: send_data: ");
		_pprint(data.totals[0]);
		_pprint(data.totals[0].content);
		this._hello_operator_give_me_procrasdonate(
			url,
			data,
			"POST",
			function(r) { //onsuccess
				logger("pd.js::send_data: server says successfully processed "+r.process_success_count+" items");
			},
			function(r) { //onfailure
				logger("pd.js::send_data: server says receiving data failed because "+r.reason);
			},
			function(r) { //onerror
				logger("pd.js::send_data: communication error");
			}
		);
	},

	/*
	 * 
	 * @requires: KlassName must have a datetime field
	 * 
	 * @param KlassName: eg UserStudy, Payment, Total, Log
	 * @param selectors: eg { datetime__gte: last_time }
	 * @param extract=data: function that takes a row and returns a dictionary representation
	 */
	_get_data: function(KlassName, extract_data, extra_selectors) {
		var last_time = this.prefs.get('time_last_sent_'+KlassName, 0);
		var new_last_time = last_time;
	
		var selectors = _extend({
			datetime__gte: last_time
		}, extra_selectors);
		
		var data = [];
		this.pddb[KlassName].select(selectors, function(row) {
			if (parseInt(row.datetime) > new_last_time) { new_last_time = parseInt(row.datetime) ; }
			data.push(extract_data(row));
		});
		
		return data;
	},
	
	_get_user_studies: function() {
		return this._get_data("UserStudy", function(row) {
			logger(" inside send_user_stuides row="+row+" deepdict="+row.deep_dict());
			return row.deep_dict();
		});
	},
	
	_get_logs: function() {
		return this._get_data("Log", function(row) {
			return row.deep_dict();
		});
	},
	
	_get_payments: function() {
		return this._get_data("Payment", function(row) {
			return row.deep_dict();
		});
	},
	
	_get_requires_payments: function() {
		var data = [];
		this.pddb.RequiresPayment.select({}, function(row) {
			data.push( row.deep_dict() );
		});
		return data;
	},
	
	_get_totals: function() {
		return this._get_data("Total", function(row) {
			return row.deep_dict();
		}, {
			timetype_id: this.pddb.Daily.id
		});
	},

	/*
	 * 
	 * @requires: KlassName must have a datetime field
	 * 
	 * @param KlassName: eg UserStudy, Payment, Total, Log
	 * @param selectors: eg { datetime__gte: last_time }
	 * @param extract=data: function that takes a row and returns a dictionary representation
	 */
	_send_data: function(KlassName, extract_data, extra_selectors) {
		var last_time = this.prefs.get('time_last_sent_'+KlassName, 0);
		var new_last_time = last_time;
	
		var selectors = _extend({
			datetime__gte: last_time
		}, extra_selectors);
		
		var items = [];
		this.pddb[KlassName].select(selectors, function(row) {
			if (parseInt(row.datetime) > new_last_time) { new_last_time = parseInt(row.datetime) ; }
			items.push(extract_data(row));
		});
		
		var data = {
			private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY)
		};
		data[this.pddb[KlassName].table_name] = items;
		
		// serialize into json
		var json_data = JSON.stringify(data);
		
		var url = constants.PD_API_URL + constants.SEND_DATA_URL;
		this._hello_operator_give_me_procrasdonate(
			url,
			{"json_data": json_data}, // must be dictionary, not json string
			"POST",
			function(response) { //onsuccess
				logger("pd.js::_send_data server says successfully processed "+response.process_success_count+" items");
			},
			function(response) { //onfailure
				logger("pd.js::_send_data server says receiving data failed because "+response.reason);
			},
			function(r) { //onerror
				logger("pd.js::_send_data communication error");
			});
			
		this.prefs.set('time_last_sent_'+KlassName, new_last_time);
	},

	send_user_studies: function() {
		this._send_data("UserStudy", function(row) {
			return row.deep_dict();
		});
	},
	
	send_logs: function() {
		this._send_data("Log", function(row) {
			return row.deep_dict();
		});
	},
	
	send_payments: function() {
		this._send_data("Payment", function(row) {
			return row.deep_dict();
		});
	},
	
	send_requires_payments: function() {
		this._send_data("RequiresPayment", function(row) {
			return row.deep_dict();
		});
	},
	
	send_totals: function() {
		var self = this;
		this._send_data("Total", function(row) {
			return row.deep_dict();
		}, {
			timetype_id: self.pddb.Daily.id
		});
	},
	
	authorize_payments: function(onsuccess, onfailure, onerror) {
		var self = this;
		
		var data = {
			private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY),
			globalAmountLimit: this.prefs.get('global_amount_limit', constants.DEFAULT_GLOBAL_AMOUNT_LIMIT),
            creditLimit: this.prefs.get('credit_limit', constants.DEFAULT_CREDIT_LIMIT),
            version: this.prefs.get('fps_version', constants.DEFAULT_FPS_CBUI_VERSION),
            paymentReason: this.prefs.get('payment_reason', constants.DEFAULT_PAYMENT_REASON),
		}
		
		var url = constants.PD_API_URL + constants.AUTHORIZE_PAYMENTS_URL;
		
		this._hello_operator_give_me_procrasdonate(
			url,
			data,
			"POST",
			onsuccess,
			onfailure,
			onerror
		);
	},
	
	send_welcome_email: function() {
		logger("send welcome email: "+this.prefs.get('email', constants.DEFAULT_EMAIL))
		this.make_request(
			constants.PD_API_URL + constants.SEND_WELCOME_EMAIL_URL,
			{
				email_address: this.prefs.get('email', constants.DEFAULT_EMAIL),
				private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY)
			},
			"POST",
			function() {}
		);
	},
	
	send_regular_email: function() {
		
	},
	
    authorize_multiuse: function(onsuccess, onfailure) {
		var multi_auth = this.pddb.FPSMultiuseAuthorization.get_or_create({
			caller_reference: caller_reference
		}, {
			timestamp: _dbify_date(new Date()),
			global_amount_limit: this.prefs.get('fps_global_amount_limit', constants.DEFAULT_GLOBAL_AMOUNT_LIMIT),
			is_recipient_cobranding: _dbify_bool(true),
			payment_method: "ABT,ACH,CC",
			payment_reason: this.prefs.get('fps_payment_reason', constants.DEFAULT_PAYMENT_REASON),
			recipient_slug_list: "all",
			status: this.pddb.FPSMultiuseAuthorization.RESPONSE_NOT_RECEIVED
		});

		multi_auth = multi_auth.deep_dict();
		var data = _extend(multi_auth, {
			private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY),
			version: this.prefs.get('fps_version', constants.DEFAULT_FPS_CBUI_VERSION)
		});

		//this.pddb.orthogonals.info("authorize_multiuse: "+JSON.stringify(multi_auth), "pd.js");
		this._hello_operator_give_me_procrasdonate(
			constants.PD_API_URL + constants.AUTHORIZE_MULTIUSE_URL,
			data,
			"POST",
			onsuccess,
			onfailure
		);
	},
	
	cancel_multiuse_token: function(reason_text, after_success, after_failure) {
		// after_failure should take r as parameter. after_success takes nothing.
		var self = this;
		// find success token
		var multiuse = self.pddb.FPSMultiuseAuthorization.get_latest_success();
		if (!multiuse) {
			// nothing to cancel
			return
		}
		
		this._hello_operator_give_me_procrasdonate(
			constants.PD_API_URL + constants.CANCEL_MULTIUSE_TOKEN_URL,
			{
				token_id: multiuse.token_id,
				reason_text: reason_text,
				private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY),
				version: this.prefs.get('fps_version', constants.DEFAULT_FPS_API_VERSION),
				timestamp: _dbify_date(new Date())
			},
			"POST",
			function(r) {
				self.pddb.orthogonals.log("Successfully cancelled multiuse token", "multiuse token");
				
				// set token to canceleld
				self.pddb.FPSMultiuseAuthorization.set({
					token_id: "",
					status: self.pddb.FPSMultiuseAuthorization.CANCELLED,
				}, {
					id: multiuse.id
				});
				
				if (after_success) after_success();
			},
			function(r) {
				self.pddb.orthogonals.log("Failed to cancel multiuse token: "+r.reason, "multiuse token");
				if (after_failure) after_failure();
			}
		);
	},

	pay_multiuse: function(transaction_amount, recipient_slug, requires_payments, after_success, after_failure) {
		// 1. create payment
		// 2. create FPS Multiuse Pay
		// 3. link payment to all totals
		// 4. set requires payment to pending
		// 5. send FPS Multiuse Pay to server
		var self = this;
		
		transaction_amount = transaction_amount.toFixed(2);
		logger("PAY MULTIUSE recip_slug="+recipient_slug);
		
		var multiauth = this.pddb.FPSMultiuseAuthorization.get_latest_success();
		if (!multiauth || !multiauth.token_id) {
			self.pddb.orthogonals.log("User is not authorized to make payments: "+multiauth, "pay");
			return
		}
		
		var dtime = _dbify_date(new Date());
		
		// create payment
		var pay = self.pddb.Payment.create({
			payment_service_id: self.pddb.AmazonFPS.id,
			transaction_id: -1,
			sent_to_service: _dbify_bool(true),
			settled: _dbify_bool(false),
			total_amount_paid: transaction_amount,
			amount_paid: transaction_amount,
			amount_paid_in_fees: -1,
			amount_paid_tax_deductibly: -1,
			datetime: dtime
		});
		
		// create fps multiuse pay
		var fps_pay = this.pddb.FPSMultiusePay.create({
			timestamp: dtime,
			caller_reference: create_caller_reference(),
			//marketplace_fixed_fee: 0,
			marketplace_variable_fee: 10.00,
			transaction_amount: transaction_amount,
			recipient_slug: recipient_slug,
			sender_token_id: multiauth.token_id,
			transaction_status: self.pddb.FPSMultiuseAuthorization.PENDING,
			payment_id: pay.id
		});
		
		_iterate(requires_payments, function(key, value, index) {
			// set requires payment to pending = true
			var total = value.total();
			self.pddb.PaymentTotalTagging.create({
				total_id: total.id,
				payment_id: pay.id
			});
			// link payment with totals
			self.pddb.RequiresPayment.set({
				pending: _dbify_bool(true),
			}, {
				id: value.id
			});
		});

		// send fps multiuse auth to server
		var data = _extend(fps_pay.deep_dict(), {
			private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY),
			version: this.prefs.get('fps_version', constants.DEFAULT_FPS_API_VERSION),
			timestamp: _dbify_date(new Date())
		});
		
		this._hello_operator_give_me_procrasdonate(
				constants.PD_API_URL + constants.PAY_MULTIUSE_URL,
				data,
				"POST",
				function(r) {
					// process returned pay object
					if (r.pay) {
						self.pddb.FPSMultiusePay.process_object(r.pay);
					}
					if (r.log) {
						self.pddb.orthogonals.log(r.log, "pay");
					} else {
						self.pddb.orthogonals.log("Successfully paid "+transaction_amount, "pay");
					}
					
					if (after_success) after_success();
				},
				function(r) {
					self.pddb.orthogonals.log("Failed to pay "+transaction_amount+": "+r.reason, "pay");
					if (after_failure) after_failure();
				}
			);
	},
	
	make_payments_if_necessary: function(ignore_threshhold) {
		var self = this;
		
		var prevent_payments = self.prefs.get('prevent_payments ', constants.DEFAULT_PREVENT_PAYMENTS);
		if (prevent_payments) {
			self.pddb.orthogonals.log("Aborted because prevent_payments flag is: "+prevent_payments, "make_payments")
			return 
		}
		
		var multiauth = this.pddb.FPSMultiuseAuthorization.get_latest_success();
		if (!multiauth || !multiauth.token_id) {
			self.pddb.orthogonals.log("User is not authorized to make payments: "+multiauth, "pay");
			return
		}
		
		// retry failed payments
		this.pddb.RequiresPayment.select({
			pending: _dbify_bool(true)
		}, function(row) {
			var total = row.total();
			// if total is not weekly, store visit did wrong thing
			if (total.timetype_id != self.pddb.Weekly.id) {
				self.pddb.orthogonals.warn("Total to pay is not weekly: requires_payment: "+row+" total="+total);
				return
			}
			// if total hasn't ended yet, data was corrupted (shouldn't have become pending!)
			if (_un_dbify_date(total.datetime) > new Date()) {
				self.pddb.orthogonals.warn("Total hasn't ended but requires payment is already pending: "+row+" total="+total);
				return
			}
			
			var recipient = total.recipient();
			// if recipient is null, this must be a site group total. ignore
			if (!recipient) {
				return
			}
			
			// if payment failed
			_iterate(total.payments(), function(key, payment, index) {
				var fps = payment.most_recent_fps_multiuse_pay()
				if (fps.error() || fps.failure()) {
					// try again to send fps multiuse auth to server
					var data = _extend(fps.deep_dict(), {
						private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY),
						version: this.prefs.get('fps_version', constants.DEFAULT_FPS_API_VERSION),
						timestamp: _dbify_date(new Date())
					});
					this._hello_operator_give_me_procrasdonate(
						constants.PD_API_URL + constants.PAY_MULTIUSE_URL,
						data,
						"POST",
						function(r) {
							// process returned pay object
							if (r.pay) {
								self.pddb.FPSMultiusePay.process_object(r.pay);
							}
							if (r.log) {
								self.pddb.orthogonals.log(r.log, "pay");
							} else {
								self.pddb.orthogonals.log("Successfully paid "+transaction_amount, "pay");
							}
						},
						function(r) {
							self.pddb.orthogonals.log("Failed to pay "+transaction_amount+": "+r.reason, "pay");
						}
					);
				} else if (fps.pending() || fps.refund_initiated()) {
					// still waiting. do nothing.
				} else {
					// unexpected fps state
					self.pddb.orthogonals.warn("Unexpected FPS state when determining whether to retry pending requires payment: "+row+" total="+total+" payment="+payment+" fps="+fps);
				}
			});
		});
		
		// { recipient_slug: total_amount, ...}
		var recipient_total_amounts = {};
		
		//// we need these to prevent race conditions later when we
		//// set requires payments to pending and match totals to payment.
		//// just in case more totals and requires payments are created
		//// in middle of computation....unlikely, but just in case......
		// { recipient_slug: [requires_payment, ...] , ...}
		var recipient_requires_payments = {};
		
		this.pddb.RequiresPayment.select({
			pending: _dbify_bool(false)
		}, function(row) {
			var total = row.total();
			// if total is not weekly, store visit did wrong thing
			if (total.timetype_id != self.pddb.Weekly.id) {
				self.pddb.orthogonals.warn("Total to pay is not weekly: requires_payment: "+row+" total="+total);
				return
			}
			// if total hasn't ended yet, ignore
			if (_un_dbify_date(total.datetime) > new Date()) {
				return
			}
			
			var recipient = total.recipient();
			// if recipient is null, this must be a site group total. ignore
			if (!recipient) {
				return
			}
			
			// in dollars
			var amount = parseFloat(total.total_amount) / 100.00;
			
			var x = recipient_total_amounts[recipient.slug];
			if (!x) { recipient_total_amounts[recipient.slug] = 0; }
			recipient_total_amounts[recipient.slug] += amount;
			
			var x = recipient_requires_payments[recipient.slug];
			if (!x) { recipient_requires_payments[recipient.slug] = []; }
			recipient_requires_payments[recipient.slug].push(row);
		});
		
		var threshhold = self.prefs.get('payment_threshhold ', constants.DEFAULT_PAYMENT_THRESHHOLD);
		logger("threshhold="+threshhold+" ignore="+ignore_threshhold);
		_iterate(recipient_total_amounts, function(key, value, index) {
			logger(index+".\n key="+key+" \n value="+value);
			if (key && (ignore_threshhold || value >= threshhold)) {
				self.pay_multiuse(
					value,
					key,
					recipient_requires_payments[key],
					function() {
						// after success
					}, function() {
						// after_failure
					});
			}
		});
	},
	
	request_data_updates: function(after_success, after_failure) {
		// after_success should take two parameters:
		//    recipients: array of recipient rows added (new since time)
		//    multi_auths: array of multi_auths (all)
		var self = this;
		var new_since = new Date();
		this._hello_operator_give_me_procrasdonate(
			constants.PD_API_URL + constants.RECEIVE_DATA_URL,
			{
				since: 0, // self.prefs.get('since_received_data', 0);
				private_key: this.prefs.get('private_key', constants.DEFAULT_PRIVATE_KEY),
			}, //#@TODO store time in prefs
			"GET",
			function(r) {
				self.pddb.orthogonals.log("Successfully received data", "dataflow");
				
				var recipients = [];
				var multi_auths = [];
				
				_iterate(r.multiuse_auths, function(key, value, index) {
					self.pddb.FPSMultiuseAuthorization.process_object(value);
				});
				_iterate(r.multiuse_pays, function(key, value, index) {
					self.pddb.FPSMultiusePay.process_object(value);
				});
				_iterate(r.recipients, function(key, value, index) {
					self.pddb.Recipient.process_object(value);
				});
				self.prefs.set('since_received_data', _dbify_date(new_since));
				self.pddb.orthogonals.log("Done: "+_dbify_date(new_since), "dataflow");
				
				if (after_success) {
					after_success(recipients, multi_auths);
				}
			},
			function(r) {
				self.pddb.orthogonals.log("Failed to received data: "+r.reason, "dataflow");
				if (after_failure) after_failure();
			}
		);
	},

	/*
	 * Posts data to ProcrasDonate server
	 * @param url: url to post to 
	 * @param data: data structure. will not be JSON.stringify-ied
	 * @param onload: function to execute on success
	 * @param onerror: function to execute on error
	 */
	_hello_operator_give_me_procrasdonate: function(url, data, method, onsuccess, onfailure, onerror) {
		// make request
		this.make_request(
			url,
			data,
			method,
			function(r) {
				try {
					var response = eval("("+r.responseText+")");
					
					if (response.result == "success") {
						if (onsuccess) {
							onsuccess(response);
						}
					} else {
						if (onfailure) {
							onfailure(response);
						}
					}
				} catch (e) {
					logger("EXCEPTION: pd.js::RETURNED: "+r+"  "+e.stack);
				}
			},
			onerror
		);
	},
	
});
