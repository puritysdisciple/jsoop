JSoop.define('Demo.mixins.Consumer', {
    canEat: true,
    eatsMeat: false,
    eatsPlants: false,

    constructor: function () {
        var me = this;

        if (me instanceof Demo.Person) {
            me.eatsMeat = true;
            me.eatsPlants = true;
        }

        if (me instanceof Demo.Fish) {
            me.eatsPlants = true
        }
    }
});

JSoop.define('Demo.Person', {
    mixins: {
        consumer: 'Demo.mixins.Consumer'
    },

    constructor: function (name, age) {
        var me = this;

        me.name = name;
        me.age = age;

        me.initMixin('consumer', arguments);
    }
});

var john = new Demo.Person('John', 24);
john.eatsMeat; //true
