(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopString = JSoop.util.String = {};

    JSoopString.getBytes = function (s) {
        var bytes = 0;

        for (var i=0; i<s.length; i++) {
            bytes += (s[i].charCodeAt(0) <= 0x0007FF ? 1 : 2);
        }
        return bytes;
    };

    JSoop.getBytes = JSoopString.getBytes;
}());
