JSoop.define('Demo.MyPlugin', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.mon(me.owner, 'toast', me.onOwnerToast, me);
    },

    destroy: function () {
        var me = this;

        me.removeAllListeners();
        me.removeAllManagedListeners();
    },

    onOwnerToast: function (item) {
        console.log('toasted ' + item + ' ready!');
    }
});

JSoop.define('Demo.Toaster', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');
        me.initMixin('pluginManager');
    },

    destroy: function () {
        var me = this;

        me.destroyAllPlugins();
        me.removeAllListeners();
        me.removeAllManagedListeners();
    },

    toast: function (item, seconds) {
        var me = this;

        setTimeout(function () {
            me.fireEvent('toast', item);
        }, seconds * 1000);
    }
});

var loudToaster = JSoop.create('Demo.Toaster', {
    plugins: 'Demo.MyPlugin'
});

loudToaster.toast('bread', 60); //logs "toasted bread ready!" after 60 seconds
