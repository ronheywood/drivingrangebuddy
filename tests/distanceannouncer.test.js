const { TestScheduler } = require("jest");

const audioSpy = jest.spyOn(global,"Audio")
    .mockImplementation(() => mockPlayer);
const mockPlayer = {
    play: jest.fn(),
    currentTime: jest.fn(),
    addEventListener: jest.fn()
}

var distanceAnnouncer = require('../js/distanceAnnouncer.js');

test("It loads an audio file from the local resources", () => {
        distanceAnnouncer.init(jQuery);
        expect(audioSpy).toHaveBeenCalledWith(distanceAnnouncer.voice);
    });
test("It plays the audio when the setDistance event is published", () => {
    distanceAnnouncer.init(jQuery);
    var distance = {distance: 130};
    jQuery(window).trigger("Distance:set",distance)
    expect(mockPlayer.play).toHaveBeenCalled();
 });

 describe("It should set the auio start and end position for the distance", () => {
    test("it should play the sequence for counting in 10s ", () =>{
        var setTime = 0;
        Object.defineProperty(mockPlayer, 'currentTime', {
            get: jest.fn(() => setTime),
            set: jest.fn(time => setTime = time)
          });
        distanceAnnouncer.init(jQuery);
        var distance = {distance: 30};
        jQuery(window).trigger("Distance:set",distance);
        expect(setTime).toBe(19);
    })
 });