const { TestScheduler } = require('jest');

require('../js/jquery.dispersion-recorder.js');

test("should add an icon to the canvas", () => {
    var sut = jQuery("<div />");
    sut[0].getClientRects = () => {
        return [{left:0,right:100,top:0,bottom:100}];
    }
    var plugin = sut.dispersionRecord();
    sut.trigger('click', {clientX:10,clientY:10});
    expect(sut.find('span').length).toBe(1);
})