(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var ArrayProto = Array.prototype,
        JSoopArray = JSoop.util.Array = {};

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

    if (ArrayProto.indexOf) {
        JSoopArray.indexOf = function (arr, searchElement, fromIndex) {
            return arr.indexOf(searchElement, fromIndex);
        };
    } else {
        //Taken from Mozilla Array.prototype.indexOf Polyfill
        JSoopArray.indexOf = function (arr, searchElement, fromIndex) {
            var k, O, len, n;

            // 1. Let O be the result of calling ToObject passing
            //    the this value as the argument.
            if (arr == null) {
                throw new TypeError('"arr" is null or not defined');
            }

            O = Object(arr);

            // 2. Let lenValue be the result of calling the Get
            //    internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            len = O.length >>> 0;

            // 4. If len is 0, return -1.
            if (len === 0) {
                return -1;
            }

            // 5. If argument fromIndex was passed let n be
            //    ToInteger(fromIndex); else let n be 0.
            n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
                n = 0;
            }

            // 6. If n >= len, return -1.
            if (n >= len) {
                return -1;
            }

            // 7. If n >= 0, then Let k be n.
            // 8. Else, n<0, Let k be len - abs(n).
            //    If k is less than 0, then let k be 0.
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 9. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the
                //    HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                //    i.  Let elementK be the result of calling the Get
                //        internal method of O with the argument ToString(k).
                //   ii.  Let same be the result of applying the
                //        Strict Equality Comparison Algorithm to
                //        searchElement and elementK.
                //  iii.  If same is true, return k.
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k = k + 1;
            }

            return -1;
        };
    }

    JSoop.toArray = JSoopArray.toArray;
    JSoop.each = JSoopArray.each;
}());
