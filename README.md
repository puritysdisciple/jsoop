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

*Statics:* Used to add static members to a class.

```js
JSoop.define('MyNamespace.MyClass', {
	statics: {
		foo: 1,
		bar: 2
	}
});

MyNamespace.MyClass.foo
```

*Extend:* Used to extend a parent class.

```js
JSoop.define('MyNamespace.MySubClass', {
	extend: 'MyNamespace.MyParentClass'
});
```
*Singleton:* Used to set the class to an instance of itself creating a singleton.

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
