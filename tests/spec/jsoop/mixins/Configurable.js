describe('JSoop.mixins.Configurable', function () {
    it('should be able to apply a config', function () {
        JSoop.define('TestNamespace.ConfigTest', {
            mixins: {
                configurable: 'JSoop.mixins.Configurable'
            },

            constructor: function (config) {
                var me = this;

                me.mixins.configurable.prototype.constructor.call(me, config);
            }
        });

        myObj = JSoop.create('TestNamespace.ConfigTest', {
            configTest: 'YAY'
        });

        expect(myObj.configTest).toBe('YAY');
    });

    it('should be able to apply default values to the config', function () {
        var myObj;

        JSoop.define('TestNamespace.DefaultConfigTest', {
            mixins: {
                configurable: 'JSoop.mixins.Configurable'
            },

            defaults: {
                configTest: 'BOO',
                otherConfigTest: 'YAY'
            },

            constructor: function (config) {
                var me = this;

                me.mixins.configurable.prototype.constructor.call(me, config);
            }
        });

        myObj = JSoop.create('TestNamespace.DefaultConfigTest', {
            configTest: 'YAY'
        });

        expect(myObj.configTest).toBe('YAY');
        expect(myObj.otherConfigTest).toBe('YAY');
    });

    it('should be able to chain default configs from extended classes', function () {
        var myObj;

        JSoop.define('TestNamespace.DefaultParentConfigTest', {
            mixins: {
                configurable: 'JSoop.mixins.Configurable'
            },

            defaults: {
                parentConfig: 1
            }
        });

        JSoop.define('TestNamespace.DefaultChildConfigTest', {
            extend: 'TestNamespace.DefaultParentConfigTest',

            defaults: {
                childConfig: 1
            },

            constructor: function (config) {
                var me = this;

                me.mixins.configurable.prototype.constructor.call(me, config);
            }
        });

        myObj = JSoop.create('TestNamespace.DefaultChildConfigTest', {
            configTest: 'YAY'
        });

        expect(myObj.configTest).toBe('YAY');
        expect(myObj.childConfig).toBe(1);
        expect(myObj.parentConfig).toBe(1);
    });
});
