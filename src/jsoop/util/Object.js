(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopObject = JSoop.util.Object = {};

    JSoopObject.clone = (function () {
        var clone = function (value) {
            var obj, i, length;

            if (JSoop.isPrimitive(value)) {
                return value;
            }

            if (JSoop.isArray(value)) {
                obj = [];

                for (i = 0, length = value.length; i < length; i = i + 1) {
                    obj.push(clone(value[i]));
                }

                return obj;
            }

            if (JSoop.isObject(value)) {
                obj = {};

                for (i in value) {
                    if (value.hasOwnProperty(i)) {
                        obj[i] = clone(value[i]);
                    }
                }

                return obj;
            }

            return value;
        };

        return clone;
    }());

    JSoopObject.query = function (path, root) {
        var parts = path.split('.'),
            i,
            length;

        root = root || JSoop.GLOBAL;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (root[parts[i]] === undefined) {
                return undefined;
            }

            root = root[parts[i]];
        }

        return root;
    };

    JSoopObject.apply = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    };

    JSoopObject.applyIf = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    JSoopObject.iterate = function (obj, fn, scope) {
        var hasConstructor = false;

        if (!JSoop.isObject(obj)) {
            return false;
        }

        var key;

        if (!scope) {
            scope = JSoop.GLOBAL;
        }

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === 'constructor') {
                    hasConstructor = true;
                }

                if (fn.call(scope, obj[key], key, obj) === false) {
                    return false;
                }
            }
        }


        //IE8 doesn't find 'constructor' as a valid key as such we need to do it manually
        if (!hasConstructor && obj.hasOwnProperty('constructor')) {
            if (fn.call(scope, obj.constructor, 'constructor', obj) === false) {
                return false;
            }
        }

        return true;
    };

    JSoop.clone = JSoopObject.clone;
    JSoop.objectQuery = JSoopObject.query;
    JSoop.apply = JSoopObject.apply;
    JSoop.applyIf = JSoopObject.applyIf;
    JSoop.iterate = JSoopObject.iterate;
}());
