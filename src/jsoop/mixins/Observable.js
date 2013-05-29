(function () {
	var eventOptions = {
		single: true,
		scope: true
	};

	function createSingle (fn, observable) {
		return function () {
			
		}
	}

	JSoop.define('JSoop.mixins.Observable', {
		aliases: {
			addListener: 'on',
			removeListener: 'un'
		},

		addEvents: function () {
			var me = this,
				i, length;

			me.events = me.events || {};

			for (i = 0, length = arguments.length; i < length; i = i + 1) {
				me.events[arguments[i]] = [];
			}
		},

		addListener: function (ename, callback, scope, options) {
			var me = this,
				listeners = ename,
				defaultOptions = {},
				listener, key;

			if (!JSoop.isObject(listeners)) {
				listeners = {
					ename: listeners,
					fn: callback,
					scope: scope
				};
			}

			if (listeners.ename) {
				if (options) {
					JSoop.apply(listeners, options);
				}

				//add generic listener

			} else {
				//Find the default options
				for (key in listeners) {
					if (listeners.hasOwnProperty(key) && eventOptions.hasOwnProperty(key)) {
						defaultOptions[key] = listeners[key];
					}
				}

				for (key in listeners) {
					if (listeners.hasOwnProperty(key) && !eventOptions.hasOwnProperty(key)) {
						listener = listeners[key];

						if (JSoop.isObject(listener)) {
							listener.ename = key;
						}

						JSoop.applyIf(listener, defaultOptions);

						me.addListener(listener);
					}
				}
			}
		},
		removeListener: function () {

		},
		removeAllListeners: function (ename) {

		},
		fireEvent: function () {
			var me = this,
				args = Array.prototype.slice.apply(arguments, 0),
				ename = args.shift(),
				listeners = me.events[ename],
				i, length;

			for (i = 0, length = listeners.length; i < length; i = i + 1) {
				//scope the listener to the defined scope or an empty object so that the listener can't clobber anything undesired.
				listeners[i].apply(listeners[i].scope || {}, args);
			}
		}
	});
}());
/*
addEvents('event1', 'event2', 'event3');

on('event', fn, obj, {single: true});
on({
	event1: fn,
	event2: fn,
	single: true,
	scope: obj
});
on({
	event1: {
		fn: fn,
		single: true
	},
	event2: {
		fn: single,
		scope: obj
	}
});

fireEvent('event1', arg1, arg2, arg3);
*/
