
<<<<<<< HEAD:procrasdonate/ProcrasDonateFFExtn/content/templates/multi_auth_status.html.js
    Template.compile(["\n<div id=\"multi_auth_status_updated\">\n\t", ["if", [[false, ["var", ["multi_auth", "good_to_go"], []]]], 1, ["\n\t\t<p>Payments approved! Click \"done\" to complete registration.\n\t\t\tYou can update these settings later at any time.<\/p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "error"], []]]], 1, ["\n\t\t<p>A problem occurred. Please copy\/paste the error message below\n\t\t\tinto an email to <a href=\"", ["var", ["constants", "EMAIL_ADDRESS"], []], "\">\n\t\t\t", ["var", ["constants", "EMAIL_ADDRESS"], []], "<\/a>\n\t\t\t<blockquote>error message: ", ["var", ["multi_auth", "caller_reference"], []], " -  \n\t\t\t\t", ["var", ["multi_auth", "status"], []], " ", ["var", ["multi_auth", "error_message"], []], "<\/blockquote>\n\t\t<\/p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "expired"], []]]], 1, ["\n\t\t<p>Authorization expired<\/p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "cancelled"], []]]], 1, ["\n\t\t<p>Authorization canceled<\/p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "aborted"], []]]], 1, ["\n\t\t<p>Did you mean to cancel authorization? Please try again or email\n\t\t<a href=\"", ["var", ["constants", "EMAIL_ADDRESS"], []], "\">", ["var", ["constants", "EMAIL_ADDRESS"], []], "<\/a> \n\t\tfor help.\n\t\t<\/p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "response_not_received"], []]]], 1, ["\n\t\t", ["if", [[false, ["var", ["server_dont_know"], []]]], 1, ["\n\t\t\t<p>Hmmm...incomplete authorization. Please try again or email\n\t\t\t<a href=\"", ["var", ["constants", "EMAIL_ADDRESS"], []], "\">", ["var", ["constants", "EMAIL_ADDRESS"], []], "<\/a> \n\t\t\tfor help.<\/p>\n\t\t"], ["\n\t\t\t<p>Retrieving information from server...<\/p>\n\t\t"]], "\n\t"], []], "\n<\/div>\n"], "multi_auth_status");
=======
    Template.compile(["\n<div id=\"multi_auth_status_updated\">\n\t", ["if", [[false, ["var", ["multi_auth", "good_to_go"], []]]], 1, ["\n\t\t<p>Payments approved!\n\t\t\tClick on \"My Settings\" in the sidebar to make changes.</p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "error"], []]]], 1, ["\n\t\t<p>A problem occurred. Please copy/paste the error message below\n\t\t\tinto an email to <a href=\"", ["var", ["constants", "EMAIL_ADDRESS"], []], "\">\n\t\t\t", ["var", ["constants", "EMAIL_ADDRESS"], []], "</a>\n\t\t\t<blockquote>error message: ", ["var", ["multi_auth", "caller_reference"], []], " -  \n\t\t\t\t", ["var", ["multi_auth", "status"], []], " ", ["var", ["multi_auth", "error_message"], []], "</blockquote>\n\t\t</p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "expired"], []]]], 1, ["\n\t\t<p>Authorization expired</p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "cancelled"], []]]], 1, ["\n\t\t<p>Authorization canceled</p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "aborted"], []]]], 1, ["\n\t\t<p>Did you mean to cancel authorization? Please try again or email\n\t\t<a href=\"", ["var", ["constants", "EMAIL_ADDRESS"], []], "\">", ["var", ["constants", "EMAIL_ADDRESS"], []], "</a> \n\t\tfor help.\n\t\t</p>\n\t"], []], ["if", [[false, ["var", ["multi_auth", "response_not_received"], []]]], 1, ["\n\t\t", ["if", [[false, ["var", ["server_dont_know"], []]]], 1, ["\n\t\t\t<p>Hmmm...incomplete authorization. Please try again or email\n\t\t\t<a href=\"", ["var", ["constants", "EMAIL_ADDRESS"], []], "\">", ["var", ["constants", "EMAIL_ADDRESS"], []], "</a> \n\t\t\tfor help.</p>\n\t\t"], ["\n\t\t\t<p>Retrieving information from server...</p>\n\t\t"]], "\n\t"], []], "\n</div>\n"], "multi_auth_status");
>>>>>>> 790793f52ade64240842af2e9a613bd12aa7829b:procrasdonate/ProcrasDonateFFExtn/content/templates/multi_auth_status.html.js
    