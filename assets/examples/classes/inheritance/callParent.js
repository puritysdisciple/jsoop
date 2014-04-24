JSoop.define('Demo.Doctor', {
    extend: 'Demo.Person',

    constructor: function (name, age, specialty) {
        var me = this;

        me.specialty = specialty;

        me.callParent(arguments);
    },

    sayHello: function () {
        var me = this;

        me.callParent(arguments);

        console.log('I\'m a ' + me.specialty + ' doctor.');
    }
});

var eric = new Demo.Doctor('Eric', 32, 'brain');
eric.sayHello(); //logs:
                 //"Hey there I'm Eric!"
                 //"I'm a brain doctor."
