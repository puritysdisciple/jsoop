JSoop.define('Demo.Henry', {
    extend: 'Demo.Person',
    singleton: true,

    constructor: function () {
        this.callParent(['Henry', 30]);
    }
});

Demo.Henry.sayHello(); //logs ""Hey there I'm Henry!"
