JSoop.define('Demo.Person', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    constructor: function (config) {
        this.initMixin('configurable', [config]);
    },

    sayHello: function () {
        console.log('Hey there, I\'m ' + this.name + '!');
    }
});

var eric = JSoop.create('Demo.Person', {
    name: 'Eric',
    age: 30
});

eric.sayHello(); //logs "Hey there I'm Eric!"
