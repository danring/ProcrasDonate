
    Template.compile(["\n<ul>\n\t", ["for", ["item"], ["var", ["substate_menu_items", "menu_items"], []], false, ["\n\t\t<li class=\"", ["for", ["klass"], ["var", ["item", "klasses"], []], false, [["var", ["klass"], []], " "]], "\">\n\t\t\t", ["var", ["item", "value"], []], "</li>\n\t"]], "\n</ul>\n\n", ["if", [[false, ["var", ["substate_menu_items", "prev"], []]]], 1, ["\n<span id=\"", ["var", ["substate_menu_items", "prev", "id"], []], "\" class=\"prev\">PREV</span>\n"], []], "\n\n", ["if", [[false, ["var", ["substate_menu_items", "next"], []]]], 1, ["\n<span id=\"", ["var", ["substate_menu_items", "next", "id"], []], "\" class=\"next\">NEXT</span>\n"], []], "\n\n", ["ifequal", ["var", ["substate_menu_items", "next", "value"], []], ["var", "XXX", []], ["\n\t<span id=\"", ["var", ["substate_menu_items", "next", "id"], []], "\" class=\"done\">DONE</span>\n"], []], "\n\n<h1>Customize your charitable incentive</h1>\n\n<h2>Goal</h2>\n<p>How many hours per week of ProcrasDonation would you like to strive for?</p>\n<p><input\n\ttype=\"text\"\n\tid=\"pd_hr_per_week_goal\"\n\tname=\"pd_hr_per_week_goal\" \n\tvalue=\"", ["var", ["pd_hr_per_week_goal"], []], "\" />\n   <span class=\"units\">hours per week</span></p>\n\n<h2>Incentive</h2>\n<p>Blah blah blah</p>\n<p><input\n\ttype=\"text\"\n\tid=\"pd_dollars_per_hr\"\n\tname=\"pd_dollars_per_hr\" \n\tvalue=\"", ["var", ["pd_dollars_per_hr"], []], "\" />\n   <span class=\"units\">dollars per hour</span></p>\n\n<h2>ProcrasDonation Limit</h2>\n<p>Blah blah blah</p>\n<p><input\n\ttype=\"text\"\n\tid=\"pd_hr_per_week_max\"\n\tname=\"pd_hr_per_week_max\" \n\tvalue=\"", ["var", ["pd_hr_per_week_max"], []], "\" />\n   <span class=\"units\">hours per week</span></p>\n"], "register_incentive_middle");
    