(function () {
    "use strict";

    var toString = Object.prototype.toString,
        JSoop = {};

    //CONSTANTS
    JSoop.GLOBAL   = Function('return this')();

    JSoop.STRING   = 1;
    JSoop.ARRAY    = 2;
    JSoop.NUMBER   = 3;
    JSoop.OBJECT   = 4;
    JSoop.ELEMENT  = 5;
    JSoop.BOOL     = 6;
    JSoop.FUNCTION = 7;

    //Methods
    JSoop.is = function (obj, type) {
        if (JSoop.isString(type)) {
            return JSoop.instanceOf(obj, type);
        }

        switch (type) {
        case JSoop.BOOL:
            return JSoop.isBool(obj);
        case JSoop.STRING:
            return JSoop.isString(obj);
        case JSoop.ARRAY:
            return JSoop.isArray(obj);
        case JSoop.NUMBER:
            return JSoop.isNumber(obj);
        case JSoop.OBJECT:
            return JSoop.isObject(obj);
        case JSoop.ELEMENT:
            return JSoop.isElement(obj);
        case JSoop.FUNCTION:
            return JSoop.isFunction(obj);
        default:
            return false;
        }
    };

    JSoop.isString = function (obj) {
        return typeof obj === 'string';
    };

    JSoop.isArray = function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    JSoop.isBool = function (obj) {
        return typeof obj === 'boolean';
    };

    JSoop.isNumber = function (obj) {
        return typeof obj === 'number';
    };

    JSoop.isObject = function (obj) {
        return obj instanceof Object && obj.constructor === Object;
    };

    JSoop.isElement = function (obj) {
        return obj ? obj.nodeType === 1 : false;
    };

    JSoop.isPrimative = function (obj) {
        var type = typeof obj;

        return type === 'string' || type === 'number' || type === 'boolean';
    };

    JSoop.isFunction = function (obj) {
        return toString.call(obj) === '[object Function]';
    };

    JSoop.instanceOf = function (obj, type) {
        if (JSoop.isString(type)) {
            type = JSoop.objectQuery(type);
        }

        return obj instanceof type;
    };

    JSoop.iterate = function (obj, fn) {
        if (!JSoop.isObject(obj)) {
            return false;
        }

        var key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (fn(obj[key], key, obj) === false) {
                    return false;
                }
            }
        }

        return true;
    };

    JSoop.each = function (arr, fn) {
        if (!JSoop.isArray(arr)) {
            return fn(arr, 0, [arr]);
        }

        var i, length;

        for (i = 0, length = arr.length; i < length; i = i + 1) {
            if (fn(arr[i], i, arr) === false) {
                return false;
            }
        }

        return true;
    };

    JSoop.apply = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    };

    JSoop.applyIf = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    };

    JSoop.namespace = function (path) {
        var parts = path.split('.'),
            obj = JSoop.GLOBAL,
            i,
            length;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (obj[parts[i]] === undefined) {
                obj[parts[i]] = {};
            }

            obj = obj[parts[i]];
        }

        return obj;
    };

    JSoop.objectQuery = function (path, root) {
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

    JSoop.clone = (function () {
        function clone (value) {
            var obj, i, length;

            if (JSoop.isPrimative(value)) {
                return value;
            } else if (JSoop.isArray(value)) {
                obj = [];

                for (i = 0, length = value.length; i < length; i = i + 1) {
                    obj.push(clone(value[i]));
                }

                return obj;
            } else if (JSoop.isObject(value)) {
                obj = {};

                for (i in value) {
                    if (value.hasOwnProperty(i)) {
                        obj[i] = clone(value[i]);
                    }
                }

                return obj;
            }

            return value;
        }

        return clone;
    }());

    JSoop.emptyFn = function () {};

    JSoop.log = (console)? console.log.bind(console) : JSoop.emptyFn;

    JSoop.GLOBAL.JSoop = JSoop;
}());

