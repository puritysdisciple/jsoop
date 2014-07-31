(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopFunction = JSoop.util.Function = {};

    JSoopFunction.bind = function (fn, scope) {
        return function () {
            return fn.apply(scope, arguments);
        };
    };

    JSoop.bind = JSoopFunction.bind;
}());
