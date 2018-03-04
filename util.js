/**
 * Created by cheergo on 2018/3/4.
 */

const pbkdf2 = require('pbkdf2')

let t = {
    wordsToBytes: function (e) {
        for (let t = [], n = 0; n < 32 * e.length; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
        return t
    },
    bytesToWords: function (e) {
        for (let t = [], n = 0, r = 0; n < e.length; n++, r += 8) t[r >>> 5] |= e[n] << 24 - r % 32;
        return t
    },
    bytesToString: function (e) {
        for (let t = [], n = 0; n < e.length; n++)
            t.push(String.fromCharCode(e[n]));
        return t.join("")
    },
    bytesToHex: function (e) {
        for (let t = [], n = 0; n < e.length; n++)
            t.push((e[n] >>> 4).toString(16)),
                t.push((15 & e[n]).toString(16));
        return t.join("")
    },
};
let n = {
    stringToBytes: function (e) {
        return n.bin.stringToBytes(unescape(encodeURIComponent(e)))
    },
    'bin': {
        stringToBytes: function (e) {
            for (let t = [], n = 0; n < e.length; n++)
                t.push(255 & e.charCodeAt(n));
            return t
        },
        bytesToString: function (e) {
            for (let t = [], n = 0; n < e.length; n++)
                t.push(String.fromCharCode(e[n]));
            return t.join("")
        }
    },
    endian: function (e) {
        if (e.constructor == Number)
            return 16711935 & n.rotl(e, 8) | 4278255360 & n.rotl(e, 24);
        for (let t = 0; t < e.length; t++)
            e[t] = n.endian(e[t]);
        return e
    },
    rotl: function (e, t) {
        return e << t | e >>> 32 - t
    },
    rotr: function (e, t) {
        return e << 32 - t | e >>> t
    },
};
i = function (e, n) {
    e.constructor == String ? e = n && "binary" === n.encoding ? n.bin.stringToBytes(e) : n.stringToBytes(e) : false ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || (e = e.toString());
    for (let s = t.bytesToWords(e), c = 8 * e.length, l = 1732584193, u = -271733879, f = -1732584194, d = 271733878, p = 0; p < s.length; p++) s[p] = 16711935 & (s[p] << 8 | s[p] >>> 24) | 4278255360 & (s[p] << 24 | s[p] >>> 8);
    s[c >>> 5] |= 128 << c % 32,
        s[14 + (c + 64 >>> 9 << 4)] = c;
    for (let h = i_ff,
             m = i_gg,
             g = i_hh,
             b = i_ii,
             p = 0; p < s.length; p += 16) {
        let v = l,
            y = u,
            w = f,
            x = d;
        l = h(l, u, f, d, s[p + 0], 7, -680876936),
            d = h(d, l, u, f, s[p + 1], 12, -389564586),
            f = h(f, d, l, u, s[p + 2], 17, 606105819),
            u = h(u, f, d, l, s[p + 3], 22, -1044525330),
            l = h(l, u, f, d, s[p + 4], 7, -176418897),
            d = h(d, l, u, f, s[p + 5], 12, 1200080426),
            f = h(f, d, l, u, s[p + 6], 17, -1473231341),
            u = h(u, f, d, l, s[p + 7], 22, -45705983),
            l = h(l, u, f, d, s[p + 8], 7, 1770035416),
            d = h(d, l, u, f, s[p + 9], 12, -1958414417),
            f = h(f, d, l, u, s[p + 10], 17, -42063),
            u = h(u, f, d, l, s[p + 11], 22, -1990404162),
            l = h(l, u, f, d, s[p + 12], 7, 1804603682),
            d = h(d, l, u, f, s[p + 13], 12, -40341101),
            f = h(f, d, l, u, s[p + 14], 17, -1502002290),
            u = h(u, f, d, l, s[p + 15], 22, 1236535329),
            l = m(l, u, f, d, s[p + 1], 5, -165796510),
            d = m(d, l, u, f, s[p + 6], 9, -1069501632),
            f = m(f, d, l, u, s[p + 11], 14, 643717713),
            u = m(u, f, d, l, s[p + 0], 20, -373897302),
            l = m(l, u, f, d, s[p + 5], 5, -701558691),
            d = m(d, l, u, f, s[p + 10], 9, 38016083),
            f = m(f, d, l, u, s[p + 15], 14, -660478335),
            u = m(u, f, d, l, s[p + 4], 20, -405537848),
            l = m(l, u, f, d, s[p + 9], 5, 568446438),
            d = m(d, l, u, f, s[p + 14], 9, -1019803690),
            f = m(f, d, l, u, s[p + 3], 14, -187363961),
            u = m(u, f, d, l, s[p + 8], 20, 1163531501),
            l = m(l, u, f, d, s[p + 13], 5, -1444681467),
            d = m(d, l, u, f, s[p + 2], 9, -51403784),
            f = m(f, d, l, u, s[p + 7], 14, 1735328473),
            u = m(u, f, d, l, s[p + 12], 20, -1926607734),
            l = g(l, u, f, d, s[p + 5], 4, -378558),
            d = g(d, l, u, f, s[p + 8], 11, -2022574463),
            f = g(f, d, l, u, s[p + 11], 16, 1839030562),
            u = g(u, f, d, l, s[p + 14], 23, -35309556),
            l = g(l, u, f, d, s[p + 1], 4, -1530992060),
            d = g(d, l, u, f, s[p + 4], 11, 1272893353),
            f = g(f, d, l, u, s[p + 7], 16, -155497632),
            u = g(u, f, d, l, s[p + 10], 23, -1094730640),
            l = g(l, u, f, d, s[p + 13], 4, 681279174),
            d = g(d, l, u, f, s[p + 0], 11, -358537222),
            f = g(f, d, l, u, s[p + 3], 16, -722521979),
            u = g(u, f, d, l, s[p + 6], 23, 76029189),
            l = g(l, u, f, d, s[p + 9], 4, -640364487),
            d = g(d, l, u, f, s[p + 12], 11, -421815835),
            f = g(f, d, l, u, s[p + 15], 16, 530742520),
            u = g(u, f, d, l, s[p + 2], 23, -995338651),
            l = b(l, u, f, d, s[p + 0], 6, -198630844),
            d = b(d, l, u, f, s[p + 7], 10, 1126891415),
            f = b(f, d, l, u, s[p + 14], 15, -1416354905),
            u = b(u, f, d, l, s[p + 5], 21, -57434055),
            l = b(l, u, f, d, s[p + 12], 6, 1700485571),
            d = b(d, l, u, f, s[p + 3], 10, -1894986606),
            f = b(f, d, l, u, s[p + 10], 15, -1051523),
            u = b(u, f, d, l, s[p + 1], 21, -2054922799),
            l = b(l, u, f, d, s[p + 8], 6, 1873313359),
            d = b(d, l, u, f, s[p + 15], 10, -30611744),
            f = b(f, d, l, u, s[p + 6], 15, -1560198380),
            u = b(u, f, d, l, s[p + 13], 21, 1309151649),
            l = b(l, u, f, d, s[p + 4], 6, -145523070),
            d = b(d, l, u, f, s[p + 11], 10, -1120210379),
            f = b(f, d, l, u, s[p + 2], 15, 718787259),
            u = b(u, f, d, l, s[p + 9], 21, -343485551),
            l = l + v >>> 0,
            u = u + y >>> 0,
            f = f + w >>> 0,
            d = d + x >>> 0
    }
    return n.endian([l, u, f, d])
};
i_ff = function (e, t, n, r, o, a, i) {
    let s = e + (t & n | ~t & r) + (o >>> 0) + i;
    return (s << a | s >>> 32 - a) + t
};
i_gg = function (e, t, n, r, o, a, i) {
    let s = e + (t & r | n & ~r) + (o >>> 0) + i;
    return (s << a | s >>> 32 - a) + t
};
i_hh = function (e, t, n, r, o, a, i) {
    let s = e + (t ^ n ^ r) + (o >>> 0) + i;
    return (s << a | s >>> 32 - a) + t
};
i_ii = function (e, t, n, r, o, a, i) {
    let s = e + (n ^ (t | ~r)) + (o >>> 0) + i;
    return (s << a | s >>> 32 - a) + t
};

exports.cryptopwd = function (password) {
    let k1 = t.wordsToBytes(i(password, n));
    let k2 = t.bytesToHex(k1);
    let derivedKey = pbkdf2.pbkdf2Sync(password, k2, 2e3, 32, 'sha256');
    return derivedKey.toString("hex");
};