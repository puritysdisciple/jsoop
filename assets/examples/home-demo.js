JSoop.define('MyNamespace.MyClass', {
    extend: 'MyNamespace.MyParentClass', //extend another class

    constructor: function () {
        var me = this;

        //class specific construction code

        me.callParent(arguments); //call the parent class' constructor
    }
});
