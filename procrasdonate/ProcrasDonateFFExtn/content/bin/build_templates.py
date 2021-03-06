#!/usr/bin/env python

#import sys
import os

# Make sure required paths are in 'sys.path'
#base_path = "/Users/clay/workspace/ProcrasDonate/"
#extra_paths = [
#        base_path,
#        os.path.join(base_path, "ext/lib"),
#        ]
#old: sys.path[0:0] = "procrasdonate/ProcrasDonateFFExtn/content/js/ext/lib"
#new: sys.path[0:0] = ["procrasdonate/ProcrasDonateFFExtn/content/js/ext/lib"]
#os.chdir(base_path)

from django.conf import settings
settings.configure()

IF_BUG = False

def write_template_file(filename, json_template):
    temp_fn = os.path.basename(filename)
    template_name = temp_fn[0:temp_fn.find(".")]
    print filename, template_name
    js_content = """
    Template.compile(%s, "%s");
    """ % (json_template, template_name)
    
    f = open(filename, "w")
    f.write(js_content) #(json_template)
    f.close()

def main(args):
    from django.template.loader import get_template_from_string
    from json_template import jsonify_nodelist
    for filename in args[1:]:
        if IF_BUG: print "FILENAME:", filename
        out_filename = filename + ".js"
        try:
            f = open(filename)
            source = f.read()
            f.close()
        except:
            raise RuntimeError("Could not load file: %r" % (filename,))
        
        template = get_template_from_string(source, None, filename)
        if IF_BUG: print "template =", template
        
        json_template = jsonify_nodelist(template.nodelist)
        if IF_BUG: print "json_template =", json_template
        
        write_template_file(out_filename, json_template)
        #f = open(out_filename, "w")
        #f.write(json_template)
        #f.close()
        
        print "wrote %r" % (out_filename,)
        
    return 0

if __name__ == "__main__":
    import sys
    exit(main(sys.argv))

