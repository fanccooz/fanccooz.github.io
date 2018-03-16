"use strict";

/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 * DSP拖动
 */
(function () {
  function t(e, t) {
    return [].slice.call((t || document).querySelectorAll(e));
  }
  if (!window.addEventListener) return;
  var e = window.StyleFix = {
    link: function link(t) {
      try {
        if (t.rel !== "stylesheet" || t.hasAttribute("data-noprefix")) return;
      } catch (n) {
        return;
      }
      var r = t.href || t.getAttribute("data-href"),
          i = r.replace(/[^\/]+$/, ""),
          s = t.parentNode,
          o = new XMLHttpRequest(),
          u = void 0;
      o.onreadystatechange = function () {
        o.readyState === 4 && u();
      };
      u = function u() {
        var n = o.responseText;
        if (n && t.parentNode && (!o.status || o.status < 400 || o.status > 600)) {
          n = e.fix(n, !0, t);
          if (i) {
            n = n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi, function (e, t, n) {
              return (/^([a-z]{3,10}:|\/|#)/i.test(n) ? e : 'url("' + i + n + '")'
              );
            });
            var _r = i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1");
            n = n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)" + _r, "gi"), "$1");
          }
          var _u = document.createElement("style");
          _u.textContent = n;
          _u.media = t.media;
          _u.disabled = t.disabled;
          _u.setAttribute("data-href", t.getAttribute("href"));
          s.insertBefore(_u, t);
          s.removeChild(t);
          _u.media = t.media;
        }
      };
      try {
        o.open("GET", r);
        o.send(null);
      } catch (n) {
        if (typeof XDomainRequest != "undefined") {
          o = new XDomainRequest();
          o.onerror = o.onprogress = function () {};
          o.onload = u;
          o.open("GET", r);
          o.send(null);
        }
      }
      t.setAttribute("data-inprogress", "");
    },
    styleElement: function styleElement(t) {
      if (t.hasAttribute("data-noprefix")) return;
      var n = t.disabled;
      t.textContent = e.fix(t.textContent, !0, t);
      t.disabled = n;
    },
    styleAttribute: function styleAttribute(t) {
      var n = t.getAttribute("style");
      n = e.fix(n, !1, t);
      t.setAttribute("style", n);
    },
    process: function process() {
      t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);
      t("style").forEach(StyleFix.styleElement);
      t("[style]").forEach(StyleFix.styleAttribute);
    },
    register: function register(t, n) {
      (e.fixers = e.fixers || []).splice(n === undefined ? e.fixers.length : n, 0, t);
    },
    fix: function fix(t, n, r) {
      for (var i = 0; i < e.fixers.length; i++) {
        t = e.fixers[i](t, n, r) || t;
      }return t;
    },
    camelCase: function camelCase(e) {
      return e.replace(/-([a-z])/g, function (e, t) {
        return t.toUpperCase();
      }).replace("-", "");
    },
    deCamelCase: function deCamelCase(e) {
      return e.replace(/[A-Z]/g, function (e) {
        return "-" + e.toLowerCase();
      });
    }
  };(function () {
    setTimeout(function () {
      t('link[rel="stylesheet"]').forEach(StyleFix.link);
    }, 10);
    document.addEventListener("DOMContentLoaded", StyleFix.process, !1);
  })();
})();(function (e) {
  function t(e, t, r, i, s) {
    e = n[e];
    if (e.length) {
      var o = RegExp(t + "(" + e.join("|") + ")" + r, "gi");
      s = s.replace(o, i);
    }
    return s;
  }
  if (!window.StyleFix || !window.getComputedStyle) return;
  var n = window.PrefixFree = {
    prefixCSS: function prefixCSS(e, r, i) {
      var s = n.prefix;
      n.functions.indexOf("linear-gradient") > -1 && (e = e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig, function (e, t, n, r) {
        return t + (n || "") + "linear-gradient(" + (90 - r) + "deg";
      }));
      e = t("functions", "(\\s|:|,)", "\\s*\\(", "$1" + s + "$2(", e);
      e = t("keywords", "(\\s|:)", "(\\s|;|\\}|$)", "$1" + s + "$2$3", e);
      e = t("properties", "(^|\\{|\\s|;)", "\\s*:", "$1" + s + "$2:", e);
      if (n.properties.length) {
        var o = RegExp("\\b(" + n.properties.join("|") + ")(?!:)", "gi");
        e = t("valueProperties", "\\b", ":(.+?);", function (e) {
          return e.replace(o, s + "$1");
        }, e);
      }
      if (r) {
        e = t("selectors", "", "\\b", n.prefixSelector, e);
        e = t("atrules", "@", "\\b", "@" + s + "$1", e);
      }
      e = e.replace(RegExp("-" + s, "g"), "-");
      e = e.replace(/-\*-(?=[a-z]+)/gi, n.prefix);
      return e;
    },
    property: function property(e) {
      return (n.properties.indexOf(e) ? n.prefix : "") + e;
    },
    value: function value(e, r) {
      e = t("functions", "(^|\\s|,)", "\\s*\\(", "$1" + n.prefix + "$2(", e);
      e = t("keywords", "(^|\\s)", "(\\s|$)", "$1" + n.prefix + "$2$3", e);
      return e;
    },
    prefixSelector: function prefixSelector(e) {
      return e.replace(/^:{1,2}/, function (e) {
        return e + n.prefix;
      });
    },
    prefixProperty: function prefixProperty(e, t) {
      var r = n.prefix + e;
      return t ? StyleFix.camelCase(r) : r;
    }
  };(function () {
    var e = {},
        t = [],
        r = {},
        i = getComputedStyle(document.documentElement, null),
        s = document.createElement("div").style,
        o = function o(n) {
      if (n.charAt(0) === "-") {
        t.push(n);
        var _r2 = n.split("-"),
            _i3 = _r2[1];
        e[_i3] = ++e[_i3] || 1;
        while (_r2.length > 3) {
          _r2.pop();
          var _s = _r2.join("-");
          u(_s) && t.indexOf(_s) === -1 && t.push(_s);
        }
      }
    },
        u = function u(e) {
      return StyleFix.camelCase(e) in s;
    };
    if (i.length > 0) for (var a = 0; a < i.length; a++) {
      o(i[a]);
    } else for (var f in i) {
      o(StyleFix.deCamelCase(f));
    }var l = {
      uses: 0
    };
    for (var c in e) {
      var h = e[c];
      l.uses < h && (l = {
        prefix: c,
        uses: h
      });
    }
    n.prefix = "-" + l.prefix + "-";
    n.Prefix = StyleFix.camelCase(n.prefix);
    n.properties = [];
    for (var _a = 0; _a < t.length; _a++) {
      var _f = t[_a];
      if (_f.indexOf(n.prefix) === 0) {
        var p = _f.slice(n.prefix.length);
        u(p) || n.properties.push(p);
      }
    }
    n.Prefix == "Ms" && !("transform" in s) && !("MsTransform" in s) && "msTransform" in s && n.properties.push("transform", "transform-origin");
    n.properties.sort();
  })();(function () {
    function i(e, t) {
      r[t] = "";
      r[t] = e;
      return !!r[t];
    }
    var e = {
      "linear-gradient": {
        property: "backgroundImage",
        params: "red, teal"
      },
      calc: {
        property: "width",
        params: "1px + 5%"
      },
      element: {
        property: "backgroundImage",
        params: "#foo"
      },
      "cross-fade": {
        property: "backgroundImage",
        params: "url(a.png), url(b.png), 50%"
      }
    };
    e["repeating-linear-gradient"] = e["repeating-radial-gradient"] = e["radial-gradient"] = e["linear-gradient"];
    var t = {
      initial: "color",
      "zoom-in": "cursor",
      "zoom-out": "cursor",
      box: "display",
      flexbox: "display",
      "inline-flexbox": "display",
      flex: "display",
      "inline-flex": "display"
    };
    n.functions = [];
    n.keywords = [];
    var r = document.createElement("div").style;
    for (var s in e) {
      var o = e[s],
          u = o.property,
          a = s + "(" + o.params + ")";!i(a, u) && i(n.prefix + a, u) && n.functions.push(s);
    }
    for (var f in t) {
      var _u2 = t[f];!i(f, _u2) && i(n.prefix + f, _u2) && n.keywords.push(f);
    }
  })();(function () {
    function s(e) {
      i.textContent = e + "{}";
      return !!i.sheet.cssRules.length;
    }
    var t = {
      ":read-only": null,
      ":read-write": null,
      ":any-link": null,
      "::selection": null
    },
        r = {
      keyframes: "name",
      viewport: null,
      document: 'regexp(".")'
    };
    n.selectors = [];
    n.atrules = [];
    var i = e.appendChild(document.createElement("style"));
    for (var o in t) {
      var u = o + (t[o] ? "(" + t[o] + ")" : "");!s(u) && s(n.prefixSelector(u)) && n.selectors.push(o);
    }
    for (var a in r) {
      var _u3 = a + " " + (r[a] || "");!s("@" + _u3) && s("@" + n.prefix + _u3) && n.atrules.push(a);
    }
    e.removeChild(i);
  })();
  n.valueProperties = ["transition", "transition-property"];
  e.className += " " + n.prefix;
  StyleFix.register(n.prefixCSS);
})(document.documentElement);

