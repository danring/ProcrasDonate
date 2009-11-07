
    Template.compile([["var", ["substate_menu"], []], "\n\n<h1>Charitable recipients</h1>\n<p>You can use your ProcrasDonation incentive to help several \n\tcharities or focus on supporting just one.  Simply find, select, \n\tand then adjust the percentage of your support that each charity \n\treceives.</p>\n\n<h2>Selected charities:</h2>\n\n<div id=\"chosen_charities\">\n\t", ["for", ["deep_recip_pct_html"], ["var", ["chosen_charities"], []], false, ["\n\t\t", ["var", ["deep_recip_pct_html"], []], "\n\t"]], "\n</div>\n\n<h2>Find other charities:</h2>\n\n", ["nop"], "\n\n<div id=\"not_chosen_charities\">\n\t", ["for", ["recipient_html"], ["var", ["not_chosen_charities"], []], false, ["\n\t\t", ["var", ["recipient_html"], []], "\n\t"]], "\n</div>\n\n<h2>Invite new charities:</h2>\n<p>If a non-profit charity is not listed then you can invite \n\tthem to join by entering their name below.\n\t<br>You can even make pledges to the charities you've invited. \n\tWhen they create a free account then your pledges will eligible to \n\tbecome donations.\n</p>\n\t\t\n<p>\n\t<label>Name of unlisted charity to invite:</label>\n\t<input id=\"new_recipient_name\" type=\"text\" size=\"30\" />\n\n\t<input\n\t\tid=\"new_recipient_submit\"\n\t\ttype=\"image\"\n\t\tsrc=\"", ["var", ["constants", "MEDIA_URL"], []], "img/AddRecipient.png\"\n\t\tvalue=\"add new recipient\"/>\n</p>\n\n", ["nop"], "\n"], "register_charities_middle");
    