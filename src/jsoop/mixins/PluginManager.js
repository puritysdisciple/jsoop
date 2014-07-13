(function () {
    "use strict";

    JSoop.define('JSoop.mixins.PluginManager', {
        isPluginManager: true,

        constructor: function () {
            var me = this,
                plugins = me.plugins || {};

            me.plugins = {};

            JSoop.iterate(plugins, function (plugin, key) {
                if (JSoop.isString(plugin)) {
                    plugin = {
                        type: plugin
                    };
                } else {
                    plugin = JSoop.clone(plugin);
                }

                plugin.owner = me;

                me.plugins[key] = JSoop.create(plugin.type, plugin);
            });
        },

        destroyPlugins: function () {
            var me = this;

            JSoop.iterate(me.plugins, function (plugin, key) {
                if (plugin.destroy) {
                    plugin.destroy();
                }
            });

            me.plugins = {};
        }
    });
}());
