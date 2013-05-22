(function () {
	var create = (function () {
			function F() {}

			return function (obj) {
				F.prototype = obj;

				return new F();
			}
		}()),
		configFilter = {
			statics: true,
			mixins: true,
			extend: true,
			constructor: true
		};

	function addMember (target, name, member) {
		if (JSoop.isFunction(member)) {
			addMethod(target, name, member);
		} else {
			addProperty(target, name, member);
		}
	}

	function addMethod (target, name, method) {
		if (typeof method.$owner !== 'undefined' && method !== JSoop.emptyFn) {
			var origin = method;

			method = function () {
				return origin.apply(this, arguments);
			};
		}


		//Todo: Fix this Issue...
		method.$owner = newClass;
		method.$name = name;

		target[name] = method;
	}

	function addProperty (target, name, value) {
		if (JSoop.isPrimative(value)) {
			target[name] = value;
		} else {
			target[name] = JSoop.clone(value);
		}
	}

	function addMixin (target, mixin) {
		if (typeof mixin === 'string') {
			mixin = JSoop.objectQuery(mix);
		}

		for (key in mixin.prototype) {
			if (mixin.prototype.hasOwnProperty(key) && !target[key]) {
				target[key] = mixin.prototype[key];
			}
		}
	}

	function addStatics (target, statics) {
		var key;

		for (key in statics) {
			if (statics.hasOwnProperty(key) && !target[key]) {
				target[key] = statics[key];
			}
		}
	}

	var CM = JSoop.ClassManager = {
		define: function (name, config, fn) {
			var parts = name.split('.'),
				className = parts.pop(),
				namespace = JSoop.namespace(parts.join('.')),
				extend, newClass, i, length;

			JSoop.applyIf(config, {
				extend: 'JSoop.Base',
				mixins: [],
				statics: {},
				singleton: false,
				constructor: function () {
					var me = this;

					me.init.apply(me, arguments);
				}
			});


			if (!fn) {
				if (config.singleton) {
					fn = function (newClass) {
						return new newClass();
					};
				} else {
					fn = JSoop.emptyFn;
				}
			}

			extend = JSoop.objectQuery(config.extend);

			newClass = config.constructor;
			newClass.prototype = create(extend.prototype);
			newClass.prototype.$className = name;
			newClass.superClass = extend;

			//Add additional members
			for (key in config) {
				if (config.hasOwnProperty(key) && !configFilter[key]) {
					addMember(newClass.prototype, key, config[key]);
				}
			}

			//Add mixins
			for (i = 0, length = config.mixins.length; i < length; i = i + 1) {
				addMixin(newClass.prototype, config.mixins[i]);
			}

			if (config.singleton) {
				namespace[className] = fn(newClass);

				addStatics(namespace[className], config.statics);

				return;
			}

			addStatics(newClass, config.statics);

			namespace[className] = newClass;

			fn(newClass);
		},

		getInstantiator: function (length) {
			var me = this;

			me.instantiators = me.instantiators || [];

			if (length > 3) {
				JSoop.log('Instantiating a class with more than three arguments, is this an error?');
			}

			if (!me.instantiators[length]) {
				var args = [],
					i;

				for (i = 0; i < length; i = i + 1) {
					args.push('a[' + i + ']');
				}

				me.instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ');');
			}

			return me.instantiators[length];
		},

		instantiate: function () {
			var me = this,
				args = Array.prototype.slice.call(arguments, 0),
				className = args.shift(),
				cls = JSoop.objectQuery(className);

			return me.getInstantiator(args.length)(cls, args);
		}
	};

	JSoop.create = function () {
		return CM.instantiate.apply(CM, arguments);
	};

	JSoop.define = function () {
		return CM.define.apply(CM, arguments);
	};
}());
