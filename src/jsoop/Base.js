(function () {
    "use strict";

    var Base = JSoop.Base = function () {},
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
            var me = this,
                prototype = me.prototype,
                parent = prototype[name];

            if (method !== JSoop.emptyFn) {
                method.$owner = me;
                method.$name = name;

                if (parent) {
                    method.$parent = parent;
                }

                method.displayName = me.$className + '::' + name;
            }

            prototype[name] = method;
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

        onExtended: [],

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
                    if (Base.prototype.hasOwnProperty(key) && key !== 'constructor') {
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
            method = me.callParent.caller;

        //<debug>
        if (method !== null && !method.$owner) {
            if (!method.caller) {
                JSoop.error('Unable to locate method for callParent to execute.');
            }

            method = method.caller;
        }

        if (!method.$owner) {
            JSoop.error('Unable to resolve method for callParent. Make sure all methods are added using JSoop.define.');
        }

        if (!method.$parent) {
            JSoop.error('No parent method "' + method.$name + '" was found.');
        }
        //</debug>

        return method.$parent.apply(this, args || []);
    }
}());
