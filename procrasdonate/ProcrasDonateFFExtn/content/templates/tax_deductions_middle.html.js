
    Template.compile(["<table>\n<tbody>\n<tr>\n<td class=\"tax_deductions ", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\">\n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tname=\"org_thank_yous\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_thank_yous"], []]]], 1, ["checked"], []], " />\n\t   <span>I want to receive occasional thank you notes from the \n\t   \t\torganizations that I support.</span>\n\t   </p>\n\t   \n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tname=\"org_newsletters\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_newsletters"], []]]], 1, ["checked"], []], " />\n\t   <span>I want to receive a year end newsletter from the \n\t   organizations that I support.</span>\n\t   </p>\n\t", ["for", ["field"], ["var", ["address_fields"], []], false, ["\n\t\t<p>\n\t\t\t<label>", ["var", ["field", "display"], []], "</label>\n\t\t\t<input\n\t\t\t\ttype=\"text\"\n\t\t\t\tname=\"", ["var", ["field", "name"], []], "\"\n\t\t\t\t", ["if", [[true, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t\t\tvalue=\"", ["var", ["field", "value"], []], "\" />\n\t\t</p>\n\t"]], "\n</td>\n<td class=\"not_tax_deductions ", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\">\n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tname=\"org_thank_yous\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_thank_yous"], []]]], 1, ["checked"], []], " />\n\t   <span>I want to receive occasional thank you notes from the \n\t   \t\torganizations that I support.</span>\n\t   </p>\n\t   \n\t<p><input\n\t\ttype=\"checkbox\"\n\t\tname=\"org_newsletters\"\n\t\tclass=\"comm_radio\"\n\t\t", ["if", [[false, ["var", ["tax_deductions"], []]]], 1, ["disabled"], []], "\n\t\t", ["if", [[false, ["var", ["org_newsletters"], []]]], 1, ["checked"], []], " />\n\t   <span>I want to receive a year end newsletter from the \n\t   organizations that I support.</span>\n\t   </p>\n</td>\n</tr>\n</tbody>\n</table>\n"], "tax_deductions_middle");
    