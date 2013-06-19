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
            var me = this;

            if (me.defaults) {
                JSoop.applyIf(config || {}, JSoop.clone(me.defaults));
            }

            JSoop.apply(me, config);
        },

        constructor: function (config) {
            var me = this;

            me.initConfig(config || {});
            me.init();

            return me;
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

        extend: function (parentClass) {
            if (JSoop.isString(parentClass)) {
                parentClass = JSoop.objectQuery(parentClass);
            }

            var me = this;

            me.prototype = create(parentClass.prototype);

            me.superClass = parentClass;

            //Todo: Compensate for lack of JSoop.Base extend
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
