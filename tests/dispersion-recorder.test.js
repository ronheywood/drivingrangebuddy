require('../js/jquery.dispersion-recorder.js');

var sut, plugin;

var e = new jQuery.Event("click");
e.clientX = 10;
e.clientY = 10;

var configureSut = function(options){
    var configuredElement = jQuery("<div />");
    configuredElement[0].getClientRects = () => {
        return [{left:0,right:100,top:0,bottom:100}];
    }
    
    plugin = configuredElement.dispersionRecord(options);
    return configuredElement;
};
sut = configureSut();

describe("When clicking on the canvas", () => {
    sut.trigger(e);
    test("should add an icon to the canvas", () => {
        expect(sut.find('span').length).toBe(1);
    });

    test("should position the icon based on where the user clicks", () => {
        var element = sut.find('span');
        expect(element.css('position')).toBe('absolute');
        expect(element.css('left')).toBe("10px");
        expect(element.css('top')).toBe("10px");
    });

    test("should dispatch an event each time the user adds a shot", () => {
         var triggerSpy = jest.spyOn(jQuery.fn,"trigger");
         sut.trigger(e);
         expect(triggerSpy).toBeCalledWith("DispersionData:add",expect.objectContaining({ left: 10,  top: 10}));
         
        jQuery(window).trigger("Distance:set",{distance:255});
        sut.trigger(e);
        expect(triggerSpy).toBeCalledWith("DispersionData:add",expect.objectContaining({ left: 10,  top: 10, targetDistance: 255}));

        jQuery(window).trigger("club-selection:changed",{club:"testClub"});
        sut.trigger(e);
        expect(triggerSpy).toBeCalledWith("DispersionData:add",expect.objectContaining({ left: 10,  top: 10, targetDistance: 255, chosenClub: "testClub"}));
      });
});

describe("When the user changes the target distance", () => {
    test("should remove any icons from the previous block", () => {
        sut.trigger(e);
        if(sut.find('span').length == 0) throw("Expected an element to be added to the canvas");

        jQuery(window).trigger("Distance:set",{distance:255});
        expect(sut.find('span').length).toBe(0);
    })

    test("should add an icon using the template given in options", () => {
        var optionSut = configureSut({template: "<label></label"});
        optionSut.trigger(e);
        expect(optionSut.find('label').length).toBe(1);
    })

    test("should record distance in the template given in options", () => {
        var optionSut = configureSut({template: "<label>{targetDistance}</label>"});
        
        jQuery(window).trigger("Distance:set",{distance:255});
        optionSut.trigger(e);
        expect(optionSut.find('label').text()).toBe('255');
    })
    test("should record chosenClub in the template given in options", () => {
        var clubTest = configureSut({template: "<label>Club {club}</label>"});
        jQuery(window).trigger("club-selection:changed",{club:"testClub"});
        clubTest.trigger(e);
        expect(clubTest.find('label').text()).toBe("Club testClub");
    })
    
    test("should record which side of pin in the template given in options", () => {
        var clubTest = configureSut({template: "<label>{vector}</label>"});
        jQuery(window).trigger("club-selection:changed",{club:"testClub"});
        clubTest.trigger(e);
        expect(clubTest.find('label').text()).toBe("Right");
    })
    
    test("should record long or short in the template given in options", () => {
        var clubTest = configureSut({template: "<label>{length}</label>"});
        jQuery(window).trigger("club-selection:changed",{club:"testClub"});
        clubTest.trigger(e);
        expect(clubTest.find('label').text()).toBe("Short");
    })
});

describe("When the user changes the chosen club", () => {
    test("Should record the club in the label", () => {
        jQuery(window).trigger("club-selection:changed",{club:"testClub"});
        sut.trigger(e);
        expect(sut.find('span').text()).toMatch(/testClub/);
    });
});