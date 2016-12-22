;
(function () {

    var Gradient = function (startColor, endColor, items) {
            if (!items.length) {
                throw new Error('The length of the items must be greater than 0.');
            }

            this.startColor = startColor;
            this.endColor = endColor;
            this.items = items.sort(function (a, b) {
                return b - a;
            });
        },
        GradientFn = Gradient.prototype;

    GradientFn._hexToRgb = function (hex) {
        var rgb = [];
        for (var i = 1; i < 7; i += 2) {
            rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
        }
        return rgb;
    }

    GradientFn._rgbToHex = function (r, g, b) {
        var hex = ((r << 16) | (g << 8) | b).toString(16);
        return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
    }

    GradientFn._unique = function () {
        var map = {},
            repeat = {},
            newArr = [];

        this.items.forEach(function (item) {
            if (!map[item]) {
                map[item] = true;
                newArr.push(item);
            } else {
                if (repeat[item]) {
                    repeat[item]++;
                } else {
                    repeat[item] = 2;
                }
            }
        });

        return {
            array: newArr,
            repeat: repeat
        };
    }

    GradientFn._getOneColor = function (differentials, x) {
        var r = parseInt(differentials.rStep * x + differentials.startColor[0]),
            g = parseInt(differentials.gStep * x + differentials.startColor[1]),
            b = parseInt(differentials.bStep * x + differentials.startColor[2]);

        return this._rgbToHex(r, g, b);
    }

    GradientFn._getDifferentials = function (step) {
        var startColor = this._hexToRgb(this.startColor),
            endColor = this._hexToRgb(this.endColor);

        return {
            startColor: startColor,
            endColor: endColor,
            rStep: (endColor[0] - startColor[0]) / step,
            gStep: (endColor[1] - startColor[1]) / step,
            bStep: (endColor[2] - startColor[2]) / step
        }
    }

    GradientFn.getColors = function () {
        var self = this,
            colors = [],
            step = Math.max.apply(null, this.items),
            differentials = this._getDifferentials(step);

        this.items.forEach(function (item) {
            colors.push(self._getOneColor(differentials, item));
        });

        return colors;
    }

    GradientFn.getGradientColors = function () {
        var colors = [],
            self = this,
            unique = this._unique(),
            step = unique.array.length - 1,
            differentials = this._getDifferentials(step);

        unique.array.forEach(function (item, index) {
            var repeatItemCounts = unique.repeat[item];

            index = step - index;

            if (repeatItemCounts) {
                for (var i = 0; i < repeatItemCounts; i++) {
                    colors.push(self._getOneColor(differentials, index));
                }
            } else {
                colors.push(self._getOneColor(differentials, index));
            }
        });

        return colors;
    }

    window.Gradient = Gradient;

}());