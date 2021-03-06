(function () {
    "use strict";

    JSoop.define('JSoop.mixins.Configurable', {
        isConfigurable: true,

        constructor: function (config) {
            var me = this;

            me.initConfig(config || {});
            me.checkRequired();
        },

        initConfig: function (config) {
            var me = this,
                protoConfig = me.config || {},
                defaults = protoConfig.defaults || {},
                currentProto = me.$class.prototype;

            if (!config) {
                config = {};
            }

            me.originalConfig = config;

            //todo: this needs to be cached for performance reasons
            while (defaults) {
                JSoop.applyIf(config || {}, JSoop.clone(defaults));

                if (currentProto.superClass) {
                    currentProto = currentProto.superClass.prototype;

                    if (currentProto.config) {
                        defaults = currentProto.config.defaults;
                    } else {
                        defaults = false;
                    }
                } else {
                    defaults = false;
                }
            }

            JSoop.apply(me, config);
        },

        checkRequired: function () {
            var me = this,
                protoConfig = me.config || {},
                required = protoConfig.required || [],
                missing = [];

            //todo: this needs to climb the prototype chain to find inherited required config
            JSoop.each(required, function (key) {
                if (me[key] === undefined) {
                    missing.push(key);
                }
            });

            if (missing.length > 0) {
                JSoop.error(me.$className + ' missing required config keys "' + missing.join(', ') + '"');
            }
        }
    });
}());
