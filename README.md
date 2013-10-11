JSOOP
=====

## Defining Classes ##

```js
JSoop.define('MyNamespace.MyClass', {
	//properties and methods go here
}, function (cls) {
	//do any post processing here
});
```

### Special Properties ###

**statics:** Used to add static members to a class.

```js
JSoop.define('MyNamespace.MyClass', {
	statics: {
		foo: 1,
		bar: 2
	}
});

MyNamespace.MyClass.foo; //1
```

**extend:** Used to extend a parent class.

```js
JSoop.define('MyNamespace.MySubClass', {
	extend: 'MyNamespace.MyParentClass'
});
```
**singleton:** Used to set the class to an instance of itself creating a singleton.

```js
JSoop.define('MyNamespace.MySingleton', {
	singleton: true

	foo: 1,

	getFoo: function () {
		return this.foo;
	}
});

MyNamespace.MySingleton.getFoo(); //returns 1
```
**mixins:** Applies the specified mixins to the class. Mixin constructors are not automatically called.

```js
JSoop.define('MyNamespace.MyClass', {
	mixins: {
		observable: 'JSoop.mixins.Observable'
	},

	constructor: function () {
		var me = this;

		//call observable's constructor
		me.mixins.observable.prototype.constructor.apply(me, arguments);

		me.fireEvent('constructed', me);
	}
});
```
## Instantiating Classes ##

```js
JSoop.define('MyNamespace.MyClass', {
	constructor: function (arg1, arg2) {
		//...
	}
});

var myObj = JSoop.create('MyNamespace.MyClass', arg1, arg2);
```

## Mixins ##

### Observable ###

The Observable class is used to allow an object to handle custom events.

```js
JSoop.define('MyNamespace.MyClass', {
	mixins: {
		observable: 'JSoop.mixins.Observable'
	},

	constructor: function () {
		var me = this;

		//call observable's constructor
		me.mixins.observable.prototype.constructor.apply(me, arguments);
	}
});
```

#### Listening for Events ####

```js
var myObj = JSoop.create('MyNamespace.MyClass');

myObj.on('event', function () {
	//...
});
```

#### Triggering Events ####

```js
myObj.fireEvent('event', arg1, arg2, ...);
```
