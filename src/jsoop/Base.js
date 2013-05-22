(function () {
	var Base = JSoop.Base = function () {};

	Base.prototype = {
		$className: 'JSoop.Base',
		$class: Base,

		init: function () {

		},

		callParent: function (args) {
			var me = this,
				//BUG FIX: Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
				tmpArgs = arguments,
				method = me.callParent.caller,
				methodName, parentClass, tempClass;

			if (method != null && !method.$owner) {
				if (!method.caller) {
					JSoop.error('Unable to locate method for callParent to execute.');
				}

				method = method.caller;
			}

			if (!method.$owner) {
				JSoop.error('Unable to resolve method for callParent. Make sure all methods are added using JSoop.define.');
			}

			methodName = method.$name;
			parentClass = method.$owner.superClass;

			tempClass = parentClass;

			//Crawl up the class chain to make sure the class has the called method.
			do {
				if (methodName in tempClass.prototype) {
					break;
				}

				tempClass = tempClass.superClass;
			} while (tempClass);

			if (!tempClass) {
				JSoop.error('No parent method "' + methodName + '" was found in ' + parentClass.prototype.$className + '.');
			}

			return parentClass.prototype[methodName].apply(this, args || []);
		}
	};
}());
