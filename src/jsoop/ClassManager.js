(function () {
    "use strict";

    var makeConstructor = function () {
            function constructor () {
                return this.constructor.apply(this, arguments) || null;
            }

            return constructor;
        },
        reservedKeys = {
            $class: true,
            $className: true,
            superClass: true
        },
        classCache = {},
        BP = JSoop.Base.prototype,
        CM = JSoop.ClassManager = {};

    JSoop.apply(CM, {
        processors: {},

        create: function (className, config, callback) {
            if (classCache[className]) {
                JSoop.error('A class named "' + className + '" is already defined');

                return;
            }

            if (JSoop.isFunction(config)) {
                config = config();
            }

            JSoop.applyIf(config, {
                extend: 'JSoop.Base'
            });

            var me = this,
                newClass = makeConstructor(),
                processors = [],
                requires, key;

            requires = JSoop.toArray(config.requires || []);
            requires.push(config.extend);

            JSoop.Loader.require(requires);

            delete config.requires;

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

            if (newClass.prototype.superClass.prototype.hasOwnProperty('$onExtend')) {
                processors.push('$onExtend');
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

            processors.sort(function (a, b) {
                return a.weight - b.weight;
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
                cls = className;

            if (JSoop.isString(cls)) {
                cls = classCache[className];
            }

            if (!cls) {
                JSoop.error('"' + className + '" is not defined');
            }

            return me.getInstantiator(args.length)(cls, args);
        }
    });

    function addProcessor (name, fn, weight) {
        if (weight === undefined) {
            weight = 0;
        }

        fn.weight = weight;

        CM.processors[name] = fn;
    }

    addProcessor('extend', JSoop.emptyFn);
    addProcessor('alias', function (className, cls, config, callback) {
        var aliases = config.alias;

        if (!aliases) {
            config.aliases = [];
        }

        if (!JSoop.isArray(aliases)) {
            aliases = [aliases];
        }

        JSoop.each(aliases, function (otherName) {
            classCache[otherName] = cls;
        });
    });
    addProcessor('fnAlias', function (className, cls, config, callback) {
        var key,
            aliases = config.fnAlias;

        if (!aliases) {
            aliases = {};
        }

        for (key in aliases) {
            if (aliases.hasOwnProperty(key)) {
                BP.alias.call(cls, key, aliases[key]);
            }
        }
    });
    addProcessor('mixins', function (className, cls, config, callback) {
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
                if (mixin.prototype.hasOwnProperty(key)
                    && !reservedKeys[key]
                    && key !== 'constructor'
                    && !cls.prototype.hasOwnProperty(key)) {
                    cls.prototype[key] = mixin.prototype[key];
                }
            }
        });
    }, 1);
    addProcessor('singleton', function (className, cls, config, callback) {
        if (!config.singleton) {
            return true;
        }

        callback.call(CM, className, new cls(), config, callback);

        return false;
    }, 4);
    addProcessor('statics', function (className, cls, config, callback) {
        if (!config.statics) {
            config.statics = {};
        }

        JSoop.iterate(config.statics, function (member, key) {
            cls[key] = member;
        });
    }, 5);
    addProcessor('$onExtend', function (className, cls, config, callback) {
        cls.prototype.superClass.prototype.$onExtend(cls, config);
    }, 3);

    JSoop.define = function () {
        CM.create.apply(CM, arguments);
    };

    JSoop.create = function () {
        return CM.instantiate.apply(CM, arguments);
    };
}());
