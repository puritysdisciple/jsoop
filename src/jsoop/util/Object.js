(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopObject = JSoop.util.Object = {};

    JSoopObject.clone = (function () {
        var clone = function (value) {
            var obj, i, length;

            if (JSoop.isPrimative(value)) {
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
        if (!JSoop.isObject(obj)) {
            return false;
        }

        var key;

        if (!scope) {
            scope = JSoop.GLOBAL;
        }

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (fn.call(scope, obj[key], key, obj) === false) {
                    return false;
                }
            }
        }

        return true;
    };

    // ie8 compatible for-in
    JSoopObject.forIn = function (obj, fn){
        var key,
            hasConstructor = false,
            filterKey = 'constructor';

        for (key in obj){
            if(key === filterKey){
                hasConstructor = true;
            }
            fn.call(obj, key);
        }

        if(!hasConstructor && obj.hasOwnProperty(filterKey)){
            fn.call(obj, filterKey);
        }
    };

    JSoop.clone = JSoopObject.clone;
    JSoop.objectQuery = JSoopObject.query;
    JSoop.apply = JSoopObject.apply;
    JSoop.applyIf = JSoopObject.applyIf;
    JSoop.iterate = JSoopObject.iterate;
    JSoop.forIn = JSoopObject.forIn;
}());
