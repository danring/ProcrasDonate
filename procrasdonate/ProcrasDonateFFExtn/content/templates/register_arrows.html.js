
    Template.compile(["\n", ["if", [[false, ["var", ["substate_menu_items", "prev"], []]]], 1, ["\n\t", ["if", [[false, ["var", ["substate_menu_items", "prev", "url"], []]]], 1, ["<a href=\"", ["var", ["substate_menu_items", "prev", "url"], []], "\">"], []], "\n\t\t<img\n\t\t  class=\"prev ", ["var", ["substate_menu_items", "prev", "id"], []], "\"\n\t\t  src=\"/procrasdonate_media/img/BackArrow.png\" />\n  ", ["if", [[false, ["var", ["substate_menu_items", "prev", "url"], []]]], 1, ["</a>"], []], "\n"], ["\n\t", ["if", [[true, ["var", ["substate_menu_items", "no_spacers"], []]]], 1, ["\n\t<img\n\t  class=\"prev\"\n\t  src=\"/procrasdonate_media/img/Spacer.png\" />\n\t"], []], "\n"]], "\n\n", ["if", [[false, ["var", ["substate_menu_items", "next"], []]]], 1, ["\n\t", ["ifequal", ["var", ["substate_menu_items", "next", "value"], []], ["var", "XXX", []], ["\n\t\t<img\n\t\t  class=\"done ", ["var", ["substate_menu_items", "next", "id"], []], "\"\n\t\t  src=\"/procrasdonate_media/img/DoneButton.png\" />\n\t"], ["\n\t\t", ["if", [[false, ["var", ["substate_menu_items", "next", "url"], []]]], 1, ["<a href=\"", ["var", ["substate_menu_items", "next", "url"], []], "\">"], []], "\n\t\t\t<img\n\t\t\t  class=\"next ", ["var", ["substate_menu_items", "next", "id"], []], "\"\n\t\t\t  src=\"/procrasdonate_media/img/NextArrow.png\" />\n\t\t", ["if", [[false, ["var", ["substate_menu_items", "next", "url"], []]]], 1, ["</a>"], []], "\n\t"]], "\n"], ["\n\t", ["if", [[true, ["var", ["substate_menu_items", "no_spacers"], []]]], 1, ["\n\t<img\n\t  class=\"next\"\n\t  src=\"/procrasdonate_media/img/Spacer.png\" />\n\t"], []], "\n"]], "\n\n"], "register_arrows");
    