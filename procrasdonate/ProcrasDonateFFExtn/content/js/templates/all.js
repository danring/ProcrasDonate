
    Template.compile(["<form name='account_form' onSubmit='return false'>\n\t\n\t<h3>Please sign in using your Twitter account:</h3>\n\t\n\t<table>\n\t\t<tbody>\n\t\t\t<!--\n\t\t\t<tr>\n\t\t\t\t<td><label class='form-right'>Twitter username </label></td>\n\t\t\t\t<td><input class='form-left' type='text' name='twitter_username' value='", ["var", ["twitter_username"], []], "'></td>\n\t\t\t\t<td class='form-left'>\n\t\t\t\t\t\tClick <a href='https://twitter.com/signup'>HERE</a> if you're not on twitter yet.\n\t\t\t\t\t\t<span id='what_is_twitter' class='link'>What is Twitter?</span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t\n\t\t\t<tr>\n\t\t\t\t<td><label class='form-right'>Twitter password</label></td>\n\t\t\t\t<td><input class='press_enter_for_next form-left' type='password' name='twitter_password' value='", ["var", ["twitter_password"], []], "'></td>\n\t\t\t\t<td class='help form-left'>\n\t\t\t\t\t\tYour Twitter password is only revealed to \n\t\t\t\t\t\t<a href=\"http://TipJoy.com\">TipJoy</a> for handling micro-payments:\n\t\t\t\t\t\t<a href='", ["var", ["constants", "HOME_URL"], []], "'>Privacy Guarantee</a>\n\t\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t-->\n\t\t\t<tr>\n\t\t\t\t<td><label class='form-right'>Email</label></td>\n\t\t\t\t<td><input class='press_enter_for_next form-left' type='text' name='email' value='", ["var", ["email"], []], "'></td>\n\t\t\t\t<td class='help form-left'>\n\t\t\t\t\t\tWe'll send you weekly summaries of your\n\t\t\t\t\t\tProcrasDonation and TimeWellSpent activities.\n\t\t\t\t</td>\n\t\t\t\t<td><input class='right' type='checkbox' name='recip_newsletters' value='agree' \n\t\t\t\t\t", ["if", [[false, ["var", ["recip_newsletters"], []]]], 1, ["checked "], []], "/></td>\n\t\t\t\t<td><label class='left'>I want to receive occaisional\n\t\t\t\t\tthank you emails and a year-end summary email from charities I donate to.</label></td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr>\n\t\t\t\t<td><input class='right' type='checkbox' name='tos' value='agree' \n\t\t\t\t\t", ["if", [[false, ["var", ["tos"], []]]], 1, ["checked "], []], "/></td>\n\t\t\t\t<td><label class='left'>I agree to the Terms of Use</label></td>\n\t\t\t</tr>\t\t\n\t\t</tbody>\n\t</table>\n\t\n\t<h2><a name='tos'></a>Terms of Use</h2>\n\t<img src='", ["var", ["constants", "MEDIA_URL"], []], "img/TermsOfUse.png' class='small-image'>\n\t<p>By using our service you agree to the following:\n\t\t<ul class='paragraph_list'>\n\t\t\t<li>ProcrasDonate may update these terms of service without warning or notification.\n\t\t\t<li>You understand how our service works and are willingly participating.\n\t\t\t<li>You agree to pay all pledges made on your behalf in full.\n\t\t\t<li>A percentage that you determine of your donations is donated to our service.\n\t\t\t<li>You are responsible for any content you add to this site.\n\t\t\t<li>Illegal, unfriendly, or otherwise problematic content will be removed.\n\t\t\t<li>Your individual records and settings are private and not accessible by our company.\n\t\t\t<li>Your summary records are used for community statistics and other as yet undetermined uses (hopefully that will support the service financially).\n\t\t\t<li>All rights are reserved including ProcrasDonate intellectual property of software and our business model.\n\t\t\t</li><li><b>Thanks for ProcrasDonating!</b>\n\t\t</ul>\n\t</p>\n\t\n</form>\n"], "account_middle");
    
    Template.compile(["<form action=\"", ["var", ["action_url"], []], "\" method=\"get\">\n\t<input\n\t\ttype=\"image\"\n\t\tsrc=\"https://authorize.payments.amazon.com/pba/images/SMSubscribeWithOutLogo.png\"\n\t/>\n\t", ["for", ["pair"], ["var", ["parameter_pairs"], []], false, ["\n\t\t<input\n\t\t\ttype=\"hidden\"\n\t\t\tname=\"", ["var", ["pair", "name"], []], "\"\n\t\t\tvalue=\"", ["var", ["pair", "value"], []], "\"\n\t\t/>\n\t"]], "\n\t\n\t", ["var", ["hack_html"], []], "\n</form>\n"], "authorize_payments");
    
    Template.compile(["clickable substate menu:\n\n<ul>\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li id=\"", ["var", ["item", "id"], []], "\"\n\t\t\tclass=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t", ["var", ["item", "value"], []], "</li>\n\t"]], "\n</ul>\n"], "clickable_substate_menu");
    
    Template.compile(["<h3 class='RegisterHeader'>Donations and Goals (can be changed later)</h3>\n\t\n<form id=\"donation_form\" name=\"donation_form\" onSubmit=\"return false\">\n\t<p>How many <b>pennies per hour</b> will you donate?</p>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr><td colspan=\"2\">\t\t\n\t\t\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/ProcrasDonateIcon.png\" class=\"icon-image\">\t\t\n\t\t\t\t\twhen <i>ProcrasDonating</i>\n\t\t\t\t</td></tr>\n\t\t\t<tr>\n\t\t\t\t<td><input class='form-right form-value' type='text' size='4' name='pd_dollars_per_hr' value='", ["var", ["pd_dollars_per_hr"], []], "'></td>\n\t\t\t\t<td><div class='help form-left form-label'>$ per hour</div></td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr><td colspan=\"2\">\n\t\t\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/TimeWellSpentIcon.png\" class=\"icon-image\">\t\t\n\t\t\t\t\ton <i>TimeWellSpent</i>\n\t\t\t\t</td></tr>\n\t\t\t<tr>\n\t\t\t\t<td><input class='form-right form-value' type='text' size='4' name='tws_dollars_per_hr' value='", ["var", ["tws_dollars_per_hr"], []], "'></td>\n\t\t\t\t<td><div class='help form-left form-label'>$ per hour</div></td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n\t<p>What are your online time management <b>goals</b>?</p>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr><td colspan=\"2\">\n\t\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/ProcrasDonateIcon.png\" class=\"icon-image\">\t\t\n\t\t\t\t\tfor <i>ProcrasDonating</i>\n\t\t\t\t</td></tr>\n\t\t\t<tr>\n\t\t\t\t<td><input class='form-right form-value' id='pd_hr_per_week_goal' type='text' size='4' \n\t\t\t\t\t\tname='pd_hr_per_week_goal' value='", ["var", ["pd_hr_per_week_goal"], []], "'></td>\n\t\t\t\t<td>\n\t\t\t\t\t<div class='help form-left form-label'>hours per week</div>\n\t\t\t\t\t<span id='dollars_per_week_goal'></span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr><td colspan=\"2\">\n\t\t\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/TimeWellSpentIcon.png\" class=\"icon-image\">\t\t\n\t\t\t\t\tfor <i>TimeWellSpent</i>\n\t\t\t\t</td></tr>\n\t\t\t<tr>\n\t\t\t\t<td><input class='form-right form-value' id='tws_hr_per_week_goal' type='text' size='4' name='tws_hr_per_week_goal' value='", ["var", ["tws_hr_per_week_goal"], []], "'></td>\n\t\t\t\t<td>\n\t\t\t\t\t<div class='help form-left form-label'>hours per week</div>\n\t\t\t\t\t<span id='dollars_per_week_goal'></span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\t\t\t\n\t<p>What is your weekly <b>limit</b>, beyond which no pledges will be made?</p>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr><td colspan=\"2\">\n\t\t\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/ProcrasDonateIcon.png\" class=\"icon-image\">\t\t\n\t\t\t\t\tof <i>ProcrasDonation</i>\n\t\t\t\t</td></tr>\n\t\t\t<tr>\n\t\t\t\t<td><input class='press_enter_for_next form-right form-value' id='pd_hr_per_week_max' type='text' size='4' name='pd_hr_per_week_max' value='", ["var", ["pd_hr_per_week_max"], []], "'></td>\n\t\t\t\t<td><div class='help form-left form-label'>hours per week</div></td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr><td colspan=\"2\">\n\t\t\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/TimeWellSpentIcon.png\" class=\"icon-image\">\t\t\n\t\t\t\t\tof <i>TimeWellSpent</i>\n\t\t\t\t</td></tr>\n\t\t\t<tr>\n\t\t\t\t<td><input class='press_enter_for_next form-right form-value' id='tws_hr_per_week_max' type='text' size='4' name='tws_hr_per_week_max' value='", ["var", ["tws_hr_per_week_max"], []], "'></td>\n\t\t\t\t<td><div class='help form-left form-label'>hours per week</div></td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</form>\n"], "donation_amounts_middle");
    
    Template.compile(["<h1>My Impact</h1>\n\n<h2>Donations and Pledges</h2>\n\n<ul id=\"impact_submenu\">\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li id=\"", ["var", ["item", "id"], []], "\"\n\t\t\tclass=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t", ["var", ["item", "value"], []], "</li>\n\t"]], "\n</ul>\n\n<table id=\"impact_table\" cellspacing=\"0\">\n<thead>\n\t<tr>\n\t\t", ["for", ["header"], ["var", ["table_headers"], []], false, ["\n\t\t\t<th>", ["var", ["header"], []], "</th>\n\t\t"]], "\n\t</tr>\n</thead>\n<tbody>\n\t", ["for", ["row"], ["var", ["table_rows"], []], false, ["\n\t<tr class=\"", ["if", [[false, ["var", ["forloop", "is_odd"], []]]], 1, ["odd"], ["even"]], "\">\n\t\t", ["for", ["cell"], ["var", ["row"], []], false, ["\n\t\t\t<td>", ["var", ["cell"], []], "</td>\n\t\t"]], "\n\t</tr>\n\t"]], "\n</tbody>\n</table>\n"], "impact_middle");
    
    Template.compile(["<div class=\"site\">\n\t", ["var", ["inner"], []], "\n</div>\n\n"], "make_site_box");
    
    Template.compile(["<ul>\n\t", ["for", ["action"], ["var", ["actions"], []], false, ["\n\t\t<li class=\"link\" id=\"", ["var", ["action"], []], "\">", ["var", ["action"], []], "</li>\n\t"]], "\n</ul>\n"], "manual_test_suite");
    
    Template.compile(["messages all middle\n\n<ul>\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li id=\"", ["var", ["item", "id"], []], "\"\n\t\t\tclass=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t", ["var", ["item", "value"], []], "</li>\n\t"]], "\n</ul>\n"], "messages_all_middle");
    
    Template.compile(["<table id=\"register_next_prev\">\n<tbody>\n\t<tr>\n\t\t<td>\n\t\t\t<img\n\t\t\t\tsrc=\"", ["var", ["constants", "MEDIA_URL"], []], "img/BackArrow.png\"\n\t\t\t\tid=\"prev_register_track\"\n\t\t\t\tclass=\"register_button img_link\"\n\t\t\t\t/>\n\t\t</td>\n\t\t<td>\n\t\t\t<span class=\"NextPrevSpacer\"></span>\n\t\t</td>\n\t\t<td>\n\t\t\t<img\n\t\t\t\t", ["if", [[false, ["var", ["is_done"], []]]], 1, ["\n\t\t\t\tsrc=\"", ["var", ["constants", "MEDIA_URL"], []], "img/DoneButton.png\"\n\t\t\t\t"], ["\n\t\t\t\tsrc=\"", ["var", ["constants", "MEDIA_URL"], []], "img/NextArrow.png\"\n\t\t\t\t"]], "\n\t\t\t\tid=\"next_register_track\"\n\t\t\t\tclass=\"register_button img_link\"\n\t\t\t\t/>\n\t\t\t</td>\n\t\t</tr>\n\t</tbody>\n</table>\t\t\t\t"], "next_prev_buttons");
    
    Template.compile(["<h3 class='RegisterHeader'>Almost Done!</h3>\n\n<!--<p>You are now <b>ready</b> to use ProcrasDonate to make <i>pledges</i>!</p> -->\n\n<p id=\"message_here\" class=\"message\">You are <b>one step</b> away from completing registration. \nUse your Amazon account to <i>Authorize</i> ProcrasDonate to <b>turn your pledges\ninto donations</b>.</p>\n\n<p id=\"auth_a_here\"></p>\n<p>(#@TODO fill me in: Money is only transferred once you have accumulated $22 in pledges. You will receive emails about \nall transactions, as well as view reports on our website. You can cancel and refund payments \nat any time. You will be redirected back here when you are done.)</p>\n\n<p id=\"balance_here\"></p>\n\n<p id=\"cancel_here\"></p>\n\n<p id=\"edit_here\"></p>\n"], "payment_system_middle");
    
    Template.compile([["var", ["inner"], []], "\n<span class='img_link move_to_unsorted'>\n\t<img class='Move_Site_Arrow' src='", ["var", ["constants", "MEDIA_URL"], []], "img/RightArrow.png'>\n</span>\n"], "procrasdonate_wrap");
    
    Template.compile(["<table id=\"progress_explanation\" style=\"width: ", ["var", ["width"], []], "px; margin: auto;\">\n<tbody>\n\t<tr>\n\t\t<td>This week so far:<br />", ["var", ["pd_this_week_hrs"], []], " hours</td>\n\t\t<td>Last week:<br />", ["var", ["pd_last_week_hrs"], []], " hours</td>\n\t\t<td>All time average:<br />", ["var", ["pd_total_hrs"], []], " hours</td>\n\t</tr>\n\t<tr>\n\t\t<td><img class=\"laptop\" src=\"", ["var", ["this_week_laptop"], []], "\" /></td>\n\t\t<td><img class=\"laptop\" src=\"", ["var", ["last_week_laptop"], []], "\" /></td>\n\t\t<td><img class=\"laptop\" src=\"", ["var", ["total_laptop"], []], "\" /></td>\n\t</tr>\n</tbody>\n</table>\n"], "progress_explanation_snippet");
    
    Template.compile(["<h2>My Progress</h2>\n\n<h3>ProcrasDonation Comparison</h3>\n\n<p>Hours that I ProcrasDonated</p>\n\n", "\n<div id=\"gauges\"></div>\n\n"], "progress_overview_middle");
    
    Template.compile(["<div class='recipient recipient_to_add'>\n\t<!-- id class needed for js -->\n\t<div class=\"recipient_id hidden\">", ["var", ["recipient", "id"], []], "</div>\n\t<div class='add_recipient' title=\"Add recipient to list\"> \n\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/AddRecipient.png\" class=\"recipient-image img_link\">\t\t\n\t </div>\n\t <div class='name'>\n\t\t", ["if", [[false, ["var", ["deep_recip_pct", "recipient", "is_pd_registered"], []]]], 1, ["\n\t\t\t<a href='", ["var", ["constants", "RECIPIENTS_URL"], []], ["var", ["deep_recip_pct", "recipient", "slug"], []], "'>\n\t\t"], []], "\n\t\t\t", ["var", ["recipient", "name"], []], "\n\t\t", ["if", [[false, ["var", ["deep_recip_pct", "recipient", "is_pd_registered"], []]]], 1, ["\n\t\t\t</a>\n\t\t"], []], "\n\t  </div>\n\t<div class=\"category\">", ["var", ["recipient", "category", "category"], []], "</div>\n\t<div class='mission'>", ["var", ["recipient", "mission"], []], "\n\t\t<span class='link description_toggle'>(less)</span>\n\t</div>\n\t<div class='description'><p>", ["var", ["recipient", "description"], []], "</p></div>\n\n</div>\n"], "recipient_snippet");
    
    Template.compile(["<div class='recipient'>\n\t<!-- id class needed for js -->\n\t<div class=\"recipient_id hidden\">", ["var", ["deep_recip_pct", "recipient", "id"], []], "</div>\t\n\n\t<div class='remove_recipient' title=\"Remove recipient from list\">\n\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/Remove.png\" class=\"recipient-image img_link\">\t\t\n\t</div>\n\t<div class='recipient_percent form-input'>\n\t\t<input\n\t\t\ttype=\"text\"\n\t\t\tname=\"percent\"\n\t\t\tid=\"recipient_", ["var", ["deep_recip_pct", "recipient", "id"], []], "\"\n\t\t\tsize='4'\n\t\t\tvalue=\"", ["var", ["deep_recip_pct", "display_percent"], []], "\" />\n\t\t<div class='percent_symbol'>%</div>\n\t</div>\n\t<div class='name'>\n\t\t", ["if", [[false, ["var", ["deep_recip_pct", "recipient", "is_pd_registered"], []]]], 1, ["\n\t\t\t<a href='", ["var", ["constants", "RECIPIENTS_URL"], []], ["var", ["deep_recip_pct", "recipient", "slug"], []], "'>\n\t\t"], []], "\n\t\t\t", ["var", ["deep_recip_pct", "recipient", "name"], []], "\n\t\t", ["if", [[false, ["var", ["deep_recip_pct", "recipient", "is_pd_registered"], []]]], 1, ["\n\t\t\t</a>\n\t\t"], []], "\n\t</div>\n\n\t<div class=\"category\">", ["var", ["deep_recip_pct", "recipient", "category", "category"], []], "</div>\n\t<div class='mission'>\n\t\t", ["var", ["deep_recip_pct", "recipient", "mission"], []], "\n\t\t<span class='link description_toggle'>(less)</span>\n\t</div>\n\t<div class='description'>\n\t\t", ["var", ["deep_recip_pct", "recipient", "html_description"], []], "\n\t</div>\n</div>\n"], "recipient_with_percent_snippet");
    
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Charitable recipients</h1>\n<p>You can use your ProcrasDonation incentive to help several \n\tcharities or focus on supporting just one.  Simply find, select, \n\tand then adjust the percentage of your support that each charity \n\treceives.</p>\n\n<h2>Selected charities:</h2>\n\n<div id=\"chosen_charities\">\n\t", ["for", ["deep_recip_pct_html"], ["var", ["chosen_charities"], []], false, ["\n\t\t", ["var", ["deep_recip_pct_html"], []], "\n\t"]], "\n</div>\n\n<h2>Find other charities:</h2>\n\n", ["nop"], "\n\n<div id=\"not_chosen_charities\">\n\t", ["for", ["recipient_html"], ["var", ["not_chosen_charities"], []], false, ["\n\t\t", ["var", ["recipient_html"], []], "\n\t"]], "\n</div>\n\n<h2>Invite new charities:</h2>\n<p>If a non-profit charity is not listed then you can invite \n\tthem to join by entering their name below.\n\t<br>You can even make pledges to the charities you've invited. \n\tWhen they create a free account then your pledges will eligible to \n\tbecome donations.\n</p>\n\t\t\n<p>\n\t<label>Name of unlisted charity to invite:</label>\n\t<input id=\"new_recipient_name\" type=\"text\" size=\"30\" />\n\n\t<input\n\t\tid=\"new_recipient_submit\"\n\t\ttype=\"image\"\n\t\tsrc=\"", ["var", ["constants", "MEDIA_URL"], []], "img/AddRecipient.png\"\n\t\tvalue=\"add new recipient\"/>\n</p>\n\n", ["nop"], "\n"], "register_charities_middle");
    
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Voluntarily pay for online content</h1>\n\n<p>You can also use hourly time tracking to pledge directly to websites you \n\tconsider worthwhile. \n\t<br>Together we can keep quality content available for everyone.  \n</p>\n\n<h2>TimeWellSpent payments</h2>\n<p>How much would you like to pay for every hour you spend using websites\n\tyou mark as TimeWellSpent? \n\t(This will not change your ProcrasDonation incentive.)</p>\n<p><input\n\ttype=\"text\"\n\tid=\"tws_dollars_per_hr\"\n\tname=\"tws_dollars_per_hr\" \n\tvalue=\"", ["var", ["tws_dollars_per_hr"], []], "\" />\n   <span class=\"units\">dollars per hour</span></p>\n\n<h2>TimeWellSpent Limit</h2>\n<p>What is your weekly limit, beyond which no TimeWellSpent pledges will be \n\tmade?  (This will not change your ProcrasDonation limit.)</p>\n<p><input\n\ttype=\"text\"\n\tid=\"tws_hr_per_week_max\"\n\tname=\"tws_hr_per_week_max\" \n\tvalue=\"", ["var", ["tws_hr_per_week_max"], []], "\" />\n   <span class=\"units\">hours per week</span></p>\n"], "register_content_middle");
    
    Template.compile(["<h2>Registration Success!</h2>\n\n<p>Use <a href=\"", ["var", ["constants", "SETTINGS_URL"], []], "\">My Settings</a> from the menu to the left to modify your settings.</p>\n"], "register_done_middle");
    
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Customize your charitable incentive</h1>\n\n<h2>Goal: \n\t<span class=\"subheader\">What is your ProcrasDonation goal? </span></h2>\n<p id=\"goal_error\" class=\"error\"></p>\n<p>We all like to procrastinate a little bit.  \n\t<br>So how many hours per week of noodling around online would you like to strive for?</p>\n<p><input\n\ttype=\"text\"\n\tid=\"pd_hr_per_week_goal\"\n\tname=\"pd_hr_per_week_goal\" \n\tvalue=\"", ["var", ["pd_hr_per_week_goal"], []], "\" />\n   <span class=\"units\">hours per week</span></p>\n\n<h2>Incentive: \n\t<span class=\"subheader\">What is your time worth? </span></h2>\n<p id=\"rate_error\" class=\"error\"></p>\n<p>Create an incentive for good time management \n\tby making a pledge to your favorite charities.  \n\t<br>This is a pledge to \n\tautomatically donate for every hour you spend ProcrasDonating online.\n</p>\n<p><input\n\ttype=\"text\"\n\tid=\"pd_dollars_per_hr\"\n\tname=\"pd_dollars_per_hr\" \n\tvalue=\"", ["var", ["pd_dollars_per_hr"], []], "\" />\n   <span class=\"units\">dollars per hour</span></p>\n\n<h2>ProcrasDonation Limit: \n\t<span class=\"subheader\">What is your weekly limit? </span></h2>\n<p id=\"max_error\" class=\"error\"></p>\n<p>What is the most number hours in a week that you want to keep track of?  \n\t<br>No further pledges can be made in a week where you have \n\talready reached your limit.</p>\n<p><input\n\ttype=\"text\"\n\tid=\"pd_hr_per_week_max\"\n\tname=\"pd_hr_per_week_max\" \n\tvalue=\"", ["var", ["pd_hr_per_week_max"], []], "\" />\n   <span class=\"units\">hours per week</span></p>\n"], "register_incentive_middle");
    
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Approving payments</h1>\n<p>Your final step is to approve payments on your existing Amazon.com \n\taccount.  \n</p>\n<p>Payments to registered 501c3 non-profits will be fully tax deductible.\n\t<br>Payments will be fully refundable up to 30 days after they are made.\n\t<br>No one else will be able to make payments on your behalf. </p>\n<p>Click on ''Go to Amazon to approve payments'' when you are ready.</p>\n\n<h2>Determining an overall limit</h2>\n<p>How often do you want to have to re-authorize payments for your account?</p>\n<p><input\n\ttype=\"text\"\n\tid=\"a\"\n\tname=\"a\" \n\tvalue=\"", ["var", ["a"], []], "\" />\n   </p>\n\n<p>Amazon will authorize you for an overall payment limit of  \n\t$<span id=\"limit_in_dollars\">", ["var", ["limit_in_dollars"], []], "</span>\n\tbased on your weekly payment limits and the number of months between\n\treauthorizations.  \n\tRemember, you can change how often you want to make payments or go\n\tback to adjust your weekly limits.\n</p>\n"], "register_payments_middle");
    
    Template.compile(["<div id=\"register_track\">\n", "\n\t<ul>\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li class=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t<img src=\"", ["var", ["item", "img"], []], "\" />\n\t\t</li>\n\t\t<li class=\"bar\">\n\t\t\t", ["if", [[true, ["var", ["forloop", "last"], []]]], 1, ["\n\t\t\t\t<img src=\"", ["var", ["item", "bar"], []], "\" />\n\t\t\t"], []], "\n\t\t</li>\n\t"]], "\n\t</ul>\n\t\n", "\n\t<ul class=\"menu_text\">\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li class=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t", ["if", [[false, ["var", ["item", "url"], []]]], 1, ["<a href=\"", ["var", ["item", "url"], []], "\">"], []], "\n\t\t\t\t", ["var", ["item", "value"], []], "\n\t\t\t", ["if", [[false, ["var", ["item", "url"], []]]], 1, ["</a>"], []], "\n\t\t</li>\n\t"]], "\n\t</ul>\n</div>\n\n", ["if", [[false, ["var", ["substate_menu_items", "prev"], []]]], 1, ["\n\t", ["if", [[false, ["var", ["substate_menu_items", "prev", "url"], []]]], 1, ["<a href=\"", ["var", ["substate_menu_items", "prev", "url"], []], "\">"], []], "\n\t\t<img\n\t\t  id=\"", ["var", ["substate_menu_items", "prev", "id"], []], "\"\n\t\t  class=\"prev\"\n\t\t  src=\"/procrasdonate_media/img/BackArrow.png\" />\n  ", ["if", [[false, ["var", ["substate_menu_items", "prev", "url"], []]]], 1, ["</a>"], []], "\n"], ["\n<img\n  id=\"\"\n  class=\"prev\"\n  src=\"/procrasdonate_media/img/Spacer.png\" />\n"]], "\n\n", ["if", [[false, ["var", ["substate_menu_items", "next"], []]]], 1, ["\n\t", ["ifequal", ["var", ["substate_menu_items", "next", "value"], []], ["var", "XXX", []], ["\n\t\t<img\n\t\t  id=\"", ["var", ["substate_menu_items", "next", "id"], []], "\"\n\t\t  class=\"done\"\n\t\t  src=\"/procrasdonate_media/img/DoneButton.png\" />\n\t"], ["\n\t\t", ["if", [[false, ["var", ["substate_menu_items", "next", "url"], []]]], 1, ["<a href=\"", ["var", ["substate_menu_items", "next", "url"], []], "\">"], []], "\n\t\t\t<img\n\t\t\t  id=\"", ["var", ["substate_menu_items", "next", "id"], []], "\"\n\t\t\t  class=\"next\"\n\t\t\t  src=\"/procrasdonate_media/img/NextArrow.png\" />\n\t\t", ["if", [[false, ["var", ["substate_menu_items", "next", "url"], []]]], 1, ["</a>"], []], "\n\t"]], "\n"], ["\n<img\n  id=\"\"\n  class=\"next\"\n  src=\"/procrasdonate_media/img/Spacer.png\" />\n"]], "\n\n"], "register_submenu");
    
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Supporting our service</h1>\n<p>What are you willing to pay to subscribe to this service?  \n\t<br>We're making improvements all the time and we do have bills to pay.\n</p>\n<p>\tYour support makes it all possible!</p>\n\n<h2>Monthly membership fee:</h2>\n<p>Voluntary membership fees are charged to your account each month.</p>\n<p><input\n\ttype=\"text\"\n\tid=\"monthly_fee\"\n\tname=\"monthly_fee\" \n\tvalue=\"", ["var", ["monthly_fee"], []], "\" />\n   <span class=\"units\">dollars per month</span></p>\n\n<h2>Transactions fees:</h2>\n<p>You can also pay us a percentage of every transaction you \n\tmake using our service.\n\t<br>Since we don't charge charities for receiving donations\n\tyour transaction fees will be charged separately and \n\tpaid directly to ProcrasDonate.</p>\n<p><input\n\ttype=\"text\"\n\tid=\"support_pct\"\n\tname=\"support_pct\" \n\tvalue=\"", ["var", ["support_pct"], []], "\" />\n   <span class=\"units\">%</span>\n   <span class=\"help\"> \n   \t<br>(enter ''4.00'' to donate 4% per transaction.)</span>\n   </p>\n"], "register_support_middle");
    
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Updates, affirmations and thankyou notes</h1>\n<p>In order to help you keep track of your time management progress, our\n\tsystem will use your preferences to provide you with weekly\n\tfeedback in the form of emails and/or alerts.\n</p>\n<p> Due to user preference, your email address will not even be shared with \n\tthe organizations you support.  \n\tHowever, our system does allow your supported organizations to create \n\tautomatic thank you notes and year-end updates so that they can \n\tlet you know how your contributions help to further their missions.\n</p>\n<p>By the way, although your ProcrasDonate records are anonymous, Amazon\n\tdoes include your full name (but not your contact information) on the \n\ttransaction receipt that the organizations you donate to will receive.  \n</p>\n<p>\n\tPlease set your communication preferences below:\n</p>\n<h2>Email address</h2>\n<p><label>Please enter your email address and check it twice</label><input\n\ttype=\"text\"\n\tid=\"email\"\n\tname=\"email\" \n\tvalue=\"", ["var", ["email"], []], "\" />\n   </p>\n\n<h2>Permissions</h2>\n<p>Only check off one of the boxes below if you want to opt out of \n\treceiving that service.</p>\n<p><input\n\ttype=\"checkbox\"\n\tid=\"a\"\n\tname=\"a\" \n\tvalue=\"", ["var", ["a"], []], "\" />\n   <span>I do not want to receive weekly affirmation emails/alerts on the \n   \tprogress I am making towards my goals.</span>\n   </p>\n\n<p><input\n\ttype=\"checkbox\"\n\tid=\"a\"\n\tname=\"a\" \n\tvalue=\"", ["var", ["a"], []], "\" />\n   <span>I do not want to receive occasional thank you notes from the \n   \t\torganizations that I support.</span>\n   </p>\n   \n<p><input\n\ttype=\"checkbox\"\n\tid=\"a\"\n\tname=\"a\" \n\tvalue=\"", ["var", ["a"], []], "\" />\n   <span>I do not want to receive a year end newsletter from the \n   organizations that I support.</span>\n   </p>\n\n<h2>Terms of service</h2>\n<p><input\n\ttype=\"checkbox\"\n\tid=\"a\"\n\tname=\"a\" \n\tvalue=\"", ["var", ["a"], []], "\" />\n   <span>I have read and agree to the following Terms of Service.</span>\n   </p>\n\nBy using our service you agree to the following:\n\n<p>- You agree to these terms and any updates that ProcrasDonate may make \n\twithout warning or notification.\n</p>\n<p>- You understand how our service works and are willingly participating.\n</p>\n<p>- You agree to pay all pledges made on your behalf in full.\n</p>\n<p>- Voluntary monthly fees and a percentage that you determine of each transaction will be\n\tpaid to ProcrasDonate.\n</p>\n<p>- You are solely responsible for any content that you add to this site. \n</p>\n<p>- Illegal, unfriendly, or otherwise problematic content will be removed.\n</p>\n<p>- Your individual records and settings are under your control.  \nAlthough our central server will collect your records to approve payments \nand collect community statistics - a reasonable effort will be made to keep\nyour browsing history and other records anonymous.\n</p>\n<p>- All rights are reserved including ProcrasDonate intellectual property of\n\tour business model and any software beyond the open source software \n\tthat we are using.\n</p>\n<p> Thanks for ProcrasDonating!\n</p>"], "register_updates_middle");
    
    Template.compile(["\n<ul>\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li id=\"", ["var", ["item", "id"], []], "\"\n\t\t\tclass=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t", ["var", ["item", "value"], []], "</li>\n\t"]], "\n</ul>\n\n<h1>My Settings</h1>\n\n<h2>Payment Status</h2>\n<p>Estimated time until payment re-authorization is needed: \n", ["var", ["estimated_time_till_reauth", "time"], []], " ", ["var", ["estimated_time_till_reauth", "units"], []], "</p>\n\n<h2>ProcrasDonate</h2>\n<p>Weekly ProcrasDonate goal: \n\t<span class=\"thevalue\" id=\"pd_hr_per_week_goal\">", ["var", ["pd_hr_per_week_goal"], []], "</span> hrs\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n<p>Weekly ProcrasDonate rate:\n\t$<span class=\"thevalue\" id=\"pd_dollars_per_hr\">", ["var", ["pd_dollars_per_hr"], []], "</span> per hr\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n<p>Weekly ProcrasDonate limit:\n\t<span class=\"thevalue\" id=\"pd_hr_per_week_max\">", ["var", ["pd_hr_per_week_max"], []], "</span> hrs\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n\n<h2>TimeWellSpent</h2>\n<p>Weekly TimeWellSpent goal:\n\t<span class=\"thevalue\" id=\"tws_hr_per_week_goal\">", ["var", ["tws_hr_per_week_goal"], []], "</span> hrs\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n<p>Weekly TimeWellSpent rate:\n\t$<span class=\"thevalue\" id=\"tws_dollars_per_hr\">", ["var", ["tws_dollars_per_hr"], []], "</span> per hr\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n<p>Weekly TimeWellSpent limit\n\t<span class=\"thevalue\" id=\"tws_hr_per_week_max\">", ["var", ["tws_hr_per_week_max"], []], "</span> hrs\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n\t\n<h2>Support This Service</h2>\n<p>Monthly membership fee: $<span class=\"thevalue\" id=\"monthly_fee\">", ["var", ["monthly_fee"], []], "</span> per month\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n<p>Per transaction percentage charge: <span class=\"thevalue\" id=\"support_pct\">", ["var", ["support_pct"], []], "</span>%\n\t<span class=\"up_arrow\">up</span><span class=\"down_arrow\">down</span><span class=\"error\"></span></p>\n\n<h2>Updates</h2>\n<p>Preferred email address: <span class=\"thevalue\" id=\"email_id\">", ["var", ["email"], []], "</span></p>\n<p><input class=\"thevalue\" type=\"checkbox\" ", ["if", [[false, ["var", ["receive_weekly_affirmations"], []]]], 1, ["checked"], []], " />\nYes, I want to receive weekly affirmation on the progress I am making towards my goals.</p>\n\n<p><input class=\"thevalue\" type=\"checkbox\" ", ["if", [[false, ["var", ["receive_thankyous"], []]]], 1, ["checked"], []], " />\nYes, I want to receive occasional thank you notes forwarded from the charities I support.</p>\n\n<p><input class=\"thevalue\" type=\"checkbox\" ", ["if", [[false, ["var", ["receive_newsletters"], []]]], 1, ["checked"], []], " />\nYes, I want to receive forwarded year end newsletters from the charities I support.</p>\n"], "settings_overview_middle");
    
    Template.compile(["<h3 class='RegisterHeader'>Begin categorizing websites.</h3>  \n\t<p>\n\t\tClick on the green arrows to move websites to the appropriate column.  \n\t\tYou can continue classifying websites later by clicking the icons that will appear on your firefox browser.\n\t</p>\n\t\n<img class=\"Spacer\" src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ClearBox.png\"/>\n\n<div id='site_classifications'>\n\t<div id='procrasdonate_col' class='column'>\n\t\t<div class='title'>\n\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/ProcrasDonateIcon.png\" class=\"icon-image\">\t\t\n\t\t\tProcrasDonate\n\t\t</div>\n\t\t", ["var", ["procrasdonate_text"], []], "\n\t</div>\n\t<div id='unsorted_col' class='column'>\n\t\t<div class='title'>\n\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/UnsortedIcon.png\" class=\"icon-image\">\t\t\n\t\t\tUnsorted\n\t\t</div>\n\t\t", ["var", ["unsorted_text"], []], "\n\t</div>\n\t<div id='timewellspent_col' class='column'>\n\t\t<div class='title'>\n\t\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/ToolbarImages/TimeWellSpentIcon.png\" class=\"icon-image\">\t\t\n\t\t\tTime Well Spent\n\t\t</div>\n\t\t", ["var", ["timewellspent_text"], []], "\n\t</div>\n</div>\n"], "site_classifications_middle");
    
    Template.compile(["<h3 class='RegisterHeader'>What is ProcrasDonate worth to you?</h3>\n\n<p>What <b>percentage</b> of <i>your</i> donations should we use to run/improve our service?</p>\n\t\n<form name='account_form' onSubmit='return false'>\n\t<table>\n\t\t<tbody>\n\t\t\t<tr>\n\t\t\t\t<td><label class='form-right form-label'>Support ProcrasDonate: </label></td>\n\t\t\t\t<!-- <td><div id='support_slider' class='slider' alt='", ["var", ["pct"], []], "'></div></td>-->\n\t\t\t\t<td><input id='support_input' class='press_enter_for_next input form-value form-right' alt='", ["var", ["pct"], []], "' value='", ["var", ["pct"], []], "' size='2'/></td>\n\t\t\t\t<td><span class='help form-label form-right'>% of total donation</span></td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</form>\n"], "support_middle");
    
    Template.compile(["<span class='img_link move_to_unsorted'>\n\t<img class='Move_Site_Arrow' src='", ["var", ["constants", "MEDIA_URL"], []], "img/LeftArrow.png'>\n</span>\n", ["var", ["inner"], []], "\n"], "timewellspent_wrap");
    
    Template.compile(["<span class='img_link move_to_procrasdonate'>\n\t<img class='Move_Site_Arrow' src='", ["var", ["constants", "MEDIA_URL"], []], "img/LeftArrow.png'>\n</span>\n", ["var", ["inner"], []], "\n<span class='img_link move_to_timewellspent'>\n\t<img class='Move_Site_Arrow' src='", ["var", ["constants", "MEDIA_URL"], []], "img/RightArrow.png'>\n</span>\n"], "unsorted_wrap");
    
    Template.compile(["<div id='thin_column'>\n\t", ["var", ["tab_snippet"], []], "\n\t<div id='messages'></div>\n\t<div id='errors'></div>\n\t<div id='success'></div>\n\t", ["var", ["middle"], []], "\n</div>\n\n"], "wrapper_snippet");
    