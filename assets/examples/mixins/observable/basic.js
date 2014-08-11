JSoop.define('Demo.Person', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');
    },

    destroy: function () {
        var me = this;

        me.removeAllListeners();
        me.removeAllManagedListeners();
    },

    haveBirthday: function () {
        var me = this;

        me.age = me.age + 1;

        me.fireEvent('birthday', me, age);
    }
});

var eric = JSoop.create('Demo.Person', {
    name: 'Eric',
    age: 30
});

eric.on('birthday', function (person, age) {
    console.log(person.name + ' had a birthday! They are ' + age + ' now!');
});
eric.haveBirthday(); //logs "Eric had a birthday! They are 31 now!"
