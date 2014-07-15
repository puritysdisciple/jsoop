(function () {
    "use strict";

    var toString = Object.prototype.toString,
        JSoop = {},
        EmptyClass = function () {};

    //CONSTANTS
    JSoop.GLOBAL   = (new Function('return this'))();

    JSoop.getValue = function () {
        var args = Array.prototype.slice.call(arguments, 0),
            value = args[0],
            scope, myArgs;

        if (!JSoop.isFunction(value)) {
            return value;
        }

        scope = args[1] || JSoop.GLOBAL;
        myArgs = args[2] || [];

        return value.apply(scope, args);
    };

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

    JSoop.isDate = function (obj) {
        return toString.call(obj) === '[object Date]';
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

    JSoop.isFunction = function (obj) {
        return toString.call(obj) === '[object Function]';
    };

    JSoop.isPrimitive = function (obj) {
        var type = typeof obj;

        return type === 'string' || type === 'number' || type === 'boolean';
    };

    JSoop.isRegExp = function (obj) {
        return toString.call(obj) === '[object RegExp]';
    };

    JSoop.instanceOf = function (obj, type) {
        if (JSoop.isString(type)) {
            type = JSoop.objectQuery(type);
        }

        return obj instanceof type;
    };

    JSoop.namespace = function (path) {
        var parts = path.split('.'),
            obj = JSoop.GLOBAL,
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

    JSoop.emptyFn = function () {};

    JSoop.log = (function () {
        var console = JSoop.GLOBAL.console;

        if (console) {
            if (console.log.apply) {
                return function () {
                    return console.log.apply(console, arguments);
                };
            } else {
                return function () {
                    return console.log(arguments);
                };
            }
        }

        return JSoop.emptyFn;
    }());

    JSoop.chain = function (obj) {
        var newObj;

        EmptyClass.prototype = obj;

        newObj = new EmptyClass();

        EmptyClass.prototype = null;

        return newObj;
    };

    JSoop.GLOBAL.JSoop = JSoop;
}());

//This is needed because method.caller is not available in strict mode.
(function () {
    JSoop.error = function () {
        //BUG FIX:
        //Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
        var nArgs = arguments,
            error = nArgs[0],
            method = JSoop.error.caller;

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
}());
