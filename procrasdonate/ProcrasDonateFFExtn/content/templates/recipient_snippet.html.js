
    Template.compile(["<div class='recipient recipient_to_add'>\n\t<!-- id class needed for js -->\n\t<div class=\"recipient_id hidden\">", ["var", ["recipient", "id"], []], "</div>\n\t<div class='add_recipient' title=\"Add recipient to list\"> \n\t\t<img src=\"", ["var", ["constants", "MEDIA_URL"], []], "img/AddRecipient.png\" class=\"recipient-image img_link\">\t\t\n\t </div>\n\t <div class='name'>\n\t\t", ["if", [[false, ["var", ["deep_recip_pct", "recipient", "is_pd_registered"], []]]], 1, ["\n\t\t\t<a href='", ["var", ["constants", "RECIPIENTS_URL"], []], ["var", ["deep_recip_pct", "recipient", "slug"], []], "'>\n\t\t"], []], "\n\t\t\t<img src=\"", ["var", ["recipient", "logo_thumbnail"], []], "\" />\n\t\t\t", ["var", ["recipient", "name"], []], "\n\t\t", ["if", [[false, ["var", ["deep_recip_pct", "recipient", "is_pd_registered"], []]]], 1, ["\n\t\t\t</a>\n\t\t"], []], "\n\t  </div>\n\t<div class=\"category\">", ["var", ["recipient", "category", "category"], []], "</div>\n\t<div class='mission'>", ["var", ["recipient", "mission"], []], "\n\t\t<span class='link description_toggle'>(less)</span>\n\t</div>\n\t<div class='description'><p>", ["var", ["recipient", "description"], []], "</p></div>\n\n</div>\n"], "recipient_snippet");
    