from lib.xml_utils import ConvertXmlToDict
from settings import pathify, path, PROJECT_PATH, MEDIA_ROOT, MEDIA_URL

from procrasdonate.models import Recipient

from django.utils import simplejson as json

import os
import random
import hashlib

class XpiBuilder(object):
    def __init__(self, extn_dir, xpi_dir, recipient=None):
        self.extn_dir = extn_dir
        self.xpi_dir = xpi_dir
        self.recipient = recipient
    
    def write_input_json(self):
        generated_input_fn = pathify([self.extn_dir, 'content', 'js', 'generated_input.js'],
                                     file_extension=True)
        generated_input_f = open(generated_input_fn, 'w')
        
        generated_input_f.write("""
/**
 * Generated by xpi builder on the fly when user downloads extension.
 */
function generated_input() {
    return """);
        
        bilumi = None
        if not self.recipient or self.recipient.slug != 'BILUMI':
            bilumi = Recipient.get_or_none(slug="BILUMI")
        
        recip_pcts = []
        
        if self.recipient:
            recip_pcts.append({"recipient_slug": self.recipient.slug,
                               "percent": 1.0})
        if bilumi:
            recip_pcts.append({"recipient_slug": bilumi.slug,
                               "percent": 0.0})
        
        private_key = self.generate_private_key()
        
        data = [{"private_key": private_key,
                 "preselected_charities": recip_pcts}]
        
        json.dump(data, generated_input_f)
        
        generated_input_f.write("""
}
""");
        return private_key
    
    def build_xpi(self):
        xpi_nm = 'ProcrasDonate_%s_%s.xpi' % (self.recipient and self.recipient.slug or "Generic",
                                              self.get_version()) 
        xpi_fn = pathify([self.xpi_dir, xpi_nm], file_extension=True)
        
        os.chdir(self.extn_dir)
        print os.popen('zip -r %s *' % xpi_fn)
        
        xpi_url = "%s%s/%s" % (MEDIA_URL, 'xpi', xpi_nm)
        
        xpi_file_content = open(xpi_fn, 'rb').read()
        xpi_hash = "sha1:%s" % hashlib.sha1(xpi_file_content).hexdigest()
        
        return (xpi_url, xpi_hash)
    
    def generate_private_key(self):
        alphas = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        ret = ""
        for i in range(22):
            ret += alphas[random.randint(0,len(alphas)-1)]
        return ret
    
    def get_version(self):
        install_rdf_fn = pathify([self.extn_dir, 'install.rdf'], file_extension=True)
        install_rdf_f = open(install_rdf_fn, 'r')
        install_rdf = install_rdf_f.read()
    
        d = ConvertXmlToDict(install_rdf)
    
        a = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF'
        b = '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description'
        c = "{http://www.mozilla.org/2004/em-rdf#}version"
    
        return d[a][b][c]
    
if __name__ == "__main__":
    xpi_builder = XpiBuilder(pathify([PROJECT_PATH, 'procrasdonate', 'ProcrasDonateFFExtn'], file_extension=True),
                             pathify([MEDIA_ROOT, 'xpi']))

    print xpi_builder.write_input_json()
    print build_xpi()