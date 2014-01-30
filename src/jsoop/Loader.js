(function () {
    'use strict';

    JSoop.Loader = new (function () {
        var Loader = this;

        JSoop.apply(Loader, {
            cleanScriptElement: function (script) {
                script.onload = script.onreadystatechange = script.onerror = null;
            },
            addScriptElement: function (url, onLoad, onError, scope) {
                var script = document.createElement('script'),
                    onLoadFn = function () {
                        onLoad.call(scope);
                        Loader.cleanScriptElement(script);
                    },
                    onErrorFn = function () {
                        onError.call(scope);
                        Loader.cleanScriptElement(script);
                    };

                script.type = 'text/javascript';
                script.onerror = onErrorFn;

                if ('addEventListener' in script) {
                    script.onload = onLoadFn;
                } else if ('readyState' in script) {
                    script.onreadystatechange = function() {
                        if (this.readyState == 'loaded' || this.readyState == 'complete') {
                            onLoadFn();
                        }
                    };
                } else {
                    script.onload = onLoadFn;
                }

                script.src = url;

                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
    });
}());