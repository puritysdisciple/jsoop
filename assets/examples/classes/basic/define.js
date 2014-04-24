JSoop.define('Demo.Person', {
    constructor: function (name, age) {
        var me = this;

        me.name = name;
        me.age = age;
    },

    sayHello: function () {
        console.log('Hey there, I\'m ' + this.name + '!');
    }
});

var john = new Demo.Person('John', 24);

john.sayHello(); //logs "Hey there I'm John!"
