
    Template.compile(["<div id='ranks'>\n\t", ["if", [[false, ["var", ["show_tags"], []]]], 1, ["\n\t<!--<fieldset class='rank_legend' style='-moz-border-radius:1em;'>-->\n\t<div class='rank_legend'>\n\t\t<h3>Site Classification Legend</h3>\n\t\t<!--<legend>Legend</legend>-->\n\t\t<label>ProcrasDonate:</label><div class='bar procrasdonate'></div>\n\t\t<label>TimeWellSpent:</label><div class='bar timewellspent'></div>\n\t\t<label>Other:</label><div class='bar other'></div>\n\t</div>\n\t<!--</fieldset>-->\n\t<h3>Most Visited Sites</h3>\n\t"], ["\n\t<h3>Most Supported Recipient</h3>\n\t"]], "\n</div>\n<table>\n\t<tbody>\n\t\t", ["for", ["name", "text1", "text2", "bar_class"], ["var", ["data"], []], false, ["\n\t\t<tr class=\"site_rank\">\n\t\t\t<td class=\"site_name\">", ["var", ["name"], []], "</td>\n\t\t\t<td class=\"rank\">\n\t\t\t\t<div class=\"bar ", ["var", ["bar_class"], []], "\" style=\"width: ", ["var", ["width"], []], "%\">\n\t\t\t\t\t", ["if", [[false, ["var", ["show_tags"], []]]], 1, ["\n\t\t\t\t\t<div class=\"rank_text\">", ["var", ["text1"], []], "</div>\n\t\t\t\t\t"], ["\n\t\t\t\t\t<div class=\"rank_text\">$", ["var", ["text2"], []], "</div>\n\t\t\t\t\t"]], "\n\t\t\t\t</div>\n\t\t\t</td>\n\t\t</tr>\n\t\t"]], "\n\t</tbody>\n</table>\n\n"], "impact_sites_middle");
    