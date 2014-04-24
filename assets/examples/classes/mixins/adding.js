JSoop.define('Demo.Fish', {
    mixins: {
        swimmer: 'Demo.mixins.Swimmer'
    }
});

JSoop.define('Demo.Bear', {
    mixins: {
        swimmer: 'Demo.mixins.Swimmer'
    }
});

var fish = new Demo.Fish(),
    bear = new Demo.Bear();

fish.swim(); //logs "I'm swimming!"
bear.swim(); //logs "I'm swimming!"
