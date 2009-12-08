
    Template.compile([["var", ["substate_menu"], []], "\n", ["var", ["arrows"], []], "\n\n<p id=\"error\"></p>\n\n<h1>Updates, affirmations and thankyou notes</h1>\n<p>In order to help you keep track of your time management progress, our\n\tsystem will use your preferences to provide you with weekly\n\tfeedback in the form of emails and/or alerts.\n</p>\n<p> Due to user preference, your email address will not even be shared with \n\tthe organizations you support.  \n\tHowever, our system does allow your supported organizations to create \n\tautomatic thank you notes and year-end updates so that they can \n\tlet you know how your contributions help to further their missions.\n</p>\n<p>By the way, although your ProcrasDonate records are anonymous, Amazon\n\tdoes include your full name (but not your contact information) on the \n\ttransaction receipt that the organizations you donate to will receive.  \n</p>\n<p>\n\tPlease set your communication preferences below:\n</p>\n<h2>Email address</h2>\n<p><label>Please enter your email address and check it twice</label><input\n\ttype=\"text\"\n\tid=\"email\"\n\tname=\"email\" \n\tvalue=\"", ["var", ["email"], []], "\" />\n   </p>\n\n<h2>Options</h2>\n\n<p>Do you want to be eligible for tax deductions?</p>\n\n<input\n\tclass=\"tax_deductions_radio\"\n\ttype=\"radio\"\n\tname=\"tax_deductions\"\n\tvalue=\"yes\"\n\t", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["checked"], []], ">Yes</input>\n\t\n<input\n\tclass=\"tax_deductions_radio\"\n\ttype=\"radio\"\n\tname=\"tax_deductions\"\n\tvalue=\"no\"\n\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["checked"], []], ">No</input>\n\n<div id=\"tax_deductions_middle\">\n</div>\n\n<h2>Terms of service</h2>\n<p><input\n\ttype=\"checkbox\"\n\tid=\"tos\"\n\tname=\"tos\"\n\t", ["if", [[false, ["var", ["tos"], []]]], 1, ["checked"], []], " />\n   <span>I have read and agree to the following Terms of Service.</span>\n   </p>\n\nBy using our service you agree to the following:\n\n<p>- You agree to these terms and any updates that ProcrasDonate may make \n\twithout warning or notification.\n</p>\n<p>- You understand how our service works and are willingly participating.\n</p>\n<p>- You agree to pay all pledges made on your behalf in full.\n</p>\n<p>- Voluntary monthly fees and a percentage that you determine of each transaction will be\n\tpaid to ProcrasDonate.\n</p>\n<p>- You are solely responsible for any content that you add to this site. \n</p>\n<p>- Illegal, unfriendly, or otherwise problematic content will be removed.\n</p>\n<p>- Your individual records and settings are under your control.  \nAlthough our central server will collect your records to approve payments \nand collect community statistics - a reasonable effort will be made to keep\nyour browsing history and other records anonymous.\n</p>\n<p>- All rights are reserved including ProcrasDonate intellectual property of\n\tour business model and any software beyond the open source software \n\tthat we are using.\n</p>\n<p> Thanks for ProcrasDonating!\n</p>\n\n", ["var", ["arrows"], []], "\n"], "register_updates_middle");
    