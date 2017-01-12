export default (function (exports) {

    var _this = exports;

    var floor  = Math.floor,
        random = Math.random;

    exports.uniform = function (min, max) {
        return min + (max - min) * random();
    };

    exports.uniformDiscrete = function (i, j) {
        return i + floor((j - i + 1) * _this.uniform(0, 1));
    };

    return exports;

})({});
