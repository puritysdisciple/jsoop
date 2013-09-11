(function () {
    "use strict";

    JSoop.define('JSoop.mixins.Configurable', {
        constructor: function (config) {
            var me = this;

            me.initConfig(config || {});
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
        }
    });
}());
