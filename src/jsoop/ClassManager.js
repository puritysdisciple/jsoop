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
        ClassManager = JSoop.ClassManager = {},
        initMixin = function (mixin, args) {
            var me = this;

            if (!args) {
                args = [];
            }

            me.mixins[mixin].prototype.constructor.apply(me, args);
        };

    JSoop.apply(ClassManager, {
        set: function (className, cls) {
            classCache[className] = cls;

            var namespace = className.split('.');

            className = namespace.pop();

            if (namespace.length > 0) {
                namespace = JSoop.namespace(namespace.join('.'));
            } else {
                namespace = JSoop.GLOBAL;
            }

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
                cls = JSoop.objectQuery(className);

                if (cls) {
                    classCache[className] = cls;
                }
            }

            //<debug>
            if (!cls) {
                JSoop.error('"' + className + '" is not defined');
            }
            //</debug>

            return me.getInstantiator(args.length)(cls, args);
        },

        get: function (name) {
            var Cls = name;

            if (JSoop.isString(Cls)) {
                Cls = JSoop.objectQuery(Cls);
            } else if (name.$isClass) {
                Cls = name;
                name = Cls.prototype.$className;
            }

            //<debug>
            if (!Cls) {
                JSoop.error(name + ' is not defined');
            }
            //</debug>

            return Cls;
        },

        /*---------------------------------------------------------------------------------------------------*
         * Used to Create Classes
         *---------------------------------------------------------------------------------------------------*/
        preprocessors: {},
        defaultPreprocessors: [],

        postProcessors: {},
        defaultPostProcessors: [],

        create: function (className, data, onCreated) {
            if (classCache[className]) {
                JSoop.error('A class named "' + className + '" is already defined');

                return;
            }

            if (JSoop.isFunction(data)) {
                data = data();
            }

            JSoop.applyIf(data, {
                extend: 'JSoop.Base'
            });

            var Cls = makeConstructor(),
                requires;

            requires = JSoop.toArray(data.requires || []);
            requires.push(data.extend);

            JSoop.Loader.require(requires);

            delete data.requires;

            onCreated = ClassManager.createPostProcessor(className, data, onCreated);

            ClassManager.process(Cls, data, onCreated);
        },

        createPostProcessor: function (className, data, onCreated) {
            onCreated = onCreated || JSoop.emptyFn;

            return function (Cls) {
                var postProcessors = ClassManager.defaultPostProcessors,
                    length = postProcessors.length,
                    i = 0,
                    postProcessor,
                    ret;

                for (; i < length; i = i + 1) {
                    postProcessor = postProcessors[i];

                    if (JSoop.isString(postProcessor)) {
                        postProcessor = ClassManager.postProcessors[postProcessor];
                    }

                    ret = postProcessor.call(Cls, className, Cls, data);

                    if (ret !== undefined) {
                        Cls = ret;
                    }
                }

                onCreated.call(Cls, Cls);
            };
        },

        addPreprocessor: function (name, fn, pos) {
            var defaultPreprocessors = ClassManager.defaultPreprocessors;

            ClassManager.preprocessors[name] = fn;

            if (pos !== undefined) {
                defaultPreprocessors.splice(pos, 0, name);
            } else {
                defaultPreprocessors.push(name);
            }
        },

        addPostProcessor: function (name, fn, pos) {
            var defaultPostProcessors = ClassManager.defaultPostProcessors;

            ClassManager.postProcessors[name] = fn;

            if (pos !== undefined) {
                defaultPostProcessors.splice(pos, 0, name);
            } else {
                defaultPostProcessors.push(name);
            }
        },

        onBeforeCreated: function (data, hooks) {
            var me = this,
                foundConstructor = false,
                key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    if (key === 'constructor') {
                        foundConstructor = true;
                    }

                    BP.addMember.call(me, key, data[key]);
                }
            }

            //IE8 doesn't find 'constructor' as a valid key as such we need to do it manually
            if (!foundConstructor && data.hasOwnProperty('constructor')) {
                BP.addMember.call(me, 'constructor', data.constructor);
            }

            hooks.onCreated.call(me, me);
        },

        process: function (Cls, data, onCreated) {
            var preprocessors = data.preprocessors || ClassManager.defaultPreprocessors,
                preprocessStack = [],
                hooks = {
                    onBeforeCreated: ClassManager.onBeforeCreated
                },
                length = preprocessors.length,
                i = 0,
                preprocessor;

            delete data.preprocessors;

            for (; i < length; i = i + 1) {
                preprocessor = preprocessors[i];

                if (JSoop.isString(preprocessor)) {
                    preprocessor = ClassManager.preprocessors[preprocessor];
                }

                preprocessStack.push(preprocessor);
            }

            hooks.onCreated = onCreated || JSoop.emptyFn;
            hooks.preprocessors = preprocessStack;

            ClassManager.doProcess(Cls, data, hooks);
        },

        doProcess: function (Cls, data, hooks) {
            var preprocessors = hooks.preprocessors,
                preprocessor = preprocessors.shift();

            for (; preprocessor; preprocessor = preprocessors.shift()) {
                preprocessor(Cls, data, hooks);
            }

            hooks.onBeforeCreated.call(Cls, data, hooks);
        },

        extend: function (parent) {
            var me = this,
                parentPrototype = parent.prototype,
                prototype, basePrototype, key;

            prototype = me.prototype = JSoop.chain(parentPrototype);

            if (!prototype.$isClass) {
                basePrototype = JSoop.Base.prototype;

                for (key in basePrototype) {
                    if (basePrototype.hasOwnProperty(key)) {
                        prototype[key] = basePrototype[key];
                    }
                }
            }

            prototype.$class = me;
            prototype.superClass = parent;

            prototype.constructor = parentPrototype.constructor;

            if (parent.onExtended) {
                prototype.onExtended = parent.onExtended.slice();
            }
        },

        mixin: function (name, mixin, data, hooks) {
            var me = this,
                prototype = me.prototype,
                key, fn, mixinPrototype, mixinName;

            if (!prototype.mixins) {
                prototype.mixins = {};
            }

            if (JSoop.isString(mixin)) {
                mixinName = mixin;
                mixin = JSoop.objectQuery(mixin);

                //<debug>
                if (!mixin) {
                    JSoop.error('Mixin "' + mixinName + '" is not defined');
                }
                //</debug>
            }

            mixinPrototype = mixin.prototype;

            for (key in mixinPrototype) {
                if (mixinPrototype.hasOwnProperty(key) && !prototype[key] && key !== 'onMixedIn') {
                    prototype[key] = mixinPrototype[key];
                }
            }

            if (mixinPrototype.onMixedIn) {
                mixinPrototype.onMixedIn.call(me, data, hooks);
            }

            prototype.mixins[name] = mixin;
        },

        onExtended: function (fn) {
            var me = this.prototype;

            if (!me.onExtended) {
                me.onExtended = [];
            }

            me.onExtended.push(fn);
        },

        triggerExtended: function (data, hooks) {
            var me = this.prototype,
                i = 0,
                length = (me.onExtended)? me.onExtended.length : 0;

            for (; i < length; i = i + 1) {
                me.onExtended[i].call(me, data, hooks);
            }
        }
    });

    /*
     * Preprocessors
     */

    ClassManager.addPreprocessor('extend', function (Cls, data, hooks) {
        var parentClass = JSoop.ClassManager.get(data.extend);

        delete data.extend;

        ClassManager.extend.call(Cls, parentClass);

        if (data.onExtended) {
            ClassManager.onExtended.call(Cls, data.onExtended);

            delete data.onExtended;
        }

        ClassManager.triggerExtended.call(Cls, data, hooks);
    });

    ClassManager.addPreprocessor('mixin', function (Cls, data, hooks) {
        var mixins = data.mixins,
            key;

        delete data.mixins;

        if (mixins) {
            if (Cls.prototype.mixins) {
                JSoop.applyIf(mixins, Cls.prototype.mixins);
            }

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    ClassManager.mixin.call(Cls, key, mixins[key], data, hooks);
                }
            }

            Cls.prototype.initMixin = initMixin;
        }
    });

    /*
     * Post Processors
     */

    ClassManager.addPostProcessor('fnAlias', function (className, Cls, data) {
        var aliases = data.fnAlias || {},
            key;

        delete data.fnAlias;

        for (key in aliases) {
            if (aliases.hasOwnProperty(key)) {
                BP.alias.call(Cls, key, aliases[key]);
            }
        }
    });
    ClassManager.addPostProcessor('singleton', function (className, Cls, data) {
        if (data.singleton) {
            return new Cls();
        }
    });
    ClassManager.addPostProcessor('statics', function (className, Cls, data) {
        var statics = data.statics || {},
            key;

        delete data.statics;

        for (key in statics) {
            if (statics.hasOwnProperty(key)) {
                Cls[key] = statics[key];
            }
        }
    });
    ClassManager.addPostProcessor('set', function (className, Cls, data) {
        var prototype = (Cls.prototype)? Cls.prototype : Cls.$class.prototype;

        prototype.$className = className;

        ClassManager.set(className, Cls);
    });
    ClassManager.addPostProcessor('alias', function (className, Cls, data) {
        var alias = data.alias || [],
            i = 0,
            length;

        delete data.alias;

        if (!alias) {
            return;
        }

        alias = JSoop.toArray(alias);

        for (length = alias.length; i < length; i = i + 1) {
            classCache[alias[i]] = Cls;
        }
    });

    JSoop.define = function () {
        ClassManager.create.apply(ClassManager, arguments);
    };

    JSoop.create = function () {
        return ClassManager.instantiate.apply(ClassManager, arguments);
    };
}());
