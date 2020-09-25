const jquerySlimMin = require('../js/jquery.slim.min.js');

var localStorageMock = (function () {
    var store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key];
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

var spyOnSet = jest.spyOn(localStorageMock, "setItem");
var spyOnClear = jest.spyOn(localStorageMock, "clear");

var database = require('../js/shotDatabase.js');

describe("When DispersionData is added", () => {
    test("it is stored", () => {
        var data = { test: true, left: 10, right: 10 };
        jQuery(window).trigger('DispersionData:add', data);
        expect(spyOnSet).toHaveBeenCalledWith("DispersionData", JSON.stringify([data]));
    });

    afterEach(() => {
        database.clear();
        jest.clearAllMocks();
    });
})

describe("When database contains items", () => {
    test("it can clear the item", () => {
        database.setItem("test", "true");
        database.clear();
        expect(spyOnClear).toHaveBeenCalled();
    });
    afterEach(() => {
        database.clear();
        jest.clearAllMocks();
    });
});

describe("When manually seeding the database", () => {

    test("each item is added to the stored collection", () => {
        var data1 = { test: true, left: 10, right: 10 };
        var data2 = { test: true, left: 20, right: 20 };
        var data3 = { test: true, left: 30, right: 30 };

        database.setItem("testingKey1", data1);
        database.setItem("testingKey2", data2);
        database.setItem("testingKey3", data3);

        expect(spyOnSet.mock.calls.length).toBe(3);
        expect(spyOnSet.mock.calls[0][0]).toBe("testingKey1");
        expect(spyOnSet.mock.calls[1][0]).toBe("testingKey2");
        expect(spyOnSet.mock.calls[2][0]).toBe("testingKey3");

        expect(spyOnSet.mock.calls[0][1]).toBe(JSON.stringify([data1]));
        expect(spyOnSet.mock.calls[1][1]).toBe(JSON.stringify([data1, data2]));
        expect(spyOnSet.mock.calls[2][1]).toBe(JSON.stringify([data1, data2, data3]));
    });
    afterEach(() => {
        database.clear();
        jest.clearAllMocks();
    });
});

describe("When getting all items", () => {

});