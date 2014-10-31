(function () {
    "use strict";

    JSoop.define('JSoop.mixins.PluginManager', {
        isPluginManager: true,

        constructor: function () {
            var me = this,
                plugins = me.plugins || {};

            me.plugins = {};

            JSoop.iterate(plugins, function (plugin, key) {
                me.addPlugin(key, plugin);
            });
        },

        addPlugin: function (name, plugin) {
            var me = this;

            if (JSoop.isString(plugin)) {
                plugin = {
                    type: plugin
                };
            } else {
                plugin = JSoop.clone(plugin);
            }

            plugin.owner = me;

            me.plugins[name] = JSoop.create(plugin.type, plugin);
        },

        destroyPlugin: function (name) {
            var me = this,
                plugin = me.plugins[name];

            if (!plugin) {
                return;
            }

            if (plugin.destroy) {
                plugin.destroy();
            }

            delete me.plugins[name];
        },

        destroyAllPlugins: function () {
            var me = this;

            JSoop.iterate(me.plugins, function (plugin, key) {
                me.destroyPlugin(key);
            });

            me.plugins = {};
        }
    });
}());