//This is needed because method.caller is not available in strict mode.
(function () {
    JSoop.error = function (error) {
        //BUG FIX:
        //Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
        var nArgs = arguments,
            method = this.error.caller;

        if (JSoop.isString(error)) {
            error = {
                level: 'error',
                msg: error,
                stack: true
            };
        }

        if (method) {
            if (method.$name) {
                error.sourceMethod = method.$name;
            }

            if (method.$owner) {
                error.sourceClass = method.$owner.$className;
            }
        }

        if (JSoop.throwErrors !== false) {
            JSoop.log(error);
        }

        throw error.msg;
    };
}());
(function () {
    "use strict";

    var Base = JSoop.Base = function () {},
        EmptyClass = function () {},
        create = Object.create || function (obj) {
            var newObj;

            EmptyClass.prototype = obj;

            newObj = new EmptyClass();

            EmptyClass.prototype = null;

            return newObj;
        };

    Base.prototype = {
        $className: 'JSoop.Base',
        $class: Base,
        $isClass: true,

        initConfig: function (config) {
            var me = this,
                defaults = me.defaults,
                currentProto = me.$class.prototype;

            if (!config) {
                config = {};
            }

            me.originalConfig = config;

            while (defaults) {
                JSoop.applyIf(config || {}, JSoop.clone(defaults));

                if (currentProto.superClass) {
                    currentProto = currentProto.superClass.prototype;
                    defaults = currentProto.defaults;
                } else {
                    defaults = false;
                }
            }

            JSoop.apply(me, config);
        },

        constructor: function (config) {
            var me = this;

            me.initConfig(config || {});

            me.init();

            return me;
        },

        addMember: function (name, member) {
            var me = this;

            if (JSoop.isFunction(member)) {
                me.prototype.addMethod.call(me, name, member);
            } else {
                me.prototype.addProperty.call(me, name, member);
            }
        },

        addMethod: function (name, method) {
            var me = this;

            method.$owner = me;
            method.$name = name;

            me.prototype[name] = method;
        },

        addProperty: function (name, property) {
            this.prototype[name] = property;
        },

        alias: function (method, alias) {
            var me = this,
                prototype = me.prototype;

            if (JSoop.isString(alias)) {
                alias = {
                    name: alias
                };
            }

            JSoop.applyIf(alias, {
                root: prototype
            });

            if (JSoop.isString(alias.root)) {
                alias.root = JSoop.objectQuery(alias.root);
            }

            alias.root[alias.name] = prototype[method];
        },

        extend: function (parentClassName) {
            var parentClass = parentClassName;

            if (JSoop.isString(parentClass)) {
                parentClass = JSoop.objectQuery(parentClass);
            }

            if (!parentClass) {
                JSoop.error(parentClassName + ' is not defined');
            }

            var me = this,
                key;

            me.prototype = create(parentClass.prototype);

            me.superClass = me.prototype.superClass = parentClass;

            if (!parentClass.prototype.$isClass) {
                for (key in Base.prototype) {
                    if (Base.prototype.hasOwnProperty(key)) {
                        me.prototype[key] = Base.prototype[key];
                    }
                }
            }

            me.prototype.$class = me;
        }
    };
}());

