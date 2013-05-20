(function () {
	function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    function addMethod (newClass, name, method) {
    	
    }
    
    function addProperty (newClass, name, value) {
    	if (JSoop.isPrimative(value)) {
    		newClass.prototype[name] = value;
    	} else {
    		newClass.prototype[name] = JSoop.clone(value);
    	}
    }
	
	var CM = JSoop.ClassManager = {
		define: function (name, config, fn) {
			var parts = name.split('.'),
				className = parts.pop(),
				namespace = JSoop.namespace(parts.join('.')),
				extend, newClass, obj, i, length;
			
			JSoop.applyIf(config, {
				extend: 'JSoop.Base'
			});
			
			extend = config.extend;
			parts = extend.split('.');
			obj = window;
			
			for (i = 0, length = parts.length; i < length; i = i + 1) {
				obj = obj[parts[i]];
			}
			
			newClass = object(obj);
			
			if (config.singleton) {
				if (!fn) {
					fn = function (newClass) {
						return new newClass();
					};
				}
				
				namespace[className] = fn(newClass);
				
				return;
			} else {
				namespace[className] = newClass;
			}
			
			if (fn) {
				fn(newClass);
			}
		}
	};
}());
