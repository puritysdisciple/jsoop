JSoop.create('Demo.ObjectManager', {
    //...
    addItem: function (item) {
        var me = this;

        me.mon(item, {
            'change': me.onItemChange,
            'destroy': me.onItemDestroy,
            'manager:change': {
                fn: me.onManagerChange,
                single: true
            },
            'scope': me
        });

        me.items.push(item);
    },

    onManagerChange: function (item) {
        this.moff(item); //this will remove all managed listeners for this object
    },
    //...
});
