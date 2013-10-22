describe('JSoop.mixins.PluginManager', function () {
    JSoop.define('TestNamespace.TestPluginManager', {
        mixins: {
            configurable: 'JSoop.mixins.Configurable',
            observable: 'JSoop.mixins.Observable',
            pluginManager: 'JSoop.mixins.PluginManager'
        },

        plugins: {
            testPlugin: 'TestNamespace.TestPlugin'
        },

        constructor: function () {
            var me = this;

            me.mixins.configurable.prototype.constructor.apply(me, arguments);
            me.mixins.observable.prototype.constructor.apply(me, arguments);
            me.mixins.pluginManager.prototype.constructor.apply(me, arguments);
        },

        doSomething: function () {
            var me = this;

            me.fireEvent('event', me);
        }
    });

    JSoop.define('TestNamespace.TestPlugin', {
        mixins: {
            configurable: 'JSoop.mixins.Configurable'
        },

        constructor: function () {
            var me = this;

            me.executes = 0;

            me.mixins.configurable.prototype.constructor.apply(me, arguments);

            me.owner.on('event', me.onEvent, me);
        },

        onEvent: function () {
            var me = this;

            me.executes = me.executes + 1;
        }
    });

    it('should be able to add plugins', function () {
        var obj = JSoop.create('TestNamespace.TestPluginManager'),
            obj2 = JSoop.create('TestNamespace.TestPluginManager');

        obj.doSomething();

        expect(obj.plugins.testPlugin.executes).toBe(1);

        obj2.doSomething();
        obj2.doSomething();

        expect(obj2.plugins.testPlugin.executes).toBe(2);
    });
});
