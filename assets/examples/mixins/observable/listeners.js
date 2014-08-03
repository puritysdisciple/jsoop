JSoop.create('Demo.ObjectManager', {
    //...
    addItem: function (item) {
        var me = this;

        item.on({
            'change': me.onItemChange,
            'destroy': me.onItemDestroy,
            'manager:change': {
                fn: me.onManagerChange,
                single: true                      //the listener only fires once
            },
            'scope': me                           //bind all listeners to the manager
        });

        me.items.push(item);
    },

    onManagerChange: function (item) {
        var me = this;

        item.off({
            'change': me.onItemChange,
            'destroy': me.onItemDestroy,
            'manager:change': me.onManagerChange, //only event, listener and scope are needed to remove
            'scope': me
        });
    },
    //...
});
