(function () {
	var toString = Object.prototype.toString;
	
	var JSoop = window.JSoop = {
		//CONSTANTS
		STRING:    1,
		ARRAY:     2,
		NUMBER:    3,
		OBJECT:    4,
		ELEMENT:   5,
		BOOL:      6,
		FUNCTION:  7,
		
		//Methods
		is: function (obj, type) {
			if (JSoop.isString(type)) {
				return JSoop.instanceOf(obj, type);
			}
			
			switch (type) {
				case JSoop.BOOL:
					return JSoop.isBool(obj);
				case JSoop.STRING:
					return JSoop.isString(obj);
				case JSoop.ARRAY:
					return JSoop.isArray(obj);
				case JSoop.NUMBER:
					return JSoop.isNumber(obj);
				case JSoop.OBJECT:
					return JSoop.isObject(obj);
				case JSoop.ELEMENT:
					return JSoop.isElement(obj);
				case JSoop.FUNCTION:
					return JSoop.isFunction(obj);
				default:
					return false;
			}
		},
		
		isString: function (obj) {
			return typeof obj === 'string';
		},
		
		isArray: function (obj) {
			return toString.call(obj) === '[object Array]';
		},
		
		isBool: function (obj) {
			return typeof obj === 'boolean';
		},
		
		isNumber: function (obj) {
			return typeof obj === 'number';
		},
		
		isObject: function (obj) {
			return obj instanceof Object && obj.constructor === Object;
		},
		
		isElement: function (obj) {
			return obj ? obj.nodeType === 1 : false;
		},
		
		isPrimative: function (obj) {
			var type = typeof obj;
			
			return type === 'string' || type === 'number' || type === 'boolean';
		},

		isFunction: function (obj) {
			return toString.call(obj) === '[object Function]';
		},

		instanceOf: function (obj, type) {
			if (JSoop.isString(type)) {
				type = JSoop.objectQuery(type);
			}

			return obj instanceof type;
		},
		
		iterate: function (obj, fn) {
			if (!JSoop.isObject(obj)) {
				return false;
			}
			
			var key;
			
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (fn(obj[key], key, obj) === false) {
						return false;
					}
				}
			}
			
			return true;
		},
		
		each: function (arr, fn) {
			if (!JSoop.isArray(arr)) {
				return fn(arr, 0, [arr]);
			}
			
			var i, length;
			
			for (i = 0, length = arr.length; i < length; i = i + 1) {
				if (fn(arr[i], i, arr) === false) {
					return false;
				}
			}
			
			return true;
		},
		
		apply: function (target, source) {
			var key;
			
			for (key in source) {
				if (source.hasOwnProperty(key)) {
					target[key] = source[key];
				}
			}
		},
		
		applyIf: function (target, source) {
			var key;
			
			for (key in source) {
				if (source.hasOwnProperty(key)) {
					if (!target.hasOwnProperty(key)) {
						target[key] = source[key];
					}
				}
			}
		},
		
		namespace: function (path) {
			var parts = path.split('.'),
				obj = window,
				i, length;
							
			for (i = 0, length = parts.length; i < length; i = i + 1) {
				if (obj[parts[i]] === undefined) {
					obj[parts[i]] = {};
				}
				
				obj = obj[parts[i]];
			}
			
			return obj;
		},

		objectQuery: function (path, root) {
			var parts = path.split('.'),
				i, length;

			root = root || window;

			for (i = 0, length = parts.length; i < length; i = i + 1) {
				if (root[parts[i]] === undefined) {
					return undefined;
				}

				root = root[parts[i]];
			}

			return root;
		},

		error: function (error) {
				//BUG FIX:
				//Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
			var nArgs = arguments,
				method = this.error.caller;

			if (JSoop.isString(error)) {
				error = {
					level: 'error',
					msg: error,
					stack: true
				};
			}

			if (method) {
				if (method.$name) {
					error.sourceMethod = method.$name;
				}

				if (method.$owner) {
					error.sourceClass = method.$owner.$className;
				}
			}

			if (JSoop.throwErrors !== false) {
				JSoop.log(error);
			}

			throw error.msg;
		},

		emptyFn: function () {}
	};
}());
