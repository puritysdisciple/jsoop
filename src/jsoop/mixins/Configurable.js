(function () {
    "use strict";

    JSoop.define('JSoop.mixins.Configurable', {
        constructor: function (config) {
            var me = this;

            me.initConfig(config || {});
            me.checkRequired();
        },

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

        checkRequired: function () {
            var me = this,
                required = me.required || [],
                missing = [];

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
