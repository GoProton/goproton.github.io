var shorten = function (e, r) {
    for (var t = r; t > 0; t--) e.pop();
  },
  rstrip = function (e, r) {
    for (var t = e.length; e[t - 1] === r; ) t--;
    return e.slice(0, t);
  },
  ascii85 = (this.ascii85 = (function () {
    var e = {
      Ascii85CodecError: function (e) {
        this.message = e;
      },
    };
    e.Ascii85CodecError.prototype.toString = function () {
      return "Ascii85CodecError" + (this.message ? ": " + this.message : "");
    };
    var r = function (r, t) {
      if (!r) throw new e.Ascii85CodecError(t);
    };
    return (
      (e.encode = function (e) {
        r(!/[^\x00-\xFF]/.test(e), "Input contains out-of-range characters.");
        for (
          var t = "\0\0\0\0".slice(e.length % 4 || 4),
            n = [],
            o = 0,
            a = (e += t).length;
          o < a;
          o += 4
        ) {
          var s,
            c,
            i,
            h,
            u,
            l =
              ((e.charCodeAt(o) << 24) +
                (e.charCodeAt(o + 1) << 16) +
                (e.charCodeAt(o + 2) << 8) +
                e.charCodeAt(o + 3)) >>>
              0;
          if (0 !== l)
            (s =
              (l =
                ((l =
                  ((l = ((l = (l - (u = l % 85)) / 85) - (h = l % 85)) / 85) -
                    (i = l % 85)) /
                  85) -
                  (c = l % 85)) /
                85) % 85),
              n.push(s + 33, c + 33, i + 33, h + 33, u + 33);
          else n.push(122);
        }
        return (
          shorten(n, t.length),
          "<~" + String.fromCharCode.apply(String, n) + "~>"
        );
      }),
      (e.decode = function (e) {
        r(
          "<~" === e.slice(0, 2) && "~>" === e.slice(-2),
          "Invalid initial/final ascii85 characters",
        ),
          (e = e.slice(2, -2).replace(/\s/g, "").replace("z", "!!!!!")),
          r(!/[^\x21-\x75]/.test(e), "Input contains out-of-range characters.");
        for (
          var t,
            n = "uuuuu".slice(e.length % 5 || 5),
            o = [],
            a = 0,
            s = (e += n).length;
          a < s;
          a += 5
        )
          (t =
            52200625 * (e.charCodeAt(a) - 33) +
            614125 * (e.charCodeAt(a + 1) - 33) +
            7225 * (e.charCodeAt(a + 2) - 33) +
            85 * (e.charCodeAt(a + 3) - 33) +
            (e.charCodeAt(a + 4) - 33)),
            o.push((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, 255 & t);
        return shorten(o, n.length), String.fromCharCode.apply(String, o);
      }),
      e
    );
  })()),
  base64Codec = function (e, r) {
    if (64 != e.length) throw new Error("Alphabet must be 64 characters.");
    for (var t = {}, n = {}, o = 0, a = e.length; o < a; o++) n[e[o]] = o;
    var s = new RegExp(
      "[^" + e.replace(/[\.\^\$\*\+\?\{\[\]\\\|\(\)]/g, "\\$&") + "]",
    );
    (t.Base64CodecError = function (e) {
      this.message = e;
    }),
      (t.Base64CodecError.prototype.toString = function () {
        return "Base64CodecError" + (this.message ? ": " + this.message : "");
      });
    var c = function (e, r) {
      if (!e) throw new t.Base64CodecError(r);
    };
    return (
      (t.encode = function (t, n) {
        null == n && (n = !0),
          c(!/[^\x00-\xFF]/.test(t), "Input contains out-of-range characters.");
        for (
          var o = "\0\0\0".slice(t.length % 3 || 3),
            a = [],
            s = 0,
            i = (t += o).length;
          s < i;
          s += 3
        ) {
          var h =
            (t.charCodeAt(s) << 16) +
            (t.charCodeAt(s + 1) << 8) +
            t.charCodeAt(s + 2);
          a.push(
            e[(h >> 18) & 63],
            e[(h >> 12) & 63],
            e[(h >> 6) & 63],
            e[63 & h],
          );
        }
        return (
          (output_padding =
            n && void 0 !== r ? Array(5).join(r).slice(-o.length) : ""),
          shorten(a, o.length),
          a.join("") + output_padding
        );
      }),
      (t.decode = function (t, o, a) {
        a || (t = t.replace(/\s/g, "")),
          null != r &&
            (c(!(o && t.length % 4), "Input length not divisible by 4."),
            (t = rstrip(t, r))),
          c(!s.test(t), "Input contains out-of-range characters.");
        for (
          var i = Array(5 - (t.length % 4 || 4)).join(e[e.length - 1]),
            h = [],
            u = 0,
            l = (t += i).length;
          u < l;
          u += 4
        )
          (newchars =
            (n[t[u]] << 18) +
            (n[t[u + 1]] << 12) +
            (n[t[u + 2]] << 6) +
            n[t[u + 3]]),
            h.push(
              (newchars >> 16) & 255,
              (newchars >> 8) & 255,
              255 & newchars,
            );
        return shorten(h, i.length), String.fromCharCode.apply(String, h);
      }),
      t
    );
  },
  base64 = (this.base64 = base64Codec(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    "=",
  )),
  base64_urlsafe = (this.base64_urlsafe = base64Codec(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    "=",
  ));
