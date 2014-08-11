JSoop.define('Demo.Widget', {
    //...
    addClass: function (classes) {
        var me = this;

        //force classes to be an array so we can iterate over it
        classes = JSoop.toArray(classes);

        JSoop.each(classes, function (cls) {
            if (!me.hasClass(cls)) {
                me.el.addClass(cls);
            }
        });
    },
    //...
});

var myWidget = JSoop.create('Demo.Widget');

myWidget.addClass('important');
myWidget.addClass(['header', 'page-title']);
