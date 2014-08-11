JSoop.define('Demo.Person', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    config: {
        required: [
            'name'
        ]
    },

    constructor: function (config) {
        this.initMixin('configurable', [config]);
    },

    sayHello: function () {
        console.log('Hey there, I\'m ' + this.name + '!');
    }
});

var eric = JSoop.create('Demo.Person', {
    age: 30
}); //error is thrown because name is missing