//This is needed because method.caller is not available in strict mode.
(function () {
    JSoop.Base.prototype.callParent = function (args) {
        var me = this,
        //BUG FIX: Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
            tmpArgs = arguments,
            method = me.callParent.caller,
            methodName,
            parentClass,
            tempClass;

        if (method !== null && !method.$owner) {
            if (!method.caller) {
                JSoop.error('Unable to locate method for callParent to execute.');
            }

            method = method.caller;
        }

        if (!method.$owner) {
            JSoop.error('Unable to resolve method for callParent. Make sure all methods are added using JSoop.define.');
        }

        methodName = method.$name;
        parentClass = method.$owner.superClass;

        tempClass = parentClass;

        //Crawl up the class chain to make sure the class has the called method.
        do {
            if (tempClass.prototype.hasOwnProperty(methodName)) {
                break;
            }

            tempClass = tempClass.superClass;
        } while (tempClass);

        if (!tempClass) {
            JSoop.error('No parent method "' + methodName + '" was found in ' + parentClass.prototype.$className + '.');
        }

        return parentClass.prototype[methodName].apply(this, args || []);
    }
}());
(function () {
    "use strict";

    var makeConstructor = function () {
            function constructor () {
                return this.constructor.apply(this, arguments) || null;
            }

            return constructor;
        },
        aliasCache = {},
        classCache = {},
        BP = JSoop.Base.prototype,
        CM = JSoop.ClassManager = {};

    JSoop.apply(CM, {
        processors: {},

        create: function (className, config, callback) {
            if (classCache[className]) {
                //Todo: throw an error if the class has already been defined

                return;
            }

            JSoop.applyIf(config, {
                extend: 'JSoop.Base'
            });

            var me = this,
                newClass = makeConstructor(),
                processors = [],
                key;

            BP.extend.call(newClass, config.extend);
            newClass.prototype.$className = className;

            //At this point we have a new class that extends the specified class.
            //Now we need to apply all the new members to it from the config.
            for (key in config) {
                if (config.hasOwnProperty(key)) {
                    if (!CM.processors.hasOwnProperty(key)) {
                        BP.addMember.call(newClass, key, config[key]);
                    } else {
                        processors.push(key);
                    }
                }
            }

            config.onCreate = callback || JSoop.emptyFn;

            //Initialize and execute all processors found while adding members.
            me.initProcessors(processors, config);

            me.process.call(CM, className, newClass, config, CM.process);
        },

        initProcessors: function (processors, config) {
            JSoop.each(processors, function (processor, index) {
                processors[index] = CM.processors[processor];
            });

            config.processors = processors;
        },

        process: function (className, cls, config, callback) {
            var me = this,
                processor = config.processors.shift();

            if (!processor) {
                me.set(className, cls);

                config.onCreate(cls);

                return;
            }

            if (processor.call(CM, className, cls, config, callback) !== false) {
                callback.call(CM, className, cls, config, callback);
            }
        },

        set: function (className, cls) {
            classCache[className] = cls;

            var namespace = className.split('.');

            className = namespace.pop();

            namespace = JSoop.namespace(namespace.join('.'));

            namespace[className] = cls;
        },

        getInstantiator: function (length) {
            var me = this,
                args,
                i;

            me.instantiators = me.instantiators || [];

            if (length > 3) {
                //Todo: issue a warning when attempting to use more than three arguments.
            }

            if (!me.instantiators[length]) {
                args = [];

                for (i = 0; i < length; i = i + 1) {
                    args.push('a[' + i + ']');
                }

                me.instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ');');
            }

            return me.instantiators[length];
        },

        instantiate: function () {
            var me = this,
                args = Array.prototype.slice.call(arguments, 0),
                className = args.shift(),
                cls = classCache[className];

            return me.getInstantiator(args.length)(cls, args);
        }
    });

    JSoop.apply(CM.processors, {
        //This is needed to stop the extend property from showing up in the prototype
        extend: function () {},

        aliases: function (className, cls, config, callback) {
            var key;

            if (!config.aliases) {
                config.aliases = {};
            }

            for (key in config.aliases) {
                if (config.aliases.hasOwnProperty(key)) {
                    BP.alias.call(cls, key, config.aliases[key]);
                }
            }
        },

        mixins: function (className, cls, config, callback) {
            if (!config.mixins) {
                config.mixins = {};
            }

            cls.prototype.mixins = {};

            JSoop.iterate(config.mixins, function (mixin, name) {
                if (JSoop.isString(mixin)) {
                    mixin = JSoop.objectQuery(mixin);
                }

                cls.prototype.mixins[name] = mixin;

                var key;

                for (key in mixin.prototype) {
                    if (mixin.prototype.hasOwnProperty(key) &&
                        key !== 'constructor' && key.indexOf('$') === -1) {
                        cls.prototype[key] = mixin.prototype[key];
                    }
                }
            });
        },

        singleton: function (className, cls, config, callback) {
            if (!config.singleton) {
                return true;
            }

            callback.call(CM, className, new cls(), config, callback);

            return false;
        },

        statics: function (className, cls, config, callback) {
            if (!config.statics) {
                config.statics = {};
            }

            JSoop.iterate(config.statics, function (member, key) {
                cls[key] = member;
            });
        }
    });

    JSoop.define = function () {
        CM.create.apply(CM, arguments);
    };

    JSoop.create = function () {
        return CM.instantiate.apply(CM, arguments);
    };
}());

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
            var me = this;

            return function () {
                var ret = listener.callFn.apply(this, arguments);

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

        aliases: {
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

            if (!me.hasEvent(ename)) {
                return;
            }

            if (me[nativeCallbackName] && JSoop.isFunction(me[nativeCallbackName])) {
                if (me[nativeCallbackName].apply(me, args) === false) {
                    return;
                }
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

