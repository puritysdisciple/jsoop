JSoop.define('Demo.Person', {
    alias: [
        'animal.Person'
    ],

    constructor: function (name, age) {
        var me = this;

        me.name = name;
        me.age = age;
    },

    sayHello: function () {
        console.log('Hey there, I\'m ' + this.name + '!');
    }
});

var john = JSoop.create('Demo.Person', 'John', 24),
    eric = JSoop.create('animal.Person', 'Eric', 30);

john.sayHello(); //logs "Hey there I'm John!"
eric.sayHello(); //logs "Hey there I'm Eric!"
