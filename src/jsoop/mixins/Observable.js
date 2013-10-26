(function () {
    "use strict";

    var eventOptions = {
            single: true,
            scope: true
        },
        JSoopEvent = function () {
            this.listeners = [];
        };

    JSoop.apply(JSoopEvent.prototype, {
        addListener: function (listener) {
            var me = this;

            listener = me.initListener(listener);

            me.listeners.push(listener);
        },

        initListener: function (listener) {
            var me = this;

            listener.callFn = listener.fn;

            if (listener.single) {
                listener.callFn = me.createSingle(listener);
            }

            if (listener.scope) {
                listener.callFn = me.createScope(listener);
            }

            return listener;
        },

        createSingle: function (listener) {
            var me = this,
                callFn = listener.callFn;

            return function () {
                var ret = callFn.apply(this, arguments);

                me.removeListener(listener.fn);

                return ret;
            };
        },

        createScope: function (listener) {
            var callFn = listener.callFn;

            return function () {
                return callFn.apply(listener.scope, arguments);
            };
        },

        removeListener: function (fn) {
            var me = this,
                i,
                length;

            for (i = 0, length = me.listeners.length; i < length; i = i + 1) {
                if (me.listeners[i].fn === fn) {
                    me.listeners.splice(i, 1);

                    return;
                }
            }
        },

        removeAllListeners: function () {
            this.listeners = [];
        },

        fire: function () {
            var me = this,
                listeners = me.listeners.slice(),
                i,
                length;

            for (i = 0, length = listeners.length; i < length; i = i + 1) {
                if (listeners[i].callFn.apply(this, arguments) === false) {
                    return;
                }
            }
        }
    });

    JSoop.define('JSoop.mixins.Observable', {
        isObservable: true,

        fnAlias: {
            addListener: 'on',
            removeListener: 'un',

            addManagedListener: 'mon',
            removeManagedListener: 'mun'
        },

        constructor: function () {
            var me = this;

            if (me.listeners) {
                me.on(me.listeners);
            }
        },

        addEvents: function () {
            var me = this,
                i,
                length;

            me.events = me.events || {};

            for (i = 0, length = arguments.length; i < length; i = i + 1) {
                if (!me.events[arguments[i]]) {
                    me.events[arguments[i]] = new JSoopEvent();
                }
            }
        },

        addListener: function (ename, callback, scope, options) {
            var me = this,
                listeners = ename,
                defaultOptions = {},
                listener,
                key;

            if (!JSoop.isObject(listeners)) {
                listeners = {
                    ename: listeners,
                    fn: callback,
                    scope: scope
                };
            }

            if (listeners.ename) {
                if (options) {
                    JSoop.apply(listeners, options);
                }

                if (!me.hasEvent(listeners.ename)) {
                    me.addEvents(listeners.ename);
                }

                me.events[listeners.ename].addListener(listeners);
            } else {
                //Find the default options
                for (key in listeners) {
                    if (listeners.hasOwnProperty(key) && eventOptions.hasOwnProperty(key)) {
                        defaultOptions[key] = listeners[key];
                    }
                }

                //Add the listeners
                for (key in listeners) {
                    if (listeners.hasOwnProperty(key) && !eventOptions.hasOwnProperty(key)) {
                        listener = listeners[key];

                        if (JSoop.isObject(listener)) {
                            listener.ename = key;
                        } else if (JSoop.isFunction(listener)) {
                            listener = {
                                ename: key,
                                fn: listener
                            };
                        }

                        JSoop.applyIf(listener, defaultOptions);

                        me.addListener(listener);
                    }
                }
            }
        },
        hasEvent: function (ename) {
            return (this.events || {}).hasOwnProperty(ename);
        },
        removeListener: function (ename, fn) {
            var me = this;

            if (!me.hasEvent(ename)) {
                return;
            }

            me.events[ename].removeListener(fn);
        },
        removeAllListeners: function (ename) {
            var me = this,
                key;

            if (!ename) {
                for (key in me.events) {
                    if (me.events.hasOwnProperty(key)) {
                        me.events[key].removeAllListeners();
                    }
                }

                return;
            }

            if (!me.hasEvent(ename)) {
                return;
            }

            me.events[ename].removeAllListeners();
        },
        fireEvent: function () {
            var me = this,
                args = Array.prototype.slice.call(arguments, 0),
                ename = args.shift(),
                nativeCallbackName = 'on' + ename.substr(0, 1).toUpperCase() + ename.substr(1);

            if (me[nativeCallbackName] && JSoop.isFunction(me[nativeCallbackName])) {
                if (me[nativeCallbackName].apply(me, args) === false) {
                    return;
                }
            }

            if (!me.hasEvent(ename)) {
                return;
            }

            me.events[ename].fire.apply(me.events[ename], args);
        },
        addManagedListener: function (observable, ename, fn, scope, options) {
            var me = this,
                managedListeners = me.managedListeners = me.managedListeners || [];

            managedListeners.push({
                observable: observable,
                ename: ename,
                fn: fn
            });

            observable.on(ename, fn, scope, options);
        },
        removeManagedListener: function (observable, ename, fn) {
            var me = this,
                managedListeners = (me.managedListeners)? me.managedListeners.slice() : [],
                i, length;

            for (i = 0, length = managedListeners.length; i < length; i = i + 1) {
                me.removeManagedListenerItem(false, managedListeners[i], observable, ename, fn);
            }
        },
        removeManagedListenerItem: function (clear, listener, observable, ename, fn) {
            var me = this,
                managedListeners = me.managedListeners || [];

            if (clear || (listener.observable === observable && (!ename || listener.ename === ename) && (!fn || listener.fn === fn))) {
                listener.observable.un(listener.ename, listener.fn);

                managedListeners.splice(managedListeners.indexOf(listener), 1);
            }
        },

        removeAllManagedListeners: function () {
            var me = this,
                managedListeners = (me.managedListeners)? me.managedListeners.slice() : [],
                i, length;

            for (i = 0, length = managedListeners.length; i < length; i = i + 1) {
                me.removeManagedListenerItem(true, managedListeners[i]);
            }
        }
    });
}());
