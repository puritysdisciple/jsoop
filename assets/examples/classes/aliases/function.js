JSoop.define('Demo.Person', {
    fnAlias: {
        'sayHello': 'speak',
        'walk': {
            name: 'saunter',
            root: 'Demo.Horse.prototype'
        }
    },

    constructor: function (name, age) {
        var me = this;

        me.name = name;
        me.age = age;
    },

    sayHello: function () {
        console.log('Hey there, I\'m ' + this.name + '!');
    },

    walk: function () {
        console.log('I\'m walking!');
    }
});

var john = new Demo.Person('John', 24),
    horsey = new Demo.Horse();

john.speak(); //logs "Hey there I'm John!"
horsey.saunter(); //logs "I'm walking!"
