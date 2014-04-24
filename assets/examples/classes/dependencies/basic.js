JSoop.loader.addPath('Demo', '../app/'); //tell JSoop where "Demo" classes are located

JSoop.define('Demo.House', {
    requires: [
        'Demo.Person' //if this does't exist, JSoop will attempt to load it
    ],

    constructor: function (residents) {
        var me = this;

        residents = JSoop.toArray(residents);

        me.residents = [];

        JSoop.each(residents, function (resident) {
            if (!(resident instanceof Demo.Person)) {
                resident = new Demo.Person(resident.name, resident.age);
            }

            me.residents.push(resident);
        });
    }
});
