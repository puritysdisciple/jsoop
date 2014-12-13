(function () {
    var Loader = function () {};

    JSoop.apply(Loader.prototype, {
        filesLoaded: {},
        paths: {},
        addPath: function (alias, path) {
            Loader.paths[alias] = path;
        },
        onFileLoaded: function (url) {
            Loader.filesLoaded[url] = true;
        },
        require: function (cls) {
            var className, fn, path, i, length;

            cls = JSoop.toArray(cls);

            cls.forEach(function(v, i, a) {
                className = v;
                fn = JSoop.objectQuery(className);

                if (!fn) {
                    JSoop.log('Loading ' + className);

                    path = Loader.getPathFromClassName(className);
                    Loader.loadScriptFile(path, Loader.onFileLoaded, JSoop.error, true);

                    fn = JSoop.objectQuery(className);

                    if (!fn) {
                        JSoop.error('Class "' + className + '" is not defined');
                    }
                }
            });
        },
        getPathFromClassName: function (className) {
            var parts = className.split('.'),
                namespace = parts.shift();

            return Loader.paths[namespace] + parts.join('/') + '.js';
        },
        loadScriptFile: function (url, onLoad, onError, sync) {
            if (Loader.filesLoaded[url]) {
                return Loader;
            }

            Loader.loadFile(url, function (url, response) {
                eval(response);

                (onLoad || JSoop.emptyFn).call(Loader, response);
            }, onError, sync);
        },
        loadFile: function (url, onLoad, onError, sync) {
            sync = true; //force sync for now

            if (sync) {
                Loader.loadFileSync(url, onLoad, onError);
            } else {
                Loader.loadFileAsync(url, onLoad, onError);
            }
        },
        loadFileSync: function (url, onLoad, onError) {
            var isCrossOriginRestricted = false,
                scope = Loader,
                xhr, status;

            if (typeof XMLHttpRequest != 'undefined') {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }

            try {
                xhr.open('GET', url, false);
                xhr.send(null);
            } catch (e) {
                isCrossOriginRestricted = true;
            }

            onLoad = onLoad || JSoop.emptyFn;
            onError = onError || JSoop.emptyFn;

            status = (xhr.status === 1223) ? 204 :
                (xhr.status === 0 && ((self.location || {}).protocol == 'file:' || (self.location || {}).protocol == 'ionp:')) ? 200 : xhr.status;

            isCrossOriginRestricted = isCrossOriginRestricted || (status === 0);

            if (isCrossOriginRestricted) {
                onError.call(Loader, [
                    'Failed loading synchronously via XHR: "' + url + '"; It\'s likely that the file is either ',
                    'being loaded from a different domain or from the local file system whereby cross origin ',
                    'requests are not allowed due to security reasons.'
                ].join(''));
            } else if ((status >= 200 && status < 300) || (status === 304)) {
                onLoad.call(scope, url, xhr.responseText);
            } else {
                onError.call(Loader, 'Failed loading synchronously via XHR: "' + url + '"; please verify that the file exists. XHR status code: ' + status);
            }

            // Prevent potential IE memory leak
            xhr = null;
        }
    });

    Loader = JSoop.Loader = new Loader();
}());
