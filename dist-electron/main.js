import It, { app as vr, ipcMain as jt, BrowserWindow as ia } from "electron";
import vt from "fs";
import Ec from "constants";
import yr from "stream";
import aa from "util";
import kl from "assert";
import Ie from "path";
import Hr from "child_process";
import $l from "events";
import wr from "crypto";
import ql from "tty";
import Gr from "os";
import yt from "url";
import Ml from "zlib";
import vc from "http";
import { execFile as yc } from "node:child_process";
import { promisify as wc } from "node:util";
import { fileURLToPath as _c } from "node:url";
import ut from "node:path";
import ta from "node:fs";
var et = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, bt = {}, tn = {}, Ir = {}, Da;
function Ye() {
  return Da || (Da = 1, Ir.fromCallback = function(e) {
    return Object.defineProperty(function(...c) {
      if (typeof c[c.length - 1] == "function") e.apply(this, c);
      else
        return new Promise((p, f) => {
          c.push((d, l) => d != null ? f(d) : p(l)), e.apply(this, c);
        });
    }, "name", { value: e.name });
  }, Ir.fromPromise = function(e) {
    return Object.defineProperty(function(...c) {
      const p = c[c.length - 1];
      if (typeof p != "function") return e.apply(this, c);
      c.pop(), e.apply(this, c).then((f) => p(null, f), p);
    }, "name", { value: e.name });
  }), Ir;
}
var rn, Fa;
function Rc() {
  if (Fa) return rn;
  Fa = 1;
  var e = Ec, c = process.cwd, p = null, f = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return p || (p = c.call(process)), p;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var d = process.chdir;
    process.chdir = function(a) {
      p = null, d.call(process, a);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, d);
  }
  rn = l;
  function l(a) {
    e.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && u(a), a.lutimes || o(a), a.chown = t(a.chown), a.fchown = t(a.fchown), a.lchown = t(a.lchown), a.chmod = s(a.chmod), a.fchmod = s(a.fchmod), a.lchmod = s(a.lchmod), a.chownSync = r(a.chownSync), a.fchownSync = r(a.fchownSync), a.lchownSync = r(a.lchownSync), a.chmodSync = n(a.chmodSync), a.fchmodSync = n(a.fchmodSync), a.lchmodSync = n(a.lchmodSync), a.stat = h(a.stat), a.fstat = h(a.fstat), a.lstat = h(a.lstat), a.statSync = g(a.statSync), a.fstatSync = g(a.fstatSync), a.lstatSync = g(a.lstatSync), a.chmod && !a.lchmod && (a.lchmod = function(m, w, S) {
      S && process.nextTick(S);
    }, a.lchmodSync = function() {
    }), a.chown && !a.lchown && (a.lchown = function(m, w, S, b) {
      b && process.nextTick(b);
    }, a.lchownSync = function() {
    }), f === "win32" && (a.rename = typeof a.rename != "function" ? a.rename : (function(m) {
      function w(S, b, N) {
        var P = Date.now(), F = 0;
        m(S, b, function O(L) {
          if (L && (L.code === "EACCES" || L.code === "EPERM" || L.code === "EBUSY") && Date.now() - P < 6e4) {
            setTimeout(function() {
              a.stat(b, function(R, Y) {
                R && R.code === "ENOENT" ? m(S, b, O) : N(L);
              });
            }, F), F < 100 && (F += 10);
            return;
          }
          N && N(L);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(w, m), w;
    })(a.rename)), a.read = typeof a.read != "function" ? a.read : (function(m) {
      function w(S, b, N, P, F, O) {
        var L;
        if (O && typeof O == "function") {
          var R = 0;
          L = function(Y, G, $) {
            if (Y && Y.code === "EAGAIN" && R < 10)
              return R++, m.call(a, S, b, N, P, F, L);
            O.apply(this, arguments);
          };
        }
        return m.call(a, S, b, N, P, F, L);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(w, m), w;
    })(a.read), a.readSync = typeof a.readSync != "function" ? a.readSync : /* @__PURE__ */ (function(m) {
      return function(w, S, b, N, P) {
        for (var F = 0; ; )
          try {
            return m.call(a, w, S, b, N, P);
          } catch (O) {
            if (O.code === "EAGAIN" && F < 10) {
              F++;
              continue;
            }
            throw O;
          }
      };
    })(a.readSync);
    function u(m) {
      m.lchmod = function(w, S, b) {
        m.open(
          w,
          e.O_WRONLY | e.O_SYMLINK,
          S,
          function(N, P) {
            if (N) {
              b && b(N);
              return;
            }
            m.fchmod(P, S, function(F) {
              m.close(P, function(O) {
                b && b(F || O);
              });
            });
          }
        );
      }, m.lchmodSync = function(w, S) {
        var b = m.openSync(w, e.O_WRONLY | e.O_SYMLINK, S), N = !0, P;
        try {
          P = m.fchmodSync(b, S), N = !1;
        } finally {
          if (N)
            try {
              m.closeSync(b);
            } catch {
            }
          else
            m.closeSync(b);
        }
        return P;
      };
    }
    function o(m) {
      e.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(w, S, b, N) {
        m.open(w, e.O_SYMLINK, function(P, F) {
          if (P) {
            N && N(P);
            return;
          }
          m.futimes(F, S, b, function(O) {
            m.close(F, function(L) {
              N && N(O || L);
            });
          });
        });
      }, m.lutimesSync = function(w, S, b) {
        var N = m.openSync(w, e.O_SYMLINK), P, F = !0;
        try {
          P = m.futimesSync(N, S, b), F = !1;
        } finally {
          if (F)
            try {
              m.closeSync(N);
            } catch {
            }
          else
            m.closeSync(N);
        }
        return P;
      }) : m.futimes && (m.lutimes = function(w, S, b, N) {
        N && process.nextTick(N);
      }, m.lutimesSync = function() {
      });
    }
    function s(m) {
      return m && function(w, S, b) {
        return m.call(a, w, S, function(N) {
          v(N) && (N = null), b && b.apply(this, arguments);
        });
      };
    }
    function n(m) {
      return m && function(w, S) {
        try {
          return m.call(a, w, S);
        } catch (b) {
          if (!v(b)) throw b;
        }
      };
    }
    function t(m) {
      return m && function(w, S, b, N) {
        return m.call(a, w, S, b, function(P) {
          v(P) && (P = null), N && N.apply(this, arguments);
        });
      };
    }
    function r(m) {
      return m && function(w, S, b) {
        try {
          return m.call(a, w, S, b);
        } catch (N) {
          if (!v(N)) throw N;
        }
      };
    }
    function h(m) {
      return m && function(w, S, b) {
        typeof S == "function" && (b = S, S = null);
        function N(P, F) {
          F && (F.uid < 0 && (F.uid += 4294967296), F.gid < 0 && (F.gid += 4294967296)), b && b.apply(this, arguments);
        }
        return S ? m.call(a, w, S, N) : m.call(a, w, N);
      };
    }
    function g(m) {
      return m && function(w, S) {
        var b = S ? m.call(a, w, S) : m.call(a, w);
        return b && (b.uid < 0 && (b.uid += 4294967296), b.gid < 0 && (b.gid += 4294967296)), b;
      };
    }
    function v(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var w = !process.getuid || process.getuid() !== 0;
      return !!(w && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return rn;
}
var nn, La;
function Ac() {
  if (La) return nn;
  La = 1;
  var e = yr.Stream;
  nn = c;
  function c(p) {
    return {
      ReadStream: f,
      WriteStream: d
    };
    function f(l, a) {
      if (!(this instanceof f)) return new f(l, a);
      e.call(this);
      var u = this;
      this.path = l, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, a = a || {};
      for (var o = Object.keys(a), s = 0, n = o.length; s < n; s++) {
        var t = o[s];
        this[t] = a[t];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          u._read();
        });
        return;
      }
      p.open(this.path, this.flags, this.mode, function(r, h) {
        if (r) {
          u.emit("error", r), u.readable = !1;
          return;
        }
        u.fd = h, u.emit("open", h), u._read();
      });
    }
    function d(l, a) {
      if (!(this instanceof d)) return new d(l, a);
      e.call(this), this.path = l, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, a = a || {};
      for (var u = Object.keys(a), o = 0, s = u.length; o < s; o++) {
        var n = u[o];
        this[n] = a[n];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = p.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return nn;
}
var an, Ua;
function Sc() {
  if (Ua) return an;
  Ua = 1, an = c;
  var e = Object.getPrototypeOf || function(p) {
    return p.__proto__;
  };
  function c(p) {
    if (p === null || typeof p != "object")
      return p;
    if (p instanceof Object)
      var f = { __proto__: e(p) };
    else
      var f = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(p).forEach(function(d) {
      Object.defineProperty(f, d, Object.getOwnPropertyDescriptor(p, d));
    }), f;
  }
  return an;
}
var Nr, xa;
function We() {
  if (xa) return Nr;
  xa = 1;
  var e = vt, c = Rc(), p = Ac(), f = Sc(), d = aa, l, a;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (l = /* @__PURE__ */ Symbol.for("graceful-fs.queue"), a = /* @__PURE__ */ Symbol.for("graceful-fs.previous")) : (l = "___graceful-fs.queue", a = "___graceful-fs.previous");
  function u() {
  }
  function o(m, w) {
    Object.defineProperty(m, l, {
      get: function() {
        return w;
      }
    });
  }
  var s = u;
  if (d.debuglog ? s = d.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (s = function() {
    var m = d.format.apply(d, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !e[l]) {
    var n = et[l] || [];
    o(e, n), e.close = (function(m) {
      function w(S, b) {
        return m.call(e, S, function(N) {
          N || g(), typeof b == "function" && b.apply(this, arguments);
        });
      }
      return Object.defineProperty(w, a, {
        value: m
      }), w;
    })(e.close), e.closeSync = (function(m) {
      function w(S) {
        m.apply(e, arguments), g();
      }
      return Object.defineProperty(w, a, {
        value: m
      }), w;
    })(e.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      s(e[l]), kl.equal(e[l].length, 0);
    });
  }
  et[l] || o(et, e[l]), Nr = t(f(e)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !e.__patched && (Nr = t(e), e.__patched = !0);
  function t(m) {
    c(m), m.gracefulify = t, m.createReadStream = ie, m.createWriteStream = te;
    var w = m.readFile;
    m.readFile = S;
    function S(z, me, y) {
      return typeof me == "function" && (y = me, me = null), E(z, me, y);
      function E(B, D, de, Ee) {
        return w(B, D, function(ve) {
          ve && (ve.code === "EMFILE" || ve.code === "ENFILE") ? r([E, [B, D, de], ve, Ee || Date.now(), Date.now()]) : typeof de == "function" && de.apply(this, arguments);
        });
      }
    }
    var b = m.writeFile;
    m.writeFile = N;
    function N(z, me, y, E) {
      return typeof y == "function" && (E = y, y = null), B(z, me, y, E);
      function B(D, de, Ee, ve, Re) {
        return b(D, de, Ee, function(we) {
          we && (we.code === "EMFILE" || we.code === "ENFILE") ? r([B, [D, de, Ee, ve], we, Re || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var P = m.appendFile;
    P && (m.appendFile = F);
    function F(z, me, y, E) {
      return typeof y == "function" && (E = y, y = null), B(z, me, y, E);
      function B(D, de, Ee, ve, Re) {
        return P(D, de, Ee, function(we) {
          we && (we.code === "EMFILE" || we.code === "ENFILE") ? r([B, [D, de, Ee, ve], we, Re || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var O = m.copyFile;
    O && (m.copyFile = L);
    function L(z, me, y, E) {
      return typeof y == "function" && (E = y, y = 0), B(z, me, y, E);
      function B(D, de, Ee, ve, Re) {
        return O(D, de, Ee, function(we) {
          we && (we.code === "EMFILE" || we.code === "ENFILE") ? r([B, [D, de, Ee, ve], we, Re || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var R = m.readdir;
    m.readdir = G;
    var Y = /^v[0-5]\./;
    function G(z, me, y) {
      typeof me == "function" && (y = me, me = null);
      var E = Y.test(process.version) ? function(de, Ee, ve, Re) {
        return R(de, B(
          de,
          Ee,
          ve,
          Re
        ));
      } : function(de, Ee, ve, Re) {
        return R(de, Ee, B(
          de,
          Ee,
          ve,
          Re
        ));
      };
      return E(z, me, y);
      function B(D, de, Ee, ve) {
        return function(Re, we) {
          Re && (Re.code === "EMFILE" || Re.code === "ENFILE") ? r([
            E,
            [D, de, Ee],
            Re,
            ve || Date.now(),
            Date.now()
          ]) : (we && we.sort && we.sort(), typeof Ee == "function" && Ee.call(this, Re, we));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var $ = p(m);
      A = $.ReadStream, M = $.WriteStream;
    }
    var H = m.ReadStream;
    H && (A.prototype = Object.create(H.prototype), A.prototype.open = k);
    var U = m.WriteStream;
    U && (M.prototype = Object.create(U.prototype), M.prototype.open = W), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return A;
      },
      set: function(z) {
        A = z;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return M;
      },
      set: function(z) {
        M = z;
      },
      enumerable: !0,
      configurable: !0
    });
    var C = A;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return C;
      },
      set: function(z) {
        C = z;
      },
      enumerable: !0,
      configurable: !0
    });
    var I = M;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return I;
      },
      set: function(z) {
        I = z;
      },
      enumerable: !0,
      configurable: !0
    });
    function A(z, me) {
      return this instanceof A ? (H.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
    }
    function k() {
      var z = this;
      pe(z.path, z.flags, z.mode, function(me, y) {
        me ? (z.autoClose && z.destroy(), z.emit("error", me)) : (z.fd = y, z.emit("open", y), z.read());
      });
    }
    function M(z, me) {
      return this instanceof M ? (U.apply(this, arguments), this) : M.apply(Object.create(M.prototype), arguments);
    }
    function W() {
      var z = this;
      pe(z.path, z.flags, z.mode, function(me, y) {
        me ? (z.destroy(), z.emit("error", me)) : (z.fd = y, z.emit("open", y));
      });
    }
    function ie(z, me) {
      return new m.ReadStream(z, me);
    }
    function te(z, me) {
      return new m.WriteStream(z, me);
    }
    var he = m.open;
    m.open = pe;
    function pe(z, me, y, E) {
      return typeof y == "function" && (E = y, y = null), B(z, me, y, E);
      function B(D, de, Ee, ve, Re) {
        return he(D, de, Ee, function(we, Ge) {
          we && (we.code === "EMFILE" || we.code === "ENFILE") ? r([B, [D, de, Ee, ve], we, Re || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function r(m) {
    s("ENQUEUE", m[0].name, m[1]), e[l].push(m), v();
  }
  var h;
  function g() {
    for (var m = Date.now(), w = 0; w < e[l].length; ++w)
      e[l][w].length > 2 && (e[l][w][3] = m, e[l][w][4] = m);
    v();
  }
  function v() {
    if (clearTimeout(h), h = void 0, e[l].length !== 0) {
      var m = e[l].shift(), w = m[0], S = m[1], b = m[2], N = m[3], P = m[4];
      if (N === void 0)
        s("RETRY", w.name, S), w.apply(null, S);
      else if (Date.now() - N >= 6e4) {
        s("TIMEOUT", w.name, S);
        var F = S.pop();
        typeof F == "function" && F.call(null, b);
      } else {
        var O = Date.now() - P, L = Math.max(P - N, 1), R = Math.min(L * 1.2, 100);
        O >= R ? (s("RETRY", w.name, S), w.apply(null, S.concat([N]))) : e[l].push(m);
      }
      h === void 0 && (h = setTimeout(v, 0));
    }
  }
  return Nr;
}
var ka;
function Ht() {
  return ka || (ka = 1, (function(e) {
    const c = Ye().fromCallback, p = We(), f = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((d) => typeof p[d] == "function");
    Object.assign(e, p), f.forEach((d) => {
      e[d] = c(p[d]);
    }), e.exists = function(d, l) {
      return typeof l == "function" ? p.exists(d, l) : new Promise((a) => p.exists(d, a));
    }, e.read = function(d, l, a, u, o, s) {
      return typeof s == "function" ? p.read(d, l, a, u, o, s) : new Promise((n, t) => {
        p.read(d, l, a, u, o, (r, h, g) => {
          if (r) return t(r);
          n({ bytesRead: h, buffer: g });
        });
      });
    }, e.write = function(d, l, ...a) {
      return typeof a[a.length - 1] == "function" ? p.write(d, l, ...a) : new Promise((u, o) => {
        p.write(d, l, ...a, (s, n, t) => {
          if (s) return o(s);
          u({ bytesWritten: n, buffer: t });
        });
      });
    }, typeof p.writev == "function" && (e.writev = function(d, l, ...a) {
      return typeof a[a.length - 1] == "function" ? p.writev(d, l, ...a) : new Promise((u, o) => {
        p.writev(d, l, ...a, (s, n, t) => {
          if (s) return o(s);
          u({ bytesWritten: n, buffers: t });
        });
      });
    }), typeof p.realpath.native == "function" ? e.realpath.native = c(p.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(tn)), tn;
}
var Dr = {}, on = {}, $a;
function Tc() {
  if ($a) return on;
  $a = 1;
  const e = Ie;
  return on.checkPath = function(p) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(p.replace(e.parse(p).root, ""))) {
      const d = new Error(`Path contains invalid characters: ${p}`);
      throw d.code = "EINVAL", d;
    }
  }, on;
}
var qa;
function bc() {
  if (qa) return Dr;
  qa = 1;
  const e = /* @__PURE__ */ Ht(), { checkPath: c } = /* @__PURE__ */ Tc(), p = (f) => {
    const d = { mode: 511 };
    return typeof f == "number" ? f : { ...d, ...f }.mode;
  };
  return Dr.makeDir = async (f, d) => (c(f), e.mkdir(f, {
    mode: p(d),
    recursive: !0
  })), Dr.makeDirSync = (f, d) => (c(f), e.mkdirSync(f, {
    mode: p(d),
    recursive: !0
  })), Dr;
}
var sn, Ma;
function it() {
  if (Ma) return sn;
  Ma = 1;
  const e = Ye().fromPromise, { makeDir: c, makeDirSync: p } = /* @__PURE__ */ bc(), f = e(c);
  return sn = {
    mkdirs: f,
    mkdirsSync: p,
    // alias
    mkdirp: f,
    mkdirpSync: p,
    ensureDir: f,
    ensureDirSync: p
  }, sn;
}
var ln, Ba;
function Nt() {
  if (Ba) return ln;
  Ba = 1;
  const e = Ye().fromPromise, c = /* @__PURE__ */ Ht();
  function p(f) {
    return c.access(f).then(() => !0).catch(() => !1);
  }
  return ln = {
    pathExists: e(p),
    pathExistsSync: c.existsSync
  }, ln;
}
var un, ja;
function Bl() {
  if (ja) return un;
  ja = 1;
  const e = We();
  function c(f, d, l, a) {
    e.open(f, "r+", (u, o) => {
      if (u) return a(u);
      e.futimes(o, d, l, (s) => {
        e.close(o, (n) => {
          a && a(s || n);
        });
      });
    });
  }
  function p(f, d, l) {
    const a = e.openSync(f, "r+");
    return e.futimesSync(a, d, l), e.closeSync(a);
  }
  return un = {
    utimesMillis: c,
    utimesMillisSync: p
  }, un;
}
var cn, Ha;
function Gt() {
  if (Ha) return cn;
  Ha = 1;
  const e = /* @__PURE__ */ Ht(), c = Ie, p = aa;
  function f(r, h, g) {
    const v = g.dereference ? (m) => e.stat(m, { bigint: !0 }) : (m) => e.lstat(m, { bigint: !0 });
    return Promise.all([
      v(r),
      v(h).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, w]) => ({ srcStat: m, destStat: w }));
  }
  function d(r, h, g) {
    let v;
    const m = g.dereference ? (S) => e.statSync(S, { bigint: !0 }) : (S) => e.lstatSync(S, { bigint: !0 }), w = m(r);
    try {
      v = m(h);
    } catch (S) {
      if (S.code === "ENOENT") return { srcStat: w, destStat: null };
      throw S;
    }
    return { srcStat: w, destStat: v };
  }
  function l(r, h, g, v, m) {
    p.callbackify(f)(r, h, v, (w, S) => {
      if (w) return m(w);
      const { srcStat: b, destStat: N } = S;
      if (N) {
        if (s(b, N)) {
          const P = c.basename(r), F = c.basename(h);
          return g === "move" && P !== F && P.toLowerCase() === F.toLowerCase() ? m(null, { srcStat: b, destStat: N, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (b.isDirectory() && !N.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${h}' with directory '${r}'.`));
        if (!b.isDirectory() && N.isDirectory())
          return m(new Error(`Cannot overwrite directory '${h}' with non-directory '${r}'.`));
      }
      return b.isDirectory() && n(r, h) ? m(new Error(t(r, h, g))) : m(null, { srcStat: b, destStat: N });
    });
  }
  function a(r, h, g, v) {
    const { srcStat: m, destStat: w } = d(r, h, v);
    if (w) {
      if (s(m, w)) {
        const S = c.basename(r), b = c.basename(h);
        if (g === "move" && S !== b && S.toLowerCase() === b.toLowerCase())
          return { srcStat: m, destStat: w, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !w.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${h}' with directory '${r}'.`);
      if (!m.isDirectory() && w.isDirectory())
        throw new Error(`Cannot overwrite directory '${h}' with non-directory '${r}'.`);
    }
    if (m.isDirectory() && n(r, h))
      throw new Error(t(r, h, g));
    return { srcStat: m, destStat: w };
  }
  function u(r, h, g, v, m) {
    const w = c.resolve(c.dirname(r)), S = c.resolve(c.dirname(g));
    if (S === w || S === c.parse(S).root) return m();
    e.stat(S, { bigint: !0 }, (b, N) => b ? b.code === "ENOENT" ? m() : m(b) : s(h, N) ? m(new Error(t(r, g, v))) : u(r, h, S, v, m));
  }
  function o(r, h, g, v) {
    const m = c.resolve(c.dirname(r)), w = c.resolve(c.dirname(g));
    if (w === m || w === c.parse(w).root) return;
    let S;
    try {
      S = e.statSync(w, { bigint: !0 });
    } catch (b) {
      if (b.code === "ENOENT") return;
      throw b;
    }
    if (s(h, S))
      throw new Error(t(r, g, v));
    return o(r, h, w, v);
  }
  function s(r, h) {
    return h.ino && h.dev && h.ino === r.ino && h.dev === r.dev;
  }
  function n(r, h) {
    const g = c.resolve(r).split(c.sep).filter((m) => m), v = c.resolve(h).split(c.sep).filter((m) => m);
    return g.reduce((m, w, S) => m && v[S] === w, !0);
  }
  function t(r, h, g) {
    return `Cannot ${g} '${r}' to a subdirectory of itself, '${h}'.`;
  }
  return cn = {
    checkPaths: l,
    checkPathsSync: a,
    checkParentPaths: u,
    checkParentPathsSync: o,
    isSrcSubdir: n,
    areIdentical: s
  }, cn;
}
var fn, Ga;
function Cc() {
  if (Ga) return fn;
  Ga = 1;
  const e = We(), c = Ie, p = it().mkdirs, f = Nt().pathExists, d = Bl().utimesMillis, l = /* @__PURE__ */ Gt();
  function a(G, $, H, U) {
    typeof H == "function" && !U ? (U = H, H = {}) : typeof H == "function" && (H = { filter: H }), U = U || function() {
    }, H = H || {}, H.clobber = "clobber" in H ? !!H.clobber : !0, H.overwrite = "overwrite" in H ? !!H.overwrite : H.clobber, H.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), l.checkPaths(G, $, "copy", H, (C, I) => {
      if (C) return U(C);
      const { srcStat: A, destStat: k } = I;
      l.checkParentPaths(G, A, $, "copy", (M) => M ? U(M) : H.filter ? o(u, k, G, $, H, U) : u(k, G, $, H, U));
    });
  }
  function u(G, $, H, U, C) {
    const I = c.dirname(H);
    f(I, (A, k) => {
      if (A) return C(A);
      if (k) return n(G, $, H, U, C);
      p(I, (M) => M ? C(M) : n(G, $, H, U, C));
    });
  }
  function o(G, $, H, U, C, I) {
    Promise.resolve(C.filter(H, U)).then((A) => A ? G($, H, U, C, I) : I(), (A) => I(A));
  }
  function s(G, $, H, U, C) {
    return U.filter ? o(n, G, $, H, U, C) : n(G, $, H, U, C);
  }
  function n(G, $, H, U, C) {
    (U.dereference ? e.stat : e.lstat)($, (A, k) => A ? C(A) : k.isDirectory() ? N(k, G, $, H, U, C) : k.isFile() || k.isCharacterDevice() || k.isBlockDevice() ? t(k, G, $, H, U, C) : k.isSymbolicLink() ? R(G, $, H, U, C) : k.isSocket() ? C(new Error(`Cannot copy a socket file: ${$}`)) : k.isFIFO() ? C(new Error(`Cannot copy a FIFO pipe: ${$}`)) : C(new Error(`Unknown file: ${$}`)));
  }
  function t(G, $, H, U, C, I) {
    return $ ? r(G, H, U, C, I) : h(G, H, U, C, I);
  }
  function r(G, $, H, U, C) {
    if (U.overwrite)
      e.unlink(H, (I) => I ? C(I) : h(G, $, H, U, C));
    else return U.errorOnExist ? C(new Error(`'${H}' already exists`)) : C();
  }
  function h(G, $, H, U, C) {
    e.copyFile($, H, (I) => I ? C(I) : U.preserveTimestamps ? g(G.mode, $, H, C) : S(H, G.mode, C));
  }
  function g(G, $, H, U) {
    return v(G) ? m(H, G, (C) => C ? U(C) : w(G, $, H, U)) : w(G, $, H, U);
  }
  function v(G) {
    return (G & 128) === 0;
  }
  function m(G, $, H) {
    return S(G, $ | 128, H);
  }
  function w(G, $, H, U) {
    b($, H, (C) => C ? U(C) : S(H, G, U));
  }
  function S(G, $, H) {
    return e.chmod(G, $, H);
  }
  function b(G, $, H) {
    e.stat(G, (U, C) => U ? H(U) : d($, C.atime, C.mtime, H));
  }
  function N(G, $, H, U, C, I) {
    return $ ? F(H, U, C, I) : P(G.mode, H, U, C, I);
  }
  function P(G, $, H, U, C) {
    e.mkdir(H, (I) => {
      if (I) return C(I);
      F($, H, U, (A) => A ? C(A) : S(H, G, C));
    });
  }
  function F(G, $, H, U) {
    e.readdir(G, (C, I) => C ? U(C) : O(I, G, $, H, U));
  }
  function O(G, $, H, U, C) {
    const I = G.pop();
    return I ? L(G, I, $, H, U, C) : C();
  }
  function L(G, $, H, U, C, I) {
    const A = c.join(H, $), k = c.join(U, $);
    l.checkPaths(A, k, "copy", C, (M, W) => {
      if (M) return I(M);
      const { destStat: ie } = W;
      s(ie, A, k, C, (te) => te ? I(te) : O(G, H, U, C, I));
    });
  }
  function R(G, $, H, U, C) {
    e.readlink($, (I, A) => {
      if (I) return C(I);
      if (U.dereference && (A = c.resolve(process.cwd(), A)), G)
        e.readlink(H, (k, M) => k ? k.code === "EINVAL" || k.code === "UNKNOWN" ? e.symlink(A, H, C) : C(k) : (U.dereference && (M = c.resolve(process.cwd(), M)), l.isSrcSubdir(A, M) ? C(new Error(`Cannot copy '${A}' to a subdirectory of itself, '${M}'.`)) : G.isDirectory() && l.isSrcSubdir(M, A) ? C(new Error(`Cannot overwrite '${M}' with '${A}'.`)) : Y(A, H, C)));
      else
        return e.symlink(A, H, C);
    });
  }
  function Y(G, $, H) {
    e.unlink($, (U) => U ? H(U) : e.symlink(G, $, H));
  }
  return fn = a, fn;
}
var dn, Wa;
function Pc() {
  if (Wa) return dn;
  Wa = 1;
  const e = We(), c = Ie, p = it().mkdirsSync, f = Bl().utimesMillisSync, d = /* @__PURE__ */ Gt();
  function l(O, L, R) {
    typeof R == "function" && (R = { filter: R }), R = R || {}, R.clobber = "clobber" in R ? !!R.clobber : !0, R.overwrite = "overwrite" in R ? !!R.overwrite : R.clobber, R.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: Y, destStat: G } = d.checkPathsSync(O, L, "copy", R);
    return d.checkParentPathsSync(O, Y, L, "copy"), a(G, O, L, R);
  }
  function a(O, L, R, Y) {
    if (Y.filter && !Y.filter(L, R)) return;
    const G = c.dirname(R);
    return e.existsSync(G) || p(G), o(O, L, R, Y);
  }
  function u(O, L, R, Y) {
    if (!(Y.filter && !Y.filter(L, R)))
      return o(O, L, R, Y);
  }
  function o(O, L, R, Y) {
    const $ = (Y.dereference ? e.statSync : e.lstatSync)(L);
    if ($.isDirectory()) return w($, O, L, R, Y);
    if ($.isFile() || $.isCharacterDevice() || $.isBlockDevice()) return s($, O, L, R, Y);
    if ($.isSymbolicLink()) return P(O, L, R, Y);
    throw $.isSocket() ? new Error(`Cannot copy a socket file: ${L}`) : $.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${L}`) : new Error(`Unknown file: ${L}`);
  }
  function s(O, L, R, Y, G) {
    return L ? n(O, R, Y, G) : t(O, R, Y, G);
  }
  function n(O, L, R, Y) {
    if (Y.overwrite)
      return e.unlinkSync(R), t(O, L, R, Y);
    if (Y.errorOnExist)
      throw new Error(`'${R}' already exists`);
  }
  function t(O, L, R, Y) {
    return e.copyFileSync(L, R), Y.preserveTimestamps && r(O.mode, L, R), v(R, O.mode);
  }
  function r(O, L, R) {
    return h(O) && g(R, O), m(L, R);
  }
  function h(O) {
    return (O & 128) === 0;
  }
  function g(O, L) {
    return v(O, L | 128);
  }
  function v(O, L) {
    return e.chmodSync(O, L);
  }
  function m(O, L) {
    const R = e.statSync(O);
    return f(L, R.atime, R.mtime);
  }
  function w(O, L, R, Y, G) {
    return L ? b(R, Y, G) : S(O.mode, R, Y, G);
  }
  function S(O, L, R, Y) {
    return e.mkdirSync(R), b(L, R, Y), v(R, O);
  }
  function b(O, L, R) {
    e.readdirSync(O).forEach((Y) => N(Y, O, L, R));
  }
  function N(O, L, R, Y) {
    const G = c.join(L, O), $ = c.join(R, O), { destStat: H } = d.checkPathsSync(G, $, "copy", Y);
    return u(H, G, $, Y);
  }
  function P(O, L, R, Y) {
    let G = e.readlinkSync(L);
    if (Y.dereference && (G = c.resolve(process.cwd(), G)), O) {
      let $;
      try {
        $ = e.readlinkSync(R);
      } catch (H) {
        if (H.code === "EINVAL" || H.code === "UNKNOWN") return e.symlinkSync(G, R);
        throw H;
      }
      if (Y.dereference && ($ = c.resolve(process.cwd(), $)), d.isSrcSubdir(G, $))
        throw new Error(`Cannot copy '${G}' to a subdirectory of itself, '${$}'.`);
      if (e.statSync(R).isDirectory() && d.isSrcSubdir($, G))
        throw new Error(`Cannot overwrite '${$}' with '${G}'.`);
      return F(G, R);
    } else
      return e.symlinkSync(G, R);
  }
  function F(O, L) {
    return e.unlinkSync(L), e.symlinkSync(O, L);
  }
  return dn = l, dn;
}
var hn, Va;
function oa() {
  if (Va) return hn;
  Va = 1;
  const e = Ye().fromCallback;
  return hn = {
    copy: e(/* @__PURE__ */ Cc()),
    copySync: /* @__PURE__ */ Pc()
  }, hn;
}
var pn, Ya;
function Oc() {
  if (Ya) return pn;
  Ya = 1;
  const e = We(), c = Ie, p = kl, f = process.platform === "win32";
  function d(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      g[m] = g[m] || e[m], m = m + "Sync", g[m] = g[m] || e[m];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function l(g, v, m) {
    let w = 0;
    typeof v == "function" && (m = v, v = {}), p(g, "rimraf: missing path"), p.strictEqual(typeof g, "string", "rimraf: path should be a string"), p.strictEqual(typeof m, "function", "rimraf: callback function required"), p(v, "rimraf: invalid options argument provided"), p.strictEqual(typeof v, "object", "rimraf: options should be object"), d(v), a(g, v, function S(b) {
      if (b) {
        if ((b.code === "EBUSY" || b.code === "ENOTEMPTY" || b.code === "EPERM") && w < v.maxBusyTries) {
          w++;
          const N = w * 100;
          return setTimeout(() => a(g, v, S), N);
        }
        b.code === "ENOENT" && (b = null);
      }
      m(b);
    });
  }
  function a(g, v, m) {
    p(g), p(v), p(typeof m == "function"), v.lstat(g, (w, S) => {
      if (w && w.code === "ENOENT")
        return m(null);
      if (w && w.code === "EPERM" && f)
        return u(g, v, w, m);
      if (S && S.isDirectory())
        return s(g, v, w, m);
      v.unlink(g, (b) => {
        if (b) {
          if (b.code === "ENOENT")
            return m(null);
          if (b.code === "EPERM")
            return f ? u(g, v, b, m) : s(g, v, b, m);
          if (b.code === "EISDIR")
            return s(g, v, b, m);
        }
        return m(b);
      });
    });
  }
  function u(g, v, m, w) {
    p(g), p(v), p(typeof w == "function"), v.chmod(g, 438, (S) => {
      S ? w(S.code === "ENOENT" ? null : m) : v.stat(g, (b, N) => {
        b ? w(b.code === "ENOENT" ? null : m) : N.isDirectory() ? s(g, v, m, w) : v.unlink(g, w);
      });
    });
  }
  function o(g, v, m) {
    let w;
    p(g), p(v);
    try {
      v.chmodSync(g, 438);
    } catch (S) {
      if (S.code === "ENOENT")
        return;
      throw m;
    }
    try {
      w = v.statSync(g);
    } catch (S) {
      if (S.code === "ENOENT")
        return;
      throw m;
    }
    w.isDirectory() ? r(g, v, m) : v.unlinkSync(g);
  }
  function s(g, v, m, w) {
    p(g), p(v), p(typeof w == "function"), v.rmdir(g, (S) => {
      S && (S.code === "ENOTEMPTY" || S.code === "EEXIST" || S.code === "EPERM") ? n(g, v, w) : S && S.code === "ENOTDIR" ? w(m) : w(S);
    });
  }
  function n(g, v, m) {
    p(g), p(v), p(typeof m == "function"), v.readdir(g, (w, S) => {
      if (w) return m(w);
      let b = S.length, N;
      if (b === 0) return v.rmdir(g, m);
      S.forEach((P) => {
        l(c.join(g, P), v, (F) => {
          if (!N) {
            if (F) return m(N = F);
            --b === 0 && v.rmdir(g, m);
          }
        });
      });
    });
  }
  function t(g, v) {
    let m;
    v = v || {}, d(v), p(g, "rimraf: missing path"), p.strictEqual(typeof g, "string", "rimraf: path should be a string"), p(v, "rimraf: missing options"), p.strictEqual(typeof v, "object", "rimraf: options should be object");
    try {
      m = v.lstatSync(g);
    } catch (w) {
      if (w.code === "ENOENT")
        return;
      w.code === "EPERM" && f && o(g, v, w);
    }
    try {
      m && m.isDirectory() ? r(g, v, null) : v.unlinkSync(g);
    } catch (w) {
      if (w.code === "ENOENT")
        return;
      if (w.code === "EPERM")
        return f ? o(g, v, w) : r(g, v, w);
      if (w.code !== "EISDIR")
        throw w;
      r(g, v, w);
    }
  }
  function r(g, v, m) {
    p(g), p(v);
    try {
      v.rmdirSync(g);
    } catch (w) {
      if (w.code === "ENOTDIR")
        throw m;
      if (w.code === "ENOTEMPTY" || w.code === "EEXIST" || w.code === "EPERM")
        h(g, v);
      else if (w.code !== "ENOENT")
        throw w;
    }
  }
  function h(g, v) {
    if (p(g), p(v), v.readdirSync(g).forEach((m) => t(c.join(g, m), v)), f) {
      const m = Date.now();
      do
        try {
          return v.rmdirSync(g, v);
        } catch {
        }
      while (Date.now() - m < 500);
    } else
      return v.rmdirSync(g, v);
  }
  return pn = l, l.sync = t, pn;
}
var mn, za;
function Wr() {
  if (za) return mn;
  za = 1;
  const e = We(), c = Ye().fromCallback, p = /* @__PURE__ */ Oc();
  function f(l, a) {
    if (e.rm) return e.rm(l, { recursive: !0, force: !0 }, a);
    p(l, a);
  }
  function d(l) {
    if (e.rmSync) return e.rmSync(l, { recursive: !0, force: !0 });
    p.sync(l);
  }
  return mn = {
    remove: c(f),
    removeSync: d
  }, mn;
}
var gn, Xa;
function Ic() {
  if (Xa) return gn;
  Xa = 1;
  const e = Ye().fromPromise, c = /* @__PURE__ */ Ht(), p = Ie, f = /* @__PURE__ */ it(), d = /* @__PURE__ */ Wr(), l = e(async function(o) {
    let s;
    try {
      s = await c.readdir(o);
    } catch {
      return f.mkdirs(o);
    }
    return Promise.all(s.map((n) => d.remove(p.join(o, n))));
  });
  function a(u) {
    let o;
    try {
      o = c.readdirSync(u);
    } catch {
      return f.mkdirsSync(u);
    }
    o.forEach((s) => {
      s = p.join(u, s), d.removeSync(s);
    });
  }
  return gn = {
    emptyDirSync: a,
    emptydirSync: a,
    emptyDir: l,
    emptydir: l
  }, gn;
}
var En, Ka;
function Nc() {
  if (Ka) return En;
  Ka = 1;
  const e = Ye().fromCallback, c = Ie, p = We(), f = /* @__PURE__ */ it();
  function d(a, u) {
    function o() {
      p.writeFile(a, "", (s) => {
        if (s) return u(s);
        u();
      });
    }
    p.stat(a, (s, n) => {
      if (!s && n.isFile()) return u();
      const t = c.dirname(a);
      p.stat(t, (r, h) => {
        if (r)
          return r.code === "ENOENT" ? f.mkdirs(t, (g) => {
            if (g) return u(g);
            o();
          }) : u(r);
        h.isDirectory() ? o() : p.readdir(t, (g) => {
          if (g) return u(g);
        });
      });
    });
  }
  function l(a) {
    let u;
    try {
      u = p.statSync(a);
    } catch {
    }
    if (u && u.isFile()) return;
    const o = c.dirname(a);
    try {
      p.statSync(o).isDirectory() || p.readdirSync(o);
    } catch (s) {
      if (s && s.code === "ENOENT") f.mkdirsSync(o);
      else throw s;
    }
    p.writeFileSync(a, "");
  }
  return En = {
    createFile: e(d),
    createFileSync: l
  }, En;
}
var vn, Ja;
function Dc() {
  if (Ja) return vn;
  Ja = 1;
  const e = Ye().fromCallback, c = Ie, p = We(), f = /* @__PURE__ */ it(), d = Nt().pathExists, { areIdentical: l } = /* @__PURE__ */ Gt();
  function a(o, s, n) {
    function t(r, h) {
      p.link(r, h, (g) => {
        if (g) return n(g);
        n(null);
      });
    }
    p.lstat(s, (r, h) => {
      p.lstat(o, (g, v) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), n(g);
        if (h && l(v, h)) return n(null);
        const m = c.dirname(s);
        d(m, (w, S) => {
          if (w) return n(w);
          if (S) return t(o, s);
          f.mkdirs(m, (b) => {
            if (b) return n(b);
            t(o, s);
          });
        });
      });
    });
  }
  function u(o, s) {
    let n;
    try {
      n = p.lstatSync(s);
    } catch {
    }
    try {
      const h = p.lstatSync(o);
      if (n && l(h, n)) return;
    } catch (h) {
      throw h.message = h.message.replace("lstat", "ensureLink"), h;
    }
    const t = c.dirname(s);
    return p.existsSync(t) || f.mkdirsSync(t), p.linkSync(o, s);
  }
  return vn = {
    createLink: e(a),
    createLinkSync: u
  }, vn;
}
var yn, Qa;
function Fc() {
  if (Qa) return yn;
  Qa = 1;
  const e = Ie, c = We(), p = Nt().pathExists;
  function f(l, a, u) {
    if (e.isAbsolute(l))
      return c.lstat(l, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), u(o)) : u(null, {
        toCwd: l,
        toDst: l
      }));
    {
      const o = e.dirname(a), s = e.join(o, l);
      return p(s, (n, t) => n ? u(n) : t ? u(null, {
        toCwd: s,
        toDst: l
      }) : c.lstat(l, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), u(r)) : u(null, {
        toCwd: l,
        toDst: e.relative(o, l)
      })));
    }
  }
  function d(l, a) {
    let u;
    if (e.isAbsolute(l)) {
      if (u = c.existsSync(l), !u) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: l,
        toDst: l
      };
    } else {
      const o = e.dirname(a), s = e.join(o, l);
      if (u = c.existsSync(s), u)
        return {
          toCwd: s,
          toDst: l
        };
      if (u = c.existsSync(l), !u) throw new Error("relative srcpath does not exist");
      return {
        toCwd: l,
        toDst: e.relative(o, l)
      };
    }
  }
  return yn = {
    symlinkPaths: f,
    symlinkPathsSync: d
  }, yn;
}
var wn, Za;
function Lc() {
  if (Za) return wn;
  Za = 1;
  const e = We();
  function c(f, d, l) {
    if (l = typeof d == "function" ? d : l, d = typeof d == "function" ? !1 : d, d) return l(null, d);
    e.lstat(f, (a, u) => {
      if (a) return l(null, "file");
      d = u && u.isDirectory() ? "dir" : "file", l(null, d);
    });
  }
  function p(f, d) {
    let l;
    if (d) return d;
    try {
      l = e.lstatSync(f);
    } catch {
      return "file";
    }
    return l && l.isDirectory() ? "dir" : "file";
  }
  return wn = {
    symlinkType: c,
    symlinkTypeSync: p
  }, wn;
}
var _n, eo;
function Uc() {
  if (eo) return _n;
  eo = 1;
  const e = Ye().fromCallback, c = Ie, p = /* @__PURE__ */ Ht(), f = /* @__PURE__ */ it(), d = f.mkdirs, l = f.mkdirsSync, a = /* @__PURE__ */ Fc(), u = a.symlinkPaths, o = a.symlinkPathsSync, s = /* @__PURE__ */ Lc(), n = s.symlinkType, t = s.symlinkTypeSync, r = Nt().pathExists, { areIdentical: h } = /* @__PURE__ */ Gt();
  function g(w, S, b, N) {
    N = typeof b == "function" ? b : N, b = typeof b == "function" ? !1 : b, p.lstat(S, (P, F) => {
      !P && F.isSymbolicLink() ? Promise.all([
        p.stat(w),
        p.stat(S)
      ]).then(([O, L]) => {
        if (h(O, L)) return N(null);
        v(w, S, b, N);
      }) : v(w, S, b, N);
    });
  }
  function v(w, S, b, N) {
    u(w, S, (P, F) => {
      if (P) return N(P);
      w = F.toDst, n(F.toCwd, b, (O, L) => {
        if (O) return N(O);
        const R = c.dirname(S);
        r(R, (Y, G) => {
          if (Y) return N(Y);
          if (G) return p.symlink(w, S, L, N);
          d(R, ($) => {
            if ($) return N($);
            p.symlink(w, S, L, N);
          });
        });
      });
    });
  }
  function m(w, S, b) {
    let N;
    try {
      N = p.lstatSync(S);
    } catch {
    }
    if (N && N.isSymbolicLink()) {
      const L = p.statSync(w), R = p.statSync(S);
      if (h(L, R)) return;
    }
    const P = o(w, S);
    w = P.toDst, b = t(P.toCwd, b);
    const F = c.dirname(S);
    return p.existsSync(F) || l(F), p.symlinkSync(w, S, b);
  }
  return _n = {
    createSymlink: e(g),
    createSymlinkSync: m
  }, _n;
}
var Rn, to;
function xc() {
  if (to) return Rn;
  to = 1;
  const { createFile: e, createFileSync: c } = /* @__PURE__ */ Nc(), { createLink: p, createLinkSync: f } = /* @__PURE__ */ Dc(), { createSymlink: d, createSymlinkSync: l } = /* @__PURE__ */ Uc();
  return Rn = {
    // file
    createFile: e,
    createFileSync: c,
    ensureFile: e,
    ensureFileSync: c,
    // link
    createLink: p,
    createLinkSync: f,
    ensureLink: p,
    ensureLinkSync: f,
    // symlink
    createSymlink: d,
    createSymlinkSync: l,
    ensureSymlink: d,
    ensureSymlinkSync: l
  }, Rn;
}
var An, ro;
function sa() {
  if (ro) return An;
  ro = 1;
  function e(p, { EOL: f = `
`, finalEOL: d = !0, replacer: l = null, spaces: a } = {}) {
    const u = d ? f : "", o = JSON.stringify(p, l, a);
    if (o === void 0)
      throw new TypeError(`Converting ${typeof p} value to JSON is not supported`);
    return o.replace(/\n/g, f) + u;
  }
  function c(p) {
    return Buffer.isBuffer(p) && (p = p.toString("utf8")), p.replace(/^\uFEFF/, "");
  }
  return An = { stringify: e, stripBom: c }, An;
}
var Sn, no;
function kc() {
  if (no) return Sn;
  no = 1;
  let e;
  try {
    e = We();
  } catch {
    e = vt;
  }
  const c = Ye(), { stringify: p, stripBom: f } = sa();
  async function d(n, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    const r = t.fs || e, h = "throws" in t ? t.throws : !0;
    let g = await c.fromCallback(r.readFile)(n, t);
    g = f(g);
    let v;
    try {
      v = JSON.parse(g, t ? t.reviver : null);
    } catch (m) {
      if (h)
        throw m.message = `${n}: ${m.message}`, m;
      return null;
    }
    return v;
  }
  const l = c.fromPromise(d);
  function a(n, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    const r = t.fs || e, h = "throws" in t ? t.throws : !0;
    try {
      let g = r.readFileSync(n, t);
      return g = f(g), JSON.parse(g, t.reviver);
    } catch (g) {
      if (h)
        throw g.message = `${n}: ${g.message}`, g;
      return null;
    }
  }
  async function u(n, t, r = {}) {
    const h = r.fs || e, g = p(t, r);
    await c.fromCallback(h.writeFile)(n, g, r);
  }
  const o = c.fromPromise(u);
  function s(n, t, r = {}) {
    const h = r.fs || e, g = p(t, r);
    return h.writeFileSync(n, g, r);
  }
  return Sn = {
    readFile: l,
    readFileSync: a,
    writeFile: o,
    writeFileSync: s
  }, Sn;
}
var Tn, io;
function $c() {
  if (io) return Tn;
  io = 1;
  const e = kc();
  return Tn = {
    // jsonfile exports
    readJson: e.readFile,
    readJsonSync: e.readFileSync,
    writeJson: e.writeFile,
    writeJsonSync: e.writeFileSync
  }, Tn;
}
var bn, ao;
function la() {
  if (ao) return bn;
  ao = 1;
  const e = Ye().fromCallback, c = We(), p = Ie, f = /* @__PURE__ */ it(), d = Nt().pathExists;
  function l(u, o, s, n) {
    typeof s == "function" && (n = s, s = "utf8");
    const t = p.dirname(u);
    d(t, (r, h) => {
      if (r) return n(r);
      if (h) return c.writeFile(u, o, s, n);
      f.mkdirs(t, (g) => {
        if (g) return n(g);
        c.writeFile(u, o, s, n);
      });
    });
  }
  function a(u, ...o) {
    const s = p.dirname(u);
    if (c.existsSync(s))
      return c.writeFileSync(u, ...o);
    f.mkdirsSync(s), c.writeFileSync(u, ...o);
  }
  return bn = {
    outputFile: e(l),
    outputFileSync: a
  }, bn;
}
var Cn, oo;
function qc() {
  if (oo) return Cn;
  oo = 1;
  const { stringify: e } = sa(), { outputFile: c } = /* @__PURE__ */ la();
  async function p(f, d, l = {}) {
    const a = e(d, l);
    await c(f, a, l);
  }
  return Cn = p, Cn;
}
var Pn, so;
function Mc() {
  if (so) return Pn;
  so = 1;
  const { stringify: e } = sa(), { outputFileSync: c } = /* @__PURE__ */ la();
  function p(f, d, l) {
    const a = e(d, l);
    c(f, a, l);
  }
  return Pn = p, Pn;
}
var On, lo;
function Bc() {
  if (lo) return On;
  lo = 1;
  const e = Ye().fromPromise, c = /* @__PURE__ */ $c();
  return c.outputJson = e(/* @__PURE__ */ qc()), c.outputJsonSync = /* @__PURE__ */ Mc(), c.outputJSON = c.outputJson, c.outputJSONSync = c.outputJsonSync, c.writeJSON = c.writeJson, c.writeJSONSync = c.writeJsonSync, c.readJSON = c.readJson, c.readJSONSync = c.readJsonSync, On = c, On;
}
var In, uo;
function jc() {
  if (uo) return In;
  uo = 1;
  const e = We(), c = Ie, p = oa().copy, f = Wr().remove, d = it().mkdirp, l = Nt().pathExists, a = /* @__PURE__ */ Gt();
  function u(r, h, g, v) {
    typeof g == "function" && (v = g, g = {}), g = g || {};
    const m = g.overwrite || g.clobber || !1;
    a.checkPaths(r, h, "move", g, (w, S) => {
      if (w) return v(w);
      const { srcStat: b, isChangingCase: N = !1 } = S;
      a.checkParentPaths(r, b, h, "move", (P) => {
        if (P) return v(P);
        if (o(h)) return s(r, h, m, N, v);
        d(c.dirname(h), (F) => F ? v(F) : s(r, h, m, N, v));
      });
    });
  }
  function o(r) {
    const h = c.dirname(r);
    return c.parse(h).root === h;
  }
  function s(r, h, g, v, m) {
    if (v) return n(r, h, g, m);
    if (g)
      return f(h, (w) => w ? m(w) : n(r, h, g, m));
    l(h, (w, S) => w ? m(w) : S ? m(new Error("dest already exists.")) : n(r, h, g, m));
  }
  function n(r, h, g, v) {
    e.rename(r, h, (m) => m ? m.code !== "EXDEV" ? v(m) : t(r, h, g, v) : v());
  }
  function t(r, h, g, v) {
    p(r, h, {
      overwrite: g,
      errorOnExist: !0
    }, (w) => w ? v(w) : f(r, v));
  }
  return In = u, In;
}
var Nn, co;
function Hc() {
  if (co) return Nn;
  co = 1;
  const e = We(), c = Ie, p = oa().copySync, f = Wr().removeSync, d = it().mkdirpSync, l = /* @__PURE__ */ Gt();
  function a(t, r, h) {
    h = h || {};
    const g = h.overwrite || h.clobber || !1, { srcStat: v, isChangingCase: m = !1 } = l.checkPathsSync(t, r, "move", h);
    return l.checkParentPathsSync(t, v, r, "move"), u(r) || d(c.dirname(r)), o(t, r, g, m);
  }
  function u(t) {
    const r = c.dirname(t);
    return c.parse(r).root === r;
  }
  function o(t, r, h, g) {
    if (g) return s(t, r, h);
    if (h)
      return f(r), s(t, r, h);
    if (e.existsSync(r)) throw new Error("dest already exists.");
    return s(t, r, h);
  }
  function s(t, r, h) {
    try {
      e.renameSync(t, r);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return n(t, r, h);
    }
  }
  function n(t, r, h) {
    return p(t, r, {
      overwrite: h,
      errorOnExist: !0
    }), f(t);
  }
  return Nn = a, Nn;
}
var Dn, fo;
function Gc() {
  if (fo) return Dn;
  fo = 1;
  const e = Ye().fromCallback;
  return Dn = {
    move: e(/* @__PURE__ */ jc()),
    moveSync: /* @__PURE__ */ Hc()
  }, Dn;
}
var Fn, ho;
function wt() {
  return ho || (ho = 1, Fn = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ Ht(),
    // Export extra methods:
    .../* @__PURE__ */ oa(),
    .../* @__PURE__ */ Ic(),
    .../* @__PURE__ */ xc(),
    .../* @__PURE__ */ Bc(),
    .../* @__PURE__ */ it(),
    .../* @__PURE__ */ Gc(),
    .../* @__PURE__ */ la(),
    .../* @__PURE__ */ Nt(),
    .../* @__PURE__ */ Wr()
  }), Fn;
}
var zt = {}, Ct = {}, Ln = {}, Pt = {}, po;
function ua() {
  if (po) return Pt;
  po = 1, Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.CancellationError = Pt.CancellationToken = void 0;
  const e = $l;
  let c = class extends e.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(d) {
      this.removeParentCancelHandler(), this._parent = d, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(d) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, d != null && (this.parent = d);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(d) {
      this.cancelled ? d() : this.once("cancel", d);
    }
    createPromise(d) {
      if (this.cancelled)
        return Promise.reject(new p());
      const l = () => {
        if (a != null)
          try {
            this.removeListener("cancel", a), a = null;
          } catch {
          }
      };
      let a = null;
      return new Promise((u, o) => {
        let s = null;
        if (a = () => {
          try {
            s != null && (s(), s = null);
          } finally {
            o(new p());
          }
        }, this.cancelled) {
          a();
          return;
        }
        this.onCancel(a), d(u, o, (n) => {
          s = n;
        });
      }).then((u) => (l(), u)).catch((u) => {
        throw l(), u;
      });
    }
    removeParentCancelHandler() {
      const d = this._parent;
      d != null && this.parentCancelHandler != null && (d.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  Pt.CancellationToken = c;
  class p extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return Pt.CancellationError = p, Pt;
}
var Fr = {}, mo;
function Vr() {
  if (mo) return Fr;
  mo = 1, Object.defineProperty(Fr, "__esModule", { value: !0 }), Fr.newError = e;
  function e(c, p) {
    const f = new Error(c);
    return f.code = p, f;
  }
  return Fr;
}
var Le = {}, Lr = { exports: {} }, Ur = { exports: {} }, Un, go;
function Wc() {
  if (go) return Un;
  go = 1;
  var e = 1e3, c = e * 60, p = c * 60, f = p * 24, d = f * 7, l = f * 365.25;
  Un = function(n, t) {
    t = t || {};
    var r = typeof n;
    if (r === "string" && n.length > 0)
      return a(n);
    if (r === "number" && isFinite(n))
      return t.long ? o(n) : u(n);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(n)
    );
  };
  function a(n) {
    if (n = String(n), !(n.length > 100)) {
      var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        n
      );
      if (t) {
        var r = parseFloat(t[1]), h = (t[2] || "ms").toLowerCase();
        switch (h) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return r * l;
          case "weeks":
          case "week":
          case "w":
            return r * d;
          case "days":
          case "day":
          case "d":
            return r * f;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return r * p;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return r * c;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return r * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return r;
          default:
            return;
        }
      }
    }
  }
  function u(n) {
    var t = Math.abs(n);
    return t >= f ? Math.round(n / f) + "d" : t >= p ? Math.round(n / p) + "h" : t >= c ? Math.round(n / c) + "m" : t >= e ? Math.round(n / e) + "s" : n + "ms";
  }
  function o(n) {
    var t = Math.abs(n);
    return t >= f ? s(n, t, f, "day") : t >= p ? s(n, t, p, "hour") : t >= c ? s(n, t, c, "minute") : t >= e ? s(n, t, e, "second") : n + " ms";
  }
  function s(n, t, r, h) {
    var g = t >= r * 1.5;
    return Math.round(n / r) + " " + h + (g ? "s" : "");
  }
  return Un;
}
var xn, Eo;
function jl() {
  if (Eo) return xn;
  Eo = 1;
  function e(c) {
    f.debug = f, f.default = f, f.coerce = s, f.disable = u, f.enable = l, f.enabled = o, f.humanize = Wc(), f.destroy = n, Object.keys(c).forEach((t) => {
      f[t] = c[t];
    }), f.names = [], f.skips = [], f.formatters = {};
    function p(t) {
      let r = 0;
      for (let h = 0; h < t.length; h++)
        r = (r << 5) - r + t.charCodeAt(h), r |= 0;
      return f.colors[Math.abs(r) % f.colors.length];
    }
    f.selectColor = p;
    function f(t) {
      let r, h = null, g, v;
      function m(...w) {
        if (!m.enabled)
          return;
        const S = m, b = Number(/* @__PURE__ */ new Date()), N = b - (r || b);
        S.diff = N, S.prev = r, S.curr = b, r = b, w[0] = f.coerce(w[0]), typeof w[0] != "string" && w.unshift("%O");
        let P = 0;
        w[0] = w[0].replace(/%([a-zA-Z%])/g, (O, L) => {
          if (O === "%%")
            return "%";
          P++;
          const R = f.formatters[L];
          if (typeof R == "function") {
            const Y = w[P];
            O = R.call(S, Y), w.splice(P, 1), P--;
          }
          return O;
        }), f.formatArgs.call(S, w), (S.log || f.log).apply(S, w);
      }
      return m.namespace = t, m.useColors = f.useColors(), m.color = f.selectColor(t), m.extend = d, m.destroy = f.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => h !== null ? h : (g !== f.namespaces && (g = f.namespaces, v = f.enabled(t)), v),
        set: (w) => {
          h = w;
        }
      }), typeof f.init == "function" && f.init(m), m;
    }
    function d(t, r) {
      const h = f(this.namespace + (typeof r > "u" ? ":" : r) + t);
      return h.log = this.log, h;
    }
    function l(t) {
      f.save(t), f.namespaces = t, f.names = [], f.skips = [];
      const r = (typeof t == "string" ? t : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const h of r)
        h[0] === "-" ? f.skips.push(h.slice(1)) : f.names.push(h);
    }
    function a(t, r) {
      let h = 0, g = 0, v = -1, m = 0;
      for (; h < t.length; )
        if (g < r.length && (r[g] === t[h] || r[g] === "*"))
          r[g] === "*" ? (v = g, m = h, g++) : (h++, g++);
        else if (v !== -1)
          g = v + 1, m++, h = m;
        else
          return !1;
      for (; g < r.length && r[g] === "*"; )
        g++;
      return g === r.length;
    }
    function u() {
      const t = [
        ...f.names,
        ...f.skips.map((r) => "-" + r)
      ].join(",");
      return f.enable(""), t;
    }
    function o(t) {
      for (const r of f.skips)
        if (a(t, r))
          return !1;
      for (const r of f.names)
        if (a(t, r))
          return !0;
      return !1;
    }
    function s(t) {
      return t instanceof Error ? t.stack || t.message : t;
    }
    function n() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return f.enable(f.load()), f;
  }
  return xn = e, xn;
}
var vo;
function Vc() {
  return vo || (vo = 1, (function(e, c) {
    c.formatArgs = f, c.save = d, c.load = l, c.useColors = p, c.storage = a(), c.destroy = /* @__PURE__ */ (() => {
      let o = !1;
      return () => {
        o || (o = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), c.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function p() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let o;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (o = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(o[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function f(o) {
      if (o[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + o[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const s = "color: " + this.color;
      o.splice(1, 0, s, "color: inherit");
      let n = 0, t = 0;
      o[0].replace(/%[a-zA-Z%]/g, (r) => {
        r !== "%%" && (n++, r === "%c" && (t = n));
      }), o.splice(t, 0, s);
    }
    c.log = console.debug || console.log || (() => {
    });
    function d(o) {
      try {
        o ? c.storage.setItem("debug", o) : c.storage.removeItem("debug");
      } catch {
      }
    }
    function l() {
      let o;
      try {
        o = c.storage.getItem("debug") || c.storage.getItem("DEBUG");
      } catch {
      }
      return !o && typeof process < "u" && "env" in process && (o = process.env.DEBUG), o;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = jl()(c);
    const { formatters: u } = e.exports;
    u.j = function(o) {
      try {
        return JSON.stringify(o);
      } catch (s) {
        return "[UnexpectedJSONParseError]: " + s.message;
      }
    };
  })(Ur, Ur.exports)), Ur.exports;
}
var xr = { exports: {} }, kn, yo;
function Yc() {
  return yo || (yo = 1, kn = (e, c = process.argv) => {
    const p = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", f = c.indexOf(p + e), d = c.indexOf("--");
    return f !== -1 && (d === -1 || f < d);
  }), kn;
}
var $n, wo;
function zc() {
  if (wo) return $n;
  wo = 1;
  const e = Gr, c = ql, p = Yc(), { env: f } = process;
  let d;
  p("no-color") || p("no-colors") || p("color=false") || p("color=never") ? d = 0 : (p("color") || p("colors") || p("color=true") || p("color=always")) && (d = 1), "FORCE_COLOR" in f && (f.FORCE_COLOR === "true" ? d = 1 : f.FORCE_COLOR === "false" ? d = 0 : d = f.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(f.FORCE_COLOR, 10), 3));
  function l(o) {
    return o === 0 ? !1 : {
      level: o,
      hasBasic: !0,
      has256: o >= 2,
      has16m: o >= 3
    };
  }
  function a(o, s) {
    if (d === 0)
      return 0;
    if (p("color=16m") || p("color=full") || p("color=truecolor"))
      return 3;
    if (p("color=256"))
      return 2;
    if (o && !s && d === void 0)
      return 0;
    const n = d || 0;
    if (f.TERM === "dumb")
      return n;
    if (process.platform === "win32") {
      const t = e.release().split(".");
      return Number(t[0]) >= 10 && Number(t[2]) >= 10586 ? Number(t[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in f)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((t) => t in f) || f.CI_NAME === "codeship" ? 1 : n;
    if ("TEAMCITY_VERSION" in f)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(f.TEAMCITY_VERSION) ? 1 : 0;
    if (f.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in f) {
      const t = parseInt((f.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (f.TERM_PROGRAM) {
        case "iTerm.app":
          return t >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(f.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(f.TERM) || "COLORTERM" in f ? 1 : n;
  }
  function u(o) {
    const s = a(o, o && o.isTTY);
    return l(s);
  }
  return $n = {
    supportsColor: u,
    stdout: l(a(!0, c.isatty(1))),
    stderr: l(a(!0, c.isatty(2)))
  }, $n;
}
var _o;
function Xc() {
  return _o || (_o = 1, (function(e, c) {
    const p = ql, f = aa;
    c.init = n, c.log = u, c.formatArgs = l, c.save = o, c.load = s, c.useColors = d, c.destroy = f.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), c.colors = [6, 2, 3, 4, 5, 1];
    try {
      const r = zc();
      r && (r.stderr || r).level >= 2 && (c.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    c.inspectOpts = Object.keys(process.env).filter((r) => /^debug_/i.test(r)).reduce((r, h) => {
      const g = h.substring(6).toLowerCase().replace(/_([a-z])/g, (m, w) => w.toUpperCase());
      let v = process.env[h];
      return /^(yes|on|true|enabled)$/i.test(v) ? v = !0 : /^(no|off|false|disabled)$/i.test(v) ? v = !1 : v === "null" ? v = null : v = Number(v), r[g] = v, r;
    }, {});
    function d() {
      return "colors" in c.inspectOpts ? !!c.inspectOpts.colors : p.isatty(process.stderr.fd);
    }
    function l(r) {
      const { namespace: h, useColors: g } = this;
      if (g) {
        const v = this.color, m = "\x1B[3" + (v < 8 ? v : "8;5;" + v), w = `  ${m};1m${h} \x1B[0m`;
        r[0] = w + r[0].split(`
`).join(`
` + w), r.push(m + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        r[0] = a() + h + " " + r[0];
    }
    function a() {
      return c.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u(...r) {
      return process.stderr.write(f.formatWithOptions(c.inspectOpts, ...r) + `
`);
    }
    function o(r) {
      r ? process.env.DEBUG = r : delete process.env.DEBUG;
    }
    function s() {
      return process.env.DEBUG;
    }
    function n(r) {
      r.inspectOpts = {};
      const h = Object.keys(c.inspectOpts);
      for (let g = 0; g < h.length; g++)
        r.inspectOpts[h[g]] = c.inspectOpts[h[g]];
    }
    e.exports = jl()(c);
    const { formatters: t } = e.exports;
    t.o = function(r) {
      return this.inspectOpts.colors = this.useColors, f.inspect(r, this.inspectOpts).split(`
`).map((h) => h.trim()).join(" ");
    }, t.O = function(r) {
      return this.inspectOpts.colors = this.useColors, f.inspect(r, this.inspectOpts);
    };
  })(xr, xr.exports)), xr.exports;
}
var Ro;
function Kc() {
  return Ro || (Ro = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Lr.exports = Vc() : Lr.exports = Xc()), Lr.exports;
}
var Xt = {}, Ao;
function Hl() {
  if (Ao) return Xt;
  Ao = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.ProgressCallbackTransform = void 0;
  const e = yr;
  let c = class extends e.Transform {
    constructor(f, d, l) {
      super(), this.total = f, this.cancellationToken = d, this.onProgress = l, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(f, d, l) {
      if (this.cancellationToken.cancelled) {
        l(new Error("cancelled"), null);
        return;
      }
      this.transferred += f.length, this.delta += f.length;
      const a = Date.now();
      a >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = a + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((a - this.start) / 1e3))
      }), this.delta = 0), l(null, f);
    }
    _flush(f) {
      if (this.cancellationToken.cancelled) {
        f(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, f(null);
    }
  };
  return Xt.ProgressCallbackTransform = c, Xt;
}
var So;
function Jc() {
  if (So) return Le;
  So = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.DigestTransform = Le.HttpExecutor = Le.HttpError = void 0, Le.addSensitiveRedirectHeader = h, Le.addSensitiveFieldPattern = g, Le.createHttpError = v, Le.parseJson = S, Le.configureRequestOptionsFromUrl = P, Le.configureRequestUrl = F, Le.safeGetHeader = R, Le.configureRequestOptions = G, Le.isSensitiveFieldName = $, Le.hashSensitiveValue = H, Le.safeStringifyJson = U;
  const e = wr, c = Kc(), p = vt, f = yr, d = yt, l = ua(), a = Vr(), u = Hl(), o = (0, c.default)("electron-builder"), s = (C) => C.toLowerCase().replace(/[-_]/g, ""), n = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), t = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], r = ["key"];
  function h(C) {
    n.add(s(C));
  }
  function g(C) {
    t.push(C.toLowerCase().replace(/[-_]/g, ""));
  }
  function v(C, I = null) {
    return new w(C.statusCode || -1, `${C.statusCode} ${C.statusMessage}` + (I == null ? "" : `
` + JSON.stringify(I, null, "  ")) + `
Headers: ` + U(C.headers), I);
  }
  const m = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class w extends Error {
    constructor(I, A = `HTTP error: ${m.get(I) || I}`, k = null) {
      super(A), this.statusCode = I, this.description = k, this.name = "HttpError", this.code = `HTTP_ERROR_${I}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  Le.HttpError = w;
  function S(C) {
    return C.then((I) => I == null || I.length === 0 ? null : JSON.parse(I));
  }
  class b {
    constructor() {
      this.maxRedirects = 10;
    }
    request(I, A = new l.CancellationToken(), k) {
      G(I);
      const M = k == null ? void 0 : JSON.stringify(k), W = M ? Buffer.from(M) : void 0;
      if (W != null) {
        o.enabled && o(U(k));
        const { headers: ie, ...te } = I;
        I = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": W.length,
            ...ie
          },
          ...te
        };
      }
      return this.doApiRequest(I, A, (ie) => ie.end(W));
    }
    doApiRequest(I, A, k, M = 0) {
      if (o.enabled) {
        const { headers: W, auth: ie, ...te } = I;
        o(`Request: ${U(te)}`);
      }
      return A.createPromise((W, ie, te) => {
        const he = this.createRequest(I, (pe) => {
          try {
            this.handleResponse(pe, I, A, W, ie, M, k);
          } catch (z) {
            ie(z);
          }
        });
        this.addErrorAndTimeoutHandlers(he, ie, I.timeout), this.addRedirectHandlers(he, I, ie, M, (pe) => {
          this.doApiRequest(pe, A, k, M).then(W).catch(ie);
        }), k(he, ie), te(() => he.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(I, A, k, M, W) {
    }
    addErrorAndTimeoutHandlers(I, A, k = 60 * 1e3) {
      this.addTimeOutHandler(I, A, k), I.on("error", A), I.on("aborted", () => {
        A(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(I, A, k, M, W, ie, te) {
      var he;
      if (o.enabled) {
        const { headers: E, auth: B, ...D } = A;
        o(`Response: ${I.statusCode} ${I.statusMessage}, request options: ${U(D)}`);
      }
      if (I.statusCode === 404) {
        W(v(I, `method: ${A.method || "GET"} url: ${A.protocol || "https:"}//${A.hostname}${A.port ? `:${A.port}` : ""}${A.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (I.statusCode === 204) {
        M();
        return;
      }
      const pe = (he = I.statusCode) !== null && he !== void 0 ? he : 0, z = pe >= 300 && pe < 400, me = R(I, "location");
      if (z && me != null) {
        if (ie > this.maxRedirects) {
          W(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(b.prepareRedirectUrlOptions(me, A), k, te, ie).then(M).catch(W);
        return;
      }
      I.setEncoding("utf8");
      let y = "";
      I.on("error", W), I.on("data", (E) => y += E), I.on("end", () => {
        try {
          if (I.statusCode != null && I.statusCode >= 400) {
            const E = R(I, "content-type"), B = E != null && (Array.isArray(E) ? E.find((D) => D.includes("json")) != null : E.includes("json"));
            W(v(I, `method: ${A.method || "GET"} url: ${A.protocol || "https:"}//${A.hostname}${A.port ? `:${A.port}` : ""}${A.path}

          Data:
          ${B ? U(JSON.parse(y)) : y}
          `));
          } else
            M(y.length === 0 ? null : y);
        } catch (E) {
          W(E);
        }
      });
    }
    async downloadToBuffer(I, A) {
      return await A.cancellationToken.createPromise((k, M, W) => {
        const ie = [], te = {
          headers: A.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        F(I, te), G(te), this.doDownload(te, {
          destination: null,
          options: A,
          onCancel: W,
          callback: (he) => {
            he == null ? k(Buffer.concat(ie)) : M(he);
          },
          responseHandler: (he, pe) => {
            let z = 0;
            he.on("data", (me) => {
              if (z += me.length, z > 524288e3) {
                pe(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              ie.push(me);
            }), he.on("end", () => {
              pe(null);
            });
          }
        }, 0);
      });
    }
    doDownload(I, A, k) {
      const M = this.createRequest(I, (W) => {
        if (W.statusCode >= 400) {
          A.callback(new Error(`Cannot download "${I.protocol || "https:"}//${I.hostname}${I.path}", status ${W.statusCode}: ${W.statusMessage}`));
          return;
        }
        W.on("error", A.callback);
        const ie = R(W, "location");
        if (ie != null) {
          k < this.maxRedirects ? this.doDownload(b.prepareRedirectUrlOptions(ie, I), A, k++) : A.callback(this.createMaxRedirectError());
          return;
        }
        A.responseHandler == null ? Y(A, W) : A.responseHandler(W, A.callback);
      });
      this.addErrorAndTimeoutHandlers(M, A.callback, I.timeout), this.addRedirectHandlers(M, I, A.callback, k, (W) => {
        this.doDownload(W, A, k++);
      }), M.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(I, A, k) {
      I.on("socket", (M) => {
        M.setTimeout(k, () => {
          I.abort(), A(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(I, A) {
      const k = P(I, { ...A }), M = k.headers;
      if (M == null)
        return k;
      const W = b.reconstructOriginalUrl(A), ie = N(I, A);
      if (b.isCrossOriginRedirect(W, ie)) {
        o.enabled && o(`Cross-origin redirect (${W.host} → ${ie.host}): stripping sensitive headers`);
        for (const te of Object.keys(M))
          n.has(s(te)) && delete M[te];
      }
      return k;
    }
    static reconstructOriginalUrl(I) {
      const A = I.protocol || "https:";
      if (!I.hostname)
        throw new Error("Missing hostname in request options");
      const k = I.hostname, M = I.port ? `:${I.port}` : "", W = I.path || "/";
      return new d.URL(`${A}//${k}${M}${W}`);
    }
    static isCrossOriginRedirect(I, A) {
      if (I.hostname.toLowerCase() !== A.hostname.toLowerCase())
        return !0;
      if (I.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
      ["80", ""].includes(I.port) && A.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
      ["443", ""].includes(A.port))
        return !1;
      if (I.protocol !== A.protocol)
        return !0;
      const k = I.port, M = A.port;
      return k !== M;
    }
    static async retryOnServerError(I, A = 3) {
      for (let k = 0; ; k++)
        try {
          return await I();
        } catch (M) {
          if (k < A && (M instanceof w && M.isServerError() || M.code === "EPIPE")) {
            await new Promise((W) => setTimeout(W, 1e3 * (k + 1)));
            continue;
          }
          throw M;
        }
    }
  }
  Le.HttpExecutor = b;
  function N(C, I) {
    try {
      return new d.URL(C);
    } catch {
      const A = I.hostname, k = I.protocol || "https:", M = I.port ? `:${I.port}` : "", W = `${k}//${A}${M}`;
      return new d.URL(C, W);
    }
  }
  function P(C, I) {
    const A = G(I), k = N(C, I);
    return F(k, A), A;
  }
  function F(C, I) {
    I.protocol = C.protocol, I.hostname = C.hostname, C.port ? I.port = C.port : I.port && delete I.port, I.path = C.pathname + C.search;
  }
  class O extends f.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(I, A = "sha512", k = "base64") {
      super(), this.expected = I, this.algorithm = A, this.encoding = k, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, e.createHash)(A);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(I, A, k) {
      this.digester.update(I), k(null, I);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(I) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (A) {
          I(A);
          return;
        }
      I(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, a.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, a.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  Le.DigestTransform = O;
  function L(C, I, A) {
    return C != null && I != null && C !== I ? (A(new Error(`checksum mismatch: expected ${I} but got ${C} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function R(C, I) {
    const A = C.headers[I];
    return A == null ? null : Array.isArray(A) ? A.length === 0 ? null : A[A.length - 1] : A;
  }
  function Y(C, I) {
    if (!L(R(I, "X-Checksum-Sha2"), C.options.sha2, C.callback))
      return;
    const A = [];
    if (C.options.onProgress != null) {
      const ie = R(I, "content-length");
      ie != null && A.push(new u.ProgressCallbackTransform(parseInt(ie, 10), C.options.cancellationToken, C.options.onProgress));
    }
    const k = C.options.sha512;
    k != null ? A.push(new O(k, "sha512", k.length === 128 && !k.includes("+") && !k.includes("Z") && !k.includes("=") ? "hex" : "base64")) : C.options.sha2 != null && A.push(new O(C.options.sha2, "sha256", "hex"));
    const M = (0, p.createWriteStream)(C.destination);
    A.push(M);
    let W = I;
    for (const ie of A)
      ie.on("error", (te) => {
        M.close(), C.options.cancellationToken.cancelled || C.callback(te);
      }), W = W.pipe(ie);
    M.on("finish", () => {
      M.close(C.callback);
    });
  }
  function G(C, I, A) {
    A != null && (C.method = A), C.headers = { ...C.headers };
    const k = C.headers;
    return I != null && (k.authorization = I.startsWith("Basic") || I.startsWith("Bearer") ? I : `token ${I}`), k["User-Agent"] == null && (k["User-Agent"] = "electron-builder"), (A == null || A === "GET" || k["Cache-Control"] == null) && (k["Cache-Control"] = "no-cache"), C.protocol == null && process.versions.electron != null && (C.protocol = "https:"), C;
  }
  function $(C) {
    const I = s(C);
    return t.some((A) => I.includes(A)) || r.some((A) => I.endsWith(A));
  }
  function H(C) {
    return `${(0, e.createHash)("sha256").update(C).digest("hex")} (sha256 hash)`;
  }
  function U(C, I) {
    return JSON.stringify(C, (A, k) => $(A) || I != null && I.has(A) ? typeof k == "string" ? H(k) : "<stripped sensitive data>" : k, 2);
  }
  return Le;
}
var Kt = {}, To;
function Qc() {
  if (To) return Kt;
  To = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.MemoLazy = void 0;
  let e = class {
    constructor(f, d) {
      this.selector = f, this.creator = d, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const f = this.selector();
      if (this._value !== void 0 && c(this.selected, f))
        return this._value;
      this.selected = f;
      const d = this.creator(f);
      return this.value = d, d;
    }
    set value(f) {
      this._value = f;
    }
  };
  Kt.MemoLazy = e;
  function c(p, f) {
    if (typeof p == "object" && p !== null && (typeof f == "object" && f !== null)) {
      const a = Object.keys(p), u = Object.keys(f);
      return a.length === u.length && a.every((o) => c(p[o], f[o]));
    }
    return p === f;
  }
  return Kt;
}
var xt = {}, bo;
function Zc() {
  if (bo) return xt;
  bo = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.githubUrl = e, xt.githubTagPrefix = c, xt.getS3LikeProviderBaseUrl = p;
  function e(a, u = "github.com") {
    return `${a.protocol || "https"}://${a.host || u}`;
  }
  function c(a) {
    var u;
    return a.tagNamePrefix ? a.tagNamePrefix : !((u = a.vPrefixedTagName) !== null && u !== void 0) || u ? "v" : "";
  }
  function p(a) {
    const u = a.provider;
    if (u === "s3")
      return f(a);
    if (u === "spaces")
      return l(a);
    throw new Error(`Not supported provider: ${u}`);
  }
  function f(a) {
    let u;
    if (a.accelerate == !0)
      u = `https://${a.bucket}.s3-accelerate.amazonaws.com`;
    else if (a.endpoint != null)
      u = `${a.endpoint}/${a.bucket}`;
    else if (a.bucket.includes(".")) {
      if (a.region == null)
        throw new Error(`Bucket name "${a.bucket}" includes a dot, but S3 region is missing`);
      a.region === "us-east-1" ? u = `https://s3.amazonaws.com/${a.bucket}` : u = `https://s3-${a.region}.amazonaws.com/${a.bucket}`;
    } else a.region === "cn-north-1" ? u = `https://${a.bucket}.s3.${a.region}.amazonaws.com.cn` : u = `https://${a.bucket}.s3.amazonaws.com`;
    return d(u, a.path);
  }
  function d(a, u) {
    return u != null && u.length > 0 && (u.startsWith("/") || (a += "/"), a += u), a;
  }
  function l(a) {
    if (a.name == null)
      throw new Error("name is missing");
    if (a.region == null)
      throw new Error("region is missing");
    return d(`https://${a.name}.${a.region}.digitaloceanspaces.com`, a.path);
  }
  return xt;
}
var kr = {}, Co;
function ef() {
  if (Co) return kr;
  Co = 1, Object.defineProperty(kr, "__esModule", { value: !0 }), kr.retry = c;
  const e = ua();
  async function c(p, f) {
    var d;
    const { retries: l, interval: a, backoff: u = 0, attempt: o = 0, shouldRetry: s, cancellationToken: n = new e.CancellationToken() } = f;
    try {
      return await p();
    } catch (t) {
      if (await Promise.resolve((d = s?.(t)) !== null && d !== void 0 ? d : !0) && l > 0 && !n.cancelled)
        return await new Promise((r) => setTimeout(r, a + u * o)), await c(p, { ...f, retries: l - 1, attempt: o + 1 });
      throw t;
    }
  }
  return kr;
}
var $r = {}, Po;
function tf() {
  if (Po) return $r;
  Po = 1, Object.defineProperty($r, "__esModule", { value: !0 }), $r.parseDn = e;
  function e(c) {
    let p = !1, f = null, d = "", l = 0;
    c = c.trim();
    const a = /* @__PURE__ */ new Map();
    for (let u = 0; u <= c.length; u++) {
      if (u === c.length) {
        f !== null && a.set(f, d);
        break;
      }
      const o = c[u];
      if (p) {
        if (o === '"') {
          p = !1;
          continue;
        }
      } else {
        if (o === '"') {
          p = !0;
          continue;
        }
        if (o === "\\") {
          u++;
          const s = parseInt(c.slice(u, u + 2), 16);
          Number.isNaN(s) ? d += c[u] : (u++, d += String.fromCharCode(s));
          continue;
        }
        if (f === null && o === "=") {
          f = d, d = "";
          continue;
        }
        if (o === "," || o === ";" || o === "+") {
          f !== null && a.set(f, d), f = null, d = "";
          continue;
        }
      }
      if (o === " " && !p) {
        if (d.length === 0)
          continue;
        if (u > l) {
          let s = u;
          for (; c[s] === " "; )
            s++;
          l = s;
        }
        if (l >= c.length || c[l] === "," || c[l] === ";" || f === null && c[l] === "=" || f !== null && c[l] === "+") {
          u = l - 1;
          continue;
        }
      }
      d += o;
    }
    return a;
  }
  return $r;
}
var Ot = {}, Oo;
function rf() {
  if (Oo) return Ot;
  Oo = 1, Object.defineProperty(Ot, "__esModule", { value: !0 }), Ot.nil = Ot.UUID = void 0;
  const e = wr, c = Vr(), p = "options.name must be either a string or a Buffer", f = (0, e.randomBytes)(16);
  f[0] = f[0] | 1;
  const d = {}, l = [];
  for (let t = 0; t < 256; t++) {
    const r = (t + 256).toString(16).substr(1);
    d[r] = t, l[t] = r;
  }
  class a {
    constructor(r) {
      this.ascii = null, this.binary = null;
      const h = a.check(r);
      if (!h)
        throw new Error("not a UUID");
      this.version = h.version, h.format === "ascii" ? this.ascii = r : this.binary = r;
    }
    static v5(r, h) {
      return s(r, "sha1", 80, h);
    }
    toString() {
      return this.ascii == null && (this.ascii = n(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(r, h = 0) {
      if (typeof r == "string")
        return r = r.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(r) ? r === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (d[r[14] + r[15]] & 240) >> 4,
          variant: u((d[r[19] + r[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(r)) {
        if (r.length < h + 16)
          return !1;
        let g = 0;
        for (; g < 16 && r[h + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (r[h + 6] & 240) >> 4,
          variant: u((r[h + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, c.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(r) {
      const h = Buffer.allocUnsafe(16);
      let g = 0;
      for (let v = 0; v < 16; v++)
        h[v] = d[r[g++] + r[g++]], (v === 3 || v === 5 || v === 7 || v === 9) && (g += 1);
      return h;
    }
  }
  Ot.UUID = a, a.OID = a.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function u(t) {
    switch (t) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var o;
  (function(t) {
    t[t.ASCII = 0] = "ASCII", t[t.BINARY = 1] = "BINARY", t[t.OBJECT = 2] = "OBJECT";
  })(o || (o = {}));
  function s(t, r, h, g, v = o.ASCII) {
    const m = (0, e.createHash)(r);
    if (typeof t != "string" && !Buffer.isBuffer(t))
      throw (0, c.newError)(p, "ERR_INVALID_UUID_NAME");
    m.update(g), m.update(t);
    const S = m.digest();
    let b;
    switch (v) {
      case o.BINARY:
        S[6] = S[6] & 15 | h, S[8] = S[8] & 63 | 128, b = S;
        break;
      case o.OBJECT:
        S[6] = S[6] & 15 | h, S[8] = S[8] & 63 | 128, b = new a(S);
        break;
      default:
        b = l[S[0]] + l[S[1]] + l[S[2]] + l[S[3]] + "-" + l[S[4]] + l[S[5]] + "-" + l[S[6] & 15 | h] + l[S[7]] + "-" + l[S[8] & 63 | 128] + l[S[9]] + "-" + l[S[10]] + l[S[11]] + l[S[12]] + l[S[13]] + l[S[14]] + l[S[15]];
        break;
    }
    return b;
  }
  function n(t) {
    return l[t[0]] + l[t[1]] + l[t[2]] + l[t[3]] + "-" + l[t[4]] + l[t[5]] + "-" + l[t[6]] + l[t[7]] + "-" + l[t[8]] + l[t[9]] + "-" + l[t[10]] + l[t[11]] + l[t[12]] + l[t[13]] + l[t[14]] + l[t[15]];
  }
  return Ot.nil = new a("00000000-0000-0000-0000-000000000000"), Ot;
}
var kt = {}, qn = {}, Io;
function nf() {
  return Io || (Io = 1, (function(e) {
    (function(c) {
      c.parser = function(y, E) {
        return new f(y, E);
      }, c.SAXParser = f, c.SAXStream = n, c.createStream = s, c.MAX_BUFFER_LENGTH = 64 * 1024;
      var p = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      c.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function f(y, E) {
        if (!(this instanceof f))
          return new f(y, E);
        var B = this;
        l(B), B.q = B.c = "", B.bufferCheckPosition = c.MAX_BUFFER_LENGTH, B.opt = E || {}, B.opt.lowercase = B.opt.lowercase || B.opt.lowercasetags, B.looseCase = B.opt.lowercase ? "toLowerCase" : "toUpperCase", B.tags = [], B.closed = B.closedRoot = B.sawRoot = !1, B.tag = B.error = null, B.strict = !!y, B.noscript = !!(y || B.opt.noscript), B.state = R.BEGIN, B.strictEntities = B.opt.strictEntities, B.ENTITIES = B.strictEntities ? Object.create(c.XML_ENTITIES) : Object.create(c.ENTITIES), B.attribList = [], B.opt.xmlns && (B.ns = Object.create(v)), B.opt.unquotedAttributeValues === void 0 && (B.opt.unquotedAttributeValues = !y), B.trackPosition = B.opt.position !== !1, B.trackPosition && (B.position = B.line = B.column = 0), G(B, "onready");
      }
      Object.create || (Object.create = function(y) {
        function E() {
        }
        E.prototype = y;
        var B = new E();
        return B;
      }), Object.keys || (Object.keys = function(y) {
        var E = [];
        for (var B in y) y.hasOwnProperty(B) && E.push(B);
        return E;
      });
      function d(y) {
        for (var E = Math.max(c.MAX_BUFFER_LENGTH, 10), B = 0, D = 0, de = p.length; D < de; D++) {
          var Ee = y[p[D]].length;
          if (Ee > E)
            switch (p[D]) {
              case "textNode":
                H(y);
                break;
              case "cdata":
                $(y, "oncdata", y.cdata), y.cdata = "";
                break;
              case "script":
                $(y, "onscript", y.script), y.script = "";
                break;
              default:
                C(y, "Max buffer length exceeded: " + p[D]);
            }
          B = Math.max(B, Ee);
        }
        var ve = c.MAX_BUFFER_LENGTH - B;
        y.bufferCheckPosition = ve + y.position;
      }
      function l(y) {
        for (var E = 0, B = p.length; E < B; E++)
          y[p[E]] = "";
      }
      function a(y) {
        H(y), y.cdata !== "" && ($(y, "oncdata", y.cdata), y.cdata = ""), y.script !== "" && ($(y, "onscript", y.script), y.script = "");
      }
      f.prototype = {
        end: function() {
          I(this);
        },
        write: me,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          a(this);
        }
      };
      var u;
      try {
        u = require("stream").Stream;
      } catch {
        u = function() {
        };
      }
      u || (u = function() {
      });
      var o = c.EVENTS.filter(function(y) {
        return y !== "error" && y !== "end";
      });
      function s(y, E) {
        return new n(y, E);
      }
      function n(y, E) {
        if (!(this instanceof n))
          return new n(y, E);
        u.apply(this), this._parser = new f(y, E), this.writable = !0, this.readable = !0;
        var B = this;
        this._parser.onend = function() {
          B.emit("end");
        }, this._parser.onerror = function(D) {
          B.emit("error", D), B._parser.error = null;
        }, this._decoder = null, o.forEach(function(D) {
          Object.defineProperty(B, "on" + D, {
            get: function() {
              return B._parser["on" + D];
            },
            set: function(de) {
              if (!de)
                return B.removeAllListeners(D), B._parser["on" + D] = de, de;
              B.on(D, de);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      n.prototype = Object.create(u.prototype, {
        constructor: {
          value: n
        }
      }), n.prototype.write = function(y) {
        return typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(y) && (this._decoder || (this._decoder = new TextDecoder("utf8")), y = this._decoder.decode(y, { stream: !0 })), this._parser.write(y.toString()), this.emit("data", y), !0;
      }, n.prototype.end = function(y) {
        if (y && y.length && this.write(y), this._decoder) {
          var E = this._decoder.decode();
          E && (this._parser.write(E), this.emit("data", E));
        }
        return this._parser.end(), !0;
      }, n.prototype.on = function(y, E) {
        var B = this;
        return !B._parser["on" + y] && o.indexOf(y) !== -1 && (B._parser["on" + y] = function() {
          var D = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          D.splice(0, 0, y), B.emit.apply(B, D);
        }), u.prototype.on.call(B, y, E);
      };
      var t = "[CDATA[", r = "DOCTYPE", h = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", v = { xml: h, xmlns: g }, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, w = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function N(y) {
        return y === " " || y === `
` || y === "\r" || y === "	";
      }
      function P(y) {
        return y === '"' || y === "'";
      }
      function F(y) {
        return y === ">" || N(y);
      }
      function O(y, E) {
        return y.test(E);
      }
      function L(y, E) {
        return !O(y, E);
      }
      var R = 0;
      c.STATE = {
        BEGIN: R++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: R++,
        // leading whitespace
        TEXT: R++,
        // general stuff
        TEXT_ENTITY: R++,
        // &amp and such.
        OPEN_WAKA: R++,
        // <
        SGML_DECL: R++,
        // <!BLARG
        SGML_DECL_QUOTED: R++,
        // <!BLARG foo "bar
        DOCTYPE: R++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: R++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: R++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: R++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: R++,
        // <!-
        COMMENT: R++,
        // <!--
        COMMENT_ENDING: R++,
        // <!-- blah -
        COMMENT_ENDED: R++,
        // <!-- blah --
        CDATA: R++,
        // <![CDATA[ something
        CDATA_ENDING: R++,
        // ]
        CDATA_ENDING_2: R++,
        // ]]
        PROC_INST: R++,
        // <?hi
        PROC_INST_BODY: R++,
        // <?hi there
        PROC_INST_ENDING: R++,
        // <?hi "there" ?
        OPEN_TAG: R++,
        // <strong
        OPEN_TAG_SLASH: R++,
        // <strong /
        ATTRIB: R++,
        // <a
        ATTRIB_NAME: R++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: R++,
        // <a foo _
        ATTRIB_VALUE: R++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: R++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: R++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: R++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: R++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: R++,
        // <foo bar=&quot
        CLOSE_TAG: R++,
        // </a
        CLOSE_TAG_SAW_WHITE: R++,
        // </a   >
        SCRIPT: R++,
        // <script> ...
        SCRIPT_ENDING: R++
        // <script> ... <
      }, c.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, c.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(c.ENTITIES).forEach(function(y) {
        var E = c.ENTITIES[y], B = typeof E == "number" ? String.fromCharCode(E) : E;
        c.ENTITIES[y] = B;
      });
      for (var Y in c.STATE)
        c.STATE[c.STATE[Y]] = Y;
      R = c.STATE;
      function G(y, E, B) {
        y[E] && y[E](B);
      }
      function $(y, E, B) {
        y.textNode && H(y), G(y, E, B);
      }
      function H(y) {
        y.textNode = U(y.opt, y.textNode), y.textNode && G(y, "ontext", y.textNode), y.textNode = "";
      }
      function U(y, E) {
        return y.trim && (E = E.trim()), y.normalize && (E = E.replace(/\s+/g, " ")), E;
      }
      function C(y, E) {
        return H(y), y.trackPosition && (E += `
Line: ` + y.line + `
Column: ` + y.column + `
Char: ` + y.c), E = new Error(E), y.error = E, G(y, "onerror", E), y;
      }
      function I(y) {
        return y.sawRoot && !y.closedRoot && A(y, "Unclosed root tag"), y.state !== R.BEGIN && y.state !== R.BEGIN_WHITESPACE && y.state !== R.TEXT && C(y, "Unexpected end"), H(y), y.c = "", y.closed = !0, G(y, "onend"), f.call(y, y.strict, y.opt), y;
      }
      function A(y, E) {
        if (typeof y != "object" || !(y instanceof f))
          throw new Error("bad call to strictFail");
        y.strict && C(y, E);
      }
      function k(y) {
        y.strict || (y.tagName = y.tagName[y.looseCase]());
        var E = y.tags[y.tags.length - 1] || y, B = y.tag = { name: y.tagName, attributes: {} };
        y.opt.xmlns && (B.ns = E.ns), y.attribList.length = 0, $(y, "onopentagstart", B);
      }
      function M(y, E) {
        var B = y.indexOf(":"), D = B < 0 ? ["", y] : y.split(":"), de = D[0], Ee = D[1];
        return E && y === "xmlns" && (de = "xmlns", Ee = ""), { prefix: de, local: Ee };
      }
      function W(y) {
        if (y.strict || (y.attribName = y.attribName[y.looseCase]()), y.attribList.indexOf(y.attribName) !== -1 || y.tag.attributes.hasOwnProperty(y.attribName)) {
          y.attribName = y.attribValue = "";
          return;
        }
        if (y.opt.xmlns) {
          var E = M(y.attribName, !0), B = E.prefix, D = E.local;
          if (B === "xmlns")
            if (D === "xml" && y.attribValue !== h)
              A(
                y,
                "xml: prefix must be bound to " + h + `
Actual: ` + y.attribValue
              );
            else if (D === "xmlns" && y.attribValue !== g)
              A(
                y,
                "xmlns: prefix must be bound to " + g + `
Actual: ` + y.attribValue
              );
            else {
              var de = y.tag, Ee = y.tags[y.tags.length - 1] || y;
              de.ns === Ee.ns && (de.ns = Object.create(Ee.ns)), de.ns[D] = y.attribValue;
            }
          y.attribList.push([y.attribName, y.attribValue]);
        } else
          y.tag.attributes[y.attribName] = y.attribValue, $(y, "onattribute", {
            name: y.attribName,
            value: y.attribValue
          });
        y.attribName = y.attribValue = "";
      }
      function ie(y, E) {
        if (y.opt.xmlns) {
          var B = y.tag, D = M(y.tagName);
          B.prefix = D.prefix, B.local = D.local, B.uri = B.ns[D.prefix] || "", B.prefix && !B.uri && (A(
            y,
            "Unbound namespace prefix: " + JSON.stringify(y.tagName)
          ), B.uri = D.prefix);
          var de = y.tags[y.tags.length - 1] || y;
          B.ns && de.ns !== B.ns && Object.keys(B.ns).forEach(function(i) {
            $(y, "onopennamespace", {
              prefix: i,
              uri: B.ns[i]
            });
          });
          for (var Ee = 0, ve = y.attribList.length; Ee < ve; Ee++) {
            var Re = y.attribList[Ee], we = Re[0], Ge = Re[1], Se = M(we, !0), Be = Se.prefix, ct = Se.local, at = Be === "" ? "" : B.ns[Be] || "", nt = {
              name: we,
              value: Ge,
              prefix: Be,
              local: ct,
              uri: at
            };
            Be && Be !== "xmlns" && !at && (A(
              y,
              "Unbound namespace prefix: " + JSON.stringify(Be)
            ), nt.uri = Be), y.tag.attributes[we] = nt, $(y, "onattribute", nt);
          }
          y.attribList.length = 0;
        }
        y.tag.isSelfClosing = !!E, y.sawRoot = !0, y.tags.push(y.tag), $(y, "onopentag", y.tag), E || (!y.noscript && y.tagName.toLowerCase() === "script" ? y.state = R.SCRIPT : y.state = R.TEXT, y.tag = null, y.tagName = ""), y.attribName = y.attribValue = "", y.attribList.length = 0;
      }
      function te(y) {
        if (!y.tagName) {
          A(y, "Weird empty close tag."), y.textNode += "</>", y.state = R.TEXT;
          return;
        }
        if (y.script) {
          if (y.tagName !== "script") {
            y.script += "</" + y.tagName + ">", y.tagName = "", y.state = R.SCRIPT;
            return;
          }
          $(y, "onscript", y.script), y.script = "";
        }
        var E = y.tags.length, B = y.tagName;
        y.strict || (B = B[y.looseCase]());
        for (var D = B; E--; ) {
          var de = y.tags[E];
          if (de.name !== D)
            A(y, "Unexpected close tag");
          else
            break;
        }
        if (E < 0) {
          A(y, "Unmatched closing tag: " + y.tagName), y.textNode += "</" + y.tagName + ">", y.state = R.TEXT;
          return;
        }
        y.tagName = B;
        for (var Ee = y.tags.length; Ee-- > E; ) {
          var ve = y.tag = y.tags.pop();
          y.tagName = y.tag.name, $(y, "onclosetag", y.tagName);
          var Re = {};
          for (var we in ve.ns)
            Re[we] = ve.ns[we];
          var Ge = y.tags[y.tags.length - 1] || y;
          y.opt.xmlns && ve.ns !== Ge.ns && Object.keys(ve.ns).forEach(function(Se) {
            var Be = ve.ns[Se];
            $(y, "onclosenamespace", { prefix: Se, uri: Be });
          });
        }
        E === 0 && (y.closedRoot = !0), y.tagName = y.attribValue = y.attribName = "", y.attribList.length = 0, y.state = R.TEXT;
      }
      function he(y) {
        var E = y.entity, B = E.toLowerCase(), D, de = "";
        return y.ENTITIES[E] ? y.ENTITIES[E] : y.ENTITIES[B] ? y.ENTITIES[B] : (E = B, E.charAt(0) === "#" && (E.charAt(1) === "x" ? (E = E.slice(2), D = parseInt(E, 16), de = D.toString(16)) : (E = E.slice(1), D = parseInt(E, 10), de = D.toString(10))), E = E.replace(/^0+/, ""), isNaN(D) || de.toLowerCase() !== E || D < 0 || D > 1114111 ? (A(y, "Invalid character entity"), "&" + y.entity + ";") : String.fromCodePoint(D));
      }
      function pe(y, E) {
        E === "<" ? (y.state = R.OPEN_WAKA, y.startTagPosition = y.position) : N(E) || (A(y, "Non-whitespace before first tag."), y.textNode = E, y.state = R.TEXT);
      }
      function z(y, E) {
        var B = "";
        return E < y.length && (B = y.charAt(E)), B;
      }
      function me(y) {
        var E = this;
        if (this.error)
          throw this.error;
        if (E.closed)
          return C(
            E,
            "Cannot write after close. Assign an onready handler."
          );
        if (y === null)
          return I(E);
        typeof y == "object" && (y = y.toString());
        for (var B = 0, D = ""; D = z(y, B++), E.c = D, !!D; )
          switch (E.trackPosition && (E.position++, D === `
` ? (E.line++, E.column = 0) : E.column++), E.state) {
            case R.BEGIN:
              if (E.state = R.BEGIN_WHITESPACE, D === "\uFEFF")
                continue;
              pe(E, D);
              continue;
            case R.BEGIN_WHITESPACE:
              pe(E, D);
              continue;
            case R.TEXT:
              if (E.sawRoot && !E.closedRoot) {
                for (var Ee = B - 1; D && D !== "<" && D !== "&"; )
                  D = z(y, B++), D && E.trackPosition && (E.position++, D === `
` ? (E.line++, E.column = 0) : E.column++);
                E.textNode += y.substring(Ee, B - 1);
              }
              D === "<" && !(E.sawRoot && E.closedRoot && !E.strict) ? (E.state = R.OPEN_WAKA, E.startTagPosition = E.position) : (!N(D) && (!E.sawRoot || E.closedRoot) && A(E, "Text data outside of root node."), D === "&" ? E.state = R.TEXT_ENTITY : E.textNode += D);
              continue;
            case R.SCRIPT:
              D === "<" ? E.state = R.SCRIPT_ENDING : E.script += D;
              continue;
            case R.SCRIPT_ENDING:
              D === "/" ? E.state = R.CLOSE_TAG : (E.script += "<" + D, E.state = R.SCRIPT);
              continue;
            case R.OPEN_WAKA:
              if (D === "!")
                E.state = R.SGML_DECL, E.sgmlDecl = "";
              else if (!N(D)) if (O(m, D))
                E.state = R.OPEN_TAG, E.tagName = D;
              else if (D === "/")
                E.state = R.CLOSE_TAG, E.tagName = "";
              else if (D === "?")
                E.state = R.PROC_INST, E.procInstName = E.procInstBody = "";
              else {
                if (A(E, "Unencoded <"), E.startTagPosition + 1 < E.position) {
                  var de = E.position - E.startTagPosition;
                  D = new Array(de).join(" ") + D;
                }
                E.textNode += "<" + D, E.state = R.TEXT;
              }
              continue;
            case R.SGML_DECL:
              if (E.sgmlDecl + D === "--") {
                E.state = R.COMMENT, E.comment = "", E.sgmlDecl = "";
                continue;
              }
              E.doctype && E.doctype !== !0 && E.sgmlDecl ? (E.state = R.DOCTYPE_DTD, E.doctype += "<!" + E.sgmlDecl + D, E.sgmlDecl = "") : (E.sgmlDecl + D).toUpperCase() === t ? ($(E, "onopencdata"), E.state = R.CDATA, E.sgmlDecl = "", E.cdata = "") : (E.sgmlDecl + D).toUpperCase() === r ? (E.state = R.DOCTYPE, (E.doctype || E.sawRoot) && A(
                E,
                "Inappropriately located doctype declaration"
              ), E.doctype = "", E.sgmlDecl = "") : D === ">" ? ($(E, "onsgmldeclaration", E.sgmlDecl), E.sgmlDecl = "", E.state = R.TEXT) : (P(D) && (E.state = R.SGML_DECL_QUOTED), E.sgmlDecl += D);
              continue;
            case R.SGML_DECL_QUOTED:
              D === E.q && (E.state = R.SGML_DECL, E.q = ""), E.sgmlDecl += D;
              continue;
            case R.DOCTYPE:
              D === ">" ? (E.state = R.TEXT, $(E, "ondoctype", E.doctype), E.doctype = !0) : (E.doctype += D, D === "[" ? E.state = R.DOCTYPE_DTD : P(D) && (E.state = R.DOCTYPE_QUOTED, E.q = D));
              continue;
            case R.DOCTYPE_QUOTED:
              E.doctype += D, D === E.q && (E.q = "", E.state = R.DOCTYPE);
              continue;
            case R.DOCTYPE_DTD:
              D === "]" ? (E.doctype += D, E.state = R.DOCTYPE) : D === "<" ? (E.state = R.OPEN_WAKA, E.startTagPosition = E.position) : P(D) ? (E.doctype += D, E.state = R.DOCTYPE_DTD_QUOTED, E.q = D) : E.doctype += D;
              continue;
            case R.DOCTYPE_DTD_QUOTED:
              E.doctype += D, D === E.q && (E.state = R.DOCTYPE_DTD, E.q = "");
              continue;
            case R.COMMENT:
              D === "-" ? E.state = R.COMMENT_ENDING : E.comment += D;
              continue;
            case R.COMMENT_ENDING:
              D === "-" ? (E.state = R.COMMENT_ENDED, E.comment = U(E.opt, E.comment), E.comment && $(E, "oncomment", E.comment), E.comment = "") : (E.comment += "-" + D, E.state = R.COMMENT);
              continue;
            case R.COMMENT_ENDED:
              D !== ">" ? (A(E, "Malformed comment"), E.comment += "--" + D, E.state = R.COMMENT) : E.doctype && E.doctype !== !0 ? E.state = R.DOCTYPE_DTD : E.state = R.TEXT;
              continue;
            case R.CDATA:
              for (var Ee = B - 1; D && D !== "]"; )
                D = z(y, B++), D && E.trackPosition && (E.position++, D === `
` ? (E.line++, E.column = 0) : E.column++);
              E.cdata += y.substring(Ee, B - 1), D === "]" && (E.state = R.CDATA_ENDING);
              continue;
            case R.CDATA_ENDING:
              D === "]" ? E.state = R.CDATA_ENDING_2 : (E.cdata += "]" + D, E.state = R.CDATA);
              continue;
            case R.CDATA_ENDING_2:
              D === ">" ? (E.cdata && $(E, "oncdata", E.cdata), $(E, "onclosecdata"), E.cdata = "", E.state = R.TEXT) : D === "]" ? E.cdata += "]" : (E.cdata += "]]" + D, E.state = R.CDATA);
              continue;
            case R.PROC_INST:
              D === "?" ? E.state = R.PROC_INST_ENDING : N(D) ? E.state = R.PROC_INST_BODY : E.procInstName += D;
              continue;
            case R.PROC_INST_BODY:
              if (!E.procInstBody && N(D))
                continue;
              D === "?" ? E.state = R.PROC_INST_ENDING : E.procInstBody += D;
              continue;
            case R.PROC_INST_ENDING:
              D === ">" ? ($(E, "onprocessinginstruction", {
                name: E.procInstName,
                body: E.procInstBody
              }), E.procInstName = E.procInstBody = "", E.state = R.TEXT) : (E.procInstBody += "?" + D, E.state = R.PROC_INST_BODY);
              continue;
            case R.OPEN_TAG:
              O(w, D) ? E.tagName += D : (k(E), D === ">" ? ie(E) : D === "/" ? E.state = R.OPEN_TAG_SLASH : (N(D) || A(E, "Invalid character in tag name"), E.state = R.ATTRIB));
              continue;
            case R.OPEN_TAG_SLASH:
              D === ">" ? (ie(E, !0), te(E)) : (A(
                E,
                "Forward-slash in opening tag not followed by >"
              ), E.state = R.ATTRIB);
              continue;
            case R.ATTRIB:
              if (N(D))
                continue;
              D === ">" ? ie(E) : D === "/" ? E.state = R.OPEN_TAG_SLASH : O(m, D) ? (E.attribName = D, E.attribValue = "", E.state = R.ATTRIB_NAME) : A(E, "Invalid attribute name");
              continue;
            case R.ATTRIB_NAME:
              D === "=" ? E.state = R.ATTRIB_VALUE : D === ">" ? (A(E, "Attribute without value"), E.attribValue = E.attribName, W(E), ie(E)) : N(D) ? E.state = R.ATTRIB_NAME_SAW_WHITE : O(w, D) ? E.attribName += D : A(E, "Invalid attribute name");
              continue;
            case R.ATTRIB_NAME_SAW_WHITE:
              if (D === "=")
                E.state = R.ATTRIB_VALUE;
              else {
                if (N(D))
                  continue;
                A(E, "Attribute without value"), E.tag.attributes[E.attribName] = "", E.attribValue = "", $(E, "onattribute", {
                  name: E.attribName,
                  value: ""
                }), E.attribName = "", D === ">" ? ie(E) : O(m, D) ? (E.attribName = D, E.state = R.ATTRIB_NAME) : (A(E, "Invalid attribute name"), E.state = R.ATTRIB);
              }
              continue;
            case R.ATTRIB_VALUE:
              if (N(D))
                continue;
              P(D) ? (E.q = D, E.state = R.ATTRIB_VALUE_QUOTED) : (E.opt.unquotedAttributeValues || C(E, "Unquoted attribute value"), E.state = R.ATTRIB_VALUE_UNQUOTED, E.attribValue = D);
              continue;
            case R.ATTRIB_VALUE_QUOTED:
              if (D !== E.q) {
                D === "&" ? E.state = R.ATTRIB_VALUE_ENTITY_Q : E.attribValue += D;
                continue;
              }
              W(E), E.q = "", E.state = R.ATTRIB_VALUE_CLOSED;
              continue;
            case R.ATTRIB_VALUE_CLOSED:
              N(D) ? E.state = R.ATTRIB : D === ">" ? ie(E) : D === "/" ? E.state = R.OPEN_TAG_SLASH : O(m, D) ? (A(E, "No whitespace between attributes"), E.attribName = D, E.attribValue = "", E.state = R.ATTRIB_NAME) : A(E, "Invalid attribute name");
              continue;
            case R.ATTRIB_VALUE_UNQUOTED:
              if (!F(D)) {
                D === "&" ? E.state = R.ATTRIB_VALUE_ENTITY_U : E.attribValue += D;
                continue;
              }
              W(E), D === ">" ? ie(E) : E.state = R.ATTRIB;
              continue;
            case R.CLOSE_TAG:
              if (E.tagName)
                D === ">" ? te(E) : O(w, D) ? E.tagName += D : E.script ? (E.script += "</" + E.tagName + D, E.tagName = "", E.state = R.SCRIPT) : (N(D) || A(E, "Invalid tagname in closing tag"), E.state = R.CLOSE_TAG_SAW_WHITE);
              else {
                if (N(D))
                  continue;
                L(m, D) ? E.script ? (E.script += "</" + D, E.state = R.SCRIPT) : A(E, "Invalid tagname in closing tag.") : E.tagName = D;
              }
              continue;
            case R.CLOSE_TAG_SAW_WHITE:
              if (N(D))
                continue;
              D === ">" ? te(E) : A(E, "Invalid characters in closing tag");
              continue;
            case R.TEXT_ENTITY:
            case R.ATTRIB_VALUE_ENTITY_Q:
            case R.ATTRIB_VALUE_ENTITY_U:
              var ve, Re;
              switch (E.state) {
                case R.TEXT_ENTITY:
                  ve = R.TEXT, Re = "textNode";
                  break;
                case R.ATTRIB_VALUE_ENTITY_Q:
                  ve = R.ATTRIB_VALUE_QUOTED, Re = "attribValue";
                  break;
                case R.ATTRIB_VALUE_ENTITY_U:
                  ve = R.ATTRIB_VALUE_UNQUOTED, Re = "attribValue";
                  break;
              }
              if (D === ";") {
                var we = he(E);
                E.opt.unparsedEntities && !Object.values(c.XML_ENTITIES).includes(we) ? (E.entity = "", E.state = ve, E.write(we)) : (E[Re] += we, E.entity = "", E.state = ve);
              } else O(E.entity.length ? b : S, D) ? E.entity += D : (A(E, "Invalid character in entity name"), E[Re] += "&" + E.entity + D, E.entity = "", E.state = ve);
              continue;
            default:
              throw new Error(E, "Unknown state: " + E.state);
          }
        return E.position >= E.bufferCheckPosition && d(E), E;
      }
      String.fromCodePoint || (function() {
        var y = String.fromCharCode, E = Math.floor, B = function() {
          var D = 16384, de = [], Ee, ve, Re = -1, we = arguments.length;
          if (!we)
            return "";
          for (var Ge = ""; ++Re < we; ) {
            var Se = Number(arguments[Re]);
            if (!isFinite(Se) || // `NaN`, `+Infinity`, or `-Infinity`
            Se < 0 || // not a valid Unicode code point
            Se > 1114111 || // not a valid Unicode code point
            E(Se) !== Se)
              throw RangeError("Invalid code point: " + Se);
            Se <= 65535 ? de.push(Se) : (Se -= 65536, Ee = (Se >> 10) + 55296, ve = Se % 1024 + 56320, de.push(Ee, ve)), (Re + 1 === we || de.length > D) && (Ge += y.apply(null, de), de.length = 0);
          }
          return Ge;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: B,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = B;
      })();
    })(e);
  })(qn)), qn;
}
var No;
function af() {
  if (No) return kt;
  No = 1, Object.defineProperty(kt, "__esModule", { value: !0 }), kt.XElement = void 0, kt.parseXml = a;
  const e = nf(), c = Vr();
  class p {
    constructor(o) {
      if (this.name = o, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !o)
        throw (0, c.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!d(o))
        throw (0, c.newError)(`Invalid element name: ${o}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(o) {
      const s = this.attributes === null ? null : this.attributes[o];
      if (s == null)
        throw (0, c.newError)(`No attribute "${o}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return s;
    }
    removeAttribute(o) {
      this.attributes !== null && delete this.attributes[o];
    }
    element(o, s = !1, n = null) {
      const t = this.elementOrNull(o, s);
      if (t === null)
        throw (0, c.newError)(n || `No element "${o}"`, "ERR_XML_MISSED_ELEMENT");
      return t;
    }
    elementOrNull(o, s = !1) {
      if (this.elements === null)
        return null;
      for (const n of this.elements)
        if (l(n, o, s))
          return n;
      return null;
    }
    getElements(o, s = !1) {
      return this.elements === null ? [] : this.elements.filter((n) => l(n, o, s));
    }
    elementValueOrEmpty(o, s = !1) {
      const n = this.elementOrNull(o, s);
      return n === null ? "" : n.value;
    }
  }
  kt.XElement = p;
  const f = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function d(u) {
    return f.test(u);
  }
  function l(u, o, s) {
    const n = u.name;
    return n === o || s === !0 && n.length === o.length && n.toLowerCase() === o.toLowerCase();
  }
  function a(u) {
    let o = null;
    const s = e.parser(!0, {}), n = [];
    return s.onopentag = (t) => {
      const r = new p(t.name);
      if (r.attributes = t.attributes, o === null)
        o = r;
      else {
        const h = n[n.length - 1];
        h.elements == null && (h.elements = []), h.elements.push(r);
      }
      n.push(r);
    }, s.onclosetag = () => {
      n.pop();
    }, s.ontext = (t) => {
      n.length > 0 && (n[n.length - 1].value = t);
    }, s.oncdata = (t) => {
      const r = n[n.length - 1];
      r.value = t, r.isCData = !0;
    }, s.onerror = (t) => {
      throw t;
    }, s.write(u), o;
  }
  return kt;
}
var pt = {}, Do;
function of() {
  if (Do) return pt;
  Do = 1, Object.defineProperty(pt, "__esModule", { value: !0 }), pt.mapToObject = e, pt.isValidKey = c, pt.asArray = p, pt.deepAssign = a, pt.objectToArgs = s;
  function e(n) {
    const t = {};
    for (const [r, h] of n)
      c(r) && (h instanceof Map ? t[r] = e(h) : t[r] = h);
    return t;
  }
  function c(n) {
    return ["__proto__", "prototype", "constructor"].includes(n) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof n) || n === null;
  }
  function p(n) {
    return n == null ? [] : Array.isArray(n) ? n : [n];
  }
  function f(n) {
    if (Array.isArray(n))
      return !1;
    const t = typeof n;
    return t === "object" || t === "function";
  }
  function d(n, t, r) {
    const h = t[r];
    if (h === void 0)
      return;
    const g = n[r];
    g == null || h == null || !f(g) || !f(h) ? Array.isArray(g) && Array.isArray(h) ? n[r] = Array.from(new Set(g.concat(h))) : n[r] = h : n[r] = l(g, h);
  }
  function l(n, t) {
    if (n !== t)
      for (const r of Object.getOwnPropertyNames(t))
        c(r) && d(n, t, r);
    return n;
  }
  function a(n, ...t) {
    for (const r of t)
      r != null && l(n, r);
    return n;
  }
  const u = /^[a-zA-Z][a-zA-Z0-9-]*$/, o = /[\0\r\n]/;
  function s(n) {
    const t = Object.entries(n).reduce((r, [h, g]) => {
      if (!c(h) || g == null)
        return r;
      if (!u.test(h))
        throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(h)}`);
      if (o.test(g))
        throw new Error(`objectToArgs: value for --${h} contains a null byte or newline`);
      return r.concat([`--${h}`, g]);
    }, []);
    return Object.freeze(t);
  }
  return pt;
}
var Fo;
function xe() {
  return Fo || (Fo = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.objectToArgs = e.deepAssign = e.asArray = e.mapToObject = e.isValidKey = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.isSensitiveFieldName = e.HttpExecutor = e.hashSensitiveValue = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0;
    var c = ua();
    Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
      return c.CancellationError;
    } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return c.CancellationToken;
    } });
    var p = Vr();
    Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
      return p.newError;
    } });
    var f = Jc();
    Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
      return f.configureRequestOptions;
    } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return f.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
      return f.configureRequestUrl;
    } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
      return f.createHttpError;
    } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
      return f.DigestTransform;
    } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
      return f.HttpError;
    } }), Object.defineProperty(e, "hashSensitiveValue", { enumerable: !0, get: function() {
      return f.hashSensitiveValue;
    } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
      return f.HttpExecutor;
    } }), Object.defineProperty(e, "isSensitiveFieldName", { enumerable: !0, get: function() {
      return f.isSensitiveFieldName;
    } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
      return f.parseJson;
    } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
      return f.safeGetHeader;
    } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
      return f.safeStringifyJson;
    } });
    var d = Qc();
    Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
      return d.MemoLazy;
    } });
    var l = Hl();
    Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return l.ProgressCallbackTransform;
    } });
    var a = Zc();
    Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return a.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
      return a.githubUrl;
    } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
      return a.githubTagPrefix;
    } });
    var u = ef();
    Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
      return u.retry;
    } });
    var o = tf();
    Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
      return o.parseDn;
    } });
    var s = rf();
    Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
      return s.UUID;
    } });
    var n = af();
    Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
      return n.parseXml;
    } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
      return n.XElement;
    } });
    var t = of();
    Object.defineProperty(e, "isValidKey", { enumerable: !0, get: function() {
      return t.isValidKey;
    } }), Object.defineProperty(e, "mapToObject", { enumerable: !0, get: function() {
      return t.mapToObject;
    } }), Object.defineProperty(e, "asArray", { enumerable: !0, get: function() {
      return t.asArray;
    } }), Object.defineProperty(e, "deepAssign", { enumerable: !0, get: function() {
      return t.deepAssign;
    } }), Object.defineProperty(e, "objectToArgs", { enumerable: !0, get: function() {
      return t.objectToArgs;
    } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  })(Ln)), Ln;
}
var Me = {}, qr = {}, mt = {}, Lo;
function _r() {
  if (Lo) return mt;
  Lo = 1;
  function e(a) {
    return typeof a > "u" || a === null;
  }
  function c(a) {
    return typeof a == "object" && a !== null;
  }
  function p(a) {
    return Array.isArray(a) ? a : e(a) ? [] : [a];
  }
  function f(a, u) {
    var o, s, n, t;
    if (u)
      for (t = Object.keys(u), o = 0, s = t.length; o < s; o += 1)
        n = t[o], a[n] = u[n];
    return a;
  }
  function d(a, u) {
    var o = "", s;
    for (s = 0; s < u; s += 1)
      o += a;
    return o;
  }
  function l(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return mt.isNothing = e, mt.isObject = c, mt.toArray = p, mt.repeat = d, mt.isNegativeZero = l, mt.extend = f, mt;
}
var Mn, Uo;
function Rr() {
  if (Uo) return Mn;
  Uo = 1;
  function e(p, f) {
    var d = "", l = p.reason || "(unknown reason)";
    return p.mark ? (p.mark.name && (d += 'in "' + p.mark.name + '" '), d += "(" + (p.mark.line + 1) + ":" + (p.mark.column + 1) + ")", !f && p.mark.snippet && (d += `

` + p.mark.snippet), l + " " + d) : l;
  }
  function c(p, f) {
    Error.call(this), this.name = "YAMLException", this.reason = p, this.mark = f, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return c.prototype = Object.create(Error.prototype), c.prototype.constructor = c, c.prototype.toString = function(f) {
    return this.name + ": " + e(this, f);
  }, Mn = c, Mn;
}
var Bn, xo;
function sf() {
  if (xo) return Bn;
  xo = 1;
  var e = _r();
  function c(d, l, a, u, o) {
    var s = "", n = "", t = Math.floor(o / 2) - 1;
    return u - l > t && (s = " ... ", l = u - t + s.length), a - u > t && (n = " ...", a = u + t - n.length), {
      str: s + d.slice(l, a).replace(/\t/g, "→") + n,
      pos: u - l + s.length
      // relative position
    };
  }
  function p(d, l) {
    return e.repeat(" ", l - d.length) + d;
  }
  function f(d, l) {
    if (l = Object.create(l || null), !d.buffer) return null;
    l.maxLength || (l.maxLength = 79), typeof l.indent != "number" && (l.indent = 1), typeof l.linesBefore != "number" && (l.linesBefore = 3), typeof l.linesAfter != "number" && (l.linesAfter = 2);
    for (var a = /\r?\n|\r|\0/g, u = [0], o = [], s, n = -1; s = a.exec(d.buffer); )
      o.push(s.index), u.push(s.index + s[0].length), d.position <= s.index && n < 0 && (n = u.length - 2);
    n < 0 && (n = u.length - 1);
    var t = "", r, h, g = Math.min(d.line + l.linesAfter, o.length).toString().length, v = l.maxLength - (l.indent + g + 3);
    for (r = 1; r <= l.linesBefore && !(n - r < 0); r++)
      h = c(
        d.buffer,
        u[n - r],
        o[n - r],
        d.position - (u[n] - u[n - r]),
        v
      ), t = e.repeat(" ", l.indent) + p((d.line - r + 1).toString(), g) + " | " + h.str + `
` + t;
    for (h = c(d.buffer, u[n], o[n], d.position, v), t += e.repeat(" ", l.indent) + p((d.line + 1).toString(), g) + " | " + h.str + `
`, t += e.repeat("-", l.indent + g + 3 + h.pos) + `^
`, r = 1; r <= l.linesAfter && !(n + r >= o.length); r++)
      h = c(
        d.buffer,
        u[n + r],
        o[n + r],
        d.position - (u[n] - u[n + r]),
        v
      ), t += e.repeat(" ", l.indent) + p((d.line + r + 1).toString(), g) + " | " + h.str + `
`;
    return t.replace(/\n$/, "");
  }
  return Bn = f, Bn;
}
var jn, ko;
function je() {
  if (ko) return jn;
  ko = 1;
  var e = Rr(), c = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], p = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function f(l) {
    var a = {};
    return l !== null && Object.keys(l).forEach(function(u) {
      l[u].forEach(function(o) {
        a[String(o)] = u;
      });
    }), a;
  }
  function d(l, a) {
    if (a = a || {}, Object.keys(a).forEach(function(u) {
      if (c.indexOf(u) === -1)
        throw new e('Unknown option "' + u + '" is met in definition of "' + l + '" YAML type.');
    }), this.options = a, this.tag = l, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(u) {
      return u;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = f(a.styleAliases || null), p.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + l + '" YAML type.');
  }
  return jn = d, jn;
}
var Hn, $o;
function Gl() {
  if ($o) return Hn;
  $o = 1;
  var e = Rr(), c = je();
  function p(l, a) {
    var u = [];
    return l[a].forEach(function(o) {
      var s = u.length;
      u.forEach(function(n, t) {
        n.tag === o.tag && n.kind === o.kind && n.multi === o.multi && (s = t);
      }), u[s] = o;
    }), u;
  }
  function f() {
    var l = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, a, u;
    function o(s) {
      s.multi ? (l.multi[s.kind].push(s), l.multi.fallback.push(s)) : l[s.kind][s.tag] = l.fallback[s.tag] = s;
    }
    for (a = 0, u = arguments.length; a < u; a += 1)
      arguments[a].forEach(o);
    return l;
  }
  function d(l) {
    return this.extend(l);
  }
  return d.prototype.extend = function(a) {
    var u = [], o = [];
    if (a instanceof c)
      o.push(a);
    else if (Array.isArray(a))
      o = o.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (u = u.concat(a.implicit)), a.explicit && (o = o.concat(a.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    u.forEach(function(n) {
      if (!(n instanceof c))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (n.loadKind && n.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (n.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), o.forEach(function(n) {
      if (!(n instanceof c))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var s = Object.create(d.prototype);
    return s.implicit = (this.implicit || []).concat(u), s.explicit = (this.explicit || []).concat(o), s.compiledImplicit = p(s, "implicit"), s.compiledExplicit = p(s, "explicit"), s.compiledTypeMap = f(s.compiledImplicit, s.compiledExplicit), s;
  }, Hn = d, Hn;
}
var Gn, qo;
function Wl() {
  if (qo) return Gn;
  qo = 1;
  var e = je();
  return Gn = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(c) {
      return c !== null ? c : "";
    }
  }), Gn;
}
var Wn, Mo;
function Vl() {
  if (Mo) return Wn;
  Mo = 1;
  var e = je();
  return Wn = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(c) {
      return c !== null ? c : [];
    }
  }), Wn;
}
var Vn, Bo;
function Yl() {
  if (Bo) return Vn;
  Bo = 1;
  var e = je();
  return Vn = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(c) {
      return c !== null ? c : {};
    }
  }), Vn;
}
var Yn, jo;
function zl() {
  if (jo) return Yn;
  jo = 1;
  var e = Gl();
  return Yn = new e({
    explicit: [
      Wl(),
      Vl(),
      Yl()
    ]
  }), Yn;
}
var zn, Ho;
function Xl() {
  if (Ho) return zn;
  Ho = 1;
  var e = je();
  function c(d) {
    if (d === null) return !0;
    var l = d.length;
    return l === 1 && d === "~" || l === 4 && (d === "null" || d === "Null" || d === "NULL");
  }
  function p() {
    return null;
  }
  function f(d) {
    return d === null;
  }
  return zn = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: c,
    construct: p,
    predicate: f,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), zn;
}
var Xn, Go;
function Kl() {
  if (Go) return Xn;
  Go = 1;
  var e = je();
  function c(d) {
    if (d === null) return !1;
    var l = d.length;
    return l === 4 && (d === "true" || d === "True" || d === "TRUE") || l === 5 && (d === "false" || d === "False" || d === "FALSE");
  }
  function p(d) {
    return d === "true" || d === "True" || d === "TRUE";
  }
  function f(d) {
    return Object.prototype.toString.call(d) === "[object Boolean]";
  }
  return Xn = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: c,
    construct: p,
    predicate: f,
    represent: {
      lowercase: function(d) {
        return d ? "true" : "false";
      },
      uppercase: function(d) {
        return d ? "TRUE" : "FALSE";
      },
      camelcase: function(d) {
        return d ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), Xn;
}
var Kn, Wo;
function Jl() {
  if (Wo) return Kn;
  Wo = 1;
  var e = _r(), c = je();
  function p(o) {
    return 48 <= o && o <= 57 || 65 <= o && o <= 70 || 97 <= o && o <= 102;
  }
  function f(o) {
    return 48 <= o && o <= 55;
  }
  function d(o) {
    return 48 <= o && o <= 57;
  }
  function l(o) {
    if (o === null) return !1;
    var s = o.length, n = 0, t = !1, r;
    if (!s) return !1;
    if (r = o[n], (r === "-" || r === "+") && (r = o[++n]), r === "0") {
      if (n + 1 === s) return !0;
      if (r = o[++n], r === "b") {
        for (n++; n < s; n++)
          if (r = o[n], r !== "_") {
            if (r !== "0" && r !== "1") return !1;
            t = !0;
          }
        return t && r !== "_";
      }
      if (r === "x") {
        for (n++; n < s; n++)
          if (r = o[n], r !== "_") {
            if (!p(o.charCodeAt(n))) return !1;
            t = !0;
          }
        return t && r !== "_";
      }
      if (r === "o") {
        for (n++; n < s; n++)
          if (r = o[n], r !== "_") {
            if (!f(o.charCodeAt(n))) return !1;
            t = !0;
          }
        return t && r !== "_";
      }
    }
    if (r === "_") return !1;
    for (; n < s; n++)
      if (r = o[n], r !== "_") {
        if (!d(o.charCodeAt(n)))
          return !1;
        t = !0;
      }
    return !(!t || r === "_");
  }
  function a(o) {
    var s = o, n = 1, t;
    if (s.indexOf("_") !== -1 && (s = s.replace(/_/g, "")), t = s[0], (t === "-" || t === "+") && (t === "-" && (n = -1), s = s.slice(1), t = s[0]), s === "0") return 0;
    if (t === "0") {
      if (s[1] === "b") return n * parseInt(s.slice(2), 2);
      if (s[1] === "x") return n * parseInt(s.slice(2), 16);
      if (s[1] === "o") return n * parseInt(s.slice(2), 8);
    }
    return n * parseInt(s, 10);
  }
  function u(o) {
    return Object.prototype.toString.call(o) === "[object Number]" && o % 1 === 0 && !e.isNegativeZero(o);
  }
  return Kn = new c("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: l,
    construct: a,
    predicate: u,
    represent: {
      binary: function(o) {
        return o >= 0 ? "0b" + o.toString(2) : "-0b" + o.toString(2).slice(1);
      },
      octal: function(o) {
        return o >= 0 ? "0o" + o.toString(8) : "-0o" + o.toString(8).slice(1);
      },
      decimal: function(o) {
        return o.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(o) {
        return o >= 0 ? "0x" + o.toString(16).toUpperCase() : "-0x" + o.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), Kn;
}
var Jn, Vo;
function Ql() {
  if (Vo) return Jn;
  Vo = 1;
  var e = _r(), c = je(), p = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function f(o) {
    return !(o === null || !p.test(o) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    o[o.length - 1] === "_");
  }
  function d(o) {
    var s, n;
    return s = o.replace(/_/g, "").toLowerCase(), n = s[0] === "-" ? -1 : 1, "+-".indexOf(s[0]) >= 0 && (s = s.slice(1)), s === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : s === ".nan" ? NaN : n * parseFloat(s, 10);
  }
  var l = /^[-+]?[0-9]+e/;
  function a(o, s) {
    var n;
    if (isNaN(o))
      switch (s) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === o)
      switch (s) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === o)
      switch (s) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(o))
      return "-0.0";
    return n = o.toString(10), l.test(n) ? n.replace("e", ".e") : n;
  }
  function u(o) {
    return Object.prototype.toString.call(o) === "[object Number]" && (o % 1 !== 0 || e.isNegativeZero(o));
  }
  return Jn = new c("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: f,
    construct: d,
    predicate: u,
    represent: a,
    defaultStyle: "lowercase"
  }), Jn;
}
var Qn, Yo;
function Zl() {
  return Yo || (Yo = 1, Qn = zl().extend({
    implicit: [
      Xl(),
      Kl(),
      Jl(),
      Ql()
    ]
  })), Qn;
}
var Zn, zo;
function eu() {
  return zo || (zo = 1, Zn = Zl()), Zn;
}
var ei, Xo;
function tu() {
  if (Xo) return ei;
  Xo = 1;
  var e = je(), c = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), p = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function f(a) {
    return a === null ? !1 : c.exec(a) !== null || p.exec(a) !== null;
  }
  function d(a) {
    var u, o, s, n, t, r, h, g = 0, v = null, m, w, S;
    if (u = c.exec(a), u === null && (u = p.exec(a)), u === null) throw new Error("Date resolve error");
    if (o = +u[1], s = +u[2] - 1, n = +u[3], !u[4])
      return new Date(Date.UTC(o, s, n));
    if (t = +u[4], r = +u[5], h = +u[6], u[7]) {
      for (g = u[7].slice(0, 3); g.length < 3; )
        g += "0";
      g = +g;
    }
    return u[9] && (m = +u[10], w = +(u[11] || 0), v = (m * 60 + w) * 6e4, u[9] === "-" && (v = -v)), S = new Date(Date.UTC(o, s, n, t, r, h, g)), v && S.setTime(S.getTime() - v), S;
  }
  function l(a) {
    return a.toISOString();
  }
  return ei = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: f,
    construct: d,
    instanceOf: Date,
    represent: l
  }), ei;
}
var ti, Ko;
function ru() {
  if (Ko) return ti;
  Ko = 1;
  var e = je();
  function c(p) {
    return p === "<<" || p === null;
  }
  return ti = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: c
  }), ti;
}
var ri, Jo;
function nu() {
  if (Jo) return ri;
  Jo = 1;
  var e = je(), c = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function p(a) {
    if (a === null) return !1;
    var u, o, s = 0, n = a.length, t = c;
    for (o = 0; o < n; o++)
      if (u = t.indexOf(a.charAt(o)), !(u > 64)) {
        if (u < 0) return !1;
        s += 6;
      }
    return s % 8 === 0;
  }
  function f(a) {
    var u, o, s = a.replace(/[\r\n=]/g, ""), n = s.length, t = c, r = 0, h = [];
    for (u = 0; u < n; u++)
      u % 4 === 0 && u && (h.push(r >> 16 & 255), h.push(r >> 8 & 255), h.push(r & 255)), r = r << 6 | t.indexOf(s.charAt(u));
    return o = n % 4 * 6, o === 0 ? (h.push(r >> 16 & 255), h.push(r >> 8 & 255), h.push(r & 255)) : o === 18 ? (h.push(r >> 10 & 255), h.push(r >> 2 & 255)) : o === 12 && h.push(r >> 4 & 255), new Uint8Array(h);
  }
  function d(a) {
    var u = "", o = 0, s, n, t = a.length, r = c;
    for (s = 0; s < t; s++)
      s % 3 === 0 && s && (u += r[o >> 18 & 63], u += r[o >> 12 & 63], u += r[o >> 6 & 63], u += r[o & 63]), o = (o << 8) + a[s];
    return n = t % 3, n === 0 ? (u += r[o >> 18 & 63], u += r[o >> 12 & 63], u += r[o >> 6 & 63], u += r[o & 63]) : n === 2 ? (u += r[o >> 10 & 63], u += r[o >> 4 & 63], u += r[o << 2 & 63], u += r[64]) : n === 1 && (u += r[o >> 2 & 63], u += r[o << 4 & 63], u += r[64], u += r[64]), u;
  }
  function l(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return ri = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: p,
    construct: f,
    predicate: l,
    represent: d
  }), ri;
}
var ni, Qo;
function iu() {
  if (Qo) return ni;
  Qo = 1;
  var e = je(), c = Object.prototype.hasOwnProperty, p = Object.prototype.toString;
  function f(l) {
    if (l === null) return !0;
    var a = [], u, o, s, n, t, r = l;
    for (u = 0, o = r.length; u < o; u += 1) {
      if (s = r[u], t = !1, p.call(s) !== "[object Object]") return !1;
      for (n in s)
        if (c.call(s, n))
          if (!t) t = !0;
          else return !1;
      if (!t) return !1;
      if (a.indexOf(n) === -1) a.push(n);
      else return !1;
    }
    return !0;
  }
  function d(l) {
    return l !== null ? l : [];
  }
  return ni = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: f,
    construct: d
  }), ni;
}
var ii, Zo;
function au() {
  if (Zo) return ii;
  Zo = 1;
  var e = je(), c = Object.prototype.toString;
  function p(d) {
    if (d === null) return !0;
    var l, a, u, o, s, n = d;
    for (s = new Array(n.length), l = 0, a = n.length; l < a; l += 1) {
      if (u = n[l], c.call(u) !== "[object Object]" || (o = Object.keys(u), o.length !== 1)) return !1;
      s[l] = [o[0], u[o[0]]];
    }
    return !0;
  }
  function f(d) {
    if (d === null) return [];
    var l, a, u, o, s, n = d;
    for (s = new Array(n.length), l = 0, a = n.length; l < a; l += 1)
      u = n[l], o = Object.keys(u), s[l] = [o[0], u[o[0]]];
    return s;
  }
  return ii = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: p,
    construct: f
  }), ii;
}
var ai, es;
function ou() {
  if (es) return ai;
  es = 1;
  var e = je(), c = Object.prototype.hasOwnProperty;
  function p(d) {
    if (d === null) return !0;
    var l, a = d;
    for (l in a)
      if (c.call(a, l) && a[l] !== null)
        return !1;
    return !0;
  }
  function f(d) {
    return d !== null ? d : {};
  }
  return ai = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: p,
    construct: f
  }), ai;
}
var oi, ts;
function ca() {
  return ts || (ts = 1, oi = eu().extend({
    implicit: [
      tu(),
      ru()
    ],
    explicit: [
      nu(),
      iu(),
      au(),
      ou()
    ]
  })), oi;
}
var rs;
function lf() {
  if (rs) return qr;
  rs = 1;
  var e = _r(), c = Rr(), p = sf(), f = ca(), d = Object.prototype.hasOwnProperty, l = 1, a = 2, u = 3, o = 4, s = 1, n = 2, t = 3, r = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, h = /[\x85\u2028\u2029]/, g = /[,\[\]\{\}]/, v = /^(?:!|!!|![a-z\-]+!)$/i, m = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function w(i) {
    return Object.prototype.toString.call(i);
  }
  function S(i) {
    return i === 10 || i === 13;
  }
  function b(i) {
    return i === 9 || i === 32;
  }
  function N(i) {
    return i === 9 || i === 32 || i === 10 || i === 13;
  }
  function P(i) {
    return i === 44 || i === 91 || i === 93 || i === 123 || i === 125;
  }
  function F(i) {
    var j;
    return 48 <= i && i <= 57 ? i - 48 : (j = i | 32, 97 <= j && j <= 102 ? j - 97 + 10 : -1);
  }
  function O(i) {
    return i === 120 ? 2 : i === 117 ? 4 : i === 85 ? 8 : 0;
  }
  function L(i) {
    return 48 <= i && i <= 57 ? i - 48 : -1;
  }
  function R(i) {
    return i === 48 ? "\0" : i === 97 ? "\x07" : i === 98 ? "\b" : i === 116 || i === 9 ? "	" : i === 110 ? `
` : i === 118 ? "\v" : i === 102 ? "\f" : i === 114 ? "\r" : i === 101 ? "\x1B" : i === 32 ? " " : i === 34 ? '"' : i === 47 ? "/" : i === 92 ? "\\" : i === 78 ? "" : i === 95 ? " " : i === 76 ? "\u2028" : i === 80 ? "\u2029" : "";
  }
  function Y(i) {
    return i <= 65535 ? String.fromCharCode(i) : String.fromCharCode(
      (i - 65536 >> 10) + 55296,
      (i - 65536 & 1023) + 56320
    );
  }
  function G(i, j, V) {
    j === "__proto__" ? Object.defineProperty(i, j, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: V
    }) : i[j] = V;
  }
  for (var $ = new Array(256), H = new Array(256), U = 0; U < 256; U++)
    $[U] = R(U) ? 1 : 0, H[U] = R(U);
  function C(i, j) {
    this.input = i, this.filename = j.filename || null, this.schema = j.schema || f, this.onWarning = j.onWarning || null, this.legacy = j.legacy || !1, this.json = j.json || !1, this.listener = j.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = i.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function I(i, j) {
    var V = {
      name: i.filename,
      buffer: i.input.slice(0, -1),
      // omit trailing \0
      position: i.position,
      line: i.line,
      column: i.position - i.lineStart
    };
    return V.snippet = p(V), new c(j, V);
  }
  function A(i, j) {
    throw I(i, j);
  }
  function k(i, j) {
    i.onWarning && i.onWarning.call(null, I(i, j));
  }
  var M = {
    YAML: function(j, V, ae) {
      var X, ne, ee;
      j.version !== null && A(j, "duplication of %YAML directive"), ae.length !== 1 && A(j, "YAML directive accepts exactly one argument"), X = /^([0-9]+)\.([0-9]+)$/.exec(ae[0]), X === null && A(j, "ill-formed argument of the YAML directive"), ne = parseInt(X[1], 10), ee = parseInt(X[2], 10), ne !== 1 && A(j, "unacceptable YAML version of the document"), j.version = ae[0], j.checkLineBreaks = ee < 2, ee !== 1 && ee !== 2 && k(j, "unsupported YAML version of the document");
    },
    TAG: function(j, V, ae) {
      var X, ne;
      ae.length !== 2 && A(j, "TAG directive accepts exactly two arguments"), X = ae[0], ne = ae[1], v.test(X) || A(j, "ill-formed tag handle (first argument) of the TAG directive"), d.call(j.tagMap, X) && A(j, 'there is a previously declared suffix for "' + X + '" tag handle'), m.test(ne) || A(j, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        ne = decodeURIComponent(ne);
      } catch {
        A(j, "tag prefix is malformed: " + ne);
      }
      j.tagMap[X] = ne;
    }
  };
  function W(i, j, V, ae) {
    var X, ne, ee, le;
    if (j < V) {
      if (le = i.input.slice(j, V), ae)
        for (X = 0, ne = le.length; X < ne; X += 1)
          ee = le.charCodeAt(X), ee === 9 || 32 <= ee && ee <= 1114111 || A(i, "expected valid JSON character");
      else r.test(le) && A(i, "the stream contains non-printable characters");
      i.result += le;
    }
  }
  function ie(i, j, V, ae) {
    var X, ne, ee, le;
    for (e.isObject(V) || A(i, "cannot merge mappings; the provided source object is unacceptable"), X = Object.keys(V), ee = 0, le = X.length; ee < le; ee += 1)
      ne = X[ee], d.call(j, ne) || (G(j, ne, V[ne]), ae[ne] = !0);
  }
  function te(i, j, V, ae, X, ne, ee, le, fe) {
    var Te, be;
    if (Array.isArray(X))
      for (X = Array.prototype.slice.call(X), Te = 0, be = X.length; Te < be; Te += 1)
        Array.isArray(X[Te]) && A(i, "nested arrays are not supported inside keys"), typeof X == "object" && w(X[Te]) === "[object Object]" && (X[Te] = "[object Object]");
    if (typeof X == "object" && w(X) === "[object Object]" && (X = "[object Object]"), X = String(X), j === null && (j = {}), ae === "tag:yaml.org,2002:merge")
      if (Array.isArray(ne))
        for (Te = 0, be = ne.length; Te < be; Te += 1)
          ie(i, j, ne[Te], V);
      else
        ie(i, j, ne, V);
    else
      !i.json && !d.call(V, X) && d.call(j, X) && (i.line = ee || i.line, i.lineStart = le || i.lineStart, i.position = fe || i.position, A(i, "duplicated mapping key")), G(j, X, ne), delete V[X];
    return j;
  }
  function he(i) {
    var j;
    j = i.input.charCodeAt(i.position), j === 10 ? i.position++ : j === 13 ? (i.position++, i.input.charCodeAt(i.position) === 10 && i.position++) : A(i, "a line break is expected"), i.line += 1, i.lineStart = i.position, i.firstTabInLine = -1;
  }
  function pe(i, j, V) {
    for (var ae = 0, X = i.input.charCodeAt(i.position); X !== 0; ) {
      for (; b(X); )
        X === 9 && i.firstTabInLine === -1 && (i.firstTabInLine = i.position), X = i.input.charCodeAt(++i.position);
      if (j && X === 35)
        do
          X = i.input.charCodeAt(++i.position);
        while (X !== 10 && X !== 13 && X !== 0);
      if (S(X))
        for (he(i), X = i.input.charCodeAt(i.position), ae++, i.lineIndent = 0; X === 32; )
          i.lineIndent++, X = i.input.charCodeAt(++i.position);
      else
        break;
    }
    return V !== -1 && ae !== 0 && i.lineIndent < V && k(i, "deficient indentation"), ae;
  }
  function z(i) {
    var j = i.position, V;
    return V = i.input.charCodeAt(j), !!((V === 45 || V === 46) && V === i.input.charCodeAt(j + 1) && V === i.input.charCodeAt(j + 2) && (j += 3, V = i.input.charCodeAt(j), V === 0 || N(V)));
  }
  function me(i, j) {
    j === 1 ? i.result += " " : j > 1 && (i.result += e.repeat(`
`, j - 1));
  }
  function y(i, j, V) {
    var ae, X, ne, ee, le, fe, Te, be, ye = i.kind, _ = i.result, q;
    if (q = i.input.charCodeAt(i.position), N(q) || P(q) || q === 35 || q === 38 || q === 42 || q === 33 || q === 124 || q === 62 || q === 39 || q === 34 || q === 37 || q === 64 || q === 96 || (q === 63 || q === 45) && (X = i.input.charCodeAt(i.position + 1), N(X) || V && P(X)))
      return !1;
    for (i.kind = "scalar", i.result = "", ne = ee = i.position, le = !1; q !== 0; ) {
      if (q === 58) {
        if (X = i.input.charCodeAt(i.position + 1), N(X) || V && P(X))
          break;
      } else if (q === 35) {
        if (ae = i.input.charCodeAt(i.position - 1), N(ae))
          break;
      } else {
        if (i.position === i.lineStart && z(i) || V && P(q))
          break;
        if (S(q))
          if (fe = i.line, Te = i.lineStart, be = i.lineIndent, pe(i, !1, -1), i.lineIndent >= j) {
            le = !0, q = i.input.charCodeAt(i.position);
            continue;
          } else {
            i.position = ee, i.line = fe, i.lineStart = Te, i.lineIndent = be;
            break;
          }
      }
      le && (W(i, ne, ee, !1), me(i, i.line - fe), ne = ee = i.position, le = !1), b(q) || (ee = i.position + 1), q = i.input.charCodeAt(++i.position);
    }
    return W(i, ne, ee, !1), i.result ? !0 : (i.kind = ye, i.result = _, !1);
  }
  function E(i, j) {
    var V, ae, X;
    if (V = i.input.charCodeAt(i.position), V !== 39)
      return !1;
    for (i.kind = "scalar", i.result = "", i.position++, ae = X = i.position; (V = i.input.charCodeAt(i.position)) !== 0; )
      if (V === 39)
        if (W(i, ae, i.position, !0), V = i.input.charCodeAt(++i.position), V === 39)
          ae = i.position, i.position++, X = i.position;
        else
          return !0;
      else S(V) ? (W(i, ae, X, !0), me(i, pe(i, !1, j)), ae = X = i.position) : i.position === i.lineStart && z(i) ? A(i, "unexpected end of the document within a single quoted scalar") : (i.position++, X = i.position);
    A(i, "unexpected end of the stream within a single quoted scalar");
  }
  function B(i, j) {
    var V, ae, X, ne, ee, le;
    if (le = i.input.charCodeAt(i.position), le !== 34)
      return !1;
    for (i.kind = "scalar", i.result = "", i.position++, V = ae = i.position; (le = i.input.charCodeAt(i.position)) !== 0; ) {
      if (le === 34)
        return W(i, V, i.position, !0), i.position++, !0;
      if (le === 92) {
        if (W(i, V, i.position, !0), le = i.input.charCodeAt(++i.position), S(le))
          pe(i, !1, j);
        else if (le < 256 && $[le])
          i.result += H[le], i.position++;
        else if ((ee = O(le)) > 0) {
          for (X = ee, ne = 0; X > 0; X--)
            le = i.input.charCodeAt(++i.position), (ee = F(le)) >= 0 ? ne = (ne << 4) + ee : A(i, "expected hexadecimal character");
          i.result += Y(ne), i.position++;
        } else
          A(i, "unknown escape sequence");
        V = ae = i.position;
      } else S(le) ? (W(i, V, ae, !0), me(i, pe(i, !1, j)), V = ae = i.position) : i.position === i.lineStart && z(i) ? A(i, "unexpected end of the document within a double quoted scalar") : (i.position++, ae = i.position);
    }
    A(i, "unexpected end of the stream within a double quoted scalar");
  }
  function D(i, j) {
    var V = !0, ae, X, ne, ee = i.tag, le, fe = i.anchor, Te, be, ye, _, q, K = /* @__PURE__ */ Object.create(null), J, Q, oe, re;
    if (re = i.input.charCodeAt(i.position), re === 91)
      be = 93, q = !1, le = [];
    else if (re === 123)
      be = 125, q = !0, le = {};
    else
      return !1;
    for (i.anchor !== null && (i.anchorMap[i.anchor] = le), re = i.input.charCodeAt(++i.position); re !== 0; ) {
      if (pe(i, !0, j), re = i.input.charCodeAt(i.position), re === be)
        return i.position++, i.tag = ee, i.anchor = fe, i.kind = q ? "mapping" : "sequence", i.result = le, !0;
      V ? re === 44 && A(i, "expected the node content, but found ','") : A(i, "missed comma between flow collection entries"), Q = J = oe = null, ye = _ = !1, re === 63 && (Te = i.input.charCodeAt(i.position + 1), N(Te) && (ye = _ = !0, i.position++, pe(i, !0, j))), ae = i.line, X = i.lineStart, ne = i.position, Se(i, j, l, !1, !0), Q = i.tag, J = i.result, pe(i, !0, j), re = i.input.charCodeAt(i.position), (_ || i.line === ae) && re === 58 && (ye = !0, re = i.input.charCodeAt(++i.position), pe(i, !0, j), Se(i, j, l, !1, !0), oe = i.result), q ? te(i, le, K, Q, J, oe, ae, X, ne) : ye ? le.push(te(i, null, K, Q, J, oe, ae, X, ne)) : le.push(J), pe(i, !0, j), re = i.input.charCodeAt(i.position), re === 44 ? (V = !0, re = i.input.charCodeAt(++i.position)) : V = !1;
    }
    A(i, "unexpected end of the stream within a flow collection");
  }
  function de(i, j) {
    var V, ae, X = s, ne = !1, ee = !1, le = j, fe = 0, Te = !1, be, ye;
    if (ye = i.input.charCodeAt(i.position), ye === 124)
      ae = !1;
    else if (ye === 62)
      ae = !0;
    else
      return !1;
    for (i.kind = "scalar", i.result = ""; ye !== 0; )
      if (ye = i.input.charCodeAt(++i.position), ye === 43 || ye === 45)
        s === X ? X = ye === 43 ? t : n : A(i, "repeat of a chomping mode identifier");
      else if ((be = L(ye)) >= 0)
        be === 0 ? A(i, "bad explicit indentation width of a block scalar; it cannot be less than one") : ee ? A(i, "repeat of an indentation width identifier") : (le = j + be - 1, ee = !0);
      else
        break;
    if (b(ye)) {
      do
        ye = i.input.charCodeAt(++i.position);
      while (b(ye));
      if (ye === 35)
        do
          ye = i.input.charCodeAt(++i.position);
        while (!S(ye) && ye !== 0);
    }
    for (; ye !== 0; ) {
      for (he(i), i.lineIndent = 0, ye = i.input.charCodeAt(i.position); (!ee || i.lineIndent < le) && ye === 32; )
        i.lineIndent++, ye = i.input.charCodeAt(++i.position);
      if (!ee && i.lineIndent > le && (le = i.lineIndent), S(ye)) {
        fe++;
        continue;
      }
      if (i.lineIndent < le) {
        X === t ? i.result += e.repeat(`
`, ne ? 1 + fe : fe) : X === s && ne && (i.result += `
`);
        break;
      }
      for (ae ? b(ye) ? (Te = !0, i.result += e.repeat(`
`, ne ? 1 + fe : fe)) : Te ? (Te = !1, i.result += e.repeat(`
`, fe + 1)) : fe === 0 ? ne && (i.result += " ") : i.result += e.repeat(`
`, fe) : i.result += e.repeat(`
`, ne ? 1 + fe : fe), ne = !0, ee = !0, fe = 0, V = i.position; !S(ye) && ye !== 0; )
        ye = i.input.charCodeAt(++i.position);
      W(i, V, i.position, !1);
    }
    return !0;
  }
  function Ee(i, j) {
    var V, ae = i.tag, X = i.anchor, ne = [], ee, le = !1, fe;
    if (i.firstTabInLine !== -1) return !1;
    for (i.anchor !== null && (i.anchorMap[i.anchor] = ne), fe = i.input.charCodeAt(i.position); fe !== 0 && (i.firstTabInLine !== -1 && (i.position = i.firstTabInLine, A(i, "tab characters must not be used in indentation")), !(fe !== 45 || (ee = i.input.charCodeAt(i.position + 1), !N(ee)))); ) {
      if (le = !0, i.position++, pe(i, !0, -1) && i.lineIndent <= j) {
        ne.push(null), fe = i.input.charCodeAt(i.position);
        continue;
      }
      if (V = i.line, Se(i, j, u, !1, !0), ne.push(i.result), pe(i, !0, -1), fe = i.input.charCodeAt(i.position), (i.line === V || i.lineIndent > j) && fe !== 0)
        A(i, "bad indentation of a sequence entry");
      else if (i.lineIndent < j)
        break;
    }
    return le ? (i.tag = ae, i.anchor = X, i.kind = "sequence", i.result = ne, !0) : !1;
  }
  function ve(i, j, V) {
    var ae, X, ne, ee, le, fe, Te = i.tag, be = i.anchor, ye = {}, _ = /* @__PURE__ */ Object.create(null), q = null, K = null, J = null, Q = !1, oe = !1, re;
    if (i.firstTabInLine !== -1) return !1;
    for (i.anchor !== null && (i.anchorMap[i.anchor] = ye), re = i.input.charCodeAt(i.position); re !== 0; ) {
      if (!Q && i.firstTabInLine !== -1 && (i.position = i.firstTabInLine, A(i, "tab characters must not be used in indentation")), ae = i.input.charCodeAt(i.position + 1), ne = i.line, (re === 63 || re === 58) && N(ae))
        re === 63 ? (Q && (te(i, ye, _, q, K, null, ee, le, fe), q = K = J = null), oe = !0, Q = !0, X = !0) : Q ? (Q = !1, X = !0) : A(i, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), i.position += 1, re = ae;
      else {
        if (ee = i.line, le = i.lineStart, fe = i.position, !Se(i, V, a, !1, !0))
          break;
        if (i.line === ne) {
          for (re = i.input.charCodeAt(i.position); b(re); )
            re = i.input.charCodeAt(++i.position);
          if (re === 58)
            re = i.input.charCodeAt(++i.position), N(re) || A(i, "a whitespace character is expected after the key-value separator within a block mapping"), Q && (te(i, ye, _, q, K, null, ee, le, fe), q = K = J = null), oe = !0, Q = !1, X = !1, q = i.tag, K = i.result;
          else if (oe)
            A(i, "can not read an implicit mapping pair; a colon is missed");
          else
            return i.tag = Te, i.anchor = be, !0;
        } else if (oe)
          A(i, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return i.tag = Te, i.anchor = be, !0;
      }
      if ((i.line === ne || i.lineIndent > j) && (Q && (ee = i.line, le = i.lineStart, fe = i.position), Se(i, j, o, !0, X) && (Q ? K = i.result : J = i.result), Q || (te(i, ye, _, q, K, J, ee, le, fe), q = K = J = null), pe(i, !0, -1), re = i.input.charCodeAt(i.position)), (i.line === ne || i.lineIndent > j) && re !== 0)
        A(i, "bad indentation of a mapping entry");
      else if (i.lineIndent < j)
        break;
    }
    return Q && te(i, ye, _, q, K, null, ee, le, fe), oe && (i.tag = Te, i.anchor = be, i.kind = "mapping", i.result = ye), oe;
  }
  function Re(i) {
    var j, V = !1, ae = !1, X, ne, ee;
    if (ee = i.input.charCodeAt(i.position), ee !== 33) return !1;
    if (i.tag !== null && A(i, "duplication of a tag property"), ee = i.input.charCodeAt(++i.position), ee === 60 ? (V = !0, ee = i.input.charCodeAt(++i.position)) : ee === 33 ? (ae = !0, X = "!!", ee = i.input.charCodeAt(++i.position)) : X = "!", j = i.position, V) {
      do
        ee = i.input.charCodeAt(++i.position);
      while (ee !== 0 && ee !== 62);
      i.position < i.length ? (ne = i.input.slice(j, i.position), ee = i.input.charCodeAt(++i.position)) : A(i, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; ee !== 0 && !N(ee); )
        ee === 33 && (ae ? A(i, "tag suffix cannot contain exclamation marks") : (X = i.input.slice(j - 1, i.position + 1), v.test(X) || A(i, "named tag handle cannot contain such characters"), ae = !0, j = i.position + 1)), ee = i.input.charCodeAt(++i.position);
      ne = i.input.slice(j, i.position), g.test(ne) && A(i, "tag suffix cannot contain flow indicator characters");
    }
    ne && !m.test(ne) && A(i, "tag name cannot contain such characters: " + ne);
    try {
      ne = decodeURIComponent(ne);
    } catch {
      A(i, "tag name is malformed: " + ne);
    }
    return V ? i.tag = ne : d.call(i.tagMap, X) ? i.tag = i.tagMap[X] + ne : X === "!" ? i.tag = "!" + ne : X === "!!" ? i.tag = "tag:yaml.org,2002:" + ne : A(i, 'undeclared tag handle "' + X + '"'), !0;
  }
  function we(i) {
    var j, V;
    if (V = i.input.charCodeAt(i.position), V !== 38) return !1;
    for (i.anchor !== null && A(i, "duplication of an anchor property"), V = i.input.charCodeAt(++i.position), j = i.position; V !== 0 && !N(V) && !P(V); )
      V = i.input.charCodeAt(++i.position);
    return i.position === j && A(i, "name of an anchor node must contain at least one character"), i.anchor = i.input.slice(j, i.position), !0;
  }
  function Ge(i) {
    var j, V, ae;
    if (ae = i.input.charCodeAt(i.position), ae !== 42) return !1;
    for (ae = i.input.charCodeAt(++i.position), j = i.position; ae !== 0 && !N(ae) && !P(ae); )
      ae = i.input.charCodeAt(++i.position);
    return i.position === j && A(i, "name of an alias node must contain at least one character"), V = i.input.slice(j, i.position), d.call(i.anchorMap, V) || A(i, 'unidentified alias "' + V + '"'), i.result = i.anchorMap[V], pe(i, !0, -1), !0;
  }
  function Se(i, j, V, ae, X) {
    var ne, ee, le, fe = 1, Te = !1, be = !1, ye, _, q, K, J, Q;
    if (i.listener !== null && i.listener("open", i), i.tag = null, i.anchor = null, i.kind = null, i.result = null, ne = ee = le = o === V || u === V, ae && pe(i, !0, -1) && (Te = !0, i.lineIndent > j ? fe = 1 : i.lineIndent === j ? fe = 0 : i.lineIndent < j && (fe = -1)), fe === 1)
      for (; Re(i) || we(i); )
        pe(i, !0, -1) ? (Te = !0, le = ne, i.lineIndent > j ? fe = 1 : i.lineIndent === j ? fe = 0 : i.lineIndent < j && (fe = -1)) : le = !1;
    if (le && (le = Te || X), (fe === 1 || o === V) && (l === V || a === V ? J = j : J = j + 1, Q = i.position - i.lineStart, fe === 1 ? le && (Ee(i, Q) || ve(i, Q, J)) || D(i, J) ? be = !0 : (ee && de(i, J) || E(i, J) || B(i, J) ? be = !0 : Ge(i) ? (be = !0, (i.tag !== null || i.anchor !== null) && A(i, "alias node should not have any properties")) : y(i, J, l === V) && (be = !0, i.tag === null && (i.tag = "?")), i.anchor !== null && (i.anchorMap[i.anchor] = i.result)) : fe === 0 && (be = le && Ee(i, Q))), i.tag === null)
      i.anchor !== null && (i.anchorMap[i.anchor] = i.result);
    else if (i.tag === "?") {
      for (i.result !== null && i.kind !== "scalar" && A(i, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + i.kind + '"'), ye = 0, _ = i.implicitTypes.length; ye < _; ye += 1)
        if (K = i.implicitTypes[ye], K.resolve(i.result)) {
          i.result = K.construct(i.result), i.tag = K.tag, i.anchor !== null && (i.anchorMap[i.anchor] = i.result);
          break;
        }
    } else if (i.tag !== "!") {
      if (d.call(i.typeMap[i.kind || "fallback"], i.tag))
        K = i.typeMap[i.kind || "fallback"][i.tag];
      else
        for (K = null, q = i.typeMap.multi[i.kind || "fallback"], ye = 0, _ = q.length; ye < _; ye += 1)
          if (i.tag.slice(0, q[ye].tag.length) === q[ye].tag) {
            K = q[ye];
            break;
          }
      K || A(i, "unknown tag !<" + i.tag + ">"), i.result !== null && K.kind !== i.kind && A(i, "unacceptable node kind for !<" + i.tag + '> tag; it should be "' + K.kind + '", not "' + i.kind + '"'), K.resolve(i.result, i.tag) ? (i.result = K.construct(i.result, i.tag), i.anchor !== null && (i.anchorMap[i.anchor] = i.result)) : A(i, "cannot resolve a node with !<" + i.tag + "> explicit tag");
    }
    return i.listener !== null && i.listener("close", i), i.tag !== null || i.anchor !== null || be;
  }
  function Be(i) {
    var j = i.position, V, ae, X, ne = !1, ee;
    for (i.version = null, i.checkLineBreaks = i.legacy, i.tagMap = /* @__PURE__ */ Object.create(null), i.anchorMap = /* @__PURE__ */ Object.create(null); (ee = i.input.charCodeAt(i.position)) !== 0 && (pe(i, !0, -1), ee = i.input.charCodeAt(i.position), !(i.lineIndent > 0 || ee !== 37)); ) {
      for (ne = !0, ee = i.input.charCodeAt(++i.position), V = i.position; ee !== 0 && !N(ee); )
        ee = i.input.charCodeAt(++i.position);
      for (ae = i.input.slice(V, i.position), X = [], ae.length < 1 && A(i, "directive name must not be less than one character in length"); ee !== 0; ) {
        for (; b(ee); )
          ee = i.input.charCodeAt(++i.position);
        if (ee === 35) {
          do
            ee = i.input.charCodeAt(++i.position);
          while (ee !== 0 && !S(ee));
          break;
        }
        if (S(ee)) break;
        for (V = i.position; ee !== 0 && !N(ee); )
          ee = i.input.charCodeAt(++i.position);
        X.push(i.input.slice(V, i.position));
      }
      ee !== 0 && he(i), d.call(M, ae) ? M[ae](i, ae, X) : k(i, 'unknown document directive "' + ae + '"');
    }
    if (pe(i, !0, -1), i.lineIndent === 0 && i.input.charCodeAt(i.position) === 45 && i.input.charCodeAt(i.position + 1) === 45 && i.input.charCodeAt(i.position + 2) === 45 ? (i.position += 3, pe(i, !0, -1)) : ne && A(i, "directives end mark is expected"), Se(i, i.lineIndent - 1, o, !1, !0), pe(i, !0, -1), i.checkLineBreaks && h.test(i.input.slice(j, i.position)) && k(i, "non-ASCII line breaks are interpreted as content"), i.documents.push(i.result), i.position === i.lineStart && z(i)) {
      i.input.charCodeAt(i.position) === 46 && (i.position += 3, pe(i, !0, -1));
      return;
    }
    if (i.position < i.length - 1)
      A(i, "end of the stream or a document separator is expected");
    else
      return;
  }
  function ct(i, j) {
    i = String(i), j = j || {}, i.length !== 0 && (i.charCodeAt(i.length - 1) !== 10 && i.charCodeAt(i.length - 1) !== 13 && (i += `
`), i.charCodeAt(0) === 65279 && (i = i.slice(1)));
    var V = new C(i, j), ae = i.indexOf("\0");
    for (ae !== -1 && (V.position = ae, A(V, "null byte is not allowed in input")), V.input += "\0"; V.input.charCodeAt(V.position) === 32; )
      V.lineIndent += 1, V.position += 1;
    for (; V.position < V.length - 1; )
      Be(V);
    return V.documents;
  }
  function at(i, j, V) {
    j !== null && typeof j == "object" && typeof V > "u" && (V = j, j = null);
    var ae = ct(i, V);
    if (typeof j != "function")
      return ae;
    for (var X = 0, ne = ae.length; X < ne; X += 1)
      j(ae[X]);
  }
  function nt(i, j) {
    var V = ct(i, j);
    if (V.length !== 0) {
      if (V.length === 1)
        return V[0];
      throw new c("expected a single document in the stream, but found more");
    }
  }
  return qr.loadAll = at, qr.load = nt, qr;
}
var si = {}, ns;
function uf() {
  if (ns) return si;
  ns = 1;
  var e = _r(), c = Rr(), p = ca(), f = Object.prototype.toString, d = Object.prototype.hasOwnProperty, l = 65279, a = 9, u = 10, o = 13, s = 32, n = 33, t = 34, r = 35, h = 37, g = 38, v = 39, m = 42, w = 44, S = 45, b = 58, N = 61, P = 62, F = 63, O = 64, L = 91, R = 93, Y = 96, G = 123, $ = 124, H = 125, U = {};
  U[0] = "\\0", U[7] = "\\a", U[8] = "\\b", U[9] = "\\t", U[10] = "\\n", U[11] = "\\v", U[12] = "\\f", U[13] = "\\r", U[27] = "\\e", U[34] = '\\"', U[92] = "\\\\", U[133] = "\\N", U[160] = "\\_", U[8232] = "\\L", U[8233] = "\\P";
  var C = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], I = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function A(_, q) {
    var K, J, Q, oe, re, ue, ge;
    if (q === null) return {};
    for (K = {}, J = Object.keys(q), Q = 0, oe = J.length; Q < oe; Q += 1)
      re = J[Q], ue = String(q[re]), re.slice(0, 2) === "!!" && (re = "tag:yaml.org,2002:" + re.slice(2)), ge = _.compiledTypeMap.fallback[re], ge && d.call(ge.styleAliases, ue) && (ue = ge.styleAliases[ue]), K[re] = ue;
    return K;
  }
  function k(_) {
    var q, K, J;
    if (q = _.toString(16).toUpperCase(), _ <= 255)
      K = "x", J = 2;
    else if (_ <= 65535)
      K = "u", J = 4;
    else if (_ <= 4294967295)
      K = "U", J = 8;
    else
      throw new c("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + K + e.repeat("0", J - q.length) + q;
  }
  var M = 1, W = 2;
  function ie(_) {
    this.schema = _.schema || p, this.indent = Math.max(1, _.indent || 2), this.noArrayIndent = _.noArrayIndent || !1, this.skipInvalid = _.skipInvalid || !1, this.flowLevel = e.isNothing(_.flowLevel) ? -1 : _.flowLevel, this.styleMap = A(this.schema, _.styles || null), this.sortKeys = _.sortKeys || !1, this.lineWidth = _.lineWidth || 80, this.noRefs = _.noRefs || !1, this.noCompatMode = _.noCompatMode || !1, this.condenseFlow = _.condenseFlow || !1, this.quotingType = _.quotingType === '"' ? W : M, this.forceQuotes = _.forceQuotes || !1, this.replacer = typeof _.replacer == "function" ? _.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function te(_, q) {
    for (var K = e.repeat(" ", q), J = 0, Q = -1, oe = "", re, ue = _.length; J < ue; )
      Q = _.indexOf(`
`, J), Q === -1 ? (re = _.slice(J), J = ue) : (re = _.slice(J, Q + 1), J = Q + 1), re.length && re !== `
` && (oe += K), oe += re;
    return oe;
  }
  function he(_, q) {
    return `
` + e.repeat(" ", _.indent * q);
  }
  function pe(_, q) {
    var K, J, Q;
    for (K = 0, J = _.implicitTypes.length; K < J; K += 1)
      if (Q = _.implicitTypes[K], Q.resolve(q))
        return !0;
    return !1;
  }
  function z(_) {
    return _ === s || _ === a;
  }
  function me(_) {
    return 32 <= _ && _ <= 126 || 161 <= _ && _ <= 55295 && _ !== 8232 && _ !== 8233 || 57344 <= _ && _ <= 65533 && _ !== l || 65536 <= _ && _ <= 1114111;
  }
  function y(_) {
    return me(_) && _ !== l && _ !== o && _ !== u;
  }
  function E(_, q, K) {
    var J = y(_), Q = J && !z(_);
    return (
      // ns-plain-safe
      (K ? (
        // c = flow-in
        J
      ) : J && _ !== w && _ !== L && _ !== R && _ !== G && _ !== H) && _ !== r && !(q === b && !Q) || y(q) && !z(q) && _ === r || q === b && Q
    );
  }
  function B(_) {
    return me(_) && _ !== l && !z(_) && _ !== S && _ !== F && _ !== b && _ !== w && _ !== L && _ !== R && _ !== G && _ !== H && _ !== r && _ !== g && _ !== m && _ !== n && _ !== $ && _ !== N && _ !== P && _ !== v && _ !== t && _ !== h && _ !== O && _ !== Y;
  }
  function D(_) {
    return !z(_) && _ !== b;
  }
  function de(_, q) {
    var K = _.charCodeAt(q), J;
    return K >= 55296 && K <= 56319 && q + 1 < _.length && (J = _.charCodeAt(q + 1), J >= 56320 && J <= 57343) ? (K - 55296) * 1024 + J - 56320 + 65536 : K;
  }
  function Ee(_) {
    var q = /^\n* /;
    return q.test(_);
  }
  var ve = 1, Re = 2, we = 3, Ge = 4, Se = 5;
  function Be(_, q, K, J, Q, oe, re, ue) {
    var ge, _e = 0, Pe = null, De = !1, Ce = !1, Lt = J !== -1, Je = -1, _t = B(de(_, 0)) && D(de(_, _.length - 1));
    if (q || re)
      for (ge = 0; ge < _.length; _e >= 65536 ? ge += 2 : ge++) {
        if (_e = de(_, ge), !me(_e))
          return Se;
        _t = _t && E(_e, Pe, ue), Pe = _e;
      }
    else {
      for (ge = 0; ge < _.length; _e >= 65536 ? ge += 2 : ge++) {
        if (_e = de(_, ge), _e === u)
          De = !0, Lt && (Ce = Ce || // Foldable line = too long, and not more-indented.
          ge - Je - 1 > J && _[Je + 1] !== " ", Je = ge);
        else if (!me(_e))
          return Se;
        _t = _t && E(_e, Pe, ue), Pe = _e;
      }
      Ce = Ce || Lt && ge - Je - 1 > J && _[Je + 1] !== " ";
    }
    return !De && !Ce ? _t && !re && !Q(_) ? ve : oe === W ? Se : Re : K > 9 && Ee(_) ? Se : re ? oe === W ? Se : Re : Ce ? Ge : we;
  }
  function ct(_, q, K, J, Q) {
    _.dump = (function() {
      if (q.length === 0)
        return _.quotingType === W ? '""' : "''";
      if (!_.noCompatMode && (C.indexOf(q) !== -1 || I.test(q)))
        return _.quotingType === W ? '"' + q + '"' : "'" + q + "'";
      var oe = _.indent * Math.max(1, K), re = _.lineWidth === -1 ? -1 : Math.max(Math.min(_.lineWidth, 40), _.lineWidth - oe), ue = J || _.flowLevel > -1 && K >= _.flowLevel;
      function ge(_e) {
        return pe(_, _e);
      }
      switch (Be(
        q,
        ue,
        _.indent,
        re,
        ge,
        _.quotingType,
        _.forceQuotes && !J,
        Q
      )) {
        case ve:
          return q;
        case Re:
          return "'" + q.replace(/'/g, "''") + "'";
        case we:
          return "|" + at(q, _.indent) + nt(te(q, oe));
        case Ge:
          return ">" + at(q, _.indent) + nt(te(i(q, re), oe));
        case Se:
          return '"' + V(q) + '"';
        default:
          throw new c("impossible error: invalid scalar style");
      }
    })();
  }
  function at(_, q) {
    var K = Ee(_) ? String(q) : "", J = _[_.length - 1] === `
`, Q = J && (_[_.length - 2] === `
` || _ === `
`), oe = Q ? "+" : J ? "" : "-";
    return K + oe + `
`;
  }
  function nt(_) {
    return _[_.length - 1] === `
` ? _.slice(0, -1) : _;
  }
  function i(_, q) {
    for (var K = /(\n+)([^\n]*)/g, J = (function() {
      var _e = _.indexOf(`
`);
      return _e = _e !== -1 ? _e : _.length, K.lastIndex = _e, j(_.slice(0, _e), q);
    })(), Q = _[0] === `
` || _[0] === " ", oe, re; re = K.exec(_); ) {
      var ue = re[1], ge = re[2];
      oe = ge[0] === " ", J += ue + (!Q && !oe && ge !== "" ? `
` : "") + j(ge, q), Q = oe;
    }
    return J;
  }
  function j(_, q) {
    if (_ === "" || _[0] === " ") return _;
    for (var K = / [^ ]/g, J, Q = 0, oe, re = 0, ue = 0, ge = ""; J = K.exec(_); )
      ue = J.index, ue - Q > q && (oe = re > Q ? re : ue, ge += `
` + _.slice(Q, oe), Q = oe + 1), re = ue;
    return ge += `
`, _.length - Q > q && re > Q ? ge += _.slice(Q, re) + `
` + _.slice(re + 1) : ge += _.slice(Q), ge.slice(1);
  }
  function V(_) {
    for (var q = "", K = 0, J, Q = 0; Q < _.length; K >= 65536 ? Q += 2 : Q++)
      K = de(_, Q), J = U[K], !J && me(K) ? (q += _[Q], K >= 65536 && (q += _[Q + 1])) : q += J || k(K);
    return q;
  }
  function ae(_, q, K) {
    var J = "", Q = _.tag, oe, re, ue;
    for (oe = 0, re = K.length; oe < re; oe += 1)
      ue = K[oe], _.replacer && (ue = _.replacer.call(K, String(oe), ue)), (fe(_, q, ue, !1, !1) || typeof ue > "u" && fe(_, q, null, !1, !1)) && (J !== "" && (J += "," + (_.condenseFlow ? "" : " ")), J += _.dump);
    _.tag = Q, _.dump = "[" + J + "]";
  }
  function X(_, q, K, J) {
    var Q = "", oe = _.tag, re, ue, ge;
    for (re = 0, ue = K.length; re < ue; re += 1)
      ge = K[re], _.replacer && (ge = _.replacer.call(K, String(re), ge)), (fe(_, q + 1, ge, !0, !0, !1, !0) || typeof ge > "u" && fe(_, q + 1, null, !0, !0, !1, !0)) && ((!J || Q !== "") && (Q += he(_, q)), _.dump && u === _.dump.charCodeAt(0) ? Q += "-" : Q += "- ", Q += _.dump);
    _.tag = oe, _.dump = Q || "[]";
  }
  function ne(_, q, K) {
    var J = "", Q = _.tag, oe = Object.keys(K), re, ue, ge, _e, Pe;
    for (re = 0, ue = oe.length; re < ue; re += 1)
      Pe = "", J !== "" && (Pe += ", "), _.condenseFlow && (Pe += '"'), ge = oe[re], _e = K[ge], _.replacer && (_e = _.replacer.call(K, ge, _e)), fe(_, q, ge, !1, !1) && (_.dump.length > 1024 && (Pe += "? "), Pe += _.dump + (_.condenseFlow ? '"' : "") + ":" + (_.condenseFlow ? "" : " "), fe(_, q, _e, !1, !1) && (Pe += _.dump, J += Pe));
    _.tag = Q, _.dump = "{" + J + "}";
  }
  function ee(_, q, K, J) {
    var Q = "", oe = _.tag, re = Object.keys(K), ue, ge, _e, Pe, De, Ce;
    if (_.sortKeys === !0)
      re.sort();
    else if (typeof _.sortKeys == "function")
      re.sort(_.sortKeys);
    else if (_.sortKeys)
      throw new c("sortKeys must be a boolean or a function");
    for (ue = 0, ge = re.length; ue < ge; ue += 1)
      Ce = "", (!J || Q !== "") && (Ce += he(_, q)), _e = re[ue], Pe = K[_e], _.replacer && (Pe = _.replacer.call(K, _e, Pe)), fe(_, q + 1, _e, !0, !0, !0) && (De = _.tag !== null && _.tag !== "?" || _.dump && _.dump.length > 1024, De && (_.dump && u === _.dump.charCodeAt(0) ? Ce += "?" : Ce += "? "), Ce += _.dump, De && (Ce += he(_, q)), fe(_, q + 1, Pe, !0, De) && (_.dump && u === _.dump.charCodeAt(0) ? Ce += ":" : Ce += ": ", Ce += _.dump, Q += Ce));
    _.tag = oe, _.dump = Q || "{}";
  }
  function le(_, q, K) {
    var J, Q, oe, re, ue, ge;
    for (Q = K ? _.explicitTypes : _.implicitTypes, oe = 0, re = Q.length; oe < re; oe += 1)
      if (ue = Q[oe], (ue.instanceOf || ue.predicate) && (!ue.instanceOf || typeof q == "object" && q instanceof ue.instanceOf) && (!ue.predicate || ue.predicate(q))) {
        if (K ? ue.multi && ue.representName ? _.tag = ue.representName(q) : _.tag = ue.tag : _.tag = "?", ue.represent) {
          if (ge = _.styleMap[ue.tag] || ue.defaultStyle, f.call(ue.represent) === "[object Function]")
            J = ue.represent(q, ge);
          else if (d.call(ue.represent, ge))
            J = ue.represent[ge](q, ge);
          else
            throw new c("!<" + ue.tag + '> tag resolver accepts not "' + ge + '" style');
          _.dump = J;
        }
        return !0;
      }
    return !1;
  }
  function fe(_, q, K, J, Q, oe, re) {
    _.tag = null, _.dump = K, le(_, K, !1) || le(_, K, !0);
    var ue = f.call(_.dump), ge = J, _e;
    J && (J = _.flowLevel < 0 || _.flowLevel > q);
    var Pe = ue === "[object Object]" || ue === "[object Array]", De, Ce;
    if (Pe && (De = _.duplicates.indexOf(K), Ce = De !== -1), (_.tag !== null && _.tag !== "?" || Ce || _.indent !== 2 && q > 0) && (Q = !1), Ce && _.usedDuplicates[De])
      _.dump = "*ref_" + De;
    else {
      if (Pe && Ce && !_.usedDuplicates[De] && (_.usedDuplicates[De] = !0), ue === "[object Object]")
        J && Object.keys(_.dump).length !== 0 ? (ee(_, q, _.dump, Q), Ce && (_.dump = "&ref_" + De + _.dump)) : (ne(_, q, _.dump), Ce && (_.dump = "&ref_" + De + " " + _.dump));
      else if (ue === "[object Array]")
        J && _.dump.length !== 0 ? (_.noArrayIndent && !re && q > 0 ? X(_, q - 1, _.dump, Q) : X(_, q, _.dump, Q), Ce && (_.dump = "&ref_" + De + _.dump)) : (ae(_, q, _.dump), Ce && (_.dump = "&ref_" + De + " " + _.dump));
      else if (ue === "[object String]")
        _.tag !== "?" && ct(_, _.dump, q, oe, ge);
      else {
        if (ue === "[object Undefined]")
          return !1;
        if (_.skipInvalid) return !1;
        throw new c("unacceptable kind of an object to dump " + ue);
      }
      _.tag !== null && _.tag !== "?" && (_e = encodeURI(
        _.tag[0] === "!" ? _.tag.slice(1) : _.tag
      ).replace(/!/g, "%21"), _.tag[0] === "!" ? _e = "!" + _e : _e.slice(0, 18) === "tag:yaml.org,2002:" ? _e = "!!" + _e.slice(18) : _e = "!<" + _e + ">", _.dump = _e + " " + _.dump);
    }
    return !0;
  }
  function Te(_, q) {
    var K = [], J = [], Q, oe;
    for (be(_, K, J), Q = 0, oe = J.length; Q < oe; Q += 1)
      q.duplicates.push(K[J[Q]]);
    q.usedDuplicates = new Array(oe);
  }
  function be(_, q, K) {
    var J, Q, oe;
    if (_ !== null && typeof _ == "object")
      if (Q = q.indexOf(_), Q !== -1)
        K.indexOf(Q) === -1 && K.push(Q);
      else if (q.push(_), Array.isArray(_))
        for (Q = 0, oe = _.length; Q < oe; Q += 1)
          be(_[Q], q, K);
      else
        for (J = Object.keys(_), Q = 0, oe = J.length; Q < oe; Q += 1)
          be(_[J[Q]], q, K);
  }
  function ye(_, q) {
    q = q || {};
    var K = new ie(q);
    K.noRefs || Te(_, K);
    var J = _;
    return K.replacer && (J = K.replacer.call({ "": J }, "", J)), fe(K, 0, J, !0, !0) ? K.dump + `
` : "";
  }
  return si.dump = ye, si;
}
var is;
function fa() {
  if (is) return Me;
  is = 1;
  var e = lf(), c = uf();
  function p(f, d) {
    return function() {
      throw new Error("Function yaml." + f + " is removed in js-yaml 4. Use yaml." + d + " instead, which is now safe by default.");
    };
  }
  return Me.Type = je(), Me.Schema = Gl(), Me.FAILSAFE_SCHEMA = zl(), Me.JSON_SCHEMA = Zl(), Me.CORE_SCHEMA = eu(), Me.DEFAULT_SCHEMA = ca(), Me.load = e.load, Me.loadAll = e.loadAll, Me.dump = c.dump, Me.YAMLException = Rr(), Me.types = {
    binary: nu(),
    float: Ql(),
    map: Yl(),
    null: Xl(),
    pairs: au(),
    set: ou(),
    timestamp: tu(),
    bool: Kl(),
    int: Jl(),
    merge: ru(),
    omap: iu(),
    seq: Vl(),
    str: Wl()
  }, Me.safeLoad = p("safeLoad", "load"), Me.safeLoadAll = p("safeLoadAll", "loadAll"), Me.safeDump = p("safeDump", "dump"), Me;
}
var Jt = {}, as;
function cf() {
  if (as) return Jt;
  as = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.Lazy = void 0;
  class e {
    constructor(p) {
      this._value = null, this.creator = p;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const p = this.creator();
      return this.value = p, p;
    }
    set value(p) {
      this._value = p, this.creator = null;
    }
  }
  return Jt.Lazy = e, Jt;
}
var Mr = { exports: {} }, li, os;
function Yr() {
  if (os) return li;
  os = 1;
  const e = "2.0.0", c = 256, p = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, f = 16, d = c - 6;
  return li = {
    MAX_LENGTH: c,
    MAX_SAFE_COMPONENT_LENGTH: f,
    MAX_SAFE_BUILD_LENGTH: d,
    MAX_SAFE_INTEGER: p,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, li;
}
var ui, ss;
function zr() {
  return ss || (ss = 1, ui = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...c) => console.error("SEMVER", ...c) : () => {
  }), ui;
}
var ls;
function Ar() {
  return ls || (ls = 1, (function(e, c) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: p,
      MAX_SAFE_BUILD_LENGTH: f,
      MAX_LENGTH: d
    } = Yr(), l = zr();
    c = e.exports = {};
    const a = c.re = [], u = c.safeRe = [], o = c.src = [], s = c.safeSrc = [], n = c.t = {};
    let t = 0;
    const r = "[a-zA-Z0-9-]", h = [
      ["\\s", 1],
      ["\\d", d],
      [r, f]
    ], g = (m) => {
      for (const [w, S] of h)
        m = m.split(`${w}*`).join(`${w}{0,${S}}`).split(`${w}+`).join(`${w}{1,${S}}`);
      return m;
    }, v = (m, w, S) => {
      const b = g(w), N = t++;
      l(m, N, w), n[m] = N, o[N] = w, s[N] = b, a[N] = new RegExp(w, S ? "g" : void 0), u[N] = new RegExp(b, S ? "g" : void 0);
    };
    v("NUMERICIDENTIFIER", "0|[1-9]\\d*"), v("NUMERICIDENTIFIERLOOSE", "\\d+"), v("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${r}*`), v("MAINVERSION", `(${o[n.NUMERICIDENTIFIER]})\\.(${o[n.NUMERICIDENTIFIER]})\\.(${o[n.NUMERICIDENTIFIER]})`), v("MAINVERSIONLOOSE", `(${o[n.NUMERICIDENTIFIERLOOSE]})\\.(${o[n.NUMERICIDENTIFIERLOOSE]})\\.(${o[n.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASEIDENTIFIER", `(?:${o[n.NONNUMERICIDENTIFIER]}|${o[n.NUMERICIDENTIFIER]})`), v("PRERELEASEIDENTIFIERLOOSE", `(?:${o[n.NONNUMERICIDENTIFIER]}|${o[n.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASE", `(?:-(${o[n.PRERELEASEIDENTIFIER]}(?:\\.${o[n.PRERELEASEIDENTIFIER]})*))`), v("PRERELEASELOOSE", `(?:-?(${o[n.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[n.PRERELEASEIDENTIFIERLOOSE]})*))`), v("BUILDIDENTIFIER", `${r}+`), v("BUILD", `(?:\\+(${o[n.BUILDIDENTIFIER]}(?:\\.${o[n.BUILDIDENTIFIER]})*))`), v("FULLPLAIN", `v?${o[n.MAINVERSION]}${o[n.PRERELEASE]}?${o[n.BUILD]}?`), v("FULL", `^${o[n.FULLPLAIN]}$`), v("LOOSEPLAIN", `[v=\\s]*${o[n.MAINVERSIONLOOSE]}${o[n.PRERELEASELOOSE]}?${o[n.BUILD]}?`), v("LOOSE", `^${o[n.LOOSEPLAIN]}$`), v("GTLT", "((?:<|>)?=?)"), v("XRANGEIDENTIFIERLOOSE", `${o[n.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), v("XRANGEIDENTIFIER", `${o[n.NUMERICIDENTIFIER]}|x|X|\\*`), v("XRANGEPLAIN", `[v=\\s]*(${o[n.XRANGEIDENTIFIER]})(?:\\.(${o[n.XRANGEIDENTIFIER]})(?:\\.(${o[n.XRANGEIDENTIFIER]})(?:${o[n.PRERELEASE]})?${o[n.BUILD]}?)?)?`), v("XRANGEPLAINLOOSE", `[v=\\s]*(${o[n.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[n.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[n.XRANGEIDENTIFIERLOOSE]})(?:${o[n.PRERELEASELOOSE]})?${o[n.BUILD]}?)?)?`), v("XRANGE", `^${o[n.GTLT]}\\s*${o[n.XRANGEPLAIN]}$`), v("XRANGELOOSE", `^${o[n.GTLT]}\\s*${o[n.XRANGEPLAINLOOSE]}$`), v("COERCEPLAIN", `(^|[^\\d])(\\d{1,${p}})(?:\\.(\\d{1,${p}}))?(?:\\.(\\d{1,${p}}))?`), v("COERCE", `${o[n.COERCEPLAIN]}(?:$|[^\\d])`), v("COERCEFULL", o[n.COERCEPLAIN] + `(?:${o[n.PRERELEASE]})?(?:${o[n.BUILD]})?(?:$|[^\\d])`), v("COERCERTL", o[n.COERCE], !0), v("COERCERTLFULL", o[n.COERCEFULL], !0), v("LONETILDE", "(?:~>?)"), v("TILDETRIM", `(\\s*)${o[n.LONETILDE]}\\s+`, !0), c.tildeTrimReplace = "$1~", v("TILDE", `^${o[n.LONETILDE]}${o[n.XRANGEPLAIN]}$`), v("TILDELOOSE", `^${o[n.LONETILDE]}${o[n.XRANGEPLAINLOOSE]}$`), v("LONECARET", "(?:\\^)"), v("CARETTRIM", `(\\s*)${o[n.LONECARET]}\\s+`, !0), c.caretTrimReplace = "$1^", v("CARET", `^${o[n.LONECARET]}${o[n.XRANGEPLAIN]}$`), v("CARETLOOSE", `^${o[n.LONECARET]}${o[n.XRANGEPLAINLOOSE]}$`), v("COMPARATORLOOSE", `^${o[n.GTLT]}\\s*(${o[n.LOOSEPLAIN]})$|^$`), v("COMPARATOR", `^${o[n.GTLT]}\\s*(${o[n.FULLPLAIN]})$|^$`), v("COMPARATORTRIM", `(\\s*)${o[n.GTLT]}\\s*(${o[n.LOOSEPLAIN]}|${o[n.XRANGEPLAIN]})`, !0), c.comparatorTrimReplace = "$1$2$3", v("HYPHENRANGE", `^\\s*(${o[n.XRANGEPLAIN]})\\s+-\\s+(${o[n.XRANGEPLAIN]})\\s*$`), v("HYPHENRANGELOOSE", `^\\s*(${o[n.XRANGEPLAINLOOSE]})\\s+-\\s+(${o[n.XRANGEPLAINLOOSE]})\\s*$`), v("STAR", "(<|>)?=?\\s*\\*"), v("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), v("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Mr, Mr.exports)), Mr.exports;
}
var ci, us;
function da() {
  if (us) return ci;
  us = 1;
  const e = Object.freeze({ loose: !0 }), c = Object.freeze({});
  return ci = (f) => f ? typeof f != "object" ? e : f : c, ci;
}
var fi, cs;
function su() {
  if (cs) return fi;
  cs = 1;
  const e = /^[0-9]+$/, c = (f, d) => {
    if (typeof f == "number" && typeof d == "number")
      return f === d ? 0 : f < d ? -1 : 1;
    const l = e.test(f), a = e.test(d);
    return l && a && (f = +f, d = +d), f === d ? 0 : l && !a ? -1 : a && !l ? 1 : f < d ? -1 : 1;
  };
  return fi = {
    compareIdentifiers: c,
    rcompareIdentifiers: (f, d) => c(d, f)
  }, fi;
}
var di, fs;
function He() {
  if (fs) return di;
  fs = 1;
  const e = zr(), { MAX_LENGTH: c, MAX_SAFE_INTEGER: p } = Yr(), { safeRe: f, t: d } = Ar(), l = da(), { compareIdentifiers: a } = su();
  class u {
    constructor(s, n) {
      if (n = l(n), s instanceof u) {
        if (s.loose === !!n.loose && s.includePrerelease === !!n.includePrerelease)
          return s;
        s = s.version;
      } else if (typeof s != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof s}".`);
      if (s.length > c)
        throw new TypeError(
          `version is longer than ${c} characters`
        );
      e("SemVer", s, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
      const t = s.trim().match(n.loose ? f[d.LOOSE] : f[d.FULL]);
      if (!t)
        throw new TypeError(`Invalid Version: ${s}`);
      if (this.raw = s, this.major = +t[1], this.minor = +t[2], this.patch = +t[3], this.major > p || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > p || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > p || this.patch < 0)
        throw new TypeError("Invalid patch version");
      t[4] ? this.prerelease = t[4].split(".").map((r) => {
        if (/^[0-9]+$/.test(r)) {
          const h = +r;
          if (h >= 0 && h < p)
            return h;
        }
        return r;
      }) : this.prerelease = [], this.build = t[5] ? t[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(s) {
      if (e("SemVer.compare", this.version, this.options, s), !(s instanceof u)) {
        if (typeof s == "string" && s === this.version)
          return 0;
        s = new u(s, this.options);
      }
      return s.version === this.version ? 0 : this.compareMain(s) || this.comparePre(s);
    }
    compareMain(s) {
      return s instanceof u || (s = new u(s, this.options)), this.major < s.major ? -1 : this.major > s.major ? 1 : this.minor < s.minor ? -1 : this.minor > s.minor ? 1 : this.patch < s.patch ? -1 : this.patch > s.patch ? 1 : 0;
    }
    comparePre(s) {
      if (s instanceof u || (s = new u(s, this.options)), this.prerelease.length && !s.prerelease.length)
        return -1;
      if (!this.prerelease.length && s.prerelease.length)
        return 1;
      if (!this.prerelease.length && !s.prerelease.length)
        return 0;
      let n = 0;
      do {
        const t = this.prerelease[n], r = s.prerelease[n];
        if (e("prerelease compare", n, t, r), t === void 0 && r === void 0)
          return 0;
        if (r === void 0)
          return 1;
        if (t === void 0)
          return -1;
        if (t === r)
          continue;
        return a(t, r);
      } while (++n);
    }
    compareBuild(s) {
      s instanceof u || (s = new u(s, this.options));
      let n = 0;
      do {
        const t = this.build[n], r = s.build[n];
        if (e("build compare", n, t, r), t === void 0 && r === void 0)
          return 0;
        if (r === void 0)
          return 1;
        if (t === void 0)
          return -1;
        if (t === r)
          continue;
        return a(t, r);
      } while (++n);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(s, n, t) {
      if (s.startsWith("pre")) {
        if (!n && t === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (n) {
          const r = `-${n}`.match(this.options.loose ? f[d.PRERELEASELOOSE] : f[d.PRERELEASE]);
          if (!r || r[1] !== n)
            throw new Error(`invalid identifier: ${n}`);
        }
      }
      switch (s) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, t);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, t);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", n, t), this.inc("pre", n, t);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", n, t), this.inc("pre", n, t);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const r = Number(t) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [r];
          else {
            let h = this.prerelease.length;
            for (; --h >= 0; )
              typeof this.prerelease[h] == "number" && (this.prerelease[h]++, h = -2);
            if (h === -1) {
              if (n === this.prerelease.join(".") && t === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(r);
            }
          }
          if (n) {
            let h = [n, r];
            t === !1 && (h = [n]), a(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = h) : this.prerelease = h;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${s}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return di = u, di;
}
var hi, ds;
function Wt() {
  if (ds) return hi;
  ds = 1;
  const e = He();
  return hi = (p, f, d = !1) => {
    if (p instanceof e)
      return p;
    try {
      return new e(p, f);
    } catch (l) {
      if (!d)
        return null;
      throw l;
    }
  }, hi;
}
var pi, hs;
function ff() {
  if (hs) return pi;
  hs = 1;
  const e = Wt();
  return pi = (p, f) => {
    const d = e(p, f);
    return d ? d.version : null;
  }, pi;
}
var mi, ps;
function df() {
  if (ps) return mi;
  ps = 1;
  const e = Wt();
  return mi = (p, f) => {
    const d = e(p.trim().replace(/^[=v]+/, ""), f);
    return d ? d.version : null;
  }, mi;
}
var gi, ms;
function hf() {
  if (ms) return gi;
  ms = 1;
  const e = He();
  return gi = (p, f, d, l, a) => {
    typeof d == "string" && (a = l, l = d, d = void 0);
    try {
      return new e(
        p instanceof e ? p.version : p,
        d
      ).inc(f, l, a).version;
    } catch {
      return null;
    }
  }, gi;
}
var Ei, gs;
function pf() {
  if (gs) return Ei;
  gs = 1;
  const e = Wt();
  return Ei = (p, f) => {
    const d = e(p, null, !0), l = e(f, null, !0), a = d.compare(l);
    if (a === 0)
      return null;
    const u = a > 0, o = u ? d : l, s = u ? l : d, n = !!o.prerelease.length;
    if (!!s.prerelease.length && !n) {
      if (!s.patch && !s.minor)
        return "major";
      if (s.compareMain(o) === 0)
        return s.minor && !s.patch ? "minor" : "patch";
    }
    const r = n ? "pre" : "";
    return d.major !== l.major ? r + "major" : d.minor !== l.minor ? r + "minor" : d.patch !== l.patch ? r + "patch" : "prerelease";
  }, Ei;
}
var vi, Es;
function mf() {
  if (Es) return vi;
  Es = 1;
  const e = He();
  return vi = (p, f) => new e(p, f).major, vi;
}
var yi, vs;
function gf() {
  if (vs) return yi;
  vs = 1;
  const e = He();
  return yi = (p, f) => new e(p, f).minor, yi;
}
var wi, ys;
function Ef() {
  if (ys) return wi;
  ys = 1;
  const e = He();
  return wi = (p, f) => new e(p, f).patch, wi;
}
var _i, ws;
function vf() {
  if (ws) return _i;
  ws = 1;
  const e = Wt();
  return _i = (p, f) => {
    const d = e(p, f);
    return d && d.prerelease.length ? d.prerelease : null;
  }, _i;
}
var Ri, _s;
function tt() {
  if (_s) return Ri;
  _s = 1;
  const e = He();
  return Ri = (p, f, d) => new e(p, d).compare(new e(f, d)), Ri;
}
var Ai, Rs;
function yf() {
  if (Rs) return Ai;
  Rs = 1;
  const e = tt();
  return Ai = (p, f, d) => e(f, p, d), Ai;
}
var Si, As;
function wf() {
  if (As) return Si;
  As = 1;
  const e = tt();
  return Si = (p, f) => e(p, f, !0), Si;
}
var Ti, Ss;
function ha() {
  if (Ss) return Ti;
  Ss = 1;
  const e = He();
  return Ti = (p, f, d) => {
    const l = new e(p, d), a = new e(f, d);
    return l.compare(a) || l.compareBuild(a);
  }, Ti;
}
var bi, Ts;
function _f() {
  if (Ts) return bi;
  Ts = 1;
  const e = ha();
  return bi = (p, f) => p.sort((d, l) => e(d, l, f)), bi;
}
var Ci, bs;
function Rf() {
  if (bs) return Ci;
  bs = 1;
  const e = ha();
  return Ci = (p, f) => p.sort((d, l) => e(l, d, f)), Ci;
}
var Pi, Cs;
function Xr() {
  if (Cs) return Pi;
  Cs = 1;
  const e = tt();
  return Pi = (p, f, d) => e(p, f, d) > 0, Pi;
}
var Oi, Ps;
function pa() {
  if (Ps) return Oi;
  Ps = 1;
  const e = tt();
  return Oi = (p, f, d) => e(p, f, d) < 0, Oi;
}
var Ii, Os;
function lu() {
  if (Os) return Ii;
  Os = 1;
  const e = tt();
  return Ii = (p, f, d) => e(p, f, d) === 0, Ii;
}
var Ni, Is;
function uu() {
  if (Is) return Ni;
  Is = 1;
  const e = tt();
  return Ni = (p, f, d) => e(p, f, d) !== 0, Ni;
}
var Di, Ns;
function ma() {
  if (Ns) return Di;
  Ns = 1;
  const e = tt();
  return Di = (p, f, d) => e(p, f, d) >= 0, Di;
}
var Fi, Ds;
function ga() {
  if (Ds) return Fi;
  Ds = 1;
  const e = tt();
  return Fi = (p, f, d) => e(p, f, d) <= 0, Fi;
}
var Li, Fs;
function cu() {
  if (Fs) return Li;
  Fs = 1;
  const e = lu(), c = uu(), p = Xr(), f = ma(), d = pa(), l = ga();
  return Li = (u, o, s, n) => {
    switch (o) {
      case "===":
        return typeof u == "object" && (u = u.version), typeof s == "object" && (s = s.version), u === s;
      case "!==":
        return typeof u == "object" && (u = u.version), typeof s == "object" && (s = s.version), u !== s;
      case "":
      case "=":
      case "==":
        return e(u, s, n);
      case "!=":
        return c(u, s, n);
      case ">":
        return p(u, s, n);
      case ">=":
        return f(u, s, n);
      case "<":
        return d(u, s, n);
      case "<=":
        return l(u, s, n);
      default:
        throw new TypeError(`Invalid operator: ${o}`);
    }
  }, Li;
}
var Ui, Ls;
function Af() {
  if (Ls) return Ui;
  Ls = 1;
  const e = He(), c = Wt(), { safeRe: p, t: f } = Ar();
  return Ui = (l, a) => {
    if (l instanceof e)
      return l;
    if (typeof l == "number" && (l = String(l)), typeof l != "string")
      return null;
    a = a || {};
    let u = null;
    if (!a.rtl)
      u = l.match(a.includePrerelease ? p[f.COERCEFULL] : p[f.COERCE]);
    else {
      const h = a.includePrerelease ? p[f.COERCERTLFULL] : p[f.COERCERTL];
      let g;
      for (; (g = h.exec(l)) && (!u || u.index + u[0].length !== l.length); )
        (!u || g.index + g[0].length !== u.index + u[0].length) && (u = g), h.lastIndex = g.index + g[1].length + g[2].length;
      h.lastIndex = -1;
    }
    if (u === null)
      return null;
    const o = u[2], s = u[3] || "0", n = u[4] || "0", t = a.includePrerelease && u[5] ? `-${u[5]}` : "", r = a.includePrerelease && u[6] ? `+${u[6]}` : "";
    return c(`${o}.${s}.${n}${t}${r}`, a);
  }, Ui;
}
var xi, Us;
function Sf() {
  if (Us) return xi;
  Us = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(p) {
      const f = this.map.get(p);
      if (f !== void 0)
        return this.map.delete(p), this.map.set(p, f), f;
    }
    delete(p) {
      return this.map.delete(p);
    }
    set(p, f) {
      if (!this.delete(p) && f !== void 0) {
        if (this.map.size >= this.max) {
          const l = this.map.keys().next().value;
          this.delete(l);
        }
        this.map.set(p, f);
      }
      return this;
    }
  }
  return xi = e, xi;
}
var ki, xs;
function rt() {
  if (xs) return ki;
  xs = 1;
  const e = /\s+/g;
  class c {
    constructor(C, I) {
      if (I = d(I), C instanceof c)
        return C.loose === !!I.loose && C.includePrerelease === !!I.includePrerelease ? C : new c(C.raw, I);
      if (C instanceof l)
        return this.raw = C.value, this.set = [[C]], this.formatted = void 0, this;
      if (this.options = I, this.loose = !!I.loose, this.includePrerelease = !!I.includePrerelease, this.raw = C.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((k) => !v(k[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const k of this.set)
            if (k.length === 1 && m(k[0])) {
              this.set = [k];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let C = 0; C < this.set.length; C++) {
          C > 0 && (this.formatted += "||");
          const I = this.set[C];
          for (let A = 0; A < I.length; A++)
            A > 0 && (this.formatted += " "), this.formatted += I[A].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(C) {
      const A = ((this.options.includePrerelease && h) | (this.options.loose && g)) + ":" + C, k = f.get(A);
      if (k)
        return k;
      const M = this.options.loose, W = M ? o[s.HYPHENRANGELOOSE] : o[s.HYPHENRANGE];
      C = C.replace(W, $(this.options.includePrerelease)), a("hyphen replace", C), C = C.replace(o[s.COMPARATORTRIM], n), a("comparator trim", C), C = C.replace(o[s.TILDETRIM], t), a("tilde trim", C), C = C.replace(o[s.CARETTRIM], r), a("caret trim", C);
      let ie = C.split(" ").map((z) => S(z, this.options)).join(" ").split(/\s+/).map((z) => G(z, this.options));
      M && (ie = ie.filter((z) => (a("loose invalid filter", z, this.options), !!z.match(o[s.COMPARATORLOOSE])))), a("range list", ie);
      const te = /* @__PURE__ */ new Map(), he = ie.map((z) => new l(z, this.options));
      for (const z of he) {
        if (v(z))
          return [z];
        te.set(z.value, z);
      }
      te.size > 1 && te.has("") && te.delete("");
      const pe = [...te.values()];
      return f.set(A, pe), pe;
    }
    intersects(C, I) {
      if (!(C instanceof c))
        throw new TypeError("a Range is required");
      return this.set.some((A) => w(A, I) && C.set.some((k) => w(k, I) && A.every((M) => k.every((W) => M.intersects(W, I)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(C) {
      if (!C)
        return !1;
      if (typeof C == "string")
        try {
          C = new u(C, this.options);
        } catch {
          return !1;
        }
      for (let I = 0; I < this.set.length; I++)
        if (H(this.set[I], C, this.options))
          return !0;
      return !1;
    }
  }
  ki = c;
  const p = Sf(), f = new p(), d = da(), l = Kr(), a = zr(), u = He(), {
    safeRe: o,
    t: s,
    comparatorTrimReplace: n,
    tildeTrimReplace: t,
    caretTrimReplace: r
  } = Ar(), { FLAG_INCLUDE_PRERELEASE: h, FLAG_LOOSE: g } = Yr(), v = (U) => U.value === "<0.0.0-0", m = (U) => U.value === "", w = (U, C) => {
    let I = !0;
    const A = U.slice();
    let k = A.pop();
    for (; I && A.length; )
      I = A.every((M) => k.intersects(M, C)), k = A.pop();
    return I;
  }, S = (U, C) => (U = U.replace(o[s.BUILD], ""), a("comp", U, C), U = F(U, C), a("caret", U), U = N(U, C), a("tildes", U), U = L(U, C), a("xrange", U), U = Y(U, C), a("stars", U), U), b = (U) => !U || U.toLowerCase() === "x" || U === "*", N = (U, C) => U.trim().split(/\s+/).map((I) => P(I, C)).join(" "), P = (U, C) => {
    const I = C.loose ? o[s.TILDELOOSE] : o[s.TILDE];
    return U.replace(I, (A, k, M, W, ie) => {
      a("tilde", U, A, k, M, W, ie);
      let te;
      return b(k) ? te = "" : b(M) ? te = `>=${k}.0.0 <${+k + 1}.0.0-0` : b(W) ? te = `>=${k}.${M}.0 <${k}.${+M + 1}.0-0` : ie ? (a("replaceTilde pr", ie), te = `>=${k}.${M}.${W}-${ie} <${k}.${+M + 1}.0-0`) : te = `>=${k}.${M}.${W} <${k}.${+M + 1}.0-0`, a("tilde return", te), te;
    });
  }, F = (U, C) => U.trim().split(/\s+/).map((I) => O(I, C)).join(" "), O = (U, C) => {
    a("caret", U, C);
    const I = C.loose ? o[s.CARETLOOSE] : o[s.CARET], A = C.includePrerelease ? "-0" : "";
    return U.replace(I, (k, M, W, ie, te) => {
      a("caret", U, k, M, W, ie, te);
      let he;
      return b(M) ? he = "" : b(W) ? he = `>=${M}.0.0${A} <${+M + 1}.0.0-0` : b(ie) ? M === "0" ? he = `>=${M}.${W}.0${A} <${M}.${+W + 1}.0-0` : he = `>=${M}.${W}.0${A} <${+M + 1}.0.0-0` : te ? (a("replaceCaret pr", te), M === "0" ? W === "0" ? he = `>=${M}.${W}.${ie}-${te} <${M}.${W}.${+ie + 1}-0` : he = `>=${M}.${W}.${ie}-${te} <${M}.${+W + 1}.0-0` : he = `>=${M}.${W}.${ie}-${te} <${+M + 1}.0.0-0`) : (a("no pr"), M === "0" ? W === "0" ? he = `>=${M}.${W}.${ie}${A} <${M}.${W}.${+ie + 1}-0` : he = `>=${M}.${W}.${ie}${A} <${M}.${+W + 1}.0-0` : he = `>=${M}.${W}.${ie} <${+M + 1}.0.0-0`), a("caret return", he), he;
    });
  }, L = (U, C) => (a("replaceXRanges", U, C), U.split(/\s+/).map((I) => R(I, C)).join(" ")), R = (U, C) => {
    U = U.trim();
    const I = C.loose ? o[s.XRANGELOOSE] : o[s.XRANGE];
    return U.replace(I, (A, k, M, W, ie, te) => {
      a("xRange", U, A, k, M, W, ie, te);
      const he = b(M), pe = he || b(W), z = pe || b(ie), me = z;
      return k === "=" && me && (k = ""), te = C.includePrerelease ? "-0" : "", he ? k === ">" || k === "<" ? A = "<0.0.0-0" : A = "*" : k && me ? (pe && (W = 0), ie = 0, k === ">" ? (k = ">=", pe ? (M = +M + 1, W = 0, ie = 0) : (W = +W + 1, ie = 0)) : k === "<=" && (k = "<", pe ? M = +M + 1 : W = +W + 1), k === "<" && (te = "-0"), A = `${k + M}.${W}.${ie}${te}`) : pe ? A = `>=${M}.0.0${te} <${+M + 1}.0.0-0` : z && (A = `>=${M}.${W}.0${te} <${M}.${+W + 1}.0-0`), a("xRange return", A), A;
    });
  }, Y = (U, C) => (a("replaceStars", U, C), U.trim().replace(o[s.STAR], "")), G = (U, C) => (a("replaceGTE0", U, C), U.trim().replace(o[C.includePrerelease ? s.GTE0PRE : s.GTE0], "")), $ = (U) => (C, I, A, k, M, W, ie, te, he, pe, z, me) => (b(A) ? I = "" : b(k) ? I = `>=${A}.0.0${U ? "-0" : ""}` : b(M) ? I = `>=${A}.${k}.0${U ? "-0" : ""}` : W ? I = `>=${I}` : I = `>=${I}${U ? "-0" : ""}`, b(he) ? te = "" : b(pe) ? te = `<${+he + 1}.0.0-0` : b(z) ? te = `<${he}.${+pe + 1}.0-0` : me ? te = `<=${he}.${pe}.${z}-${me}` : U ? te = `<${he}.${pe}.${+z + 1}-0` : te = `<=${te}`, `${I} ${te}`.trim()), H = (U, C, I) => {
    for (let A = 0; A < U.length; A++)
      if (!U[A].test(C))
        return !1;
    if (C.prerelease.length && !I.includePrerelease) {
      for (let A = 0; A < U.length; A++)
        if (a(U[A].semver), U[A].semver !== l.ANY && U[A].semver.prerelease.length > 0) {
          const k = U[A].semver;
          if (k.major === C.major && k.minor === C.minor && k.patch === C.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return ki;
}
var $i, ks;
function Kr() {
  if (ks) return $i;
  ks = 1;
  const e = /* @__PURE__ */ Symbol("SemVer ANY");
  class c {
    static get ANY() {
      return e;
    }
    constructor(n, t) {
      if (t = p(t), n instanceof c) {
        if (n.loose === !!t.loose)
          return n;
        n = n.value;
      }
      n = n.trim().split(/\s+/).join(" "), a("comparator", n, t), this.options = t, this.loose = !!t.loose, this.parse(n), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(n) {
      const t = this.options.loose ? f[d.COMPARATORLOOSE] : f[d.COMPARATOR], r = n.match(t);
      if (!r)
        throw new TypeError(`Invalid comparator: ${n}`);
      this.operator = r[1] !== void 0 ? r[1] : "", this.operator === "=" && (this.operator = ""), r[2] ? this.semver = new u(r[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(n) {
      if (a("Comparator.test", n, this.options.loose), this.semver === e || n === e)
        return !0;
      if (typeof n == "string")
        try {
          n = new u(n, this.options);
        } catch {
          return !1;
        }
      return l(n, this.operator, this.semver, this.options);
    }
    intersects(n, t) {
      if (!(n instanceof c))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new o(n.value, t).test(this.value) : n.operator === "" ? n.value === "" ? !0 : new o(this.value, t).test(n.semver) : (t = p(t), t.includePrerelease && (this.value === "<0.0.0-0" || n.value === "<0.0.0-0") || !t.includePrerelease && (this.value.startsWith("<0.0.0") || n.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && n.operator.startsWith(">") || this.operator.startsWith("<") && n.operator.startsWith("<") || this.semver.version === n.semver.version && this.operator.includes("=") && n.operator.includes("=") || l(this.semver, "<", n.semver, t) && this.operator.startsWith(">") && n.operator.startsWith("<") || l(this.semver, ">", n.semver, t) && this.operator.startsWith("<") && n.operator.startsWith(">")));
    }
  }
  $i = c;
  const p = da(), { safeRe: f, t: d } = Ar(), l = cu(), a = zr(), u = He(), o = rt();
  return $i;
}
var qi, $s;
function Jr() {
  if ($s) return qi;
  $s = 1;
  const e = rt();
  return qi = (p, f, d) => {
    try {
      f = new e(f, d);
    } catch {
      return !1;
    }
    return f.test(p);
  }, qi;
}
var Mi, qs;
function Tf() {
  if (qs) return Mi;
  qs = 1;
  const e = rt();
  return Mi = (p, f) => new e(p, f).set.map((d) => d.map((l) => l.value).join(" ").trim().split(" ")), Mi;
}
var Bi, Ms;
function bf() {
  if (Ms) return Bi;
  Ms = 1;
  const e = He(), c = rt();
  return Bi = (f, d, l) => {
    let a = null, u = null, o = null;
    try {
      o = new c(d, l);
    } catch {
      return null;
    }
    return f.forEach((s) => {
      o.test(s) && (!a || u.compare(s) === -1) && (a = s, u = new e(a, l));
    }), a;
  }, Bi;
}
var ji, Bs;
function Cf() {
  if (Bs) return ji;
  Bs = 1;
  const e = He(), c = rt();
  return ji = (f, d, l) => {
    let a = null, u = null, o = null;
    try {
      o = new c(d, l);
    } catch {
      return null;
    }
    return f.forEach((s) => {
      o.test(s) && (!a || u.compare(s) === 1) && (a = s, u = new e(a, l));
    }), a;
  }, ji;
}
var Hi, js;
function Pf() {
  if (js) return Hi;
  js = 1;
  const e = He(), c = rt(), p = Xr();
  return Hi = (d, l) => {
    d = new c(d, l);
    let a = new e("0.0.0");
    if (d.test(a) || (a = new e("0.0.0-0"), d.test(a)))
      return a;
    a = null;
    for (let u = 0; u < d.set.length; ++u) {
      const o = d.set[u];
      let s = null;
      o.forEach((n) => {
        const t = new e(n.semver.version);
        switch (n.operator) {
          case ">":
            t.prerelease.length === 0 ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
          /* fallthrough */
          case "":
          case ">=":
            (!s || p(t, s)) && (s = t);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${n.operator}`);
        }
      }), s && (!a || p(a, s)) && (a = s);
    }
    return a && d.test(a) ? a : null;
  }, Hi;
}
var Gi, Hs;
function Of() {
  if (Hs) return Gi;
  Hs = 1;
  const e = rt();
  return Gi = (p, f) => {
    try {
      return new e(p, f).range || "*";
    } catch {
      return null;
    }
  }, Gi;
}
var Wi, Gs;
function Ea() {
  if (Gs) return Wi;
  Gs = 1;
  const e = He(), c = Kr(), { ANY: p } = c, f = rt(), d = Jr(), l = Xr(), a = pa(), u = ga(), o = ma();
  return Wi = (n, t, r, h) => {
    n = new e(n, h), t = new f(t, h);
    let g, v, m, w, S;
    switch (r) {
      case ">":
        g = l, v = u, m = a, w = ">", S = ">=";
        break;
      case "<":
        g = a, v = o, m = l, w = "<", S = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (d(n, t, h))
      return !1;
    for (let b = 0; b < t.set.length; ++b) {
      const N = t.set[b];
      let P = null, F = null;
      if (N.forEach((O) => {
        O.semver === p && (O = new c(">=0.0.0")), P = P || O, F = F || O, g(O.semver, P.semver, h) ? P = O : m(O.semver, F.semver, h) && (F = O);
      }), P.operator === w || P.operator === S || (!F.operator || F.operator === w) && v(n, F.semver))
        return !1;
      if (F.operator === S && m(n, F.semver))
        return !1;
    }
    return !0;
  }, Wi;
}
var Vi, Ws;
function If() {
  if (Ws) return Vi;
  Ws = 1;
  const e = Ea();
  return Vi = (p, f, d) => e(p, f, ">", d), Vi;
}
var Yi, Vs;
function Nf() {
  if (Vs) return Yi;
  Vs = 1;
  const e = Ea();
  return Yi = (p, f, d) => e(p, f, "<", d), Yi;
}
var zi, Ys;
function Df() {
  if (Ys) return zi;
  Ys = 1;
  const e = rt();
  return zi = (p, f, d) => (p = new e(p, d), f = new e(f, d), p.intersects(f, d)), zi;
}
var Xi, zs;
function Ff() {
  if (zs) return Xi;
  zs = 1;
  const e = Jr(), c = tt();
  return Xi = (p, f, d) => {
    const l = [];
    let a = null, u = null;
    const o = p.sort((r, h) => c(r, h, d));
    for (const r of o)
      e(r, f, d) ? (u = r, a || (a = r)) : (u && l.push([a, u]), u = null, a = null);
    a && l.push([a, null]);
    const s = [];
    for (const [r, h] of l)
      r === h ? s.push(r) : !h && r === o[0] ? s.push("*") : h ? r === o[0] ? s.push(`<=${h}`) : s.push(`${r} - ${h}`) : s.push(`>=${r}`);
    const n = s.join(" || "), t = typeof f.raw == "string" ? f.raw : String(f);
    return n.length < t.length ? n : f;
  }, Xi;
}
var Ki, Xs;
function Lf() {
  if (Xs) return Ki;
  Xs = 1;
  const e = rt(), c = Kr(), { ANY: p } = c, f = Jr(), d = tt(), l = (t, r, h = {}) => {
    if (t === r)
      return !0;
    t = new e(t, h), r = new e(r, h);
    let g = !1;
    e: for (const v of t.set) {
      for (const m of r.set) {
        const w = o(v, m, h);
        if (g = g || w !== null, w)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, a = [new c(">=0.0.0-0")], u = [new c(">=0.0.0")], o = (t, r, h) => {
    if (t === r)
      return !0;
    if (t.length === 1 && t[0].semver === p) {
      if (r.length === 1 && r[0].semver === p)
        return !0;
      h.includePrerelease ? t = a : t = u;
    }
    if (r.length === 1 && r[0].semver === p) {
      if (h.includePrerelease)
        return !0;
      r = u;
    }
    const g = /* @__PURE__ */ new Set();
    let v, m;
    for (const L of t)
      L.operator === ">" || L.operator === ">=" ? v = s(v, L, h) : L.operator === "<" || L.operator === "<=" ? m = n(m, L, h) : g.add(L.semver);
    if (g.size > 1)
      return null;
    let w;
    if (v && m) {
      if (w = d(v.semver, m.semver, h), w > 0)
        return null;
      if (w === 0 && (v.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const L of g) {
      if (v && !f(L, String(v), h) || m && !f(L, String(m), h))
        return null;
      for (const R of r)
        if (!f(L, String(R), h))
          return !1;
      return !0;
    }
    let S, b, N, P, F = m && !h.includePrerelease && m.semver.prerelease.length ? m.semver : !1, O = v && !h.includePrerelease && v.semver.prerelease.length ? v.semver : !1;
    F && F.prerelease.length === 1 && m.operator === "<" && F.prerelease[0] === 0 && (F = !1);
    for (const L of r) {
      if (P = P || L.operator === ">" || L.operator === ">=", N = N || L.operator === "<" || L.operator === "<=", v) {
        if (O && L.semver.prerelease && L.semver.prerelease.length && L.semver.major === O.major && L.semver.minor === O.minor && L.semver.patch === O.patch && (O = !1), L.operator === ">" || L.operator === ">=") {
          if (S = s(v, L, h), S === L && S !== v)
            return !1;
        } else if (v.operator === ">=" && !f(v.semver, String(L), h))
          return !1;
      }
      if (m) {
        if (F && L.semver.prerelease && L.semver.prerelease.length && L.semver.major === F.major && L.semver.minor === F.minor && L.semver.patch === F.patch && (F = !1), L.operator === "<" || L.operator === "<=") {
          if (b = n(m, L, h), b === L && b !== m)
            return !1;
        } else if (m.operator === "<=" && !f(m.semver, String(L), h))
          return !1;
      }
      if (!L.operator && (m || v) && w !== 0)
        return !1;
    }
    return !(v && N && !m && w !== 0 || m && P && !v && w !== 0 || O || F);
  }, s = (t, r, h) => {
    if (!t)
      return r;
    const g = d(t.semver, r.semver, h);
    return g > 0 ? t : g < 0 || r.operator === ">" && t.operator === ">=" ? r : t;
  }, n = (t, r, h) => {
    if (!t)
      return r;
    const g = d(t.semver, r.semver, h);
    return g < 0 ? t : g > 0 || r.operator === "<" && t.operator === "<=" ? r : t;
  };
  return Ki = l, Ki;
}
var Ji, Ks;
function fu() {
  if (Ks) return Ji;
  Ks = 1;
  const e = Ar(), c = Yr(), p = He(), f = su(), d = Wt(), l = ff(), a = df(), u = hf(), o = pf(), s = mf(), n = gf(), t = Ef(), r = vf(), h = tt(), g = yf(), v = wf(), m = ha(), w = _f(), S = Rf(), b = Xr(), N = pa(), P = lu(), F = uu(), O = ma(), L = ga(), R = cu(), Y = Af(), G = Kr(), $ = rt(), H = Jr(), U = Tf(), C = bf(), I = Cf(), A = Pf(), k = Of(), M = Ea(), W = If(), ie = Nf(), te = Df(), he = Ff(), pe = Lf();
  return Ji = {
    parse: d,
    valid: l,
    clean: a,
    inc: u,
    diff: o,
    major: s,
    minor: n,
    patch: t,
    prerelease: r,
    compare: h,
    rcompare: g,
    compareLoose: v,
    compareBuild: m,
    sort: w,
    rsort: S,
    gt: b,
    lt: N,
    eq: P,
    neq: F,
    gte: O,
    lte: L,
    cmp: R,
    coerce: Y,
    Comparator: G,
    Range: $,
    satisfies: H,
    toComparators: U,
    maxSatisfying: C,
    minSatisfying: I,
    minVersion: A,
    validRange: k,
    outside: M,
    gtr: W,
    ltr: ie,
    intersects: te,
    simplifyRange: he,
    subset: pe,
    SemVer: p,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: c.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: c.RELEASE_TYPES,
    compareIdentifiers: f.compareIdentifiers,
    rcompareIdentifiers: f.rcompareIdentifiers
  }, Ji;
}
var $t = {}, Er = { exports: {} };
Er.exports;
var Js;
function Uf() {
  return Js || (Js = 1, (function(e, c) {
    var p = 200, f = "__lodash_hash_undefined__", d = 1, l = 2, a = 9007199254740991, u = "[object Arguments]", o = "[object Array]", s = "[object AsyncFunction]", n = "[object Boolean]", t = "[object Date]", r = "[object Error]", h = "[object Function]", g = "[object GeneratorFunction]", v = "[object Map]", m = "[object Number]", w = "[object Null]", S = "[object Object]", b = "[object Promise]", N = "[object Proxy]", P = "[object RegExp]", F = "[object Set]", O = "[object String]", L = "[object Symbol]", R = "[object Undefined]", Y = "[object WeakMap]", G = "[object ArrayBuffer]", $ = "[object DataView]", H = "[object Float32Array]", U = "[object Float64Array]", C = "[object Int8Array]", I = "[object Int16Array]", A = "[object Int32Array]", k = "[object Uint8Array]", M = "[object Uint8ClampedArray]", W = "[object Uint16Array]", ie = "[object Uint32Array]", te = /[\\^$.*+?()[\]{}|]/g, he = /^\[object .+?Constructor\]$/, pe = /^(?:0|[1-9]\d*)$/, z = {};
    z[H] = z[U] = z[C] = z[I] = z[A] = z[k] = z[M] = z[W] = z[ie] = !0, z[u] = z[o] = z[G] = z[n] = z[$] = z[t] = z[r] = z[h] = z[v] = z[m] = z[S] = z[P] = z[F] = z[O] = z[Y] = !1;
    var me = typeof et == "object" && et && et.Object === Object && et, y = typeof self == "object" && self && self.Object === Object && self, E = me || y || Function("return this")(), B = c && !c.nodeType && c, D = B && !0 && e && !e.nodeType && e, de = D && D.exports === B, Ee = de && me.process, ve = (function() {
      try {
        return Ee && Ee.binding && Ee.binding("util");
      } catch {
      }
    })(), Re = ve && ve.isTypedArray;
    function we(T, x) {
      for (var Z = -1, ce = T == null ? 0 : T.length, Oe = 0, Ae = []; ++Z < ce; ) {
        var Fe = T[Z];
        x(Fe, Z, T) && (Ae[Oe++] = Fe);
      }
      return Ae;
    }
    function Ge(T, x) {
      for (var Z = -1, ce = x.length, Oe = T.length; ++Z < ce; )
        T[Oe + Z] = x[Z];
      return T;
    }
    function Se(T, x) {
      for (var Z = -1, ce = T == null ? 0 : T.length; ++Z < ce; )
        if (x(T[Z], Z, T))
          return !0;
      return !1;
    }
    function Be(T, x) {
      for (var Z = -1, ce = Array(T); ++Z < T; )
        ce[Z] = x(Z);
      return ce;
    }
    function ct(T) {
      return function(x) {
        return T(x);
      };
    }
    function at(T, x) {
      return T.has(x);
    }
    function nt(T, x) {
      return T?.[x];
    }
    function i(T) {
      var x = -1, Z = Array(T.size);
      return T.forEach(function(ce, Oe) {
        Z[++x] = [Oe, ce];
      }), Z;
    }
    function j(T, x) {
      return function(Z) {
        return T(x(Z));
      };
    }
    function V(T) {
      var x = -1, Z = Array(T.size);
      return T.forEach(function(ce) {
        Z[++x] = ce;
      }), Z;
    }
    var ae = Array.prototype, X = Function.prototype, ne = Object.prototype, ee = E["__core-js_shared__"], le = X.toString, fe = ne.hasOwnProperty, Te = (function() {
      var T = /[^.]+$/.exec(ee && ee.keys && ee.keys.IE_PROTO || "");
      return T ? "Symbol(src)_1." + T : "";
    })(), be = ne.toString, ye = RegExp(
      "^" + le.call(fe).replace(te, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), _ = de ? E.Buffer : void 0, q = E.Symbol, K = E.Uint8Array, J = ne.propertyIsEnumerable, Q = ae.splice, oe = q ? q.toStringTag : void 0, re = Object.getOwnPropertySymbols, ue = _ ? _.isBuffer : void 0, ge = j(Object.keys, Object), _e = Ut(E, "DataView"), Pe = Ut(E, "Map"), De = Ut(E, "Promise"), Ce = Ut(E, "Set"), Lt = Ut(E, "WeakMap"), Je = Ut(Object, "create"), _t = St(_e), Su = St(Pe), Tu = St(De), bu = St(Ce), Cu = St(Lt), _a = q ? q.prototype : void 0, Zr = _a ? _a.valueOf : void 0;
    function Rt(T) {
      var x = -1, Z = T == null ? 0 : T.length;
      for (this.clear(); ++x < Z; ) {
        var ce = T[x];
        this.set(ce[0], ce[1]);
      }
    }
    function Pu() {
      this.__data__ = Je ? Je(null) : {}, this.size = 0;
    }
    function Ou(T) {
      var x = this.has(T) && delete this.__data__[T];
      return this.size -= x ? 1 : 0, x;
    }
    function Iu(T) {
      var x = this.__data__;
      if (Je) {
        var Z = x[T];
        return Z === f ? void 0 : Z;
      }
      return fe.call(x, T) ? x[T] : void 0;
    }
    function Nu(T) {
      var x = this.__data__;
      return Je ? x[T] !== void 0 : fe.call(x, T);
    }
    function Du(T, x) {
      var Z = this.__data__;
      return this.size += this.has(T) ? 0 : 1, Z[T] = Je && x === void 0 ? f : x, this;
    }
    Rt.prototype.clear = Pu, Rt.prototype.delete = Ou, Rt.prototype.get = Iu, Rt.prototype.has = Nu, Rt.prototype.set = Du;
    function ot(T) {
      var x = -1, Z = T == null ? 0 : T.length;
      for (this.clear(); ++x < Z; ) {
        var ce = T[x];
        this.set(ce[0], ce[1]);
      }
    }
    function Fu() {
      this.__data__ = [], this.size = 0;
    }
    function Lu(T) {
      var x = this.__data__, Z = Tr(x, T);
      if (Z < 0)
        return !1;
      var ce = x.length - 1;
      return Z == ce ? x.pop() : Q.call(x, Z, 1), --this.size, !0;
    }
    function Uu(T) {
      var x = this.__data__, Z = Tr(x, T);
      return Z < 0 ? void 0 : x[Z][1];
    }
    function xu(T) {
      return Tr(this.__data__, T) > -1;
    }
    function ku(T, x) {
      var Z = this.__data__, ce = Tr(Z, T);
      return ce < 0 ? (++this.size, Z.push([T, x])) : Z[ce][1] = x, this;
    }
    ot.prototype.clear = Fu, ot.prototype.delete = Lu, ot.prototype.get = Uu, ot.prototype.has = xu, ot.prototype.set = ku;
    function At(T) {
      var x = -1, Z = T == null ? 0 : T.length;
      for (this.clear(); ++x < Z; ) {
        var ce = T[x];
        this.set(ce[0], ce[1]);
      }
    }
    function $u() {
      this.size = 0, this.__data__ = {
        hash: new Rt(),
        map: new (Pe || ot)(),
        string: new Rt()
      };
    }
    function qu(T) {
      var x = br(this, T).delete(T);
      return this.size -= x ? 1 : 0, x;
    }
    function Mu(T) {
      return br(this, T).get(T);
    }
    function Bu(T) {
      return br(this, T).has(T);
    }
    function ju(T, x) {
      var Z = br(this, T), ce = Z.size;
      return Z.set(T, x), this.size += Z.size == ce ? 0 : 1, this;
    }
    At.prototype.clear = $u, At.prototype.delete = qu, At.prototype.get = Mu, At.prototype.has = Bu, At.prototype.set = ju;
    function Sr(T) {
      var x = -1, Z = T == null ? 0 : T.length;
      for (this.__data__ = new At(); ++x < Z; )
        this.add(T[x]);
    }
    function Hu(T) {
      return this.__data__.set(T, f), this;
    }
    function Gu(T) {
      return this.__data__.has(T);
    }
    Sr.prototype.add = Sr.prototype.push = Hu, Sr.prototype.has = Gu;
    function ft(T) {
      var x = this.__data__ = new ot(T);
      this.size = x.size;
    }
    function Wu() {
      this.__data__ = new ot(), this.size = 0;
    }
    function Vu(T) {
      var x = this.__data__, Z = x.delete(T);
      return this.size = x.size, Z;
    }
    function Yu(T) {
      return this.__data__.get(T);
    }
    function zu(T) {
      return this.__data__.has(T);
    }
    function Xu(T, x) {
      var Z = this.__data__;
      if (Z instanceof ot) {
        var ce = Z.__data__;
        if (!Pe || ce.length < p - 1)
          return ce.push([T, x]), this.size = ++Z.size, this;
        Z = this.__data__ = new At(ce);
      }
      return Z.set(T, x), this.size = Z.size, this;
    }
    ft.prototype.clear = Wu, ft.prototype.delete = Vu, ft.prototype.get = Yu, ft.prototype.has = zu, ft.prototype.set = Xu;
    function Ku(T, x) {
      var Z = Cr(T), ce = !Z && fc(T), Oe = !Z && !ce && en(T), Ae = !Z && !ce && !Oe && Ia(T), Fe = Z || ce || Oe || Ae, Ue = Fe ? Be(T.length, String) : [], ke = Ue.length;
      for (var Ne in T)
        fe.call(T, Ne) && !(Fe && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Ne == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        Oe && (Ne == "offset" || Ne == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Ae && (Ne == "buffer" || Ne == "byteLength" || Ne == "byteOffset") || // Skip index properties.
        oc(Ne, ke))) && Ue.push(Ne);
      return Ue;
    }
    function Tr(T, x) {
      for (var Z = T.length; Z--; )
        if (ba(T[Z][0], x))
          return Z;
      return -1;
    }
    function Ju(T, x, Z) {
      var ce = x(T);
      return Cr(T) ? ce : Ge(ce, Z(T));
    }
    function Vt(T) {
      return T == null ? T === void 0 ? R : w : oe && oe in Object(T) ? ic(T) : cc(T);
    }
    function Ra(T) {
      return Yt(T) && Vt(T) == u;
    }
    function Aa(T, x, Z, ce, Oe) {
      return T === x ? !0 : T == null || x == null || !Yt(T) && !Yt(x) ? T !== T && x !== x : Qu(T, x, Z, ce, Aa, Oe);
    }
    function Qu(T, x, Z, ce, Oe, Ae) {
      var Fe = Cr(T), Ue = Cr(x), ke = Fe ? o : dt(T), Ne = Ue ? o : dt(x);
      ke = ke == u ? S : ke, Ne = Ne == u ? S : Ne;
      var Ve = ke == S, Qe = Ne == S, qe = ke == Ne;
      if (qe && en(T)) {
        if (!en(x))
          return !1;
        Fe = !0, Ve = !1;
      }
      if (qe && !Ve)
        return Ae || (Ae = new ft()), Fe || Ia(T) ? Sa(T, x, Z, ce, Oe, Ae) : rc(T, x, ke, Z, ce, Oe, Ae);
      if (!(Z & d)) {
        var Xe = Ve && fe.call(T, "__wrapped__"), Ke = Qe && fe.call(x, "__wrapped__");
        if (Xe || Ke) {
          var ht = Xe ? T.value() : T, st = Ke ? x.value() : x;
          return Ae || (Ae = new ft()), Oe(ht, st, Z, ce, Ae);
        }
      }
      return qe ? (Ae || (Ae = new ft()), nc(T, x, Z, ce, Oe, Ae)) : !1;
    }
    function Zu(T) {
      if (!Oa(T) || lc(T))
        return !1;
      var x = Ca(T) ? ye : he;
      return x.test(St(T));
    }
    function ec(T) {
      return Yt(T) && Pa(T.length) && !!z[Vt(T)];
    }
    function tc(T) {
      if (!uc(T))
        return ge(T);
      var x = [];
      for (var Z in Object(T))
        fe.call(T, Z) && Z != "constructor" && x.push(Z);
      return x;
    }
    function Sa(T, x, Z, ce, Oe, Ae) {
      var Fe = Z & d, Ue = T.length, ke = x.length;
      if (Ue != ke && !(Fe && ke > Ue))
        return !1;
      var Ne = Ae.get(T);
      if (Ne && Ae.get(x))
        return Ne == x;
      var Ve = -1, Qe = !0, qe = Z & l ? new Sr() : void 0;
      for (Ae.set(T, x), Ae.set(x, T); ++Ve < Ue; ) {
        var Xe = T[Ve], Ke = x[Ve];
        if (ce)
          var ht = Fe ? ce(Ke, Xe, Ve, x, T, Ae) : ce(Xe, Ke, Ve, T, x, Ae);
        if (ht !== void 0) {
          if (ht)
            continue;
          Qe = !1;
          break;
        }
        if (qe) {
          if (!Se(x, function(st, Tt) {
            if (!at(qe, Tt) && (Xe === st || Oe(Xe, st, Z, ce, Ae)))
              return qe.push(Tt);
          })) {
            Qe = !1;
            break;
          }
        } else if (!(Xe === Ke || Oe(Xe, Ke, Z, ce, Ae))) {
          Qe = !1;
          break;
        }
      }
      return Ae.delete(T), Ae.delete(x), Qe;
    }
    function rc(T, x, Z, ce, Oe, Ae, Fe) {
      switch (Z) {
        case $:
          if (T.byteLength != x.byteLength || T.byteOffset != x.byteOffset)
            return !1;
          T = T.buffer, x = x.buffer;
        case G:
          return !(T.byteLength != x.byteLength || !Ae(new K(T), new K(x)));
        case n:
        case t:
        case m:
          return ba(+T, +x);
        case r:
          return T.name == x.name && T.message == x.message;
        case P:
        case O:
          return T == x + "";
        case v:
          var Ue = i;
        case F:
          var ke = ce & d;
          if (Ue || (Ue = V), T.size != x.size && !ke)
            return !1;
          var Ne = Fe.get(T);
          if (Ne)
            return Ne == x;
          ce |= l, Fe.set(T, x);
          var Ve = Sa(Ue(T), Ue(x), ce, Oe, Ae, Fe);
          return Fe.delete(T), Ve;
        case L:
          if (Zr)
            return Zr.call(T) == Zr.call(x);
      }
      return !1;
    }
    function nc(T, x, Z, ce, Oe, Ae) {
      var Fe = Z & d, Ue = Ta(T), ke = Ue.length, Ne = Ta(x), Ve = Ne.length;
      if (ke != Ve && !Fe)
        return !1;
      for (var Qe = ke; Qe--; ) {
        var qe = Ue[Qe];
        if (!(Fe ? qe in x : fe.call(x, qe)))
          return !1;
      }
      var Xe = Ae.get(T);
      if (Xe && Ae.get(x))
        return Xe == x;
      var Ke = !0;
      Ae.set(T, x), Ae.set(x, T);
      for (var ht = Fe; ++Qe < ke; ) {
        qe = Ue[Qe];
        var st = T[qe], Tt = x[qe];
        if (ce)
          var Na = Fe ? ce(Tt, st, qe, x, T, Ae) : ce(st, Tt, qe, T, x, Ae);
        if (!(Na === void 0 ? st === Tt || Oe(st, Tt, Z, ce, Ae) : Na)) {
          Ke = !1;
          break;
        }
        ht || (ht = qe == "constructor");
      }
      if (Ke && !ht) {
        var Pr = T.constructor, Or = x.constructor;
        Pr != Or && "constructor" in T && "constructor" in x && !(typeof Pr == "function" && Pr instanceof Pr && typeof Or == "function" && Or instanceof Or) && (Ke = !1);
      }
      return Ae.delete(T), Ae.delete(x), Ke;
    }
    function Ta(T) {
      return Ju(T, pc, ac);
    }
    function br(T, x) {
      var Z = T.__data__;
      return sc(x) ? Z[typeof x == "string" ? "string" : "hash"] : Z.map;
    }
    function Ut(T, x) {
      var Z = nt(T, x);
      return Zu(Z) ? Z : void 0;
    }
    function ic(T) {
      var x = fe.call(T, oe), Z = T[oe];
      try {
        T[oe] = void 0;
        var ce = !0;
      } catch {
      }
      var Oe = be.call(T);
      return ce && (x ? T[oe] = Z : delete T[oe]), Oe;
    }
    var ac = re ? function(T) {
      return T == null ? [] : (T = Object(T), we(re(T), function(x) {
        return J.call(T, x);
      }));
    } : mc, dt = Vt;
    (_e && dt(new _e(new ArrayBuffer(1))) != $ || Pe && dt(new Pe()) != v || De && dt(De.resolve()) != b || Ce && dt(new Ce()) != F || Lt && dt(new Lt()) != Y) && (dt = function(T) {
      var x = Vt(T), Z = x == S ? T.constructor : void 0, ce = Z ? St(Z) : "";
      if (ce)
        switch (ce) {
          case _t:
            return $;
          case Su:
            return v;
          case Tu:
            return b;
          case bu:
            return F;
          case Cu:
            return Y;
        }
      return x;
    });
    function oc(T, x) {
      return x = x ?? a, !!x && (typeof T == "number" || pe.test(T)) && T > -1 && T % 1 == 0 && T < x;
    }
    function sc(T) {
      var x = typeof T;
      return x == "string" || x == "number" || x == "symbol" || x == "boolean" ? T !== "__proto__" : T === null;
    }
    function lc(T) {
      return !!Te && Te in T;
    }
    function uc(T) {
      var x = T && T.constructor, Z = typeof x == "function" && x.prototype || ne;
      return T === Z;
    }
    function cc(T) {
      return be.call(T);
    }
    function St(T) {
      if (T != null) {
        try {
          return le.call(T);
        } catch {
        }
        try {
          return T + "";
        } catch {
        }
      }
      return "";
    }
    function ba(T, x) {
      return T === x || T !== T && x !== x;
    }
    var fc = Ra(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? Ra : function(T) {
      return Yt(T) && fe.call(T, "callee") && !J.call(T, "callee");
    }, Cr = Array.isArray;
    function dc(T) {
      return T != null && Pa(T.length) && !Ca(T);
    }
    var en = ue || gc;
    function hc(T, x) {
      return Aa(T, x);
    }
    function Ca(T) {
      if (!Oa(T))
        return !1;
      var x = Vt(T);
      return x == h || x == g || x == s || x == N;
    }
    function Pa(T) {
      return typeof T == "number" && T > -1 && T % 1 == 0 && T <= a;
    }
    function Oa(T) {
      var x = typeof T;
      return T != null && (x == "object" || x == "function");
    }
    function Yt(T) {
      return T != null && typeof T == "object";
    }
    var Ia = Re ? ct(Re) : ec;
    function pc(T) {
      return dc(T) ? Ku(T) : tc(T);
    }
    function mc() {
      return [];
    }
    function gc() {
      return !1;
    }
    e.exports = hc;
  })(Er, Er.exports)), Er.exports;
}
var Qs;
function xf() {
  if (Qs) return $t;
  Qs = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.DownloadedUpdateHelper = void 0, $t.createTempUpdateFile = u;
  const e = wr, c = vt, p = Uf(), f = /* @__PURE__ */ wt(), d = Ie;
  let l = class {
    constructor(s) {
      this.cacheDir = s, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return d.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(s, n, t, r) {
      if (this.versionInfo != null && this.file === s && this.fileInfo != null)
        return p(this.versionInfo, n) && p(this.fileInfo.info, t.info) && await (0, f.pathExists)(s) ? s : null;
      const h = await this.getValidCachedUpdateFile(t, r);
      return h === null ? null : (r.info(`Update has already been downloaded to ${s}).`), this._file = h, h);
    }
    async setDownloadedFile(s, n, t, r, h, g) {
      this._file = s, this._packageFile = n, this.versionInfo = t, this.fileInfo = r, this._downloadedFileInfo = {
        fileName: h,
        sha512: r.info.sha512,
        isAdminRightsRequired: r.info.isAdminRightsRequired === !0
      }, g && await (0, f.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, f.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(s, n) {
      const t = this.getUpdateInfoFile();
      if (!await (0, f.pathExists)(t))
        return null;
      let h;
      try {
        h = await (0, f.readJson)(t);
      } catch (w) {
        let S = "No cached update info available";
        return w.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), S += ` (error on read: ${w.message})`), n.info(S), null;
      }
      if (!(h?.fileName !== null))
        return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (s.info.sha512 !== h.sha512)
        return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${h.sha512}, expected: ${s.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const v = d.join(this.cacheDirForPendingUpdate, h.fileName);
      if (!await (0, f.pathExists)(v))
        return n.info("Cached update file doesn't exist"), null;
      const m = await a(v);
      return s.info.sha512 !== m ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${s.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = h, v);
    }
    getUpdateInfoFile() {
      return d.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  $t.DownloadedUpdateHelper = l;
  function a(o, s = "sha512", n = "base64", t) {
    return new Promise((r, h) => {
      const g = (0, e.createHash)(s);
      g.on("error", h).setEncoding(n), (0, c.createReadStream)(o, {
        ...t,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", h).on("end", () => {
        g.end(), r(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function u(o, s, n) {
    let t = 0, r = d.join(s, o);
    for (let h = 0; h < 3; h++)
      try {
        return await (0, f.unlink)(r), r;
      } catch (g) {
        if (g.code === "ENOENT")
          return r;
        n.warn(`Error on remove temp update file: ${g}`), r = d.join(s, `${t++}-${o}`);
      }
    return r;
  }
  return $t;
}
var Qt = {}, Br = {}, Zs;
function kf() {
  if (Zs) return Br;
  Zs = 1, Object.defineProperty(Br, "__esModule", { value: !0 }), Br.getAppCacheDir = p;
  const e = Ie, c = Gr;
  function p() {
    const f = (0, c.homedir)();
    let d;
    return process.platform === "win32" ? d = process.env.LOCALAPPDATA || e.join(f, "AppData", "Local") : process.platform === "darwin" ? d = e.join(f, "Library", "Caches") : d = process.env.XDG_CACHE_HOME || e.join(f, ".cache"), d;
  }
  return Br;
}
var el;
function $f() {
  if (el) return Qt;
  el = 1, Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.ElectronAppAdapter = void 0;
  const e = Ie, c = kf();
  let p = class {
    constructor(d = It.app) {
      this.app = d;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? e.join(process.resourcesPath, "app-update.yml") : e.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, c.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(d) {
      this.app.once("quit", (l, a) => d(a));
    }
  };
  return Qt.ElectronAppAdapter = p, Qt;
}
var Qi = {}, tl;
function qf() {
  return tl || (tl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = p;
    const c = xe();
    e.NET_SESSION_NAME = "electron-updater";
    function p() {
      return It.session.fromPartition(e.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class f extends c.HttpExecutor {
      constructor(l) {
        super(), this.proxyLoginCallback = l, this.cachedSession = null;
      }
      async download(l, a, u) {
        return await u.cancellationToken.createPromise((o, s, n) => {
          const t = {
            headers: u.headers || void 0,
            redirect: "manual"
          };
          (0, c.configureRequestUrl)(l, t), (0, c.configureRequestOptions)(t), this.doDownload(t, {
            destination: a,
            options: u,
            onCancel: n,
            callback: (r) => {
              r == null ? o(a) : s(r);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(l, a) {
        l.headers && l.headers.Host && (l.host = l.headers.Host, delete l.headers.Host), this.cachedSession == null && (this.cachedSession = p());
        const u = It.net.request({
          ...l,
          session: this.cachedSession
        });
        return u.on("response", a), this.proxyLoginCallback != null && u.on("login", this.proxyLoginCallback), u;
      }
      addRedirectHandlers(l, a, u, o, s) {
        l.on("redirect", (n, t, r) => {
          l.abort(), o > this.maxRedirects ? u(this.createMaxRedirectError()) : s(c.HttpExecutor.prepareRedirectUrlOptions(r, a));
        });
      }
    }
    e.ElectronHttpExecutor = f;
  })(Qi)), Qi;
}
var Zt = {}, qt = {}, rl;
function Dt() {
  if (rl) return qt;
  rl = 1, Object.defineProperty(qt, "__esModule", { value: !0 }), qt.newBaseUrl = c, qt.newUrlFromBase = p, qt.getChannelFilename = f;
  const e = yt;
  function c(d) {
    const l = new e.URL(d);
    return l.pathname.endsWith("/") || (l.pathname += "/"), l;
  }
  function p(d, l, a = !1) {
    const u = new e.URL(d, l), o = l.search;
    return o != null && o.length !== 0 ? u.search = o : a && (u.search = `noCache=${Date.now().toString(32)}`), u;
  }
  function f(d) {
    return `${d}.yml`;
  }
  return qt;
}
var lt = {}, Zi, nl;
function du() {
  if (nl) return Zi;
  nl = 1;
  var e = "[object Symbol]", c = /[\\^$.*+?()[\]{}|]/g, p = RegExp(c.source), f = typeof et == "object" && et && et.Object === Object && et, d = typeof self == "object" && self && self.Object === Object && self, l = f || d || Function("return this")(), a = Object.prototype, u = a.toString, o = l.Symbol, s = o ? o.prototype : void 0, n = s ? s.toString : void 0;
  function t(m) {
    if (typeof m == "string")
      return m;
    if (h(m))
      return n ? n.call(m) : "";
    var w = m + "";
    return w == "0" && 1 / m == -1 / 0 ? "-0" : w;
  }
  function r(m) {
    return !!m && typeof m == "object";
  }
  function h(m) {
    return typeof m == "symbol" || r(m) && u.call(m) == e;
  }
  function g(m) {
    return m == null ? "" : t(m);
  }
  function v(m) {
    return m = g(m), m && p.test(m) ? m.replace(c, "\\$&") : m;
  }
  return Zi = v, Zi;
}
var il;
function ze() {
  if (il) return lt;
  il = 1, Object.defineProperty(lt, "__esModule", { value: !0 }), lt.Provider = void 0, lt.findFile = a, lt.parseUpdateInfo = u, lt.getFileList = o, lt.resolveFiles = s;
  const e = xe(), c = fa(), p = yt, f = Dt(), d = du();
  let l = class {
    constructor(t) {
      this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
    }
    // By default, the blockmap file is in the same directory as the main file
    // But some providers may have a different blockmap file, so we need to override this method
    getBlockMapFiles(t, r, h, g = null) {
      const v = (0, f.newUrlFromBase)(`${t.pathname}.blockmap`, t);
      return [(0, f.newUrlFromBase)(`${t.pathname.replace(new RegExp(d(h), "g"), r)}.blockmap`, g ? new p.URL(g) : t), v];
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const t = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (t === "x64" ? "" : `-${t}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(t) {
      return `${t}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(t) {
      this.requestHeaders = t;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(t, r, h) {
      return this.executor.request(this.createRequestOptions(t, r), h);
    }
    createRequestOptions(t, r) {
      const h = {};
      return this.requestHeaders == null ? r != null && (h.headers = r) : h.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, e.configureRequestUrl)(t, h), h;
    }
  };
  lt.Provider = l;
  function a(n, t, r) {
    var h;
    if (n.length === 0)
      throw (0, e.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const g = n.filter((m) => m.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), v = (h = g.find((m) => [m.url.pathname, m.info.url].some((w) => w.includes(process.arch)))) !== null && h !== void 0 ? h : g.shift();
    return v || (r == null ? n[0] : n.find((m) => !r.some((w) => m.url.pathname.toLowerCase().endsWith(`.${w.toLowerCase()}`))));
  }
  function u(n, t, r) {
    if (n == null)
      throw (0, e.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let h;
    try {
      h = (0, c.load)(n);
    } catch (g) {
      throw (0, e.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${g.stack || g.message}, rawData: ${n}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return h;
  }
  function o(n) {
    const t = n.files;
    if (t != null && t.length > 0)
      return t;
    if (n.path != null)
      return [
        {
          url: n.path,
          sha2: n.sha2,
          sha512: n.sha512
        }
      ];
    throw (0, e.newError)(`No files provided: ${(0, e.safeStringifyJson)(n)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function s(n, t, r = (h) => h) {
    const g = o(n).map((w) => {
      if (w.sha2 == null && w.sha512 == null)
        throw (0, e.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, e.safeStringifyJson)(w)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, f.newUrlFromBase)(r(w.url), t),
        info: w
      };
    }), v = n.packages, m = v == null ? null : v[process.arch] || v.ia32;
    return m != null && (g[0].packageInfo = {
      ...m,
      path: (0, f.newUrlFromBase)(r(m.path), t).href
    }), g;
  }
  return lt;
}
var al;
function hu() {
  if (al) return Zt;
  al = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.GenericProvider = void 0;
  const e = xe(), c = Dt(), p = ze();
  let f = class extends p.Provider {
    constructor(l, a, u) {
      super(u), this.configuration = l, this.updater = a, this.baseUrl = (0, c.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const l = this.updater.channel || this.configuration.channel;
      return l == null ? this.getDefaultChannelName() : this.getCustomChannelName(l);
    }
    async getLatestVersion() {
      const l = (0, c.getChannelFilename)(this.channel), a = (0, c.newUrlFromBase)(l, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let u = 0; ; u++)
        try {
          return (0, p.parseUpdateInfo)(await this.httpRequest(a), l, a);
        } catch (o) {
          if (o instanceof e.HttpError && o.statusCode === 404)
            throw (0, e.newError)(`Cannot find channel "${l}" update info: ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (o.code === "ECONNREFUSED" && u < 3) {
            await new Promise((s, n) => {
              try {
                setTimeout(s, 1e3 * u);
              } catch (t) {
                n(t);
              }
            });
            continue;
          }
          throw o;
        }
    }
    resolveFiles(l) {
      return (0, p.resolveFiles)(l, this.baseUrl);
    }
  };
  return Zt.GenericProvider = f, Zt;
}
var er = {}, tr = {}, ol;
function Mf() {
  if (ol) return tr;
  ol = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.BitbucketProvider = void 0;
  const e = xe(), c = Dt(), p = ze();
  let f = class extends p.Provider {
    constructor(l, a, u) {
      super({
        ...u,
        isUseMultipleRangeRequest: !1
      }), this.configuration = l, this.updater = a;
      const { owner: o, slug: s } = l;
      this.baseUrl = (0, c.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${o}/${s}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const l = new e.CancellationToken(), a = (0, c.getChannelFilename)(this.getCustomChannelName(this.channel)), u = (0, c.newUrlFromBase)(a, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const o = await this.httpRequest(u, void 0, l);
        return (0, p.parseUpdateInfo)(o, a, u);
      } catch (o) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(l) {
      return (0, p.resolveFiles)(l, this.baseUrl);
    }
    toString() {
      const { owner: l, slug: a } = this.configuration;
      return `Bitbucket (owner: ${l}, slug: ${a}, channel: ${this.channel})`;
    }
  };
  return tr.BitbucketProvider = f, tr;
}
var gt = {}, sl;
function pu() {
  if (sl) return gt;
  sl = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.GitHubProvider = gt.BaseGitHubProvider = void 0, gt.computeReleaseNotes = s;
  const e = xe(), c = fu(), p = yt, f = Dt(), d = ze(), l = /\/tag\/(v?[^/]+)$/;
  class a extends d.Provider {
    constructor(t, r, h) {
      super({
        ...h,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = t, this.baseUrl = (0, f.newBaseUrl)((0, e.githubUrl)(t, r));
      const g = r === "github.com" ? "api.github.com" : r;
      this.baseApiUrl = (0, f.newBaseUrl)((0, e.githubUrl)(t, g));
    }
    computeGithubBasePath(t) {
      const r = this.options.host;
      return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
    }
  }
  gt.BaseGitHubProvider = a;
  let u = class extends a {
    constructor(t, r, h) {
      super(t, "github.com", h), this.options = t, this.updater = r;
    }
    get channel() {
      const t = this.updater.channel || this.options.channel;
      return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
    }
    async getLatestVersion() {
      var t, r, h, g, v;
      const m = new e.CancellationToken(), w = await this.httpRequest((0, f.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), S = (0, e.parseXml)(w);
      let b = S.element("entry", !1, "No published versions on GitHub"), N = null;
      try {
        if (this.updater.allowPrerelease) {
          const Y = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = c.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
          if (Y === null)
            N = l.exec(b.element("link").attribute("href"))[1];
          else
            for (const G of S.getElements("entry")) {
              const $ = l.exec(G.element("link").attribute("href"));
              if ($ === null)
                continue;
              const H = $[1];
              if (!c.valid(H))
                continue;
              const U = ((h = c.prerelease(H)) === null || h === void 0 ? void 0 : h[0]) || null, C = !Y || ["alpha", "beta"].includes(Y), I = U !== null && !["alpha", "beta"].includes(String(U));
              if (C && !I && !(Y === "beta" && U === "alpha")) {
                N = H, b = G;
                break;
              }
              if (U && U === Y) {
                N = H, b = G;
                break;
              }
            }
        } else {
          N = await this.getLatestTagName(m);
          for (const Y of S.getElements("entry")) {
            const G = l.exec(Y.element("link").attribute("href"));
            if (G != null && G[1] === N) {
              b = Y;
              break;
            }
          }
        }
      } catch (Y) {
        throw (0, e.newError)(`Cannot parse releases feed: ${Y.stack || Y.message},
XML:
${w}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (N == null)
        throw (0, e.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let P, F = "", O = "";
      const L = async (Y) => {
        F = (0, f.getChannelFilename)(Y), O = (0, f.newUrlFromBase)(this.getBaseDownloadPath(String(N), F), this.baseUrl);
        const G = this.createRequestOptions(O);
        try {
          return await this.executor.request(G, m);
        } catch ($) {
          throw $ instanceof e.HttpError && $.statusCode === 404 ? (0, e.newError)(`Cannot find ${F} in the latest release artifacts (${O}): ${$.stack || $.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : $;
        }
      };
      try {
        let Y = this.channel;
        this.updater.allowPrerelease && (!((g = c.prerelease(N)) === null || g === void 0) && g[0]) && (Y = this.getCustomChannelName(String((v = c.prerelease(N)) === null || v === void 0 ? void 0 : v[0]))), P = await L(Y);
      } catch (Y) {
        if (this.updater.allowPrerelease)
          P = await L(this.getDefaultChannelName());
        else
          throw Y;
      }
      const R = (0, d.parseUpdateInfo)(P, F, O);
      return R.releaseName == null && (R.releaseName = b.elementValueOrEmpty("title")), R.releaseNotes == null && (R.releaseNotes = s(this.updater.currentVersion, this.updater.fullChangelog, S, b)), {
        tag: N,
        ...R
      };
    }
    async getLatestTagName(t) {
      const r = this.options, h = r.host == null || r.host === "github.com" ? (0, f.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new p.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(h, { Accept: "application/json" }, t);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${h}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(t) {
      return (0, d.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
    }
    getBaseDownloadPath(t, r) {
      return `${this.basePath}/download/${t}/${r}`;
    }
  };
  gt.GitHubProvider = u;
  function o(n) {
    const t = n.elementValueOrEmpty("content");
    return t === "No content." ? "" : t;
  }
  function s(n, t, r, h) {
    if (!t)
      return o(h);
    const g = /\/tag\/v?([^/]+)$/;
    let v;
    try {
      v = g.exec(h.element("link").attribute("href"))[1], v = c.valid(v) ? v : void 0;
    } catch {
    }
    if (v == null)
      return null;
    const m = [];
    for (const w of r.getElements("entry")) {
      let S;
      try {
        const P = g.exec(w.element("link").attribute("href"));
        if (!P)
          continue;
        S = P[1];
      } catch {
        continue;
      }
      if (!c.valid(S))
        continue;
      const b = c.gt(S, n.raw), N = c.lte(S, v);
      b && N && m.push({
        version: S,
        note: o(w)
      });
    }
    return m.sort((w, S) => c.rcompare(w.version, S.version));
  }
  return gt;
}
var rr = {}, ll;
function Bf() {
  if (ll) return rr;
  ll = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.GitLabProvider = void 0;
  const e = xe(), c = yt, p = du(), f = Dt(), d = ze();
  let l = class extends d.Provider {
    /**
     * Normalizes filenames by replacing spaces and underscores with dashes.
     *
     * This is a workaround to handle filename formatting differences between tools:
     * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
     * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
     *
     * Because of this mismatch, we can't reliably extract the correct filename from
     * the asset path without normalization. This function ensures consistent matching
     * across different filename formats by converting all spaces and underscores to dashes.
     *
     * @param filename The filename to normalize
     * @returns The normalized filename with spaces and underscores replaced by dashes
     */
    normalizeFilename(u) {
      return u.replace(/ |_/g, "-");
    }
    constructor(u, o, s) {
      super({
        ...s,
        // GitLab might not support multiple range requests efficiently
        isUseMultipleRangeRequest: !1
      }), this.options = u, this.updater = o, this.cachedLatestVersion = null;
      const t = u.host || "gitlab.com";
      this.baseApiUrl = (0, f.newBaseUrl)(`https://${t}/api/v4`);
    }
    createRequestOptions(u, o) {
      const s = super.createRequestOptions(u, o);
      return s.redirect = "manual", s;
    }
    get channel() {
      const u = this.updater.channel || this.options.channel;
      return u == null ? this.getDefaultChannelName() : this.getCustomChannelName(u);
    }
    async getLatestVersion() {
      const u = new e.CancellationToken(), o = (0, f.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), s = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
      let n;
      try {
        n = await this.httpRequest(o, s, u);
      } catch (b) {
        throw (0, e.newError)(`Unable to find latest release on GitLab (${o}): ${b.stack || b.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      if (!n)
        throw (0, e.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let t;
      try {
        t = JSON.parse(n);
      } catch (b) {
        throw (0, e.newError)(`Unable to parse latest release response from GitLab (${o}): response was not valid JSON: ${b.stack || b.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      if (t.upcoming_release)
        throw (0, e.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      const r = t.tag_name;
      let h = null, g = "", v = null;
      const m = async (b) => {
        g = (0, f.getChannelFilename)(b);
        const N = t.assets.links.find((O) => O.name === g);
        if (!N)
          throw (0, e.newError)(`Cannot find ${g} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        v = new c.URL(N.direct_asset_url);
        const P = this.setAuthHeaderForToken(this.options.token || null), F = Object.keys(P).length ? P : void 0;
        try {
          const O = await this.httpRequest(v, F, u);
          if (!O)
            throw (0, e.newError)(`Empty response from ${v}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          return O;
        } catch (O) {
          throw O instanceof e.HttpError && O.statusCode === 404 ? (0, e.newError)(`Cannot find ${g} in the latest release artifacts (${v}): ${O.stack || O.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : O;
        }
      };
      try {
        h = await m(this.channel);
      } catch (b) {
        if (this.channel !== this.getDefaultChannelName())
          h = await m(this.getDefaultChannelName());
        else
          throw b;
      }
      if (!h)
        throw (0, e.newError)(`Unable to parse channel data from ${g}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
      const w = (0, d.parseUpdateInfo)(h, g, v);
      w.releaseName == null && (w.releaseName = t.name), w.releaseNotes == null && (w.releaseNotes = t.description || null);
      const S = {
        tag: r,
        assets: this.convertAssetsToMap(t.assets),
        ...w
      };
      return this.cachedLatestVersion = S, S;
    }
    /**
     * Utility function to convert GitlabReleaseAsset to Map<string, string>
     * Maps asset names to their download URLs
     */
    convertAssetsToMap(u) {
      const o = /* @__PURE__ */ new Map();
      for (const s of u.links)
        o.set(this.normalizeFilename(s.name), s.direct_asset_url);
      return o;
    }
    /**
     * Find blockmap file URL in assets map for a specific filename
     */
    findBlockMapInAssets(u, o) {
      const s = [`${o}.blockmap`, `${this.normalizeFilename(o)}.blockmap`];
      for (const n of s) {
        const t = u.get(n);
        if (t)
          return new c.URL(t);
      }
      return null;
    }
    async fetchReleaseInfoByVersion(u) {
      const o = new e.CancellationToken(), s = [`v${u}`, u];
      for (const n of s) {
        const t = (0, f.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(n)}`, this.baseApiUrl);
        try {
          const r = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, h = await this.httpRequest(t, r, o);
          if (h)
            return JSON.parse(h);
        } catch (r) {
          if (r instanceof e.HttpError && r.statusCode === 404)
            continue;
          throw (0, e.newError)(`Unable to find release ${n} on GitLab (${t}): ${r.stack || r.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
        }
      }
      throw (0, e.newError)(`Unable to find release with version ${u} (tried: ${s.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
    }
    setAuthHeaderForToken(u) {
      const o = {};
      return u != null && (u.startsWith("Bearer") ? o.authorization = u : o["PRIVATE-TOKEN"] = u), o;
    }
    /**
     * Get version info for blockmap files, using cache when possible
     */
    async getVersionInfoForBlockMap(u) {
      if (this.cachedLatestVersion && this.cachedLatestVersion.version === u)
        return this.cachedLatestVersion.assets;
      const o = await this.fetchReleaseInfoByVersion(u);
      return o && o.assets ? this.convertAssetsToMap(o.assets) : null;
    }
    /**
     * Find blockmap URLs from version assets
     */
    async findBlockMapUrlsFromAssets(u, o, s) {
      let n = null, t = null;
      const r = await this.getVersionInfoForBlockMap(o);
      r && (n = this.findBlockMapInAssets(r, s));
      const h = await this.getVersionInfoForBlockMap(u);
      if (h) {
        const g = s.replace(new RegExp(p(o), "g"), u);
        t = this.findBlockMapInAssets(h, g);
      }
      return [t, n];
    }
    async getBlockMapFiles(u, o, s, n = null) {
      if (this.options.uploadTarget === "project_upload") {
        const t = u.pathname.split("/").pop() || "", [r, h] = await this.findBlockMapUrlsFromAssets(o, s, t);
        if (!h)
          throw (0, e.newError)(`Cannot find blockmap file for ${s} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        if (!r)
          throw (0, e.newError)(`Cannot find blockmap file for ${o} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        return [r, h];
      } else
        return super.getBlockMapFiles(u, o, s, n);
    }
    resolveFiles(u) {
      return (0, d.getFileList)(u).map((o) => {
        const n = [
          o.url,
          // Original filename
          this.normalizeFilename(o.url)
          // Normalized filename (spaces/underscores → dashes)
        ].find((r) => u.assets.has(r)), t = n ? u.assets.get(n) : void 0;
        if (!t)
          throw (0, e.newError)(`Cannot find asset "${o.url}" in GitLab release assets. Available assets: ${Array.from(u.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new c.URL(t),
          info: o
        };
      });
    }
    toString() {
      return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
    }
  };
  return rr.GitLabProvider = l, rr;
}
var nr = {}, ul;
function jf() {
  if (ul) return nr;
  ul = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.KeygenProvider = void 0;
  const e = xe(), c = Dt(), p = ze();
  let f = class extends p.Provider {
    constructor(l, a, u) {
      super({
        ...u,
        isUseMultipleRangeRequest: !1
      }), this.configuration = l, this.updater = a, this.defaultHostname = "api.keygen.sh";
      const o = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, c.newBaseUrl)(`https://${o}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const l = new e.CancellationToken(), a = (0, c.getChannelFilename)(this.getCustomChannelName(this.channel)), u = (0, c.newUrlFromBase)(a, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const o = await this.httpRequest(u, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, l);
        return (0, p.parseUpdateInfo)(o, a, u);
      } catch (o) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(l) {
      return (0, p.resolveFiles)(l, this.baseUrl);
    }
    toString() {
      const { account: l, product: a, platform: u } = this.configuration;
      return `Keygen (account: ${l}, product: ${a}, platform: ${u}, channel: ${this.channel})`;
    }
  };
  return nr.KeygenProvider = f, nr;
}
var ir = {}, cl;
function Hf() {
  if (cl) return ir;
  cl = 1, Object.defineProperty(ir, "__esModule", { value: !0 }), ir.PrivateGitHubProvider = void 0;
  const e = xe(), c = fa(), p = Ie, f = yt, d = Dt(), l = pu(), a = ze();
  let u = class extends l.BaseGitHubProvider {
    constructor(s, n, t, r) {
      super(s, "api.github.com", r), this.updater = n, this.token = t;
    }
    createRequestOptions(s, n) {
      const t = super.createRequestOptions(s, n);
      return t.redirect = "manual", t;
    }
    async getLatestVersion() {
      const s = new e.CancellationToken(), n = (0, d.getChannelFilename)(this.getDefaultChannelName()), t = await this.getLatestVersionInfo(s), r = t.assets.find((v) => v.name === n);
      if (r == null)
        throw (0, e.newError)(`Cannot find ${n} in the release ${t.html_url || t.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const h = new f.URL(r.url);
      let g;
      try {
        g = (0, c.load)(await this.httpRequest(h, this.configureHeaders("application/octet-stream"), s));
      } catch (v) {
        throw v instanceof e.HttpError && v.statusCode === 404 ? (0, e.newError)(`Cannot find ${n} in the latest release artifacts (${h}): ${v.stack || v.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : v;
      }
      return g.assets = t.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(s) {
      return {
        accept: s,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(s) {
      const n = this.updater.allowPrerelease;
      let t = this.basePath;
      n || (t = `${t}/latest`);
      const r = (0, d.newUrlFromBase)(t, this.baseUrl);
      try {
        const h = JSON.parse(await this.httpRequest(r, this.configureHeaders("application/vnd.github.v3+json"), s));
        if (n) {
          const g = h.filter((v) => !v.draft);
          return g.find((v) => v.prerelease) || g[0];
        } else
          return h;
      } catch (h) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(s) {
      return (0, a.getFileList)(s).map((n) => {
        const t = p.posix.basename(n.url).replace(/ /g, "-"), r = s.assets.find((h) => h != null && h.name === t);
        if (r == null)
          throw (0, e.newError)(`Cannot find asset "${t}" in: ${JSON.stringify(s.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new f.URL(r.url),
          info: n
        };
      });
    }
  };
  return ir.PrivateGitHubProvider = u, ir;
}
var fl;
function Gf() {
  if (fl) return er;
  fl = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.isUrlProbablySupportMultiRangeRequests = u, er.createClient = o;
  const e = xe(), c = Mf(), p = hu(), f = pu(), d = Bf(), l = jf(), a = Hf();
  function u(s) {
    return !s.includes("s3.amazonaws.com");
  }
  function o(s, n, t) {
    if (typeof s == "string")
      throw (0, e.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const r = s.provider;
    switch (r) {
      case "github": {
        const h = s, g = (h.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || h.token;
        return g == null ? new f.GitHubProvider(h, n, t) : new a.PrivateGitHubProvider(h, n, g, t);
      }
      case "bitbucket":
        return new c.BitbucketProvider(s, n, t);
      case "gitlab":
        return new d.GitLabProvider(s, n, t);
      case "keygen":
        return new l.KeygenProvider(s, n, t);
      case "s3":
      case "spaces":
        return new p.GenericProvider({
          provider: "generic",
          url: (0, e.getS3LikeProviderBaseUrl)(s),
          channel: s.channel || null
        }, n, {
          ...t,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const h = s;
        return new p.GenericProvider(h, n, {
          ...t,
          isUseMultipleRangeRequest: h.useMultipleRangeRequest !== !1 && u(h.url)
        });
      }
      case "custom": {
        const h = s, g = h.updateProvider;
        if (!g)
          throw (0, e.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new g(h, n, t);
      }
      default:
        throw (0, e.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return er;
}
var ar = {}, or = {}, Mt = {}, Bt = {}, dl;
function va() {
  if (dl) return Bt;
  dl = 1, Object.defineProperty(Bt, "__esModule", { value: !0 }), Bt.OperationKind = void 0, Bt.computeOperations = c;
  var e;
  (function(a) {
    a[a.COPY = 0] = "COPY", a[a.DOWNLOAD = 1] = "DOWNLOAD";
  })(e || (Bt.OperationKind = e = {}));
  function c(a, u, o) {
    const s = l(a.files), n = l(u.files);
    let t = null;
    const r = u.files[0], h = [], g = r.name, v = s.get(g);
    if (v == null)
      throw new Error(`no file ${g} in old blockmap`);
    const m = n.get(g);
    let w = 0;
    const { checksumToOffset: S, checksumToOldSize: b } = d(s.get(g), v.offset, o);
    let N = r.offset;
    for (let P = 0; P < m.checksums.length; N += m.sizes[P], P++) {
      const F = m.sizes[P], O = m.checksums[P];
      let L = S.get(O);
      L != null && b.get(O) !== F && (o.warn(`Checksum ("${O}") matches, but size differs (old: ${b.get(O)}, new: ${F})`), L = void 0), L === void 0 ? (w++, t != null && t.kind === e.DOWNLOAD && t.end === N ? t.end += F : (t = {
        kind: e.DOWNLOAD,
        start: N,
        end: N + F
        // oldBlocks: null,
      }, f(t, h, O, P))) : t != null && t.kind === e.COPY && t.end === L ? t.end += F : (t = {
        kind: e.COPY,
        start: L,
        end: L + F
        // oldBlocks: [checksum]
      }, f(t, h, O, P));
    }
    return w > 0 && o.info(`File${r.name === "file" ? "" : " " + r.name} has ${w} changed blocks`), h;
  }
  const p = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function f(a, u, o, s) {
    if (p && u.length !== 0) {
      const n = u[u.length - 1];
      if (n.kind === a.kind && a.start < n.end && a.start > n.start) {
        const t = [n.start, n.end, a.start, a.end].reduce((r, h) => r < h ? r : h);
        throw new Error(`operation (block index: ${s}, checksum: ${o}, kind: ${e[a.kind]}) overlaps previous operation (checksum: ${o}):
abs: ${n.start} until ${n.end} and ${a.start} until ${a.end}
rel: ${n.start - t} until ${n.end - t} and ${a.start - t} until ${a.end - t}`);
      }
    }
    u.push(a);
  }
  function d(a, u, o) {
    const s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
    let t = u;
    for (let r = 0; r < a.checksums.length; r++) {
      const h = a.checksums[r], g = a.sizes[r], v = n.get(h);
      if (v === void 0)
        s.set(h, t), n.set(h, g);
      else if (o.debug != null) {
        const m = v === g ? "(same size)" : `(size: ${v}, this size: ${g})`;
        o.debug(`${h} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      t += g;
    }
    return { checksumToOffset: s, checksumToOldSize: n };
  }
  function l(a) {
    const u = /* @__PURE__ */ new Map();
    for (const o of a)
      u.set(o.name, o);
    return u;
  }
  return Bt;
}
var hl;
function mu() {
  if (hl) return Mt;
  hl = 1, Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.DataSplitter = void 0, Mt.copyData = a;
  const e = xe(), c = vt, p = yr, f = va(), d = Buffer.from(`\r
\r
`);
  var l;
  (function(o) {
    o[o.INIT = 0] = "INIT", o[o.HEADER = 1] = "HEADER", o[o.BODY = 2] = "BODY";
  })(l || (l = {}));
  function a(o, s, n, t, r) {
    const h = (0, c.createReadStream)("", {
      fd: n,
      autoClose: !1,
      start: o.start,
      // end is inclusive
      end: o.end - 1
    });
    h.on("error", t), h.once("end", r), h.pipe(s, {
      end: !1
    });
  }
  let u = class extends p.Writable {
    constructor(s, n, t, r, h, g, v, m) {
      super(), this.out = s, this.options = n, this.partIndexToTaskIndex = t, this.partIndexToLength = h, this.finishHandler = g, this.grandTotalBytes = v, this.onProgress = m, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = l.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = r.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(s, n, t) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${s.length} bytes`);
        return;
      }
      this.handleData(s).then(() => {
        if (this.onProgress) {
          const r = Date.now();
          (r >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (r - this.start) / 1e3 && (this.nextUpdate = r + 1e3, this.onProgress({
            total: this.grandTotalBytes,
            delta: this.delta,
            transferred: this.transferred,
            percent: this.transferred / this.grandTotalBytes * 100,
            bytesPerSecond: Math.round(this.transferred / ((r - this.start) / 1e3))
          }), this.delta = 0);
        }
        t();
      }).catch(t);
    }
    async handleData(s) {
      let n = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, e.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const t = Math.min(this.ignoreByteCount, s.length);
        this.ignoreByteCount -= t, n = t;
      } else if (this.remainingPartDataCount > 0) {
        const t = Math.min(this.remainingPartDataCount, s.length);
        this.remainingPartDataCount -= t, await this.processPartData(s, 0, t), n = t;
      }
      if (n !== s.length) {
        if (this.readState === l.HEADER) {
          const t = this.searchHeaderListEnd(s, n);
          if (t === -1)
            return;
          n = t, this.readState = l.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === l.BODY)
            this.readState = l.INIT;
          else {
            this.partIndex++;
            let g = this.partIndexToTaskIndex.get(this.partIndex);
            if (g == null)
              if (this.isFinished)
                g = this.options.end;
              else
                throw (0, e.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const v = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (v < g)
              await this.copyExistingData(v, g);
            else if (v > g)
              throw (0, e.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (n = this.searchHeaderListEnd(s, n), n === -1) {
              this.readState = l.HEADER;
              return;
            }
          }
          const t = this.partIndexToLength[this.partIndex], r = n + t, h = Math.min(r, s.length);
          if (await this.processPartStarted(s, n, h), this.remainingPartDataCount = t - (h - n), this.remainingPartDataCount > 0)
            return;
          if (n = r + this.boundaryLength, n >= s.length) {
            this.ignoreByteCount = this.boundaryLength - (s.length - r);
            return;
          }
        }
      }
    }
    copyExistingData(s, n) {
      return new Promise((t, r) => {
        const h = () => {
          if (s === n) {
            t();
            return;
          }
          const g = this.options.tasks[s];
          if (g.kind !== f.OperationKind.COPY) {
            r(new Error("Task kind must be COPY"));
            return;
          }
          a(g, this.out, this.options.oldFileFd, r, () => {
            s++, h();
          });
        };
        h();
      });
    }
    searchHeaderListEnd(s, n) {
      const t = s.indexOf(d, n);
      if (t !== -1)
        return t + d.length;
      const r = n === 0 ? s : s.slice(n);
      return this.headerListBuffer == null ? this.headerListBuffer = r : this.headerListBuffer = Buffer.concat([this.headerListBuffer, r]), -1;
    }
    onPartEnd() {
      const s = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== s)
        throw (0, e.newError)(`Expected length: ${s} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(s, n, t) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(s, n, t);
    }
    processPartData(s, n, t) {
      this.actualPartLength += t - n, this.transferred += t - n, this.delta += t - n;
      const r = this.out;
      return r.write(n === 0 && s.length === t ? s : s.slice(n, t)) ? Promise.resolve() : new Promise((h, g) => {
        r.on("error", g), r.once("drain", () => {
          r.removeListener("error", g), h();
        });
      });
    }
  };
  return Mt.DataSplitter = u, Mt;
}
var sr = {}, pl;
function Wf() {
  if (pl) return sr;
  pl = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr.executeTasksUsingMultipleRangeRequests = f, sr.checkIsRangesSupported = l;
  const e = xe(), c = mu(), p = va();
  function f(a, u, o, s, n) {
    const t = (r) => {
      if (r >= u.length) {
        a.fileMetadataBuffer != null && o.write(a.fileMetadataBuffer), o.end();
        return;
      }
      const h = r + 1e3;
      d(a, {
        tasks: u,
        start: r,
        end: Math.min(u.length, h),
        oldFileFd: s
      }, o, () => t(h), n);
    };
    return t;
  }
  function d(a, u, o, s, n) {
    let t = "bytes=", r = 0, h = 0;
    const g = /* @__PURE__ */ new Map(), v = [];
    for (let S = u.start; S < u.end; S++) {
      const b = u.tasks[S];
      b.kind === p.OperationKind.DOWNLOAD && (t += `${b.start}-${b.end - 1}, `, g.set(r, S), r++, v.push(b.end - b.start), h += b.end - b.start);
    }
    if (r <= 1) {
      const S = (b) => {
        if (b >= u.end) {
          s();
          return;
        }
        const N = u.tasks[b++];
        if (N.kind === p.OperationKind.COPY)
          (0, c.copyData)(N, o, u.oldFileFd, n, () => S(b));
        else {
          const P = a.createRequestOptions();
          P.headers.Range = `bytes=${N.start}-${N.end - 1}`;
          const F = a.httpExecutor.createRequest(P, (O) => {
            O.on("error", n), l(O, n) && (O.pipe(o, {
              end: !1
            }), O.once("end", () => S(b)));
          });
          a.httpExecutor.addErrorAndTimeoutHandlers(F, n), F.end();
        }
      };
      S(u.start);
      return;
    }
    const m = a.createRequestOptions();
    m.headers.Range = t.substring(0, t.length - 2);
    const w = a.httpExecutor.createRequest(m, (S) => {
      if (!l(S, n))
        return;
      const b = (0, e.safeGetHeader)(S, "content-type"), N = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(b);
      if (N == null) {
        n(new Error(`Content-Type "multipart/byteranges" is expected, but got "${b}"`));
        return;
      }
      const P = new c.DataSplitter(o, u, g, N[1] || N[2], v, s, h, a.options.onProgress);
      P.on("error", n), S.pipe(P), S.on("end", () => {
        setTimeout(() => {
          w.abort(), n(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    a.httpExecutor.addErrorAndTimeoutHandlers(w, n), w.end();
  }
  function l(a, u) {
    if (a.statusCode >= 400)
      return u((0, e.createHttpError)(a)), !1;
    if (a.statusCode !== 206) {
      const o = (0, e.safeGetHeader)(a, "accept-ranges");
      if (o == null || o === "none")
        return u(new Error(`Server doesn't support Accept-Ranges (response code ${a.statusCode})`)), !1;
    }
    return !0;
  }
  return sr;
}
var lr = {}, ml;
function Vf() {
  if (ml) return lr;
  ml = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.ProgressDifferentialDownloadCallbackTransform = void 0;
  const e = yr;
  var c;
  (function(f) {
    f[f.COPY = 0] = "COPY", f[f.DOWNLOAD = 1] = "DOWNLOAD";
  })(c || (c = {}));
  let p = class extends e.Transform {
    constructor(d, l, a) {
      super(), this.progressDifferentialDownloadInfo = d, this.cancellationToken = l, this.onProgress = a, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = c.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(d, l, a) {
      if (this.cancellationToken.cancelled) {
        a(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == c.COPY) {
        a(null, d);
        return;
      }
      this.transferred += d.length, this.delta += d.length;
      const u = Date.now();
      u >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = u + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((u - this.start) / 1e3))
      }), this.delta = 0), a(null, d);
    }
    beginFileCopy() {
      this.operationType = c.COPY;
    }
    beginRangeDownload() {
      this.operationType = c.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(d) {
      if (this.cancellationToken.cancelled) {
        d(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, d(null);
    }
  };
  return lr.ProgressDifferentialDownloadCallbackTransform = p, lr;
}
var gl;
function gu() {
  if (gl) return or;
  gl = 1, Object.defineProperty(or, "__esModule", { value: !0 }), or.DifferentialDownloader = void 0;
  const e = xe(), c = /* @__PURE__ */ wt(), p = vt, f = mu(), d = yt, l = va(), a = Wf(), u = Vf();
  let o = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(r, h, g) {
      this.blockAwareFileInfo = r, this.httpExecutor = h, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const r = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, e.configureRequestUrl)(this.options.newUrl, r), (0, e.configureRequestOptions)(r), r;
    }
    doDownload(r, h) {
      if (r.version !== h.version)
        throw new Error(`version is different (${r.version} - ${h.version}), full download is required`);
      const g = this.logger, v = (0, l.computeOperations)(r, h, g);
      g.debug != null && g.debug(JSON.stringify(v, null, 2));
      let m = 0, w = 0;
      for (const b of v) {
        const N = b.end - b.start;
        b.kind === l.OperationKind.DOWNLOAD ? m += N : w += N;
      }
      const S = this.blockAwareFileInfo.size;
      if (m + w + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== S)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${w}, newSize: ${S}`);
      return g.info(`Full: ${s(S)}, To download: ${s(m)} (${Math.round(m / (S / 100))}%)`), this.downloadFile(v);
    }
    downloadFile(r) {
      const h = [], g = () => Promise.all(h.map((v) => (0, c.close)(v.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${v.path}": ${m}`);
      })));
      return this.doDownloadFile(r, h).then(g).catch((v) => g().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (w) {
          try {
            console.error(w);
          } catch {
          }
        }
        throw v;
      }).then(() => {
        throw v;
      }));
    }
    async doDownloadFile(r, h) {
      const g = await (0, c.open)(this.options.oldFile, "r");
      h.push({ descriptor: g, path: this.options.oldFile });
      const v = await (0, c.open)(this.options.newFile, "w");
      h.push({ descriptor: v, path: this.options.newFile });
      const m = (0, p.createWriteStream)(this.options.newFile, { fd: v });
      await new Promise((w, S) => {
        const b = [];
        let N;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const $ = [];
          let H = 0;
          for (const C of r)
            C.kind === l.OperationKind.DOWNLOAD && ($.push(C.end - C.start), H += C.end - C.start);
          const U = {
            expectedByteCounts: $,
            grandTotal: H
          };
          N = new u.ProgressDifferentialDownloadCallbackTransform(U, this.options.cancellationToken, this.options.onProgress), b.push(N);
        }
        const P = new e.DigestTransform(this.blockAwareFileInfo.sha512);
        P.isValidateOnEnd = !1, b.push(P), m.on("finish", () => {
          m.close(() => {
            h.splice(1, 1);
            try {
              P.validate();
            } catch ($) {
              S($);
              return;
            }
            w(void 0);
          });
        }), b.push(m);
        let F = null;
        for (const $ of b)
          $.on("error", S), F == null ? F = $ : F = F.pipe($);
        const O = b[0];
        let L;
        if (this.options.isUseMultipleRangeRequest) {
          L = (0, a.executeTasksUsingMultipleRangeRequests)(this, r, O, g, S), L(0);
          return;
        }
        let R = 0, Y = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const G = this.createRequestOptions();
        G.redirect = "manual", L = ($) => {
          var H, U;
          if ($ >= r.length) {
            this.fileMetadataBuffer != null && O.write(this.fileMetadataBuffer), O.end();
            return;
          }
          const C = r[$++];
          if (C.kind === l.OperationKind.COPY) {
            N && N.beginFileCopy(), (0, f.copyData)(C, O, g, S, () => L($));
            return;
          }
          const I = `bytes=${C.start}-${C.end - 1}`;
          G.headers.range = I, (U = (H = this.logger) === null || H === void 0 ? void 0 : H.debug) === null || U === void 0 || U.call(H, `download range: ${I}`), N && N.beginRangeDownload();
          const A = this.httpExecutor.createRequest(G, (k) => {
            k.on("error", S), k.on("aborted", () => {
              S(new Error("response has been aborted by the server"));
            }), k.statusCode >= 400 && S((0, e.createHttpError)(k)), k.pipe(O, {
              end: !1
            }), k.once("end", () => {
              N && N.endRangeDownload(), ++R === 100 ? (R = 0, setTimeout(() => L($), 1e3)) : L($);
            });
          });
          A.on("redirect", (k, M, W) => {
            this.logger.info(`Redirect to ${n(W)}`), Y = W, (0, e.configureRequestUrl)(new d.URL(Y), G), A.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(A, S), A.end();
        }, L(0);
      });
    }
    async readRemoteBytes(r, h) {
      const g = Buffer.allocUnsafe(h + 1 - r), v = this.createRequestOptions();
      v.headers.range = `bytes=${r}-${h}`;
      let m = 0;
      if (await this.request(v, (w) => {
        w.copy(g, m), m += w.length;
      }), m !== g.length)
        throw new Error(`Received data length ${m} is not equal to expected ${g.length}`);
      return g;
    }
    request(r, h) {
      return new Promise((g, v) => {
        const m = this.httpExecutor.createRequest(r, (w) => {
          (0, a.checkIsRangesSupported)(w, v) && (w.on("error", v), w.on("aborted", () => {
            v(new Error("response has been aborted by the server"));
          }), w.on("data", h), w.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, v), m.end();
      });
    }
  };
  or.DifferentialDownloader = o;
  function s(t, r = " KB") {
    return new Intl.NumberFormat("en").format((t / 1024).toFixed(2)) + r;
  }
  function n(t) {
    const r = t.indexOf("?");
    return r < 0 ? t : t.substring(0, r);
  }
  return or;
}
var El;
function Yf() {
  if (El) return ar;
  El = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.GenericDifferentialDownloader = void 0;
  const e = gu();
  let c = class extends e.DifferentialDownloader {
    download(f, d) {
      return this.doDownload(f, d);
    }
  };
  return ar.GenericDifferentialDownloader = c, ar;
}
var ea = {}, vl;
function Ft() {
  return vl || (vl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = f;
    const c = xe();
    Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return c.CancellationToken;
    } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
    class p {
      constructor(l) {
        this.emitter = l;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(l) {
        f(this.emitter, "login", l);
      }
      progress(l) {
        f(this.emitter, e.DOWNLOAD_PROGRESS, l);
      }
      updateDownloaded(l) {
        f(this.emitter, e.UPDATE_DOWNLOADED, l);
      }
      updateCancelled(l) {
        f(this.emitter, "update-cancelled", l);
      }
    }
    e.UpdaterSignal = p;
    function f(d, l, a) {
      d.on(l, a);
    }
  })(ea)), ea;
}
var yl;
function ya() {
  if (yl) return Ct;
  yl = 1, Object.defineProperty(Ct, "__esModule", { value: !0 }), Ct.NoOpLogger = Ct.AppUpdater = void 0;
  const e = xe(), c = wr, p = Gr, f = $l, d = /* @__PURE__ */ wt(), l = fa(), a = cf(), u = Ie, o = fu(), s = xf(), n = $f(), t = qf(), r = hu(), h = Gf(), g = Ml, v = Yf(), m = Ft();
  let w = class Eu extends f.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(P) {
      if (this._channel != null) {
        if (typeof P != "string")
          throw (0, e.newError)(`Channel must be a string, but got: ${P}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (P.length === 0)
          throw (0, e.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = P, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(P) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: P
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, t.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(P) {
      this._logger = P ?? new b();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(P) {
      this.clientPromise = null, this._appUpdateConfigPath = P, this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(P) {
      P && (this._isUpdateSupported = P);
    }
    /**
     * Allows developer to override default logic for determining if the user is below the rollout threshold.
     * The default logic compares the staging percentage with numerical representation of user ID.
     * An override can define custom logic, or bypass it if needed.
     */
    get isUserWithinRollout() {
      return this._isUserWithinRollout;
    }
    set isUserWithinRollout(P) {
      P && (this._isUserWithinRollout = P);
    }
    constructor(P, F) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (R) => this.checkIfUpdateSupported(R), this._isUserWithinRollout = (R) => this.isStagingMatch(R), this.clientPromise = null, this.stagingUserIdPromise = new a.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (R) => {
        this._logger.error(`Error: ${R.stack || R.message}`);
      }), F == null ? (this.app = new n.ElectronAppAdapter(), this.httpExecutor = new t.ElectronHttpExecutor((R, Y) => this.emit("login", R, Y))) : (this.app = F, this.httpExecutor = null);
      const O = this.app.version, L = (0, o.parse)(O);
      if (L == null)
        throw (0, e.newError)(`App version is not a valid semver version: "${O}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = L, this.allowPrerelease = S(L), P != null && (this.setFeedURL(P), typeof P != "string" && P.requestHeaders && (this.requestHeaders = P.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](https://www.electron.build/publish#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(P) {
      const F = this.createProviderRuntimeOptions();
      let O;
      typeof P == "string" ? O = new r.GenericProvider({ provider: "generic", url: P }, this, {
        ...F,
        isUseMultipleRangeRequest: (0, h.isUrlProbablySupportMultiRangeRequests)(P)
      }) : O = (0, h.createClient)(P, this, F), this.clientPromise = Promise.resolve(O);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let P = this.checkForUpdatesPromise;
      if (P != null)
        return this._logger.info("Checking for update (already in progress)"), P;
      const F = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), P = this.doCheckForUpdates().then((O) => (F(), O)).catch((O) => {
        throw F(), this.emit("error", O, `Cannot check for updates: ${(O.stack || O).toString()}`), O;
      }), this.checkForUpdatesPromise = P, P;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(P) {
      return this.checkForUpdates().then((F) => F?.downloadPromise ? (F.downloadPromise.then(() => {
        const O = Eu.formatDownloadNotification(F.updateInfo.version, this.app.name, P);
        new It.Notification(O).show();
      }), F) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), F));
    }
    static formatDownloadNotification(P, F, O) {
      return O == null && (O = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), O = {
        title: O.title.replace("{appName}", F).replace("{version}", P),
        body: O.body.replace("{appName}", F).replace("{version}", P)
      }, O;
    }
    async isStagingMatch(P) {
      const F = P.stagingPercentage;
      let O = F;
      if (O == null)
        return !0;
      if (O = parseInt(O, 10), isNaN(O))
        return this._logger.warn(`Staging percentage is NaN: ${F}`), !0;
      O = O / 100;
      const L = await this.stagingUserIdPromise.value, Y = e.UUID.parse(L).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${O}, percentage: ${Y}, user id: ${L}`), Y < O;
    }
    computeFinalHeaders(P) {
      return this.requestHeaders != null && Object.assign(P, this.requestHeaders), P;
    }
    async isUpdateAvailable(P) {
      const F = (0, o.parse)(P.version);
      if (F == null)
        throw (0, e.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${P.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const O = this.currentVersion;
      if ((0, o.eq)(F, O) || !await Promise.resolve(this.isUpdateSupported(P)) || !await Promise.resolve(this.isUserWithinRollout(P)))
        return !1;
      const R = (0, o.gt)(F, O), Y = (0, o.lt)(F, O);
      return R ? !0 : this.allowDowngrade && Y;
    }
    checkIfUpdateSupported(P) {
      const F = P?.minimumSystemVersion, O = (0, p.release)();
      if (F)
        try {
          if ((0, o.lt)(O, F))
            return this._logger.info(`Current OS version ${O} is less than the minimum OS version required ${F} for version ${O}`), !1;
        } catch (L) {
          this._logger.warn(`Failed to compare current OS version(${O}) with minimum OS version(${F}): ${(L.message || L).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((O) => (0, h.createClient)(O, this, this.createProviderRuntimeOptions())));
      const P = await this.clientPromise, F = await this.stagingUserIdPromise.value;
      return P.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": F })), {
        info: await P.getLatestVersion(),
        provider: P
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const P = await this.getUpdateInfoAndProvider(), F = P.info;
      if (!await this.isUpdateAvailable(F))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${F.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", F), {
          isUpdateAvailable: !1,
          versionInfo: F,
          updateInfo: F
        };
      this.updateInfoAndProvider = P, this.onUpdateAvailable(F);
      const O = new e.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: F,
        updateInfo: F,
        cancellationToken: O,
        downloadPromise: this.autoDownload ? this.downloadUpdate(O) : null
      };
    }
    onUpdateAvailable(P) {
      this._logger.info(`Found version ${P.version} (url: ${(0, e.asArray)(P.files).map((F) => F.url).join(", ")})`), this.emit("update-available", P);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(P = new e.CancellationToken()) {
      const F = this.updateInfoAndProvider;
      if (F == null) {
        const L = new Error("Please check update first");
        return this.dispatchError(L), Promise.reject(L);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, e.asArray)(F.info.files).map((L) => L.url).join(", ")}`);
      const O = (L) => {
        if (!(L instanceof e.CancellationError))
          try {
            this.dispatchError(L);
          } catch (R) {
            this._logger.warn(`Cannot dispatch error event: ${R.stack || R}`);
          }
        return L;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: F,
        requestHeaders: this.computeRequestHeaders(F.provider),
        cancellationToken: P,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((L) => {
        throw O(L);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(P) {
      this.emit("error", P, (P.stack || P).toString());
    }
    dispatchUpdateDownloaded(P) {
      this.emit(m.UPDATE_DOWNLOADED, P);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, l.load)(await (0, d.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(P) {
      const F = P.fileExtraDownloadHeaders;
      if (F != null) {
        const O = this.requestHeaders;
        return O == null ? F : {
          ...F,
          ...O
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const P = u.join(this.app.userDataPath, ".updaterId");
      try {
        const O = await (0, d.readFile)(P, "utf-8");
        if (e.UUID.check(O))
          return O;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${O}`);
      } catch (O) {
        O.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${O}`);
      }
      const F = e.UUID.v5((0, c.randomBytes)(4096), e.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${F}`);
      try {
        await (0, d.outputFile)(P, F);
      } catch (O) {
        this._logger.warn(`Couldn't write out staging user ID: ${O}`);
      }
      return F;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const P = this.requestHeaders;
      if (P == null)
        return !0;
      for (const F of Object.keys(P)) {
        const O = F.toLowerCase();
        if (O === "authorization" || O === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let P = this.downloadedUpdateHelper;
      if (P == null) {
        const F = (await this.configOnDisk.value).updaterCacheDirName, O = this._logger;
        F == null && O.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const L = u.join(this.app.baseCachePath, F || this.app.name);
        O.debug != null && O.debug(`updater cache dir: ${L}`), P = new s.DownloadedUpdateHelper(L), this.downloadedUpdateHelper = P;
      }
      return P;
    }
    async executeDownload(P) {
      const F = P.fileInfo, O = {
        headers: P.downloadUpdateOptions.requestHeaders,
        cancellationToken: P.downloadUpdateOptions.cancellationToken,
        sha2: F.info.sha2,
        sha512: F.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (O.onProgress = (te) => this.emit(m.DOWNLOAD_PROGRESS, te));
      const L = P.downloadUpdateOptions.updateInfoAndProvider.info, R = L.version, Y = F.packageInfo;
      function G() {
        const te = decodeURIComponent(P.fileInfo.url.pathname);
        return te.toLowerCase().endsWith(`.${P.fileExtension.toLowerCase()}`) ? u.basename(te) : u.basename(P.fileInfo.info.url);
      }
      const $ = await this.getOrCreateDownloadHelper(), H = $.cacheDirForPendingUpdate;
      await (0, d.mkdir)(H, { recursive: !0 });
      const U = G();
      let C = u.join(H, U);
      const I = Y == null ? null : u.join(H, `package-${R}${u.extname(Y.path) || ".7z"}`), A = async (te) => {
        await $.setDownloadedFile(C, I, L, F, U, te), await P.done({
          ...L,
          downloadedFile: C
        });
        const he = u.join(H, "current.blockmap");
        return await (0, d.pathExists)(he) && await (0, d.copyFile)(he, u.join($.cacheDir, "current.blockmap")), I == null ? [C] : [C, I];
      }, k = this._logger, M = await $.validateDownloadedPath(C, L, F, k);
      if (M != null)
        return C = M, await A(!1);
      const W = async () => (await $.clear().catch(() => {
      }), await (0, d.unlink)(C).catch(() => {
      })), ie = await (0, s.createTempUpdateFile)(`temp-${U}`, H, k);
      try {
        await P.task(ie, O, I, W), await (0, e.retry)(() => (0, d.rename)(ie, C), {
          retries: 60,
          interval: 500,
          shouldRetry: (te) => te instanceof Error && /^EBUSY:/.test(te.message) ? !0 : (k.warn(`Cannot rename temp file to final file: ${te.message || te.stack}`), !1)
        });
      } catch (te) {
        throw await W(), te instanceof e.CancellationError && (k.info("cancelled"), this.emit("update-cancelled", L)), te;
      }
      return k.info(`New version ${R} has been downloaded to ${C}`), await A(!0);
    }
    async differentialDownloadInstaller(P, F, O, L, R) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const Y = F.updateInfoAndProvider.provider, G = await Y.getBlockMapFiles(P.url, this.app.version, F.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
        this._logger.info(`Download block maps (old: "${G[0]}", new: ${G[1]})`);
        const $ = async (k) => {
          const M = await this.httpExecutor.downloadToBuffer(k, {
            headers: F.requestHeaders,
            cancellationToken: F.cancellationToken
          });
          if (M == null || M.length === 0)
            throw new Error(`Blockmap "${k.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(M).toString());
          } catch (W) {
            throw new Error(`Cannot parse blockmap "${k.href}", error: ${W}`);
          }
        }, H = {
          newUrl: P.url,
          oldFile: u.join(this.downloadedUpdateHelper.cacheDir, R),
          logger: this._logger,
          newFile: O,
          isUseMultipleRangeRequest: Y.isUseMultipleRangeRequest,
          requestHeaders: F.requestHeaders,
          cancellationToken: F.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (H.onProgress = (k) => this.emit(m.DOWNLOAD_PROGRESS, k));
        const U = async (k, M) => {
          const W = u.join(M, "current.blockmap");
          await (0, d.outputFile)(W, (0, g.gzipSync)(JSON.stringify(k)));
        }, C = async (k) => {
          const M = u.join(k, "current.blockmap");
          try {
            if (await (0, d.pathExists)(M))
              return JSON.parse((0, g.gunzipSync)(await (0, d.readFile)(M)).toString());
          } catch (W) {
            this._logger.warn(`Cannot parse blockmap "${M}", error: ${W}`);
          }
          return null;
        }, I = await $(G[1]);
        await U(I, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
        let A = await C(this.downloadedUpdateHelper.cacheDir);
        return A == null && (A = await $(G[0])), await new v.GenericDifferentialDownloader(P.info, this.httpExecutor, H).download(A, I), !1;
      } catch (Y) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${Y.stack || Y}`), this._testOnlyOptions != null)
          throw Y;
        return !0;
      }
    }
  };
  Ct.AppUpdater = w;
  function S(N) {
    const P = (0, o.prerelease)(N);
    return P != null && P.length > 0;
  }
  class b {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(P) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(P) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(P) {
    }
  }
  return Ct.NoOpLogger = b, Ct;
}
var wl;
function Qr() {
  if (wl) return zt;
  wl = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.BaseUpdater = void 0;
  const e = Hr, c = Ie, p = ya();
  let f = class extends p.AppUpdater {
    constructor(l, a) {
      super(l, a), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(l = !1, a = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(l, l ? a : this.autoRunAppAfterInstall) ? setImmediate(() => {
        It.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(l) {
      return super.executeDownload({
        ...l,
        done: (a) => (this.dispatchUpdateDownloaded(a), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(l = !1, a = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const u = this.downloadedUpdateHelper, o = this.installerPath, s = u == null ? null : u.downloadedFileInfo;
      if (o == null || s == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${l}, isForceRunAfter: ${a}`), this.doInstall({
          isSilent: l,
          isForceRunAfter: a,
          isAdminRightsRequired: s.isAdminRightsRequired
        });
      } catch (n) {
        return this.dispatchError(n), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((l) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (l !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${l}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    /**
     * Strips relative-path entries from a PATH string.
     * Prevents PATH-poisoning where a writable directory earlier in PATH shadows
     * a trusted package manager binary.
     */
    sanitizeEnvPath(l) {
      return l.split(c.delimiter).filter((a) => c.isAbsolute(a)).join(c.delimiter);
    }
    spawnSyncLog(l, a = [], u = {}) {
      var o;
      this._logger.info(`Executing: ${l} with args: ${a}`);
      const s = { ...process.env, ...u }, n = (0, e.spawnSync)(l, a, {
        env: { ...s, PATH: this.sanitizeEnvPath((o = s.PATH) !== null && o !== void 0 ? o : "") },
        encoding: "utf-8",
        shell: !0
      }), { error: t, status: r, stdout: h, stderr: g } = n;
      if (t != null)
        throw this._logger.error(g), t;
      if (r != null && r !== 0)
        throw this._logger.error(g), new Error(`Command ${l} exited with code ${r}`);
      return h.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(l, a = [], u = void 0, o = "ignore") {
      return this._logger.info(`Executing: ${l} with args: ${a}`), new Promise((s, n) => {
        try {
          const t = { stdio: o, env: u, detached: !0 }, r = (0, e.spawn)(l, a, t);
          r.on("error", (h) => {
            n(h);
          }), r.unref(), r.pid !== void 0 && s(!0);
        } catch (t) {
          n(t);
        }
      });
    }
  };
  return zt.BaseUpdater = f, zt;
}
var ur = {}, cr = {}, _l;
function vu() {
  if (_l) return cr;
  _l = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const e = /* @__PURE__ */ wt(), c = gu(), p = Ml;
  let f = class extends c.DifferentialDownloader {
    async download() {
      const u = this.blockAwareFileInfo, o = u.size, s = o - (u.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(s, o - 1);
      const n = d(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await l(this.options.oldFile), n);
    }
  };
  cr.FileWithEmbeddedBlockMapDifferentialDownloader = f;
  function d(a) {
    return JSON.parse((0, p.inflateRawSync)(a).toString());
  }
  async function l(a) {
    const u = await (0, e.open)(a, "r");
    try {
      const o = (await (0, e.fstat)(u)).size, s = Buffer.allocUnsafe(4);
      await (0, e.read)(u, s, 0, s.length, o - s.length);
      const n = Buffer.allocUnsafe(s.readUInt32BE(0));
      return await (0, e.read)(u, n, 0, n.length, o - s.length - n.length), await (0, e.close)(u), d(n);
    } catch (o) {
      throw await (0, e.close)(u), o;
    }
  }
  return cr;
}
var Rl;
function Al() {
  if (Rl) return ur;
  Rl = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.AppImageUpdater = void 0;
  const e = xe(), c = Hr, p = /* @__PURE__ */ wt(), f = vt, d = Ie, l = Qr(), a = vu(), u = ze(), o = Ft();
  let s = class extends l.BaseUpdater {
    constructor(t, r) {
      super(t, r);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(t) {
      const r = t.updateInfoAndProvider.provider, h = (0, u.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: h,
        downloadUpdateOptions: t,
        task: async (g, v) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (t.disableDifferentialDownload || await this.downloadDifferential(h, m, g, r, t)) && await this.httpExecutor.download(h.url, g, v), await (0, p.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(t, r, h, g, v) {
      try {
        const m = {
          newUrl: t.url,
          oldFile: r,
          logger: this._logger,
          newFile: h,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: v.requestHeaders,
          cancellationToken: v.cancellationToken
        };
        return this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (w) => this.emit(o.DOWNLOAD_PROGRESS, w)), await new a.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(t) {
      const r = process.env.APPIMAGE;
      if (r == null)
        throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      if (!d.isAbsolute(r) || r.includes("\0"))
        throw (0, e.newError)(`APPIMAGE env is not a valid absolute path: "${r}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, f.unlinkSync)(r);
      let h;
      const g = d.basename(r), v = this.installerPath;
      if (v == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      d.basename(v) === g || !/\d+\.\d+\.\d+/.test(g) ? h = r : h = d.join(d.dirname(r), d.basename(v)), (0, c.execFileSync)("mv", ["-f", v, h]), h !== r && this.emit("appimage-filename-updated", h);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return t.isForceRunAfter ? this.spawnLog(h, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, c.execFileSync)(h, [], { env: m })), !0;
    }
  };
  return ur.AppImageUpdater = s, ur;
}
var fr = {}, dr = {}, Sl;
function wa() {
  if (Sl) return dr;
  Sl = 1, Object.defineProperty(dr, "__esModule", { value: !0 }), dr.LinuxUpdater = void 0;
  const e = Qr(), c = /^[a-zA-Z0-9_-]+$/;
  let p = class extends e.BaseUpdater {
    constructor(d, l) {
      super(d, l);
    }
    /**
     * Returns true if the current process is running as root.
     */
    isRunningAsRoot() {
      var d;
      return ((d = process.getuid) === null || d === void 0 ? void 0 : d.call(process)) === 0;
    }
    /**
     * Sanitizes the installer path for use with shell:true spawn calls.
     * Backslash-escapes metacharacters that have special meaning in POSIX shell.
     * Note: paths containing single-quotes (') are not supported.
     */
    get installerPath() {
      const d = super.installerPath;
      return d == null ? null : d.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
    }
    runCommandWithSudoIfNeeded(d) {
      if (this.isRunningAsRoot())
        return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(d[0], d.slice(1));
      const { name: l } = this.app, u = `"${l.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, o = this.sudoWithArgs(u);
      this._logger.info(`Running as non-root user, using sudo to install: ${o}`);
      let s = '"';
      return (/pkexec/i.test(o[0]) || o[0] === "sudo") && (s = ""), this.spawnSyncLog(o[0], [...o.length > 1 ? o.slice(1) : [], `${s}/bin/bash`, "-c", `'${d.join(" ")}'${s}`]);
    }
    sudoWithArgs(d) {
      const l = this.determineSudoCommand(), a = [l];
      return /kdesudo/i.test(l) ? (a.push("--comment", d), a.push("-c")) : /gksudo/i.test(l) ? a.push("--message", d) : /pkexec/i.test(l) && a.push("--disable-internal-agent"), a;
    }
    hasCommand(d) {
      try {
        return this.spawnSyncLog("command", ["-v", d]), !0;
      } catch {
        return !1;
      }
    }
    determineSudoCommand() {
      const d = ["gksudo", "kdesudo", "pkexec", "beesu"];
      for (const l of d)
        if (this.hasCommand(l))
          return l;
      return "sudo";
    }
    /**
     * Detects the package manager to use based on the available commands.
     * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
     * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
     * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
     * @param pms - An array of package manager commands to check for, in priority order.
     * @returns The detected package manager command or "unknown" if none are found.
     */
    detectPackageManager(d) {
      var l;
      let a = d;
      const u = (l = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || l === void 0 ? void 0 : l.trim();
      u && (c.test(u) ? a = [u] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${u}" contains unsafe characters. Ignoring override.`));
      for (const n of a)
        if (this.hasCommand(n))
          return n;
      const o = u ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${u}", ` : "", s = d[0];
      return this._logger.warn(`No package manager found in the list: ${o}${d.join(", ")}. Utilizing default: ${s}`), s;
    }
  };
  return dr.LinuxUpdater = p, dr;
}
var Tl;
function bl() {
  if (Tl) return fr;
  Tl = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.DebUpdater = void 0;
  const e = ze(), c = Ft(), p = wa();
  let f = class yu extends p.LinuxUpdater {
    constructor(l, a) {
      super(l, a);
    }
    /*** @private */
    doDownloadUpdate(l) {
      const a = l.updateInfoAndProvider.provider, u = (0, e.findFile)(a.resolveFiles(l.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: u,
        downloadUpdateOptions: l,
        task: async (o, s) => {
          this.listenerCount(c.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (n) => this.emit(c.DOWNLOAD_PROGRESS, n)), await this.httpExecutor.download(u.url, o, s);
        }
      });
    }
    doInstall(l) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
        return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
      const u = ["dpkg", "apt"], o = this.detectPackageManager(u);
      try {
        yu.installWithCommandRunner(o, a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (s) {
        return this.dispatchError(s), !1;
      }
      return l.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(l, a, u, o) {
      var s;
      if (l === "dpkg")
        try {
          u(["dpkg", "-i", a]);
        } catch (n) {
          o.warn((s = n.message) !== null && s !== void 0 ? s : n), o.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), u(["apt-get", "install", "-f", "-y"]);
        }
      else if (l === "apt")
        o.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), u([
          "apt",
          "install",
          "-y",
          "--allow-unauthenticated",
          // needed for unsigned .debs
          "--allow-downgrades",
          // allow lower version installs
          "--allow-change-held-packages",
          a
        ]);
      else
        throw new Error(`Package manager ${l} not supported`);
    }
  };
  return fr.DebUpdater = f, fr;
}
var hr = {}, Cl;
function Pl() {
  if (Cl) return hr;
  Cl = 1, Object.defineProperty(hr, "__esModule", { value: !0 }), hr.PacmanUpdater = void 0;
  const e = Ft(), c = ze(), p = wa();
  let f = class wu extends p.LinuxUpdater {
    constructor(l, a) {
      super(l, a);
    }
    /*** @private */
    doDownloadUpdate(l) {
      const a = l.updateInfoAndProvider.provider, u = (0, c.findFile)(a.resolveFiles(l.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: u,
        downloadUpdateOptions: l,
        task: async (o, s) => {
          this.listenerCount(e.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (n) => this.emit(e.DOWNLOAD_PROGRESS, n)), await this.httpExecutor.download(u.url, o, s);
        }
      });
    }
    doInstall(l) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      try {
        wu.installWithCommandRunner(a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (u) {
        return this.dispatchError(u), !1;
      }
      return l.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(l, a, u) {
      var o;
      try {
        a(["pacman", "-U", "--noconfirm", l]);
      } catch (s) {
        u.warn((o = s.message) !== null && o !== void 0 ? o : s), u.warn("pacman installation failed, attempting to update package database and retry");
        try {
          a(["pacman", "-Sy", "--noconfirm"]), a(["pacman", "-U", "--noconfirm", l]);
        } catch (n) {
          throw u.error("Retry after pacman -Sy failed"), n;
        }
      }
    }
  };
  return hr.PacmanUpdater = f, hr;
}
var pr = {}, Ol;
function Il() {
  if (Ol) return pr;
  Ol = 1, Object.defineProperty(pr, "__esModule", { value: !0 }), pr.RpmUpdater = void 0;
  const e = Ft(), c = ze(), p = wa();
  let f = class _u extends p.LinuxUpdater {
    constructor(l, a) {
      super(l, a);
    }
    /*** @private */
    doDownloadUpdate(l) {
      const a = l.updateInfoAndProvider.provider, u = (0, c.findFile)(a.resolveFiles(l.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: u,
        downloadUpdateOptions: l,
        task: async (o, s) => {
          this.listenerCount(e.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (n) => this.emit(e.DOWNLOAD_PROGRESS, n)), await this.httpExecutor.download(u.url, o, s);
        }
      });
    }
    doInstall(l) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const u = ["zypper", "dnf", "yum", "rpm"], o = this.detectPackageManager(u);
      try {
        _u.installWithCommandRunner(o, a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (s) {
        return this.dispatchError(s), !1;
      }
      return l.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(l, a, u, o) {
      if (l === "zypper")
        return u(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", a]);
      if (l === "dnf")
        return u(["dnf", "install", "--nogpgcheck", "-y", a]);
      if (l === "yum")
        return u(["yum", "install", "--nogpgcheck", "-y", a]);
      if (l === "rpm")
        return o.warn("Installing with rpm only (no dependency resolution)."), u(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", a]);
      throw new Error(`Package manager ${l} not supported`);
    }
  };
  return pr.RpmUpdater = f, pr;
}
var mr = {}, Nl;
function Dl() {
  if (Nl) return mr;
  Nl = 1, Object.defineProperty(mr, "__esModule", { value: !0 }), mr.MacUpdater = void 0;
  const e = xe(), c = /* @__PURE__ */ wt(), p = vt, f = Ie, d = vc, l = ya(), a = ze(), u = Hr, o = wr;
  let s = class Ru extends l.AppUpdater {
    constructor(t, r) {
      super(t, r), this.nativeUpdater = It.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (h) => {
        this._logger.warn(h), this.emit("error", h);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    /** Filters update files to the appropriate architecture.
     * On arm64 Macs (including Rosetta), arm64 files are preferred when available.
     * On x64 Macs, arm64 files are excluded. */
    static filterFilesForArch(t, r) {
      const h = (g) => {
        var v;
        return g.url.pathname.includes("arm64") || ((v = g.info.url) === null || v === void 0 ? void 0 : v.includes("arm64"));
      };
      return r && t.some(h) ? t.filter((g) => r === h(g)) : t.filter((g) => !h(g));
    }
    debug(t) {
      this._logger.debug != null && this._logger.debug(t);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
        t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(t) {
      let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
      const h = this._logger, g = "sysctl.proc_translated";
      let v = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), v = (0, u.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), h.info(`Checked for macOS Rosetta environment (isRosetta=${v})`);
      } catch (N) {
        h.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${N}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const P = (0, u.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        h.info(`Checked 'uname -a': arm64=${P}`), m = m || P;
      } catch (N) {
        h.warn(`uname shell command to check for arm64 failed: ${N}`);
      }
      m = m || process.arch === "arm64" || v, r = Ru.filterFilesForArch(r, m);
      const w = (0, a.findFile)(r, "zip", ["pkg", "dmg"]);
      if (w == null)
        throw (0, e.newError)(`ZIP file not provided: ${(0, e.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const S = t.updateInfoAndProvider.provider, b = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: w,
        downloadUpdateOptions: t,
        task: async (N, P) => {
          const F = f.join(this.downloadedUpdateHelper.cacheDir, b), O = () => (0, c.pathExistsSync)(F) ? !t.disableDifferentialDownload : (h.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let L = !0;
          O() && (L = await this.differentialDownloadInstaller(w, t, N, S, b)), L && await this.httpExecutor.download(w.url, N, P);
        },
        done: async (N) => {
          if (!t.disableDifferentialDownload)
            try {
              const P = f.join(this.downloadedUpdateHelper.cacheDir, b);
              await (0, c.copyFile)(N.downloadedFile, P);
            } catch (P) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${P.message}`);
            }
          return this.updateDownloaded(w, N);
        }
      });
    }
    async updateDownloaded(t, r) {
      var h;
      const g = r.downloadedFile, v = (h = t.info.size) !== null && h !== void 0 ? h : (await (0, c.stat)(g)).size, m = this._logger, w = `fileToProxy=${t.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${w})`), this.server = (0, d.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${w})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${w})`);
      });
      const S = (b) => {
        const N = b.address();
        return typeof N == "string" ? N : `http://127.0.0.1:${N?.port}`;
      };
      return await new Promise((b, N) => {
        const P = (0, o.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), F = Buffer.from(`autoupdater:${P}`, "ascii"), O = `/${(0, o.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (L, R) => {
          const Y = L.url;
          if (m.info(`${Y} requested`), Y === "/") {
            if (!L.headers.authorization || L.headers.authorization.indexOf("Basic ") === -1) {
              R.statusCode = 401, R.statusMessage = "Invalid Authentication Credentials", R.end(), m.warn("No authenthication info");
              return;
            }
            const H = L.headers.authorization.split(" ")[1], U = Buffer.from(H, "base64").toString("ascii"), [C, I] = U.split(":");
            if (C !== "autoupdater" || I !== P) {
              R.statusCode = 401, R.statusMessage = "Invalid Authentication Credentials", R.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const A = Buffer.from(`{ "url": "${S(this.server)}${O}" }`);
            R.writeHead(200, { "Content-Type": "application/json", "Content-Length": A.length }), R.end(A);
            return;
          }
          if (!Y.startsWith(O)) {
            m.warn(`${Y} requested, but not supported`), R.writeHead(404), R.end();
            return;
          }
          m.info(`${O} requested by Squirrel.Mac, pipe ${g}`);
          let G = !1;
          R.on("finish", () => {
            G || (this.nativeUpdater.removeListener("error", N), b([]));
          });
          const $ = (0, p.createReadStream)(g);
          $.on("error", (H) => {
            try {
              R.end();
            } catch (U) {
              m.warn(`cannot end response: ${U}`);
            }
            G = !0, this.nativeUpdater.removeListener("error", N), N(new Error(`Cannot pipe "${g}": ${H}`));
          }), R.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": v
          }), $.pipe(R);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${w})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${S(this.server)}, ${w})`), this.nativeUpdater.setFeedURL({
            url: S(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${F.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", N), this.nativeUpdater.checkForUpdates()) : b([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return mr.MacUpdater = s, mr;
}
var gr = {}, jr = {}, Fl;
function zf() {
  if (Fl) return jr;
  Fl = 1, Object.defineProperty(jr, "__esModule", { value: !0 }), jr.verifySignature = l;
  const e = xe(), c = Hr, p = Gr, f = Ie;
  function d(s, n) {
    return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", s], {
      shell: !0,
      timeout: n
    }];
  }
  function l(s, n, t) {
    return new Promise((r, h) => {
      const g = n.replace(/'/g, "''");
      t.info(`Verifying signature ${g}`), (0, c.execFile)(...d(`"Get-AuthenticodeSignature -LiteralPath '${g}' | ConvertTo-Json -Compress"`, 20 * 1e3), (v, m, w) => {
        var S;
        try {
          if (v != null || w) {
            u(t, v, w, h), r(null);
            return;
          }
          const b = a(m);
          if (b.Status === 0) {
            try {
              const O = f.normalize(b.Path), L = f.normalize(n);
              if (t.info(`LiteralPath: ${O}. Update Path: ${L}`), O !== L) {
                u(t, new Error(`LiteralPath of ${O} is different than ${L}`), w, h), r(null);
                return;
              }
            } catch (O) {
              t.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(S = O.message) !== null && S !== void 0 ? S : O.stack}`);
            }
            const P = (0, e.parseDn)(b.SignerCertificate.Subject);
            let F = !1;
            for (const O of s) {
              const L = (0, e.parseDn)(O);
              if (L.size ? F = Array.from(L.keys()).every((Y) => L.get(Y) === P.get(Y)) : O === P.get("CN") && (t.warn(`Signature validated using only CN ${O}. Please add your full Distinguished Name (DN) to publisherNames configuration`), F = !0), F) {
                r(null);
                return;
              }
            }
          }
          const N = `publisherNames: ${s.join(" | ")}, raw info: ` + JSON.stringify(b, (P, F) => P === "RawData" ? void 0 : F, 2);
          t.warn(`Sign verification failed, installer signed with incorrect certificate: ${N}`), r(N);
        } catch (b) {
          u(t, b, null, h), r(null);
          return;
        }
      });
    });
  }
  function a(s) {
    const n = JSON.parse(s);
    delete n.PrivateKey, delete n.IsOSBinary, delete n.SignatureType;
    const t = n.SignerCertificate;
    return t != null && (delete t.Archived, delete t.Extensions, delete t.Handle, delete t.HasPrivateKey, delete t.SubjectName), n;
  }
  function u(s, n, t, r) {
    if (o()) {
      s.warn(`Cannot execute Get-AuthenticodeSignature: ${n || t}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, c.execFileSync)(...d("ConvertTo-Json test", 10 * 1e3));
    } catch (h) {
      s.warn(`Cannot execute ConvertTo-Json: ${h.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    n != null && r(n), t && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${t}. Failing signature validation due to unknown stderr.`));
  }
  function o() {
    const s = p.release();
    return s.startsWith("6.") && !s.startsWith("6.3");
  }
  return jr;
}
var Ll;
function Ul() {
  if (Ll) return gr;
  Ll = 1, Object.defineProperty(gr, "__esModule", { value: !0 }), gr.NsisUpdater = void 0;
  const e = xe(), c = Ie, p = Qr(), f = vu(), d = Ft(), l = ze(), a = /* @__PURE__ */ wt(), u = zf(), o = yt;
  let s = class extends p.BaseUpdater {
    constructor(t, r) {
      super(t, r), this._verifyUpdateCodeSignature = (h, g) => (0, u.verifySignature)(h, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(t) {
      t && (this._verifyUpdateCodeSignature = t);
    }
    /*** @private */
    doDownloadUpdate(t) {
      const r = t.updateInfoAndProvider.provider, h = (0, l.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: t,
        fileInfo: h,
        task: async (g, v, m, w) => {
          const S = h.packageInfo, b = S != null && m != null;
          if (b && t.disableWebInstaller)
            throw (0, e.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !b && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (b || t.disableDifferentialDownload || await this.differentialDownloadInstaller(h, t, g, r, e.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(h.url, g, v);
          const N = await this.verifySignature(g);
          if (N != null)
            throw await w(), (0, e.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${N}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (b && await this.differentialDownloadWebPackage(t, S, m, r))
            try {
              await this.httpExecutor.download(new o.URL(S.path), m, {
                headers: t.requestHeaders,
                cancellationToken: t.cancellationToken,
                sha512: S.sha512
              });
            } catch (P) {
              try {
                await (0, a.unlink)(m);
              } catch {
              }
              throw P;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(t) {
      let r;
      try {
        if (r = (await this.configOnDisk.value).publisherName, r == null)
          return null;
      } catch (h) {
        if (h.code === "ENOENT")
          return null;
        throw h;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
    }
    doInstall(t) {
      const r = this.installerPath;
      if (r == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const h = ["--updated"];
      t.isSilent && h.push("/S"), t.isForceRunAfter && h.push("--force-run"), this.installDirectory && h.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && h.push(`--package-file=${g}`);
      const v = () => {
        this.spawnLog(c.join(process.resourcesPath, "elevate.exe"), [r].concat(h)).catch((m) => this.dispatchError(m));
      };
      return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), v(), !0) : (this.spawnLog(r, h).catch((m) => {
        const w = m.code;
        this._logger.info(`Cannot run installer: error code: ${w}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), w === "UNKNOWN" || w === "EACCES" ? v() : w === "ENOENT" ? It.shell.openPath(r).catch((S) => this.dispatchError(S)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(t, r, h, g) {
      if (r.blockMapSize == null)
        return !0;
      try {
        const v = {
          newUrl: new o.URL(r.path),
          oldFile: c.join(this.downloadedUpdateHelper.cacheDir, e.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: h,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: t.cancellationToken
        };
        this.listenerCount(d.DOWNLOAD_PROGRESS) > 0 && (v.onProgress = (m) => this.emit(d.DOWNLOAD_PROGRESS, m)), await new f.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, v).download();
      } catch (v) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${v.stack || v}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return gr.NsisUpdater = s, gr;
}
var xl;
function Xf() {
  return xl || (xl = 1, (function(e) {
    var c = bt && bt.__createBinding || (Object.create ? (function(m, w, S, b) {
      b === void 0 && (b = S);
      var N = Object.getOwnPropertyDescriptor(w, S);
      (!N || ("get" in N ? !w.__esModule : N.writable || N.configurable)) && (N = { enumerable: !0, get: function() {
        return w[S];
      } }), Object.defineProperty(m, b, N);
    }) : (function(m, w, S, b) {
      b === void 0 && (b = S), m[b] = w[S];
    })), p = bt && bt.__exportStar || function(m, w) {
      for (var S in m) S !== "default" && !Object.prototype.hasOwnProperty.call(w, S) && c(w, m, S);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
    const f = /* @__PURE__ */ wt(), d = Ie;
    var l = Qr();
    Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
      return l.BaseUpdater;
    } });
    var a = ya();
    Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
      return a.AppUpdater;
    } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
      return a.NoOpLogger;
    } });
    var u = ze();
    Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
      return u.Provider;
    } });
    var o = Al();
    Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
      return o.AppImageUpdater;
    } });
    var s = bl();
    Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
      return s.DebUpdater;
    } });
    var n = Pl();
    Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
      return n.PacmanUpdater;
    } });
    var t = Il();
    Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
      return t.RpmUpdater;
    } });
    var r = Dl();
    Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
      return r.MacUpdater;
    } });
    var h = Ul();
    Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
      return h.NsisUpdater;
    } }), p(Ft(), e);
    let g;
    function v() {
      if (process.platform === "win32")
        g = new (Ul()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (Dl()).MacUpdater();
      else {
        g = new (Al()).AppImageUpdater();
        try {
          const m = d.join(process.resourcesPath, "package-type");
          if (!(0, f.existsSync)(m))
            return g;
          switch ((0, f.readFileSync)(m).toString().trim()) {
            case "deb":
              g = new (bl()).DebUpdater();
              break;
            case "rpm":
              g = new (Il()).RpmUpdater();
              break;
            case "pacman":
              g = new (Pl()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (m) {
          console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", m.message);
        }
      }
      return g;
    }
    Object.defineProperty(e, "autoUpdater", {
      enumerable: !0,
      get: () => g || v()
    });
  })(bt)), bt;
}
var Ze = Xf();
const ra = ut.dirname(_c(import.meta.url));
process.env.APP_ROOT = ut.join(ra, "..");
const Kf = wc(yc), Et = process.env.VITE_DEV_SERVER_URL, Md = ut.join(process.env.APP_ROOT, "dist-electron"), na = ut.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Et ? ut.join(process.env.APP_ROOT, "public") : na;
const Jf = ut.join(vr.getPath("userData"), "main.log");
function se(...e) {
  console.log(...e);
  try {
    ta.appendFileSync(
      Jf,
      `${e.map(
        (c) => typeof c == "object" ? JSON.stringify(c) : String(c)
      ).join(" ")}
`
    );
  } catch (c) {
    console.error("Failed to write log file:", c);
  }
}
function Qf() {
  if (Et) {
    se("[Updater] Development mode - updater disabled.");
    return;
  }
  se("[Updater] GH_TOKEN present:", !!process.env.GH_TOKEN_HOTEL), Ze.autoUpdater.autoDownload = !1, Ze.autoUpdater.autoInstallOnAppQuit = !1, Ze.autoUpdater.on("update-available", (e) => {
    se("[Updater] Update available:", e.version), $e?.webContents.send("updater:update-available", {
      version: e.version,
      releaseDate: e.releaseDate,
      releaseNotes: e.releaseNotes
    });
  }), Ze.autoUpdater.on("update-not-available", (e) => {
    se("[Updater] No update available."), $e?.webContents.send("updater:update-not-available", {
      version: e.version
    });
  }), Ze.autoUpdater.on("download-progress", (e) => {
    se("[Updater] Download:", e.percent), $e?.webContents.send("updater:download-progress", {
      percent: e.percent,
      transferred: e.transferred,
      total: e.total,
      bytesPerSecond: e.bytesPerSecond
    });
  }), Ze.autoUpdater.on("update-downloaded", (e) => {
    se("[Updater] Update downloaded:", e.version), $e?.webContents.send("updater:update-downloaded", {
      version: e.version
    });
  }), Ze.autoUpdater.on("error", (e) => {
    se("[Updater] Error:", e?.message || e), $e?.webContents.send("updater:error", {
      message: e?.message || "Update failed."
    });
  }), Ze.autoUpdater.checkForUpdates().then((e) => {
    se("[Updater] Check result:", e?.updateInfo?.version);
  }).catch((e) => {
    se("[Updater] Initial update check failed:", e?.message || e);
  });
}
let $e = null;
function Au() {
  if (se("Creating BrowserWindow..."), $e = new ia({
    icon: ut.join(process.env.VITE_PUBLIC, "logo.png"),
    autoHideMenuBar: !0,
    webPreferences: {
      preload: ut.join(ra, "preload.mjs"),
      devTools: !0
    }
  }), $e.maximize(), $e.webContents.on("did-finish-load", () => {
    se("[Window] did-finish-load"), $e?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), $e.webContents.on(
    "did-fail-load",
    (e, c, p, f) => {
      se("[Window] DID FAIL LOAD"), se("errorCode:", c), se("errorDescription:", p), se("validatedURL:", f);
    }
  ), $e.webContents.on("render-process-gone", (e, c) => {
    se("[Window] Renderer process gone:", c);
  }), $e.webContents.on(
    "console-message",
    (e, c, p, f, d) => {
      se(
        `[Renderer] level=${c}`,
        `message=${p}`,
        `line=${f}`,
        `source=${d}`
      );
    }
  ), Et)
    se("[Window] Development mode"), se("[Window] Loading:", Et), $e.loadURL(Et), $e.webContents.openDevTools();
  else {
    const e = ut.join(na, "index.html");
    if (se("========== PRODUCTION PATH =========="), se("APP_ROOT:", process.env.APP_ROOT), se("__dirname:", ra), se("RENDERER_DIST:", na), se("indexPath:", e), se("index exists:", ta.existsSync(e)), se("====================================="), !ta.existsSync(e)) {
      se("[ERROR] index.html DOES NOT EXIST");
      return;
    }
    se("[Window] Loading production index..."), $e.loadFile(e).then(() => {
      se("[Window] loadFile() succeeded");
    }).catch((c) => {
      se("[Window] loadFile() FAILED:", c?.message || c);
    }), $e.webContents.openDevTools();
  }
}
jt.handle("updater:check", async () => Et ? {
  available: !1,
  development: !0
} : Ze.autoUpdater.checkForUpdates());
jt.handle("updater:download", async () => Et ? {
  success: !1,
  development: !0
} : (await Ze.autoUpdater.downloadUpdate(), {
  success: !0
}));
jt.handle("updater:install", async () => Et ? {
  success: !1,
  development: !0
} : (Ze.autoUpdater.quitAndInstall(!1, !0), {
  success: !0
}));
jt.handle("bill-printing:get-printers", async (e) => {
  try {
    se("[Bill Printing] Getting Windows printers...");
    const c = await e.sender.getPrintersAsync();
    return se(
      "[Bill Printing] Printers detected:",
      c.map((p) => ({
        name: p.name,
        displayName: p.displayName
      }))
    ), c.map((p) => ({
      name: p.name,
      displayName: p.displayName
    }));
  } catch (c) {
    throw se("[Bill Printing] Failed to get printers:", c), c;
  }
});
jt.handle("bill-printing:thermal-print", async (e, c) => {
  const p = c?.printerName, f = c?.bytes;
  if (se("========================================"), se("[Thermal Print] PRINT REQUEST"), se("[Thermal Print] Printer:", p), se("[Thermal Print] Bytes:", Array.isArray(f) ? f.length : 0), se("========================================"), !p)
    throw new Error("No thermal printer has been selected.");
  if (!Array.isArray(f))
    throw new Error("Invalid thermal printer data.");
  if (process.platform !== "win32")
    throw new Error(
      "Raw thermal printing is currently supported only on Windows."
    );
  const d = Buffer.from(f).toString("base64"), l = `
Add-Type @"
using System;
using System.Runtime.InteropServices;

public class RawPrinter
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public class DOCINFO
    {
        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDocName;

        [MarshalAs(UnmanagedType.LPWStr)]
        public string pOutputFile;

        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDataType;
    }

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool OpenPrinter(
        string pPrinterName,
        out IntPtr phPrinter,
        IntPtr pDefault
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool ClosePrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern int StartDocPrinter(
        IntPtr hPrinter,
        int Level,
        [In] DOCINFO pDocInfo
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool EndDocPrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool StartPagePrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool EndPagePrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool WritePrinter(
        IntPtr hPrinter,
        byte[] pBytes,
        int dwCount,
        out int dwWritten
    );

    public static void Print(
        string printerName,
        byte[] data
    )
    {
        IntPtr printerHandle;

        if (!OpenPrinter(
            printerName,
            out printerHandle,
            IntPtr.Zero
        ))
        {
            throw new Exception(
                "OpenPrinter failed. Windows error: " +
                Marshal.GetLastWin32Error()
            );
        }

        try
        {
            DOCINFO docInfo =
                new DOCINFO();

            docInfo.pDocName =
                "Hotel Gates Bill";

            docInfo.pDataType =
                "RAW";

            int jobId =
                StartDocPrinter(
                    printerHandle,
                    1,
                    docInfo
                );

            if (jobId == 0)
            {
                throw new Exception(
                    "StartDocPrinter failed. Windows error: " +
                    Marshal.GetLastWin32Error()
                );
            }

            try
            {
                if (!StartPagePrinter(
                    printerHandle
                ))
                {
                    throw new Exception(
                        "StartPagePrinter failed. Windows error: " +
                        Marshal.GetLastWin32Error()
                    );
                }

                try
                {
                    int written;

                    bool result =
                        WritePrinter(
                            printerHandle,
                            data,
                            data.Length,
                            out written
                        );

                    if (!result)
                    {
                        throw new Exception(
                            "WritePrinter failed. Windows error: " +
                            Marshal.GetLastWin32Error()
                        );
                    }

                    if (written != data.Length)
                    {
                        throw new Exception(
                            "Printer received only " +
                            written +
                            " of " +
                            data.Length +
                            " bytes."
                        );
                    }
                }
                finally
                {
                    EndPagePrinter(
                        printerHandle
                    );
                }
            }
            finally
            {
                EndDocPrinter(
                    printerHandle
                );
            }
        }
        finally
        {
            ClosePrinter(
                printerHandle
            );
        }
    }
}
"@

$printerName = $env:HOTEL_GATES_PRINTER_NAME
$base64 = $env:HOTEL_GATES_BILL_BASE64

if ([string]::IsNullOrWhiteSpace($printerName)) {
    throw "Printer name was not provided."
}

if ([string]::IsNullOrWhiteSpace($base64)) {
    throw "Print data was not provided."
}

$data = [Convert]::FromBase64String($base64)

[RawPrinter]::Print(
    $printerName,
    $data
)
`;
  try {
    return se("[Thermal Print] Sending RAW ESC/POS job to Windows..."), await Kf(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        l
      ],
      {
        windowsHide: !0,
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          HOTEL_GATES_PRINTER_NAME: p,
          HOTEL_GATES_BILL_BASE64: d
        }
      }
    ), se("[Thermal Print] RAW ESC/POS job sent successfully."), {
      success: !0
    };
  } catch (a) {
    throw se(
      "[Thermal Print] ERROR:",
      a?.message || a?.stderr || String(a)
    ), new Error(
      a?.message || a?.stderr || "Thermal printing failed."
    );
  }
});
jt.handle("bill-printing:windows-print", async (e, c) => {
  const p = c?.printerName, f = c?.html, d = c?.paperSize || "80mm";
  if (se("========================================"), se("[Windows Print] PRINT REQUEST"), se("[Windows Print] Printer:", p), se("[Windows Print] Paper size:", d), se("[Windows Print] HTML present:", !!f), se("========================================"), !p)
    throw se("[Windows Print] ERROR: No printer selected."), new Error("No bill printer has been selected.");
  if (!f)
    throw se("[Windows Print] ERROR: HTML missing."), new Error("Bill print content is missing.");
  const l = new ia({
    show: !1,
    width: 800,
    height: 1200,
    webPreferences: {
      sandbox: !0
    }
  });
  try {
    se("[Windows Print] Preparing print window...");
    const a = new Promise((o, s) => {
      l.webContents.once("did-finish-load", () => {
        se("[Windows Print] did-finish-load received."), o();
      }), l.webContents.once(
        "did-fail-load",
        (n, t, r, h) => {
          se("[Windows Print] did-fail-load:"), se("errorCode:", t), se("errorDescription:", r), se("validatedURL:", h), s(
            new Error(`Failed to load bill print page: ${r}`)
          );
        }
      );
    });
    se("[Windows Print] Loading bill HTML..."), await l.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(f)}`
    ), se("[Windows Print] loadURL completed."), await a, se("[Windows Print] Bill page loaded successfully.");
    const u = d === "58mm" ? 58e3 : 8e4;
    return se("[Windows Print] Paper width:", u, "microns"), se("[Windows Print] Calling webContents.print()..."), await new Promise((o, s) => {
      l.webContents.print(
        {
          silent: !0,
          printBackground: !0,
          deviceName: p,
          pageSize: {
            width: u,
            height: 2e5
          },
          margins: {
            marginType: "none"
          }
        },
        (n, t) => {
          if (se("[Windows Print] PRINT CALLBACK"), se("[Windows Print] success:", n), se("[Windows Print] failureReason:", t || "(none)"), se("[Windows Print] printerName:", p), !n) {
            s(new Error(t || "Windows printing failed."));
            return;
          }
          o();
        }
      );
    }), se("[Windows Print] Print completed successfully."), {
      success: !0
    };
  } catch (a) {
    throw se("[Windows Print] PRINT ERROR:", a), a;
  } finally {
    se("[Windows Print] Closing print window..."), l.isDestroyed() || l.close(), se("[Windows Print] Print window closed."), se("========================================");
  }
});
vr.whenReady().then(() => {
  se("Electron ready"), Au(), Qf();
});
vr.on("window-all-closed", () => {
  se("All windows closed"), process.platform !== "darwin" && (vr.quit(), $e = null);
});
vr.on("activate", () => {
  ia.getAllWindows().length === 0 && Au();
});
export {
  Md as MAIN_DIST,
  na as RENDERER_DIST,
  Et as VITE_DEV_SERVER_URL
};
