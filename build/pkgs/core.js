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

        constructor: function () {
            return this;
        },

        init: JSoop.emptyFn,

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

            return me.getInstantiator(args.length)(cls, args);
        }
    });

    JSoop.apply(CM.processors, {
        //This is needed to stop the extend property from showing up in the prototype
        extend: function () {},

        alias: function (className, cls, config, callback) {
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
        },

        fnAlias: function (className, cls, config, callback) {
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
                        !reservedKeys[key] && key !== 'constructor') {
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

