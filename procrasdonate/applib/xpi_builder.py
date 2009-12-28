from lib.xml_utils import ConvertXmlToDict
from settings import pathify, path, PROJECT_PATH, MEDIA_ROOT, MEDIA_URL, DOMAIN, API_DOMAIN

from procrasdonate.models import Recipient

from django.utils import simplejson as json

import re
import os
import sys
import random
import hashlib

VERSION_RE = re.compile("(<version>)([\d\.]+)(</version>)")
XPI_URL_RE = re.compile("(<updateLink>)(.*)(</updateLink>)")
XPI_HASH_RE = re.compile("(<updateHash>)(.*)(</updateHash>)")

class XpiBuilder(object):
    def __init__(self, extn_dir, xpi_dir, update_dir, recipient=None):
        self.extn_dir = extn_dir
        self.xpi_dir = xpi_dir
        self.update_dir = update_dir
        self.recipient = recipient
        print extn_dir
        print xpi_dir
        print update_dir
    
    def write_input_json(self, is_update=False):
        generated_input_fn = pathify([self.extn_dir, 'content', 'js', 'generated_input.js'],
                                     file_extension=True)
        generated_input_f = open(generated_input_fn, 'w')
        
        generated_input_f.write("""
/**
 * Generated by xpi builder on the fly when user downloads extension.
 */
function generated_input() {
    return """);
        
        data = {"constants_PD_URL": DOMAIN,
                 "constants_PD_API_URL": API_DOMAIN,
                 "is_update": is_update}
        print "DATA: ", data
        
        private_key = "__no_private_key_for_update__"
        
        if not is_update:
            bilumi = None
            if not self.recipient or self.recipient.slug != 'bilumi':
                bilumi = Recipient.get_or_none(slug="bilumi")
            
            recip_pcts = []
            
            if self.recipient:
                recip_pcts.append({"recipient_slug": self.recipient.slug,
                                   "percent": 1.0})
            elif bilumi:
                # we wanted percent to be 0.0, but we have the invariant
                # that percents must sum to 100% 
                recip_pcts.append({"recipient_slug": bilumi.slug,
                                   "percent": 0.0})
            
            private_key = self.generate_private_key()
            
            data["private_key"] = private_key
            data["preselected_charities"] = recip_pcts
        
        json.dump([data], generated_input_f)
        
        generated_input_f.write("""
}
""");
        generated_input_f.close()
        
        # now build generated_javascript.js
        print "generate_javascript..."
        extn_bin = pathify([self.extn_dir, "content", "bin"])
        sys.path.append(extn_bin)
        import safe_globals
        input_file = pathify(['content', 'overlay_list.txt'], file_extension=True)
        output_file = pathify(['content', 'js', 'generated_javascript.js'], file_extension=True)
        safe_globals.concatenate(self.extn_dir, input_file, output_file)
        print "...done"
        
        return private_key
    
    def build_xpi(self, is_update=False):
        if is_update:
            name = "Update"
        elif self.recipient:
            name = self.recipient.slug
        else:
            name = "Generic"
        print "THE NAME", name, self.recipient
            
        xpi_nm = 'ProcrasDonate_%s_%s.xpi' % (name, self.get_version()) 
        xpi_fn = pathify([self.xpi_dir, xpi_nm], file_extension=True)
        
        os.chdir(self.extn_dir)
        print
        print "XPI_FN", xpi_fn
        print "EXTN_DIR", self.extn_dir
        print os.popen('zip -r %s *' % xpi_fn)
        print
        
        xpi_url = "%s%s/%s" % (MEDIA_URL, 'xpi', xpi_nm)
        
        xpi_file = open(xpi_fn, 'rb')
        xpi_hash = "sha1:%s" % hashlib.sha1(xpi_file.read()).hexdigest()
        xpi_file.close()

        if is_update:
            self.update_updates_rdf(xpi_url, xpi_hash)
        
        return (xpi_url, xpi_hash)
    
    def generate_private_key(self):
        alphas = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        ret = ""
        for i in range(22):
            ret += alphas[random.randint(0,len(alphas)-1)]
        return ret
    
    def get_version(self):
        return self._get_version(self.extn_dir, 'install.rdf')
    
    def get_update_version(self):
        return self._get_version(self.update_dir, 'update.rdf')
    
    def _get_version(self, dir, name):
        rdf_fn = pathify([dir, name], file_extension=True)
        rdf_f = open(rdf_fn, 'r')
        rdf = rdf_f.read()
        rdf_f.close()
    
        d = ConvertXmlToDict(rdf)
    
        a = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF'
        b = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description'
        if name == 'install.rdf':
            c = "{http://www.mozilla.org/2004/em-rdf#}version"
            return d[a][b][c]
        else:
            u1 = '{http://www.mozilla.org/2004/em-rdf#}updates'
            u2 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Seq'
            u3 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}li'
            u4 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description'
            u5 = '{http://www.mozilla.org/2004/em-rdf#}version'
            
            print "="*30
            print d[a][b][u1][u2][u3][u4].keys()
            return d[a][b][u1][u2][u3][u4][u5]
    
    def get_update_info(self):
        rdf_fn = pathify([self.update_dir, 'update.rdf'], file_extension=True)
        rdf_f = open(rdf_fn, 'r')
        rdf = rdf_f.read()
        rdf_f.close()
    
        d = ConvertXmlToDict(rdf)
    
        a = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF'
        b = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description'
       
        u1 = '{http://www.mozilla.org/2004/em-rdf#}updates'
        u2 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Seq'
        u3 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}li'
        u4 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description'
        u5 = '{http://www.mozilla.org/2004/em-rdf#}version'
        u6 = '{http://www.mozilla.org/2004/em-rdf#}targetApplication'
        u7 = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description'
        
        x = '{http://www.mozilla.org/2004/em-rdf#}updateLink'
        h = '{http://www.mozilla.org/2004/em-rdf#}updateHash'
        
        """
        print "="*30
        print d[a][b][u1][u2][u3][u4][u5]
        print d[a][b][u1][u2][u3][u4][u6][u7].keys()
        print d[a][b][u1][u2][u3][u4][u6][u7][x]
        print d[a][b][u1][u2][u3][u4][u6][u7][h]
        """
        
        return {'update_link': d[a][b][u1][u2][u3][u4][u6][u7][x],
                'update_hash': d[a][b][u1][u2][u3][u4][u6][u7][h]}

    def update_updates_rdf(self, xpi_url, xpi_hash):
        current_version = self.get_version()
        update_version = self.get_update_version()
        
        rdf_fn = pathify([self.update_dir, 'update.rdf'], file_extension=True)
        read_rdf_f = open(rdf_fn, 'r')
        write_lines = []
        for line in read_rdf_f.readlines():
            line = VERSION_RE.sub("\g<1>%s\g<3>" % current_version, line)
            line = XPI_URL_RE.sub("\g<1>%s%s\g<3>" % (DOMAIN, xpi_url), line)
            line = XPI_HASH_RE.sub("\g<1>%s\g<3>" % xpi_hash, line)
            write_lines.append(line)
            
        read_rdf_f.close()
        write_rdf_f = open(rdf_fn, 'w')
        for line in write_lines:
            write_rdf_f.write(line)
        write_rdf_f.close()
            
if __name__ == "__main__":
    xpi_builder = XpiBuilder(pathify([PROJECT_PATH, 'procrasdonate', 'ProcrasDonateFFExtn']),
                             "%s%s" % (MEDIA_ROOT, 'xpi'),
                             "%s%s" % (MEDIA_ROOT, 'rdf'))
    
    print xpi_builder.write_input_json(is_update=True)
    print xpi_builder.build_xpi(is_update=True)
    print xpi_builder.get_update_info()
