describe('JSoop.ClassManager', function () {
    describe('should be able to define a new class', function () {
        it('which should extend JSoop.Base', function () {
            JSoop.ClassManager.create('TestNamespace.BaseTest', {});

            //Need to do this because we haven't tested instantiation
            var obj = new TestNamespace.BaseTest();

            expect(JSoop.is(obj, 'JSoop.Base')).toBe(true);
        });

        it('as a singleton', function () {
            JSoop.ClassManager.create('TestNamespace.Singleton', {
                singleton: true
            });

            expect(JSoop.is(TestNamespace.Singleton, 'JSoop.Base')).toBe(true);
        });

        it('with mixins', function () {
            JSoop.ClassManager.create('TestNamespace.Mixin', {
                mixMethod: function () {

                }
            });

            JSoop.ClassManager.create('TestNamespace.MixinTest', {
                mixins: {
                    testMixin: 'TestNamespace.Mixin'
                }
            });

            var obj = new TestNamespace.MixinTest();

            expect(obj.mixMethod).toBeDefined();
        });

        it('with static methods', function () {
            JSoop.ClassManager.create('TestNamespace.StaticTest', {
                statics: {
                    staticMethod: function () {

                    }
                }
            });

            expect(TestNamespace.StaticTest.staticMethod).toBeDefined();
        });
    });

    it('should be able to instantiate classes', function () {
        JSoop.ClassManager.create('TestNamespace.ArgTest1', {
            constructor: function () {
                if (arguments.length !== 1) {
                    throw new Error();
                }
            }
        });
        JSoop.ClassManager.create('TestNamespace.ArgTest2', {
            constructor: function () {
                if (arguments.length !== 2) {
                    throw new Error();
                }
            }
        });

        var argTest1 = function () {
                var obj = JSoop.ClassManager.instantiate('TestNamespace.ArgTest1', 'arg1');
            },
            argTest2 = function () {
                var obj = JSoop.ClassManager.instantiate('TestNamespace.ArgTest2', 'arg1', 'arg2');
            };

        expect(argTest1).not.toThrow();
        expect(argTest2).not.toThrow();
    });

    it('should be able to instantiate classes with other names', function () {
        JSoop.ClassManager.create('TestNamespace.AkaTest', {
            aka: [
                'OtherName',
                'other.name'
            ]
        });

        var obj = JSoop.ClassManager.instantiate('OtherName');

        expect(JSoop.is(obj, 'JSoop.Base')).toBe(true);

        obj = null;

        expect(obj).toBe(null);

        obj = JSoop.ClassManager.instantiate('other.name');

        expect(JSoop.is(obj, 'JSoop.Base')).toBe(true);
    });
});
