(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopFunction = JSoop.util.Function = {};

    JSoopFunction.bind = function (fn, scope) {
        return function () {
            fn.apply(scope, arguments);
        };
    };

    JSoop.bind = JSoopFunction.bind;
}());
