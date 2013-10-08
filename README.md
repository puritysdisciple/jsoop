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

MyNamespace.MyClass.foo
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
		//call configurable's constructor
		this.mixins.observable.prototype.constructor.apply(this, arguments);

		this.fireEvent('constructed', this);
	}
});
```
## Instantiating Classes ##

```js
JSoop.define('MyNamespace.MyClass', {
	//members
});

var myObj = JSoop.create('MyNamespace.MyClass', arg1, arg2);
```
