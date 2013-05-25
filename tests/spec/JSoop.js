describe('JSoop', function () {
	it('should be able to check variable types correctly', function () {
		var basic = {
				STRING:    '',
				ARRAY:     [],
				NUMBER:    1,
				OBJECT:    {},
				ELEMENT:   document.body,
				BOOL:      true,
				FUNCTION:  function () {}
			},
			types = [
				'STRING',
				'ARRAY',
				'NUMBER',
				'OBJECT',
				'ELEMENT',
				'BOOL',
				'FUNCTION'
			],
			length = types.length,
			i, key;

		//This will check to make sure all types are registering true for their own type, and false for all others
		for (key in basic) {
			if (basic.hasOwnProperty(key)) {
				for (i = 0; i < length; i = i + 1) {
					expect(JSoop.is(basic[key], JSoop[types[i]])).toBe(key === types[i]);
				}
			}
		}

		//This checks to make sure isPrimative is working correctly
		expect(JSoop.isPrimative(basic.STRING)).toBe(true);
		expect(JSoop.isPrimative(basic.NUMBER)).toBe(true);
		expect(JSoop.isPrimative(basic.BOOL)).toBe(true);

		expect(JSoop.isPrimative(basic.ARRAY)).toBe(false);
		expect(JSoop.isPrimative(basic.OBJECT)).toBe(false);
		expect(JSoop.isPrimative(basic.ELEMENT)).toBe(false);
		expect(JSoop.isPrimative(basic.FUNCTION)).toBe(false);
	});

	describe('should be able to iterate over objects', function () {
		var basic = {
			x: 1,
			y: 2,
			z: 3
		}, executes;

		beforeEach(function () {
			executes = 0;
		});

		it('fully', function () {
			JSoop.iterate(basic, function (item) {
				executes = executes + 1;
			});

			expect(executes).toBe(3);
		});

		it('and be able to break early', function () {
			JSoop.iterate(basic, function (item) {
				executes = executes + 1;

				if (item === 2) {
					return false;
				}
			});

			expect(executes).toBe(2);
		});

		it('but only basic objects', function () {
			JSoop.iterate(document.body, function (item) {
				executes = executes + 1;
			});

			expect(executes).toBe(0);
		});
	});

	describe('should be able to iterate over arrays', function () {
		var arr = [1, 2, 3],
			executes;

		beforeEach(function () {
			executes = 0;
		});

		it('fully', function () {
			JSoop.each(arr, function (item) {
				executes = executes + 1;
			});

			expect(executes).toBe(3);
		});

		it('and be able to break early', function () {
			JSoop.each(arr, function (item) {
				executes = executes + 1;

				if (item === 2) {
					return false;
				}
			});

			expect(executes).toBe(2);
		});

		it('even if it is a single item', function () {
			JSoop.each(1, function (item) {
				executes = executes + 1;
			});

			expect(executes).toBe(1);
		});
	});

	describe('should be able to apply one object\'s properties to another object', function () {
		var target, source = {
			x: 1,
			y: 2,
			z: 3
		};

		beforeEach(function () {
			target = {
				z: 4,
				a: 5,
				b: 6
			};
		});

		it('completely', function () {
			JSoop.apply(target, source);

			expect(target.z).toBe(3);
			expect(target.x).toBe(1);
		});

		it('selectively', function () {
			JSoop.applyIf(target, source);

			expect(target.z).toBe(4);
			expect(target.x).toBe(1);
		});
	});

	describe('should be able to work with string paths for objects', function () {
		it('to create an object chain', function () {
			JSoop.namespace('Namespace.SubNamespace');

			expect(Namespace.SubNamespace).toBeDefined();

			JSoop.namespace('Namespace.AnotherNamespace');

			expect(Namespace.AnotherNamespace).toBeDefined();
			expect(Namespace.SubNamespace).toBeDefined();
		});

		it('to find an object', function () {
			JSoop.namespace('A.Deep.Namespace.Chain');

			A.Deep.Namespace.Chain.target = 3;

			expect(JSoop.objectQuery('A.Deep.Namespace.Chain.target')).toBeDefined();
			expect(JSoop.objectQuery('A.Deep.Namespace.Chain.missing')).not.toBeDefined();
		});
	});
});
