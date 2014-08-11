JSoop.define('Demo.MyWidget', {
    //...
    onRender: function () {
        var me = this;

        me.onElClick = JSoop.bind(me.onClick, me);

        //jQuery binds its listeners to the target element by default
        //using JSoop.bind the listener will instead by bound to the current object
        jQuery(me.el).on('click', me.onElClick);
    },

    onClick: function () {
        var me = this;

        me.fireEvent('select', me);
    },

    onDestroy: function () {
        var me = this;

        if (me.onElClick) {
            jQuery(me.el).off('click', me.onElClick);
        }
    },
    //...
});
