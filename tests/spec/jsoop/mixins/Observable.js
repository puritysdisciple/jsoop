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
        obj.on('event', function () {
            executes = executes + 1;
        });

        obj.fireEvent('event');
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
});
