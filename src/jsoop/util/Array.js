(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopArray = JSoop.util.Array = {};

    JSoopArray.toArray = function (obj) {
        if (!JSoop.isArray(obj)) {
            return [obj];
        }

        return obj;
    };

    JSoopArray.each = function (arr, fn, scope) {
        if (!scope) {
            scope = JSoop.GLOBAL;
        }

        if (!JSoop.isArray(arr)) {
            return fn.call(scope, arr, 0, [arr]);
        }

        var i, length;

        for (i = 0, length = arr.length; i < length; i = i + 1) {
            if (fn.call(scope, arr[i], i, arr) === false) {
                return false;
            }
        }

        return true;
    };

    JSoop.toArray = JSoopArray.toArray;
    JSoop.each = JSoopArray.each;
}());
