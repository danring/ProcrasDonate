

function load_models(db) {
	
	var Site = new Model(db, "Site", {
		// Model metadata
		table_name: "sites",
		columns: {
			_order: ["id", "sitegroup_id", "url"],
			id: "INTEGER PRIMARY KEY",
			sitegroup_id: "INTEGER",
			url: "VARCHAR"
		},
		indexes: []
	}, {
		// Instance methods
		tag : function() {
			var sitegroup = SiteGroup.get_or_null({ 'id': this.sitegroup_id });
			if (!sitegroup) {
				//SiteGroup.create({  })
			}
			var tag = Tag.get_or_null({ tag_id: sitegroup.tag_id })
			if (!tag) {
			}
			return tag
		},
		
	}, {
		// Model-class methods
		
	});
	
	var SiteGroup = new Model(db, "SiteGroup", {
		table_name: "sitegroups",
		columns: {
			_order: ["id", "name", "host", "url_re", "tag_id"],
			id: "INTEGER PRIMARY KEY",
			name: "VARCHAR",
			host: "VARCHAR",
			url_re: "VARCHAR",
			tag_id: "INTEGER"
		},
		indexes: []
	});
	
	var Recipient = new Model(db, "Recipient", {
		table_name: "recipients",
		columns: {
			_order: ["id", "name", "mission", "description", "twitter_name", "url", "email", "category_id", "is_visible"],
			id: "INTEGER PRIMARY KEY",
			name: "VARCHAR",
			twitter_name: "VARCHAR",
			mission: "VARCHAR",
			description: "VARCHAR",
			url: "VARCHAR",
			email: "VARCHAR",
			category_id: "INTEGER",
			is_visible: "INTEGER" // boolean 0=false
		},
		indexes: []
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
	});
	
	var RecipientPercent = new Model(db, "RecipientPercent", {
		table_name: "recipientpercents",
		columns: {
			_order: ["id", "recipient_id", "percent"],
			id: "INTEGER PRIMARY KEY",
			recipient_id: "INTEGER",
			percent: "REAL"
		},
		indexes: []
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
	});
	
	// Aggregates visits in different ways
	// Crosses different model slices (tags, recipients, sites, sitegroups)
	// with different time spans (daily, weekly, forever)
	var Total = new Model(db, "Total", {
		table_name: "totals",
		columns: {
			_order: ["id","contenttype_id", "content_id", "total_time", 
			         "total_amount", "time", "timetype_id"],
			         
			id: "INTEGER PRIMARY KEY",

			// generic table
			contenttype_id: "INTEGER",
			// id of row in generic table
			content_id: "INTEGER",
			
			total_time: "INTEGER", //seconds
			total_amount: "REAL", //cents
			time: "INTEGER", //"DATETIME"
			timetype_id: "INTEGER"
		}
	});
	
	// if balance can only partially cover payment, 
	// then two payments will be created for total.
	// one will be paid, one will be unpaid (initially)
	var Payment = new Model(db, "Payment", {
		table_name: "payments",
		columns: {
			_order: ["id", "total_id",
			         "tipjoy_transaction_id", "is_pledge"],
			id: "INTEGER PRIMARY KEY",
			total_id: "INTEGER",
			tipjoy_transaction_id: "INTEGER", // null if no payable
			is_pledge: "INTEGER" // use True or False definitions in utils
		}
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
	});
	
	var ContentType = new Model(db, "ContentType", {
		table_name: "contenttypes",
		columns: {
			_order: ["id", "modelname"],
			id: "INTEGER PRIMARY KEY",
			modelname: "VARCHAR"
		}
	});
	
	return {
        _order: ["Site", "SiteGroup",
                 "Recipient", "Category", "RecipientPercent",
                 "Tag", //"SiteGroupTagging",
				 "Visit",
				 "Total", "Payment", "TimeType", "ContentType"],
        
        Site: Site,
		SiteGroup: SiteGroup,
		
		Recipient: Recipient,
		Category: Category,
		RecipientPercent: RecipientPercent,
		
        Tag: Tag,
        //SiteGroupTagging: SiteGroupTagging,
		
        Visit: Visit,
        
		Total: Total,
		Payment: Payment,
		TimeType: TimeType,
		ContentType: ContentType
		
	};
}


