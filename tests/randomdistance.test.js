//const sum = require('../js/randomDistance');
const mockMath = Object.create(global.Math);

require('../js/jquery.randomDistance.js');
 const cases = [[30, 230, 139], [90, 200, 150], [100, 400, 264]];

 const triggerSpy = jest.fn();
 jQuery.fn.trigger = triggerSpy;
 let sut = jQuery('<div>');
 var eventPublishedSetDistance = null;
 var eventPublishedSetDistanceArge = null;


 describe('Configures target distance to be a random int between min and max', () => {
    var plugin;
    global.Math.random = () => 0.5465465465472542;
    
    test.each(cases)("given min %p and max %p , returns %p",
      (firstArg, secondArg, expectedResult) => {
        plugin = sut.makeRandomDistance({ minimumDistance: firstArg, maximumDistance: secondArg});
        expect(sut.text()).toBe(""+expectedResult);
      }
      );

      test("should dispatch an event each time the resetDistance method is called", () => {
        var data = cases[0];
        plugin = sut.makeRandomDistance({ minimumDistance: data[0], maximumDistance: data[1]});
        plugin.resetDistance();
        expect(triggerSpy).toBeCalledWith("Distance:set",expect.objectContaining({distance:data[2]}));
      });
  });