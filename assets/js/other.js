/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 * DSP拖动
 */
(function() {
  function t(e, t) {
    return [].slice.call((t || document).querySelectorAll(e))
  }
  if (!window.addEventListener) return;
  let e = window.StyleFix = {
    link: function(t) {
      try {
        if (t.rel !== "stylesheet" || t.hasAttribute("data-noprefix")) return
      } catch(n) {
        return
      }
      let r = t.href || t.getAttribute("data-href"),
        i = r.replace(/[^\/]+$/, ""),
        s = t.parentNode,
        o = new XMLHttpRequest,
        u;
      o.onreadystatechange = function() {
        o.readyState === 4 && u()
      };
      u = function() {
        let n = o.responseText;
        if (n && t.parentNode && (!o.status || o.status < 400 || o.status > 600)) {
          n = e.fix(n, !0, t);
          if (i) {
            n = n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,
              function(e, t, n) {
                return /^([a-z]{3,10}:|\/|#)/i.test(n) ? e: 'url("' + i + n + '")'
              });
            let r = i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1");
            n = n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)" + r, "gi"), "$1")
          }
          let u = document.createElement("style");
          u.textContent = n;
          u.media = t.media;
          u.disabled = t.disabled;
          u.setAttribute("data-href", t.getAttribute("href"));
          s.insertBefore(u, t);
          s.removeChild(t);
          u.media = t.media
        }
      };
      try {
        o.open("GET", r);
        o.send(null)
      } catch(n) {
        if (typeof XDomainRequest != "undefined") {
          o = new XDomainRequest;
          o.onerror = o.onprogress = function() {};
          o.onload = u;
          o.open("GET", r);
          o.send(null)
        }
      }
      t.setAttribute("data-inprogress", "")
    },
    styleElement: function(t) {
      if (t.hasAttribute("data-noprefix")) return;
      let n = t.disabled;
      t.textContent = e.fix(t.textContent, !0, t);
      t.disabled = n
    },
    styleAttribute: function(t) {
      let n = t.getAttribute("style");
      n = e.fix(n, !1, t);
      t.setAttribute("style", n)
    },
    process: function() {
      t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);
      t("style").forEach(StyleFix.styleElement);
      t("[style]").forEach(StyleFix.styleAttribute)
    },
    register: function(t, n) { (e.fixers = e.fixers || []).splice(n === undefined ? e.fixers.length: n, 0, t)
    },
    fix: function(t, n, r) {
      for (let i = 0; i < e.fixers.length; i++) t = e.fixers[i](t, n, r) || t;
      return t
    },
    camelCase: function(e) {
      return e.replace(/-([a-z])/g,
        function(e, t) {
          return t.toUpperCase()
        }).replace("-", "")
    },
    deCamelCase: function(e) {
      return e.replace(/[A-Z]/g,
        function(e) {
          return "-" + e.toLowerCase()
        })
    }
  }; (function() {
    setTimeout(function() {
        t('link[rel="stylesheet"]').forEach(StyleFix.link)
      },
      10);
    document.addEventListener("DOMContentLoaded", StyleFix.process, !1)
  })()
})(); (function(e) {
  function t(e, t, r, i, s) {
    e = n[e];
    if (e.length) {
      let o = RegExp(t + "(" + e.join("|") + ")" + r, "gi");
      s = s.replace(o, i)
    }
    return s
  }
  if (!window.StyleFix || !window.getComputedStyle) return;
  let n = window.PrefixFree = {
    prefixCSS: function(e, r, i) {
      let s = n.prefix;
      n.functions.indexOf("linear-gradient") > -1 && (e = e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,
        function(e, t, n, r) {
          return t + (n || "") + "linear-gradient(" + (90 - r) + "deg"
        }));
      e = t("functions", "(\\s|:|,)", "\\s*\\(", "$1" + s + "$2(", e);
      e = t("keywords", "(\\s|:)", "(\\s|;|\\}|$)", "$1" + s + "$2$3", e);
      e = t("properties", "(^|\\{|\\s|;)", "\\s*:", "$1" + s + "$2:", e);
      if (n.properties.length) {
        let o = RegExp("\\b(" + n.properties.join("|") + ")(?!:)", "gi");
        e = t("valueProperties", "\\b", ":(.+?);",
          function(e) {
            return e.replace(o, s + "$1")
          },
          e)
      }
      if (r) {
        e = t("selectors", "", "\\b", n.prefixSelector, e);
        e = t("atrules", "@", "\\b", "@" + s + "$1", e)
      }
      e = e.replace(RegExp("-" + s, "g"), "-");
      e = e.replace(/-\*-(?=[a-z]+)/gi, n.prefix);
      return e
    },
    property: function(e) {
      return (n.properties.indexOf(e) ? n.prefix: "") + e
    },
    value: function(e, r) {
      e = t("functions", "(^|\\s|,)", "\\s*\\(", "$1" + n.prefix + "$2(", e);
      e = t("keywords", "(^|\\s)", "(\\s|$)", "$1" + n.prefix + "$2$3", e);
      return e
    },
    prefixSelector: function(e) {
      return e.replace(/^:{1,2}/,
        function(e) {
          return e + n.prefix
        })
    },
    prefixProperty: function(e, t) {
      let r = n.prefix + e;
      return t ? StyleFix.camelCase(r) : r
    }
  }; (function() {
    let e = {},
      t = [],
      r = {},
      i = getComputedStyle(document.documentElement, null),
      s = document.createElement("div").style,
      o = function(n) {
        if (n.charAt(0) === "-") {
          t.push(n);
          let r = n.split("-"),
            i = r[1];
          e[i] = ++e[i] || 1;
          while (r.length > 3) {
            r.pop();
            let s = r.join("-");
            u(s) && t.indexOf(s) === -1 && t.push(s)
          }
        }
      },
      u = function(e) {
        return StyleFix.camelCase(e) in s
      };
    if (i.length > 0) for (let a = 0; a < i.length; a++) o(i[a]);
    else for (let f in i) o(StyleFix.deCamelCase(f));
    let l = {
      uses: 0
    };
    for (let c in e) {
      let h = e[c];
      l.uses < h && (l = {
        prefix: c,
        uses: h
      })
    }
    n.prefix = "-" + l.prefix + "-";
    n.Prefix = StyleFix.camelCase(n.prefix);
    n.properties = [];
    for (let a = 0; a < t.length; a++) {
      let f = t[a];
      if (f.indexOf(n.prefix) === 0) {
        let p = f.slice(n.prefix.length);
        u(p) || n.properties.push(p)
      }
    }
    n.Prefix == "Ms" && !("transform" in s) && !("MsTransform" in s) && "msTransform" in s && n.properties.push("transform", "transform-origin");
    n.properties.sort()
  })(); (function() {
    function i(e, t) {
      r[t] = "";
      r[t] = e;
      return !! r[t]
    }
    let e = {
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
    let t = {
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
    let r = document.createElement("div").style;
    for (let s in e) {
      let o = e[s],
        u = o.property,
        a = s + "(" + o.params + ")"; ! i(a, u) && i(n.prefix + a, u) && n.functions.push(s)
    }
    for (let f in t) {
      let u = t[f]; ! i(f, u) && i(n.prefix + f, u) && n.keywords.push(f)
    }
  })(); (function() {
    function s(e) {
      i.textContent = e + "{}";
      return !! i.sheet.cssRules.length
    }
    let t = {
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
    let i = e.appendChild(document.createElement("style"));
    for (let o in t) {
      let u = o + (t[o] ? "(" + t[o] + ")": ""); ! s(u) && s(n.prefixSelector(u)) && n.selectors.push(o)
    }
    for (let a in r) {
      let u = a + " " + (r[a] || ""); ! s("@" + u) && s("@" + n.prefix + u) && n.atrules.push(a)
    }
    e.removeChild(i)
  })();
  n.valueProperties = ["transition", "transition-property"];
  e.className += " " + n.prefix;
  StyleFix.register(n.prefixCSS)
})(document.documentElement);


//物联网云平台
function cloudImgShow() {

  $(document).ready(function () {
    let $cont = $('.cont');
    let $slide = $('.slide');
    let $closeBtn = $('.slide-close');
    let $text = $('.slide-text');
    let $iconTwitter = $('.icon-link-twitter');
    let numSlides = 4;
    let initialAnimDur = 1705;
    let animDelay = 500;
    let initialAnim = true;
    let clickAnim = false;

    $(document).on('click', '.slide-bg-dark', function () {
      if (initialAnim || clickAnim) return;
      let _this = $(this).parent();
      let target = +_this.attr('data-target');
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

      for (let i = target, length = $slide.length; i < length; i++) {
        $('.slide-' + (i + 1)).css({
          'transform': 'translate3d(0, 0, 0)',
          'transition': '750ms'
        });
      };

      for (let _i = target, _length = $slide.length; _i > 1; _i--) {
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
      let _this = $(this);
      let target = +_this.attr('data-target');

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

      for (let i = target, length = $slide.length; i < length; i++) {
        $('.slide-' + (i + 1)).css({
          'transform': 'translate3d(-' + (100 / numSlides * (numSlides - (i + 1 - 1)) - 5) + '%, 0, 0)',
          'transition': '750ms'
        });
      };

      for (let _i2 = target; _i2 > 1; _i2--) {
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
      let _this = $(this);
      let target = +_this.attr('data-target');

      for (let i = 1, length = $slide.length; i <= length; i++) {
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

      for (let i = 1, length = $slide.length; i <= length; i++) {
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