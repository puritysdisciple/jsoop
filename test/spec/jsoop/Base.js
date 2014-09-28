describe('JSoop.Base', function () {
    it('should be able to call parent methods of extended classes', function () {
        JSoop.define('TestNamespace.Parent', {
            testMethod: function () {
                return 1;
            }
        });

        JSoop.define('TestNamespace.Child', {
            extend: 'TestNamespace.Parent',
            testMethod: function () {
                return this.callParent() + 1;
            }
        });

        var obj = JSoop.create('TestNamespace.Child');

        expect(obj.testMethod()).toBe(2);
    });
});
