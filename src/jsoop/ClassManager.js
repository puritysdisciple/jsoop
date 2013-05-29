(function () {
	var makeConstructor = function () {
			function constructor () {
				return this.constructor.apply(this, arguments) || null;
			}

			return constructor;
		},
		aliasCache = {},
		classCache = {},
		BP = JSoop.Base.prototype,
		CM = JSoop.ClassManager = {};

	JSoop.apply(CM, {
		processors: {},

		create: function (className, config, callback) {
			if (classCache[className]) {
				//Todo: throw an error if the class has already been defined

				return;
			}

			JSoop.applyIf(config, {
				extend: 'JSoop.Base'
			});

			var me = this,
				newClass = makeConstructor(),
				processors = [],
				key;

			BP.extend.call(newClass, config.extend);
			newClass.prototype.$className = className;

			//At this point we have a new class that extends the specified class.
			//Now we need to apply all the new members to it from the config.
			for (key in config) {
				if (config.hasOwnProperty(key)) {
					if (!CM.processors.hasOwnProperty(key)) {
						BP.addMember.call(newClass, key, config[key]);
					} else {
						processors.push(key);
					}
				}
			}

			config.onCreate = callback || JSoop.emptyFn;

			//Initialize and execute all processors found while adding members.
			me.initProcessors(processors, config);

			me.process.call(CM, className, newClass, config, CM.process);
		},

		initProcessors: function (processors, config) {
			JSoop.each(processors, function (processor, index) {
				processors[index] = CM.processors[processor];
			});

			config.processors = processors;
		},

		process: function (className, cls, config, callback) {
			var me = this,
				processor = config.processors.shift();

			if (!processor) {
				me.set(className, cls);

				config.onCreate(cls);

				return;
			}

			if (processor.call(CM, className, cls, config, callback) !== false) {
				callback.call(CM, className, cls, config, callback);
			}
		},

		set: function (className, cls) {
			classCache[className] = cls;

			var namespace = className.split('.');

			className = namespace.pop();

			namespace = JSoop.namespace(namespace.join('.'));

			namespace[className] = cls;
		},

		getInstantiator: function (length) {
			var me = this;

			me.instantiators = me.instantiators || [];

			if (length > 3) {
				//Todo: issue a warning when attempting to use more than three arguments.
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
				cls = classCache[className];

			return me.getInstantiator(args.length)(cls, args);
		}
	});

	JSoop.apply(CM.processors, {
		//This is needed to stop the extend property from showing up in the prototype
		extend: function () {},

		aliases: function (className, cls, config, callback) {
			var key;

			if (!config.aliases) {
				config.aliases = {};
			}

			for (key in config.aliases) {
				if (config.aliases.hasOwnProperty(key)) {
					BP.alias.call(newClass, key, config.aliases[key]);
				}
			}
		},

		mixins: function (className, cls, config, callback) {
			if (!config.mixins) {
				config.mixins = [];
			}

			JSoop.each(config.mixins, function (mixin) {
				if (JSoop.isString(mixin)) {
					mixin = JSoop.objectQuery(mixin);
				}

				var key;

				for (key in mixin.prototype) {
					if (mixin.prototype.hasOwnProperty(key)) {
						cls.prototype[key] = mixin.prototype[key];
					}
				}
			});
		},

		singleton: function (className, cls, config, callback) {
			if (!config.singleton) {
				return true;
			}

			callback.call(CM, className, new cls(), config, callback);

			return false;
		},

		statics: function (className, cls, config, callback) {
			if (!config.statics) {
				config.statics = {};
			}

			JSoop.iterate(config.statics, function (member, key) {
				cls[key] = member;
			});
		}
	});

	JSoop.define = function () {
		CM.create.apply(CM, arguments);
	};

	JSoop.create = function () {
		return CM.instantiate.apply(CM, arguments);
	};
}());
