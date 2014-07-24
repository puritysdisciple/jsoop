(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopString = JSoop.util.String = {};

    JSoopString.getByteCount = function (str) {
        var bytes = 0,
            i = 0,
            length = str.length;

        for (; i < length; i = i + 1) {
            bytes = bytes + (s[i].charCodeAt(0) <= 0x0007FF ? 1 : 2);
        }

        return bytes;
    };

    JSoopString.padLeft = function (str, length, fill) {
        var i;

        str = str + '';

        for (i = str.length; i < length; i = i + 1) {
            str = fill + str;
        }

        return str;
    };

    JSoopString.padRight = function (str, length, fill) {
        var i;

        str = str + '';

        for (i = str.length; i < length; i = i + 1) {
            str = str + fill;
        }

        return str;
    };
}());
