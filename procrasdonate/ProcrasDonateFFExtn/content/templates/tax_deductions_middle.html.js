
    Template.compile(["<table>\n<tbody>\n<tr>\n\t<td align=\"left\">\n\t\t<input\n\t\tclass=\"tax_deductions_radio\"\n\t\ttype=\"radio\"\n\t\tname=\"tax_deductions\"\n\t\tvalue=\"yes\"\n\t\t", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["checked"], []], ">Yes</input>\n\t</td>\n\t<td align=\"left\">\n\t\t<input\n\t\tclass=\"tax_deductions_radio\"\n\t\ttype=\"radio\"\n\t\tname=\"tax_deductions\"\n\t\tvalue=\"no\"\n\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["checked"], []], ">No</input>\n\t</td>\n</tr>\n<tr>\n<td class=\"tax_deductions ", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\">\n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tid=\"org_thank_yous\"\n\t\tname=\"org_thank_yous\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_thank_yous"], []]]], 1, ["checked"], []], " />\n\t   <span>''Please forward occasional thank you notes from \n\t   \t\torganizations I support.''</span>\n\t   </p>\n\t   \n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tid=\"org_newsletters\"\n\t\tname=\"org_newsletters\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_newsletters"], []]]], 1, ["checked"], []], " />\n\t   <span>''Please forward occasional newsletters from \n\t   organizations I support.''</span>\n\t   </p>\n\t<ul><li>Organizations you support will have access to your mailing address to send you appropriate tax documentation.</li>\n\t</ul>\n\t", ["for", ["field"], ["var", ["address_fields"], []], false, ["\n\t\t<p>\n\t\t\t<label>", ["var", ["field", "display"], []], "</label>\n\t\t\t<input\n\t\t\t\ttype=\"text\"\n\t\t\t\tname=\"", ["var", ["field", "name"], []], "\"\n\t\t\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t\t\tvalue=\"", ["var", ["field", "value"], []], "\" />\n\t\t</p>\n\t"]], "\n\n</td>\n<td class=\"not_tax_deductions ", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\">\n\n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tid=\"org_thank_yous\"\n\t\tname=\"org_thank_yous\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_thank_yous"], []]]], 1, ["checked"], []], " />\n\t   <span>''Please forward occasional thank you notes from \n\t   \t\torganizations I support.''</span>\n\t   </p>\n\t   \n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tid=\"org_newsletters\"\n\t\tname=\"org_newsletters\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_newsletters"], []]]], 1, ["checked"], []], " />\n\t   <span>''Please forward occasional newsletters from \n\t   organizations I support.''</span>\n\t   </p>\n\n\t<ul><li>Organizations you support will see your name but not your address on their receipts.</li>\n\t</ul>\n\n</td>\n</tr>\n</tbody>\n</table>\n"], "tax_deductions_middle");
    