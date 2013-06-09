
// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes 
'use strict';

var lang = require("neuro-lang");

// @returns {Object}
function getStorage(host){
    var ATTR_EVENTS = '__ev';
        
    return host[ATTR_EVENTS] || (host[ATTR_EVENTS] = {});
};


// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function getStorageByType(host, type){
    var storage = getStorage(host);
    
    return type ? storage[type] || (storage[type] = []) : [];
};


module.exports = {
    on: lang.overloadSetter(function(type, fn){
        if(lang.isString(type) && lang.isFunction(fn)){
            var storage = getStorageByType(this, type);
            
            storage.push(fn);
        }
    
        return this;
    }),
    
    off: function(type, fn){
        var self = this,
            args = arguments,
            storage,
            s;
        
        // remove all attached events
        // only deal with .off()
        if(!args.length){
            storage = getStorage(this);
            
            for(type in storage){
                s = storage[type];
                s && (s.length = 0);
            }
            
            return self;
        }
        // else:
        // ignore: .off(undefined, undefined)
        // invocation like .off(undefined, undefined) shall be ignored, which must be a runtime logic exception
        
        
        // ignore: .off(undefined, fn);
        // ignore: .off(undefined)
        if(lang.isString(type)){
            s = getStorageByType(self, type);
            
            // .off(type)
            if(args.length === 1){
                s.length = 0;
            
            // .off(type, fn)
            
            // ignore: .off(type, undefined)
            }else if(lang.isFunction(fn)){
                for(var i = 0, len = s.length; i < len; i ++){
                    if(s[i] === fn){
                        s.splice(i, 1);
                    }
                }
            }
        }
        
        return self;
    },
    
    fire: function(type, args){
        var self = this;
        
        if(lang.isString(type)){
            args = lang.makeArray(args);
            
            getStorageByType(self, type).forEach(function(fn){
                fn.apply(self, args);
            });
        }
        
        return self;
    }
};

/**
 change log
 
 2012-08-02  Kael:
 - improved the stablility of function overloading, prevent user mistakes
 - optimized calling chain
 
 2011-02-24  Kael:
 TODO:
 A. add .after and .before
 
 */