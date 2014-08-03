JSoop.define('Demo.Person', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    config: {
        defaults: {
            isDoctor: false
        }
    },

    constructor: function (config) {
        this.initMixin('configurable', [config]);
    }
});

var eric = JSoop.create('Demo.Person', {
        name: 'Eric',
        age: 30,
        isDoctor: true
    }),
    john = JSoop.create('Demo.Person', {
        name: 'John',
        age: 24
    });

eric.isDoctor; //true
john.isDoctor; //false


