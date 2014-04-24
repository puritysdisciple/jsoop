JSoop.define('Demo.Person', {
    statics: {
        population: 0,
        people: [],
        addPerson: function (person) {
            Demo.Person.people.push(person);
            Demo.Person.population = Demo.Person.people.length;
        }
    },

    constructor: function (name, age) {
        var me = this;

        me.name = name;
        me.age = age;

        Demo.Person.addPerson(me);
    }
});

var john = new Demo.Person('John', 24);
Demo.Person.population; //1
