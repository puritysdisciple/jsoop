describe('JSoop.mixins.Observable', function () {
    JSoop.define('Namespace.TestObservable', {
        mixins: {
            observable: 'JSoop.mixins.Observable'
        },

        constructor: function () {
            var me = this;

            me.mixins.observable.prototype.constructor.apply(me, arguments);
        }
    });

    var obj,
        executes;

    beforeEach(function () {
        obj = JSoop.create('Namespace.TestObservable');

        executes = 0;
    });

    it('should be able to listen for and fire events', function () {
        function callback () {
            executes = executes + 1;
        }

        obj.on('event', callback);

        obj.fireEvent('event');
        obj.fireEvent('event');

        obj.off('event', callback);

        obj.fireEvent('event');

        expect(executes).toBe(2);
    });

    describe('should be able to add a listener with', function () {
        it('the single option', function () {
            obj.on('event', function () {
                executes = executes + 1;
            }, undefined, {single: true});

            obj.fireEvent('event');
            obj.fireEvent('event');

            expect(executes).toBe(1);
        });

        it('the scope option', function () {
            var scope = {
                executes: 0
            };

            obj.on('event', function () {
                this.executes = this.executes + 1;
            }, scope);

            obj.fireEvent('event');
            obj.fireEvent('event');

            expect(scope.executes).toBe(2);
        });
    });

    it('should be able to add and remove multiple listeners', function () {
        var executes2 = 0,
            obj2;

        function ExecutesObject () {
            this.executes = 0;
            this.executes2 = 0;
        }

        ExecutesObject.prototype = {
            callback1: function () {
                this.executes = this.executes + 1;
            },
            callback2: function () {
                this.executes2 = this.executes2 + 1;
            }
        };

        obj2 = new ExecutesObject();

        function callback1 () {
            executes = executes + 1;
        }

        function callback2 () {
            executes2 = executes2 + 1;
        }

        obj.on({
            'event1': callback1,
            'event2': callback2
        });

        obj.fireEvent('event1');
        obj.fireEvent('event1');

        obj.fireEvent('event2');
        obj.fireEvent('event2');

        obj.off({
            'event1': callback1,
            'event2': callback2
        });

        obj.fireEvent('event1');
        obj.fireEvent('event1');

        obj.fireEvent('event2');
        obj.fireEvent('event2');

        expect(executes).toBe(2);
        expect(executes2).toBe(2);

        obj.on({
            'event1': obj2.callback1,
            'event2': obj2.callback2,
            'scope': obj2
        });

        obj.fireEvent('event1');
        obj.fireEvent('event1');

        obj.fireEvent('event2');
        obj.fireEvent('event2');

        obj.off({
            'event1': obj2.callback1,
            'event2': obj2.callback2,
            'scope': obj2
        });

        obj.fireEvent('event1');
        obj.fireEvent('event1');

        obj.fireEvent('event2');
        obj.fireEvent('event2');

        expect(obj2.executes).toBe(2);
        expect(obj2.executes2).toBe(2);
    });

    it('should be able to add a managed listener', function () {
        var otherObj = JSoop.create('Namespace.TestObservable');

        otherObj.addManagedListener(obj, 'event', function () {
            executes = executes + 1;
        });

        obj.fireEvent('event');
        obj.fireEvent('event');

        expect(executes).toBe(2);
    });

    it('should be able to remove managed listeners', function () {
        var otherObj = JSoop.create('Namespace.TestObservable');

        otherObj.addManagedListener(obj, 'event', function () {
            executes = executes + 1;
        });

        obj.fireEvent('event');
        obj.fireEvent('event');

        expect(executes).toBe(2);

        otherObj.removeAllManagedListeners();

        obj.fireEvent('event');

        expect(executes).toBe(2);
    });
});
