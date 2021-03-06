from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponseNotFound
from django.core.urlresolvers import reverse
import settings
from json_utils import json_response

def render_response(request, template, dictionary=None):
    """
    Return render_to_response with
    context_instance=RequestContext(request).
    """
    dictionary = dictionary or {}
    #if 'request' in dictionary:
    #    del dictionary['request']
    return render_to_response(template, dictionary, context_instance=RequestContext(request))

def render_string(request, template, dictionary=None):
    dictionary = dictionary or {}
    return render_to_string(template, dictionary, context_instance=RequestContext(request))

def superuser(user):
    return user and user.is_authenticated() and user.is_superuser

def staff(user):
    return user and user.is_authenticated() and user.is_staff

def logged_in(user):
    return user and user.is_authenticated()

def session(session_key):
    return request.session.get(session_key, False)

def user_criteria(crit_func):
    """
    Decorator for views. Expects a user_criteria function, eg superuser, staff, logged_in.
    If current user meets criteria, view is called; otherwise, redirect to login.
    """
    def decorator(fn):
        def inner(*iargs, **kwargs):
            #user = current_user()
            #if reduce(lambda x,y: x(user) and y(user), args):
            if crit_func(iargs[0].user):
                # user passes all user criteria
                return fn(*iargs, **kwargs)
            else:
                return HttpResponseRedirect('%s?redirect_to=%s' % (reverse('login'), iargs[0].path))
        return inner
    return decorator

def ajax(crit_fun1, crit_fun2=None):
    """
    Decorator for views accessed via ajax. Expects a user_criteria function, 
    eg superuser, staff, logged_in. If criteria function fails, returns json error.
    """
    def decorator(fn):
        def inner(*iargs, **kwargs):
            if crit_fun1(current_user()):
                return fn(*iargs, **kwargs)
            if crit_fun2 and crit_fun2(current_user()):
                return fn(*iargs, **kwargs)
            # user passes no criteria
            return json_response('Could not perform action: user fails to meet criteria')
        return inner
    return decorator

def extract_parameters(request, method_type, expected_parameters, optional_parameters=None):
    ret = {}
    
    if not getattr(request, method_type):
        return {'success': False,
                'reason': "Expected %s parameters" % method_type}
    
    for p in expected_parameters:
        try:
            v = getattr(request, method_type).get(p, None)
            if v == None:
                return {'success': False,
                        'reason': "Missing expected parameter: %s" % p}
            ret[p] = v
        except:
            return {'success': False,
                    'reason': "Something unexpected happened while extracting parameters"}
    
    optional_parameters = optional_parameters or {}
    for p in optional_parameters:
        try:
            v = getattr(request, method_type).get(p, None)
            if v:
                ret[p] = v
        except:
            return {'success': False,
                    'reason': "Something unexpected happened while extracting optional parameters"}
     
    
    return {'success': True,
            'parameters': ret}