//物联网云平台
function cloudImgShow() {

  $(document).ready(function () {
    var $cont = $('.cont');
    var $slide = $('.slide');
    var $closeBtn = $('.slide-close');
    var $text = $('.slide-text');
    var $iconTwitter = $('.icon-link-twitter');
    var numSlides = 4;
    var initialAnimDur = 1705;
    var animDelay = 500;
    var initialAnim = true;
    var clickAnim = false;

    $(document).on('click', '.slide-bg-dark', function () {
      if (initialAnim || clickAnim) return;
      var _this = $(this).parent();
      var target = +_this.attr('data-target');
      clickAnim = true;

      _this.css({
        'transform': 'translate3d(-100%, 0, 0)',
        'transition': '750ms',
        'cursor': 'default'
      });

      _this.find('.slide-img-wrapper').css({
        'transform': 'translate3d(0, 0, 0) scale(.95, .95)',
        'transition': '2000ms'
      });

      for (var i = target, length = $slide.length; i < length; i++) {
        $('.slide-' + (i + 1)).css({
          'transform': 'translate3d(0, 0, 0)',
          'transition': '750ms'
        });
      };

      for (var _i = target, _length = $slide.length; _i > 1; _i--) {
        $('.slide-' + (_i - 1)).css({
          'transform': 'translate3d(-125%, 0, 0)',
          'transition': '750ms'
        });
      };

      setTimeout(function () {
        $slide.not(_this).find('.slide-bg-dark').css({
          'opacity': '0'
        });
      }, 750);

      $closeBtn.addClass('show-close');
      $iconTwitter.addClass('icon-show');

      _this.find('.slide-text').css({
        'transform': 'translate3d(150px, -40%, 0)',
        'opacity': '1',
        'transition': '2000ms',
        '-webkit-transition': '2000ms'
      });
    });

    $(document).on('mousemove', '.slide', function () {
      if (initialAnim || clickAnim) return;
      var _this = $(this);
      var target = +_this.attr('data-target');

      _this.css({
        'transform': 'translate3d(-' + (100 / numSlides * (numSlides - (target - 1)) + 5) + '%, 0, 0)',
        'transition': '750ms'
      });

      _this.find('.slide-text').css({
        'transform': 'translate3d(0, -40%, 0) rotate(0.01deg)',
        '-moz-transform': 'translate3d(0, -40%, 0) rotate(0.01deg)',
        'opacity': '1',
        'transition': '750ms',
        '-webkit-transition': '750ms'
      });

      for (var i = target, length = $slide.length; i < length; i++) {
        $('.slide-' + (i + 1)).css({
          'transform': 'translate3d(-' + (100 / numSlides * (numSlides - (i + 1 - 1)) - 5) + '%, 0, 0)',
          'transition': '750ms'
        });
      };

      for (var _i2 = target; _i2 > 1; _i2--) {
        $('.slide-' + (_i2 - 1)).css({
          'transform': 'translate3d(-' + (100 / numSlides * (numSlides - (_i2 - 1 - 1)) + 5) + '%, 0, 0)',
          'transition': '750ms'
        });
      };

      _this.find('.slide-img-wrapper').css({
        'transform': 'translate3d(-200px, 0, 0) scale(.85, .85)',
        'transition': '750ms'
      });

      $slide.not(_this).find('.slide-img-wrapper').css({
        'transform': 'translate3d(-200px, 0, 0) scale(.90, .90)',
        'transition': '1000ms'
      });

      $slide.not(_this).find('.slide-bg-dark').css({
        'opacity': '.75'
      });
    });

    $(document).on('mouseleave', '.slide', function () {
      if (initialAnim || clickAnim) return;
      var _this = $(this);
      var target = +_this.attr('data-target');

      for (var i = 1, length = $slide.length; i <= length; i++) {
        $('.slide-' + i).css({
          'transform': 'translate3d(-' + 100 / numSlides * (numSlides - (i - 1)) + '%, 0, 0)',
          'transition': '1000ms'
        });
      }

      $slide.find('.slideimg-wrapper').css({
        'transform': 'translate3d(-200px, 0, 0) scale(1, 1)',
        'transition': '750ms'
      });

      $slide.find('.slide-bg-dark').css({
        'opacity': '0'
      });

      $text.css({
        'transform': 'translate3d(0, -50%, 0) rotate(0.01deg)',
        'opacity': '0',
        'transition': '200ms',
        '-webkit-transition': '200ms'
      });
    });

    $(document).on('click', '.slide-close', function () {

      setTimeout(function () {
        clickAnim = false;
      }, 1000);

      $closeBtn.removeClass('show-close');
      $iconTwitter.removeClass('icon-show');

      for (var i = 1, length = $slide.length; i <= length; i++) {
        $('.slide-' + i).css({
          'transform': 'translate3d(-' + 100 / numSlides * (numSlides - (i - 1)) + '%, 0, 0)',
          'transition': '1000ms',
          'cursor': 'pointer'
        });
      }

      $text.css({
        'transform': 'translate3d(150px, -40%, 0)',
        'opacity': '0',
        'transition': '200ms',
        '-webkit-transition': '200ms'
      });

      setTimeout(function () {
        $text.css({
          'transform': 'translate3d(0, -50%, 0)'
        });
      }, 200);
    });

    setTimeout(function () {
      $cont.addClass('active');
    }, animDelay);

    setTimeout(function () {
      initialAnim = false;
    }, initialAnimDur + animDelay);
  });
}
//# sourceMappingURL=other.js.map