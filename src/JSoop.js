(function () {
    "use strict";

    var toString = Object.prototype.toString,
        JSoop = window.JSoop = {};

    //CONSTANTS
    JSoop.STRING   = 1;
    JSoop.ARRAY    = 2;
    JSoop.NUMBER   = 3;
    JSoop.OBJECT   = 4;
    JSoop.ELEMENT  = 5;
    JSoop.BOOL     = 6;
    JSoop.FUNCTION = 7;

    //Methods
    JSoop.is = function (obj, type) {
        if (JSoop.isString(type)) {
            return JSoop.instanceOf(obj, type);
        }

        switch (type) {
        case JSoop.BOOL:
            return JSoop.isBool(obj);
        case JSoop.STRING:
            return JSoop.isString(obj);
        case JSoop.ARRAY:
            return JSoop.isArray(obj);
        case JSoop.NUMBER:
            return JSoop.isNumber(obj);
        case JSoop.OBJECT:
            return JSoop.isObject(obj);
        case JSoop.ELEMENT:
            return JSoop.isElement(obj);
        case JSoop.FUNCTION:
            return JSoop.isFunction(obj);
        default:
            return false;
        }
    };

    JSoop.isString = function (obj) {
        return typeof obj === 'string';
    };

    JSoop.isArray = function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    JSoop.isBool = function (obj) {
        return typeof obj === 'boolean';
    };

    JSoop.isNumber = function (obj) {
        return typeof obj === 'number';
    };

    JSoop.isObject = function (obj) {
        return obj instanceof Object && obj.constructor === Object;
    };

    JSoop.isElement = function (obj) {
        return obj ? obj.nodeType === 1 : false;
    };

    JSoop.isPrimative = function (obj) {
        var type = typeof obj;

        return type === 'string' || type === 'number' || type === 'boolean';
    };

    JSoop.isFunction = function (obj) {
        return toString.call(obj) === '[object Function]';
    };

    JSoop.instanceOf = function (obj, type) {
        if (JSoop.isString(type)) {
            type = JSoop.objectQuery(type);
        }

        return obj instanceof type;
    };

    JSoop.iterate = function (obj, fn) {
        if (!JSoop.isObject(obj)) {
            return false;
        }

        var key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (fn(obj[key], key, obj) === false) {
                    return false;
                }
            }
        }

        return true;
    };

    JSoop.each = function (arr, fn) {
        if (!JSoop.isArray(arr)) {
            return fn(arr, 0, [arr]);
        }

        var i, length;

        for (i = 0, length = arr.length; i < length; i = i + 1) {
            if (fn(arr[i], i, arr) === false) {
                return false;
            }
        }

        return true;
    };

    JSoop.apply = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    };

    JSoop.applyIf = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    };

    JSoop.namespace = function (path) {
        var parts = path.split('.'),
            obj = window,
            i,
            length;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (obj[parts[i]] === undefined) {
                obj[parts[i]] = {};
            }

            obj = obj[parts[i]];
        }

        return obj;
    };

    JSoop.objectQuery = function (path, root) {
        var parts = path.split('.'),
            i,
            length;

        root = root || window;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (root[parts[i]] === undefined) {
                return undefined;
            }

            root = root[parts[i]];
        }

        return root;
    };

    JSoop.error = function (error) {
            //BUG FIX:
            //Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
        var nArgs = arguments,
            method = this.error.caller;

        if (JSoop.isString(error)) {
            error = {
                level: 'error',
                msg: error,
                stack: true
            };
        }

        if (method) {
            if (method.$name) {
                error.sourceMethod = method.$name;
            }

            if (method.$owner) {
                error.sourceClass = method.$owner.$className;
            }
        }

        if (JSoop.throwErrors !== false) {
            JSoop.log(error);
        }

        throw error.msg;
    };

    JSoop.emptyFn = function () {};
}());
