JSoop.define('Demo.Person', {
    //...
}, function (Cls) {
    Demo.createPerson = function (name, age) { //create a convenience function
        return new Cls(name, age);
    };
});
