
module.exports = {

    hasProperty: function(objects, props) {
        var has = true;
        for (var i = 0; i < props.length; i++) {
            if (!objects.hasOwnProperty(props[i])) {
                has = false;
                break;
            }
        }

        return has;
    },

    /*
    function test() {
      var a = [
        {
          a: 'One',
          c: 1,
        },
        {
          a: 'Two',
          c: 4,
        },
        {
          a: 'Three',
          c: 3,
        }
      ]

      console.log(a);
      a.sort(utils.sort_by('c', true));
      console.log(a);
    }
    */

    // http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects/979325
    // http://jsfiddle.net/gfullam/sq9U7/
    sortBy: function(field, reverse, primer) {

        var key = primer ?
          function(x) {return primer(x[field]);} :

          function(x) {return x[field];};

        reverse = [-1, 1][+!!reverse];

        return function(a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
    },

    zeroPad: function(num, numZeros) {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }

        return zeroString + n;
    },

    randomString: function(bits) {

        var chars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab';
        var rand;
        var i;
        var randomizedString = '';

        // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey
        // it gives 53)
        while (bits > 0) {
            // 32-bit integer
            rand = Math.floor(Math.random() * 0x100000000);

            // base 64 means 6 bits per character, so we use the top 30 bits from rand
            // to give 30/6=5 characters.
            for (i = 26; i > 0 && bits > 0; i -= 6, bits -= 6) {
                randomizedString += chars[0x3F & rand >>> i];
            }
        }

        return randomizedString;
    },

    uid: function(len) {
        var buf = [];
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charlen = chars.length;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (var i = 0; i < len; ++i) {
            buf.push(chars[getRandomInt(0, charlen - 1)]);
        }

        return buf.join('');
    },

    getRandomNumbers: function(length) {
        var arr = [];
        while (arr.length < length) {
            var randomnumber = Math.ceil(Math.random() * length - 1);
            var found = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == randomnumber) {
                    found = true;break;
                }
            }

            if (!found)arr[arr.length] = randomnumber;
        }

        return arr;
    },

    stringifyWithOrder: function(json, order) {
        var keys = Object.keys(json);
        var orderKeys = [];
        for (var i = 0; i < order.length; i++) {
            orderKeys.push(keys[order[i]]);
        }

        return JSON.stringify(json, orderKeys);
    },

};
