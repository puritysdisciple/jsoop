JSoop.define('Demo.MyQueue', {
    //...
    execute: function () {
        var me = this;

        JSoop.each(me.queue, me.runAction, me);
    },

    runAction: function (action) {
        //...

        if (action.status === 'fail') {
            //returning false will halt iteration
            return false;
        }
    },
    //...
});
