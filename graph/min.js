!function t(e,r,n){function i(s,a){if(!r[s]){if(!e[s]){var f="function"==typeof require&&require
if(!a&&f)return f(s,!0)
if(o)return o(s,!0)
var u=new Error("Cannot find module '"+s+"'")
throw u.code="MODULE_NOT_FOUND",u}var c=r[s]={exports:{}}
e[s][0].call(c.exports,function(t){var r=e[s][1][t]
return i(r||t)},c,c.exports,t,e,r,n)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s])
return i}({1:[function(t,e,r){"use strict"
var n=t("bitsharesjs-ws"),i=(t("bitsharesjs"),{connect:function(){return n.Apis.instance("wss://bitshares.openledger.info/ws",!0).init_promise},fetchAssets:function(t){return new Promise(function(e,r){n.Apis.instance().db_api().exec("lookup_asset_symbols",[t]).then(function(t){e(t)}).catch(function(t){r(t)})})},fetchStats:function(t,e,r,i){return new Promise(function(o,s){var a=new Date,f=new Date(a-864e5*r)
console.log("NOW",new Date),console.log("START",f),console.log("END",a)
var u=a.toISOString().slice(0,-5),c=f.toISOString().slice(0,-5)
n.Apis.instance().history_api().exec("get_market_history",[t.id,e.id,i,c,u]).then(function(t){t.length?o(t):s("No results")}).catch(function(t){s(t)})})}}),o={getPrices:function(t){var e=t[0],r=t[t.length-1]
return{first:e.open_base/e.open_quote,last:r.close_base/r.close_quote}},formatPrices:function(t,e,r){var n=e.precision-r.precision
return n>0?(t.first=t.first/n*10,t.last=t.last/n*10):n<0&&(t.first=10*t.first*n,t.last=10*t.last*n),t.change=Math.floor(t.last/t.first*100-100),t.first=Math.abs(t.first).toFixed(4),t.last=Math.abs(t.last).toFixed(4),t}}
console.time("connect"),i.connect().then(function(t){console.timeEnd("connect"),console.time("requests"),i.fetchAssets(["BTS","OPEN.EOS","USD"]).then(function(t){var e=t[0],r=t[1]
t[2]
i.fetchStats(e,r,1,3600).then(function(t){var n=o.formatPrices(o.getPrices(t),e,r)
console.log("PRICES",n),console.timeEnd("requests")})})})},{bitsharesjs:36,"bitsharesjs-ws":8}],2:[function(t,e,r){!function(t,r){"function"==typeof define&&define.amd?define([],r):void 0!==e&&e.exports?e.exports=r():t.ReconnectingWebSocket=r()}(this,function(){function t(e,r,n){function i(t,e){var r=document.createEvent("CustomEvent")
return r.initCustomEvent(t,!1,!1,e),r}var o={debug:!1,automaticOpen:!0,reconnectInterval:1e3,maxReconnectInterval:3e4,reconnectDecay:1.5,timeoutInterval:2e3,maxReconnectAttempts:null,binaryType:"blob"}
n||(n={})
for(var s in o)void 0!==n[s]?this[s]=n[s]:this[s]=o[s]
this.url=e,this.reconnectAttempts=0,this.readyState=WebSocket.CONNECTING,this.protocol=null
var a,f=this,u=!1,c=!1,h=null,l=document.createElement("div")
l.addEventListener("open",function(t){f.onopen(t)}),l.addEventListener("close",function(t){f.onclose(t)}),l.addEventListener("connecting",function(t){f.onconnecting(t)}),l.addEventListener("message",function(t){f.onmessage(t)}),l.addEventListener("error",function(t){f.onerror(t)}),this.addEventListener=l.addEventListener.bind(l),this.removeEventListener=l.removeEventListener.bind(l),this.dispatchEvent=l.dispatchEvent.bind(l),this.open=function(e){if(a=new WebSocket(f.url,r||[]),a.binaryType=this.binaryType,e){if(this.maxReconnectAttempts&&this.reconnectAttempts>this.maxReconnectAttempts)return}else l.dispatchEvent(i("connecting")),this.reconnectAttempts=0;(f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","attempt-connect",f.url)
var n=a,o=setTimeout(function(){(f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","connection-timeout",f.url),c=!0,n.close(),c=!1},f.timeoutInterval)
a.onopen=function(r){clearTimeout(o),(f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","onopen",f.url),f.protocol=a.protocol,f.readyState=WebSocket.OPEN,f.reconnectAttempts=0
var n=i("open")
n.isReconnect=e,e=!1,l.dispatchEvent(n)},a.onclose=function(r){if(clearTimeout(o),a=null,u)f.readyState=WebSocket.CLOSED,l.dispatchEvent(i("close"))
else{f.readyState=WebSocket.CONNECTING
var n=i("connecting")
n.code=r.code,n.reason=r.reason,n.wasClean=r.wasClean,l.dispatchEvent(n),e||c||((f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","onclose",f.url),l.dispatchEvent(i("close")))
var o=f.reconnectInterval*Math.pow(f.reconnectDecay,f.reconnectAttempts)
h=setTimeout(function(){f.reconnectAttempts++,f.open(!0)},o>f.maxReconnectInterval?f.maxReconnectInterval:o)}},a.onmessage=function(e){(f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","onmessage",f.url,e.data)
var r=i("message")
r.data=e.data,l.dispatchEvent(r)},a.onerror=function(e){(f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","onerror",f.url,e),l.dispatchEvent(i("error"))}},1==this.automaticOpen&&this.open(!1),this.send=function(e){if(a)return(f.debug||t.debugAll)&&console.debug("ReconnectingWebSocket","send",f.url,e),a.send(e)
throw"INVALID_STATE_ERR : Pausing to reconnect websocket"},this.close=function(t,e){void 0===t&&(t=1e3),u=!0,a&&a.close(t,e),h&&(clearTimeout(h),h=null)},this.refresh=function(){a&&a.close()}}if("undefined"!=typeof window&&"WebSocket"in window)return t.prototype.onopen=function(t){},t.prototype.onclose=function(t){},t.prototype.onconnecting=function(t){},t.prototype.onmessage=function(t){},t.prototype.onerror=function(t){},t.debugAll=!1,t.CONNECTING=WebSocket.CONNECTING,t.OPEN=WebSocket.OPEN,t.CLOSING=WebSocket.CLOSING,t.CLOSED=WebSocket.CLOSED,t})},{}],3:[function(t,e,r){var n=t("safe-buffer").Buffer
e.exports=function(t){function e(e){if(0===e.length)return""
for(var r=[0],n=0;n<e.length;++n){for(var i=0,o=e[n];i<r.length;++i)o+=r[i]<<8,r[i]=o%s,o=o/s|0
for(;o>0;)r.push(o%s),o=o/s|0}for(var a="",f=0;0===e[f]&&f<e.length-1;++f)a+=t[0]
for(var u=r.length-1;u>=0;--u)a+=t[r[u]]
return a}function r(t){if("string"!=typeof t)throw new TypeError("Expected String")
if(0===t.length)return n.allocUnsafe(0)
for(var e=[0],r=0;r<t.length;r++){var i=o[t[r]]
if(void 0===i)return
for(var f=0,u=i;f<e.length;++f)u+=e[f]*s,e[f]=255&u,u>>=8
for(;u>0;)e.push(255&u),u>>=8}for(var c=0;t[c]===a&&c<t.length-1;++c)e.push(0)
return n.from(e.reverse())}function i(t){var e=r(t)
if(e)return e
throw new Error("Non-base"+s+" character")}for(var o={},s=t.length,a=t.charAt(0),f=0;f<t.length;f++){var u=t.charAt(f)
if(void 0!==o[u])throw new TypeError(u+" is ambiguous")
o[u]=f}return{encode:e,decodeUnsafe:r,decode:i}}},{"safe-buffer":92}],4:[function(t,e,r){function n(t,e,r){if(!(this instanceof n))return new n(t,e,r)
null!=t&&("number"==typeof t?this.fromNumber(t,e,r):null==e&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,e))}function i(t,e,r,n,i,o){for(;--o>=0;){var s=e*this[t++]+r[n]+i
i=Math.floor(s/67108864),r[n++]=67108863&s}return i}function o(t){return ie.charAt(t)}function s(t,e){var r=oe[t.charCodeAt(e)]
return null==r?-1:r}function a(t){for(var e=this.t-1;e>=0;--e)t[e]=this[e]
t.t=this.t,t.s=this.s}function f(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+ee:this.t=0}function u(t){var e=new n
return e.fromInt(t),e}function c(t,e){var r,i=this
if(16==e)r=4
else if(8==e)r=3
else if(256==e)r=8
else if(2==e)r=1
else if(32==e)r=5
else{if(4!=e)return void i.fromRadix(t,e)
r=2}i.t=0,i.s=0
for(var o=t.length,a=!1,f=0;--o>=0;){var u=8==r?255&t[o]:s(t,o)
u<0?"-"==t.charAt(o)&&(a=!0):(a=!1,0==f?i[i.t++]=u:f+r>i.DB?(i[i.t-1]|=(u&(1<<i.DB-f)-1)<<f,i[i.t++]=u>>i.DB-f):i[i.t-1]|=u<<f,(f+=r)>=i.DB&&(f-=i.DB))}8==r&&0!=(128&t[0])&&(i.s=-1,f>0&&(i[i.t-1]|=(1<<i.DB-f)-1<<f)),i.clamp(),a&&n.ZERO.subTo(i,i)}function h(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t}function l(t){var e=this
if(e.s<0)return"-"+e.negate().toString(t)
var r
if(16==t)r=4
else if(8==t)r=3
else if(2==t)r=1
else if(32==t)r=5
else{if(4!=t)return e.toRadix(t)
r=2}var n,i=(1<<r)-1,s=!1,a="",f=e.t,u=e.DB-f*e.DB%r
if(f-- >0)for(u<e.DB&&(n=e[f]>>u)>0&&(s=!0,a=o(n));f>=0;)u<r?(n=(e[f]&(1<<u)-1)<<r-u,n|=e[--f]>>(u+=e.DB-r)):(n=e[f]>>(u-=r)&i,u<=0&&(u+=e.DB,--f)),n>0&&(s=!0),s&&(a+=o(n))
return s?a:"0"}function p(){var t=new n
return n.ZERO.subTo(this,t),t}function d(){return this.s<0?this.negate():this}function _(t){var e=this.s-t.s
if(0!=e)return e
var r=this.t
if(0!=(e=r-t.t))return this.s<0?-e:e
for(;--r>=0;)if(0!=(e=this[r]-t[r]))return e
return 0}function g(t){var e,r=1
return 0!=(e=t>>>16)&&(t=e,r+=16),0!=(e=t>>8)&&(t=e,r+=8),0!=(e=t>>4)&&(t=e,r+=4),0!=(e=t>>2)&&(t=e,r+=2),0!=(e=t>>1)&&(t=e,r+=1),r}function y(){return this.t<=0?0:this.DB*(this.t-1)+g(this[this.t-1]^this.s&this.DM)}function v(){return this.bitLength()>>3}function b(t,e){var r
for(r=this.t-1;r>=0;--r)e[r+t]=this[r]
for(r=t-1;r>=0;--r)e[r]=0
e.t=this.t+t,e.s=this.s}function m(t,e){for(var r=t;r<this.t;++r)e[r-t]=this[r]
e.t=Math.max(this.t-t,0),e.s=this.s}function w(t,e){var r,n=this,i=t%n.DB,o=n.DB-i,s=(1<<o)-1,a=Math.floor(t/n.DB),f=n.s<<i&n.DM
for(r=n.t-1;r>=0;--r)e[r+a+1]=n[r]>>o|f,f=(n[r]&s)<<i
for(r=a-1;r>=0;--r)e[r]=0
e[a]=f,e.t=n.t+a+1,e.s=n.s,e.clamp()}function E(t,e){var r=this
e.s=r.s
var n=Math.floor(t/r.DB)
if(n>=r.t)return void(e.t=0)
var i=t%r.DB,o=r.DB-i,s=(1<<i)-1
e[0]=r[n]>>i
for(var a=n+1;a<r.t;++a)e[a-n-1]|=(r[a]&s)<<o,e[a-n]=r[a]>>i
i>0&&(e[r.t-n-1]|=(r.s&s)<<o),e.t=r.t-n,e.clamp()}function S(t,e){for(var r=this,n=0,i=0,o=Math.min(t.t,r.t);n<o;)i+=r[n]-t[n],e[n++]=i&r.DM,i>>=r.DB
if(t.t<r.t){for(i-=t.s;n<r.t;)i+=r[n],e[n++]=i&r.DM,i>>=r.DB
i+=r.s}else{for(i+=r.s;n<t.t;)i-=t[n],e[n++]=i&r.DM,i>>=r.DB
i-=t.s}e.s=i<0?-1:0,i<-1?e[n++]=r.DV+i:i>0&&(e[n++]=i),e.t=n,e.clamp()}function B(t,e){var r=this.abs(),i=t.abs(),o=r.t
for(e.t=o+i.t;--o>=0;)e[o]=0
for(o=0;o<i.t;++o)e[o+r.t]=r.am(0,i[o],e,o,0,r.t)
e.s=0,e.clamp(),this.s!=t.s&&n.ZERO.subTo(e,e)}function x(t){for(var e=this.abs(),r=t.t=2*e.t;--r>=0;)t[r]=0
for(r=0;r<e.t-1;++r){var n=e.am(r,e[r],t,2*r,0,1);(t[r+e.t]+=e.am(r+1,2*e[r],t,2*r+1,n,e.t-r-1))>=e.DV&&(t[r+e.t]-=e.DV,t[r+e.t+1]=1)}t.t>0&&(t[t.t-1]+=e.am(r,e[r],t,2*r,0,1)),t.s=0,t.clamp()}function I(t,e,r){var i=this,o=t.abs()
if(!(o.t<=0)){var s=i.abs()
if(s.t<o.t)return null!=e&&e.fromInt(0),void(null!=r&&i.copyTo(r))
null==r&&(r=new n)
var a=new n,f=i.s,u=t.s,c=i.DB-g(o[o.t-1])
c>0?(o.lShiftTo(c,a),s.lShiftTo(c,r)):(o.copyTo(a),s.copyTo(r))
var h=a.t,l=a[h-1]
if(0!=l){var p=l*(1<<i.F1)+(h>1?a[h-2]>>i.F2:0),d=i.FV/p,_=(1<<i.F1)/p,y=1<<i.F2,v=r.t,b=v-h,m=null==e?new n:e
for(a.dlShiftTo(b,m),r.compareTo(m)>=0&&(r[r.t++]=1,r.subTo(m,r)),n.ONE.dlShiftTo(h,m),m.subTo(a,a);a.t<h;)a[a.t++]=0
for(;--b>=0;){var w=r[--v]==l?i.DM:Math.floor(r[v]*d+(r[v-1]+y)*_)
if((r[v]+=a.am(0,w,r,b,0,h))<w)for(a.dlShiftTo(b,m),r.subTo(m,r);r[v]<--w;)r.subTo(m,r)}null!=e&&(r.drShiftTo(h,e),f!=u&&n.ZERO.subTo(e,e)),r.t=h,r.clamp(),c>0&&r.rShiftTo(c,r),f<0&&n.ZERO.subTo(r,r)}}}function k(t){var e=new n
return this.abs().divRemTo(t,null,e),this.s<0&&e.compareTo(n.ZERO)>0&&t.subTo(e,e),e}function T(t){this.m=t}function A(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t}function j(t){return t}function O(t){t.divRemTo(this.m,null,t)}function M(t,e,r){t.multiplyTo(e,r),this.reduce(r)}function z(t,e){t.squareTo(e),this.reduce(e)}function L(){if(this.t<1)return 0
var t=this[0]
if(0==(1&t))return 0
var e=3&t
return e=e*(2-(15&t)*e)&15,e=e*(2-(255&t)*e)&255,e=e*(2-((65535&t)*e&65535))&65535,e=e*(2-t*e%this.DV)%this.DV,e>0?this.DV-e:-e}function C(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function q(t){var e=new n
return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&e.compareTo(n.ZERO)>0&&this.m.subTo(e,e),e}function D(t){var e=new n
return t.copyTo(e),this.reduce(e),e}function U(t){for(;t.t<=this.mt2;)t[t.t++]=0
for(var e=0;e<this.m.t;++e){var r=32767&t[e],n=r*this.mpl+((r*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM
for(r=e+this.m.t,t[r]+=this.m.am(0,n,t,e,0,this.m.t);t[r]>=t.DV;)t[r]-=t.DV,t[++r]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)}function R(t,e){t.squareTo(e),this.reduce(e)}function N(t,e,r){t.multiplyTo(e,r),this.reduce(r)}function P(){return 0==(this.t>0?1&this[0]:this.s)}function F(t,e){if(t>4294967295||t<1)return n.ONE
var r=new n,i=new n,o=e.convert(this),s=g(t)-1
for(o.copyTo(r);--s>=0;)if(e.sqrTo(r,i),(t&1<<s)>0)e.mulTo(i,o,r)
else{var a=r
r=i,i=a}return e.revert(r)}function K(t,e){var r
return r=t<256||e.isEven()?new T(e):new C(e),this.exp(t,r)}function H(){var t=new n
return this.copyTo(t),t}function V(){if(this.s<0){if(1==this.t)return this[0]-this.DV
if(0==this.t)return-1}else{if(1==this.t)return this[0]
if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function W(){return 0==this.t?this.s:this[0]<<24>>24}function J(){return 0==this.t?this.s:this[0]<<16>>16}function Z(t){return Math.floor(Math.LN2*this.DB/Math.log(t))}function G(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1}function Y(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0"
var e=this.chunkSize(t),r=Math.pow(t,e),i=u(r),o=new n,s=new n,a=""
for(this.divRemTo(i,o,s);o.signum()>0;)a=(r+s.intValue()).toString(t).substr(1)+a,o.divRemTo(i,o,s)
return s.intValue().toString(t)+a}function X(t,e){var r=this
r.fromInt(0),null==e&&(e=10)
for(var i=r.chunkSize(e),o=Math.pow(e,i),a=!1,f=0,u=0,c=0;c<t.length;++c){var h=s(t,c)
h<0?"-"==t.charAt(c)&&0==r.signum()&&(a=!0):(u=e*u+h,++f>=i&&(r.dMultiply(o),r.dAddOffset(u,0),f=0,u=0))}f>0&&(r.dMultiply(Math.pow(e,f)),r.dAddOffset(u,0)),a&&n.ZERO.subTo(r,r)}function $(t,e,r){var i=this
if("number"==typeof e)if(t<2)i.fromInt(1)
else for(i.fromNumber(t,r),i.testBit(t-1)||i.bitwiseTo(n.ONE.shiftLeft(t-1),st,i),i.isEven()&&i.dAddOffset(1,0);!i.isProbablePrime(e);)i.dAddOffset(2,0),i.bitLength()>t&&i.subTo(n.ONE.shiftLeft(t-1),i)
else{var o=new Array,s=7&t
o.length=1+(t>>3),e.nextBytes(o),s>0?o[0]&=(1<<s)-1:o[0]=0,i.fromString(o,256)}}function Q(){var t=this,e=t.t,r=new Array
r[0]=t.s
var n,i=t.DB-e*t.DB%8,o=0
if(e-- >0)for(i<t.DB&&(n=t[e]>>i)!=(t.s&t.DM)>>i&&(r[o++]=n|t.s<<t.DB-i);e>=0;)i<8?(n=(t[e]&(1<<i)-1)<<8-i,n|=t[--e]>>(i+=t.DB-8)):(n=t[e]>>(i-=8)&255,i<=0&&(i+=t.DB,--e)),0!=(128&n)&&(n|=-256),0===o&&(128&t.s)!=(128&n)&&++o,(o>0||n!=t.s)&&(r[o++]=n)
return r}function tt(t){return 0==this.compareTo(t)}function et(t){return this.compareTo(t)<0?this:t}function rt(t){return this.compareTo(t)>0?this:t}function nt(t,e,r){var n,i,o=this,s=Math.min(t.t,o.t)
for(n=0;n<s;++n)r[n]=e(o[n],t[n])
if(t.t<o.t){for(i=t.s&o.DM,n=s;n<o.t;++n)r[n]=e(o[n],i)
r.t=o.t}else{for(i=o.s&o.DM,n=s;n<t.t;++n)r[n]=e(i,t[n])
r.t=t.t}r.s=e(o.s,t.s),r.clamp()}function it(t,e){return t&e}function ot(t){var e=new n
return this.bitwiseTo(t,it,e),e}function st(t,e){return t|e}function at(t){var e=new n
return this.bitwiseTo(t,st,e),e}function ft(t,e){return t^e}function ut(t){var e=new n
return this.bitwiseTo(t,ft,e),e}function ct(t,e){return t&~e}function ht(t){var e=new n
return this.bitwiseTo(t,ct,e),e}function lt(){for(var t=new n,e=0;e<this.t;++e)t[e]=this.DM&~this[e]
return t.t=this.t,t.s=~this.s,t}function pt(t){var e=new n
return t<0?this.rShiftTo(-t,e):this.lShiftTo(t,e),e}function dt(t){var e=new n
return t<0?this.lShiftTo(-t,e):this.rShiftTo(t,e),e}function _t(t){if(0==t)return-1
var e=0
return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function gt(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+_t(this[t])
return this.s<0?this.t*this.DB:-1}function yt(t){for(var e=0;0!=t;)t&=t-1,++e
return e}function vt(){for(var t=0,e=this.s&this.DM,r=0;r<this.t;++r)t+=yt(this[r]^e)
return t}function bt(t){var e=Math.floor(t/this.DB)
return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)}function mt(t,e){var r=n.ONE.shiftLeft(t)
return this.bitwiseTo(r,e,r),r}function wt(t){return this.changeBit(t,st)}function Et(t){return this.changeBit(t,ct)}function St(t){return this.changeBit(t,ft)}function Bt(t,e){for(var r=this,n=0,i=0,o=Math.min(t.t,r.t);n<o;)i+=r[n]+t[n],e[n++]=i&r.DM,i>>=r.DB
if(t.t<r.t){for(i+=t.s;n<r.t;)i+=r[n],e[n++]=i&r.DM,i>>=r.DB
i+=r.s}else{for(i+=r.s;n<t.t;)i+=t[n],e[n++]=i&r.DM,i>>=r.DB
i+=t.s}e.s=i<0?-1:0,i>0?e[n++]=i:i<-1&&(e[n++]=r.DV+i),e.t=n,e.clamp()}function xt(t){var e=new n
return this.addTo(t,e),e}function It(t){var e=new n
return this.subTo(t,e),e}function kt(t){var e=new n
return this.multiplyTo(t,e),e}function Tt(){var t=new n
return this.squareTo(t),t}function At(t){var e=new n
return this.divRemTo(t,e,null),e}function jt(t){var e=new n
return this.divRemTo(t,null,e),e}function Ot(t){var e=new n,r=new n
return this.divRemTo(t,e,r),new Array(e,r)}function Mt(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()}function zt(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0
for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}}function Lt(){}function Ct(t){return t}function qt(t,e,r){t.multiplyTo(e,r)}function Dt(t,e){t.squareTo(e)}function Ut(t){return this.exp(t,new Lt)}function Rt(t,e,r){var n=Math.min(this.t+t.t,e)
for(r.s=0,r.t=n;n>0;)r[--n]=0
var i
for(i=r.t-this.t;n<i;++n)r[n+this.t]=this.am(0,t[n],r,n,0,this.t)
for(i=Math.min(t.t,e);n<i;++n)this.am(0,t[n],r,n,0,e-n)
r.clamp()}function Nt(t,e,r){--e
var n=r.t=this.t+t.t-e
for(r.s=0;--n>=0;)r[n]=0
for(n=Math.max(e-this.t,0);n<t.t;++n)r[this.t+n-e]=this.am(e-n,t[n],r,0,0,this.t+n-e)
r.clamp(),r.drShiftTo(1,r)}function Pt(t){this.r2=new n,this.q3=new n,n.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}function Ft(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m)
if(t.compareTo(this.m)<0)return t
var e=new n
return t.copyTo(e),this.reduce(e),e}function Kt(t){return t}function Ht(t){var e=this
for(t.drShiftTo(e.m.t-1,e.r2),t.t>e.m.t+1&&(t.t=e.m.t+1,t.clamp()),e.mu.multiplyUpperTo(e.r2,e.m.t+1,e.q3),e.m.multiplyLowerTo(e.q3,e.m.t+1,e.r2);t.compareTo(e.r2)<0;)t.dAddOffset(1,e.m.t+1)
for(t.subTo(e.r2,t);t.compareTo(e.m)>=0;)t.subTo(e.m,t)}function Vt(t,e){t.squareTo(e),this.reduce(e)}function Wt(t,e,r){t.multiplyTo(e,r),this.reduce(r)}function Jt(t,e){var r,i,o=t.bitLength(),s=u(1)
if(o<=0)return s
r=o<18?1:o<48?3:o<144?4:o<768?5:6,i=o<8?new T(e):e.isEven()?new Pt(e):new C(e)
var a=new Array,f=3,c=r-1,h=(1<<r)-1
if(a[1]=i.convert(this),r>1){var l=new n
for(i.sqrTo(a[1],l);f<=h;)a[f]=new n,i.mulTo(l,a[f-2],a[f]),f+=2}var p,d,_=t.t-1,y=!0,v=new n
for(o=g(t[_])-1;_>=0;){for(o>=c?p=t[_]>>o-c&h:(p=(t[_]&(1<<o+1)-1)<<c-o,_>0&&(p|=t[_-1]>>this.DB+o-c)),f=r;0==(1&p);)p>>=1,--f
if((o-=f)<0&&(o+=this.DB,--_),y)a[p].copyTo(s),y=!1
else{for(;f>1;)i.sqrTo(s,v),i.sqrTo(v,s),f-=2
f>0?i.sqrTo(s,v):(d=s,s=v,v=d),i.mulTo(v,a[p],s)}for(;_>=0&&0==(t[_]&1<<o);)i.sqrTo(s,v),d=s,s=v,v=d,--o<0&&(o=this.DB-1,--_)}return i.revert(s)}function Zt(t){var e=this.s<0?this.negate():this.clone(),r=t.s<0?t.negate():t.clone()
if(e.compareTo(r)<0){var n=e
e=r,r=n}var i=e.getLowestSetBit(),o=r.getLowestSetBit()
if(o<0)return e
for(i<o&&(o=i),o>0&&(e.rShiftTo(o,e),r.rShiftTo(o,r));e.signum()>0;)(i=e.getLowestSetBit())>0&&e.rShiftTo(i,e),(i=r.getLowestSetBit())>0&&r.rShiftTo(i,r),e.compareTo(r)>=0?(e.subTo(r,e),e.rShiftTo(1,e)):(r.subTo(e,r),r.rShiftTo(1,r))
return o>0&&r.lShiftTo(o,r),r}function Gt(t){if(t<=0)return 0
var e=this.DV%t,r=this.s<0?t-1:0
if(this.t>0)if(0==e)r=this[0]%t
else for(var n=this.t-1;n>=0;--n)r=(e*r+this[n])%t
return r}function Yt(t){var e=t.isEven()
if(0===this.signum())throw new Error("division by zero")
if(this.isEven()&&e||0==t.signum())return n.ZERO
for(var r=t.clone(),i=this.clone(),o=u(1),s=u(0),a=u(0),f=u(1);0!=r.signum();){for(;r.isEven();)r.rShiftTo(1,r),e?(o.isEven()&&s.isEven()||(o.addTo(this,o),s.subTo(t,s)),o.rShiftTo(1,o)):s.isEven()||s.subTo(t,s),s.rShiftTo(1,s)
for(;i.isEven();)i.rShiftTo(1,i),e?(a.isEven()&&f.isEven()||(a.addTo(this,a),f.subTo(t,f)),a.rShiftTo(1,a)):f.isEven()||f.subTo(t,f),f.rShiftTo(1,f)
r.compareTo(i)>=0?(r.subTo(i,r),e&&o.subTo(a,o),s.subTo(f,s)):(i.subTo(r,i),e&&a.subTo(o,a),f.subTo(s,f))}if(0!=i.compareTo(n.ONE))return n.ZERO
for(;f.compareTo(t)>=0;)f.subTo(t,f)
for(;f.signum()<0;)f.addTo(t,f)
return f}function Xt(t){var e,r=this.abs()
if(1==r.t&&r[0]<=se[se.length-1]){for(e=0;e<se.length;++e)if(r[0]==se[e])return!0
return!1}if(r.isEven())return!1
for(e=1;e<se.length;){for(var n=se[e],i=e+1;i<se.length&&n<ae;)n*=se[i++]
for(n=r.modInt(n);e<i;)if(n%se[e++]==0)return!1}return r.millerRabin(t)}function $t(t){var e=this.subtract(n.ONE),r=e.getLowestSetBit()
if(r<=0)return!1
var i=e.shiftRight(r);(t=t+1>>1)>se.length&&(t=se.length)
for(var o,s=new n(null),a=[],f=0;f<t;++f){for(;o=se[Math.floor(Math.random()*se.length)],-1!=a.indexOf(o););a.push(o),s.fromInt(o)
var u=s.modPow(i,this)
if(0!=u.compareTo(n.ONE)&&0!=u.compareTo(e)){for(var o=1;o++<r&&0!=u.compareTo(e);)if(u=u.modPowInt(2,this),0==u.compareTo(n.ONE))return!1
if(0!=u.compareTo(e))return!1}}return!0}var Qt=n.prototype
Qt.__bigi=t("../package.json").version,n.isBigInteger=function(t,e){return t&&t.__bigi&&(!e||t.__bigi===Qt.__bigi)}
var te
n.prototype.am=i,te=26,n.prototype.DB=te,n.prototype.DM=(1<<te)-1
var ee=n.prototype.DV=1<<te
n.prototype.FV=Math.pow(2,52),n.prototype.F1=52-te,n.prototype.F2=2*te-52
var re,ne,ie="0123456789abcdefghijklmnopqrstuvwxyz",oe=new Array
for(re="0".charCodeAt(0),ne=0;ne<=9;++ne)oe[re++]=ne
for(re="a".charCodeAt(0),ne=10;ne<36;++ne)oe[re++]=ne
for(re="A".charCodeAt(0),ne=10;ne<36;++ne)oe[re++]=ne
T.prototype.convert=A,T.prototype.revert=j,T.prototype.reduce=O,T.prototype.mulTo=M,T.prototype.sqrTo=z,C.prototype.convert=q,C.prototype.revert=D,C.prototype.reduce=U,C.prototype.mulTo=N,C.prototype.sqrTo=R,Qt.copyTo=a,Qt.fromInt=f,Qt.fromString=c,Qt.clamp=h,Qt.dlShiftTo=b,Qt.drShiftTo=m,Qt.lShiftTo=w,Qt.rShiftTo=E,Qt.subTo=S,Qt.multiplyTo=B,Qt.squareTo=x,Qt.divRemTo=I,Qt.invDigit=L,Qt.isEven=P,Qt.exp=F,Qt.toString=l,Qt.negate=p,Qt.abs=d,Qt.compareTo=_,Qt.bitLength=y,Qt.byteLength=v,Qt.mod=k,Qt.modPowInt=K,Lt.prototype.convert=Ct,Lt.prototype.revert=Ct,Lt.prototype.mulTo=qt,Lt.prototype.sqrTo=Dt,Pt.prototype.convert=Ft,Pt.prototype.revert=Kt,Pt.prototype.reduce=Ht,Pt.prototype.mulTo=Wt,Pt.prototype.sqrTo=Vt
var se=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],ae=(1<<26)/se[se.length-1]
Qt.chunkSize=Z,Qt.toRadix=Y,Qt.fromRadix=X,Qt.fromNumber=$,Qt.bitwiseTo=nt,Qt.changeBit=mt,Qt.addTo=Bt,Qt.dMultiply=Mt,Qt.dAddOffset=zt,Qt.multiplyLowerTo=Rt,Qt.multiplyUpperTo=Nt,Qt.modInt=Gt,Qt.millerRabin=$t,Qt.clone=H,Qt.intValue=V,Qt.byteValue=W,Qt.shortValue=J,Qt.signum=G,Qt.toByteArray=Q,Qt.equals=tt,Qt.min=et,Qt.max=rt,Qt.and=ot,Qt.or=at,Qt.xor=ut,Qt.andNot=ht,Qt.not=lt,Qt.shiftLeft=pt,Qt.shiftRight=dt,Qt.getLowestSetBit=gt,Qt.bitCount=vt,Qt.testBit=bt,Qt.setBit=wt,Qt.clearBit=Et,Qt.flipBit=St,Qt.add=xt,Qt.subtract=It,Qt.multiply=kt,Qt.divide=At,Qt.remainder=jt,Qt.divideAndRemainder=Ot,Qt.modPow=Jt,Qt.modInverse=Yt,Qt.pow=Ut,Qt.gcd=Zt,Qt.isProbablePrime=Xt,Qt.square=Tt,n.ZERO=u(0),n.ONE=u(1),n.valueOf=u,e.exports=n},{"../package.json":7}],5:[function(t,e,r){(function(e){var r=t("assert"),n=t("./bigi")
n.fromByteArrayUnsigned=function(t){return new n(128&t[0]?[0].concat(t):t)},n.prototype.toByteArrayUnsigned=function(){var t=this.toByteArray()
return 0===t[0]?t.slice(1):t},n.fromDERInteger=function(t){return new n(t)},n.prototype.toDERInteger=n.prototype.toByteArray,n.fromBuffer=function(t){if(128&t[0]){var e=Array.prototype.slice.call(t)
return new n([0].concat(e))}return new n(t)},n.fromHex=function(t){return""===t?n.ZERO:(r.equal(t,t.match(/^[A-Fa-f0-9]+/),"Invalid hex string"),r.equal(t.length%2,0,"Incomplete hex"),new n(t,16))},n.prototype.toBuffer=function(t){for(var r=this.toByteArrayUnsigned(),n=[],i=t-r.length;n.length<i;)n.push(0)
return new e(n.concat(r))},n.prototype.toHex=function(t){return this.toBuffer(t).toString("hex")}}).call(this,t("buffer").Buffer)},{"./bigi":4,assert:102,buffer:105}],6:[function(t,e,r){var n=t("./bigi")
t("./convert"),e.exports=n},{"./bigi":4,"./convert":5}],7:[function(t,e,r){e.exports={_args:[[{raw:"bigi@^1.4.2",scope:null,escapedName:"bigi",name:"bigi",rawSpec:"^1.4.2",spec:">=1.4.2 <2.0.0",type:"range"},"/home/lopan/Code/bitshares_tests/graph/node_modules/bitsharesjs"]],_from:"bigi@>=1.4.2 <2.0.0",_id:"bigi@1.4.2",_inCache:!0,_location:"/bigi",_nodeVersion:"6.1.0",_npmOperationalInternal:{host:"packages-12-west.internal.npmjs.com",tmp:"tmp/bigi-1.4.2.tgz_1469584192413_0.6801238611806184"},_npmUser:{name:"jprichardson",email:"jprichardson@gmail.com"},_npmVersion:"3.8.6",_phantomChildren:{},_requested:{raw:"bigi@^1.4.2",scope:null,escapedName:"bigi",name:"bigi",rawSpec:"^1.4.2",spec:">=1.4.2 <2.0.0",type:"range"},_requiredBy:["/bitsharesjs","/ecurve"],_resolved:"https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz",_shasum:"9c665a95f88b8b08fc05cfd731f561859d725825",_shrinkwrap:null,_spec:"bigi@^1.4.2",_where:"/home/lopan/Code/bitshares_tests/graph/node_modules/bitsharesjs",bugs:{url:"https://github.com/cryptocoinjs/bigi/issues"},dependencies:{},description:"Big integers.",devDependencies:{coveralls:"^2.11.2",istanbul:"^0.3.5",jshint:"^2.5.1",mocha:"^2.1.0",mochify:"^2.1.0"},directories:{},dist:{shasum:"9c665a95f88b8b08fc05cfd731f561859d725825",tarball:"https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz"},gitHead:"c25308081c896ff84702303722bf5ecd8b3f78e3",homepage:"https://github.com/cryptocoinjs/bigi#readme",keywords:["cryptography","math","bitcoin","arbitrary","precision","arithmetic","big","integer","int","number","biginteger","bigint","bignumber","decimal","float"],main:"./lib/index.js",maintainers:[{name:"midnightlightning",email:"boydb@midnightdesign.ws"},{name:"sidazhang",email:"sidazhang89@gmail.com"},{name:"nadav",email:"npm@shesek.info"},{name:"jprichardson",email:"jprichardson@gmail.com"}],name:"bigi",optionalDependencies:{},readme:"ERROR: No README data found!",repository:{url:"git+https://github.com/cryptocoinjs/bigi.git",type:"git"},scripts:{"browser-test":"mochify --wd -R spec",coverage:"istanbul cover ./node_modules/.bin/_mocha -- --reporter list test/*.js",coveralls:"npm run-script coverage && node ./node_modules/.bin/coveralls < coverage/lcov.info",jshint:"jshint --config jshint.json lib/*.js ; true",test:"_mocha -- test/*.js",unit:"mocha"},testling:{files:"test/*.js",harness:"mocha",browsers:["ie/9..latest","firefox/latest","chrome/latest","safari/6.0..latest","iphone/6.0..latest","android-browser/4.2..latest"]},version:"1.4.2"}},{}],8:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.Manager=r.ChainConfig=r.Apis=void 0
var i=t("./src/ApiInstances"),o=n(i),s=t("./src/ConnectionManager"),a=n(s),f=t("./src/ChainConfig"),u=n(f)
r.Apis=o.default,r.ChainConfig=u.default,r.Manager=a.default},{"./src/ApiInstances":9,"./src/ChainConfig":10,"./src/ConnectionManager":12}],9:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var o=t("./ChainWebSocket"),s=n(o),a=t("./GrapheneApi"),f=n(a),u=t("./ChainConfig"),c=n(u),h=void 0,l=!0
r.default={setRpcConnectionStatusCallback:function(t){this.statusCb=t,h&&h.setRpcConnectionStatusCallback(t)},setAutoReconnect:function(t){l=t},reset:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ws://localhost:8090",e=this,r=arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4e3
return this.close().then(function(){return h=new p,h.setRpcConnectionStatusCallback(e.statusCb),h&&r&&h.connect(t,n),h})},instance:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ws://localhost:8090",e=arguments[1],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4e3,n=arguments[3]
return h||(h=new p,h.setRpcConnectionStatusCallback(this.statusCb)),h&&e&&h.connect(t,r,n),h},chainId:function(){return Apis.instance().chain_id},close:function(){return h?new Promise(function(t){h.close().then(function(){h=null,t()})}):Promise.resolve()}}
var p=function(){function t(){i(this,t)}return t.prototype.connect=function(t,e){var r=this,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2]
this.url=t
if("undefined"!=typeof window&&window.location&&"https:"===window.location.protocol&&t.indexOf("wss://")<0)throw new Error("Secure domains require wss connection")
this.ws_rpc=new s.default(t,this.statusCb,e,l,function(){r._db.exec("get_objects",[["2.1.0"]]).catch(function(t){})}),this.init_promise=this.ws_rpc.login("","").then(function(){console.log("Connected to API node:",t),r._db=new f.default(r.ws_rpc,"database"),r._net=new f.default(r.ws_rpc,"network_broadcast"),r._hist=new f.default(r.ws_rpc,"history"),n&&(r._crypt=new f.default(r.ws_rpc,"crypto"))
var e=r._db.init().then(function(){return r._db.exec("get_chain_id",[]).then(function(t){return r.chain_id=t,c.default.setChainId(t)})})
r.ws_rpc.on_reconnect=function(){r.ws_rpc.login("","").then(function(){r._db.init().then(function(){r.statusCb&&r.statusCb("reconnect")}),r._net.init(),r._hist.init(),n&&r._crypt.init()})}
var i=[e,r._net.init(),r._hist.init()]
return n&&i.push(r._crypt.init()),Promise.all(i)})},t.prototype.close=function(){var t=this
return this.ws_rpc?this.ws_rpc.close().then(function(){t.ws_rpc=null}):(this.ws_rpc=null,Promise.resolve())},t.prototype.db_api=function(){return this._db},t.prototype.network_api=function(){return this._net},t.prototype.history_api=function(){return this._hist},t.prototype.crypto_api=function(){return this._crypt},t.prototype.setRpcConnectionStatusCallback=function(t){this.statusCb=t},t}()
e.exports=r.default},{"./ChainConfig":10,"./ChainWebSocket":11,"./GrapheneApi":13}],10:[function(t,e,r){(function(t){"use strict"
r.__esModule=!0
var n=void 0,i={address_prefix:t.env.npm_config__graphene_ecc_default_address_prefix||"GPH"}
n={core_asset:"CORE",address_prefix:"GPH",expire_in_secs:15,expire_in_secs_proposal:86400,review_in_secs_committee:86400,networks:{BitShares:{core_asset:"BTS",address_prefix:"BTS",chain_id:"4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8"},Muse:{core_asset:"MUSE",address_prefix:"MUSE",chain_id:"45ad2d3f9ef92a49b55c2227eb06123f613bb35dd08bd876f2aea21925a67a67"},Test:{core_asset:"TEST",address_prefix:"TEST",chain_id:"39f5e2ede1f8bc1a3a54a7914414e3779e33193f1f5693510e73cb7a87617447"},Obelisk:{core_asset:"GOV",address_prefix:"FEW",chain_id:"1cfde7c388b9e8ac06462d68aadbd966b58f88797637d9af805b4560b0e9661e"}},setChainId:function(t){var e=void 0,r=void 0,o=void 0,s=void 0,a=void 0
for(a=Object.keys(n.networks),e=0,r=a.length;e<r;e++)if(s=a[e],o=n.networks[s],o.chain_id===t)return n.network_name=s,o.address_prefix&&(n.address_prefix=o.address_prefix,i.address_prefix=o.address_prefix),{network_name:s,network:o}
n.network_name||console.log("Unknown chain id (this may be a testnet)",t)},reset:function(){n.core_asset="CORE",n.address_prefix="GPH",i.address_prefix="GPH",n.expire_in_secs=15,n.expire_in_secs_proposal=86400,console.log("Chain config reset")},setPrefix:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"GPH"
n.address_prefix=t,i.address_prefix=t}},r.default=n,e.exports=r.default}).call(this,t("_process"))},{_process:113}],11:[function(t,e,r){(function(n){"use strict"
function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t){return t||"undefined"==typeof WebSocket||"undefined"==typeof document?s:WebSocket}r.__esModule=!0
var s=void 0
s="undefined"!=typeof WebSocket||n.env.browser?"undefined"!=typeof WebSocket&&"undefined"!=typeof document?t("ReconnectingWebSocket"):WebSocket:t("ws")
var a=5,f=2*a,u=function(){function t(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5e3,s=this,u=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],c=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null
i(this,t),this.statusCb=r,this.connectionTimeout=setTimeout(function(){s.current_reject&&s.current_reject(new Error("Connection attempt timed out: "+e))},n)
var h=o(u)
try{this.ws=new h(e)}catch(t){console.error("invalid websocket URL:",t,e),this.ws=new h("wss://127.0.0.1:8090")}this.ws.timeoutInterval=5e3,this.current_reject=null,this.on_reconnect=null,this.send_life=a,this.recv_life=f,this.keepAliveCb=c,this.connect_promise=new Promise(function(t,e){s.current_reject=e,s.ws.onopen=function(){clearTimeout(s.connectionTimeout),s.statusCb&&s.statusCb("open"),s.on_reconnect&&s.on_reconnect(),s.keepalive_timer=setInterval(function(){if(0==--s.recv_life)return console.error("keep alive timeout."),s.ws.terminate?s.ws.terminate():s.ws.close(),clearInterval(s.keepalive_timer),void(s.keepalive_timer=void 0)
0==--s.send_life&&(s.keepAliveCb&&s.keepAliveCb(),s.send_life=a)},5e3),t()},s.ws.onerror=function(t){s.keepalive_timer&&(clearInterval(s.keepalive_timer),s.keepalive_timer=void 0),clearTimeout(s.connectionTimeout),s.statusCb&&s.statusCb("error"),s.current_reject&&s.current_reject(t)},s.ws.onmessage=function(t){s.recv_life=f,s.listener(JSON.parse(t.data))},s.ws.onclose=function(){s.keepalive_timer&&(clearInterval(s.keepalive_timer),s.keepalive_timer=void 0)
for(var t=new Error("connection closed"),e=s.responseCbId+1;e<=s.cbId;e+=1)s.cbs[e].reject(t)
s.statusCb&&s.statusCb("closed"),s.closeCb&&s.closeCb()}}),this.cbId=0,this.responseCbId=0,this.cbs={},this.subs={},this.unsub={}}return t.prototype.call=function(t){var e=this
if(1!==this.ws.readyState)return Promise.reject(new Error("websocket state error:"+this.ws.readyState))
var r=t[1]
if(this.cbId+=1,"set_subscribe_callback"!==r&&"subscribe_to_market"!==r&&"broadcast_transaction_with_callback"!==r&&"set_pending_transaction_callback"!==r||(this.subs[this.cbId]={callback:t[2][0]},t[2][0]=this.cbId),"unsubscribe_from_market"===r||"unsubscribe_from_accounts"===r){if("function"!=typeof t[2][0])throw new Error("First parameter of unsub must be the original callback")
var n=t[2].splice(0,1)[0]
for(var i in this.subs)if(this.subs[i].callback===n){this.unsub[this.cbId]=i
break}}var o={method:"call",params:t}
return o.id=this.cbId,this.send_life=a,new Promise(function(t,r){e.cbs[e.cbId]={time:new Date,resolve:t,reject:r},e.ws.send(JSON.stringify(o))})},t.prototype.listener=function(t){var e=!1,r=null
"notice"===t.method&&(e=!0,t.id=t.params[0]),e?r=this.subs[t.id].callback:(r=this.cbs[t.id],this.responseCbId=t.id),r&&!e?(t.error?r.reject(t.error):r.resolve(t.result),delete this.cbs[t.id],this.unsub[t.id]&&(delete this.subs[this.unsub[t.id]],delete this.unsub[t.id])):r&&e?r(t.params[1]):console.log("Warning: unknown websocket response: ",t)},t.prototype.login=function(t,e){var r=this
return this.connect_promise.then(function(){return r.call([1,"login",[t,e]])})},t.prototype.close=function(){var t=this
return new Promise(function(e){t.closeCb=function(){e(),t.closeCb=null},t.ws.close(),1!==t.ws.readyState&&e()})},t}()
r.default=u,e.exports=r.default}).call(this,t("_process"))},{ReconnectingWebSocket:2,_process:113,ws:104}],12:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var o=t("./ApiInstances"),s=n(o),a=t("./ChainWebSocket"),f=n(a),u=function(){function t(e){var r=e.url,n=e.urls
i(this,t),this.url=r,this.urls=n.filter(function(t){return t!==r})}return t.close=function(){return s.default.close()},t.prototype.logFailure=function(t,e){console.error("Skipping to next full node API server. Error: "+(e?JSON.stringify(e.message):""))},t.prototype.connect=function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.url,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2]
return new Promise(function(i,o){s.default.instance(r,t,void 0,n).init_promise.then(function(t){e.url=r,i(t)}).catch(function(t){s.default.close().then(function(){o(new Error("Unable to connect to node: "+r+", error:"+JSON.stringify(t&&t.message)))})})})},t.prototype.connectWithFallback=function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.url,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,i=this,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,s=arguments[5]
if(o&&r>this.urls.length)return o(new Error("Tried "+r+" connections, none of which worked: "+JSON.stringify(this.urls.concat(this.url))))
var a=function(n,o,a){return i.logFailure(e,n),i.connectWithFallback(t,i.urls[r],r+1,o,a,s)}
return n&&o?this.connect(t,e,s).then(n).catch(function(t){a(t,n,o)}):new Promise(function(e,r){i.connect(t,void 0,s).then(e).catch(function(t){a(t,e,r)})})},t.prototype.checkConnections=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=this,n=arguments[2],i=arguments[3],o={},s=function(n,i){var s=r.urls.concat(r.url),a=[]
s.forEach(function(n){var i=new f.default(n,function(){})
o[n]=(new Date).getTime(),a.push(function(){return i.login(t,e).then(function(t){var e,r=(e={},e[n]=(new Date).getTime()-o[n],e)
return i.close().then(function(){return r})}).catch(function(t){return n===r.url?r.url=r.urls[0]:r.urls=r.urls.filter(function(t){return t!==n}),i.close().then(function(){return null})})})}),Promise.all(a.map(function(t){return t()})).then(function(t){n(t.filter(function(t){return!!t}).reduce(function(t,e){var r=Object.keys(e)[0]
return t[r]=e[r],t},{}))}).catch(function(){return r.checkConnections(t,e,n,i)})}
if(!n||!i)return new Promise(s)
s(n,i)},t}()
r.default=u,e.exports=r.default},{"./ApiInstances":9,"./ChainWebSocket":11}],13:[function(t,e,r){"use strict"
function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var i=function(){function t(e,r){n(this,t),this.ws_rpc=e,this.api_name=r}return t.prototype.init=function(){var t=this
return this.ws_rpc.call([1,this.api_name,[]]).then(function(e){return t.api_id=e,t})},t.prototype.exec=function(t,e){return this.ws_rpc.call([this.api_id,t,e]).catch(function(r){throw console.log("!!! GrapheneApi error: ",t,e,r,JSON.stringify(r)),r})},t}()
r.default=i,e.exports=r.default},{}],14:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var o=t("../../ecc/src/PrivateKey"),s=n(o),a=t("../../ecc/src/KeyUtils"),f=n(a),u=t("./state"),c={},h={},l=function(){function t(){i(this,t)
var e={loggedIn:!1,roles:["active","owner","memo"]}
this.get=(0,u.get)(e),this.set=(0,u.set)(e),this.subs={}}return t.prototype.addSubscription=function(t){this.subs[t]=t},t.prototype.setRoles=function(t){this.set("roles",t)},t.prototype.generateKeys=function(t,e,r,n){(new Date).getTime()
if(!t||!e)throw new Error("Account name or password required")
if(e.length<12)throw new Error("Password must have at least 12 characters")
var i={},o={}
return(r||this.get("roles")).forEach(function(r){var a=t+r+e,u=c[a]?c[a]:s.default.fromSeed(f.default.normalize_brainKey(a))
c[a]=u,i[r]=u,o[r]=h[a]?h[a]:u.toPublicKey().toString(n),h[a]=o[r]}),{privKeys:i,pubKeys:o}},t.prototype.checkKeys=function(t){var e=this,r=t.accountName,n=t.password,i=t.auths
if(!r||!n||!i)throw new Error("checkKeys: Missing inputs")
var o=!1
for(var s in i)!function(t){var s=e.generateKeys(r,n,[t]),a=s.privKeys,f=s.pubKeys
i[t].forEach(function(r){r[0]===f[t]&&(o=!0,e.set(t,{priv:a[t],pub:f[t]}))})}(s)
return o&&this.set("name",r),this.set("loggedIn",o),o},t.prototype.signTransaction=function(t){var e=this,r=!1
if(this.get("roles").forEach(function(n){var i=e.get(n)
i&&(r=!0,console.log("adding signer:",i.pub),t.add_signer(i.priv,i.pub))}),!r)throw new Error("You do not have any private keys to sign this transaction")},t}(),p=new l
r.default=p,e.exports=r.default},{"../../ecc/src/KeyUtils":26,"../../ecc/src/PrivateKey":27,"./state":23}],15:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e,r,n){var i=t.bind(X)
return new Promise(function(o,s){function a(){var r=arguments.length>0&&void 0!==arguments[0]&&arguments[0],s=e.map(function(e){return"getAccount"===t.name?i(e,n[e]):"getObject"===t.name?i(e,!1,n[e]):i(e)})
return-1===s.findIndex(function(t){return void 0===t})&&(f&&clearTimeout(f),r||X.unsubscribe(a),o(s),!0)}var f=null,u=a(!0)
u||X.subscribe(a),r&&!u&&(f=setTimeout(function(){X.unsubscribe(a),s("timeout")},r))})}function a(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1900,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=X[t]
if(!i)throw new Error("ChainStore does not have method "+t)
var o=Array.isArray(e)
return o||(e=[e]),X.FetchChainObjects(i,h.default.List(e),r,n).then(function(t){return o?t:t.get(0)})}function f(t){return t?(/Z$/.test(t)||(t+="Z"),new Date(t)):new Date("1970-01-01T00:00:00.000Z")}r.__esModule=!0
var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c=t("immutable"),h=i(c),l=t("bitsharesjs-ws"),p=t("./ChainTypes"),d=i(p),_=t("./ChainValidation"),g=i(_),y=t("bigi"),v=i(y),b=t("./EmitterInstance"),m=i(b),w=d.default.object_type,E=d.default.impl_object_type,S=(0,m.default)(),B=parseInt(w.operation_history,10),x=parseInt(w.limit_order,10),I=parseInt(w.call_order,10),k=parseInt(w.proposal,10),T=parseInt(w.witness,10),A=parseInt(w.worker,10),j=parseInt(w.committee_member,10),O=parseInt(w.account,10),M=parseInt(w.asset,10),z="1."+x+".",L="1."+I+".",C="1."+k+".",q="1."+B+".",D="2."+parseInt(E.account_balance,10)+".",U="2."+parseInt(E.account_statistics,10)+".",R="2."+parseInt(E.transaction,10)+".",N="2."+parseInt(E.account_transaction_history,10)+".",P="2."+parseInt(E.asset_dynamic_data,10)+".",F="2."+parseInt(E.asset_bitasset_data,10)+".",K="2."+parseInt(E.block_summary,10)+".",H="1."+T+".",V="1."+A+".",W="1."+j+".",J="1."+M+".",Z="1."+O+".",G=JSON.parse(n.env.npm_config__graphene_chain_chain_debug||!1),Y=function(){function t(){o(this,t),this.subscribers=new Set,this.subscribed=!1,this.clearCache(),this.chain_time_offset=[],this.dispatchFrequency=40}return t.prototype.clearCache=function(){this.subbed_accounts=new Set,this.subbed_witnesses=new Set,this.subbed_committee=new Set,this.objects_by_id=new Map,this.accounts_by_name=new Map,this.assets_by_symbol=new Map,this.account_ids_by_key=h.default.Map(),this.account_ids_by_account=h.default.Map(),this.balance_objects_by_address=new Map,this.get_account_refs_of_keys_calls=new Set,this.get_account_refs_of_accounts_calls=new Set,this.account_history_requests=new Map,this.witness_by_account_id=new Map,this.committee_by_account_id=new Map,this.objects_by_vote_id=new Map,this.fetching_get_full_accounts=new Map,this.get_full_accounts_subscriptions=new Map,clearTimeout(this.timeout),this.dispatched=!1},t.prototype.resetCache=function(){return this.subscribed=!1,this.subError=null,this.clearCache(),this.head_block_time_string=null,this.init().catch(function(t){console.log("resetCache init error:",t)})},t.prototype.setDispatchFrequency=function(t){this.dispatchFrequency=t},t.prototype.init=function(){var t=this,e=0,r=function r(n,i){if(t.subscribed)return n()
var o=l.Apis.instance().db_api()
return o?o.exec("get_objects",[["2.1.0"]]).then(function(o){for(var s=0;s<o.length;s++){var a=o[s]
if(a){var u=new Date(a.time+"+00:00").getTime()
t.head_block_time_string=a.time,t.chain_time_offset.push((new Date).getTime()-f(a.time).getTime())
if(((new Date).getTime()-u)/1e3<60)l.Apis.instance().db_api().exec("set_subscribe_callback",[t.onUpdate.bind(t),!0]).then(function(){console.log("synced and subscribed, chainstore ready"),t.subscribed=!0,t.subError=null,t.notifySubscribers(),n()}).catch(function(e){t.subscribed=!1,t.subError=e,t.notifySubscribers(),i(e),console.log("Error: ",e)})
else{if(console.log("not yet synced, retrying in 1s"),t.subscribed=!1,e++,t.notifySubscribers(),e>5)return t.subError=new Error("ChainStore sync error, please check your system clock"),i(t.subError)
setTimeout(r.bind(t,n,i),1e3)}}else setTimeout(r.bind(t,n,i),1e3)}}).catch(function(e){console.log("!!! Chain API error",e),t.objects_by_id.delete("2.1.0"),i(e)}):i(new Error("Api not found, please initialize the api instance before calling the ChainStore"))}
return new Promise(function(t,e){return r(t,e)})},t.prototype._subTo=function(t,e){var r="subbed_"+t
this[r].has(e)||this[r].add(e)},t.prototype.unSubFrom=function(t,e){this["subbed_"+t].delete(e),this.objects_by_id.delete(e)},t.prototype._isSubbedTo=function(t,e){return this["subbed_"+t].has(e)},t.prototype.onUpdate=function(t){for(var e=[],r=[],n=0;n<t.length;++n)for(var i=0;i<t[n].length;++i){var o=t[n][i]
if(g.default.is_object_id(o)){var s=this.objects_by_id.get(o)
if(0==o.search(z)&&(e.push(o),s)){var a=this.objects_by_id.get(s.get("seller"))
if(a&&a.has("orders")){var f=a.get("orders")
a.get("orders").has(o)&&(a=a.set("orders",f.delete(o)),this.objects_by_id.set(a.get("id"),a))}}if(0==o.search(L)&&(r.push(o),s)){var u=this.objects_by_id.get(s.get("borrower"))
if(u&&u.has("call_orders")){var c=u.get("call_orders")
u.get("call_orders").has(o)&&(u=u.set("call_orders",c.delete(o)),this.objects_by_id.set(u.get("id"),u))}}s&&this.objects_by_id.set(o,null)}else this._updateObject(o)}e.length&&S.emit("cancel-order",e),r.length&&S.emit("close-call",r),this.notifySubscribers()},t.prototype.notifySubscribers=function(){var t=this
this.dispatched||(this.dispatched=!0,this.timeout=setTimeout(function(){t.dispatched=!1,t.subscribers.forEach(function(t){t()})},this.dispatchFrequency))},t.prototype.subscribe=function(t){if(this.subscribers.has(t))return console.error("Subscribe callback already exists",t)
this.subscribers.add(t)},t.prototype.unsubscribe=function(t){if(!this.subscribers.has(t))return console.error("Unsubscribe callback does not exists",t)
this.subscribers.delete(t)},t.prototype.clearObjectCache=function(t){this.objects_by_id.delete(t)},t.prototype.getObject=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2]
if(!g.default.is_object_id(t))throw Error("argument is not an object id: "+JSON.stringify(t))
var n=this.objects_by_id.get(t),i=t.substring(0,Z.length)==Z&&!this.get_full_accounts_subscriptions.get(t,!1)&&r
return void 0===n||e||i?this.fetchObject(t,e,r):!0!==n?n:void 0},t.prototype.getAsset=function(t){var e=this
if(!t)return null
if(g.default.is_object_id(t)){var r=this.getObject(t)
if(r&&r.get("bitasset")&&!r.getIn(["bitasset","current_feed"]))return
return r}var n=this.assets_by_symbol.get(t)
if(g.default.is_object_id(n)){var i=this.getObject(n)
if(i&&i.get("bitasset")&&!i.getIn(["bitasset","current_feed"]))return
return i}if(null===n)return null
!0!==n&&l.Apis.instance().db_api().exec("lookup_asset_symbols",[[t]]).then(function(r){r.length&&r[0]?e._updateObject(r[0],!0):(e.assets_by_symbol.set(t,null),e.notifySubscribers())}).catch(function(r){console.log("Error: ",r),e.assets_by_symbol.delete(t)})},t.prototype.getAccountRefsOfKey=function(t){var e=this
return this.get_account_refs_of_keys_calls.has(t)?this.account_ids_by_key.get(t):(this.get_account_refs_of_keys_calls.add(t),void l.Apis.instance().db_api().exec("get_key_references",[[t]]).then(function(r){var n=h.default.Set()
r=r[0],n=n.withMutations(function(t){for(var e=0;e<r.length;++e)t.add(r[e])}),e.account_ids_by_key=e.account_ids_by_key.set(t,n),e.notifySubscribers()}).catch(function(r){console.error("get_key_references",r),e.account_ids_by_key=e.account_ids_by_key.delete(t),e.get_account_refs_of_keys_calls.delete(t)}))},t.prototype.getAccountRefsOfAccount=function(t){var e=this
return this.get_account_refs_of_accounts_calls.has(t)?this.account_ids_by_account.get(t):(this.get_account_refs_of_accounts_calls.add(t),void l.Apis.instance().db_api().exec("get_account_references",[t]).then(function(r){var n=h.default.Set()
n=n.withMutations(function(t){for(var e=0;e<r.length;++e)t.add(r[e])}),e.account_ids_by_account=e.account_ids_by_account.set(t,n),e.notifySubscribers()}).catch(function(r){console.error("get_account_references",r),e.account_ids_by_account=e.account_ids_by_account.delete(t),e.get_account_refs_of_accounts_calls.delete(t)}))},t.prototype.getBalanceObjects=function(t){var e=this
return void 0===this.balance_objects_by_address.get(t)&&(this.balance_objects_by_address.set(t,h.default.Set()),l.Apis.instance().db_api().exec("get_balance_objects",[[t]]).then(function(r){for(var n=new Set,i=0;i<r.length;++i)e._updateObject(r[i]),n.add(r[i].id)
e.balance_objects_by_address.set(t,h.default.Set(n)),e.notifySubscribers()},function(){e.balance_objects_by_address.delete(t)})),this.balance_objects_by_address.get(t)},t.prototype.fetchObject=function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2]
if("string"!=typeof t){for(var i=[],o=0;o<t.length;++o)i.push(this.fetchObject(t[o],r,n))
return i}if(G&&console.log("!!! fetchObject: ",t,this.subscribed,!this.subscribed&&!r),this.subscribed||r){if(G&&console.log("maybe fetch object: ",t),!g.default.is_object_id(t))throw Error("argument is not an object id: "+t)
if(0===t.search("1.2."))return this.fetchFullAccount(t,n)
0===t.search(H)&&this._subTo("witnesses",t),0===t.search(W)&&this._subTo("committee",t)
var s=this.objects_by_id.get(t)
if(void 0===s){if(G&&console.log("fetching object: ",t),this.objects_by_id.set(t,!0),!l.Apis.instance().db_api())return null
l.Apis.instance().db_api().exec("get_objects",[[t]]).then(function(r){for(var n=0;n<r.length;n++){var i=r[n]
i?e._updateObject(i,!0):(e.objects_by_id.set(t,null),e.notifySubscribers())}}).catch(function(r){console.log("!!! Chain API error",r),e.objects_by_id.delete(t)})}else if(!0===s)return
return s}},t.prototype.getAccount=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
if(!t)return null
if("object"===(void 0===t?"undefined":u(t)))return t.id?this.getAccount(t.id,e):t.get?this.getAccount(t.get("id"),e):void 0
if(g.default.is_object_id(t)){var r=this.getObject(t,!1,e)
if(null===r)return null
return!this.get_full_accounts_subscriptions.get(t,!1)&&e||void 0===r||void 0===r.get("name")?this.fetchFullAccount(t,e):r}if(g.default.is_account_name(t,!0)){var n=this.accounts_by_name.get(t)
return null===n?null:void 0===n?this.fetchFullAccount(t,e):this.getObject(n,!1,e)}},t.prototype.getWitnessById=function(t){var e=this.witness_by_account_id.get(t)
return void 0===e?void this.fetchWitnessByAccount(t):(e&&this._subTo("witnesses",e),e?this.getObject(e):null)},t.prototype.getCommitteeMemberById=function(t){var e=this.committee_by_account_id.get(t)
return void 0===e?void this.fetchCommitteeMemberByAccount(t):(e&&this._subTo("committee",e),e?this.getObject(e):null)},t.prototype.fetchWitnessByAccount=function(t){var e=this
return new Promise(function(r,n){l.Apis.instance().db_api().exec("get_witness_by_account",[t]).then(function(n){if(n){e._subTo("witnesses",n.id),e.witness_by_account_id=e.witness_by_account_id.set(n.witness_account,n.id)
var i=e._updateObject(n,!0)
r(i)}else e.witness_by_account_id=e.witness_by_account_id.set(t,null),e.notifySubscribers(),r(null)},n)})},t.prototype.fetchCommitteeMemberByAccount=function(t){var e=this
return new Promise(function(r,n){l.Apis.instance().db_api().exec("get_committee_member_by_account",[t]).then(function(n){if(n){e._subTo("committee",n.id),e.committee_by_account_id=e.committee_by_account_id.set(n.committee_member_account,n.id)
var i=e._updateObject(n,!0)
r(i)}else e.committee_by_account_id=e.committee_by_account_id.set(t,null),e.notifySubscribers(),r(null)},n)})},t.prototype.fetchFullAccount=function(t){var e=this,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
G&&console.log("Fetch full account: ",t)
var n=this.get_full_accounts_subscriptions.has(t)&&!1===this.get_full_accounts_subscriptions.get(t)&&r
if(g.default.is_object_id(t)&&!n){var i=this.objects_by_id.get(t)
if(!(void 0===i)&&i&&i.get("name"))return i}else if(!n){if(!g.default.is_account_name(t,!0))throw Error("argument is not an account name: "+t)
var o=this.accounts_by_name.get(t)
if(g.default.is_object_id(o))return this.getAccount(o,r)}(n||!this.fetching_get_full_accounts.has(t)||Date.now()-this.fetching_get_full_accounts.get(t)>5e3)&&(this.fetching_get_full_accounts.set(t,Date.now()),l.Apis.instance().db_api().exec("get_full_accounts",[[t],r]).then(function(n){if(0===n.length)return void(g.default.is_object_id(t)&&(e.objects_by_id.set(t,null),e.notifySubscribers()))
var i=n[0][1]
e.get_full_accounts_subscriptions.set(i.account.name,r),e.get_full_accounts_subscriptions.set(i.account.id,r),G&&console.log("full_account: ",i),e._subTo("accounts",i.account.id)
var o=i.account,s=i.assets,a=i.vesting_balances,f=i.statistics,u=i.call_orders,c=i.limit_orders,p=i.referrer_name,d=i.registrar_name,_=i.lifetime_referrer_name,y=i.votes,v=i.proposals
e.accounts_by_name.set(o.name,o.id),o.assets=new h.default.List(s||[]),o.referrer_name=p,o.lifetime_referrer_name=_,o.registrar_name=d,o.balances={},o.orders=new h.default.Set,o.vesting_balances=new h.default.Set,o.balances=new h.default.Map,o.call_orders=new h.default.Set,o.proposals=new h.default.Set,o.vesting_balances=o.vesting_balances.withMutations(function(t){a.forEach(function(r){e._updateObject(r),t.add(r.id)})})
var b=[]
y.forEach(function(t){return e._updateObject(t)}),o.balances=o.balances.withMutations(function(t){i.balances.forEach(function(r){e._updateObject(r),t.set(r.asset_type,r.id),b.push(r.id)})}),o.orders=o.orders.withMutations(function(t){c.forEach(function(r){e._updateObject(r),t.add(r.id),b.push(r.id)})}),o.call_orders=o.call_orders.withMutations(function(t){u.forEach(function(r){e._updateObject(r),t.add(r.id),b.push(r.id)})}),o.proposals=o.proposals.withMutations(function(t){v.forEach(function(r){e._updateObject(r),t.add(r.id),b.push(r.id)})}),b.length&&l.Apis.instance().db_api().exec("get_objects",[b]),e._updateObject(f)
var m=e._updateObject(o)
e.fetchRecentHistory(m),e.notifySubscribers()},function(r){console.log("Error: ",r),g.default.is_object_id(t)?e.objects_by_id.delete(t):e.accounts_by_name.delete(t)}))},t.prototype.getAccountMemberStatus=function(t){if(void 0!==t){if(null===t)return"unknown"
if(t.get("lifetime_referrer")==t.get("id"))return"lifetime"
return new Date(t.get("membership_expiration_date")).getTime()<(new Date).getTime()?"basic":"annual"}},t.prototype.getAccountBalance=function(t,e){var r=t.get("balances")
if(!r)return 0
var n=r.get(e)
if(n){var i=this.objects_by_id.get(n)
if(i)return i.get("balance")}return 0},t.prototype.fetchRecentHistory=function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,n=t
if(!g.default.is_object_id(n)&&t.toJS&&(n=t.get("id")),g.default.is_object_id(n)&&(t=this.objects_by_id.get(n))){var i=this.account_history_requests.get(n)
if(i)return i.requests++,i.promise
i={requests:0}
var o="1."+B+".0",s=t.get("history")
s&&s.size&&(o=s.first().get("id"))
var a="1."+B+".0"
return i.promise=new Promise(function(t,i){l.Apis.instance().history_api().exec("get_account_history",[n,o,r,a]).then(function(o){var s=e.objects_by_id.get(n)
if(s){var a=s.get("history")
a||(a=h.default.List())
var f=h.default.fromJS(o)
f=f.withMutations(function(t){for(var e=0;e<a.size;++e)t.push(a.get(e))})
var u=s.set("history",f)
e.objects_by_id.set(n,u)
var c=e.account_history_requests.get(n)
e.account_history_requests.delete(n),c.requests>0?e.fetchRecentHistory(u,r).then(t,i):t(u)}})}),this.account_history_requests.set(n,i),i.promise}},t.prototype._updateObject=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2]
if(!("id"in t))return console.log("object with no id:",t),void("balance"in t&&"owner"in t&&"settlement_date"in t&&S.emit("settle-order-update",t))
if(t.id.substring(0,R.length)!=R){if(t.id.substring(0,N.length)==N){if(!this._isSubbedTo("accounts",t.account))return}else if(t.id.substring(0,z.length)==z){if(!this._isSubbedTo("accounts",t.seller))return}else if(t.id.substring(0,L.length)==L){if(!this._isSubbedTo("accounts",t.borrower))return}else if(t.id.substring(0,D.length)==D){if(!this._isSubbedTo("accounts",t.owner))return}else{if(t.id.substring(0,q.length)==q)return
if(t.id.substring(0,K.length)==K)return
if(t.id.substring(0,U.length)==U){if(!this._isSubbedTo("accounts",t.owner))return}else if(t.id.substring(0,H.length)==H){if(!this._isSubbedTo("witnesses",t.id))return}else if(t.id.substring(0,W.length)==W){if(!this._isSubbedTo("committee",t.id))return}else if("0.0."===t.id.substring(0,4)||"5.1."===t.id.substring(0,4))return}"2.1.0"==t.id&&(t.participation=(0,v.default)(t.recent_slots_filled).bitCount()/128*100,this.head_block_time_string=t.time,this.chain_time_offset.push(Date.now()-f(t.time).getTime()),this.chain_time_offset.length>10&&this.chain_time_offset.shift())
var n=this.objects_by_id.get(t.id)
n||(n=h.default.Map())
var i=n
if(void 0===n||!0===n?this.objects_by_id.set(t.id,n=h.default.fromJS(t)):this.objects_by_id.set(t.id,n=n.mergeDeep(h.default.fromJS(t))),t.id.substring(0,D.length)==D){var o=this.objects_by_id.get(t.owner)
if(void 0===o||null===o)return
o.get("balances")||(o=o.set("balances",h.default.Map())),o=o.setIn(["balances",t.asset_type],t.id),this.objects_by_id.set(t.owner,o)}else if(t.id.substring(0,U.length)==U)try{var s=i.get("most_recent_op","2.9.0")
s!=t.most_recent_op&&this.fetchRecentHistory(t.owner)}catch(t){console.log("prior error:","object:",obj,"prior",i,"err:",t)}else if(t.id.substring(0,H.length)==H){if(!this._isSubbedTo("witnesses",t.id))return
this.witness_by_account_id.set(t.witness_account,t.id),this.objects_by_vote_id.set(t.vote_id,t.id)}else if(t.id.substring(0,W.length)==W){if(!this._isSubbedTo("committee",t.id))return
this.committee_by_account_id.set(t.committee_member_account,t.id),this.objects_by_vote_id.set(t.vote_id,t.id)}else if(t.id.substring(0,Z.length)==Z)n=n.set("active",h.default.fromJS(t.active)),n=n.set("owner",h.default.fromJS(t.owner)),n=n.set("options",h.default.fromJS(t.options)),n=n.set("whitelisting_accounts",h.default.fromJS(t.whitelisting_accounts)),n=n.set("blacklisting_accounts",h.default.fromJS(t.blacklisting_accounts)),n=n.set("whitelisted_accounts",h.default.fromJS(t.whitelisted_accounts)),n=n.set("blacklisted_accounts",h.default.fromJS(t.blacklisted_accounts)),this.objects_by_id.set(t.id,n),this.accounts_by_name.set(t.name,t.id)
else if(t.id.substring(0,J.length)==J){this.assets_by_symbol.set(t.symbol,t.id)
var a=n.get("dynamic")
if(!a){var u=this.getObject(t.dynamic_asset_data_id,!0)
u||(u=h.default.Map()),u.get("asset_id")||(u=u.set("asset_id",t.id)),this.objects_by_id.set(t.dynamic_asset_data_id,u),n=n.set("dynamic",u),this.objects_by_id.set(t.id,n)}var c=n.get("bitasset")
if(!c&&t.bitasset_data_id){var p=this.getObject(t.bitasset_data_id,!0)
p||(p=h.default.Map()),p.get("asset_id")||(p=p.set("asset_id",t.id)),this.objects_by_id.set(t.bitasset_data_id,p),n=n.set("bitasset",p),this.objects_by_id.set(t.id,n)}}else if(t.id.substring(0,P.length)==P){var d=n.get("asset_id")
if(d){var _=this.getObject(d)
_&&_.set&&(_=_.set("dynamic",n),this.objects_by_id.set(d,_))}}else if(t.id.substring(0,V.length)==V)this.objects_by_vote_id.set(t.vote_for,t.id),this.objects_by_vote_id.set(t.vote_against,t.id)
else if(t.id.substring(0,F.length)==F){var g=n.get("asset_id")
if(g){var y=this.getObject(g)
y&&(y=y.set("bitasset",n),S.emit("bitasset-update",y),this.objects_by_id.set(g,y))}}else if(t.id.substring(0,L.length)==L){r&&S.emit("call-order-update",t)
var b=this.objects_by_id.get(t.borrower)
if(b){b.has("call_orders")||(b=b.set("call_orders",new h.default.Set))
var m=b.get("call_orders")
m.has(t.id)||(b=b.set("call_orders",m.add(t.id)),this.objects_by_id.set(b.get("id"),b),l.Apis.instance().db_api().exec("get_objects",[[t.id]]))}}else if(t.id.substring(0,z.length)==z){var w=this.objects_by_id.get(t.seller)
if(w){w.has("orders")||(w=w.set("orders",new h.default.Set))
var E=w.get("orders")
E.has(t.id)||(w=w.set("orders",E.add(t.id)),this.objects_by_id.set(w.get("id"),w),l.Apis.instance().db_api().exec("get_objects",[[t.id]]))}}else t.id.substring(0,C.length)==C&&(this.addProposalData(t.required_active_approvals,t.id),this.addProposalData(t.required_owner_approvals,t.id))
return e&&this.notifySubscribers(),n}},t.prototype.getObjectsByVoteIds=function(t){for(var e=this,r=[],n=[],i=0;i<t.length;++i){var o=this.objects_by_vote_id.get(t[i])
o?r.push(this.getObject(o)):(r.push(null),n.push(t[i]))}return n.length&&l.Apis.instance().db_api().exec("lookup_vote_ids",[n]).then(function(t){console.log("missing ===========> ",n),console.log("vote objects ===========> ",t)
for(var r=0;r<t.length;++r)if(t[r]){var i=t[r].id.substring(0,H.length)==H
e._subTo(i?"witnesses":"committee",t[r].id),e._updateObject(t[r])}},function(t){return console.log("Error looking up vote ids: ",t)}),r},t.prototype.getObjectByVoteID=function(t){var e=this.objects_by_vote_id.get(t)
if(e)return this.getObject(e)},t.prototype.getHeadBlockDate=function(){return f(this.head_block_time_string)},t.prototype.getEstimatedChainTimeOffset=function(){return 0===this.chain_time_offset.length?0:h.default.List(this.chain_time_offset).sort().get(Math.floor((this.chain_time_offset.length-1)/2))},t.prototype.addProposalData=function(t,e){var r=this
t.forEach(function(t){var n=r.objects_by_id.get(t)
if(n){var i=n.get("proposals",h.default.Set())
i.includes(e)||(i=i.add(e),n=n.set("proposals",i),r._updateObject(n.toJS()))}})},t}(),X=new Y
X.FetchChainObjects=s,X.FetchChain=a,r.default=X,e.exports=r.default}).call(this,t("_process"))},{"./ChainTypes":16,"./ChainValidation":17,"./EmitterInstance":18,_process:113,bigi:6,"bitsharesjs-ws":8,immutable:88}],16:[function(t,e,r){"use strict"
r.__esModule=!0
var n={}
n.reserved_spaces={relative_protocol_ids:0,protocol_ids:1,implementation_ids:2},n.object_type={null:0,base:1,account:2,asset:3,force_settlement:4,committee_member:5,witness:6,limit_order:7,call_order:8,custom:9,proposal:10,operation_history:11,withdraw_permission:12,vesting_balance:13,worker:14,balance:15},n.impl_object_type={global_property:0,dynamic_global_property:1,index_meta:2,asset_dynamic_data:3,asset_bitasset_data:4,account_balance:5,account_statistics:6,transaction:7,block_summary:8,account_transaction_history:9,blinded_balance:10,chain_property:11,witness_schedule:12,budget_record:13},n.vote_type={committee:0,witness:1,worker:2},n.operations={transfer:0,limit_order_create:1,limit_order_cancel:2,call_order_update:3,fill_order:4,account_create:5,account_update:6,account_whitelist:7,account_upgrade:8,account_transfer:9,asset_create:10,asset_update:11,asset_update_bitasset:12,asset_update_feed_producers:13,asset_issue:14,asset_reserve:15,asset_fund_fee_pool:16,asset_settle:17,asset_global_settle:18,asset_publish_feed:19,witness_create:20,witness_update:21,proposal_create:22,proposal_update:23,proposal_delete:24,withdraw_permission_create:25,withdraw_permission_update:26,withdraw_permission_claim:27,withdraw_permission_delete:28,committee_member_create:29,committee_member_update:30,committee_member_update_global_parameters:31,vesting_balance_create:32,vesting_balance_withdraw:33,worker_create:34,custom:35,assert:36,balance_claim:37,override_transfer:38,transfer_to_blind:39,blind_transfer:40,transfer_from_blind:41,asset_settle_cancel:42,asset_claim_fees:43},r.default=n,e.exports=r.default},{}],17:[function(t,e,r){"use strict"
r.__esModule=!0
var n=/\b\d+\.\d+\.(\d+)\b/,i={is_account_name:function(t){var e,r,n,i,o,s=arguments.length>1&&void 0!==arguments[1]&&arguments[1]
if(this.is_empty(t))return!1
if(i=t.length,!s&&i<3||i>63)return!1
for(o=t.split("."),e=0,n=o.length;e<n;e++)if(r=o[e],!/^[a-z][a-z0-9-]*$/.test(r)||/--/.test(r)||!/[a-z0-9]$/.test(r))return!1
return!0},is_object_id:function(t){return"string"==typeof t&&(null!==n.exec(t)&&3===t.split(".").length)},is_empty:function(t){return null==t||0===t.length},is_account_name_error:function(t,e){var r,n,i,o,s,a
if(null==e&&(e=!1),a="Account name should ",this.is_empty(t))return a+"not be empty."
if(o=t.length,!e&&o<3)return a+"be longer."
if(o>63)return a+"be shorter."
for(/\./.test(t)&&(a="Each account segment should "),s=t.split("."),r=0,i=s.length;r<i;r++){if(n=s[r],!/^[~a-z]/.test(n))return a+"start with a letter."
if(!/^[~a-z0-9-]*$/.test(n))return a+"have only letters, digits, or dashes."
if(/--/.test(n))return a+"have only one dash in a row."
if(!/[a-z0-9]$/.test(n))return a+"end with a letter or digit."
if(!(n.length>=3))return a+"be longer"}return null},is_cheap_name:function(t){return/[0-9-]/.test(t)||!/[aeiouy]/.test(t)},is_empty_user_input:function(t){return!!this.is_empty(t)||""===(t+"").trim()},required:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(this.is_empty(t))throw new Error("value required for "+e+": "+t)
return t},is_valid_symbol_error:function(t){var e="Asset name should "
return this.is_empty(t)?e+"not be empty.":t.split(".").length>2?e+"have only one dot.":t.length<3?e+"be longer.":t.length>16?e+"be shorter.":/^[A-Z]/.test(t)?/[A-Z]$/.test(t)?/^[A-Z0-9\.]$/.test(t)?e+"contain only letters numbers and perhaps a dot.":null:e+"end with a letter":e+"start with a letter"}}
r.default=i,e.exports=r.default},{}],18:[function(t,e,r){"use strict"
function n(){return i||(i=(0,s.default)({})),i}r.__esModule=!0,r.default=n
var i,o=t("event-emitter"),s=function(t){return t&&t.__esModule?t:{default:t}}(o)
e.exports=r.default},{"event-emitter":86}],19:[function(t,e,r){"use strict"
r.__esModule=!0
var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=t("assert"),o=function(t){return t&&t.__esModule?t:{default:t}}(i),s={toImpliedDecimal:function(t,e){"number"==typeof t?((0,o.default)(t<=9007199254740991,"overflow"),t=""+t):t.toString&&(t=t.toString()),(0,o.default)("string"==typeof t,"number should be an actual number or string: "+(void 0===t?"undefined":n(t))),t=t.trim(),(0,o.default)(/^[0-9]*\.?[0-9]*$/.test(t),"Invalid decimal number "+t)
var r=t.split("."),i=r[0],s=void 0===i?"":i,a=r[1],f=void 0===a?"":a,u=e-f.length;(0,o.default)(u>=0,"Too many decimal digits in "+t+" to create an implied decimal of "+e)
for(var c=0;c<u;c++)f+="0"
for(;"0"===s.charAt(0);)s=s.substring(1)
return s+f}}
r.default=s,e.exports=r.default},{assert:102}],20:[function(t,e,r){"use strict"
function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var i=t("bytebuffer"),o=t("../../serializer/src/SerializerValidation"),s=function(t){return t&&t.__esModule?t:{default:t}}(o),a=i.Long.fromNumber(Math.pow(2,48)-1),f=function(){function t(e,r,i){n(this,t),this.space=e,this.type=r,this.instance=i
var o=this.instance.toString(),a=this.space+"."+this.type+"."+o
if(!s.default.is_digits(o))throw new("Invalid object id "+a)}return t.fromString=function(e){if(void 0!==e.space&&void 0!==e.type&&void 0!==e.instance)return e
var r=s.default.require_match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/,s.default.required(e,"ObjectId"),"ObjectId")
return new t(parseInt(r[1]),parseInt(r[2]),i.Long.fromString(r[3]))},t.fromLong=function(e){return new t(e.shiftRight(56).toInt(),255&e.shiftRight(48).toInt(),e.and(a))},t.fromByteBuffer=function(e){return t.fromLong(e.readUint64())},t.prototype.toLong=function(){return i.Long.fromNumber(this.space).shiftLeft(56).or(i.Long.fromNumber(this.type).shiftLeft(48).or(this.instance))},t.prototype.appendByteBuffer=function(t){return t.writeUint64(this.toLong())},t.prototype.toString=function(){return this.space+"."+this.type+"."+this.instance.toString()},t}()
r.default=f,e.exports=r.default},{"../../serializer/src/SerializerValidation":39,bytebuffer:46}],21:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t){var e=this
return new Promise(function(r,n){if(e.signed||e.sign(),!e.tr_buffer)throw new Error("not finalized")
if(!e.signatures.length)throw new Error("not signed")
if(!e.operations.length)throw new Error("no operations")
var i=d.ops.signed_transaction.toObject(e)
_.Apis.instance().network_api().exec("broadcast_transaction_with_callback",[function(t){return r(t)},i]).then(function(){t&&t()}).catch(function(t){console.log(t)
var r=t.message
r||(r=""),n(new Error(r+"\nbitshares-crypto  digest "+p.hash.sha256(e.tr_buffer).toString("hex")+" transaction "+e.tr_buffer.toString("hex")+" "+JSON.stringify(i)))})})}function a(){return f(u)}function f(t){return t?(/Z$/.test(t)||(t+="Z"),new Date(t)):new Date("1970-01-01T00:00:00.000Z")}r.__esModule=!0
var u,c,h=t("assert"),l=i(h),p=t("../../ecc"),d=t("../../serializer"),_=t("bitsharesjs-ws"),g=t("./ChainTypes"),y=i(g),v=function(){function t(){o(this,t),this.ref_block_num=0,this.ref_block_prefix=0,this.expiration=0,this.operations=[],this.signatures=[],this.signer_private_keys=[],this._broadcast=s.bind(this)}return t.prototype.add_type_operation=function(t,e){this.add_operation(this.get_type_operation(t,e))},t.prototype.process_transaction=function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=t.wallet.wallet_object
return _.Apis.instance().chain_id!==i.get("chain_id")?Promise.reject("Mismatched chain_id; expecting "+i.get("chain_id")+", but got "+_.Apis.instance().chain_id):this.set_required_fees().then(function(){var i={}
if(r){var o=t.getPubkeys_having_PrivateKey(r)
if(!o.length)throw new Error("Missing signing key")
for(var s=o,a=Array.isArray(s),f=0,s=a?s:s[Symbol.iterator]();;){var u
if(a){if(f>=s.length)break
u=s[f++]}else{if(f=s.next(),f.done)break
u=f.value}var c=u,h=t.getPrivateKey(c)
e.add_signer(h,c),i[c]=!0}}return e.get_potential_signatures().then(function(r){var n=r.pubkeys,o=r.addys,s=t.getPubkeys_having_PrivateKey(n,o)
return e.get_required_signatures(s).then(function(r){for(var n=r,o=Array.isArray(n),s=0,n=o?n:n[Symbol.iterator]();;){var a
if(o){if(s>=n.length)break
a=n[s++]}else{if(s=n.next(),s.done)break
a=s.value}var f=a
if(!i[f]){var u=t.getPrivateKey(f)
if(!u)throw new Error("Missing signing key for "+f)
e.add_signer(u,f)}}})}).then(function(){return n?e.broadcast():e.serialize()})})},t.prototype.finalize=function(){var t=this
return new Promise(function(e,r){if(t.tr_buffer)throw new Error("already finalized")
e(_.Apis.instance().db_api().exec("get_objects",[["2.1.0"]]).then(function(e){u=e[0].time,0===t.expiration&&(t.expiration=b()+_.ChainConfig.expire_in_secs),t.ref_block_num=65535&e[0].head_block_number,t.ref_block_prefix=new n(e[0].head_block_id,"hex").readUInt32LE(4)
for(var r,i=t.operations,o=0;o<i.length;o++)r=i[o],r[1].finalize&&r[1].finalize()
t.tr_buffer=d.ops.transaction.toBuffer(t)}))})},t.prototype.id=function(){if(!this.tr_buffer)throw new Error("not finalized")
return p.hash.sha256(this.tr_buffer).toString("hex").substring(0,40)},t.prototype.add_operation=function(t){if(this.tr_buffer)throw new Error("already finalized")
if((0,l.default)(t,"operation"),!Array.isArray(t))throw new Error("Expecting array [operation_id, operation]")
this.operations.push(t)},t.prototype.get_type_operation=function(t,e){if(this.tr_buffer)throw new Error("already finalized");(0,l.default)(t,"name"),(0,l.default)(e,"operation")
var r=d.ops[t];(0,l.default)(r,"Unknown operation "+t)
var n=y.default.operations[r.operation_name]
if(void 0===n)throw new Error("unknown operation: "+r.operation_name)
if(e.fee||(e.fee={amount:0,asset_id:0}),"proposal_create"===t){var i=!1,o=0
e.proposed_ops.forEach(function(t){var e=void 0
switch(t.op[0]){case 0:e="from"
break
case 6:case 17:e="account"
break
case 10:case 11:case 12:case 13:case 14:case 18:case 43:e="issuer"
break
case 15:e="payer"
break
case 16:e="from_account"
break
case 22:case 23:case 24:e="fee_paying_account"
break
case 31:i=!0,o=1123200}e in t.op[1]&&0===t.op[1][e]&&(i=!0)}),e.expiration_time||(e.expiration_time=b()+_.ChainConfig.expire_in_secs_proposal),i&&(e.review_period_seconds=o+Math.max(c,86400),e.expiration_time+=3600+o)}return[n,r.fromObject(e)]},t.prototype.update_head_block=function(){return Promise.all([_.Apis.instance().db_api().exec("get_objects",[["2.0.0"]]),_.Apis.instance().db_api().exec("get_objects",[["2.1.0"]])]).then(function(t){var e=t[0],r=t[1]
u=r[0].time,c=e[0].parameters.committee_proposal_review_period})},t.prototype.set_expire_seconds=function(t){if(this.tr_buffer)throw new Error("already finalized")
return this.expiration=b()+t},t.prototype.propose=function(t){if(this.tr_buffer)throw new Error("already finalized")
if(!this.operations.length)throw new Error("add operation first");(0,l.default)(t,"proposal_create_options"),(0,l.default)(t.fee_paying_account,"proposal_create_options.fee_paying_account")
var e=this.operations.map(function(t){return{op:t}})
return this.operations=[],this.signatures=[],this.signer_private_keys=[],t.proposed_ops=e,this.add_type_operation("proposal_create",t),this},t.prototype.has_proposed_operation=function(){for(var t=!1,e=0;e<this.operations.length;e++)if("proposed_ops"in this.operations[e][1]){t=!0
break}return t},t.prototype.set_required_fees=function(t){var e=this,r=void 0
if(this.tr_buffer)throw new Error("already finalized")
if(!this.operations.length)throw new Error("add operations first")
for(var n,i=[],o=0;o<this.operations.length;o++)n=this.operations[o],i.push(d.ops.operation.toObject(n))
if(!t){var s=i[0][1].fee
t=s&&null!==s.asset_id?s.asset_id:"1.3.0"}var a=[_.Apis.instance().db_api().exec("get_required_fees",[i,t])]
"1.3.0"!==t&&(a.push(_.Apis.instance().db_api().exec("get_required_fees",[i,"1.3.0"])),a.push(_.Apis.instance().db_api().exec("get_objects",[[t]])))
var f=void 0,u=void 0,c=void 0
return Promise.all(a).then(function(e){return f=e[0],u=e[1],c=e[2],c=c?c[0]:null,"1.3.0"!==t&&c?_.Apis.instance().db_api().exec("get_objects",[[c.dynamic_asset_data_id]]):new Promise(function(t){return t()})}).then(function(n){if("1.3.0"!==t){r=n?n[0].fee_pool:0
for(var i,o=0,s=0;s<u.length;s++)i=u[s],o+=i.amount
o>parseInt(r,10)&&(f=u,t="1.3.0")}var a=[]
!function t(e){if(Array.isArray(e))for(var r,n=0;n<e.length;n++)r=e[n],t(r)
else a.push(e)}(f)
for(var c=0,h=0;h<e.operations.length;h++)!function t(e){if((!e.fee||0===e.fee.amount||e.fee.amount.toString&&"0"===e.fee.amount.toString())&&(e.fee=a[c]),c++,e.proposed_ops){for(var r=[],n=0;n<e.proposed_ops.length;n++)r.push(t(e.proposed_ops[n].op[1]))
return r}}(e.operations[h][1])})},t.prototype.get_potential_signatures=function(){var t=d.ops.signed_transaction.toObject(this)
return Promise.all([_.Apis.instance().db_api().exec("get_potential_signatures",[t]),_.Apis.instance().db_api().exec("get_potential_address_signatures",[t])]).then(function(t){return{pubkeys:t[0],addys:t[1]}})},t.prototype.get_required_signatures=function(t){if(!t.length)return Promise.resolve([])
var e=d.ops.signed_transaction.toObject(this)
return _.Apis.instance().db_api().exec("get_required_signatures",[e,t]).then(function(t){return t})},t.prototype.add_signer=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.toPublicKey()
if((0,l.default)(t.d,"required PrivateKey object"),this.signed)throw new Error("already signed")
e.Q||(e=p.PublicKey.fromPublicKeyString(e))
for(var r=t.toHex(),n=this.signer_private_keys,i=Array.isArray(n),o=0,n=i?n:n[Symbol.iterator]();;){var s
if(i){if(o>=n.length)break
s=n[o++]}else{if(o=n.next(),o.done)break
s=o.value}if(s[0].toHex()===r)return}this.signer_private_keys.push([t,e])},t.prototype.sign=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_.Apis.instance().chain_id
if(!this.tr_buffer)throw new Error("not finalized")
if(this.signed)throw new Error("already signed")
if(!this.signer_private_keys.length)throw new Error("Transaction was not signed. Do you have a private key? [no_signers]")
for(var e=this.signer_private_keys.length,r=0;0<e?r<e:r>e;r++){var i=this.signer_private_keys[r],o=i[0],s=i[1],a=p.Signature.signBuffer(n.concat([new n(t,"hex"),this.tr_buffer]),o,s)
this.signatures.push(a.toBuffer())}this.signer_private_keys=[],this.signed=!0},t.prototype.serialize=function(){return d.ops.signed_transaction.toObject(this)},t.prototype.toObject=function(){return d.ops.signed_transaction.toObject(this)},t.prototype.broadcast=function(t){var e=this
return this.tr_buffer?this._broadcast(t):this.finalize().then(function(){return e._broadcast(t)})},t}(),b=function(){var t=Math.ceil(a().getTime()/1e3),e=Math.ceil(Date.now()/1e3)
return e-t>30?t:Math.max(e,t)}
r.default=v,e.exports=r.default}).call(this,t("buffer").Buffer)},{"../../ecc":24,"../../serializer":37,"./ChainTypes":16,assert:102,"bitsharesjs-ws":8,buffer:105}],22:[function(t,e,r){"use strict"
r.__esModule=!0
var n=t("secure-random"),i=function(t){return t&&t.__esModule?t:{default:t}}(n),o=t("bytebuffer"),s=t("../../ecc"),a=t("../../serializer"),f=t("bitsharesjs-ws"),u={}
u.unique_nonce_entropy=null,u.unique_nonce_uint64=function(){var t=u.unique_nonce_entropy=function(){return null===u.unique_nonce_entropy?parseInt(i.default.randomUint8Array(1)[0]):++u.unique_nonce_entropy%256}(),e=o.Long.fromNumber(Date.now())
return e=e.shiftLeft(8).or(o.Long.fromNumber(t)),e.toString()},u.to_json=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1]
return function(t,e){var r=a.ops.signed_transaction.toObject(t)
if(e){var n=f.Apis.instance().network_api()
return console.log("... tr_object",JSON.stringify(r)),n.exec("broadcast_transaction",[r])}return r}(t,e)},u.signed_tr_json=function(t,e){var r=a.ops.transaction.toBuffer(t)
return t=a.ops.transaction.toObject(t),t.signatures=function(){for(var t=[],n=0;0<e.length?n<e.length:n>e.length;e.length,n++){var i=e[n]
t.push(s.Signature.signBuffer(r,i).toHex())}return t}(),t},u.expire_in_min=function(t){return Math.round(Date.now()/1e3)+60*t},u.seconds_from_now=function(t){return Math.round(Date.now()/1e3)+t},u.template=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{use_default:!0,annotate:!0},r=a.ops[t]
if(!r)throw new Error("unknown serializer_operation_type "+t)
return r.toObject(void 0,e)},u.new_operation=function(t){var e=a.ops[t]
if(!e)throw new Error("unknown serializer_operation_type "+t)
var r=e.toObject(void 0,{use_default:!0,annotate:!0})
return e.fromObject(r)},u.instance=function(t){return t.substring("0.0.".length)},r.default=u,e.exports=r.default},{"../../ecc":24,"../../serializer":37,"bitsharesjs-ws":8,bytebuffer:46,"secure-random":93}],23:[function(t,e,r){"use strict"
function n(t){return function(e){return t[e]||""}}function i(t){return function(e,r){return t[e]=r,this}}r.__esModule=!0,r.get=n,r.set=i},{}],24:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.key=r.hash=r.brainKey=r.Signature=r.PublicKey=r.PrivateKey=r.Aes=r.Address=void 0
var i=t("./src/address"),o=n(i),s=t("./src/aes"),a=n(s),f=t("./src/PrivateKey"),u=n(f),c=t("./src/PublicKey"),h=n(c),l=t("./src/signature"),p=n(l),d=t("./src/BrainKey"),_=n(d),g=t("./src/hash"),y=function(t){if(t&&t.__esModule)return t
var e={}
if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])
return e.default=t,e}(g),v=t("./src/KeyUtils"),b=n(v)
r.Address=o.default,r.Aes=a.default,r.PrivateKey=u.default,r.PublicKey=h.default,r.Signature=p.default,r.brainKey=_.default,r.hash=y,r.key=b.default},{"./src/BrainKey":25,"./src/KeyUtils":26,"./src/PrivateKey":27,"./src/PublicKey":28,"./src/address":29,"./src/aes":30,"./src/hash":34,"./src/signature":35}],25:[function(t,e,r){"use strict"
function n(t){if("string"!=typeof t)throw new Error("string required for brainKey")
return t=t.trim(),t.split(/[\t\n\v\f\r ]+/).join(" ")}r.__esModule=!0,r.default=n,e.exports=r.default},{}],26:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0
var o=t("./PrivateKey"),s=i(o),a=t("./PublicKey"),f=i(a),u=t("./address"),c=i(u),h=t("./aes"),l=i(h),p=t("./hash"),d=t("secure-random"),_=i(d),g=t("bitsharesjs-ws"),y={aes_checksum:function(t){if("string"!=typeof t)throw new"password string required"
for(var e=_.default.randomBuffer(4).toString("hex"),r=0,n=e+t,i=Date.now();Date.now()-i<250;)n=(0,p.sha256)(n),r+=1
var o=(0,p.sha256)(n),s=[r,e.toString("hex"),o.slice(0,4).toString("hex")].join(",")
return{aes_private:l.default.fromSeed(n),checksum:s}},aes_private:function(t,e){for(var r=e.split(","),n=r[0],i=r[1],o=r[2],s=i+t,a=0;0<n?a<n:a>n;a++)s=(0,p.sha256)(s)
if((0,p.sha256)(s).slice(0,4).toString("hex")!==o)throw new Error("wrong password")
return l.default.fromSeed(s)},random32ByteBuffer:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.browserEntropy()
if("string"!=typeof t)throw new Error("string required for entropy")
if(t.length<32)throw new Error("expecting at least 32 bytes of entropy")
for(var e=Date.now();Date.now()-e<250;)t=(0,p.sha256)(t)
var r=[]
return r.push(t),r.push(_.default.randomBuffer(32)),(0,p.sha256)(n.concat(r))},suggest_brain_key:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:",",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.browserEntropy(),r=this.random32ByteBuffer(e),n=t.split(",")
if(49744!==n.length)throw new Error("expecting 49744 but got "+n.length+" dictionary words")
for(var i=[],o=0;o<32;o+=2){var s=(r[o]<<8)+r[o+1],a=s/Math.pow(2,16),f=Math.round(n.length*a)
i.push(n[f])}return this.normalize_brainKey(i.join(" "))},get_random_key:function(t){return s.default.fromBuffer(this.random32ByteBuffer(t))},get_brainPrivateKey:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0
if(e<0)throw new Error("invalid sequence")
return t=y.normalize_brainKey(t),s.default.fromBuffer((0,p.sha256)((0,p.sha512)(t+" "+e)))},normalize_brainKey:function(t){if("string"!=typeof t)throw new Error("string required for brainKey")
return t=t.trim(),t.split(/[\t\n\v\f\r ]+/).join(" ")},browserEntropy:function(){var t=""
try{t=(new Date).toString()+" "+window.screen.height+" "+window.screen.width+" "+window.screen.colorDepth+"  "+window.screen.availHeight+" "+window.screen.availWidth+" "+window.screen.pixelDepth+navigator.language+" "+window.location+" "+window.history.length
for(var e,r=0;r<navigator.mimeTypes.length;r++)e=navigator.mimeTypes[r],t+=e.description+" "+e.type+" "+e.suffixes+" "
console.log("INFO\tbrowserEntropy gathered")}catch(e){t=(0,p.sha256)((new Date).toString())}var i=new n(t)
return t+=i.toString("binary")+" "+(new Date).toString()},addresses:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g.ChainConfig.address_prefix,r=f.default.fromPublicKeyString(t,e)
return[c.default.fromPublic(r,!1,0).toString(e),c.default.fromPublic(r,!0,0).toString(e),c.default.fromPublic(r,!1,56).toString(e),c.default.fromPublic(r,!0,56).toString(e),r.toAddressString(e)]}}
r.default=y,e.exports=r.default}).call(this,t("buffer").Buffer)},{"./PrivateKey":27,"./PublicKey":28,"./address":29,"./aes":30,"./hash":34,"bitsharesjs-ws":8,buffer:105,"secure-random":93}],27:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var s=t("ecurve"),a=(i(s),t("bigi")),f=i(a),u=t("bs58"),c=t("./hash"),h=t("./PublicKey"),l=i(h),p=t("deep-equal"),d=i(p),_=t("assert"),g=i(_),y=(0,s.getCurveByName)("secp256k1"),v=(y.G,y.n),b=function(){function t(e){o(this,t),this.d=e}return t.fromBuffer=function(e){if(!n.isBuffer(e))throw new Error("Expecting paramter to be a Buffer type")
if(32!==e.length&&console.log("WARN: Expecting 32 bytes, instead got "+e.length+", stack trace:",(new Error).stack),0===e.length)throw new Error("Empty buffer")
return new t(f.default.fromBuffer(e))},t.fromSeed=function(e){if("string"!=typeof e)throw new Error("seed must be of type string")
return t.fromBuffer((0,c.sha256)(e))},t.fromWif=function(e){var r=new n((0,u.decode)(e)),i=r.readUInt8(0)
g.default.equal(128,i,"Expected version 128, instead got "+i)
var o=r.slice(0,-4),s=r.slice(-4),a=(0,c.sha256)(o)
if(a=(0,c.sha256)(a),a=a.slice(0,4),!(0,d.default)(s,a))throw new Error("Checksum did not match")
return o=o.slice(1),t.fromBuffer(o)},t.prototype.toWif=function(){var t=this.toBuffer()
t=n.concat([new n([128]),t])
var e=(0,c.sha256)(t)
e=(0,c.sha256)(e),e=e.slice(0,4)
var r=n.concat([t,e])
return(0,u.encode)(r)},t.prototype.toPublicKeyPoint=function(){return y.G.multiply(this.d)},t.prototype.toPublicKey=function(){return this.public_key?this.public_key:this.public_key=l.default.fromPoint(this.toPublicKeyPoint())},t.prototype.toBuffer=function(){return this.d.toBuffer(32)},t.prototype.get_shared_secret=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1]
t=m(t)
var r=t.toUncompressed().toBuffer(),i=s.Point.fromAffine(y,f.default.fromBuffer(r.slice(1,33)),f.default.fromBuffer(r.slice(33,65))),o=this.toBuffer(),a=i.multiply(f.default.fromBuffer(o)),u=a.affineX.toBuffer({size:32})
if(!e&&u.length<32){var h=new n(32-u.length).fill(0)
u=n.concat([h,u])}return(0,c.sha512)(u)},t.prototype.child=function(e){e=n.concat([this.toPublicKey().toBuffer(),e]),e=(0,c.sha256)(e)
var r=f.default.fromBuffer(e)
if(r.compareTo(v)>=0)throw new Error("Child offset went out of bounds, try again")
var i=this.d.add(r)
if(0===i.signum())throw new Error("Child offset derived to an invalid key, try again")
return new t(i)},t.prototype.toByteBuffer=function(){var t=new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY,ByteBuffer.LITTLE_ENDIAN)
return this.appendByteBuffer(t),t.copy(0,t.offset)},t.fromHex=function(e){return t.fromBuffer(new n(e,"hex"))},t.prototype.toHex=function(){return this.toBuffer().toString("hex")},t}()
r.default=b
var m=function(t){return null==t?t:t.Q?t:l.default.fromStringOrThrow(t)}
e.exports=r.default}).call(this,t("buffer").Buffer)},{"./PublicKey":28,"./hash":34,assert:102,bigi:6,bs58:45,buffer:105,"deep-equal":63,ecurve:68}],28:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var s=t("bigi"),a=i(s),f=t("ecurve"),u=t("bs58"),c=t("./hash"),h=t("bitsharesjs-ws"),l=t("assert"),p=i(l),d=t("deep-equal"),_=i(d),g=(0,f.getCurveByName)("secp256k1"),y=g.G,v=g.n,b=function(){function t(e){o(this,t),this.Q=e}return t.fromBinary=function(e){return t.fromBuffer(new n(e,"binary"))},t.fromBuffer=function(e){return new t("000000000000000000000000000000000000000000000000000000000000000000"===e.toString("hex")?null:f.Point.decodeFrom(g,e))},t.prototype.toBuffer=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.Q?this.Q.compressed:null
return null===this.Q?new n("000000000000000000000000000000000000000000000000000000000000000000","hex"):this.Q.getEncoded(t)},t.fromPoint=function(e){return new t(e)},t.prototype.toUncompressed=function(){var e=this.Q.getEncoded(!1),r=f.Point.decodeFrom(g,e)
return t.fromPoint(r)},t.prototype.toBlockchainAddress=function(){var t=this.toBuffer(),e=(0,c.sha512)(t)
return(0,c.ripemd160)(e)},t.prototype.toString=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h.ChainConfig.address_prefix
return this.toPublicKeyString(t)},t.prototype.toPublicKeyString=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h.ChainConfig.address_prefix,e=this.toBuffer(),r=(0,c.ripemd160)(e),i=n.concat([e,r.slice(0,4)])
return t+(0,u.encode)(i)},t.fromPublicKeyString=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:h.ChainConfig.address_prefix
try{return t.fromStringOrThrow(e,r)}catch(t){return null}},t.fromStringOrThrow=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:h.ChainConfig.address_prefix,i=e.slice(0,r.length)
p.default.equal(r,i,"Expecting key to begin with "+r+", instead got "+i),e=e.slice(r.length),e=new n((0,u.decode)(e),"binary")
var o=e.slice(-4)
e=e.slice(0,-4)
var s=(0,c.ripemd160)(e)
if(s=s.slice(0,4),!(0,_.default)(o,s))throw new Error("Checksum did not match")
return t.fromBuffer(e)},t.prototype.toAddressString=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h.ChainConfig.address_prefix,e=this.toBuffer(),r=(0,c.sha512)(e),i=(0,c.ripemd160)(r),o=(0,c.ripemd160)(i)
return i=n.concat([i,o.slice(0,4)]),t+(0,u.encode)(i)},t.prototype.toPtsAddy=function(){var t=this.toBuffer(),e=(0,c.sha256)(t),r=(0,c.ripemd160)(e)
r=n.concat([new n([56]),r])
var i=(0,c.sha256)(r)
return i=(0,c.sha256)(i),r=n.concat([r,i.slice(0,4)]),(0,u.encode)(r)},t.prototype.child=function(e){(0,p.default)(n.isBuffer(e),"Buffer required: offset"),p.default.equal(e.length,32,"offset length"),e=n.concat([this.toBuffer(),e]),e=(0,c.sha256)(e)
var r=a.default.fromBuffer(e)
if(r.compareTo(v)>=0)throw new Error("Child offset went out of bounds, try again")
var i=y.multiply(r),o=this.Q.add(i)
if(g.isInfinity(o))throw new Error("Child offset derived to an invalid key, try again")
return t.fromPoint(o)},t.prototype.toByteBuffer=function(){var t=new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY,ByteBuffer.LITTLE_ENDIAN)
return this.appendByteBuffer(t),t.copy(0,t.offset)},t.fromHex=function(e){return t.fromBuffer(new n(e,"hex"))},t.prototype.toHex=function(){return this.toBuffer().toString("hex")},t.fromPublicKeyStringHex=function(e){return t.fromPublicKeyString(new n(e,"hex"))},t}()
r.default=b,e.exports=r.default}).call(this,t("buffer").Buffer)},{"./hash":34,assert:102,bigi:6,"bitsharesjs-ws":8,bs58:45,buffer:105,"deep-equal":63,ecurve:68}],29:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var s=t("assert"),a=i(s),f=t("bitsharesjs-ws"),u=t("./hash"),c=t("bs58"),h=t("deep-equal"),l=i(h),p=function(){function t(e){o(this,t),this.addy=e}return t.fromBuffer=function(e){var r=(0,u.sha512)(e)
return new t((0,u.ripemd160)(r))},t.fromString=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:f.ChainConfig.address_prefix,i=e.slice(0,r.length)
a.default.equal(r,i,"Expecting key to begin with "+r+", instead got "+i)
var o=e.slice(r.length)
o=new n((0,c.decode)(o),"binary")
var s=o.slice(-4)
o=o.slice(0,-4)
var h=(0,u.ripemd160)(o)
if(h=h.slice(0,4),!(0,l.default)(s,h))throw new Error("Checksum did not match")
return new t(o)},t.fromPublic=function(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:56,o=(0,u.sha256)(e.toBuffer(r)),s=(0,u.ripemd160)(o),a=new n(1)
a.writeUInt8(255&i,0)
var f=n.concat([a,s]),c=(0,u.sha256)(f)
c=(0,u.sha256)(c)
var h=n.concat([f,c.slice(0,4)])
return new t((0,u.ripemd160)(h))},t.prototype.toBuffer=function(){return this.addy},t.prototype.toString=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f.ChainConfig.address_prefix,e=(0,u.ripemd160)(this.addy),r=n.concat([this.addy,e.slice(0,4)])
return t+(0,c.encode)(r)},t}()
r.default=p,e.exports=r.default}).call(this,t("buffer").Buffer)},{"./hash":34,assert:102,"bitsharesjs-ws":8,bs58:45,buffer:105,"deep-equal":63}],30:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var s=t("crypto-js/aes"),a=i(s),f=t("crypto-js/enc-hex"),u=i(f),c=t("crypto-js/enc-base64"),h=i(c),l=t("assert"),p=i(l),d=(t("bytebuffer"),t("./hash")),_=function(){function t(e,r){o(this,t),this.iv=e,this.key=r}return t.prototype.clear=function(){return this.iv=this.key=void 0},t.fromSeed=function(e){if(void 0===e)throw new Error("seed is required")
var r=(0,d.sha512)(e)
return r=r.toString("hex"),t.fromSha512(r)},t.fromSha512=function(e){return p.default.equal(e.length,128,"A Sha512 in HEX should be 128 characters long, instead got "+e.length),new t(u.default.parse(e.substring(64,96)),u.default.parse(e.substring(0,64)))},t.fromBuffer=function(e){return(0,p.default)(n.isBuffer(e),"Expecting Buffer"),p.default.equal(e.length,64,"A Sha512 Buffer should be 64 characters long, instead got "+e.length),t.fromSha512(e.toString("hex"))},t.decrypt_with_checksum=function(e,r,i,o){var s=arguments.length>4&&void 0!==arguments[4]&&arguments[4]
null==i&&(i=""),n.isBuffer(o)||(o=new n(o,"hex"))
var a=e.get_shared_secret(r,s),f=t.fromSeed(n.concat([new n(""+i),new n(a.toString("hex"))])),u=f.decrypt(o)
if(!(u.length>=4))throw new Error("Invalid key, could not decrypt message(1)")
var c=u.slice(0,4),h=u.slice(4),l=(0,d.sha256)(h)
if(l=l.slice(0,4),l=l.toString("hex"),c.toString("hex")!==l)throw new Error("Invalid key, could not decrypt message(2)")
return h},t.encrypt_with_checksum=function(e,r,i,o){null==i&&(i=""),n.isBuffer(o)||(o=new n(o,"binary"))
var s=e.get_shared_secret(r),a=t.fromSeed(n.concat([new n(""+i),new n(s.toString("hex"))])),f=(0,d.sha256)(o).slice(0,4),u=n.concat([f,o])
return a.encrypt(u)},t.prototype._decrypt_word_array=function(t){return a.default.decrypt({ciphertext:t,salt:null},this.key,{iv:this.iv})},t.prototype._encrypt_word_array=function(t){var e=a.default.encrypt(t,this.key,{iv:this.iv})
return h.default.parse(e.toString())},t.prototype.decrypt=function(t){if("string"==typeof t&&(t=new n(t,"binary")),!n.isBuffer(t))throw new Error("buffer required");(0,p.default)(t,"Missing cipher text")
var e=this.decryptHex(t.toString("hex"))
return new n(e,"hex")},t.prototype.encrypt=function(t){if("string"==typeof t&&(t=new n(t,"binary")),!n.isBuffer(t))throw new Error("buffer required")
var e=this.encryptHex(t.toString("hex"))
return new n(e,"hex")},t.prototype.encryptToHex=function(t){if("string"==typeof t&&(t=new n(t,"binary")),!n.isBuffer(t))throw new Error("buffer required")
return this.encryptHex(t.toString("hex"))},t.prototype.decryptHex=function(t){(0,p.default)(t,"Missing cipher text")
var e=u.default.parse(t),r=this._decrypt_word_array(e)
return u.default.stringify(r)},t.prototype.decryptHexToBuffer=function(t){(0,p.default)(t,"Missing cipher text")
var e=u.default.parse(t),r=this._decrypt_word_array(e),i=u.default.stringify(r)
return new n(i,"hex")},t.prototype.decryptHexToText=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"binary"
return this.decryptHexToBuffer(t).toString(e)},t.prototype.encryptHex=function(t){var e=u.default.parse(t),r=this._encrypt_word_array(e)
return u.default.stringify(r)},t}()
r.default=_,e.exports=r.default}).call(this,t("buffer").Buffer)},{"./hash":34,assert:102,buffer:105,bytebuffer:46,"crypto-js/aes":53,"crypto-js/enc-base64":56,"crypto-js/enc-hex":57}],31:[function(t,e,r){(function(e){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}function i(t,r,n,i,o){(0,d.default)("Buffer",r),(0,d.default)(g.default,n),o&&(r=(0,l.sha256)(e.concat([r,new e(o)]))),h.default.equal(r.length,32,"Hash must be 256 bit")
var s=n.toBuffer(32),a=new e(32),f=new e(32)
f.fill(1),a.fill(0),a=(0,l.HmacSHA256)(e.concat([f,new e([0]),s,r]),a),f=(0,l.HmacSHA256)(f,a),a=(0,l.HmacSHA256)(e.concat([f,new e([1]),s,r]),a),f=(0,l.HmacSHA256)(f,a),f=(0,l.HmacSHA256)(f,a)
for(var u=g.default.fromBuffer(f);u.signum()<=0||u.compareTo(t.n)>=0||!i(u);)a=(0,l.HmacSHA256)(e.concat([f,new e([0])]),a),f=(0,l.HmacSHA256)(f,a),f=(0,l.HmacSHA256)(f,a),u=g.default.fromBuffer(f)
return u}function o(t,e,r,n){var o,s,a=g.default.fromBuffer(e),f=t.n,u=t.G,c=(i(t,e,r,function(e){var n=u.multiply(e)
return!t.isInfinity(n)&&(o=n.affineX.mod(f),0!==o.signum()&&(s=e.modInverse(f).multiply(a.add(r.multiply(o))).mod(f),0!==s.signum()))},n),f.shiftRight(1))
return s.compareTo(c)>0&&(s=f.subtract(s)),new v.default(o,s)}function s(t,e,r,n){var i=t.n,o=t.G,s=r.r,a=r.s
if(s.signum()<=0||s.compareTo(i)>=0)return!1
if(a.signum()<=0||a.compareTo(i)>=0)return!1
var f=a.modInverse(i),u=e.multiply(f).mod(i),c=s.multiply(f).mod(i),h=o.multiplyTwo(u,n,c)
return!t.isInfinity(h)&&h.affineX.mod(i).equals(s)}function a(t,e,r,n){return s(t,g.default.fromBuffer(e),r,n)}function f(t,e,r,n){h.default.strictEqual(3&n,n,"Recovery param is more than two bits")
var i=t.n,o=t.G,s=r.r,a=r.s;(0,h.default)(s.signum()>0&&s.compareTo(i)<0,"Invalid r value"),(0,h.default)(a.signum()>0&&a.compareTo(i)<0,"Invalid s value")
var f=1&n,u=n>>1,c=u?s.add(i):s,l=t.pointFromX(f,c),p=l.multiply(i);(0,h.default)(t.isInfinity(p),"nR is not a valid curve point")
var d=e.negate().mod(i),_=s.modInverse(i),g=l.multiplyTwo(a,o,d).multiply(_)
return t.validate(g),g}function u(t,e,r,n){for(var i=0;i<4;i++){if(f(t,e,r,i).equals(n))return i}throw new Error("Unable to find valid recovery factor")}r.__esModule=!0,r.verifyRaw=r.verify=r.sign=r.recoverPubKey=r.deterministicGenerateK=r.calcPubKeyRecoveryParam=void 0
var c=t("assert"),h=n(c),l=t("./hash"),p=t("./enforce_types"),d=n(p),_=t("bigi"),g=n(_),y=t("./ecsignature"),v=n(y)
r.calcPubKeyRecoveryParam=u,r.deterministicGenerateK=i,r.recoverPubKey=f,r.sign=o,r.verify=a,r.verifyRaw=s}).call(this,t("buffer").Buffer)},{"./ecsignature":32,"./enforce_types":33,"./hash":34,assert:102,bigi:6,buffer:105}],32:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){(0,u.default)(h.default,t),(0,u.default)(h.default,e),this.r=t,this.s=e}r.__esModule=!0
var s=t("assert"),a=i(s),f=t("./enforce_types"),u=i(f),c=t("bigi"),h=i(c)
o.parseCompact=function(t){a.default.equal(t.length,65,"Invalid signature length")
var e=t.readUInt8(0)-27
a.default.equal(e,7&e,"Invalid signature parameter")
var r=!!(4&e)
return e&=3,{compressed:r,i:e,signature:new o(h.default.fromBuffer(t.slice(1,33)),h.default.fromBuffer(t.slice(33)))}},o.fromDER=function(t){a.default.equal(t.readUInt8(0),48,"Not a DER sequence"),a.default.equal(t.readUInt8(1),t.length-2,"Invalid sequence length"),a.default.equal(t.readUInt8(2),2,"Expected a DER integer")
var e=t.readUInt8(3);(0,a.default)(e>0,"R length is zero")
var r=4+e
a.default.equal(t.readUInt8(r),2,"Expected a DER integer (2)")
var n=t.readUInt8(r+1);(0,a.default)(n>0,"S length is zero")
var i=t.slice(4,r),s=t.slice(r+2)
r+=2+n,e>1&&0===i.readUInt8(0)&&(0,a.default)(128&i.readUInt8(1),"R value excessively padded"),n>1&&0===s.readUInt8(0)&&(0,a.default)(128&s.readUInt8(1),"S value excessively padded"),a.default.equal(r,t.length,"Invalid DER encoding")
var f=h.default.fromDERInteger(i),u=h.default.fromDERInteger(s)
return(0,a.default)(f.signum()>=0,"R value is negative"),(0,a.default)(u.signum()>=0,"S value is negative"),new o(f,u)},o.parseScriptSignature=function(t){var e=t.readUInt8(t.length-1),r=-129&e
return(0,a.default)(r>0&&r<4,"Invalid hashType"),{signature:o.fromDER(t.slice(0,-1)),hashType:e}},o.prototype.toCompact=function(t,e){e&&(t+=4),t+=27
var r=new n(65)
return r.writeUInt8(t,0),this.r.toBuffer(32).copy(r,1),this.s.toBuffer(32).copy(r,33),r},o.prototype.toDER=function(){var t=this.r.toDERInteger(),e=this.s.toDERInteger(),r=[]
return r.push(2,t.length),r=r.concat(t),r.push(2,e.length),r=r.concat(e),r.unshift(48,r.length),new n(r)},o.prototype.toScriptSignature=function(t){var e=new n(1)
return e.writeUInt8(t,0),n.concat([this.toDER(),e])},r.default=o,e.exports=r.default}).call(this,t("buffer").Buffer)},{"./enforce_types":33,assert:102,bigi:6,buffer:105}],33:[function(t,e,r){(function(t){"use strict"
function n(e,r){switch(e){case"Array":if(Array.isArray(r))return
break
case"Boolean":if("boolean"==typeof r)return
break
case"Buffer":if(t.isBuffer(r))return
break
case"Number":if("number"==typeof r)return
break
case"String":if("string"==typeof r)return
break
default:if(i(r.constructor)===i(e))return}throw new TypeError("Expected "+(i(e)||e)+", got "+r)}function i(t){var e=t.toString().match(/function (.*?)\(/)
return e?e[1]:null}r.__esModule=!0,r.default=n,e.exports=r.default}).call(this,{isBuffer:t("../../../../../../../../Soft/node/lib/node_modules/browserify/node_modules/is-buffer/index.js")})},{"../../../../../../../../Soft/node/lib/node_modules/browserify/node_modules/is-buffer/index.js":110}],34:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){return(0,c.default)("sha1").update(t).digest(e)}function o(t,e){return(0,c.default)("sha256").update(t).digest(e)}function s(t,e){return(0,c.default)("sha512").update(t).digest(e)}function a(t,e){return(0,l.default)("sha256",e).update(t).digest()}function f(t){return(0,c.default)("rmd160").update(t).digest()}r.__esModule=!0,r.ripemd160=r.HmacSHA256=r.sha512=r.sha256=r.sha1=void 0
var u=t("create-hash"),c=n(u),h=t("create-hmac"),l=n(h)
r.sha1=i,r.sha256=o,r.sha512=s,r.HmacSHA256=a,r.ripemd160=f},{"create-hash":48,"create-hmac":51}],35:[function(t,e,r){(function(n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var s=t("./ecdsa"),a=t("./hash"),f=t("ecurve"),u=t("assert"),c=i(u),h=t("bigi"),l=i(h),p=t("./PublicKey"),d=i(p),_=(0,f.getCurveByName)("secp256k1"),g=function(){function t(e,r,n){o(this,t),this.r=e,this.s=r,this.i=n,c.default.equal(null!=this.r,!0,"Missing parameter"),c.default.equal(null!=this.s,!0,"Missing parameter"),c.default.equal(null!=this.i,!0,"Missing parameter")}return t.fromBuffer=function(e){var r,n,i
return c.default.equal(e.length,65,"Invalid signature length"),r=e.readUInt8(0),c.default.equal(r-27,r-27&7,"Invalid signature parameter"),n=l.default.fromBuffer(e.slice(1,33)),i=l.default.fromBuffer(e.slice(33)),new t(n,i,r)},t.prototype.toBuffer=function(){var t
return t=new n(65),t.writeUInt8(this.i,0),this.r.toBuffer(32).copy(t,1),this.s.toBuffer(32).copy(t,33),t},t.prototype.recoverPublicKeyFromBuffer=function(t){return this.recoverPublicKey((0,a.sha256)(t))},t.prototype.recoverPublicKey=function(t){var e=void 0,r=void 0,n=void 0
return r=l.default.fromBuffer(t),n=this.i,n-=27,n&=3,e=(0,s.recoverPubKey)(_,r,this,n),d.default.fromPoint(e)},t.signBuffer=function(e,r){var n=(0,a.sha256)(e)
return t.signBufferSha256(n,r)},t.signBufferSha256=function(e,r){if(32!==e.length||!n.isBuffer(e))throw new Error("buf_sha256: 32 byte buffer requred")
var i,o,a,f,u,c,h
for(f=null,h=0,o=l.default.fromBuffer(e);;){if(a=(0,s.sign)(_,e,r.d,h++),i=a.toDER(),u=i[3],c=i[5+u],32===u&&32===c){f=(0,s.calcPubKeyRecoveryParam)(_,o,a,r.toPublicKey().Q),f+=4,f+=27
break}h%10==0&&console.log("WARN: "+h+" attempts to find canonical signature")}return new t(a.r,a.s,f)},t.sign=function(e,r){return t.signBuffer(new n(e),r)},t.prototype.verifyBuffer=function(t,e){var r=(0,a.sha256)(t)
return this.verifyHash(r,e)},t.prototype.verifyHash=function(t,e){return c.default.equal(t.length,32,"A SHA 256 should be 32 bytes long, instead got "+t.length),(0,s.verify)(_,t,{r:this.r,s:this.s},e.Q)},t.prototype.toByteBuffer=function(){var t
return t=new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY,ByteBuffer.LITTLE_ENDIAN),this.appendByteBuffer(t),t.copy(0,t.offset)},t.fromHex=function(e){return t.fromBuffer(new n(e,"hex"))},t.prototype.toHex=function(){return this.toBuffer().toString("hex")},t.signHex=function(e,r){var i
return i=new n(e,"hex"),t.signBuffer(i,r)},t.prototype.verifyHex=function(t,e){var r
return r=new n(t,"hex"),this.verifyBuffer(r,e)},t}()
r.default=g,e.exports=r.default}).call(this,t("buffer").Buffer)},{"./PublicKey":28,"./ecdsa":31,"./hash":34,assert:102,bigi:6,buffer:105,ecurve:68}],36:[function(t,e,r){"use strict"
function n(t){if(t&&t.__esModule)return t
var e={}
if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])
return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.Login=r.FetchChain=r.ChainValidation=r.TransactionHelper=r.NumberUtils=r.ObjectId=r.EmitterInstance=r.ChainTypes=r.FetchChainObjects=r.TransactionBuilder=r.ChainStore=r.key=r.hash=r.brainKey=r.Signature=r.PublicKey=r.PrivateKey=r.Aes=r.Address=r.SerializerValidation=r.template=r.ops=r.types=r.fp=r.Serializer=void 0
var o=t("./serializer/src/serializer"),s=i(o),a=t("./serializer/src/FastParser"),f=i(a),u=t("./serializer/src/types"),c=i(u),h=t("./serializer/src/operations"),l=n(h),p=t("./serializer/src/template"),d=i(p),_=t("./serializer/src/SerializerValidation"),g=i(_),y=t("./ecc/src/address"),v=i(y),b=t("./ecc/src/aes"),m=i(b),w=t("./ecc/src/PrivateKey"),E=i(w),S=t("./ecc/src/PublicKey"),B=i(S),x=t("./ecc/src/signature"),I=i(x),k=t("./ecc/src/BrainKey"),T=i(k),A=t("./ecc/src/hash"),j=n(A),O=t("./ecc/src/KeyUtils"),M=i(O),z=t("./chain/src/ChainStore"),L=i(z),C=t("./chain/src/TransactionBuilder"),q=i(C),D=t("./chain/src/ChainTypes"),U=i(D),R=t("./chain/src/ObjectId"),N=i(R),P=t("./chain/src/NumberUtils"),F=i(P),K=t("./chain/src/TransactionHelper"),H=i(K),V=t("./chain/src/ChainValidation"),W=i(V),J=t("./chain/src/EmitterInstance"),Z=i(J),G=t("./chain/src/AccountLogin"),Y=i(G)
r.Serializer=s.default,r.fp=f.default,r.types=c.default,r.ops=l,r.template=d.default,r.SerializerValidation=g.default,r.Address=v.default,r.Aes=m.default,r.PrivateKey=E.default,r.PublicKey=B.default,r.Signature=I.default,r.brainKey=T.default,r.hash=j,r.key=M.default
var X=L.default.FetchChainObjects,$=L.default.FetchChain
r.ChainStore=L.default,r.TransactionBuilder=q.default,r.FetchChainObjects=X,r.ChainTypes=U.default,r.EmitterInstance=Z.default,r.ObjectId=N.default,r.NumberUtils=F.default,r.TransactionHelper=H.default,r.ChainValidation=W.default,r.FetchChain=$,r.Login=Y.default},{"./chain/src/AccountLogin":14,"./chain/src/ChainStore":15,"./chain/src/ChainTypes":16,"./chain/src/ChainValidation":17,"./chain/src/EmitterInstance":18,"./chain/src/NumberUtils":19,"./chain/src/ObjectId":20,"./chain/src/TransactionBuilder":21,"./chain/src/TransactionHelper":22,"./ecc/src/BrainKey":25,"./ecc/src/KeyUtils":26,"./ecc/src/PrivateKey":27,"./ecc/src/PublicKey":28,"./ecc/src/address":29,"./ecc/src/aes":30,"./ecc/src/hash":34,"./ecc/src/signature":35,"./serializer/src/FastParser":38,"./serializer/src/SerializerValidation":39,"./serializer/src/operations":41,"./serializer/src/serializer":42,"./serializer/src/template":43,"./serializer/src/types":44}],37:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.SerializerValidation=r.template=r.ops=r.types=r.fp=r.Serializer=void 0
var i=t("./src/serializer"),o=n(i),s=t("./src/FastParser"),a=n(s),f=t("./src/types"),u=n(f),c=t("./src/operations"),h=function(t){if(t&&t.__esModule)return t
var e={}
if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])
return e.default=t,e}(c),l=t("./src/template"),p=n(l),d=t("./src/SerializerValidation"),_=n(d)
r.Serializer=o.default,r.fp=a.default,r.types=u.default,r.ops=h,r.template=p.default,r.SerializerValidation=_.default},{"./src/FastParser":38,"./src/SerializerValidation":39,"./src/operations":41,"./src/serializer":42,"./src/template":43,"./src/types":44}],38:[function(t,e,r){(function(n){"use strict"
function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var o=t("../../ecc/src/PublicKey"),s=function(t){return t&&t.__esModule?t:{default:t}}(o),a=function(){function t(){i(this,t)}return t.fixed_data=function(t,e,r){if(t){if(!r){var i=t.copy(t.offset,t.offset+e)
return t.skip(e),new n(i.toBinary(),"binary")}var o=r.slice(0,e).toString("binary")
for(t.append(o,"binary");e-- >o.length;)t.writeUint8(0)}},t.public_key=function(e,r){if(e){if(r){var n=r.toBuffer()
return void e.append(n.toString("binary"),"binary")}return n=t.fixed_data(e,33),s.default.fromBuffer(n)}},t.ripemd160=function(e,r){if(e)return r?void t.fixed_data(e,20,r):t.fixed_data(e,20)},t.time_point_sec=function(t,e){return e?(e=Math.ceil(e/1e3),void t.writeInt32(e)):(e=t.readInt32(),new Date(1e3*e))},t}()
r.default=a,e.exports=r.default}).call(this,t("buffer").Buffer)},{"../../ecc/src/PublicKey":28,buffer:105}],39:[function(t,e,r){"use strict"
r.__esModule=!0
var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=t("bytebuffer"),o=t("../../chain/src/ChainTypes"),s=function(t){return t&&t.__esModule?t:{default:t}}(o),a={is_empty:function(t){return null===t||void 0===t},required:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(this.is_empty(t))throw new Error("value required "+e+" "+t)
return t},require_long:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(!i.Long.isLong(t))throw new Error("Long value required "+e+" "+t)
return t},string:function(t){if(this.is_empty(t))return t
if("string"!=typeof t)throw new Error("string required: "+t)
return t},number:function(t){if(this.is_empty(t))return t
if("number"!=typeof t)throw new Error("number required: "+t)
return t},whole_number:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(this.is_empty(t))return t
if(/\./.test(t))throw new Error("whole number required "+e+" "+t)
return t},unsigned:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(this.is_empty(t))return t
if(/-/.test(t))throw new Error("unsigned required "+e+" "+t)
return t},is_digits:function(t){return"numeric"==typeof t||/^[0-9]+$/.test(t)},to_number:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
return this.is_empty(t)?t:(this.no_overflow53(t,e),function(){return"number"==typeof t?t:parseInt(t)}())},to_long:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
return this.is_empty(t)?t:i.Long.isLong(t)?t:(this.no_overflow64(t,e),"number"==typeof t&&(t=""+t),i.Long.fromString(t))},to_string:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(this.is_empty(t))return t
if("string"==typeof t)return t
if("number"==typeof t)return this.no_overflow53(t,e),""+t
if(i.Long.isLong(t))return t.toString()
throw"unsupported type "+e+": ("+(void 0===t?"undefined":n(t))+") "+t},require_test:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:""
if(this.is_empty(e))return e
if(!t.test(e))throw new Error("unmatched "+t+" "+r+" "+e)
return e},require_match:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:""
if(this.is_empty(e))return e
var n=e.match(t)
if(null===n)throw new Error("unmatched "+t+" "+r+" "+e)
return n},require_object_id:function(t,e){return require_match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/,t,e)},require_range:function(t,e,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:""
if(this.is_empty(r))return r
this.to_number(r)
if(r<t||r>e)throw new Error("out of range "+r+" "+n+" "+r)
return r},require_object_type:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=arguments[1],r=arguments[2],n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:""
if(this.is_empty(r))return r
var i=s.default.object_type[e]
if(!i)throw new Error("Unknown object type "+e+" "+n+" "+r)
if(!new RegExp(t+"."+i+".[0-9]+$").test(r))throw new Error("Expecting "+e+" in format "+t+"."+i+".[0-9]+ instead of "+r+" "+n+" "+r)
return r},get_instance:function(t,e,r,n){return this.is_empty(r)?r:(this.require_object_type(t,e,r,n),this.to_number(r.split(".")[2]))},require_relative_type:function(t,e,r){return this.require_object_type(0,t,e,r),e},get_relative_instance:function(t,e,r){return this.is_empty(e)?e:(this.require_object_type(0,t,e,r),this.to_number(e.split(".")[2]))},require_protocol_type:function(t,e,r){return this.require_object_type(1,t,e,r),e},get_protocol_instance:function(t,e,r){return this.is_empty(e)?e:(this.require_object_type(1,t,e,r),this.to_number(e.split(".")[2]))},get_protocol_type:function(t,e){if(this.is_empty(t))return t
this.require_object_id(t,e)
var r=t.split(".")
return this.to_number(r[1])},get_protocol_type_name:function(t,e){if(this.is_empty(t))return t
var r=this.get_protocol_type(t,e)
return Object.keys(s.default.object_type)[r]},require_implementation_type:function(t,e,r){return this.require_object_type(2,t,e,r),e},get_implementation_instance:function(t,e,r){return this.is_empty(e)?e:(this.require_object_type(2,t,e,r),this.to_number(e.split(".")[2]))},no_overflow53:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if("number"!=typeof t){if("string"!=typeof t){if(i.Long.isLong(t))return void this.no_overflow53(t.toInt(),e)
throw"unsupported type "+e+": ("+(void 0===t?"undefined":n(t))+") "+t}parseInt(t)
if(t>9007199254740991||t<-9007199254740991)throw new Error("overflow "+e+" "+t)}else if(t>9007199254740991||t<-9007199254740991)throw new Error("overflow "+e+" "+t)},no_overflow64:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
if(!i.Long.isLong(t)){if(void 0!==t.t&&void 0!==t.s)return void this.no_overflow64(t.toString(),e)
if("string"!=typeof t){if("number"!=typeof t)throw"unsupported type "+e+": ("+(void 0===t?"undefined":n(t))+") "+t
if(t>9007199254740991||t<-9007199254740991)throw new Error("overflow "+e+" "+t)}else{for(t=t.replace(/^0+/,"");/0$/.test(t);)t=t.substring(0,t.length-1);/\.$/.test(t)&&(t=t.substring(0,t.length-1)),""===t&&(t="0")
if(i.Long.fromString(t).toString()!==t.trim())throw new Error("overflow "+e+" "+t)}}}}
r.default=a,e.exports=r.default},{"../../chain/src/ChainTypes":16,bytebuffer:46}],40:[function(t,e,r){"use strict"
function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var i=function(){function t(e,r){n(this,t),this.message=e,(void 0!==r&&null!==r?r.message:void 0)&&(this.message="cause\t"+r.message+"\t"+this.message)
var i="";(void 0!==r&&null!==r?r.stack:void 0)&&(i="caused by\n\t"+r.stack+"\t"+i),this.stack=this.message+"\n"+i}return t.throw=function(t,e){var r=t
throw(void 0!==e&&null!==e?e.message:void 0)&&(r+="\t cause: "+e.message+" "),(void 0!==e&&null!==e?e.stack:void 0)&&(r+="\n stack: "+e.stack+" "),new Error(r)},t}()
r.default=i,e.exports=r.default},{}],41:[function(t,e,r){"use strict"
function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.stealth_memo_data=r.signed_transaction=r.transaction=r.asset_claim_fees=r.asset_settle_cancel=r.transfer_from_blind=r.blind_transfer=r.blind_input=r.transfer_to_blind=r.blind_output=r.stealth_confirmation=r.override_transfer=r.balance_claim=r.assert=r.block_id_predicate=r.asset_symbol_eq_lit_predicate=r.account_name_eq_lit_predicate=r.custom=r.worker_create=r.burn_worker_initializer=r.vesting_balance_worker_initializer=r.refund_worker_initializer=r.vesting_balance_withdraw=r.vesting_balance_create=r.cdd_vesting_policy_initializer=r.linear_vesting_policy_initializer=r.committee_member_update_global_parameters=r.chain_parameters=r.committee_member_update=r.committee_member_create=r.withdraw_permission_delete=r.withdraw_permission_claim=r.withdraw_permission_update=r.withdraw_permission_create=r.proposal_delete=r.proposal_update=r.proposal_create=r.op_wrapper=r.witness_update=r.witness_create=r.asset_publish_feed=r.price_feed=r.asset_global_settle=r.asset_settle=r.asset_fund_fee_pool=r.asset_reserve=r.asset_issue=r.asset_update_feed_producers=r.asset_update_bitasset=r.asset_update=r.asset_create=r.bitasset_options=r.asset_options=r.price=r.account_transfer=r.account_upgrade=r.account_whitelist=r.account_update=r.account_create=r.account_options=r.authority=r.fill_order=r.call_order_update=r.limit_order_cancel=r.limit_order_create=r.transfer=r.memo_data=r.signed_block_header=r.block_header=r.signed_block=r.processed_transaction=r.asset=r.void_result=r.fee_schedule=r.asset_claim_fees_operation_fee_parameters=r.asset_settle_cancel_operation_fee_parameters=r.transfer_from_blind_operation_fee_parameters=r.blind_transfer_operation_fee_parameters=r.transfer_to_blind_operation_fee_parameters=r.override_transfer_operation_fee_parameters=r.balance_claim_operation_fee_parameters=r.assert_operation_fee_parameters=r.custom_operation_fee_parameters=r.worker_create_operation_fee_parameters=r.vesting_balance_withdraw_operation_fee_parameters=r.vesting_balance_create_operation_fee_parameters=r.committee_member_update_global_parameters_operation_fee_parameters=r.committee_member_update_operation_fee_parameters=r.committee_member_create_operation_fee_parameters=r.withdraw_permission_delete_operation_fee_parameters=r.withdraw_permission_claim_operation_fee_parameters=r.withdraw_permission_update_operation_fee_parameters=r.withdraw_permission_create_operation_fee_parameters=r.proposal_delete_operation_fee_parameters=r.proposal_update_operation_fee_parameters=r.proposal_create_operation_fee_parameters=r.witness_update_operation_fee_parameters=r.witness_create_operation_fee_parameters=r.asset_publish_feed_operation_fee_parameters=r.asset_global_settle_operation_fee_parameters=r.asset_settle_operation_fee_parameters=r.asset_fund_fee_pool_operation_fee_parameters=r.asset_reserve_operation_fee_parameters=r.asset_issue_operation_fee_parameters=r.asset_update_feed_producers_operation_fee_parameters=r.asset_update_bitasset_operation_fee_parameters=r.asset_update_operation_fee_parameters=r.asset_create_operation_fee_parameters=r.account_transfer_operation_fee_parameters=r.account_upgrade_operation_fee_parameters=r.account_whitelist_operation_fee_parameters=r.account_update_operation_fee_parameters=r.account_create_operation_fee_parameters=r.fill_order_operation_fee_parameters=r.call_order_update_operation_fee_parameters=r.limit_order_cancel_operation_fee_parameters=r.limit_order_create_operation_fee_parameters=r.transfer_operation_fee_parameters=r.operation=void 0
var i=t("./types"),o=n(i),s=t("./serializer"),a=n(s),f=o.default.uint8,u=o.default.uint16,c=o.default.uint32,h=o.default.int64,l=o.default.uint64,p=o.default.string,d=o.default.bytes,_=o.default.bool,g=o.default.array,y=(o.default.fixed_array,o.default.protocol_id_type),v=o.default.object_id_type,b=o.default.vote_id,m=o.default.future_extensions,w=o.default.static_variant,E=o.default.map,S=o.default.set,B=o.default.public_key,x=o.default.address,I=o.default.time_point_sec,k=o.default.optional
m=o.default.void
var T=w()
r.operation=T
var A=function(t,e){return new a.default(t,e)},j=r.transfer_operation_fee_parameters=new A("transfer_operation_fee_parameters",{fee:l,price_per_kbyte:c}),O=r.limit_order_create_operation_fee_parameters=new A("limit_order_create_operation_fee_parameters",{fee:l}),M=r.limit_order_cancel_operation_fee_parameters=new A("limit_order_cancel_operation_fee_parameters",{fee:l}),z=r.call_order_update_operation_fee_parameters=new A("call_order_update_operation_fee_parameters",{fee:l}),L=r.fill_order_operation_fee_parameters=new A("fill_order_operation_fee_parameters"),C=r.account_create_operation_fee_parameters=new A("account_create_operation_fee_parameters",{basic_fee:l,premium_fee:l,price_per_kbyte:c}),q=r.account_update_operation_fee_parameters=new A("account_update_operation_fee_parameters",{fee:h,price_per_kbyte:c}),D=r.account_whitelist_operation_fee_parameters=new A("account_whitelist_operation_fee_parameters",{fee:h}),U=r.account_upgrade_operation_fee_parameters=new A("account_upgrade_operation_fee_parameters",{membership_annual_fee:l,membership_lifetime_fee:l}),R=r.account_transfer_operation_fee_parameters=new A("account_transfer_operation_fee_parameters",{fee:l}),N=r.asset_create_operation_fee_parameters=new A("asset_create_operation_fee_parameters",{symbol3:l,symbol4:l,long_symbol:l,price_per_kbyte:c}),P=r.asset_update_operation_fee_parameters=new A("asset_update_operation_fee_parameters",{fee:l,price_per_kbyte:c}),F=r.asset_update_bitasset_operation_fee_parameters=new A("asset_update_bitasset_operation_fee_parameters",{fee:l}),K=r.asset_update_feed_producers_operation_fee_parameters=new A("asset_update_feed_producers_operation_fee_parameters",{fee:l}),H=r.asset_issue_operation_fee_parameters=new A("asset_issue_operation_fee_parameters",{fee:l,price_per_kbyte:c}),V=r.asset_reserve_operation_fee_parameters=new A("asset_reserve_operation_fee_parameters",{fee:l}),W=r.asset_fund_fee_pool_operation_fee_parameters=new A("asset_fund_fee_pool_operation_fee_parameters",{fee:l}),J=r.asset_settle_operation_fee_parameters=new A("asset_settle_operation_fee_parameters",{fee:l}),Z=r.asset_global_settle_operation_fee_parameters=new A("asset_global_settle_operation_fee_parameters",{fee:l}),G=r.asset_publish_feed_operation_fee_parameters=new A("asset_publish_feed_operation_fee_parameters",{fee:l}),Y=r.witness_create_operation_fee_parameters=new A("witness_create_operation_fee_parameters",{fee:l}),X=r.witness_update_operation_fee_parameters=new A("witness_update_operation_fee_parameters",{fee:h}),$=r.proposal_create_operation_fee_parameters=new A("proposal_create_operation_fee_parameters",{fee:l,price_per_kbyte:c}),Q=r.proposal_update_operation_fee_parameters=new A("proposal_update_operation_fee_parameters",{fee:l,price_per_kbyte:c}),tt=r.proposal_delete_operation_fee_parameters=new A("proposal_delete_operation_fee_parameters",{fee:l}),et=r.withdraw_permission_create_operation_fee_parameters=new A("withdraw_permission_create_operation_fee_parameters",{fee:l}),rt=r.withdraw_permission_update_operation_fee_parameters=new A("withdraw_permission_update_operation_fee_parameters",{fee:l}),nt=r.withdraw_permission_claim_operation_fee_parameters=new A("withdraw_permission_claim_operation_fee_parameters",{fee:l,price_per_kbyte:c}),it=r.withdraw_permission_delete_operation_fee_parameters=new A("withdraw_permission_delete_operation_fee_parameters",{fee:l}),ot=r.committee_member_create_operation_fee_parameters=new A("committee_member_create_operation_fee_parameters",{fee:l}),st=r.committee_member_update_operation_fee_parameters=new A("committee_member_update_operation_fee_parameters",{fee:l}),at=r.committee_member_update_global_parameters_operation_fee_parameters=new A("committee_member_update_global_parameters_operation_fee_parameters",{fee:l}),ft=r.vesting_balance_create_operation_fee_parameters=new A("vesting_balance_create_operation_fee_parameters",{fee:l}),ut=r.vesting_balance_withdraw_operation_fee_parameters=new A("vesting_balance_withdraw_operation_fee_parameters",{fee:l}),ct=r.worker_create_operation_fee_parameters=new A("worker_create_operation_fee_parameters",{fee:l}),ht=r.custom_operation_fee_parameters=new A("custom_operation_fee_parameters",{fee:l,price_per_kbyte:c}),lt=r.assert_operation_fee_parameters=new A("assert_operation_fee_parameters",{fee:l}),pt=r.balance_claim_operation_fee_parameters=new A("balance_claim_operation_fee_parameters"),dt=r.override_transfer_operation_fee_parameters=new A("override_transfer_operation_fee_parameters",{fee:l,price_per_kbyte:c}),_t=r.transfer_to_blind_operation_fee_parameters=new A("transfer_to_blind_operation_fee_parameters",{fee:l,price_per_output:c}),gt=r.blind_transfer_operation_fee_parameters=new A("blind_transfer_operation_fee_parameters",{fee:l,price_per_output:c}),yt=r.transfer_from_blind_operation_fee_parameters=new A("transfer_from_blind_operation_fee_parameters",{fee:l}),vt=r.asset_settle_cancel_operation_fee_parameters=new A("asset_settle_cancel_operation_fee_parameters"),bt=r.asset_claim_fees_operation_fee_parameters=new A("asset_claim_fees_operation_fee_parameters",{fee:l}),mt=w([j,O,M,z,L,C,q,D,U,R,N,P,F,K,H,V,W,J,Z,G,Y,X,$,Q,tt,et,rt,nt,it,ot,st,at,ft,ut,ct,ht,lt,pt,dt,_t,gt,yt,vt,bt]),wt=r.fee_schedule=new A("fee_schedule",{parameters:S(mt),scale:c}),Et=r.void_result=new A("void_result"),St=r.asset=new A("asset",{amount:h,asset_id:y("asset")}),Bt=w([Et,v,St]),xt=r.processed_transaction=new A("processed_transaction",{ref_block_num:u,ref_block_prefix:c,expiration:I,operations:g(T),extensions:S(m),signatures:g(d(65)),operation_results:g(Bt)}),It=(r.signed_block=new A("signed_block",{previous:d(20),timestamp:I,witness:y("witness"),transaction_merkle_root:d(20),extensions:S(m),witness_signature:d(65),transactions:g(xt)}),r.block_header=new A("block_header",{previous:d(20),timestamp:I,witness:y("witness"),transaction_merkle_root:d(20),extensions:S(m)}),r.signed_block_header=new A("signed_block_header",{previous:d(20),timestamp:I,witness:y("witness"),transaction_merkle_root:d(20),extensions:S(m),witness_signature:d(65)}),r.memo_data=new A("memo_data",{from:B,to:B,nonce:l,message:d()})),kt=r.transfer=new A("transfer",{fee:St,from:y("account"),to:y("account"),amount:St,memo:k(It),extensions:S(m)}),Tt=r.limit_order_create=new A("limit_order_create",{fee:St,seller:y("account"),amount_to_sell:St,min_to_receive:St,expiration:I,fill_or_kill:_,extensions:S(m)}),At=r.limit_order_cancel=new A("limit_order_cancel",{fee:St,fee_paying_account:y("account"),order:y("limit_order"),extensions:S(m)}),jt=r.call_order_update=new A("call_order_update",{fee:St,funding_account:y("account"),delta_collateral:St,delta_debt:St,extensions:S(m)}),Ot=r.fill_order=new A("fill_order",{fee:St,order_id:v,account_id:y("account"),pays:St,receives:St}),Mt=r.authority=new A("authority",{weight_threshold:c,account_auths:E(y("account"),u),key_auths:E(B,u),address_auths:E(x,u)}),zt=r.account_options=new A("account_options",{memo_key:B,voting_account:y("account"),num_witness:u,num_committee:u,votes:S(b),extensions:S(m)}),Lt=r.account_create=new A("account_create",{fee:St,registrar:y("account"),referrer:y("account"),referrer_percent:u,name:p,owner:Mt,active:Mt,options:zt,extensions:S(m)}),Ct=r.account_update=new A("account_update",{fee:St,account:y("account"),owner:k(Mt),active:k(Mt),new_options:k(zt),extensions:S(m)}),qt=r.account_whitelist=new A("account_whitelist",{fee:St,authorizing_account:y("account"),account_to_list:y("account"),new_listing:f,extensions:S(m)}),Dt=r.account_upgrade=new A("account_upgrade",{fee:St,account_to_upgrade:y("account"),upgrade_to_lifetime_member:_,extensions:S(m)}),Ut=r.account_transfer=new A("account_transfer",{fee:St,account_id:y("account"),new_owner:y("account"),extensions:S(m)}),Rt=r.price=new A("price",{base:St,quote:St}),Nt=r.asset_options=new A("asset_options",{max_supply:h,market_fee_percent:u,max_market_fee:h,issuer_permissions:u,flags:u,core_exchange_rate:Rt,whitelist_authorities:S(y("account")),blacklist_authorities:S(y("account")),whitelist_markets:S(y("asset")),blacklist_markets:S(y("asset")),description:p,extensions:S(m)}),Pt=r.bitasset_options=new A("bitasset_options",{feed_lifetime_sec:c,minimum_feeds:f,force_settlement_delay_sec:c,force_settlement_offset_percent:u,maximum_force_settlement_volume:u,short_backing_asset:y("asset"),extensions:S(m)}),Ft=r.asset_create=new A("asset_create",{fee:St,issuer:y("account"),symbol:p,precision:f,common_options:Nt,bitasset_opts:k(Pt),is_prediction_market:_,extensions:S(m)}),Kt=r.asset_update=new A("asset_update",{fee:St,issuer:y("account"),asset_to_update:y("asset"),new_issuer:k(y("account")),new_options:Nt,extensions:S(m)}),Ht=r.asset_update_bitasset=new A("asset_update_bitasset",{fee:St,issuer:y("account"),asset_to_update:y("asset"),new_options:Pt,extensions:S(m)}),Vt=r.asset_update_feed_producers=new A("asset_update_feed_producers",{fee:St,issuer:y("account"),asset_to_update:y("asset"),new_feed_producers:S(y("account")),extensions:S(m)}),Wt=r.asset_issue=new A("asset_issue",{fee:St,issuer:y("account"),asset_to_issue:St,issue_to_account:y("account"),memo:k(It),extensions:S(m)}),Jt=r.asset_reserve=new A("asset_reserve",{fee:St,payer:y("account"),amount_to_reserve:St,extensions:S(m)}),Zt=r.asset_fund_fee_pool=new A("asset_fund_fee_pool",{fee:St,from_account:y("account"),asset_id:y("asset"),amount:h,extensions:S(m)}),Gt=r.asset_settle=new A("asset_settle",{fee:St,account:y("account"),amount:St,extensions:S(m)}),Yt=r.asset_global_settle=new A("asset_global_settle",{fee:St,issuer:y("account"),asset_to_settle:y("asset"),settle_price:Rt,extensions:S(m)}),Xt=r.price_feed=new A("price_feed",{settlement_price:Rt,maintenance_collateral_ratio:u,maximum_short_squeeze_ratio:u,core_exchange_rate:Rt}),$t=r.asset_publish_feed=new A("asset_publish_feed",{fee:St,publisher:y("account"),asset_id:y("asset"),feed:Xt,extensions:S(m)}),Qt=r.witness_create=new A("witness_create",{fee:St,witness_account:y("account"),url:p,block_signing_key:B}),te=r.witness_update=new A("witness_update",{fee:St,witness:y("witness"),witness_account:y("account"),new_url:k(p),new_signing_key:k(B)}),ee=r.op_wrapper=new A("op_wrapper",{op:T}),re=r.proposal_create=new A("proposal_create",{fee:St,fee_paying_account:y("account"),expiration_time:I,proposed_ops:g(ee),review_period_seconds:k(c),extensions:S(m)}),ne=r.proposal_update=new A("proposal_update",{fee:St,fee_paying_account:y("account"),proposal:y("proposal"),active_approvals_to_add:S(y("account")),active_approvals_to_remove:S(y("account")),owner_approvals_to_add:S(y("account")),owner_approvals_to_remove:S(y("account")),key_approvals_to_add:S(B),key_approvals_to_remove:S(B),extensions:S(m)}),ie=r.proposal_delete=new A("proposal_delete",{fee:St,fee_paying_account:y("account"),using_owner_authority:_,proposal:y("proposal"),extensions:S(m)}),oe=r.withdraw_permission_create=new A("withdraw_permission_create",{fee:St,withdraw_from_account:y("account"),authorized_account:y("account"),withdrawal_limit:St,withdrawal_period_sec:c,periods_until_expiration:c,period_start_time:I}),se=r.withdraw_permission_update=new A("withdraw_permission_update",{fee:St,withdraw_from_account:y("account"),authorized_account:y("account"),permission_to_update:y("withdraw_permission"),withdrawal_limit:St,withdrawal_period_sec:c,period_start_time:I,periods_until_expiration:c}),ae=r.withdraw_permission_claim=new A("withdraw_permission_claim",{fee:St,withdraw_permission:y("withdraw_permission"),withdraw_from_account:y("account"),withdraw_to_account:y("account"),amount_to_withdraw:St,memo:k(It)}),fe=r.withdraw_permission_delete=new A("withdraw_permission_delete",{fee:St,withdraw_from_account:y("account"),authorized_account:y("account"),withdrawal_permission:y("withdraw_permission")}),ue=r.committee_member_create=new A("committee_member_create",{fee:St,committee_member_account:y("account"),url:p}),ce=r.committee_member_update=new A("committee_member_update",{fee:St,committee_member:y("committee_member"),committee_member_account:y("account"),new_url:k(p)}),he=r.chain_parameters=new A("chain_parameters",{current_fees:wt,block_interval:f,maintenance_interval:c,maintenance_skip_slots:f,committee_proposal_review_period:c,maximum_transaction_size:c,maximum_block_size:c,maximum_time_until_expiration:c,maximum_proposal_lifetime:c,maximum_asset_whitelist_authorities:f,maximum_asset_feed_publishers:f,maximum_witness_count:u,maximum_committee_count:u,maximum_authority_membership:u,reserve_percent_of_fee:u,network_percent_of_fee:u,lifetime_referrer_percent_of_fee:u,cashback_vesting_period_seconds:c,cashback_vesting_threshold:h,count_non_member_votes:_,allow_non_member_whitelists:_,witness_pay_per_block:h,worker_budget_per_day:h,max_predicate_opcode:u,fee_liquidation_threshold:h,accounts_per_fee_scale:u,account_fee_scale_bitshifts:f,max_authority_depth:f,extensions:S(m)}),le=r.committee_member_update_global_parameters=new A("committee_member_update_global_parameters",{fee:St,new_parameters:he}),pe=r.linear_vesting_policy_initializer=new A("linear_vesting_policy_initializer",{begin_timestamp:I,vesting_cliff_seconds:c,vesting_duration_seconds:c}),de=r.cdd_vesting_policy_initializer=new A("cdd_vesting_policy_initializer",{start_claim:I,vesting_seconds:c}),_e=w([pe,de]),ge=r.vesting_balance_create=new A("vesting_balance_create",{fee:St,creator:y("account"),owner:y("account"),amount:St,policy:_e}),ye=r.vesting_balance_withdraw=new A("vesting_balance_withdraw",{fee:St,vesting_balance:y("vesting_balance"),owner:y("account"),amount:St}),ve=r.refund_worker_initializer=new A("refund_worker_initializer"),be=r.vesting_balance_worker_initializer=new A("vesting_balance_worker_initializer",{pay_vesting_period_days:u}),me=r.burn_worker_initializer=new A("burn_worker_initializer"),we=w([ve,be,me]),Ee=r.worker_create=new A("worker_create",{fee:St,owner:y("account"),work_begin_date:I,work_end_date:I,daily_pay:h,name:p,url:p,initializer:we}),Se=r.custom=new A("custom",{fee:St,payer:y("account"),required_auths:S(y("account")),id:u,data:d()}),Be=r.account_name_eq_lit_predicate=new A("account_name_eq_lit_predicate",{account_id:y("account"),name:p}),xe=r.asset_symbol_eq_lit_predicate=new A("asset_symbol_eq_lit_predicate",{asset_id:y("asset"),symbol:p}),Ie=r.block_id_predicate=new A("block_id_predicate",{id:d(20)}),ke=w([Be,xe,Ie]),Te=r.assert=new A("assert",{fee:St,fee_paying_account:y("account"),predicates:g(ke),required_auths:S(y("account")),extensions:S(m)}),Ae=r.balance_claim=new A("balance_claim",{fee:St,deposit_to_account:y("account"),balance_to_claim:y("balance"),balance_owner_key:B,total_claimed:St}),je=r.override_transfer=new A("override_transfer",{fee:St,issuer:y("account"),from:y("account"),to:y("account"),amount:St,memo:k(It),extensions:S(m)}),Oe=r.stealth_confirmation=new A("stealth_confirmation",{one_time_key:B,to:k(B),encrypted_memo:d()}),Me=r.blind_output=new A("blind_output",{commitment:d(33),range_proof:d(),owner:Mt,stealth_memo:k(Oe)}),ze=r.transfer_to_blind=new A("transfer_to_blind",{fee:St,amount:St,from:y("account"),blinding_factor:d(32),outputs:g(Me)}),Le=r.blind_input=new A("blind_input",{commitment:d(33),owner:Mt}),Ce=r.blind_transfer=new A("blind_transfer",{fee:St,inputs:g(Le),outputs:g(Me)}),qe=r.transfer_from_blind=new A("transfer_from_blind",{fee:St,amount:St,to:y("account"),blinding_factor:d(32),inputs:g(Le)}),De=r.asset_settle_cancel=new A("asset_settle_cancel",{fee:St,settlement:y("force_settlement"),account:y("account"),amount:St,extensions:S(m)}),Ue=r.asset_claim_fees=new A("asset_claim_fees",{fee:St,issuer:y("account"),amount_to_claim:St,extensions:S(m)})
T.st_operations=[kt,Tt,At,jt,Ot,Lt,Ct,qt,Dt,Ut,Ft,Kt,Ht,Vt,Wt,Jt,Zt,Gt,Yt,$t,Qt,te,re,ne,ie,oe,se,ae,fe,ue,ce,le,ge,ye,Ee,Se,Te,Ae,je,ze,Ce,qe,De,Ue]
r.transaction=new A("transaction",{ref_block_num:u,ref_block_prefix:c,expiration:I,operations:g(T),extensions:S(m)}),r.signed_transaction=new A("signed_transaction",{ref_block_num:u,ref_block_prefix:c,expiration:I,operations:g(T),extensions:S(m),signatures:g(d(65))}),r.stealth_memo_data=new A("stealth_memo_data",{from:k(B),amount:St,blinding_factor:d(32),commitment:d(33),check:c})},{"./serializer":42,"./types":44}],42:[function(t,e,r){(function(n,i){"use strict"
function o(t){return t&&t.__esModule?t:{default:t}}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.__esModule=!0
var a=t("bytebuffer"),f=o(a),u=t("./error_with_cause"),c=o(u),h=n.env.npm_config__graphene_serializer_hex_dump,l=function(){function t(e,r){s(this,t),this.operation_name=e,this.types=r,this.types&&(this.keys=Object.keys(this.types)),t.printDebug=!0}return t.prototype.fromByteBuffer=function(e){var r={},n=null
try{for(var n,i=this.keys,o=0;o<i.length;o++){n=i[o]
var s=this.types[n]
try{if(h)if(s.operation_name)console.error(s.operation_name)
else{var a=e.offset
s.fromByteBuffer(e)
var f=e.offset
e.offset=a
var u=e.copy(a,f)
console.error(this.operation_name+"."+n+"\t",u.toHex())}r[n]=s.fromByteBuffer(e)}catch(r){throw t.printDebug&&(console.error("Error reading "+this.operation_name+"."+n+" in data:"),e.printDebug()),r}}}catch(t){c.default.throw(this.operation_name+"."+n,t)}return r},t.prototype.appendByteBuffer=function(t,e){var r=null
try{for(var r,n=this.keys,i=0;i<n.length;i++){r=n[i]
this.types[r].appendByteBuffer(t,e[r])}}catch(t){try{c.default.throw(this.operation_name+"."+r+" = "+JSON.stringify(e[r]),t)}catch(n){c.default.throw(this.operation_name+"."+r+" = "+e[r],t)}}},t.prototype.fromObject=function(t){var e={},r=null
try{for(var r,n=this.keys,i=0;i<n.length;i++){r=n[i]
var o=this.types[r],s=t[r],a=o.fromObject(s)
e[r]=a}}catch(t){c.default.throw(this.operation_name+"."+r,t)}return e},t.prototype.toObject=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{use_default:!1,annotate:!1},r={},n=null
try{if(!this.types)return r
for(var n,i=this.keys,o=0;o<i.length;o++){n=i[o]
var s=this.types[n],a=s.toObject(void 0!==t&&null!==t?t[n]:void 0,e)
if(r[n]=a,h){var u=new f.default(f.default.DEFAULT_CAPACITY,f.default.LITTLE_ENDIAN)
s.appendByteBuffer(u,void 0!==t&&null!==t?t[n]:void 0),u=u.copy(0,u.offset),console.error(this.operation_name+"."+n,u.toHex())}}}catch(t){c.default.throw(this.operation_name+"."+n,t)}return r},t.prototype.compare=function(t,e){var r=this.keys[0],n=this.types[r],o=t[r],s=e[r]
if(n.compare)return n.compare(o,s)
if("number"==typeof o&&"number"==typeof s)return o-s
var a=void 0
i.isBuffer(o)&&i.isBuffer(s)&&(a="hex")
var f=o.toString(a),u=s.toString(a)
return f>u?1:f<u?-1:0},t.prototype.fromHex=function(t){var e=f.default.fromHex(t,f.default.LITTLE_ENDIAN)
return this.fromByteBuffer(e)},t.prototype.fromBuffer=function(t){var e=f.default.fromBinary(t.toString("binary"),f.default.LITTLE_ENDIAN)
return this.fromByteBuffer(e)},t.prototype.toHex=function(t){return this.toByteBuffer(t).toHex()},t.prototype.toByteBuffer=function(t){var e=new f.default(f.default.DEFAULT_CAPACITY,f.default.LITTLE_ENDIAN)
return this.appendByteBuffer(e,t),e.copy(0,e.offset)},t.prototype.toBuffer=function(t){return new i(this.toByteBuffer(t).toBinary(),"binary")},t}()
r.default=l,e.exports=r.default}).call(this,t("_process"),t("buffer").Buffer)},{"./error_with_cause":40,_process:113,buffer:105,bytebuffer:46}],43:[function(t,e,r){"use strict"
function n(t){var e=t.toObject(void 0,{use_default:!0,annotate:!0})
console.error(JSON.stringify(e,null,4)),e=t.toObject(void 0,{use_default:!0,annotate:!1}),console.error(JSON.stringify(e))}r.__esModule=!0,r.default=n,e.exports=r.default},{}],44:[function(t,e,r){(function(n,i){"use strict"
function o(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0
var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a=t("./SerializerValidation"),f=o(a),u=t("./FastParser"),c=o(u),h=t("../../chain/src/ChainTypes"),l=o(h),p=t("../../chain/src/ObjectId"),d=o(p),_=t("../../ecc"),g=t("bitsharesjs-ws"),y={},v=n.env.npm_config__graphene_serializer_hex_dump
y.uint8={fromByteBuffer:function(t){return t.readUint8()},appendByteBuffer:function(t,e){f.default.require_range(0,255,e,"uint8 "+e),t.writeUint8(e)},fromObject:function(t){return f.default.require_range(0,255,t,"uint8 "+t),t},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?0:(f.default.require_range(0,255,t,"uint8 "+t),parseInt(t))}},y.uint16={fromByteBuffer:function(t){return t.readUint16()},appendByteBuffer:function(t,e){f.default.require_range(0,65535,e,"uint16 "+e),t.writeUint16(e)},fromObject:function(t){return f.default.require_range(0,65535,t,"uint16 "+t),t},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?0:(f.default.require_range(0,65535,t,"uint16 "+t),parseInt(t))}},y.uint32={fromByteBuffer:function(t){return t.readUint32()},appendByteBuffer:function(t,e){f.default.require_range(0,4294967295,e,"uint32 "+e),t.writeUint32(e)},fromObject:function(t){return f.default.require_range(0,4294967295,t,"uint32 "+t),t},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?0:(f.default.require_range(0,4294967295,t,"uint32 "+t),parseInt(t))}}
var b=-1*Math.pow(2,31),m=Math.pow(2,31)-1
y.varint32={fromByteBuffer:function(t){return t.readVarint32()},appendByteBuffer:function(t,e){f.default.require_range(b,m,e,"uint32 "+e),t.writeVarint32(e)},fromObject:function(t){return f.default.require_range(b,m,t,"uint32 "+t),t},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?0:(f.default.require_range(b,m,t,"uint32 "+t),parseInt(t))}},y.int64={fromByteBuffer:function(t){return t.readInt64()},appendByteBuffer:function(t,e){f.default.required(e),t.writeInt64(f.default.to_long(e))},fromObject:function(t){return f.default.required(t),f.default.to_long(t)},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?"0":(f.default.required(t),f.default.to_long(t).toString())}},y.uint64={fromByteBuffer:function(t){return t.readUint64()},appendByteBuffer:function(t,e){t.writeUint64(f.default.to_long(f.default.unsigned(e)))},fromObject:function(t){return f.default.to_long(f.default.unsigned(t))},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?"0":f.default.to_long(t).toString()}},y.string={fromByteBuffer:function(t){var e,r=t.readVarint32()
return e=t.copy(t.offset,t.offset+r),t.skip(r),new i(e.toBinary(),"binary")},appendByteBuffer:function(t,e){f.default.required(e),t.writeVarint32(e.length),t.append(e.toString("binary"),"binary")},fromObject:function(t){return f.default.required(t),new i(t)},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?"":t.toString()}},y.bytes=function(t){return{fromByteBuffer:function(e){if(void 0===t){var r,n=e.readVarint32()
return r=e.copy(e.offset,e.offset+n),e.skip(n),new i(r.toBinary(),"binary")}return r=e.copy(e.offset,e.offset+t),e.skip(t),new i(r.toBinary(),"binary")},appendByteBuffer:function(e,r){f.default.required(r),"string"==typeof r&&(r=new i(r,"hex")),void 0===t&&e.writeVarint32(r.length),e.append(r.toString("binary"),"binary")},fromObject:function(t){return f.default.required(t),i.isBuffer(t)?t:new i(t,"hex")},toObject:function(e){if((arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===e)return function(t){return new Array(t).join("00")}(t)
return f.default.required(e),e.toString("hex")}}},y.bool={fromByteBuffer:function(t){return 1===t.readUint8()},appendByteBuffer:function(t,e){t.writeUint8(JSON.parse(e)?1:0)},fromObject:function(t){return!!JSON.parse(t)},toObject:function(t){return!((arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t||!JSON.parse(t))}},y.void={fromByteBuffer:function(t){throw new Error("(void) undefined type")},appendByteBuffer:function(t,e){throw new Error("(void) undefined type")},fromObject:function(t){throw new Error("(void) undefined type")},toObject:function(t){if(!(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default||void 0!==t)throw new Error("(void) undefined type")}},y.array=function(t){return{fromByteBuffer:function(e){var r=e.readVarint32()
v&&console.log("varint32 size = "+r.toString(16))
for(var n=[],i=0;0<r?i<r:i>r;i++)n.push(t.fromByteBuffer(e))
return B(n,t)},appendByteBuffer:function(e,r){f.default.required(r),r=B(r,t),e.writeVarint32(r.length)
for(var n,i=0;i<r.length;i++)n=r[i],t.appendByteBuffer(e,n)},fromObject:function(e){f.default.required(e),e=B(e,t)
for(var r,n=[],i=0;i<e.length;i++)r=e[i],n.push(t.fromObject(r))
return n},toObject:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
if(r.use_default&&void 0===e)return[t.toObject(e,r)]
f.default.required(e),e=B(e,t)
for(var n,i=[],o=0;o<e.length;o++)n=e[o],i.push(t.toObject(n,r))
return i}}},y.time_point_sec={fromByteBuffer:function(t){return t.readUint32()},appendByteBuffer:function(t,e){"number"!=typeof e&&(e=y.time_point_sec.fromObject(e)),t.writeUint32(e)},fromObject:function(t){if(f.default.required(t),"number"==typeof t)return t
if(t.getTime)return Math.floor(t.getTime()/1e3)
if("string"!=typeof t)throw new Error("Unknown date type: "+t)
return Math.floor(new Date(t).getTime()/1e3)},toObject:function(t){if((arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t)return new Date(0).toISOString().split(".")[0]
if(f.default.required(t),"string"==typeof t)return t
if(t.getTime)return t.toISOString().split(".")[0]
var e=parseInt(t)
return f.default.require_range(0,4294967295,e,"uint32 "+t),new Date(1e3*e).toISOString().split(".")[0]}},y.set=function(t){return{validate:function(e){for(var r,n={},i=0;i<e.length;i++){r=e[i]
var o
if(o=void 0===r?"undefined":s(r),["string","number"].indexOf(o)>=0){if(void 0!==n[r])throw new Error("duplicate (set)")
n[r]=!0}}return B(e,t)},fromByteBuffer:function(e){var r=e.readVarint32()
return v&&console.log("varint32 size = "+r.toString(16)),this.validate(function(){for(var n=[],i=0;0<r?i<r:i>r;i++)n.push(t.fromByteBuffer(e))
return n}())},appendByteBuffer:function(e,r){r||(r=[]),e.writeVarint32(r.length)
for(var n,i=this.validate(r),o=0;o<i.length;o++)n=i[o],t.appendByteBuffer(e,n)},fromObject:function(e){return e||(e=[]),this.validate(function(){for(var r,n=[],i=0;i<e.length;i++)r=e[i],n.push(t.fromObject(r))
return n}())},toObject:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return r.use_default&&void 0===e?[t.toObject(e,r)]:(e||(e=[]),this.validate(function(){for(var n,i=[],o=0;o<e.length;o++)n=e[o],i.push(t.toObject(n,r))
return i}()))}}},y.fixed_array=function(t,e){return{fromByteBuffer:function(r){var n,i,o
for(o=[],n=0,i=t;n<i;n+=1)o.push(e.fromByteBuffer(r))
return B(o,e)},appendByteBuffer:function(r,n){var i,o,s
for(0!==t&&(f.default.required(n),n=B(n,e)),i=o=0,s=t;o<s;i=o+=1)e.appendByteBuffer(r,n[i])},fromObject:function(r){var n,i,o,s
for(0!==t&&f.default.required(r),s=[],n=i=0,o=t;i<o;n=i+=1)s.push(e.fromObject(r[n]))
return s},toObject:function(r,n){var i,o,s,a,u,c,h
if(null==n&&(n={}),n.use_default&&void 0===r){for(c=[],i=o=0,a=t;o<a;i=o+=1)c.push(e.toObject(void 0,n))
return c}for(0!==t&&f.default.required(r),h=[],i=s=0,u=t;s<u;i=s+=1)h.push(e.toObject(r[i],n))
return h}}}
var w=function(t,e){return f.default.required(t,"reserved_spaces"),f.default.required(e,"object_type"),{fromByteBuffer:function(t){return t.readVarint32()},appendByteBuffer:function(r,n){f.default.required(n),void 0!==n.resolve&&(n=n.resolve),/^[0-9]+\.[0-9]+\.[0-9]+$/.test(n)&&(n=f.default.get_instance(t,e,n)),r.writeVarint32(f.default.to_number(n))},fromObject:function(r){return f.default.required(r),void 0!==r.resolve&&(r=r.resolve),f.default.is_digits(r)?f.default.to_number(r):f.default.get_instance(t,e,r)},toObject:function(r){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=l.default.object_type[e]
return n.use_default&&void 0===r?t+"."+i+".0":(f.default.required(r),void 0!==r.resolve&&(r=r.resolve),/^[0-9]+\.[0-9]+\.[0-9]+$/.test(r)&&(r=f.default.get_instance(t,e,r)),t+"."+i+"."+r)}}}
y.protocol_id_type=function(t){return f.default.required(t,"name"),w(l.default.reserved_spaces.protocol_ids,t)},y.object_id_type={fromByteBuffer:function(t){return d.default.fromByteBuffer(t)},appendByteBuffer:function(t,e){f.default.required(e),void 0!==e.resolve&&(e=e.resolve),e=d.default.fromString(e),e.appendByteBuffer(t)},fromObject:function(t){return f.default.required(t),void 0!==t.resolve&&(t=t.resolve),d.default.fromString(t)},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?"0.0.0":(f.default.required(t),void 0!==t.resolve&&(t=t.resolve),t=d.default.fromString(t),t.toString())}},y.vote_id={TYPE:255,ID:4294967040,fromByteBuffer:function(t){var e=t.readUint32()
return{type:e&this.TYPE,id:e&this.ID}},appendByteBuffer:function(t,e){f.default.required(e),"string"===e&&(e=y.vote_id.fromObject(e))
var r=e.id<<8|e.type
t.writeUint32(r)},fromObject:function(t){if(f.default.required(t,"(type vote_id)"),"object"===(void 0===t?"undefined":s(t)))return f.default.required(t.type,"type"),f.default.required(t.id,"id"),t
f.default.require_test(/^[0-9]+:[0-9]+$/,t,"vote_id format "+t)
var e=t.split(":"),r=e[0],n=e[1]
return f.default.require_range(0,255,r,"vote type "+t),f.default.require_range(0,16777215,n,"vote id "+t),{type:r,id:n}},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?"0:0":(f.default.required(t),"string"==typeof t&&(t=y.vote_id.fromObject(t)),t.type+":"+t.id)},compare:function(t,e){return"object"!==(void 0===t?"undefined":s(t))&&(t=y.vote_id.fromObject(t)),"object"!==(void 0===e?"undefined":s(e))&&(e=y.vote_id.fromObject(e)),parseInt(t.id)-parseInt(e.id)}},y.optional=function(t){return f.default.required(t,"st_operation"),{fromByteBuffer:function(e){if(1===e.readUint8())return t.fromByteBuffer(e)},appendByteBuffer:function(e,r){null!==r&&void 0!==r?(e.writeUint8(1),t.appendByteBuffer(e,r)):e.writeUint8(0)},fromObject:function(e){if(void 0!==e)return t.fromObject(e)},toObject:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=function(){return r.use_default||void 0!==e?t.toObject(e,r):void 0}()
return r.annotate&&("object"===(void 0===n?"undefined":s(n))?n.__optional="parent is optional":n={__optional:n}),n}}},y.static_variant=function(t){return{nosort:!0,st_operations:t,fromByteBuffer:function(t){var e=t.readVarint32(),r=this.st_operations[e]
return v&&console.error("static_variant id 0x"+e.toString(16)+" ("+e+")"),f.default.required(r,"operation "+e),[e,r.fromByteBuffer(t)]},appendByteBuffer:function(t,e){f.default.required(e)
var r=e[0],n=this.st_operations[r]
f.default.required(n,"operation "+r),t.writeVarint32(r),n.appendByteBuffer(t,e[1])},fromObject:function(t){f.default.required(t)
var e=t[0],r=this.st_operations[e]
return f.default.required(r,"operation "+e),[e,r.fromObject(t[1])]},toObject:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
if(e.use_default&&void 0===t)return[0,this.st_operations[0].toObject(void 0,e)]
f.default.required(t)
var r=t[0],n=this.st_operations[r]
return f.default.required(n,"operation "+r),[r,n.toObject(t[1],e)]}}},y.map=function(t,e){return{validate:function(e){if(!Array.isArray(e))throw new Error("expecting array")
for(var r,n={},i=0;i<e.length;i++){r=e[i]
var o
if(2!==r.length)throw new Error("expecting two elements")
if(o=s(r[0]),["number","string"].indexOf(o)>=0){if(void 0!==n[r[0]])throw new Error("duplicate (map)")
n[r[0]]=!0}}return B(e,t)},fromByteBuffer:function(r){for(var n=[],i=r.readVarint32(),o=0;0<i?o<i:o>i;o++)n.push([t.fromByteBuffer(r),e.fromByteBuffer(r)])
return this.validate(n)},appendByteBuffer:function(r,n){this.validate(n),r.writeVarint32(n.length)
for(var i,o=0;o<n.length;o++)i=n[o],t.appendByteBuffer(r,i[0]),e.appendByteBuffer(r,i[1])},fromObject:function(r){f.default.required(r)
for(var n,i=[],o=0;o<r.length;o++)n=r[o],i.push([t.fromObject(n[0]),e.fromObject(n[1])])
return this.validate(i)},toObject:function(r){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
if(n.use_default&&void 0===r)return[[t.toObject(void 0,n),e.toObject(void 0,n)]]
f.default.required(r),r=this.validate(r)
for(var i,o=[],s=0;s<r.length;s++)i=r[s],o.push([t.toObject(i[0],n),e.toObject(i[1],n)])
return o}}},y.public_key={toPublic:function(t){return void 0!==t.resolve&&(t=t.resolve),null==t?t:t.Q?t:_.PublicKey.fromStringOrThrow(t)},fromByteBuffer:function(t){return c.default.public_key(t)},appendByteBuffer:function(t,e){f.default.required(e),c.default.public_key(t,y.public_key.toPublic(e))},fromObject:function(t){return f.default.required(t),t.Q?t:y.public_key.toPublic(t)},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?g.ChainConfig.address_prefix+"859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM":(f.default.required(t),t.toString())},compare:function(t,e){return E(t.toAddressString(),e.toAddressString())}},y.address={_to_address:function(t){return f.default.required(t),t.addy?t:_.Address.fromString(t)},fromByteBuffer:function(t){return new _.Address(c.default.ripemd160(t))},appendByteBuffer:function(t,e){c.default.ripemd160(t,y.address._to_address(e).toBuffer())},fromObject:function(t){return y.address._to_address(t)},toObject:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).use_default&&void 0===t?g.ChainConfig.address_prefix+"664KmHxSuQyDsfwo4WEJvWpzg1QKdg67S":y.address._to_address(t).toString()},compare:function(t,e){return E(t.toString(),e.toString())}}
var E=function(t,e){return t>e?1:t<e?-1:0},S=function(t){return Array.isArray(t)?t[0]:t},B=function(t,e){return e.nosort?t:e.compare?t.sort(function(t,r){return e.compare(S(t),S(r))}):t.sort(function(t,e){return"number"==typeof S(t)&&"number"==typeof S(e)?S(t)-S(e):i.isBuffer(S(t))&&i.isBuffer(S(e))?E(S(t).toString("hex"),S(e).toString("hex")):E(S(t).toString(),S(e).toString())})}
r.default=y,e.exports=r.default}).call(this,t("_process"),t("buffer").Buffer)},{"../../chain/src/ChainTypes":16,"../../chain/src/ObjectId":20,"../../ecc":24,"./FastParser":38,"./SerializerValidation":39,_process:113,"bitsharesjs-ws":8,buffer:105}],45:[function(t,e,r){var n=t("base-x")
e.exports=n("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")},{"base-x":3}],46:[function(t,e,r){!function(r,n){"function"==typeof define&&define.amd?define(["long"],n):"function"==typeof t&&"object"==typeof e&&e&&e.exports?e.exports=function(){var e
try{e=t("long")}catch(t){}return n(e)}():(r.dcodeIO=r.dcodeIO||{}).ByteBuffer=n(r.dcodeIO.Long)}(this,function(t){"use strict"
function e(t){var e=0
return function(){return e<t.length?t.charCodeAt(e++):null}}function r(){var t=[],e=[]
return function(){if(0===arguments.length)return e.join("")+f.apply(String,t)
t.length+arguments.length>1024&&(e.push(f.apply(String,t)),t.length=0),Array.prototype.push.apply(t,arguments)}}function n(t,e,r,n,i){var o,s,a=8*i-n-1,f=(1<<a)-1,u=f>>1,c=-7,h=r?i-1:0,l=r?-1:1,p=t[e+h]
for(h+=l,o=p&(1<<-c)-1,p>>=-c,c+=a;c>0;o=256*o+t[e+h],h+=l,c-=8);for(s=o&(1<<-c)-1,o>>=-c,c+=n;c>0;s=256*s+t[e+h],h+=l,c-=8);if(0===o)o=1-u
else{if(o===f)return s?NaN:1/0*(p?-1:1)
s+=Math.pow(2,n),o-=u}return(p?-1:1)*s*Math.pow(2,o-n)}function i(t,e,r,n,i,o){var s,a,f,u=8*o-i-1,c=(1<<u)-1,h=c>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,_=e<0||0===e&&1/e<0?1:0
for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=c):(s=Math.floor(Math.log(e)/Math.LN2),e*(f=Math.pow(2,-s))<1&&(s--,f*=2),e+=s+h>=1?l/f:l*Math.pow(2,1-h),e*f>=2&&(s++,f/=2),s+h>=c?(a=0,s=c):s+h>=1?(a=(e*f-1)*Math.pow(2,i),s+=h):(a=e*Math.pow(2,h-1)*Math.pow(2,i),s=0));i>=8;t[r+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,u+=i;u>0;t[r+p]=255&s,p+=d,s/=256,u-=8);t[r+p-d]|=128*_}var o=function(t,e,r){if(void 0===t&&(t=o.DEFAULT_CAPACITY),void 0===e&&(e=o.DEFAULT_ENDIAN),void 0===r&&(r=o.DEFAULT_NOASSERT),!r){if((t|=0)<0)throw RangeError("Illegal capacity")
e=!!e,r=!!r}this.buffer=0===t?a:new ArrayBuffer(t),this.view=0===t?null:new Uint8Array(this.buffer),this.offset=0,this.markedOffset=-1,this.limit=t,this.littleEndian=e,this.noAssert=r}
o.VERSION="5.0.1",o.LITTLE_ENDIAN=!0,o.BIG_ENDIAN=!1,o.DEFAULT_CAPACITY=16,o.DEFAULT_ENDIAN=o.BIG_ENDIAN,o.DEFAULT_NOASSERT=!1,o.Long=t||null
var s=o.prototype
s.__isByteBuffer__,Object.defineProperty(s,"__isByteBuffer__",{value:!0,enumerable:!1,configurable:!1})
var a=new ArrayBuffer(0),f=String.fromCharCode
o.accessor=function(){return Uint8Array},o.allocate=function(t,e,r){return new o(t,e,r)},o.concat=function(t,e,r,n){"boolean"!=typeof e&&"string"==typeof e||(n=r,r=e,e=void 0)
for(var i,s=0,a=0,f=t.length;a<f;++a)o.isByteBuffer(t[a])||(t[a]=o.wrap(t[a],e)),(i=t[a].limit-t[a].offset)>0&&(s+=i)
if(0===s)return new o(0,r,n)
var u,c=new o(s,r,n)
for(a=0;a<f;)u=t[a++],(i=u.limit-u.offset)<=0||(c.view.set(u.view.subarray(u.offset,u.limit),c.offset),c.offset+=i)
return c.limit=c.offset,c.offset=0,c},o.isByteBuffer=function(t){return!0===(t&&t.__isByteBuffer__)},o.type=function(){return ArrayBuffer},o.wrap=function(t,e,r,n){if("string"!=typeof e&&(n=r,r=e,e=void 0),"string"==typeof t)switch(void 0===e&&(e="utf8"),e){case"base64":return o.fromBase64(t,r)
case"hex":return o.fromHex(t,r)
case"binary":return o.fromBinary(t,r)
case"utf8":return o.fromUTF8(t,r)
case"debug":return o.fromDebug(t,r)
default:throw Error("Unsupported encoding: "+e)}if(null===t||"object"!=typeof t)throw TypeError("Illegal buffer")
var i
if(o.isByteBuffer(t))return i=s.clone.call(t),i.markedOffset=-1,i
if(t instanceof Uint8Array)i=new o(0,r,n),t.length>0&&(i.buffer=t.buffer,i.offset=t.byteOffset,i.limit=t.byteOffset+t.byteLength,i.view=new Uint8Array(t.buffer))
else if(t instanceof ArrayBuffer)i=new o(0,r,n),t.byteLength>0&&(i.buffer=t,i.offset=0,i.limit=t.byteLength,i.view=t.byteLength>0?new Uint8Array(t):null)
else{if("[object Array]"!==Object.prototype.toString.call(t))throw TypeError("Illegal buffer")
i=new o(t.length,r,n),i.limit=t.length
for(var a=0;a<t.length;++a)i.view[a]=t[a]}return i},s.writeBitSet=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if(!(t instanceof Array))throw TypeError("Illegal BitSet: Not an array")
if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}var n,i=e,o=t.length,s=o>>3,a=0
for(e+=this.writeVarint32(o,e);s--;)n=1&!!t[a++]|(1&!!t[a++])<<1|(1&!!t[a++])<<2|(1&!!t[a++])<<3|(1&!!t[a++])<<4|(1&!!t[a++])<<5|(1&!!t[a++])<<6|(1&!!t[a++])<<7,this.writeByte(n,e++)
if(a<o){var f=0
for(n=0;a<o;)n|=(1&!!t[a++])<<f++
this.writeByte(n,e++)}return r?(this.offset=e,this):e-i},s.readBitSet=function(t){var e=void 0===t
e&&(t=this.offset)
var r,n=this.readVarint32(t),i=n.value,o=i>>3,s=0,a=[]
for(t+=n.length;o--;)r=this.readByte(t++),a[s++]=!!(1&r),a[s++]=!!(2&r),a[s++]=!!(4&r),a[s++]=!!(8&r),a[s++]=!!(16&r),a[s++]=!!(32&r),a[s++]=!!(64&r),a[s++]=!!(128&r)
if(s<i){var f=0
for(r=this.readByte(t++);s<i;)a[s++]=!!(r>>f++&1)}return e&&(this.offset=t),a},s.readBytes=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+t>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+"+t+") <= "+this.buffer.byteLength)}var n=this.slice(e,e+t)
return r&&(this.offset+=t),n},s.writeBytes=s.append,s.writeInt8=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t|=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=1
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=1,this.view[e]=t,r&&(this.offset+=1),this},s.writeByte=s.writeInt8,s.readInt8=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+1) <= "+this.buffer.byteLength)}var r=this.view[t]
return 128==(128&r)&&(r=-(255-r+1)),e&&(this.offset+=1),r},s.readByte=s.readInt8,s.writeUint8=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=1
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=1,this.view[e]=t,r&&(this.offset+=1),this},s.writeUInt8=s.writeUint8,s.readUint8=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+1) <= "+this.buffer.byteLength)}var r=this.view[t]
return e&&(this.offset+=1),r},s.readUInt8=s.readUint8,s.writeInt16=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t|=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=2
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=2,this.littleEndian?(this.view[e+1]=(65280&t)>>>8,this.view[e]=255&t):(this.view[e]=(65280&t)>>>8,this.view[e+1]=255&t),r&&(this.offset+=2),this},s.writeShort=s.writeInt16,s.readInt16=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+2>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+2) <= "+this.buffer.byteLength)}var r=0
return this.littleEndian?(r=this.view[t],r|=this.view[t+1]<<8):(r=this.view[t]<<8,r|=this.view[t+1]),32768==(32768&r)&&(r=-(65535-r+1)),e&&(this.offset+=2),r},s.readShort=s.readInt16,s.writeUint16=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=2
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=2,this.littleEndian?(this.view[e+1]=(65280&t)>>>8,this.view[e]=255&t):(this.view[e]=(65280&t)>>>8,this.view[e+1]=255&t),r&&(this.offset+=2),this},s.writeUInt16=s.writeUint16,s.readUint16=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+2>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+2) <= "+this.buffer.byteLength)}var r=0
return this.littleEndian?(r=this.view[t],r|=this.view[t+1]<<8):(r=this.view[t]<<8,r|=this.view[t+1]),e&&(this.offset+=2),r},s.readUInt16=s.readUint16,s.writeInt32=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t|=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=4
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=4,this.littleEndian?(this.view[e+3]=t>>>24&255,this.view[e+2]=t>>>16&255,this.view[e+1]=t>>>8&255,this.view[e]=255&t):(this.view[e]=t>>>24&255,this.view[e+1]=t>>>16&255,this.view[e+2]=t>>>8&255,this.view[e+3]=255&t),r&&(this.offset+=4),this},s.writeInt=s.writeInt32,s.readInt32=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+4) <= "+this.buffer.byteLength)}var r=0
return this.littleEndian?(r=this.view[t+2]<<16,r|=this.view[t+1]<<8,r|=this.view[t],r+=this.view[t+3]<<24>>>0):(r=this.view[t+1]<<16,r|=this.view[t+2]<<8,r|=this.view[t+3],r+=this.view[t]<<24>>>0),r|=0,e&&(this.offset+=4),r},s.readInt=s.readInt32,s.writeUint32=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=4
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=4,this.littleEndian?(this.view[e+3]=t>>>24&255,this.view[e+2]=t>>>16&255,this.view[e+1]=t>>>8&255,this.view[e]=255&t):(this.view[e]=t>>>24&255,this.view[e+1]=t>>>16&255,this.view[e+2]=t>>>8&255,this.view[e+3]=255&t),r&&(this.offset+=4),this},s.writeUInt32=s.writeUint32,s.readUint32=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+4) <= "+this.buffer.byteLength)}var r=0
return this.littleEndian?(r=this.view[t+2]<<16,r|=this.view[t+1]<<8,r|=this.view[t],r+=this.view[t+3]<<24>>>0):(r=this.view[t+1]<<16,r|=this.view[t+2]<<8,r|=this.view[t+3],r+=this.view[t]<<24>>>0),e&&(this.offset+=4),r},s.readUInt32=s.readUint32,t&&(s.writeInt64=function(e,r){var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("number"==typeof e)e=t.fromNumber(e)
else if("string"==typeof e)e=t.fromString(e)
else if(!(e&&e instanceof t))throw TypeError("Illegal value: "+e+" (not an integer or Long)")
if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}"number"==typeof e?e=t.fromNumber(e):"string"==typeof e&&(e=t.fromString(e)),r+=8
var i=this.buffer.byteLength
r>i&&this.resize((i*=2)>r?i:r),r-=8
var o=e.low,s=e.high
return this.littleEndian?(this.view[r+3]=o>>>24&255,this.view[r+2]=o>>>16&255,this.view[r+1]=o>>>8&255,this.view[r]=255&o,r+=4,this.view[r+3]=s>>>24&255,this.view[r+2]=s>>>16&255,this.view[r+1]=s>>>8&255,this.view[r]=255&s):(this.view[r]=s>>>24&255,this.view[r+1]=s>>>16&255,this.view[r+2]=s>>>8&255,this.view[r+3]=255&s,r+=4,this.view[r]=o>>>24&255,this.view[r+1]=o>>>16&255,this.view[r+2]=o>>>8&255,this.view[r+3]=255&o),n&&(this.offset+=8),this},s.writeLong=s.writeInt64,s.readInt64=function(e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+8>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+8) <= "+this.buffer.byteLength)}var n=0,i=0
this.littleEndian?(n=this.view[e+2]<<16,n|=this.view[e+1]<<8,n|=this.view[e],n+=this.view[e+3]<<24>>>0,e+=4,i=this.view[e+2]<<16,i|=this.view[e+1]<<8,i|=this.view[e],i+=this.view[e+3]<<24>>>0):(i=this.view[e+1]<<16,i|=this.view[e+2]<<8,i|=this.view[e+3],i+=this.view[e]<<24>>>0,e+=4,n=this.view[e+1]<<16,n|=this.view[e+2]<<8,n|=this.view[e+3],n+=this.view[e]<<24>>>0)
var o=new t(n,i,!1)
return r&&(this.offset+=8),o},s.readLong=s.readInt64,s.writeUint64=function(e,r){var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("number"==typeof e)e=t.fromNumber(e)
else if("string"==typeof e)e=t.fromString(e)
else if(!(e&&e instanceof t))throw TypeError("Illegal value: "+e+" (not an integer or Long)")
if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}"number"==typeof e?e=t.fromNumber(e):"string"==typeof e&&(e=t.fromString(e)),r+=8
var i=this.buffer.byteLength
r>i&&this.resize((i*=2)>r?i:r),r-=8
var o=e.low,s=e.high
return this.littleEndian?(this.view[r+3]=o>>>24&255,this.view[r+2]=o>>>16&255,this.view[r+1]=o>>>8&255,this.view[r]=255&o,r+=4,this.view[r+3]=s>>>24&255,this.view[r+2]=s>>>16&255,this.view[r+1]=s>>>8&255,this.view[r]=255&s):(this.view[r]=s>>>24&255,this.view[r+1]=s>>>16&255,this.view[r+2]=s>>>8&255,this.view[r+3]=255&s,r+=4,this.view[r]=o>>>24&255,this.view[r+1]=o>>>16&255,this.view[r+2]=o>>>8&255,this.view[r+3]=255&o),n&&(this.offset+=8),this},s.writeUInt64=s.writeUint64,s.readUint64=function(e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+8>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+8) <= "+this.buffer.byteLength)}var n=0,i=0
this.littleEndian?(n=this.view[e+2]<<16,n|=this.view[e+1]<<8,n|=this.view[e],n+=this.view[e+3]<<24>>>0,e+=4,i=this.view[e+2]<<16,i|=this.view[e+1]<<8,i|=this.view[e],i+=this.view[e+3]<<24>>>0):(i=this.view[e+1]<<16,i|=this.view[e+2]<<8,i|=this.view[e+3],i+=this.view[e]<<24>>>0,e+=4,n=this.view[e+1]<<16,n|=this.view[e+2]<<8,n|=this.view[e+3],n+=this.view[e]<<24>>>0)
var o=new t(n,i,!0)
return r&&(this.offset+=8),o},s.readUInt64=s.readUint64),s.writeFloat32=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t)throw TypeError("Illegal value: "+t+" (not a number)")
if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=4
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=4,i(this.view,t,e,this.littleEndian,23,4),r&&(this.offset+=4),this},s.writeFloat=s.writeFloat32,s.readFloat32=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+4) <= "+this.buffer.byteLength)}var r=n(this.view,t,this.littleEndian,23,4)
return e&&(this.offset+=4),r},s.readFloat=s.readFloat32,s.writeFloat64=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t)throw TypeError("Illegal value: "+t+" (not a number)")
if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}e+=8
var n=this.buffer.byteLength
return e>n&&this.resize((n*=2)>e?n:e),e-=8,i(this.view,t,e,this.littleEndian,52,8),r&&(this.offset+=8),this},s.writeDouble=s.writeFloat64,s.readFloat64=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+8>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+8) <= "+this.buffer.byteLength)}var r=n(this.view,t,this.littleEndian,52,8)
return e&&(this.offset+=8),r},s.readDouble=s.readFloat64,o.MAX_VARINT32_BYTES=5,o.calculateVarint32=function(t){return t>>>=0,t<128?1:t<16384?2:t<1<<21?3:t<1<<28?4:5},o.zigZagEncode32=function(t){return((t|=0)<<1^t>>31)>>>0},o.zigZagDecode32=function(t){return t>>>1^-(1&t)|0},s.writeVarint32=function(t,e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t|=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+0) <= "+this.buffer.byteLength)}var n,i=o.calculateVarint32(t)
e+=i
var s=this.buffer.byteLength
for(e>s&&this.resize((s*=2)>e?s:e),e-=i,t>>>=0;t>=128;)n=127&t|128,this.view[e++]=n,t>>>=7
return this.view[e++]=t,r?(this.offset=e,this):i},s.writeVarint32ZigZag=function(t,e){return this.writeVarint32(o.zigZagEncode32(t),e)},s.readVarint32=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+1) <= "+this.buffer.byteLength)}var r,n=0,i=0
do{if(!this.noAssert&&t>this.limit){var o=Error("Truncated")
throw o.truncated=!0,o}r=this.view[t++],n<5&&(i|=(127&r)<<7*n),++n}while(0!=(128&r))
return i|=0,e?(this.offset=t,i):{value:i,length:n}},s.readVarint32ZigZag=function(t){var e=this.readVarint32(t)
return"object"==typeof e?e.value=o.zigZagDecode32(e.value):e=o.zigZagDecode32(e),e},t&&(o.MAX_VARINT64_BYTES=10,o.calculateVarint64=function(e){"number"==typeof e?e=t.fromNumber(e):"string"==typeof e&&(e=t.fromString(e))
var r=e.toInt()>>>0,n=e.shiftRightUnsigned(28).toInt()>>>0,i=e.shiftRightUnsigned(56).toInt()>>>0
return 0==i?0==n?r<16384?r<128?1:2:r<1<<21?3:4:n<16384?n<128?5:6:n<1<<21?7:8:i<128?9:10},o.zigZagEncode64=function(e){return"number"==typeof e?e=t.fromNumber(e,!1):"string"==typeof e?e=t.fromString(e,!1):!1!==e.unsigned&&(e=e.toSigned()),e.shiftLeft(1).xor(e.shiftRight(63)).toUnsigned()},o.zigZagDecode64=function(e){return"number"==typeof e?e=t.fromNumber(e,!1):"string"==typeof e?e=t.fromString(e,!1):!1!==e.unsigned&&(e=e.toSigned()),e.shiftRightUnsigned(1).xor(e.and(t.ONE).toSigned().negate()).toSigned()},s.writeVarint64=function(e,r){var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("number"==typeof e)e=t.fromNumber(e)
else if("string"==typeof e)e=t.fromString(e)
else if(!(e&&e instanceof t))throw TypeError("Illegal value: "+e+" (not an integer or Long)")
if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}"number"==typeof e?e=t.fromNumber(e,!1):"string"==typeof e?e=t.fromString(e,!1):!1!==e.unsigned&&(e=e.toSigned())
var i=o.calculateVarint64(e),s=e.toInt()>>>0,a=e.shiftRightUnsigned(28).toInt()>>>0,f=e.shiftRightUnsigned(56).toInt()>>>0
r+=i
var u=this.buffer.byteLength
switch(r>u&&this.resize((u*=2)>r?u:r),r-=i,i){case 10:this.view[r+9]=f>>>7&1
case 9:this.view[r+8]=9!==i?128|f:127&f
case 8:this.view[r+7]=8!==i?a>>>21|128:a>>>21&127
case 7:this.view[r+6]=7!==i?a>>>14|128:a>>>14&127
case 6:this.view[r+5]=6!==i?a>>>7|128:a>>>7&127
case 5:this.view[r+4]=5!==i?128|a:127&a
case 4:this.view[r+3]=4!==i?s>>>21|128:s>>>21&127
case 3:this.view[r+2]=3!==i?s>>>14|128:s>>>14&127
case 2:this.view[r+1]=2!==i?s>>>7|128:s>>>7&127
case 1:this.view[r]=1!==i?128|s:127&s}return n?(this.offset+=i,this):i},s.writeVarint64ZigZag=function(t,e){return this.writeVarint64(o.zigZagEncode64(t),e)},s.readVarint64=function(e){var r=void 0===e
if(r&&(e=this.offset),!this.noAssert){if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: "+e+" (not an integer)")
if((e>>>=0)<0||e+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+e+" (+1) <= "+this.buffer.byteLength)}var n=e,i=0,o=0,s=0,a=0
if(a=this.view[e++],i=127&a,128&a&&(a=this.view[e++],i|=(127&a)<<7,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],i|=(127&a)<<14,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],i|=(127&a)<<21,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],o=127&a,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],o|=(127&a)<<7,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],o|=(127&a)<<14,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],o|=(127&a)<<21,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],s=127&a,(128&a||this.noAssert&&void 0===a)&&(a=this.view[e++],s|=(127&a)<<7,128&a||this.noAssert&&void 0===a))))))))))throw Error("Buffer overrun")
var f=t.fromBits(i|o<<28,o>>>4|s<<24,!1)
return r?(this.offset=e,f):{value:f,length:e-n}},s.readVarint64ZigZag=function(e){var r=this.readVarint64(e)
return r&&r.value instanceof t?r.value=o.zigZagDecode64(r.value):r=o.zigZagDecode64(r),r}),s.writeCString=function(t,r){var n=void 0===r
n&&(r=this.offset)
var i,o=t.length
if(!this.noAssert){if("string"!=typeof t)throw TypeError("Illegal str: Not a string")
for(i=0;i<o;++i)if(0===t.charCodeAt(i))throw RangeError("Illegal str: Contains NULL-characters")
if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}o=c.calculateUTF16asUTF8(e(t))[1],r+=o+1
var s=this.buffer.byteLength
return r>s&&this.resize((s*=2)>r?s:r),r-=o+1,c.encodeUTF16toUTF8(e(t),function(t){this.view[r++]=t}.bind(this)),this.view[r++]=0,n?(this.offset=r,this):o},s.readCString=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+1) <= "+this.buffer.byteLength)}var n,i=t,o=-1
return c.decodeUTF8toUTF16(function(){if(0===o)return null
if(t>=this.limit)throw RangeError("Illegal range: Truncated data, "+t+" < "+this.limit)
return o=this.view[t++],0===o?null:o}.bind(this),n=r(),!0),e?(this.offset=t,n()):{string:n(),length:t-i}},s.writeIString=function(t,r){var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("string"!=typeof t)throw TypeError("Illegal str: Not a string")
if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}var i,o=r
i=c.calculateUTF16asUTF8(e(t),this.noAssert)[1],r+=4+i
var s=this.buffer.byteLength
if(r>s&&this.resize((s*=2)>r?s:r),r-=4+i,this.littleEndian?(this.view[r+3]=i>>>24&255,this.view[r+2]=i>>>16&255,this.view[r+1]=i>>>8&255,this.view[r]=255&i):(this.view[r]=i>>>24&255,this.view[r+1]=i>>>16&255,this.view[r+2]=i>>>8&255,this.view[r+3]=255&i),r+=4,c.encodeUTF16toUTF8(e(t),function(t){this.view[r++]=t}.bind(this)),r!==o+4+i)throw RangeError("Illegal range: Truncated data, "+r+" == "+(r+4+i))
return n?(this.offset=r,this):r-o},s.readIString=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+4) <= "+this.buffer.byteLength)}var r=t,n=this.readUint32(t),i=this.readUTF8String(n,o.METRICS_BYTES,t+=4)
return t+=i.length,e?(this.offset=t,i.string):{string:i.string,length:t-r}},o.METRICS_CHARS="c",o.METRICS_BYTES="b",s.writeUTF8String=function(t,r){var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}var i,o=r
i=c.calculateUTF16asUTF8(e(t))[1],r+=i
var s=this.buffer.byteLength
return r>s&&this.resize((s*=2)>r?s:r),r-=i,c.encodeUTF16toUTF8(e(t),function(t){this.view[r++]=t}.bind(this)),n?(this.offset=r,this):r-o},s.writeString=s.writeUTF8String,o.calculateUTF8Chars=function(t){return c.calculateUTF16asUTF8(e(t))[0]},o.calculateUTF8Bytes=function(t){return c.calculateUTF16asUTF8(e(t))[1]},o.calculateString=o.calculateUTF8Bytes,s.readUTF8String=function(t,e,n){"number"==typeof e&&(n=e,e=void 0)
var i=void 0===n
if(i&&(n=this.offset),void 0===e&&(e=o.METRICS_CHARS),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal length: "+t+" (not an integer)")
if(t|=0,"number"!=typeof n||n%1!=0)throw TypeError("Illegal offset: "+n+" (not an integer)")
if((n>>>=0)<0||n+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+n+" (+0) <= "+this.buffer.byteLength)}var s,a=0,f=n
if(e===o.METRICS_CHARS){if(s=r(),c.decodeUTF8(function(){return a<t&&n<this.limit?this.view[n++]:null}.bind(this),function(t){++a,c.UTF8toUTF16(t,s)}),a!==t)throw RangeError("Illegal range: Truncated data, "+a+" == "+t)
return i?(this.offset=n,s()):{string:s(),length:n-f}}if(e===o.METRICS_BYTES){if(!this.noAssert){if("number"!=typeof n||n%1!=0)throw TypeError("Illegal offset: "+n+" (not an integer)")
if((n>>>=0)<0||n+t>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+n+" (+"+t+") <= "+this.buffer.byteLength)}var u=n+t
if(c.decodeUTF8toUTF16(function(){return n<u?this.view[n++]:null}.bind(this),s=r(),this.noAssert),n!==u)throw RangeError("Illegal range: Truncated data, "+n+" == "+u)
return i?(this.offset=n,s()):{string:s(),length:n-f}}throw TypeError("Unsupported metrics: "+e)},s.readString=s.readUTF8String,s.writeVString=function(t,r){var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("string"!=typeof t)throw TypeError("Illegal str: Not a string")
if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}var i,s,a=r
i=c.calculateUTF16asUTF8(e(t),this.noAssert)[1],s=o.calculateVarint32(i),r+=s+i
var f=this.buffer.byteLength
if(r>f&&this.resize((f*=2)>r?f:r),r-=s+i,r+=this.writeVarint32(i,r),c.encodeUTF16toUTF8(e(t),function(t){this.view[r++]=t}.bind(this)),r!==a+i+s)throw RangeError("Illegal range: Truncated data, "+r+" == "+(r+i+s))
return n?(this.offset=r,this):r-a},s.readVString=function(t){var e=void 0===t
if(e&&(t=this.offset),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+1) <= "+this.buffer.byteLength)}var r=t,n=this.readVarint32(t),i=this.readUTF8String(n.value,o.METRICS_BYTES,t+=n.length)
return t+=i.length,e?(this.offset=t,i.string):{string:i.string,length:t-r}},s.append=function(t,e,r){"number"!=typeof e&&"string"==typeof e||(r=e,e=void 0)
var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}t instanceof o||(t=o.wrap(t,e))
var i=t.limit-t.offset
if(i<=0)return this
r+=i
var s=this.buffer.byteLength
return r>s&&this.resize((s*=2)>r?s:r),r-=i,this.view.set(t.view.subarray(t.offset,t.limit),r),t.offset+=i,n&&(this.offset+=i),this},s.appendTo=function(t,e){return t.append(this,e),this},s.assert=function(t){return this.noAssert=!t,this},s.capacity=function(){return this.buffer.byteLength},s.clear=function(){return this.offset=0,this.limit=this.buffer.byteLength,this.markedOffset=-1,this},s.clone=function(t){var e=new o(0,this.littleEndian,this.noAssert)
return t?(e.buffer=new ArrayBuffer(this.buffer.byteLength),e.view=new Uint8Array(e.buffer)):(e.buffer=this.buffer,e.view=this.view),e.offset=this.offset,e.markedOffset=this.markedOffset,e.limit=this.limit,e},s.compact=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal begin: Not an integer")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal end: Not an integer")
if(e>>>=0,t<0||t>e||e>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+t+" <= "+e+" <= "+this.buffer.byteLength)}if(0===t&&e===this.buffer.byteLength)return this
var r=e-t
if(0===r)return this.buffer=a,this.view=null,this.markedOffset>=0&&(this.markedOffset-=t),this.offset=0,this.limit=0,this
var n=new ArrayBuffer(r),i=new Uint8Array(n)
return i.set(this.view.subarray(t,e)),this.buffer=n,this.view=i,this.markedOffset>=0&&(this.markedOffset-=t),this.offset=0,this.limit=r,this},s.copy=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal begin: Not an integer")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal end: Not an integer")
if(e>>>=0,t<0||t>e||e>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+t+" <= "+e+" <= "+this.buffer.byteLength)}if(t===e)return new o(0,this.littleEndian,this.noAssert)
var r=e-t,n=new o(r,this.littleEndian,this.noAssert)
return n.offset=0,n.limit=r,n.markedOffset>=0&&(n.markedOffset-=t),this.copyTo(n,0,t,e),n},s.copyTo=function(t,e,r,n){var i,s
if(!this.noAssert&&!o.isByteBuffer(t))throw TypeError("Illegal target: Not a ByteBuffer")
if(e=(s=void 0===e)?t.offset:0|e,r=(i=void 0===r)?this.offset:0|r,n=void 0===n?this.limit:0|n,e<0||e>t.buffer.byteLength)throw RangeError("Illegal target range: 0 <= "+e+" <= "+t.buffer.byteLength)
if(r<0||n>this.buffer.byteLength)throw RangeError("Illegal source range: 0 <= "+r+" <= "+this.buffer.byteLength)
var a=n-r
return 0===a?t:(t.ensureCapacity(e+a),t.view.set(this.view.subarray(r,n),e),i&&(this.offset+=a),s&&(t.offset+=a),this)},s.ensureCapacity=function(t){var e=this.buffer.byteLength
return e<t?this.resize((e*=2)>t?e:t):this},s.fill=function(t,e,r){var n=void 0===e
if(n&&(e=this.offset),"string"==typeof t&&t.length>0&&(t=t.charCodeAt(0)),void 0===e&&(e=this.offset),void 0===r&&(r=this.limit),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal value: "+t+" (not an integer)")
if(t|=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal begin: Not an integer")
if(e>>>=0,"number"!=typeof r||r%1!=0)throw TypeError("Illegal end: Not an integer")
if(r>>>=0,e<0||e>r||r>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+e+" <= "+r+" <= "+this.buffer.byteLength)}if(e>=r)return this
for(;e<r;)this.view[e++]=t
return n&&(this.offset=e),this},s.flip=function(){return this.limit=this.offset,this.offset=0,this},s.mark=function(t){if(t=void 0===t?this.offset:t,!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal offset: "+t+" (not an integer)")
if((t>>>=0)<0||t+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+t+" (+0) <= "+this.buffer.byteLength)}return this.markedOffset=t,this},s.order=function(t){if(!this.noAssert&&"boolean"!=typeof t)throw TypeError("Illegal littleEndian: Not a boolean")
return this.littleEndian=!!t,this},s.LE=function(t){return this.littleEndian=void 0===t||!!t,this},s.BE=function(t){return this.littleEndian=void 0!==t&&!t,this},s.prepend=function(t,e,r){"number"!=typeof e&&"string"==typeof e||(r=e,e=void 0)
var n=void 0===r
if(n&&(r=this.offset),!this.noAssert){if("number"!=typeof r||r%1!=0)throw TypeError("Illegal offset: "+r+" (not an integer)")
if((r>>>=0)<0||r+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+r+" (+0) <= "+this.buffer.byteLength)}t instanceof o||(t=o.wrap(t,e))
var i=t.limit-t.offset
if(i<=0)return this
var s=i-r
if(s>0){var a=new ArrayBuffer(this.buffer.byteLength+s),f=new Uint8Array(a)
f.set(this.view.subarray(r,this.buffer.byteLength),i),this.buffer=a,this.view=f,this.offset+=s,this.markedOffset>=0&&(this.markedOffset+=s),this.limit+=s,r+=s}else{new Uint8Array(this.buffer)}return this.view.set(t.view.subarray(t.offset,t.limit),r-i),t.offset=t.limit,n&&(this.offset-=i),this},s.prependTo=function(t,e){return t.prepend(this,e),this},s.printDebug=function(t){"function"!=typeof t&&(t=console.log.bind(console)),t(this.toString()+"\n-------------------------------------------------------------------\n"+this.toDebug(!0))},s.remaining=function(){return this.limit-this.offset},s.reset=function(){return this.markedOffset>=0?(this.offset=this.markedOffset,this.markedOffset=-1):this.offset=0,this},s.resize=function(t){if(!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal capacity: "+t+" (not an integer)")
if((t|=0)<0)throw RangeError("Illegal capacity: 0 <= "+t)}if(this.buffer.byteLength<t){var e=new ArrayBuffer(t),r=new Uint8Array(e)
r.set(this.view),this.buffer=e,this.view=r}return this},s.reverse=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal begin: Not an integer")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal end: Not an integer")
if(e>>>=0,t<0||t>e||e>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+t+" <= "+e+" <= "+this.buffer.byteLength)}return t===e?this:(Array.prototype.reverse.call(this.view.subarray(t,e)),this)},s.skip=function(t){if(!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal length: "+t+" (not an integer)")
t|=0}var e=this.offset+t
if(!this.noAssert&&(e<0||e>this.buffer.byteLength))throw RangeError("Illegal length: 0 <= "+this.offset+" + "+t+" <= "+this.buffer.byteLength)
return this.offset=e,this},s.slice=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal begin: Not an integer")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal end: Not an integer")
if(e>>>=0,t<0||t>e||e>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+t+" <= "+e+" <= "+this.buffer.byteLength)}var r=this.clone()
return r.offset=t,r.limit=e,r},s.toBuffer=function(t){var e=this.offset,r=this.limit
if(!this.noAssert){if("number"!=typeof e||e%1!=0)throw TypeError("Illegal offset: Not an integer")
if(e>>>=0,"number"!=typeof r||r%1!=0)throw TypeError("Illegal limit: Not an integer")
if(r>>>=0,e<0||e>r||r>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+e+" <= "+r+" <= "+this.buffer.byteLength)}if(!t&&0===e&&r===this.buffer.byteLength)return this.buffer
if(e===r)return a
var n=new ArrayBuffer(r-e)
return new Uint8Array(n).set(new Uint8Array(this.buffer).subarray(e,r),0),n},s.toArrayBuffer=s.toBuffer,s.toString=function(t,e,r){if(void 0===t)return"ByteBufferAB(offset="+this.offset+",markedOffset="+this.markedOffset+",limit="+this.limit+",capacity="+this.capacity()+")"
switch("number"==typeof t&&(t="utf8",e=t,r=e),t){case"utf8":return this.toUTF8(e,r)
case"base64":return this.toBase64(e,r)
case"hex":return this.toHex(e,r)
case"binary":return this.toBinary(e,r)
case"debug":return this.toDebug()
case"columns":return this.toColumns()
default:throw Error("Unsupported encoding: "+t)}}
var u=function(){for(var t={},e=[65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,48,49,50,51,52,53,54,55,56,57,43,47],r=[],n=0,i=e.length;n<i;++n)r[e[n]]=n
return t.encode=function(t,r){for(var n,i;null!==(n=t());)r(e[n>>2&63]),i=(3&n)<<4,null!==(n=t())?(i|=n>>4&15,r(e[63&(i|n>>4&15)]),i=(15&n)<<2,null!==(n=t())?(r(e[63&(i|n>>6&3)]),r(e[63&n])):(r(e[63&i]),r(61))):(r(e[63&i]),r(61),r(61))},t.decode=function(t,e){function n(t){throw Error("Illegal character code: "+t)}for(var i,o,s;null!==(i=t());)if(o=r[i],void 0===o&&n(i),null!==(i=t())&&(s=r[i],void 0===s&&n(i),e(o<<2>>>0|(48&s)>>4),null!==(i=t()))){if(void 0===(o=r[i])){if(61===i)break
n(i)}if(e((15&s)<<4>>>0|(60&o)>>2),null!==(i=t())){if(void 0===(s=r[i])){if(61===i)break
n(i)}e((3&o)<<6>>>0|s)}}},t.test=function(t){return/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(t)},t}()
s.toBase64=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),t|=0,e|=0,t<0||e>this.capacity||t>e)throw RangeError("begin, end")
var n
return u.encode(function(){return t<e?this.view[t++]:null}.bind(this),n=r()),n()},o.fromBase64=function(t,r){if("string"!=typeof t)throw TypeError("str")
var n=new o(t.length/4*3,r),i=0
return u.decode(e(t),function(t){n.view[i++]=t}),n.limit=i,n},o.btoa=function(t){return o.fromBinary(t).toBase64()},o.atob=function(t){return o.fromBase64(t).toBinary()},s.toBinary=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),t|=0,e|=0,t<0||e>this.capacity()||t>e)throw RangeError("begin, end")
if(t===e)return""
for(var r=[],n=[];t<e;)r.push(this.view[t++]),r.length>=1024&&(n.push(String.fromCharCode.apply(String,r)),r=[])
return n.join("")+String.fromCharCode.apply(String,r)},o.fromBinary=function(t,e){if("string"!=typeof t)throw TypeError("str")
for(var r,n=0,i=t.length,s=new o(i,e);n<i;){if((r=t.charCodeAt(n))>255)throw RangeError("illegal char code: "+r)
s.view[n++]=r}return s.limit=i,s},s.toDebug=function(t){for(var e,r=-1,n=this.buffer.byteLength,i="",o="",s="";r<n;){if(-1!==r&&(e=this.view[r],i+=e<16?"0"+e.toString(16).toUpperCase():e.toString(16).toUpperCase(),t&&(o+=e>32&&e<127?String.fromCharCode(e):".")),++r,t&&r>0&&r%16==0&&r!==n){for(;i.length<51;)i+=" "
s+=i+o+"\n",i=o=""}r===this.offset&&r===this.limit?i+=r===this.markedOffset?"!":"|":r===this.offset?i+=r===this.markedOffset?"[":"<":r===this.limit?i+=r===this.markedOffset?"]":">":i+=r===this.markedOffset?"'":t||0!==r&&r!==n?" ":""}if(t&&" "!==i){for(;i.length<51;)i+=" "
s+=i+o+"\n"}return t?s:i},o.fromDebug=function(t,e,r){for(var n,i,s=t.length,a=new o((s+1)/3|0,e,r),f=0,u=0,c=!1,h=!1,l=!1,p=!1,d=!1;f<s;){switch(n=t.charAt(f++)){case"!":if(!r){if(h||l||p){d=!0
break}h=l=p=!0}a.offset=a.markedOffset=a.limit=u,c=!1
break
case"|":if(!r){if(h||p){d=!0
break}h=p=!0}a.offset=a.limit=u,c=!1
break
case"[":if(!r){if(h||l){d=!0
break}h=l=!0}a.offset=a.markedOffset=u,c=!1
break
case"<":if(!r){if(h){d=!0
break}h=!0}a.offset=u,c=!1
break
case"]":if(!r){if(p||l){d=!0
break}p=l=!0}a.limit=a.markedOffset=u,c=!1
break
case">":if(!r){if(p){d=!0
break}p=!0}a.limit=u,c=!1
break
case"'":if(!r){if(l){d=!0
break}l=!0}a.markedOffset=u,c=!1
break
case" ":c=!1
break
default:if(!r&&c){d=!0
break}if(i=parseInt(n+t.charAt(f++),16),!r&&(isNaN(i)||i<0||i>255))throw TypeError("Illegal str: Not a debug encoded string")
a.view[u++]=i,c=!0}if(d)throw TypeError("Illegal str: Invalid symbol at "+f)}if(!r){if(!h||!p)throw TypeError("Illegal str: Missing offset or limit")
if(u<a.buffer.byteLength)throw TypeError("Illegal str: Not a debug encoded string (is it hex?) "+u+" < "+s)}return a},s.toHex=function(t,e){if(t=void 0===t?this.offset:t,e=void 0===e?this.limit:e,!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal begin: Not an integer")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal end: Not an integer")
if(e>>>=0,t<0||t>e||e>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+t+" <= "+e+" <= "+this.buffer.byteLength)}for(var r,n=new Array(e-t);t<e;)r=this.view[t++],r<16?n.push("0",r.toString(16)):n.push(r.toString(16))
return n.join("")},o.fromHex=function(t,e,r){if(!r){if("string"!=typeof t)throw TypeError("Illegal str: Not a string")
if(t.length%2!=0)throw TypeError("Illegal str: Length not a multiple of 2")}for(var n,i=t.length,s=new o(i/2|0,e),a=0,f=0;a<i;a+=2){if(n=parseInt(t.substring(a,a+2),16),!r&&(!isFinite(n)||n<0||n>255))throw TypeError("Illegal str: Contains non-hex characters")
s.view[f++]=n}return s.limit=f,s}
var c=function(){var t={}
return t.MAX_CODEPOINT=1114111,t.encodeUTF8=function(t,e){var r=null
for("number"==typeof t&&(r=t,t=function(){return null});null!==r||null!==(r=t());)r<128?e(127&r):r<2048?(e(r>>6&31|192),e(63&r|128)):r<65536?(e(r>>12&15|224),e(r>>6&63|128),e(63&r|128)):(e(r>>18&7|240),e(r>>12&63|128),e(r>>6&63|128),e(63&r|128)),r=null},t.decodeUTF8=function(t,e){for(var r,n,i,o,s=function(t){t=t.slice(0,t.indexOf(null))
var e=Error(t.toString())
throw e.name="TruncatedError",e.bytes=t,e};null!==(r=t());)if(0==(128&r))e(r)
else if(192==(224&r))null===(n=t())&&s([r,n]),e((31&r)<<6|63&n)
else if(224==(240&r))(null===(n=t())||null===(i=t()))&&s([r,n,i]),e((15&r)<<12|(63&n)<<6|63&i)
else{if(240!=(248&r))throw RangeError("Illegal starting byte: "+r);(null===(n=t())||null===(i=t())||null===(o=t()))&&s([r,n,i,o]),e((7&r)<<18|(63&n)<<12|(63&i)<<6|63&o)}},t.UTF16toUTF8=function(t,e){for(var r,n=null;;){if(null===(r=null!==n?n:t()))break
r>=55296&&r<=57343&&null!==(n=t())&&n>=56320&&n<=57343?(e(1024*(r-55296)+n-56320+65536),n=null):e(r)}null!==n&&e(n)},t.UTF8toUTF16=function(t,e){var r=null
for("number"==typeof t&&(r=t,t=function(){return null});null!==r||null!==(r=t());)r<=65535?e(r):(r-=65536,e(55296+(r>>10)),e(r%1024+56320)),r=null},t.encodeUTF16toUTF8=function(e,r){t.UTF16toUTF8(e,function(e){t.encodeUTF8(e,r)})},t.decodeUTF8toUTF16=function(e,r){t.decodeUTF8(e,function(e){t.UTF8toUTF16(e,r)})},t.calculateCodePoint=function(t){return t<128?1:t<2048?2:t<65536?3:4},t.calculateUTF8=function(t){for(var e,r=0;null!==(e=t());)r+=e<128?1:e<2048?2:e<65536?3:4
return r},t.calculateUTF16asUTF8=function(e){var r=0,n=0
return t.UTF16toUTF8(e,function(t){++r,n+=t<128?1:t<2048?2:t<65536?3:4}),[r,n]},t}()
return s.toUTF8=function(t,e){if(void 0===t&&(t=this.offset),void 0===e&&(e=this.limit),!this.noAssert){if("number"!=typeof t||t%1!=0)throw TypeError("Illegal begin: Not an integer")
if(t>>>=0,"number"!=typeof e||e%1!=0)throw TypeError("Illegal end: Not an integer")
if(e>>>=0,t<0||t>e||e>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+t+" <= "+e+" <= "+this.buffer.byteLength)}var n
try{c.decodeUTF8toUTF16(function(){return t<e?this.view[t++]:null}.bind(this),n=r())}catch(r){if(t!==e)throw RangeError("Illegal range: Truncated data, "+t+" != "+e)}return n()},o.fromUTF8=function(t,r,n){if(!n&&"string"!=typeof t)throw TypeError("Illegal str: Not a string")
var i=new o(c.calculateUTF16asUTF8(e(t),!0)[1],r,n),s=0
return c.encodeUTF16toUTF8(e(t),function(t){i.view[s++]=t}),i.limit=s,i},o})},{long:90}],47:[function(t,e,r){function n(t){o.call(this),this.hashMode="string"==typeof t,this.hashMode?this[t]=this._finalOrDigest:this.final=this._finalOrDigest,this._final&&(this.__final=this._final,this._final=null),this._decoder=null,this._encoding=null}var i=t("safe-buffer").Buffer,o=t("stream").Transform,s=t("string_decoder").StringDecoder
t("inherits")(n,o),n.prototype.update=function(t,e,r){"string"==typeof t&&(t=i.from(t,e))
var n=this._update(t)
return this.hashMode?this:(r&&(n=this._toString(n,r)),n)},n.prototype.setAutoPadding=function(){},n.prototype.getAuthTag=function(){throw new Error("trying to get auth tag in unsupported state")},n.prototype.setAuthTag=function(){throw new Error("trying to set auth tag in unsupported state")},n.prototype.setAAD=function(){throw new Error("trying to set aad in unsupported state")},n.prototype._transform=function(t,e,r){var n
try{this.hashMode?this._update(t):this.push(this._update(t))}catch(t){n=t}finally{r(n)}},n.prototype._flush=function(t){var e
try{this.push(this.__final())}catch(t){e=t}t(e)},n.prototype._finalOrDigest=function(t){var e=this.__final()||i.alloc(0)
return t&&(e=this._toString(e,t,!0)),e},n.prototype._toString=function(t,e,r){if(this._decoder||(this._decoder=new s(e),this._encoding=e),this._encoding!==e)throw new Error("can't switch encodings")
var n=this._decoder.write(t)
return r&&(n+=this._decoder.end()),n},e.exports=n},{inherits:89,"safe-buffer":92,stream:128,string_decoder:129}],48:[function(t,e,r){(function(r){"use strict"
function n(t){u.call(this,"digest"),this._hash=t,this.buffers=[]}function i(t){u.call(this,"digest"),this._hash=t}var o=t("inherits"),s=t("./md5"),a=t("ripemd160"),f=t("sha.js"),u=t("cipher-base")
o(n,u),n.prototype._update=function(t){this.buffers.push(t)},n.prototype._final=function(){var t=r.concat(this.buffers),e=this._hash(t)
return this.buffers=null,e},o(i,u),i.prototype._update=function(t){this._hash.update(t)},i.prototype._final=function(){return this._hash.digest()},e.exports=function(t){return t=t.toLowerCase(),"md5"===t?new n(s):new i("rmd160"===t||"ripemd160"===t?new a:f(t))}}).call(this,t("buffer").Buffer)},{"./md5":50,buffer:105,"cipher-base":47,inherits:89,ripemd160:91,"sha.js":95}],49:[function(t,e,r){(function(t){"use strict"
function r(e){if(e.length%n!=0){var r=e.length+(n-e.length%n)
e=t.concat([e,i],r)}for(var o=new Array(e.length>>>2),s=0,a=0;s<e.length;s+=n,a++)o[a]=e.readInt32LE(s)
return o}var n=4,i=new t(n)
i.fill(0)
e.exports=function(e,n){var i=n(r(e),8*e.length)
e=new t(16)
for(var o=0;o<i.length;o++)e.writeInt32LE(i[o],o<<2,!0)
return e}}).call(this,t("buffer").Buffer)},{buffer:105}],50:[function(t,e,r){"use strict"
function n(t,e){t[e>>5]|=128<<e%32,t[14+(e+64>>>9<<4)]=e
for(var r=1732584193,n=-271733879,i=-1732584194,c=271733878,h=0;h<t.length;h+=16){var l=r,p=n,d=i,_=c
r=o(r,n,i,c,t[h+0],7,-680876936),c=o(c,r,n,i,t[h+1],12,-389564586),i=o(i,c,r,n,t[h+2],17,606105819),n=o(n,i,c,r,t[h+3],22,-1044525330),r=o(r,n,i,c,t[h+4],7,-176418897),c=o(c,r,n,i,t[h+5],12,1200080426),i=o(i,c,r,n,t[h+6],17,-1473231341),n=o(n,i,c,r,t[h+7],22,-45705983),r=o(r,n,i,c,t[h+8],7,1770035416),c=o(c,r,n,i,t[h+9],12,-1958414417),i=o(i,c,r,n,t[h+10],17,-42063),n=o(n,i,c,r,t[h+11],22,-1990404162),r=o(r,n,i,c,t[h+12],7,1804603682),c=o(c,r,n,i,t[h+13],12,-40341101),i=o(i,c,r,n,t[h+14],17,-1502002290),n=o(n,i,c,r,t[h+15],22,1236535329),r=s(r,n,i,c,t[h+1],5,-165796510),c=s(c,r,n,i,t[h+6],9,-1069501632),i=s(i,c,r,n,t[h+11],14,643717713),n=s(n,i,c,r,t[h+0],20,-373897302),r=s(r,n,i,c,t[h+5],5,-701558691),c=s(c,r,n,i,t[h+10],9,38016083),i=s(i,c,r,n,t[h+15],14,-660478335),n=s(n,i,c,r,t[h+4],20,-405537848),r=s(r,n,i,c,t[h+9],5,568446438),c=s(c,r,n,i,t[h+14],9,-1019803690),i=s(i,c,r,n,t[h+3],14,-187363961),n=s(n,i,c,r,t[h+8],20,1163531501),r=s(r,n,i,c,t[h+13],5,-1444681467),c=s(c,r,n,i,t[h+2],9,-51403784),i=s(i,c,r,n,t[h+7],14,1735328473),n=s(n,i,c,r,t[h+12],20,-1926607734),r=a(r,n,i,c,t[h+5],4,-378558),c=a(c,r,n,i,t[h+8],11,-2022574463),i=a(i,c,r,n,t[h+11],16,1839030562),n=a(n,i,c,r,t[h+14],23,-35309556),r=a(r,n,i,c,t[h+1],4,-1530992060),c=a(c,r,n,i,t[h+4],11,1272893353),i=a(i,c,r,n,t[h+7],16,-155497632),n=a(n,i,c,r,t[h+10],23,-1094730640),r=a(r,n,i,c,t[h+13],4,681279174),c=a(c,r,n,i,t[h+0],11,-358537222),i=a(i,c,r,n,t[h+3],16,-722521979),n=a(n,i,c,r,t[h+6],23,76029189),r=a(r,n,i,c,t[h+9],4,-640364487),c=a(c,r,n,i,t[h+12],11,-421815835),i=a(i,c,r,n,t[h+15],16,530742520),n=a(n,i,c,r,t[h+2],23,-995338651),r=f(r,n,i,c,t[h+0],6,-198630844),c=f(c,r,n,i,t[h+7],10,1126891415),i=f(i,c,r,n,t[h+14],15,-1416354905),n=f(n,i,c,r,t[h+5],21,-57434055),r=f(r,n,i,c,t[h+12],6,1700485571),c=f(c,r,n,i,t[h+3],10,-1894986606),i=f(i,c,r,n,t[h+10],15,-1051523),n=f(n,i,c,r,t[h+1],21,-2054922799),r=f(r,n,i,c,t[h+8],6,1873313359),c=f(c,r,n,i,t[h+15],10,-30611744),i=f(i,c,r,n,t[h+6],15,-1560198380),n=f(n,i,c,r,t[h+13],21,1309151649),r=f(r,n,i,c,t[h+4],6,-145523070),c=f(c,r,n,i,t[h+11],10,-1120210379),i=f(i,c,r,n,t[h+2],15,718787259),n=f(n,i,c,r,t[h+9],21,-343485551),r=u(r,l),n=u(n,p),i=u(i,d),c=u(c,_)}return[r,n,i,c]}function i(t,e,r,n,i,o){return u(c(u(u(e,t),u(n,o)),i),r)}function o(t,e,r,n,o,s,a){return i(e&r|~e&n,t,e,o,s,a)}function s(t,e,r,n,o,s,a){return i(e&n|r&~n,t,e,o,s,a)}function a(t,e,r,n,o,s,a){return i(e^r^n,t,e,o,s,a)}function f(t,e,r,n,o,s,a){return i(r^(e|~n),t,e,o,s,a)}function u(t,e){var r=(65535&t)+(65535&e)
return(t>>16)+(e>>16)+(r>>16)<<16|65535&r}function c(t,e){return t<<e|t>>>32-e}var h=t("./make-hash")
e.exports=function(t){return h(t,n)}},{"./make-hash":49}],51:[function(t,e,r){"use strict"
function n(t,e){s.call(this,"digest"),"string"==typeof e&&(e=a.from(e))
var r="sha512"===t||"sha384"===t?128:64
if(this._alg=t,this._key=e,e.length>r){e=("rmd160"===t?new u:c(t)).update(e).digest()}else e.length<r&&(e=a.concat([e,h],r))
for(var n=this._ipad=a.allocUnsafe(r),i=this._opad=a.allocUnsafe(r),o=0;o<r;o++)n[o]=54^e[o],i[o]=92^e[o]
this._hash="rmd160"===t?new u:c(t),this._hash.update(n)}var i=t("inherits"),o=t("./legacy"),s=t("cipher-base"),a=t("safe-buffer").Buffer,f=t("create-hash/md5"),u=t("ripemd160"),c=t("sha.js"),h=a.alloc(128)
i(n,s),n.prototype._update=function(t){this._hash.update(t)},n.prototype._final=function(){var t=this._hash.digest()
return("rmd160"===this._alg?new u:c(this._alg)).update(this._opad).update(t).digest()},e.exports=function(t,e){return t=t.toLowerCase(),"rmd160"===t||"ripemd160"===t?new n("rmd160",e):"md5"===t?new o(f,e):new n(t,e)}},{"./legacy":52,"cipher-base":47,"create-hash/md5":50,inherits:89,ripemd160:91,"safe-buffer":92,"sha.js":95}],52:[function(t,e,r){"use strict"
function n(t,e){s.call(this,"digest"),"string"==typeof e&&(e=o.from(e)),this._alg=t,this._key=e,e.length>f?e=t(e):e.length<f&&(e=o.concat([e,a],f))
for(var r=this._ipad=o.allocUnsafe(f),n=this._opad=o.allocUnsafe(f),i=0;i<f;i++)r[i]=54^e[i],n[i]=92^e[i]
this._hash=[r]}var i=t("inherits"),o=t("safe-buffer").Buffer,s=t("cipher-base"),a=o.alloc(128),f=64
i(n,s),n.prototype._update=function(t){this._hash.push(t)},n.prototype._final=function(){var t=this._alg(o.concat(this._hash))
return this._alg(o.concat([this._opad,t]))},e.exports=n},{"cipher-base":47,inherits:89,"safe-buffer":92}],53:[function(t,e,r){!function(n,i,o){"object"==typeof r?e.exports=r=i(t("./core"),t("./enc-base64"),t("./md5"),t("./evpkdf"),t("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],i):i(n.CryptoJS)}(this,function(t){return function(){var e=t,r=e.lib,n=r.BlockCipher,i=e.algo,o=[],s=[],a=[],f=[],u=[],c=[],h=[],l=[],p=[],d=[]
!function(){for(var t=[],e=0;e<256;e++)t[e]=e<128?e<<1:e<<1^283
for(var r=0,n=0,e=0;e<256;e++){var i=n^n<<1^n<<2^n<<3^n<<4
i=i>>>8^255&i^99,o[r]=i,s[i]=r
var _=t[r],g=t[_],y=t[g],v=257*t[i]^16843008*i
a[r]=v<<24|v>>>8,f[r]=v<<16|v>>>16,u[r]=v<<8|v>>>24,c[r]=v
var v=16843009*y^65537*g^257*_^16843008*r
h[i]=v<<24|v>>>8,l[i]=v<<16|v>>>16,p[i]=v<<8|v>>>24,d[i]=v,r?(r=_^t[t[t[y^_]]],n^=t[t[n]]):r=n=1}}()
var _=[0,1,2,4,8,16,32,64,128,27,54],g=i.AES=n.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,r=t.sigBytes/4,n=this._nRounds=r+6,i=4*(n+1),s=this._keySchedule=[],a=0;a<i;a++)if(a<r)s[a]=e[a]
else{var f=s[a-1]
a%r?r>6&&a%r==4&&(f=o[f>>>24]<<24|o[f>>>16&255]<<16|o[f>>>8&255]<<8|o[255&f]):(f=f<<8|f>>>24,f=o[f>>>24]<<24|o[f>>>16&255]<<16|o[f>>>8&255]<<8|o[255&f],f^=_[a/r|0]<<24),s[a]=s[a-r]^f}for(var u=this._invKeySchedule=[],c=0;c<i;c++){var a=i-c
if(c%4)var f=s[a]
else var f=s[a-4]
u[c]=c<4||a<=4?f:h[o[f>>>24]]^l[o[f>>>16&255]]^p[o[f>>>8&255]]^d[o[255&f]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,a,f,u,c,o)},decryptBlock:function(t,e){var r=t[e+1]
t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,h,l,p,d,s)
var r=t[e+1]
t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,n,i,o,s,a){for(var f=this._nRounds,u=t[e]^r[0],c=t[e+1]^r[1],h=t[e+2]^r[2],l=t[e+3]^r[3],p=4,d=1;d<f;d++){var _=n[u>>>24]^i[c>>>16&255]^o[h>>>8&255]^s[255&l]^r[p++],g=n[c>>>24]^i[h>>>16&255]^o[l>>>8&255]^s[255&u]^r[p++],y=n[h>>>24]^i[l>>>16&255]^o[u>>>8&255]^s[255&c]^r[p++],v=n[l>>>24]^i[u>>>16&255]^o[c>>>8&255]^s[255&h]^r[p++]
u=_,c=g,h=y,l=v}var _=(a[u>>>24]<<24|a[c>>>16&255]<<16|a[h>>>8&255]<<8|a[255&l])^r[p++],g=(a[c>>>24]<<24|a[h>>>16&255]<<16|a[l>>>8&255]<<8|a[255&u])^r[p++],y=(a[h>>>24]<<24|a[l>>>16&255]<<16|a[u>>>8&255]<<8|a[255&c])^r[p++],v=(a[l>>>24]<<24|a[u>>>16&255]<<16|a[c>>>8&255]<<8|a[255&h])^r[p++]
t[e]=_,t[e+1]=g,t[e+2]=y,t[e+3]=v},keySize:8})
e.AES=n._createHelper(g)}(),t.AES})},{"./cipher-core":54,"./core":55,"./enc-base64":56,"./evpkdf":58,"./md5":60}],54:[function(t,e,r){!function(n,i,o){"object"==typeof r?e.exports=r=i(t("./core"),t("./evpkdf")):"function"==typeof define&&define.amd?define(["./core","./evpkdf"],i):i(n.CryptoJS)}(this,function(t){t.lib.Cipher||function(e){var r=t,n=r.lib,i=n.Base,o=n.WordArray,s=n.BufferedBlockAlgorithm,a=r.enc,f=(a.Utf8,a.Base64),u=r.algo,c=u.EvpKDF,h=n.Cipher=s.extend({cfg:i.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){s.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function t(t){return"string"==typeof t?S:m}return function(e){return{encrypt:function(r,n,i){return t(n).encrypt(e,r,n,i)},decrypt:function(r,n,i){return t(n).decrypt(e,r,n,i)}}}}()}),l=(n.StreamCipher=h.extend({_doFinalize:function(){return this._process(!0)},blockSize:1}),r.mode={}),p=n.BlockCipherMode=i.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),d=l.CBC=function(){function t(t,r,n){var i=this._iv
if(i){var o=i
this._iv=e}else var o=this._prevBlock
for(var s=0;s<n;s++)t[r+s]^=o[s]}var r=p.extend()
return r.Encryptor=r.extend({processBlock:function(e,r){var n=this._cipher,i=n.blockSize
t.call(this,e,r,i),n.encryptBlock(e,r),this._prevBlock=e.slice(r,r+i)}}),r.Decryptor=r.extend({processBlock:function(e,r){var n=this._cipher,i=n.blockSize,o=e.slice(r,r+i)
n.decryptBlock(e,r),t.call(this,e,r,i),this._prevBlock=o}}),r}(),_=r.pad={},g=_.Pkcs7={pad:function(t,e){for(var r=4*e,n=r-t.sigBytes%r,i=n<<24|n<<16|n<<8|n,s=[],a=0;a<n;a+=4)s.push(i)
var f=o.create(s,n)
t.concat(f)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2]
t.sigBytes-=e}},y=(n.BlockCipher=h.extend({cfg:h.cfg.extend({mode:d,padding:g}),reset:function(){h.reset.call(this)
var t=this.cfg,e=t.iv,r=t.mode
if(this._xformMode==this._ENC_XFORM_MODE)var n=r.createEncryptor
else{var n=r.createDecryptor
this._minBufferSize=1}this._mode&&this._mode.__creator==n?this._mode.init(this,e&&e.words):(this._mode=n.call(r,this,e&&e.words),this._mode.__creator=n)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t=this.cfg.padding
if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize)
var e=this._process(!0)}else{var e=this._process(!0)
t.unpad(e)}return e},blockSize:4}),n.CipherParams=i.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),v=r.format={},b=v.OpenSSL={stringify:function(t){var e=t.ciphertext,r=t.salt
if(r)var n=o.create([1398893684,1701076831]).concat(r).concat(e)
else var n=e
return n.toString(f)},parse:function(t){var e=f.parse(t),r=e.words
if(1398893684==r[0]&&1701076831==r[1]){var n=o.create(r.slice(2,4))
r.splice(0,4),e.sigBytes-=16}return y.create({ciphertext:e,salt:n})}},m=n.SerializableCipher=i.extend({cfg:i.extend({format:b}),encrypt:function(t,e,r,n){n=this.cfg.extend(n)
var i=t.createEncryptor(r,n),o=i.finalize(e),s=i.cfg
return y.create({ciphertext:o,key:r,iv:s.iv,algorithm:t,mode:s.mode,padding:s.padding,blockSize:t.blockSize,formatter:n.format})},decrypt:function(t,e,r,n){return n=this.cfg.extend(n),e=this._parse(e,n.format),t.createDecryptor(r,n).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),w=r.kdf={},E=w.OpenSSL={execute:function(t,e,r,n){n||(n=o.random(8))
var i=c.create({keySize:e+r}).compute(t,n),s=o.create(i.words.slice(e),4*r)
return i.sigBytes=4*e,y.create({key:i,iv:s,salt:n})}},S=n.PasswordBasedCipher=m.extend({cfg:m.cfg.extend({kdf:E}),encrypt:function(t,e,r,n){n=this.cfg.extend(n)
var i=n.kdf.execute(r,t.keySize,t.ivSize)
n.iv=i.iv
var o=m.encrypt.call(this,t,e,i.key,n)
return o.mixIn(i),o},decrypt:function(t,e,r,n){n=this.cfg.extend(n),e=this._parse(e,n.format)
var i=n.kdf.execute(r,t.keySize,t.ivSize,e.salt)
return n.iv=i.iv,m.decrypt.call(this,t,e,i.key,n)}})}()})},{"./core":55,"./evpkdf":58}],55:[function(t,e,r){!function(t,n){"object"==typeof r?e.exports=r=n():"function"==typeof define&&define.amd?define([],n):t.CryptoJS=n()}(this,function(){var t=t||function(t,e){var r=Object.create||function(){function t(){}return function(e){var r
return t.prototype=e,r=new t,t.prototype=null,r}}(),n={},i=n.lib={},o=i.Base=function(){return{extend:function(t){var e=r(this)
return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),e.init.prototype=e,e.$super=this,e},create:function(){var t=this.extend()
return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])
t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=i.WordArray=o.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=void 0!=e?e:4*t.length},toString:function(t){return(t||f).stringify(this)},concat:function(t){var e=this.words,r=t.words,n=this.sigBytes,i=t.sigBytes
if(this.clamp(),n%4)for(var o=0;o<i;o++){var s=r[o>>>2]>>>24-o%4*8&255
e[n+o>>>2]|=s<<24-(n+o)%4*8}else for(var o=0;o<i;o+=4)e[n+o>>>2]=r[o>>>2]
return this.sigBytes+=i,this},clamp:function(){var e=this.words,r=this.sigBytes
e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=o.clone.call(this)
return t.words=this.words.slice(0),t},random:function(e){for(var r,n=[],i=0;i<e;i+=4){var o=function(e){var e=e,r=987654321,n=4294967295
return function(){r=36969*(65535&r)+(r>>16)&n,e=18e3*(65535&e)+(e>>16)&n
var i=(r<<16)+e&n
return i/=4294967296,(i+=.5)*(t.random()>.5?1:-1)}}(4294967296*(r||t.random()))
r=987654071*o(),n.push(4294967296*o()|0)}return new s.init(n,e)}}),a=n.enc={},f=a.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255
n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4
return new s.init(r,e/2)}},u=a.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255
n.push(String.fromCharCode(o))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8
return new s.init(r,e)}},c=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},h=i.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=c.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r=this._data,n=r.words,i=r.sigBytes,o=this.blockSize,a=4*o,f=i/a
f=e?t.ceil(f):t.max((0|f)-this._minBufferSize,0)
var u=f*o,c=t.min(4*u,i)
if(u){for(var h=0;h<u;h+=o)this._doProcessBlock(n,h)
var l=n.splice(0,u)
r.sigBytes-=c}return new s.init(l,c)},clone:function(){var t=o.clone.call(this)
return t._data=this._data.clone(),t},_minBufferSize:0}),l=(i.Hasher=h.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){h.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new l.HMAC.init(t,r).finalize(e)}}}),n.algo={})
return n}(Math)
return t})},{}],56:[function(t,e,r){!function(n,i){"object"==typeof r?e.exports=r=i(t("./core")):"function"==typeof define&&define.amd?define(["./core"],i):i(n.CryptoJS)}(this,function(t){return function(){function e(t,e,r){for(var n=[],o=0,s=0;s<e;s++)if(s%4){var a=r[t.charCodeAt(s-1)]<<s%4*2,f=r[t.charCodeAt(s)]>>>6-s%4*2
n[o>>>2]|=(a|f)<<24-o%4*8,o++}return i.create(n,o)}var r=t,n=r.lib,i=n.WordArray,o=r.enc
o.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,n=this._map
t.clamp()
for(var i=[],o=0;o<r;o+=3)for(var s=e[o>>>2]>>>24-o%4*8&255,a=e[o+1>>>2]>>>24-(o+1)%4*8&255,f=e[o+2>>>2]>>>24-(o+2)%4*8&255,u=s<<16|a<<8|f,c=0;c<4&&o+.75*c<r;c++)i.push(n.charAt(u>>>6*(3-c)&63))
var h=n.charAt(64)
if(h)for(;i.length%4;)i.push(h)
return i.join("")},parse:function(t){var r=t.length,n=this._map,i=this._reverseMap
if(!i){i=this._reverseMap=[]
for(var o=0;o<n.length;o++)i[n.charCodeAt(o)]=o}var s=n.charAt(64)
if(s){var a=t.indexOf(s);-1!==a&&(r=a)}return e(t,r,i)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),t.enc.Base64})},{"./core":55}],57:[function(t,e,r){!function(n,i){"object"==typeof r?e.exports=r=i(t("./core")):"function"==typeof define&&define.amd?define(["./core"],i):i(n.CryptoJS)}(this,function(t){return t.enc.Hex})},{"./core":55}],58:[function(t,e,r){!function(n,i,o){"object"==typeof r?e.exports=r=i(t("./core"),t("./sha1"),t("./hmac")):"function"==typeof define&&define.amd?define(["./core","./sha1","./hmac"],i):i(n.CryptoJS)}(this,function(t){return function(){var e=t,r=e.lib,n=r.Base,i=r.WordArray,o=e.algo,s=o.MD5,a=o.EvpKDF=n.extend({cfg:n.extend({keySize:4,hasher:s,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=this.cfg,n=r.hasher.create(),o=i.create(),s=o.words,a=r.keySize,f=r.iterations;s.length<a;){u&&n.update(u)
var u=n.update(t).finalize(e)
n.reset()
for(var c=1;c<f;c++)u=n.finalize(u),n.reset()
o.concat(u)}return o.sigBytes=4*a,o}})
e.EvpKDF=function(t,e,r){return a.create(r).compute(t,e)}}(),t.EvpKDF})},{"./core":55,"./hmac":59,"./sha1":61}],59:[function(t,e,r){!function(n,i){"object"==typeof r?e.exports=r=i(t("./core")):"function"==typeof define&&define.amd?define(["./core"],i):i(n.CryptoJS)}(this,function(t){!function(){var e=t,r=e.lib,n=r.Base,i=e.enc,o=i.Utf8,s=e.algo
s.HMAC=n.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=o.parse(e))
var r=t.blockSize,n=4*r
e.sigBytes>n&&(e=t.finalize(e)),e.clamp()
for(var i=this._oKey=e.clone(),s=this._iKey=e.clone(),a=i.words,f=s.words,u=0;u<r;u++)a[u]^=1549556828,f[u]^=909522486
i.sigBytes=s.sigBytes=n,this.reset()},reset:function(){var t=this._hasher
t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,r=e.finalize(t)
return e.reset(),e.finalize(this._oKey.clone().concat(r))}})}()})},{"./core":55}],60:[function(t,e,r){!function(n,i){"object"==typeof r?e.exports=r=i(t("./core")):"function"==typeof define&&define.amd?define(["./core"],i):i(n.CryptoJS)}(this,function(t){return function(e){function r(t,e,r,n,i,o,s){var a=t+(e&r|~e&n)+i+s
return(a<<o|a>>>32-o)+e}function n(t,e,r,n,i,o,s){var a=t+(e&n|r&~n)+i+s
return(a<<o|a>>>32-o)+e}function i(t,e,r,n,i,o,s){var a=t+(e^r^n)+i+s
return(a<<o|a>>>32-o)+e}function o(t,e,r,n,i,o,s){var a=t+(r^(e|~n))+i+s
return(a<<o|a>>>32-o)+e}var s=t,a=s.lib,f=a.WordArray,u=a.Hasher,c=s.algo,h=[]
!function(){for(var t=0;t<64;t++)h[t]=4294967296*e.abs(e.sin(t+1))|0}()
var l=c.MD5=u.extend({_doReset:function(){this._hash=new f.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var s=0;s<16;s++){var a=e+s,f=t[a]
t[a]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}var u=this._hash.words,c=t[e+0],l=t[e+1],p=t[e+2],d=t[e+3],_=t[e+4],g=t[e+5],y=t[e+6],v=t[e+7],b=t[e+8],m=t[e+9],w=t[e+10],E=t[e+11],S=t[e+12],B=t[e+13],x=t[e+14],I=t[e+15],k=u[0],T=u[1],A=u[2],j=u[3]
k=r(k,T,A,j,c,7,h[0]),j=r(j,k,T,A,l,12,h[1]),A=r(A,j,k,T,p,17,h[2]),T=r(T,A,j,k,d,22,h[3]),k=r(k,T,A,j,_,7,h[4]),j=r(j,k,T,A,g,12,h[5]),A=r(A,j,k,T,y,17,h[6]),T=r(T,A,j,k,v,22,h[7]),k=r(k,T,A,j,b,7,h[8]),j=r(j,k,T,A,m,12,h[9]),A=r(A,j,k,T,w,17,h[10]),T=r(T,A,j,k,E,22,h[11]),k=r(k,T,A,j,S,7,h[12]),j=r(j,k,T,A,B,12,h[13]),A=r(A,j,k,T,x,17,h[14]),T=r(T,A,j,k,I,22,h[15]),k=n(k,T,A,j,l,5,h[16]),j=n(j,k,T,A,y,9,h[17]),A=n(A,j,k,T,E,14,h[18]),T=n(T,A,j,k,c,20,h[19]),k=n(k,T,A,j,g,5,h[20]),j=n(j,k,T,A,w,9,h[21]),A=n(A,j,k,T,I,14,h[22]),T=n(T,A,j,k,_,20,h[23]),k=n(k,T,A,j,m,5,h[24]),j=n(j,k,T,A,x,9,h[25]),A=n(A,j,k,T,d,14,h[26]),T=n(T,A,j,k,b,20,h[27]),k=n(k,T,A,j,B,5,h[28]),j=n(j,k,T,A,p,9,h[29]),A=n(A,j,k,T,v,14,h[30]),T=n(T,A,j,k,S,20,h[31]),k=i(k,T,A,j,g,4,h[32]),j=i(j,k,T,A,b,11,h[33]),A=i(A,j,k,T,E,16,h[34]),T=i(T,A,j,k,x,23,h[35]),k=i(k,T,A,j,l,4,h[36]),j=i(j,k,T,A,_,11,h[37]),A=i(A,j,k,T,v,16,h[38]),T=i(T,A,j,k,w,23,h[39]),k=i(k,T,A,j,B,4,h[40]),j=i(j,k,T,A,c,11,h[41]),A=i(A,j,k,T,d,16,h[42]),T=i(T,A,j,k,y,23,h[43]),k=i(k,T,A,j,m,4,h[44]),j=i(j,k,T,A,S,11,h[45]),A=i(A,j,k,T,I,16,h[46]),T=i(T,A,j,k,p,23,h[47]),k=o(k,T,A,j,c,6,h[48]),j=o(j,k,T,A,v,10,h[49]),A=o(A,j,k,T,x,15,h[50]),T=o(T,A,j,k,g,21,h[51]),k=o(k,T,A,j,S,6,h[52]),j=o(j,k,T,A,d,10,h[53]),A=o(A,j,k,T,w,15,h[54]),T=o(T,A,j,k,l,21,h[55]),k=o(k,T,A,j,b,6,h[56]),j=o(j,k,T,A,I,10,h[57]),A=o(A,j,k,T,y,15,h[58]),T=o(T,A,j,k,B,21,h[59]),k=o(k,T,A,j,_,6,h[60]),j=o(j,k,T,A,E,10,h[61]),A=o(A,j,k,T,p,15,h[62]),T=o(T,A,j,k,m,21,h[63]),u[0]=u[0]+k|0,u[1]=u[1]+T|0,u[2]=u[2]+A|0,u[3]=u[3]+j|0},_doFinalize:function(){var t=this._data,r=t.words,n=8*this._nDataBytes,i=8*t.sigBytes
r[i>>>5]|=128<<24-i%32
var o=e.floor(n/4294967296),s=n
r[15+(i+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),r[14+(i+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),t.sigBytes=4*(r.length+1),this._process()
for(var a=this._hash,f=a.words,u=0;u<4;u++){var c=f[u]
f[u]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}return a},clone:function(){var t=u.clone.call(this)
return t._hash=this._hash.clone(),t}})
s.MD5=u._createHelper(l),s.HmacMD5=u._createHmacHelper(l)}(Math),t.MD5})},{"./core":55}],61:[function(t,e,r){!function(n,i){"object"==typeof r?e.exports=r=i(t("./core")):"function"==typeof define&&define.amd?define(["./core"],i):i(n.CryptoJS)}(this,function(t){return function(){var e=t,r=e.lib,n=r.WordArray,i=r.Hasher,o=e.algo,s=[],a=o.SHA1=i.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=this._hash.words,n=r[0],i=r[1],o=r[2],a=r[3],f=r[4],u=0;u<80;u++){if(u<16)s[u]=0|t[e+u]
else{var c=s[u-3]^s[u-8]^s[u-14]^s[u-16]
s[u]=c<<1|c>>>31}var h=(n<<5|n>>>27)+f+s[u]
h+=u<20?1518500249+(i&o|~i&a):u<40?1859775393+(i^o^a):u<60?(i&o|i&a|o&a)-1894007588:(i^o^a)-899497514,f=a,a=o,o=i<<30|i>>>2,i=n,n=h}r[0]=r[0]+n|0,r[1]=r[1]+i|0,r[2]=r[2]+o|0,r[3]=r[3]+a|0,r[4]=r[4]+f|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,n=8*t.sigBytes
return e[n>>>5]|=128<<24-n%32,e[14+(n+64>>>9<<4)]=Math.floor(r/4294967296),e[15+(n+64>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=i.clone.call(this)
return t._hash=this._hash.clone(),t}})
e.SHA1=i._createHelper(a),e.HmacSHA1=i._createHmacHelper(a)}(),t.SHA1})},{"./core":55}],62:[function(t,e,r){"use strict"
var n,i=t("es5-ext/object/assign"),o=t("es5-ext/object/normalize-options"),s=t("es5-ext/object/is-callable"),a=t("es5-ext/string/#/contains")
n=e.exports=function(t,e){var r,n,s,f,u
return arguments.length<2||"string"!=typeof t?(f=e,e=t,t=null):f=arguments[2],null==t?(r=s=!0,n=!1):(r=a.call(t,"c"),n=a.call(t,"e"),s=a.call(t,"w")),u={value:e,configurable:r,enumerable:n,writable:s},f?i(o(f),u):u},n.gs=function(t,e,r){var n,f,u,c
return"string"!=typeof t?(u=r,r=e,e=t,t=null):u=arguments[3],null==e?e=void 0:s(e)?null==r?r=void 0:s(r)||(u=r,r=void 0):(u=e,e=r=void 0),null==t?(n=!0,f=!1):(n=a.call(t,"c"),f=a.call(t,"e")),c={get:e,set:r,configurable:n,enumerable:f},u?i(o(u),c):c}},{"es5-ext/object/assign":72,"es5-ext/object/is-callable":75,"es5-ext/object/normalize-options":80,"es5-ext/string/#/contains":83}],63:[function(t,e,r){function n(t){return null===t||void 0===t}function i(t){return!(!t||"object"!=typeof t||"number"!=typeof t.length)&&("function"==typeof t.copy&&"function"==typeof t.slice&&!(t.length>0&&"number"!=typeof t[0]))}function o(t,e,r){var o,c
if(n(t)||n(e))return!1
if(t.prototype!==e.prototype)return!1
if(f(t))return!!f(e)&&(t=s.call(t),e=s.call(e),u(t,e,r))
if(i(t)){if(!i(e))return!1
if(t.length!==e.length)return!1
for(o=0;o<t.length;o++)if(t[o]!==e[o])return!1
return!0}try{var h=a(t),l=a(e)}catch(t){return!1}if(h.length!=l.length)return!1
for(h.sort(),l.sort(),o=h.length-1;o>=0;o--)if(h[o]!=l[o])return!1
for(o=h.length-1;o>=0;o--)if(c=h[o],!u(t[c],e[c],r))return!1
return typeof t==typeof e}var s=Array.prototype.slice,a=t("./lib/keys.js"),f=t("./lib/is_arguments.js"),u=e.exports=function(t,e,r){return r||(r={}),t===e||(t instanceof Date&&e instanceof Date?t.getTime()===e.getTime():!t||!e||"object"!=typeof t&&"object"!=typeof e?r.strict?t===e:t==e:o(t,e,r))}},{"./lib/is_arguments.js":64,"./lib/keys.js":65}],64:[function(t,e,r){function n(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function i(t){return t&&"object"==typeof t&&"number"==typeof t.length&&Object.prototype.hasOwnProperty.call(t,"callee")&&!Object.prototype.propertyIsEnumerable.call(t,"callee")||!1}var o="[object Arguments]"==function(){return Object.prototype.toString.call(arguments)}()
r=e.exports=o?n:i,r.supported=n,r.unsupported=i},{}],65:[function(t,e,r){function n(t){var e=[]
for(var r in t)e.push(r)
return e}r=e.exports="function"==typeof Object.keys?Object.keys:n,r.shim=n},{}],66:[function(t,e,r){function n(t,e,r,n,i,a,f){this.p=t,this.a=e,this.b=r,this.G=s.fromAffine(this,n,i),this.n=a,this.h=f,this.infinity=new s(this,null,null,o.ZERO),this.pOverFour=t.add(o.ONE).shiftRight(2),this.pLength=Math.floor((this.p.bitLength()+7)/8)}var i=t("assert"),o=t("bigi"),s=t("./point")
n.prototype.pointFromX=function(t,e){var r=e.pow(3).add(this.a.multiply(e)).add(this.b).mod(this.p),n=r.modPow(this.pOverFour,this.p),i=n
return n.isEven()^!t&&(i=this.p.subtract(i)),s.fromAffine(this,e,i)},n.prototype.isInfinity=function(t){return t===this.infinity||0===t.z.signum()&&0!==t.y.signum()},n.prototype.isOnCurve=function(t){if(this.isInfinity(t))return!0
var e=t.affineX,r=t.affineY,n=this.a,i=this.b,o=this.p
if(e.signum()<0||e.compareTo(o)>=0)return!1
if(r.signum()<0||r.compareTo(o)>=0)return!1
var s=r.square().mod(o),a=e.pow(3).add(n.multiply(e)).add(i).mod(o)
return s.equals(a)},n.prototype.validate=function(t){i(!this.isInfinity(t),"Point is at infinity"),i(this.isOnCurve(t),"Point is not on the curve")
var e=t.multiply(this.n)
return i(this.isInfinity(e),"Point is not a scalar multiple of G"),!0},e.exports=n},{"./point":70,assert:102,bigi:6}],67:[function(t,e,r){e.exports={secp128r1:{p:"fffffffdffffffffffffffffffffffff",a:"fffffffdfffffffffffffffffffffffc",b:"e87579c11079f43dd824993c2cee5ed3",n:"fffffffe0000000075a30d1b9038a115",h:"01",Gx:"161ff7528b899b2d0c28607ca52c5b86",Gy:"cf5ac8395bafeb13c02da292dded7a83"},secp160k1:{p:"fffffffffffffffffffffffffffffffeffffac73",a:"00",b:"07",n:"0100000000000000000001b8fa16dfab9aca16b6b3",h:"01",Gx:"3b4c382ce37aa192a4019e763036f4f5dd4d7ebb",Gy:"938cf935318fdced6bc28286531733c3f03c4fee"},secp160r1:{p:"ffffffffffffffffffffffffffffffff7fffffff",a:"ffffffffffffffffffffffffffffffff7ffffffc",b:"1c97befc54bd7a8b65acf89f81d4d4adc565fa45",n:"0100000000000000000001f4c8f927aed3ca752257",h:"01",Gx:"4a96b5688ef573284664698968c38bb913cbfc82",Gy:"23a628553168947d59dcc912042351377ac5fb32"},secp192k1:{p:"fffffffffffffffffffffffffffffffffffffffeffffee37",a:"00",b:"03",n:"fffffffffffffffffffffffe26f2fc170f69466a74defd8d",h:"01",Gx:"db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d",Gy:"9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"},secp192r1:{p:"fffffffffffffffffffffffffffffffeffffffffffffffff",a:"fffffffffffffffffffffffffffffffefffffffffffffffc",b:"64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",n:"ffffffffffffffffffffffff99def836146bc9b1b4d22831",h:"01",Gx:"188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",Gy:"07192b95ffc8da78631011ed6b24cdd573f977a11e794811"},secp256k1:{p:"fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",a:"00",b:"07",n:"fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",h:"01",Gx:"79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",Gy:"483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"},secp256r1:{p:"ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",a:"ffffffff00000001000000000000000000000000fffffffffffffffffffffffc",b:"5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",n:"ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",h:"01",Gx:"6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",Gy:"4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"}}},{}],68:[function(t,e,r){var n=t("./point"),i=t("./curve"),o=t("./names")
e.exports={Curve:i,Point:n,getCurveByName:o}},{"./curve":66,"./names":69,"./point":70}],69:[function(t,e,r){function n(t){var e=o[t]
if(!e)return null
var r=new i(e.p,16),n=new i(e.a,16),a=new i(e.b,16),f=new i(e.n,16),u=new i(e.h,16),c=new i(e.Gx,16),h=new i(e.Gy,16)
return new s(r,n,a,c,h,f,u)}var i=t("bigi"),o=t("./curves.json"),s=t("./curve")
e.exports=n},{"./curve":66,"./curves.json":67,bigi:6}],70:[function(t,e,r){function n(t,e,r,n){i.notStrictEqual(n,void 0,"Missing Z coordinate"),this.curve=t,this.x=e,this.y=r,this.z=n,this._zInv=null,this.compressed=!0}var i=t("assert"),o=t("safe-buffer").Buffer,s=t("bigi"),a=s.valueOf(3)
Object.defineProperty(n.prototype,"zInv",{get:function(){return null===this._zInv&&(this._zInv=this.z.modInverse(this.curve.p)),this._zInv}}),Object.defineProperty(n.prototype,"affineX",{get:function(){return this.x.multiply(this.zInv).mod(this.curve.p)}}),Object.defineProperty(n.prototype,"affineY",{get:function(){return this.y.multiply(this.zInv).mod(this.curve.p)}}),n.fromAffine=function(t,e,r){return new n(t,e,r,s.ONE)},n.prototype.equals=function(t){return t===this||(this.curve.isInfinity(this)?this.curve.isInfinity(t):this.curve.isInfinity(t)?this.curve.isInfinity(this):0===t.y.multiply(this.z).subtract(this.y.multiply(t.z)).mod(this.curve.p).signum()&&0===t.x.multiply(this.z).subtract(this.x.multiply(t.z)).mod(this.curve.p).signum())},n.prototype.negate=function(){var t=this.curve.p.subtract(this.y)
return new n(this.curve,this.x,t,this.z)},n.prototype.add=function(t){if(this.curve.isInfinity(this))return t
if(this.curve.isInfinity(t))return this
var e=this.x,r=this.y,i=t.x,o=t.y,s=o.multiply(this.z).subtract(r.multiply(t.z)).mod(this.curve.p),f=i.multiply(this.z).subtract(e.multiply(t.z)).mod(this.curve.p)
if(0===f.signum())return 0===s.signum()?this.twice():this.curve.infinity
var u=f.square(),c=u.multiply(f),h=e.multiply(u),l=s.square().multiply(this.z),p=l.subtract(h.shiftLeft(1)).multiply(t.z).subtract(c).multiply(f).mod(this.curve.p),d=h.multiply(a).multiply(s).subtract(r.multiply(c)).subtract(l.multiply(s)).multiply(t.z).add(s.multiply(c)).mod(this.curve.p),_=c.multiply(this.z).multiply(t.z).mod(this.curve.p)
return new n(this.curve,p,d,_)},n.prototype.twice=function(){if(this.curve.isInfinity(this))return this
if(0===this.y.signum())return this.curve.infinity
var t=this.x,e=this.y,r=e.multiply(this.z).mod(this.curve.p),i=r.multiply(e).mod(this.curve.p),o=this.curve.a,s=t.square().multiply(a)
0!==o.signum()&&(s=s.add(this.z.square().multiply(o))),s=s.mod(this.curve.p)
var f=s.square().subtract(t.shiftLeft(3).multiply(i)).shiftLeft(1).multiply(r).mod(this.curve.p),u=s.multiply(a).multiply(t).subtract(i.shiftLeft(1)).shiftLeft(2).multiply(i).subtract(s.pow(3)).mod(this.curve.p),c=r.pow(3).shiftLeft(3).mod(this.curve.p)
return new n(this.curve,f,u,c)},n.prototype.multiply=function(t){if(this.curve.isInfinity(this))return this
if(0===t.signum())return this.curve.infinity
for(var e=t,r=e.multiply(a),n=this.negate(),i=this,o=r.bitLength()-2;o>0;--o){var s=r.testBit(o),f=e.testBit(o)
i=i.twice(),s!==f&&(i=i.add(s?this:n))}return i},n.prototype.multiplyTwo=function(t,e,r){for(var n=Math.max(t.bitLength(),r.bitLength())-1,i=this.curve.infinity,o=this.add(e);n>=0;){var s=t.testBit(n),a=r.testBit(n)
i=i.twice(),s?i=a?i.add(o):i.add(this):a&&(i=i.add(e)),--n}return i},n.prototype.getEncoded=function(t){if(null==t&&(t=this.compressed),this.curve.isInfinity(this))return o.alloc(1,0)
var e,r=this.affineX,n=this.affineY,i=this.curve.pLength
return t?(e=o.allocUnsafe(1+i),e.writeUInt8(n.isEven()?2:3,0)):(e=o.allocUnsafe(1+i+i),e.writeUInt8(4,0),n.toBuffer(i).copy(e,1+i)),r.toBuffer(i).copy(e,1),e},n.decodeFrom=function(t,e){var r,o=e.readUInt8(0),a=4!==o,f=Math.floor((t.p.bitLength()+7)/8),u=s.fromBuffer(e.slice(1,1+f))
if(a){i.equal(e.length,f+1,"Invalid sequence length"),i(2===o||3===o,"Invalid sequence tag")
var c=3===o
r=t.pointFromX(c,u)}else{i.equal(e.length,1+f+f,"Invalid sequence length")
var h=s.fromBuffer(e.slice(1+f))
r=n.fromAffine(t,u,h)}return r.compressed=a,r},n.prototype.toString=function(){return this.curve.isInfinity(this)?"(INFINITY)":"("+this.affineX.toString()+","+this.affineY.toString()+")"},e.exports=n},{assert:102,bigi:6,"safe-buffer":92}],71:[function(t,e,r){"use strict"
e.exports=function(){}},{}],72:[function(t,e,r){"use strict"
e.exports=t("./is-implemented")()?Object.assign:t("./shim")},{"./is-implemented":73,"./shim":74}],73:[function(t,e,r){"use strict"
e.exports=function(){var t,e=Object.assign
return"function"==typeof e&&(t={foo:"raz"},e(t,{bar:"dwa"},{trzy:"trzy"}),t.foo+t.bar+t.trzy==="razdwatrzy")}},{}],74:[function(t,e,r){"use strict"
var n=t("../keys"),i=t("../valid-value"),o=Math.max
e.exports=function(t,e){var r,s,a,f=o(arguments.length,2)
for(t=Object(i(t)),a=function(n){try{t[n]=e[n]}catch(t){r||(r=t)}},s=1;s<f;++s)e=arguments[s],n(e).forEach(a)
if(void 0!==r)throw r
return t}},{"../keys":77,"../valid-value":82}],75:[function(t,e,r){"use strict"
e.exports=function(t){return"function"==typeof t}},{}],76:[function(t,e,r){"use strict"
var n=t("../function/noop")()
e.exports=function(t){return t!==n&&null!==t}},{"../function/noop":71}],77:[function(t,e,r){"use strict"
e.exports=t("./is-implemented")()?Object.keys:t("./shim")},{"./is-implemented":78,"./shim":79}],78:[function(t,e,r){"use strict"
e.exports=function(){try{return Object.keys("primitive"),!0}catch(t){return!1}}},{}],79:[function(t,e,r){"use strict"
var n=t("../is-value"),i=Object.keys
e.exports=function(t){return i(n(t)?Object(t):t)}},{"../is-value":76}],80:[function(t,e,r){"use strict"
var n=t("./is-value"),i=Array.prototype.forEach,o=Object.create,s=function(t,e){var r
for(r in t)e[r]=t[r]}
e.exports=function(t){var e=o(null)
return i.call(arguments,function(t){n(t)&&s(Object(t),e)}),e}},{"./is-value":76}],81:[function(t,e,r){"use strict"
e.exports=function(t){if("function"!=typeof t)throw new TypeError(t+" is not a function")
return t}},{}],82:[function(t,e,r){"use strict"
var n=t("./is-value")
e.exports=function(t){if(!n(t))throw new TypeError("Cannot use null or undefined")
return t}},{"./is-value":76}],83:[function(t,e,r){"use strict"
e.exports=t("./is-implemented")()?String.prototype.contains:t("./shim")},{"./is-implemented":84,"./shim":85}],84:[function(t,e,r){"use strict"
var n="razdwatrzy"
e.exports=function(){return"function"==typeof n.contains&&(!0===n.contains("dwa")&&!1===n.contains("foo"))}},{}],85:[function(t,e,r){"use strict"
var n=String.prototype.indexOf
e.exports=function(t){return n.call(this,t,arguments[1])>-1}},{}],86:[function(t,e,r){"use strict"
var n,i,o,s,a,f,u,c=t("d"),h=t("es5-ext/object/valid-callable"),l=Function.prototype.apply,p=Function.prototype.call,d=Object.create,_=Object.defineProperty,g=Object.defineProperties,y=Object.prototype.hasOwnProperty,v={configurable:!0,enumerable:!1,writable:!0}
n=function(t,e){var r
return h(e),y.call(this,"__ee__")?r=this.__ee__:(r=v.value=d(null),_(this,"__ee__",v),v.value=null),r[t]?"object"==typeof r[t]?r[t].push(e):r[t]=[r[t],e]:r[t]=e,this},i=function(t,e){var r,i
return h(e),i=this,n.call(this,t,r=function(){o.call(i,t,r),l.call(e,this,arguments)}),r.__eeOnceListener__=e,this},o=function(t,e){var r,n,i,o
if(h(e),!y.call(this,"__ee__"))return this
if(r=this.__ee__,!r[t])return this
if("object"==typeof(n=r[t]))for(o=0;i=n[o];++o)i!==e&&i.__eeOnceListener__!==e||(2===n.length?r[t]=n[o?0:1]:n.splice(o,1))
else n!==e&&n.__eeOnceListener__!==e||delete r[t]
return this},s=function(t){var e,r,n,i,o
if(y.call(this,"__ee__")&&(i=this.__ee__[t]))if("object"==typeof i){for(r=arguments.length,o=new Array(r-1),e=1;e<r;++e)o[e-1]=arguments[e]
for(i=i.slice(),e=0;n=i[e];++e)l.call(n,this,o)}else switch(arguments.length){case 1:p.call(i,this)
break
case 2:p.call(i,this,arguments[1])
break
case 3:p.call(i,this,arguments[1],arguments[2])
break
default:for(r=arguments.length,o=new Array(r-1),e=1;e<r;++e)o[e-1]=arguments[e]
l.call(i,this,o)}},a={on:n,once:i,off:o,emit:s},f={on:c(n),once:c(i),off:c(o),emit:c(s)},u=g({},f),e.exports=r=function(t){return null==t?d(u):g(Object(t),f)},r.methods=a},{d:62,"es5-ext/object/valid-callable":81}],87:[function(t,e,r){(function(r){"use strict"
function n(t){i.call(this),this._block=new r(t),this._blockSize=t,this._blockOffset=0,this._length=[0,0,0,0],this._finalized=!1}var i=t("stream").Transform
t("inherits")(n,i),n.prototype._transform=function(t,e,n){var i=null
try{"buffer"!==e&&(t=new r(t,e)),this.update(t)}catch(t){i=t}n(i)},n.prototype._flush=function(t){var e=null
try{this.push(this._digest())}catch(t){e=t}t(e)},n.prototype.update=function(t,e){if(!r.isBuffer(t)&&"string"!=typeof t)throw new TypeError("Data must be a string or a buffer")
if(this._finalized)throw new Error("Digest already called")
r.isBuffer(t)||(t=new r(t,e||"binary"))
for(var n=this._block,i=0;this._blockOffset+t.length-i>=this._blockSize;){for(var o=this._blockOffset;o<this._blockSize;)n[o++]=t[i++]
this._update(),this._blockOffset=0}for(;i<t.length;)n[this._blockOffset++]=t[i++]
for(var s=0,a=8*t.length;a>0;++s)this._length[s]+=a,(a=this._length[s]/4294967296|0)>0&&(this._length[s]-=4294967296*a)
return this},n.prototype._update=function(t){throw new Error("_update is not implemented")},n.prototype.digest=function(t){if(this._finalized)throw new Error("Digest already called")
this._finalized=!0
var e=this._digest()
return void 0!==t&&(e=e.toString(t)),e},n.prototype._digest=function(){throw new Error("_digest is not implemented")},e.exports=n}).call(this,t("buffer").Buffer)},{buffer:105,inherits:89,stream:128}],88:[function(t,e,r){!function(t,n){"object"==typeof r&&void 0!==e?e.exports=n():"function"==typeof define&&define.amd?define(n):t.Immutable=n()}(this,function(){"use strict"
function t(t,e){e&&(t.prototype=Object.create(e.prototype)),t.prototype.constructor=t}function e(t){return o(t)?t:A(t)}function r(t){return s(t)?t:j(t)}function n(t){return a(t)?t:O(t)}function i(t){return o(t)&&!f(t)?t:M(t)}function o(t){return!(!t||!t[fr])}function s(t){return!(!t||!t[ur])}function a(t){return!(!t||!t[cr])}function f(t){return s(t)||a(t)}function u(t){return!(!t||!t[hr])}function c(t){return t.value=!1,t}function h(t){t&&(t.value=!0)}function l(){}function p(t,e){e=e||0
for(var r=Math.max(0,t.length-e),n=new Array(r),i=0;i<r;i++)n[i]=t[i+e]
return n}function d(t){return void 0===t.size&&(t.size=t.__iterate(g)),t.size}function _(t,e){if("number"!=typeof e){var r=e>>>0
if(""+r!==e||4294967295===r)return NaN
e=r}return e<0?d(t)+e:e}function g(){return!0}function y(t,e,r){return(0===t||void 0!==r&&t<=-r)&&(void 0===e||void 0!==r&&e>=r)}function v(t,e){return m(t,e,0)}function b(t,e){return m(t,e,e)}function m(t,e,r){return void 0===t?r:t<0?Math.max(0,e+t):void 0===e?t:Math.min(e,t)}function w(t){this.next=t}function E(t,e,r,n){var i=0===t?e:1===t?r:[e,r]
return n?n.value=i:n={value:i,done:!1},n}function S(){return{value:void 0,done:!0}}function B(t){return!!k(t)}function x(t){return t&&"function"==typeof t.next}function I(t){var e=k(t)
return e&&e.call(t)}function k(t){var e=t&&(wr&&t[wr]||t[Er])
if("function"==typeof e)return e}function T(t){return t&&"number"==typeof t.length}function A(t){return null===t||void 0===t?U():o(t)?t.toSeq():P(t)}function j(t){return null===t||void 0===t?U().toKeyedSeq():o(t)?s(t)?t.toSeq():t.fromEntrySeq():R(t)}function O(t){return null===t||void 0===t?U():o(t)?s(t)?t.entrySeq():t.toIndexedSeq():N(t)}function M(t){return(null===t||void 0===t?U():o(t)?s(t)?t.entrySeq():t:N(t)).toSetSeq()}function z(t){this._array=t,this.size=t.length}function L(t){var e=Object.keys(t)
this._object=t,this._keys=e,this.size=e.length}function C(t){this._iterable=t,this.size=t.length||t.size}function q(t){this._iterator=t,this._iteratorCache=[]}function D(t){return!(!t||!t[Br])}function U(){return xr||(xr=new z([]))}function R(t){var e=Array.isArray(t)?new z(t).fromEntrySeq():x(t)?new q(t).fromEntrySeq():B(t)?new C(t).fromEntrySeq():"object"==typeof t?new L(t):void 0
if(!e)throw new TypeError("Expected Array or iterable object of [k, v] entries, or keyed object: "+t)
return e}function N(t){var e=F(t)
if(!e)throw new TypeError("Expected Array or iterable object of values: "+t)
return e}function P(t){var e=F(t)||"object"==typeof t&&new L(t)
if(!e)throw new TypeError("Expected Array or iterable object of values, or keyed object: "+t)
return e}function F(t){return T(t)?new z(t):x(t)?new q(t):B(t)?new C(t):void 0}function K(t,e,r,n){var i=t._cache
if(i){for(var o=i.length-1,s=0;s<=o;s++){var a=i[r?o-s:s]
if(!1===e(a[1],n?a[0]:s,t))return s+1}return s}return t.__iterateUncached(e,r)}function H(t,e,r,n){var i=t._cache
if(i){var o=i.length-1,s=0
return new w(function(){var t=i[r?o-s:s]
return s++>o?S():E(e,n?t[0]:s-1,t[1])})}return t.__iteratorUncached(e,r)}function V(t,e){return e?W(e,t,"",{"":t}):J(t)}function W(t,e,r,n){return Array.isArray(e)?t.call(n,r,O(e).map(function(r,n){return W(t,r,n,e)})):Z(e)?t.call(n,r,j(e).map(function(r,n){return W(t,r,n,e)})):e}function J(t){return Array.isArray(t)?O(t).map(J).toList():Z(t)?j(t).map(J).toMap():t}function Z(t){return t&&(t.constructor===Object||void 0===t.constructor)}function G(t,e){if(t===e||t!==t&&e!==e)return!0
if(!t||!e)return!1
if("function"==typeof t.valueOf&&"function"==typeof e.valueOf){if(t=t.valueOf(),e=e.valueOf(),t===e||t!==t&&e!==e)return!0
if(!t||!e)return!1}return!("function"!=typeof t.equals||"function"!=typeof e.equals||!t.equals(e))}function Y(t,e){if(t===e)return!0
if(!o(e)||void 0!==t.size&&void 0!==e.size&&t.size!==e.size||void 0!==t.__hash&&void 0!==e.__hash&&t.__hash!==e.__hash||s(t)!==s(e)||a(t)!==a(e)||u(t)!==u(e))return!1
if(0===t.size&&0===e.size)return!0
var r=!f(t)
if(u(t)){var n=t.entries()
return e.every(function(t,e){var i=n.next().value
return i&&G(i[1],t)&&(r||G(i[0],e))})&&n.next().done}var i=!1
if(void 0===t.size)if(void 0===e.size)"function"==typeof t.cacheResult&&t.cacheResult()
else{i=!0
var c=t
t=e,e=c}var h=!0,l=e.__iterate(function(e,n){if(r?!t.has(e):i?!G(e,t.get(n,_r)):!G(t.get(n,_r),e))return h=!1,!1})
return h&&t.size===l}function X(t,e){if(!(this instanceof X))return new X(t,e)
if(this._value=t,this.size=void 0===e?1/0:Math.max(0,e),0===this.size){if(Ir)return Ir
Ir=this}}function $(t,e){if(!t)throw new Error(e)}function Q(t,e,r){if(!(this instanceof Q))return new Q(t,e,r)
if($(0!==r,"Cannot step a Range by 0"),t=t||0,void 0===e&&(e=1/0),r=void 0===r?1:Math.abs(r),e<t&&(r=-r),this._start=t,this._end=e,this._step=r,this.size=Math.max(0,Math.ceil((e-t)/r-1)+1),0===this.size){if(kr)return kr
kr=this}}function tt(){throw TypeError("Abstract")}function et(){}function rt(){}function nt(){}function it(t){return t>>>1&1073741824|3221225471&t}function ot(t){if(!1===t||null===t||void 0===t)return 0
if("function"==typeof t.valueOf&&(!1===(t=t.valueOf())||null===t||void 0===t))return 0
if(!0===t)return 1
var e=typeof t
if("number"===e){if(t!==t||t===1/0)return 0
var r=0|t
for(r!==t&&(r^=4294967295*t);t>4294967295;)t/=4294967295,r^=t
return it(r)}if("string"===e)return t.length>Cr?st(t):at(t)
if("function"==typeof t.hashCode)return t.hashCode()
if("object"===e)return ft(t)
if("function"==typeof t.toString)return at(t.toString())
throw new Error("Value type "+e+" cannot be hashed.")}function st(t){var e=Ur[t]
return void 0===e&&(e=at(t),Dr===qr&&(Dr=0,Ur={}),Dr++,Ur[t]=e),e}function at(t){for(var e=0,r=0;r<t.length;r++)e=31*e+t.charCodeAt(r)|0
return it(e)}function ft(t){var e
if(Mr&&void 0!==(e=Tr.get(t)))return e
if(void 0!==(e=t[Lr]))return e
if(!Or){if(void 0!==(e=t.propertyIsEnumerable&&t.propertyIsEnumerable[Lr]))return e
if(void 0!==(e=ut(t)))return e}if(e=++zr,1073741824&zr&&(zr=0),Mr)Tr.set(t,e)
else{if(void 0!==jr&&!1===jr(t))throw new Error("Non-extensible objects are not allowed as keys.")
if(Or)Object.defineProperty(t,Lr,{enumerable:!1,configurable:!1,writable:!1,value:e})
else if(void 0!==t.propertyIsEnumerable&&t.propertyIsEnumerable===t.constructor.prototype.propertyIsEnumerable)t.propertyIsEnumerable=function(){return this.constructor.prototype.propertyIsEnumerable.apply(this,arguments)},t.propertyIsEnumerable[Lr]=e
else{if(void 0===t.nodeType)throw new Error("Unable to set a non-enumerable property on object.")
t[Lr]=e}}return e}function ut(t){if(t&&t.nodeType>0)switch(t.nodeType){case 1:return t.uniqueID
case 9:return t.documentElement&&t.documentElement.uniqueID}}function ct(t){$(t!==1/0,"Cannot perform this action with an infinite size.")}function ht(t){return null===t||void 0===t?Et():lt(t)&&!u(t)?t:Et().withMutations(function(e){var n=r(t)
ct(n.size),n.forEach(function(t,r){return e.set(r,t)})})}function lt(t){return!(!t||!t[Rr])}function pt(t,e){this.ownerID=t,this.entries=e}function dt(t,e,r){this.ownerID=t,this.bitmap=e,this.nodes=r}function _t(t,e,r){this.ownerID=t,this.count=e,this.nodes=r}function gt(t,e,r){this.ownerID=t,this.keyHash=e,this.entries=r}function yt(t,e,r){this.ownerID=t,this.keyHash=e,this.entry=r}function vt(t,e,r){this._type=e,this._reverse=r,this._stack=t._root&&mt(t._root)}function bt(t,e){return E(t,e[0],e[1])}function mt(t,e){return{node:t,index:0,__prev:e}}function wt(t,e,r,n){var i=Object.create(Nr)
return i.size=t,i._root=e,i.__ownerID=r,i.__hash=n,i.__altered=!1,i}function Et(){return Pr||(Pr=wt(0))}function St(t,e,r){var n,i
if(t._root){var o=c(gr),s=c(yr)
if(n=Bt(t._root,t.__ownerID,0,void 0,e,r,o,s),!s.value)return t
i=t.size+(o.value?r===_r?-1:1:0)}else{if(r===_r)return t
i=1,n=new pt(t.__ownerID,[[e,r]])}return t.__ownerID?(t.size=i,t._root=n,t.__hash=void 0,t.__altered=!0,t):n?wt(i,n):Et()}function Bt(t,e,r,n,i,o,s,a){return t?t.update(e,r,n,i,o,s,a):o===_r?t:(h(a),h(s),new yt(e,n,[i,o]))}function xt(t){return t.constructor===yt||t.constructor===gt}function It(t,e,r,n,i){if(t.keyHash===n)return new gt(e,n,[t.entry,i])
var o,s=(0===r?t.keyHash:t.keyHash>>>r)&dr,a=(0===r?n:n>>>r)&dr
return new dt(e,1<<s|1<<a,s===a?[It(t,e,r+lr,n,i)]:(o=new yt(e,n,i),s<a?[t,o]:[o,t]))}function kt(t,e,r,n){t||(t=new l)
for(var i=new yt(t,ot(r),[r,n]),o=0;o<e.length;o++){var s=e[o]
i=i.update(t,0,void 0,s[0],s[1])}return i}function Tt(t,e,r,n){for(var i=0,o=0,s=new Array(r),a=0,f=1,u=e.length;a<u;a++,f<<=1){var c=e[a]
void 0!==c&&a!==n&&(i|=f,s[o++]=c)}return new dt(t,i,s)}function At(t,e,r,n,i){for(var o=0,s=new Array(pr),a=0;0!==r;a++,r>>>=1)s[a]=1&r?e[o++]:void 0
return s[n]=i,new _t(t,o+1,s)}function jt(t,e,n){for(var i=[],s=0;s<n.length;s++){var a=n[s],f=r(a)
o(a)||(f=f.map(function(t){return V(t)})),i.push(f)}return zt(t,e,i)}function Ot(t,e,r){return t&&t.mergeDeep&&o(e)?t.mergeDeep(e):G(t,e)?t:e}function Mt(t){return function(e,r,n){if(e&&e.mergeDeepWith&&o(r))return e.mergeDeepWith(t,r)
var i=t(e,r,n)
return G(e,i)?e:i}}function zt(t,e,r){return r=r.filter(function(t){return 0!==t.size}),0===r.length?t:0!==t.size||t.__ownerID||1!==r.length?t.withMutations(function(t){for(var n=e?function(r,n){t.update(n,_r,function(t){return t===_r?r:e(t,r,n)})}:function(e,r){t.set(r,e)},i=0;i<r.length;i++)r[i].forEach(n)}):t.constructor(r[0])}function Lt(t,e,r,n){var i=t===_r,o=e.next()
if(o.done){var s=i?r:t,a=n(s)
return a===s?t:a}$(i||t&&t.set,"invalid keyPath")
var f=o.value,u=i?_r:t.get(f,_r),c=Lt(u,e,r,n)
return c===u?t:c===_r?t.remove(f):(i?Et():t).set(f,c)}function Ct(t){return t-=t>>1&1431655765,t=(858993459&t)+(t>>2&858993459),t=t+(t>>4)&252645135,t+=t>>8,127&(t+=t>>16)}function qt(t,e,r,n){var i=n?t:p(t)
return i[e]=r,i}function Dt(t,e,r,n){var i=t.length+1
if(n&&e+1===i)return t[e]=r,t
for(var o=new Array(i),s=0,a=0;a<i;a++)a===e?(o[a]=r,s=-1):o[a]=t[a+s]
return o}function Ut(t,e,r){var n=t.length-1
if(r&&e===n)return t.pop(),t
for(var i=new Array(n),o=0,s=0;s<n;s++)s===e&&(o=1),i[s]=t[s+o]
return i}function Rt(t){var e=Ht()
if(null===t||void 0===t)return e
if(Nt(t))return t
var r=n(t),i=r.size
return 0===i?e:(ct(i),i>0&&i<pr?Kt(0,i,lr,null,new Pt(r.toArray())):e.withMutations(function(t){t.setSize(i),r.forEach(function(e,r){return t.set(r,e)})}))}function Nt(t){return!(!t||!t[Vr])}function Pt(t,e){this.array=t,this.ownerID=e}function Ft(t,e){function r(t,e,r){return 0===e?n(t,r):i(t,e,r)}function n(t,r){var n=r===a?f&&f.array:t&&t.array,i=r>o?0:o-r,u=s-r
return u>pr&&(u=pr),function(){if(i===u)return Zr
var t=e?--u:i++
return n&&n[t]}}function i(t,n,i){var a,f=t&&t.array,u=i>o?0:o-i>>n,c=1+(s-i>>n)
return c>pr&&(c=pr),function(){for(;;){if(a){var t=a()
if(t!==Zr)return t
a=null}if(u===c)return Zr
var o=e?--c:u++
a=r(f&&f[o],n-lr,i+(o<<n))}}}var o=t._origin,s=t._capacity,a=Xt(s),f=t._tail
return r(t._root,t._level,0)}function Kt(t,e,r,n,i,o,s){var a=Object.create(Wr)
return a.size=e-t,a._origin=t,a._capacity=e,a._level=r,a._root=n,a._tail=i,a.__ownerID=o,a.__hash=s,a.__altered=!1,a}function Ht(){return Jr||(Jr=Kt(0,0,lr))}function Vt(t,e,r){if((e=_(t,e))!==e)return t
if(e>=t.size||e<0)return t.withMutations(function(t){e<0?Gt(t,e).set(0,r):Gt(t,0,e+1).set(e,r)})
e+=t._origin
var n=t._tail,i=t._root,o=c(yr)
return e>=Xt(t._capacity)?n=Wt(n,t.__ownerID,0,e,r,o):i=Wt(i,t.__ownerID,t._level,e,r,o),o.value?t.__ownerID?(t._root=i,t._tail=n,t.__hash=void 0,t.__altered=!0,t):Kt(t._origin,t._capacity,t._level,i,n):t}function Wt(t,e,r,n,i,o){var s=n>>>r&dr,a=t&&s<t.array.length
if(!a&&void 0===i)return t
var f
if(r>0){var u=t&&t.array[s],c=Wt(u,e,r-lr,n,i,o)
return c===u?t:(f=Jt(t,e),f.array[s]=c,f)}return a&&t.array[s]===i?t:(h(o),f=Jt(t,e),void 0===i&&s===f.array.length-1?f.array.pop():f.array[s]=i,f)}function Jt(t,e){return e&&t&&e===t.ownerID?t:new Pt(t?t.array.slice():[],e)}function Zt(t,e){if(e>=Xt(t._capacity))return t._tail
if(e<1<<t._level+lr){for(var r=t._root,n=t._level;r&&n>0;)r=r.array[e>>>n&dr],n-=lr
return r}}function Gt(t,e,r){void 0!==e&&(e|=0),void 0!==r&&(r|=0)
var n=t.__ownerID||new l,i=t._origin,o=t._capacity,s=i+e,a=void 0===r?o:r<0?o+r:i+r
if(s===i&&a===o)return t
if(s>=a)return t.clear()
for(var f=t._level,u=t._root,c=0;s+c<0;)u=new Pt(u&&u.array.length?[void 0,u]:[],n),f+=lr,c+=1<<f
c&&(s+=c,i+=c,a+=c,o+=c)
for(var h=Xt(o),p=Xt(a);p>=1<<f+lr;)u=new Pt(u&&u.array.length?[u]:[],n),f+=lr
var d=t._tail,_=p<h?Zt(t,a-1):p>h?new Pt([],n):d
if(d&&p>h&&s<o&&d.array.length){u=Jt(u,n)
for(var g=u,y=f;y>lr;y-=lr){var v=h>>>y&dr
g=g.array[v]=Jt(g.array[v],n)}g.array[h>>>lr&dr]=d}if(a<o&&(_=_&&_.removeAfter(n,0,a)),s>=p)s-=p,a-=p,f=lr,u=null,_=_&&_.removeBefore(n,0,s)
else if(s>i||p<h){for(c=0;u;){var b=s>>>f&dr
if(b!==p>>>f&dr)break
b&&(c+=(1<<f)*b),f-=lr,u=u.array[b]}u&&s>i&&(u=u.removeBefore(n,f,s-c)),u&&p<h&&(u=u.removeAfter(n,f,p-c)),c&&(s-=c,a-=c)}return t.__ownerID?(t.size=a-s,t._origin=s,t._capacity=a,t._level=f,t._root=u,t._tail=_,t.__hash=void 0,t.__altered=!0,t):Kt(s,a,f,u,_)}function Yt(t,e,r){for(var i=[],s=0,a=0;a<r.length;a++){var f=r[a],u=n(f)
u.size>s&&(s=u.size),o(f)||(u=u.map(function(t){return V(t)})),i.push(u)}return s>t.size&&(t=t.setSize(s)),zt(t,e,i)}function Xt(t){return t<pr?0:t-1>>>lr<<lr}function $t(t){return null===t||void 0===t?ee():Qt(t)?t:ee().withMutations(function(e){var n=r(t)
ct(n.size),n.forEach(function(t,r){return e.set(r,t)})})}function Qt(t){return lt(t)&&u(t)}function te(t,e,r,n){var i=Object.create($t.prototype)
return i.size=t?t.size:0,i._map=t,i._list=e,i.__ownerID=r,i.__hash=n,i}function ee(){return Gr||(Gr=te(Et(),Ht()))}function re(t,e,r){var n,i,o=t._map,s=t._list,a=o.get(e),f=void 0!==a
if(r===_r){if(!f)return t
s.size>=pr&&s.size>=2*o.size?(i=s.filter(function(t,e){return void 0!==t&&a!==e}),n=i.toKeyedSeq().map(function(t){return t[0]}).flip().toMap(),t.__ownerID&&(n.__ownerID=i.__ownerID=t.__ownerID)):(n=o.remove(e),i=a===s.size-1?s.pop():s.set(a,void 0))}else if(f){if(r===s.get(a)[1])return t
n=o,i=s.set(a,[e,r])}else n=o.set(e,s.size),i=s.set(s.size,[e,r])
return t.__ownerID?(t.size=n.size,t._map=n,t._list=i,t.__hash=void 0,t):te(n,i)}function ne(t,e){this._iter=t,this._useKeys=e,this.size=t.size}function ie(t){this._iter=t,this.size=t.size}function oe(t){this._iter=t,this.size=t.size}function se(t){this._iter=t,this.size=t.size}function ae(t){var e=Te(t)
return e._iter=t,e.size=t.size,e.flip=function(){return t},e.reverse=function(){var e=t.reverse.apply(this)
return e.flip=function(){return t.reverse()},e},e.has=function(e){return t.includes(e)},e.includes=function(e){return t.has(e)},e.cacheResult=Ae,e.__iterateUncached=function(e,r){var n=this
return t.__iterate(function(t,r){return!1!==e(r,t,n)},r)},e.__iteratorUncached=function(e,r){if(e===mr){var n=t.__iterator(e,r)
return new w(function(){var t=n.next()
if(!t.done){var e=t.value[0]
t.value[0]=t.value[1],t.value[1]=e}return t})}return t.__iterator(e===br?vr:br,r)},e}function fe(t,e,r){var n=Te(t)
return n.size=t.size,n.has=function(e){return t.has(e)},n.get=function(n,i){var o=t.get(n,_r)
return o===_r?i:e.call(r,o,n,t)},n.__iterateUncached=function(n,i){var o=this
return t.__iterate(function(t,i,s){return!1!==n(e.call(r,t,i,s),i,o)},i)},n.__iteratorUncached=function(n,i){var o=t.__iterator(mr,i)
return new w(function(){var i=o.next()
if(i.done)return i
var s=i.value,a=s[0]
return E(n,a,e.call(r,s[1],a,t),i)})},n}function ue(t,e){var r=Te(t)
return r._iter=t,r.size=t.size,r.reverse=function(){return t},t.flip&&(r.flip=function(){var e=ae(t)
return e.reverse=function(){return t.flip()},e}),r.get=function(r,n){return t.get(e?r:-1-r,n)},r.has=function(r){return t.has(e?r:-1-r)},r.includes=function(e){return t.includes(e)},r.cacheResult=Ae,r.__iterate=function(e,r){var n=this
return t.__iterate(function(t,r){return e(t,r,n)},!r)},r.__iterator=function(e,r){return t.__iterator(e,!r)},r}function ce(t,e,r,n){var i=Te(t)
return n&&(i.has=function(n){var i=t.get(n,_r)
return i!==_r&&!!e.call(r,i,n,t)},i.get=function(n,i){var o=t.get(n,_r)
return o!==_r&&e.call(r,o,n,t)?o:i}),i.__iterateUncached=function(i,o){var s=this,a=0
return t.__iterate(function(t,o,f){if(e.call(r,t,o,f))return a++,i(t,n?o:a-1,s)},o),a},i.__iteratorUncached=function(i,o){var s=t.__iterator(mr,o),a=0
return new w(function(){for(;;){var o=s.next()
if(o.done)return o
var f=o.value,u=f[0],c=f[1]
if(e.call(r,c,u,t))return E(i,n?u:a++,c,o)}})},i}function he(t,e,r){var n=ht().asMutable()
return t.__iterate(function(i,o){n.update(e.call(r,i,o,t),0,function(t){return t+1})}),n.asImmutable()}function le(t,e,r){var n=s(t),i=(u(t)?$t():ht()).asMutable()
t.__iterate(function(o,s){i.update(e.call(r,o,s,t),function(t){return t=t||[],t.push(n?[s,o]:o),t})})
var o=ke(t)
return i.map(function(e){return Be(t,o(e))})}function pe(t,e,r,n){var i=t.size
if(void 0!==e&&(e|=0),void 0!==r&&(r===1/0?r=i:r|=0),y(e,r,i))return t
var o=v(e,i),s=b(r,i)
if(o!==o||s!==s)return pe(t.toSeq().cacheResult(),e,r,n)
var a,f=s-o
f===f&&(a=f<0?0:f)
var u=Te(t)
return u.size=0===a?a:t.size&&a||void 0,!n&&D(t)&&a>=0&&(u.get=function(e,r){return e=_(this,e),e>=0&&e<a?t.get(e+o,r):r}),u.__iterateUncached=function(e,r){var i=this
if(0===a)return 0
if(r)return this.cacheResult().__iterate(e,r)
var s=0,f=!0,u=0
return t.__iterate(function(t,r){if(!f||!(f=s++<o))return u++,!1!==e(t,n?r:u-1,i)&&u!==a}),u},u.__iteratorUncached=function(e,r){if(0!==a&&r)return this.cacheResult().__iterator(e,r)
var i=0!==a&&t.__iterator(e,r),s=0,f=0
return new w(function(){for(;s++<o;)i.next()
if(++f>a)return S()
var t=i.next()
return n||e===br?t:e===vr?E(e,f-1,void 0,t):E(e,f-1,t.value[1],t)})},u}function de(t,e,r){var n=Te(t)
return n.__iterateUncached=function(n,i){var o=this
if(i)return this.cacheResult().__iterate(n,i)
var s=0
return t.__iterate(function(t,i,a){return e.call(r,t,i,a)&&++s&&n(t,i,o)}),s},n.__iteratorUncached=function(n,i){var o=this
if(i)return this.cacheResult().__iterator(n,i)
var s=t.__iterator(mr,i),a=!0
return new w(function(){if(!a)return S()
var t=s.next()
if(t.done)return t
var i=t.value,f=i[0],u=i[1]
return e.call(r,u,f,o)?n===mr?t:E(n,f,u,t):(a=!1,S())})},n}function _e(t,e,r,n){var i=Te(t)
return i.__iterateUncached=function(i,o){var s=this
if(o)return this.cacheResult().__iterate(i,o)
var a=!0,f=0
return t.__iterate(function(t,o,u){if(!a||!(a=e.call(r,t,o,u)))return f++,i(t,n?o:f-1,s)}),f},i.__iteratorUncached=function(i,o){var s=this
if(o)return this.cacheResult().__iterator(i,o)
var a=t.__iterator(mr,o),f=!0,u=0
return new w(function(){var t,o,c
do{if(t=a.next(),t.done)return n||i===br?t:i===vr?E(i,u++,void 0,t):E(i,u++,t.value[1],t)
var h=t.value
o=h[0],c=h[1],f&&(f=e.call(r,c,o,s))}while(f)
return i===mr?t:E(i,o,c,t)})},i}function ge(t,e){var n=s(t),i=[t].concat(e).map(function(t){return o(t)?n&&(t=r(t)):t=n?R(t):N(Array.isArray(t)?t:[t]),t}).filter(function(t){return 0!==t.size})
if(0===i.length)return t
if(1===i.length){var f=i[0]
if(f===t||n&&s(f)||a(t)&&a(f))return f}var u=new z(i)
return n?u=u.toKeyedSeq():a(t)||(u=u.toSetSeq()),u=u.flatten(!0),u.size=i.reduce(function(t,e){if(void 0!==t){var r=e.size
if(void 0!==r)return t+r}},0),u}function ye(t,e,r){var n=Te(t)
return n.__iterateUncached=function(n,i){function s(t,u){var c=this
t.__iterate(function(t,i){return(!e||u<e)&&o(t)?s(t,u+1):!1===n(t,r?i:a++,c)&&(f=!0),!f},i)}var a=0,f=!1
return s(t,0),a},n.__iteratorUncached=function(n,i){var s=t.__iterator(n,i),a=[],f=0
return new w(function(){for(;s;){var t=s.next()
if(!1===t.done){var u=t.value
if(n===mr&&(u=u[1]),e&&!(a.length<e)||!o(u))return r?t:E(n,f++,u,t)
a.push(s),s=u.__iterator(n,i)}else s=a.pop()}return S()})},n}function ve(t,e,r){var n=ke(t)
return t.toSeq().map(function(i,o){return n(e.call(r,i,o,t))}).flatten(!0)}function be(t,e){var r=Te(t)
return r.size=t.size&&2*t.size-1,r.__iterateUncached=function(r,n){var i=this,o=0
return t.__iterate(function(t,n){return(!o||!1!==r(e,o++,i))&&!1!==r(t,o++,i)},n),o},r.__iteratorUncached=function(r,n){var i,o=t.__iterator(br,n),s=0
return new w(function(){return(!i||s%2)&&(i=o.next(),i.done)?i:s%2?E(r,s++,e):E(r,s++,i.value,i)})},r}function me(t,e,r){e||(e=je)
var n=s(t),i=0,o=t.toSeq().map(function(e,n){return[n,e,i++,r?r(e,n,t):e]}).toArray()
return o.sort(function(t,r){return e(t[3],r[3])||t[2]-r[2]}).forEach(n?function(t,e){o[e].length=2}:function(t,e){o[e]=t[1]}),n?j(o):a(t)?O(o):M(o)}function we(t,e,r){if(e||(e=je),r){var n=t.toSeq().map(function(e,n){return[e,r(e,n,t)]}).reduce(function(t,r){return Ee(e,t[1],r[1])?r:t})
return n&&n[0]}return t.reduce(function(t,r){return Ee(e,t,r)?r:t})}function Ee(t,e,r){var n=t(r,e)
return 0===n&&r!==e&&(void 0===r||null===r||r!==r)||n>0}function Se(t,r,n){var i=Te(t)
return i.size=new z(n).map(function(t){return t.size}).min(),i.__iterate=function(t,e){for(var r,n=this.__iterator(br,e),i=0;!(r=n.next()).done&&!1!==t(r.value,i++,this););return i},i.__iteratorUncached=function(t,i){var o=n.map(function(t){return t=e(t),I(i?t.reverse():t)}),s=0,a=!1
return new w(function(){var e
return a||(e=o.map(function(t){return t.next()}),a=e.some(function(t){return t.done})),a?S():E(t,s++,r.apply(null,e.map(function(t){return t.value})))})},i}function Be(t,e){return D(t)?e:t.constructor(e)}function xe(t){if(t!==Object(t))throw new TypeError("Expected [K, V] tuple: "+t)}function Ie(t){return ct(t.size),d(t)}function ke(t){return s(t)?r:a(t)?n:i}function Te(t){return Object.create((s(t)?j:a(t)?O:M).prototype)}function Ae(){return this._iter.cacheResult?(this._iter.cacheResult(),this.size=this._iter.size,this):A.prototype.cacheResult.call(this)}function je(t,e){return t>e?1:t<e?-1:0}function Oe(t){var r=I(t)
if(!r){if(!T(t))throw new TypeError("Expected iterable or array-like: "+t)
r=I(e(t))}return r}function Me(t,e){var r,n=function(o){if(o instanceof n)return o
if(!(this instanceof n))return new n(o)
if(!r){r=!0
var s=Object.keys(t)
Ce(i,s),i.size=s.length,i._name=e,i._keys=s,i._defaultValues=t}this._map=ht(o)},i=n.prototype=Object.create(Yr)
return i.constructor=n,n}function ze(t,e,r){var n=Object.create(Object.getPrototypeOf(t))
return n._map=e,n.__ownerID=r,n}function Le(t){return t._name||t.constructor.name||"Record"}function Ce(t,e){try{e.forEach(qe.bind(void 0,t))}catch(t){}}function qe(t,e){Object.defineProperty(t,e,{get:function(){return this.get(e)},set:function(t){$(this.__ownerID,"Cannot set on an immutable record."),this.set(e,t)}})}function De(t){return null===t||void 0===t?Pe():Ue(t)&&!u(t)?t:Pe().withMutations(function(e){var r=i(t)
ct(r.size),r.forEach(function(t){return e.add(t)})})}function Ue(t){return!(!t||!t[Xr])}function Re(t,e){return t.__ownerID?(t.size=e.size,t._map=e,t):e===t._map?t:0===e.size?t.__empty():t.__make(e)}function Ne(t,e){var r=Object.create($r)
return r.size=t?t.size:0,r._map=t,r.__ownerID=e,r}function Pe(){return Qr||(Qr=Ne(Et()))}function Fe(t){return null===t||void 0===t?Ve():Ke(t)?t:Ve().withMutations(function(e){var r=i(t)
ct(r.size),r.forEach(function(t){return e.add(t)})})}function Ke(t){return Ue(t)&&u(t)}function He(t,e){var r=Object.create(tn)
return r.size=t?t.size:0,r._map=t,r.__ownerID=e,r}function Ve(){return en||(en=He(ee()))}function We(t){return null===t||void 0===t?Ge():Je(t)?t:Ge().unshiftAll(t)}function Je(t){return!(!t||!t[rn])}function Ze(t,e,r,n){var i=Object.create(nn)
return i.size=t,i._head=e,i.__ownerID=r,i.__hash=n,i.__altered=!1,i}function Ge(){return on||(on=Ze(0))}function Ye(t,e){var r=function(r){t.prototype[r]=e[r]}
return Object.keys(e).forEach(r),Object.getOwnPropertySymbols&&Object.getOwnPropertySymbols(e).forEach(r),t}function Xe(t,e){return e}function $e(t,e){return[e,t]}function Qe(t){return function(){return!t.apply(this,arguments)}}function tr(t){return function(){return-t.apply(this,arguments)}}function er(t){return"string"==typeof t?JSON.stringify(t):String(t)}function rr(){return p(arguments)}function nr(t,e){return t<e?1:t>e?-1:0}function ir(t){if(t.size===1/0)return 0
var e=u(t),r=s(t),n=e?1:0
return or(t.__iterate(r?e?function(t,e){n=31*n+sr(ot(t),ot(e))|0}:function(t,e){n=n+sr(ot(t),ot(e))|0}:e?function(t){n=31*n+ot(t)|0}:function(t){n=n+ot(t)|0}),n)}function or(t,e){return e=Ar(e,3432918353),e=Ar(e<<15|e>>>-15,461845907),e=Ar(e<<13|e>>>-13,5),e=(e+3864292196|0)^t,e=Ar(e^e>>>16,2246822507),e=Ar(e^e>>>13,3266489909),e=it(e^e>>>16)}function sr(t,e){return t^e+2654435769+(t<<6)+(t>>2)|0}var ar=Array.prototype.slice
t(r,e),t(n,e),t(i,e),e.isIterable=o,e.isKeyed=s,e.isIndexed=a,e.isAssociative=f,e.isOrdered=u,e.Keyed=r,e.Indexed=n,e.Set=i
var fr="@@__IMMUTABLE_ITERABLE__@@",ur="@@__IMMUTABLE_KEYED__@@",cr="@@__IMMUTABLE_INDEXED__@@",hr="@@__IMMUTABLE_ORDERED__@@",lr=5,pr=1<<lr,dr=pr-1,_r={},gr={value:!1},yr={value:!1},vr=0,br=1,mr=2,wr="function"==typeof Symbol&&Symbol.iterator,Er="@@iterator",Sr=wr||Er
w.prototype.toString=function(){return"[Iterator]"},w.KEYS=vr,w.VALUES=br,w.ENTRIES=mr,w.prototype.inspect=w.prototype.toSource=function(){return this.toString()},w.prototype[Sr]=function(){return this},t(A,e),A.of=function(){return A(arguments)},A.prototype.toSeq=function(){return this},A.prototype.toString=function(){return this.__toString("Seq {","}")},A.prototype.cacheResult=function(){return!this._cache&&this.__iterateUncached&&(this._cache=this.entrySeq().toArray(),this.size=this._cache.length),this},A.prototype.__iterate=function(t,e){return K(this,t,e,!0)},A.prototype.__iterator=function(t,e){return H(this,t,e,!0)},t(j,A),j.prototype.toKeyedSeq=function(){return this},t(O,A),O.of=function(){return O(arguments)},O.prototype.toIndexedSeq=function(){return this},O.prototype.toString=function(){return this.__toString("Seq [","]")},O.prototype.__iterate=function(t,e){return K(this,t,e,!1)},O.prototype.__iterator=function(t,e){return H(this,t,e,!1)},t(M,A),M.of=function(){return M(arguments)},M.prototype.toSetSeq=function(){return this},A.isSeq=D,A.Keyed=j,A.Set=M,A.Indexed=O
var Br="@@__IMMUTABLE_SEQ__@@"
A.prototype[Br]=!0,t(z,O),z.prototype.get=function(t,e){return this.has(t)?this._array[_(this,t)]:e},z.prototype.__iterate=function(t,e){for(var r=this._array,n=r.length-1,i=0;i<=n;i++)if(!1===t(r[e?n-i:i],i,this))return i+1
return i},z.prototype.__iterator=function(t,e){var r=this._array,n=r.length-1,i=0
return new w(function(){return i>n?S():E(t,i,r[e?n-i++:i++])})},t(L,j),L.prototype.get=function(t,e){return void 0===e||this.has(t)?this._object[t]:e},L.prototype.has=function(t){return this._object.hasOwnProperty(t)},L.prototype.__iterate=function(t,e){for(var r=this._object,n=this._keys,i=n.length-1,o=0;o<=i;o++){var s=n[e?i-o:o]
if(!1===t(r[s],s,this))return o+1}return o},L.prototype.__iterator=function(t,e){var r=this._object,n=this._keys,i=n.length-1,o=0
return new w(function(){var s=n[e?i-o:o]
return o++>i?S():E(t,s,r[s])})},L.prototype[hr]=!0,t(C,O),C.prototype.__iterateUncached=function(t,e){if(e)return this.cacheResult().__iterate(t,e)
var r=this._iterable,n=I(r),i=0
if(x(n))for(var o;!(o=n.next()).done&&!1!==t(o.value,i++,this););return i},C.prototype.__iteratorUncached=function(t,e){if(e)return this.cacheResult().__iterator(t,e)
var r=this._iterable,n=I(r)
if(!x(n))return new w(S)
var i=0
return new w(function(){var e=n.next()
return e.done?e:E(t,i++,e.value)})},t(q,O),q.prototype.__iterateUncached=function(t,e){if(e)return this.cacheResult().__iterate(t,e)
for(var r=this._iterator,n=this._iteratorCache,i=0;i<n.length;)if(!1===t(n[i],i++,this))return i
for(var o;!(o=r.next()).done;){var s=o.value
if(n[i]=s,!1===t(s,i++,this))break}return i},q.prototype.__iteratorUncached=function(t,e){if(e)return this.cacheResult().__iterator(t,e)
var r=this._iterator,n=this._iteratorCache,i=0
return new w(function(){if(i>=n.length){var e=r.next()
if(e.done)return e
n[i]=e.value}return E(t,i,n[i++])})}
var xr
t(X,O),X.prototype.toString=function(){return 0===this.size?"Repeat []":"Repeat [ "+this._value+" "+this.size+" times ]"},X.prototype.get=function(t,e){return this.has(t)?this._value:e},X.prototype.includes=function(t){return G(this._value,t)},X.prototype.slice=function(t,e){var r=this.size
return y(t,e,r)?this:new X(this._value,b(e,r)-v(t,r))},X.prototype.reverse=function(){return this},X.prototype.indexOf=function(t){return G(this._value,t)?0:-1},X.prototype.lastIndexOf=function(t){return G(this._value,t)?this.size:-1},X.prototype.__iterate=function(t,e){for(var r=0;r<this.size;r++)if(!1===t(this._value,r,this))return r+1
return r},X.prototype.__iterator=function(t,e){var r=this,n=0
return new w(function(){return n<r.size?E(t,n++,r._value):S()})},X.prototype.equals=function(t){return t instanceof X?G(this._value,t._value):Y(t)}
var Ir
t(Q,O),Q.prototype.toString=function(){return 0===this.size?"Range []":"Range [ "+this._start+"..."+this._end+(1!==this._step?" by "+this._step:"")+" ]"},Q.prototype.get=function(t,e){return this.has(t)?this._start+_(this,t)*this._step:e},Q.prototype.includes=function(t){var e=(t-this._start)/this._step
return e>=0&&e<this.size&&e===Math.floor(e)},Q.prototype.slice=function(t,e){return y(t,e,this.size)?this:(t=v(t,this.size),e=b(e,this.size),e<=t?new Q(0,0):new Q(this.get(t,this._end),this.get(e,this._end),this._step))},Q.prototype.indexOf=function(t){var e=t-this._start
if(e%this._step==0){var r=e/this._step
if(r>=0&&r<this.size)return r}return-1},Q.prototype.lastIndexOf=function(t){return this.indexOf(t)},Q.prototype.__iterate=function(t,e){for(var r=this.size-1,n=this._step,i=e?this._start+r*n:this._start,o=0;o<=r;o++){if(!1===t(i,o,this))return o+1
i+=e?-n:n}return o},Q.prototype.__iterator=function(t,e){var r=this.size-1,n=this._step,i=e?this._start+r*n:this._start,o=0
return new w(function(){var s=i
return i+=e?-n:n,o>r?S():E(t,o++,s)})},Q.prototype.equals=function(t){return t instanceof Q?this._start===t._start&&this._end===t._end&&this._step===t._step:Y(this,t)}
var kr
t(tt,e),t(et,tt),t(rt,tt),t(nt,tt),tt.Keyed=et,tt.Indexed=rt,tt.Set=nt
var Tr,Ar="function"==typeof Math.imul&&-2===Math.imul(4294967295,2)?Math.imul:function(t,e){t|=0,e|=0
var r=65535&t,n=65535&e
return r*n+((t>>>16)*n+r*(e>>>16)<<16>>>0)|0},jr=Object.isExtensible,Or=function(){try{return Object.defineProperty({},"@",{}),!0}catch(t){return!1}}(),Mr="function"==typeof WeakMap
Mr&&(Tr=new WeakMap)
var zr=0,Lr="__immutablehash__"
"function"==typeof Symbol&&(Lr=Symbol(Lr))
var Cr=16,qr=255,Dr=0,Ur={}
t(ht,et),ht.of=function(){var t=ar.call(arguments,0)
return Et().withMutations(function(e){for(var r=0;r<t.length;r+=2){if(r+1>=t.length)throw new Error("Missing value for key: "+t[r])
e.set(t[r],t[r+1])}})},ht.prototype.toString=function(){return this.__toString("Map {","}")},ht.prototype.get=function(t,e){return this._root?this._root.get(0,void 0,t,e):e},ht.prototype.set=function(t,e){return St(this,t,e)},ht.prototype.setIn=function(t,e){return this.updateIn(t,_r,function(){return e})},ht.prototype.remove=function(t){return St(this,t,_r)},ht.prototype.deleteIn=function(t){return this.updateIn(t,function(){return _r})},ht.prototype.update=function(t,e,r){return 1===arguments.length?t(this):this.updateIn([t],e,r)},ht.prototype.updateIn=function(t,e,r){r||(r=e,e=void 0)
var n=Lt(this,Oe(t),e,r)
return n===_r?void 0:n},ht.prototype.clear=function(){return 0===this.size?this:this.__ownerID?(this.size=0,this._root=null,this.__hash=void 0,this.__altered=!0,this):Et()},ht.prototype.merge=function(){return jt(this,void 0,arguments)},ht.prototype.mergeWith=function(t){return jt(this,t,ar.call(arguments,1))},ht.prototype.mergeIn=function(t){var e=ar.call(arguments,1)
return this.updateIn(t,Et(),function(t){return"function"==typeof t.merge?t.merge.apply(t,e):e[e.length-1]})},ht.prototype.mergeDeep=function(){return jt(this,Ot,arguments)},ht.prototype.mergeDeepWith=function(t){var e=ar.call(arguments,1)
return jt(this,Mt(t),e)},ht.prototype.mergeDeepIn=function(t){var e=ar.call(arguments,1)
return this.updateIn(t,Et(),function(t){return"function"==typeof t.mergeDeep?t.mergeDeep.apply(t,e):e[e.length-1]})},ht.prototype.sort=function(t){return $t(me(this,t))},ht.prototype.sortBy=function(t,e){return $t(me(this,e,t))},ht.prototype.withMutations=function(t){var e=this.asMutable()
return t(e),e.wasAltered()?e.__ensureOwner(this.__ownerID):this},ht.prototype.asMutable=function(){return this.__ownerID?this:this.__ensureOwner(new l)},ht.prototype.asImmutable=function(){return this.__ensureOwner()},ht.prototype.wasAltered=function(){return this.__altered},ht.prototype.__iterator=function(t,e){return new vt(this,t,e)},ht.prototype.__iterate=function(t,e){var r=this,n=0
return this._root&&this._root.iterate(function(e){return n++,t(e[1],e[0],r)},e),n},ht.prototype.__ensureOwner=function(t){return t===this.__ownerID?this:t?wt(this.size,this._root,t,this.__hash):(this.__ownerID=t,this.__altered=!1,this)},ht.isMap=lt
var Rr="@@__IMMUTABLE_MAP__@@",Nr=ht.prototype
Nr[Rr]=!0,Nr.delete=Nr.remove,Nr.removeIn=Nr.deleteIn,pt.prototype.get=function(t,e,r,n){for(var i=this.entries,o=0,s=i.length;o<s;o++)if(G(r,i[o][0]))return i[o][1]
return n},pt.prototype.update=function(t,e,r,n,i,o,s){for(var a=i===_r,f=this.entries,u=0,c=f.length;u<c&&!G(n,f[u][0]);u++);var l=u<c
if(l?f[u][1]===i:a)return this
if(h(s),(a||!l)&&h(o),!a||1!==f.length){if(!l&&!a&&f.length>=Fr)return kt(t,f,n,i)
var d=t&&t===this.ownerID,_=d?f:p(f)
return l?a?u===c-1?_.pop():_[u]=_.pop():_[u]=[n,i]:_.push([n,i]),d?(this.entries=_,this):new pt(t,_)}},dt.prototype.get=function(t,e,r,n){void 0===e&&(e=ot(r))
var i=1<<((0===t?e:e>>>t)&dr),o=this.bitmap
return 0==(o&i)?n:this.nodes[Ct(o&i-1)].get(t+lr,e,r,n)},dt.prototype.update=function(t,e,r,n,i,o,s){void 0===r&&(r=ot(n))
var a=(0===e?r:r>>>e)&dr,f=1<<a,u=this.bitmap,c=0!=(u&f)
if(!c&&i===_r)return this
var h=Ct(u&f-1),l=this.nodes,p=c?l[h]:void 0,d=Bt(p,t,e+lr,r,n,i,o,s)
if(d===p)return this
if(!c&&d&&l.length>=Kr)return At(t,l,u,a,d)
if(c&&!d&&2===l.length&&xt(l[1^h]))return l[1^h]
if(c&&d&&1===l.length&&xt(d))return d
var _=t&&t===this.ownerID,g=c?d?u:u^f:u|f,y=c?d?qt(l,h,d,_):Ut(l,h,_):Dt(l,h,d,_)
return _?(this.bitmap=g,this.nodes=y,this):new dt(t,g,y)},_t.prototype.get=function(t,e,r,n){void 0===e&&(e=ot(r))
var i=(0===t?e:e>>>t)&dr,o=this.nodes[i]
return o?o.get(t+lr,e,r,n):n},_t.prototype.update=function(t,e,r,n,i,o,s){void 0===r&&(r=ot(n))
var a=(0===e?r:r>>>e)&dr,f=i===_r,u=this.nodes,c=u[a]
if(f&&!c)return this
var h=Bt(c,t,e+lr,r,n,i,o,s)
if(h===c)return this
var l=this.count
if(c){if(!h&&--l<Hr)return Tt(t,u,l,a)}else l++
var p=t&&t===this.ownerID,d=qt(u,a,h,p)
return p?(this.count=l,this.nodes=d,this):new _t(t,l,d)},gt.prototype.get=function(t,e,r,n){for(var i=this.entries,o=0,s=i.length;o<s;o++)if(G(r,i[o][0]))return i[o][1]
return n},gt.prototype.update=function(t,e,r,n,i,o,s){void 0===r&&(r=ot(n))
var a=i===_r
if(r!==this.keyHash)return a?this:(h(s),h(o),It(this,t,e,r,[n,i]))
for(var f=this.entries,u=0,c=f.length;u<c&&!G(n,f[u][0]);u++);var l=u<c
if(l?f[u][1]===i:a)return this
if(h(s),(a||!l)&&h(o),a&&2===c)return new yt(t,this.keyHash,f[1^u])
var d=t&&t===this.ownerID,_=d?f:p(f)
return l?a?u===c-1?_.pop():_[u]=_.pop():_[u]=[n,i]:_.push([n,i]),d?(this.entries=_,this):new gt(t,this.keyHash,_)},yt.prototype.get=function(t,e,r,n){return G(r,this.entry[0])?this.entry[1]:n},yt.prototype.update=function(t,e,r,n,i,o,s){var a=i===_r,f=G(n,this.entry[0])
return(f?i===this.entry[1]:a)?this:(h(s),a?void h(o):f?t&&t===this.ownerID?(this.entry[1]=i,this):new yt(t,this.keyHash,[n,i]):(h(o),It(this,t,e,ot(n),[n,i])))},pt.prototype.iterate=gt.prototype.iterate=function(t,e){for(var r=this.entries,n=0,i=r.length-1;n<=i;n++)if(!1===t(r[e?i-n:n]))return!1},dt.prototype.iterate=_t.prototype.iterate=function(t,e){for(var r=this.nodes,n=0,i=r.length-1;n<=i;n++){var o=r[e?i-n:n]
if(o&&!1===o.iterate(t,e))return!1}},yt.prototype.iterate=function(t,e){return t(this.entry)},t(vt,w),vt.prototype.next=function(){for(var t=this._type,e=this._stack;e;){var r,n=e.node,i=e.index++
if(n.entry){if(0===i)return bt(t,n.entry)}else if(n.entries){if(r=n.entries.length-1,i<=r)return bt(t,n.entries[this._reverse?r-i:i])}else if(r=n.nodes.length-1,i<=r){var o=n.nodes[this._reverse?r-i:i]
if(o){if(o.entry)return bt(t,o.entry)
e=this._stack=mt(o,e)}continue}e=this._stack=this._stack.__prev}return S()}
var Pr,Fr=pr/4,Kr=pr/2,Hr=pr/4
t(Rt,rt),Rt.of=function(){return this(arguments)},Rt.prototype.toString=function(){return this.__toString("List [","]")},Rt.prototype.get=function(t,e){if((t=_(this,t))>=0&&t<this.size){t+=this._origin
var r=Zt(this,t)
return r&&r.array[t&dr]}return e},Rt.prototype.set=function(t,e){return Vt(this,t,e)},Rt.prototype.remove=function(t){return this.has(t)?0===t?this.shift():t===this.size-1?this.pop():this.splice(t,1):this},Rt.prototype.insert=function(t,e){return this.splice(t,0,e)},Rt.prototype.clear=function(){return 0===this.size?this:this.__ownerID?(this.size=this._origin=this._capacity=0,this._level=lr,this._root=this._tail=null,this.__hash=void 0,this.__altered=!0,this):Ht()},Rt.prototype.push=function(){var t=arguments,e=this.size
return this.withMutations(function(r){Gt(r,0,e+t.length)
for(var n=0;n<t.length;n++)r.set(e+n,t[n])})},Rt.prototype.pop=function(){return Gt(this,0,-1)},Rt.prototype.unshift=function(){var t=arguments
return this.withMutations(function(e){Gt(e,-t.length)
for(var r=0;r<t.length;r++)e.set(r,t[r])})},Rt.prototype.shift=function(){return Gt(this,1)},Rt.prototype.merge=function(){return Yt(this,void 0,arguments)},Rt.prototype.mergeWith=function(t){return Yt(this,t,ar.call(arguments,1))},Rt.prototype.mergeDeep=function(){return Yt(this,Ot,arguments)},Rt.prototype.mergeDeepWith=function(t){var e=ar.call(arguments,1)
return Yt(this,Mt(t),e)},Rt.prototype.setSize=function(t){return Gt(this,0,t)},Rt.prototype.slice=function(t,e){var r=this.size
return y(t,e,r)?this:Gt(this,v(t,r),b(e,r))},Rt.prototype.__iterator=function(t,e){var r=0,n=Ft(this,e)
return new w(function(){var e=n()
return e===Zr?S():E(t,r++,e)})},Rt.prototype.__iterate=function(t,e){for(var r,n=0,i=Ft(this,e);(r=i())!==Zr&&!1!==t(r,n++,this););return n},Rt.prototype.__ensureOwner=function(t){return t===this.__ownerID?this:t?Kt(this._origin,this._capacity,this._level,this._root,this._tail,t,this.__hash):(this.__ownerID=t,this)},Rt.isList=Nt
var Vr="@@__IMMUTABLE_LIST__@@",Wr=Rt.prototype
Wr[Vr]=!0,Wr.delete=Wr.remove,Wr.setIn=Nr.setIn,Wr.deleteIn=Wr.removeIn=Nr.removeIn,Wr.update=Nr.update,Wr.updateIn=Nr.updateIn,Wr.mergeIn=Nr.mergeIn,Wr.mergeDeepIn=Nr.mergeDeepIn,Wr.withMutations=Nr.withMutations,Wr.asMutable=Nr.asMutable,Wr.asImmutable=Nr.asImmutable,Wr.wasAltered=Nr.wasAltered,Pt.prototype.removeBefore=function(t,e,r){if(r===e?1<<e:0===this.array.length)return this
var n=r>>>e&dr
if(n>=this.array.length)return new Pt([],t)
var i,o=0===n
if(e>0){var s=this.array[n]
if((i=s&&s.removeBefore(t,e-lr,r))===s&&o)return this}if(o&&!i)return this
var a=Jt(this,t)
if(!o)for(var f=0;f<n;f++)a.array[f]=void 0
return i&&(a.array[n]=i),a},Pt.prototype.removeAfter=function(t,e,r){if(r===(e?1<<e:0)||0===this.array.length)return this
var n=r-1>>>e&dr
if(n>=this.array.length)return this
var i
if(e>0){var o=this.array[n]
if((i=o&&o.removeAfter(t,e-lr,r))===o&&n===this.array.length-1)return this}var s=Jt(this,t)
return s.array.splice(n+1),i&&(s.array[n]=i),s}
var Jr,Zr={}
t($t,ht),$t.of=function(){return this(arguments)},$t.prototype.toString=function(){return this.__toString("OrderedMap {","}")},$t.prototype.get=function(t,e){var r=this._map.get(t)
return void 0!==r?this._list.get(r)[1]:e},$t.prototype.clear=function(){return 0===this.size?this:this.__ownerID?(this.size=0,this._map.clear(),this._list.clear(),this):ee()},$t.prototype.set=function(t,e){return re(this,t,e)},$t.prototype.remove=function(t){return re(this,t,_r)},$t.prototype.wasAltered=function(){return this._map.wasAltered()||this._list.wasAltered()},$t.prototype.__iterate=function(t,e){var r=this
return this._list.__iterate(function(e){return e&&t(e[1],e[0],r)},e)},$t.prototype.__iterator=function(t,e){return this._list.fromEntrySeq().__iterator(t,e)},$t.prototype.__ensureOwner=function(t){if(t===this.__ownerID)return this
var e=this._map.__ensureOwner(t),r=this._list.__ensureOwner(t)
return t?te(e,r,t,this.__hash):(this.__ownerID=t,this._map=e,this._list=r,this)},$t.isOrderedMap=Qt,$t.prototype[hr]=!0,$t.prototype.delete=$t.prototype.remove
var Gr
t(ne,j),ne.prototype.get=function(t,e){return this._iter.get(t,e)},ne.prototype.has=function(t){return this._iter.has(t)},ne.prototype.valueSeq=function(){return this._iter.valueSeq()},ne.prototype.reverse=function(){var t=this,e=ue(this,!0)
return this._useKeys||(e.valueSeq=function(){return t._iter.toSeq().reverse()}),e},ne.prototype.map=function(t,e){var r=this,n=fe(this,t,e)
return this._useKeys||(n.valueSeq=function(){return r._iter.toSeq().map(t,e)}),n},ne.prototype.__iterate=function(t,e){var r,n=this
return this._iter.__iterate(this._useKeys?function(e,r){return t(e,r,n)}:(r=e?Ie(this):0,function(i){return t(i,e?--r:r++,n)}),e)},ne.prototype.__iterator=function(t,e){if(this._useKeys)return this._iter.__iterator(t,e)
var r=this._iter.__iterator(br,e),n=e?Ie(this):0
return new w(function(){var i=r.next()
return i.done?i:E(t,e?--n:n++,i.value,i)})},ne.prototype[hr]=!0,t(ie,O),ie.prototype.includes=function(t){return this._iter.includes(t)},ie.prototype.__iterate=function(t,e){var r=this,n=0
return this._iter.__iterate(function(e){return t(e,n++,r)},e)},ie.prototype.__iterator=function(t,e){var r=this._iter.__iterator(br,e),n=0
return new w(function(){var e=r.next()
return e.done?e:E(t,n++,e.value,e)})},t(oe,M),oe.prototype.has=function(t){return this._iter.includes(t)},oe.prototype.__iterate=function(t,e){var r=this
return this._iter.__iterate(function(e){return t(e,e,r)},e)},oe.prototype.__iterator=function(t,e){var r=this._iter.__iterator(br,e)
return new w(function(){var e=r.next()
return e.done?e:E(t,e.value,e.value,e)})},t(se,j),se.prototype.entrySeq=function(){return this._iter.toSeq()},se.prototype.__iterate=function(t,e){var r=this
return this._iter.__iterate(function(e){if(e){xe(e)
var n=o(e)
return t(n?e.get(1):e[1],n?e.get(0):e[0],r)}},e)},se.prototype.__iterator=function(t,e){var r=this._iter.__iterator(br,e)
return new w(function(){for(;;){var e=r.next()
if(e.done)return e
var n=e.value
if(n){xe(n)
var i=o(n)
return E(t,i?n.get(0):n[0],i?n.get(1):n[1],e)}}})},ie.prototype.cacheResult=ne.prototype.cacheResult=oe.prototype.cacheResult=se.prototype.cacheResult=Ae,t(Me,et),Me.prototype.toString=function(){return this.__toString(Le(this)+" {","}")},Me.prototype.has=function(t){return this._defaultValues.hasOwnProperty(t)},Me.prototype.get=function(t,e){if(!this.has(t))return e
var r=this._defaultValues[t]
return this._map?this._map.get(t,r):r},Me.prototype.clear=function(){if(this.__ownerID)return this._map&&this._map.clear(),this
var t=this.constructor
return t._empty||(t._empty=ze(this,Et()))},Me.prototype.set=function(t,e){if(!this.has(t))throw new Error('Cannot set unknown key "'+t+'" on '+Le(this))
if(this._map&&!this._map.has(t)){if(e===this._defaultValues[t])return this}var r=this._map&&this._map.set(t,e)
return this.__ownerID||r===this._map?this:ze(this,r)},Me.prototype.remove=function(t){if(!this.has(t))return this
var e=this._map&&this._map.remove(t)
return this.__ownerID||e===this._map?this:ze(this,e)},Me.prototype.wasAltered=function(){return this._map.wasAltered()},Me.prototype.__iterator=function(t,e){var n=this
return r(this._defaultValues).map(function(t,e){return n.get(e)}).__iterator(t,e)},Me.prototype.__iterate=function(t,e){var n=this
return r(this._defaultValues).map(function(t,e){return n.get(e)}).__iterate(t,e)},Me.prototype.__ensureOwner=function(t){if(t===this.__ownerID)return this
var e=this._map&&this._map.__ensureOwner(t)
return t?ze(this,e,t):(this.__ownerID=t,this._map=e,this)}
var Yr=Me.prototype
Yr.delete=Yr.remove,Yr.deleteIn=Yr.removeIn=Nr.removeIn,Yr.merge=Nr.merge,Yr.mergeWith=Nr.mergeWith,Yr.mergeIn=Nr.mergeIn,Yr.mergeDeep=Nr.mergeDeep,Yr.mergeDeepWith=Nr.mergeDeepWith,Yr.mergeDeepIn=Nr.mergeDeepIn,Yr.setIn=Nr.setIn,Yr.update=Nr.update,Yr.updateIn=Nr.updateIn,Yr.withMutations=Nr.withMutations,Yr.asMutable=Nr.asMutable,Yr.asImmutable=Nr.asImmutable,t(De,nt),De.of=function(){return this(arguments)},De.fromKeys=function(t){return this(r(t).keySeq())},De.prototype.toString=function(){return this.__toString("Set {","}")},De.prototype.has=function(t){return this._map.has(t)},De.prototype.add=function(t){return Re(this,this._map.set(t,!0))},De.prototype.remove=function(t){return Re(this,this._map.remove(t))},De.prototype.clear=function(){return Re(this,this._map.clear())},De.prototype.union=function(){var t=ar.call(arguments,0)
return t=t.filter(function(t){return 0!==t.size}),0===t.length?this:0!==this.size||this.__ownerID||1!==t.length?this.withMutations(function(e){for(var r=0;r<t.length;r++)i(t[r]).forEach(function(t){return e.add(t)})}):this.constructor(t[0])},De.prototype.intersect=function(){var t=ar.call(arguments,0)
if(0===t.length)return this
t=t.map(function(t){return i(t)})
var e=this
return this.withMutations(function(r){e.forEach(function(e){t.every(function(t){return t.includes(e)})||r.remove(e)})})},De.prototype.subtract=function(){var t=ar.call(arguments,0)
if(0===t.length)return this
t=t.map(function(t){return i(t)})
var e=this
return this.withMutations(function(r){e.forEach(function(e){t.some(function(t){return t.includes(e)})&&r.remove(e)})})},De.prototype.merge=function(){return this.union.apply(this,arguments)},De.prototype.mergeWith=function(t){var e=ar.call(arguments,1)
return this.union.apply(this,e)},De.prototype.sort=function(t){return Fe(me(this,t))},De.prototype.sortBy=function(t,e){return Fe(me(this,e,t))},De.prototype.wasAltered=function(){return this._map.wasAltered()},De.prototype.__iterate=function(t,e){var r=this
return this._map.__iterate(function(e,n){return t(n,n,r)},e)},De.prototype.__iterator=function(t,e){return this._map.map(function(t,e){return e}).__iterator(t,e)},De.prototype.__ensureOwner=function(t){if(t===this.__ownerID)return this
var e=this._map.__ensureOwner(t)
return t?this.__make(e,t):(this.__ownerID=t,this._map=e,this)},De.isSet=Ue
var Xr="@@__IMMUTABLE_SET__@@",$r=De.prototype
$r[Xr]=!0,$r.delete=$r.remove,$r.mergeDeep=$r.merge,$r.mergeDeepWith=$r.mergeWith,$r.withMutations=Nr.withMutations,$r.asMutable=Nr.asMutable,$r.asImmutable=Nr.asImmutable,$r.__empty=Pe,$r.__make=Ne
var Qr
t(Fe,De),Fe.of=function(){return this(arguments)},Fe.fromKeys=function(t){return this(r(t).keySeq())},Fe.prototype.toString=function(){return this.__toString("OrderedSet {","}")},Fe.isOrderedSet=Ke
var tn=Fe.prototype
tn[hr]=!0,tn.__empty=Ve,tn.__make=He
var en
t(We,rt),We.of=function(){return this(arguments)},We.prototype.toString=function(){return this.__toString("Stack [","]")},We.prototype.get=function(t,e){var r=this._head
for(t=_(this,t);r&&t--;)r=r.next
return r?r.value:e},We.prototype.peek=function(){return this._head&&this._head.value},We.prototype.push=function(){if(0===arguments.length)return this
for(var t=this.size+arguments.length,e=this._head,r=arguments.length-1;r>=0;r--)e={value:arguments[r],next:e}
return this.__ownerID?(this.size=t,this._head=e,this.__hash=void 0,this.__altered=!0,this):Ze(t,e)},We.prototype.pushAll=function(t){if(t=n(t),0===t.size)return this
ct(t.size)
var e=this.size,r=this._head
return t.reverse().forEach(function(t){e++,r={value:t,next:r}}),this.__ownerID?(this.size=e,this._head=r,this.__hash=void 0,this.__altered=!0,this):Ze(e,r)},We.prototype.pop=function(){return this.slice(1)},We.prototype.unshift=function(){return this.push.apply(this,arguments)},We.prototype.unshiftAll=function(t){return this.pushAll(t)},We.prototype.shift=function(){return this.pop.apply(this,arguments)},We.prototype.clear=function(){return 0===this.size?this:this.__ownerID?(this.size=0,this._head=void 0,this.__hash=void 0,this.__altered=!0,this):Ge()},We.prototype.slice=function(t,e){if(y(t,e,this.size))return this
var r=v(t,this.size)
if(b(e,this.size)!==this.size)return rt.prototype.slice.call(this,t,e)
for(var n=this.size-r,i=this._head;r--;)i=i.next
return this.__ownerID?(this.size=n,this._head=i,this.__hash=void 0,this.__altered=!0,this):Ze(n,i)},We.prototype.__ensureOwner=function(t){return t===this.__ownerID?this:t?Ze(this.size,this._head,t,this.__hash):(this.__ownerID=t,this.__altered=!1,this)},We.prototype.__iterate=function(t,e){if(e)return this.reverse().__iterate(t)
for(var r=0,n=this._head;n&&!1!==t(n.value,r++,this);)n=n.next
return r},We.prototype.__iterator=function(t,e){if(e)return this.reverse().__iterator(t)
var r=0,n=this._head
return new w(function(){if(n){var e=n.value
return n=n.next,E(t,r++,e)}return S()})},We.isStack=Je
var rn="@@__IMMUTABLE_STACK__@@",nn=We.prototype
nn[rn]=!0,nn.withMutations=Nr.withMutations,nn.asMutable=Nr.asMutable,nn.asImmutable=Nr.asImmutable,nn.wasAltered=Nr.wasAltered
var on
e.Iterator=w,Ye(e,{toArray:function(){ct(this.size)
var t=new Array(this.size||0)
return this.valueSeq().__iterate(function(e,r){t[r]=e}),t},toIndexedSeq:function(){return new ie(this)},toJS:function(){return this.toSeq().map(function(t){return t&&"function"==typeof t.toJS?t.toJS():t}).__toJS()},toJSON:function(){return this.toSeq().map(function(t){return t&&"function"==typeof t.toJSON?t.toJSON():t}).__toJS()},toKeyedSeq:function(){return new ne(this,!0)},toMap:function(){return ht(this.toKeyedSeq())},toObject:function(){ct(this.size)
var t={}
return this.__iterate(function(e,r){t[r]=e}),t},toOrderedMap:function(){return $t(this.toKeyedSeq())},toOrderedSet:function(){return Fe(s(this)?this.valueSeq():this)},toSet:function(){return De(s(this)?this.valueSeq():this)},toSetSeq:function(){return new oe(this)},toSeq:function(){return a(this)?this.toIndexedSeq():s(this)?this.toKeyedSeq():this.toSetSeq()},toStack:function(){return We(s(this)?this.valueSeq():this)},toList:function(){return Rt(s(this)?this.valueSeq():this)},toString:function(){return"[Iterable]"},__toString:function(t,e){return 0===this.size?t+e:t+" "+this.toSeq().map(this.__toStringMapper).join(", ")+" "+e},concat:function(){return Be(this,ge(this,ar.call(arguments,0)))},includes:function(t){return this.some(function(e){return G(e,t)})},entries:function(){return this.__iterator(mr)},every:function(t,e){ct(this.size)
var r=!0
return this.__iterate(function(n,i,o){if(!t.call(e,n,i,o))return r=!1,!1}),r},filter:function(t,e){return Be(this,ce(this,t,e,!0))},find:function(t,e,r){var n=this.findEntry(t,e)
return n?n[1]:r},forEach:function(t,e){return ct(this.size),this.__iterate(e?t.bind(e):t)},join:function(t){ct(this.size),t=void 0!==t?""+t:","
var e="",r=!0
return this.__iterate(function(n){r?r=!1:e+=t,e+=null!==n&&void 0!==n?n.toString():""}),e},keys:function(){return this.__iterator(vr)},map:function(t,e){return Be(this,fe(this,t,e))},reduce:function(t,e,r){ct(this.size)
var n,i
return arguments.length<2?i=!0:n=e,this.__iterate(function(e,o,s){i?(i=!1,n=e):n=t.call(r,n,e,o,s)}),n},reduceRight:function(t,e,r){var n=this.toKeyedSeq().reverse()
return n.reduce.apply(n,arguments)},reverse:function(){return Be(this,ue(this,!0))},slice:function(t,e){return Be(this,pe(this,t,e,!0))},some:function(t,e){return!this.every(Qe(t),e)},sort:function(t){return Be(this,me(this,t))},values:function(){return this.__iterator(br)},butLast:function(){return this.slice(0,-1)},isEmpty:function(){return void 0!==this.size?0===this.size:!this.some(function(){return!0})},count:function(t,e){return d(t?this.toSeq().filter(t,e):this)},countBy:function(t,e){return he(this,t,e)},equals:function(t){return Y(this,t)},entrySeq:function(){var t=this
if(t._cache)return new z(t._cache)
var e=t.toSeq().map($e).toIndexedSeq()
return e.fromEntrySeq=function(){return t.toSeq()},e},filterNot:function(t,e){return this.filter(Qe(t),e)},findEntry:function(t,e,r){var n=r
return this.__iterate(function(r,i,o){if(t.call(e,r,i,o))return n=[i,r],!1}),n},findKey:function(t,e){var r=this.findEntry(t,e)
return r&&r[0]},findLast:function(t,e,r){return this.toKeyedSeq().reverse().find(t,e,r)},findLastEntry:function(t,e,r){return this.toKeyedSeq().reverse().findEntry(t,e,r)},findLastKey:function(t,e){return this.toKeyedSeq().reverse().findKey(t,e)},first:function(){return this.find(g)},flatMap:function(t,e){return Be(this,ve(this,t,e))},flatten:function(t){return Be(this,ye(this,t,!0))},fromEntrySeq:function(){return new se(this)},get:function(t,e){return this.find(function(e,r){return G(r,t)},void 0,e)},getIn:function(t,e){for(var r,n=this,i=Oe(t);!(r=i.next()).done;){var o=r.value
if((n=n&&n.get?n.get(o,_r):_r)===_r)return e}return n},groupBy:function(t,e){return le(this,t,e)},has:function(t){return this.get(t,_r)!==_r},hasIn:function(t){return this.getIn(t,_r)!==_r},isSubset:function(t){return t="function"==typeof t.includes?t:e(t),this.every(function(e){return t.includes(e)})},isSuperset:function(t){return t="function"==typeof t.isSubset?t:e(t),t.isSubset(this)},keyOf:function(t){return this.findKey(function(e){return G(e,t)})},keySeq:function(){return this.toSeq().map(Xe).toIndexedSeq()},last:function(){return this.toSeq().reverse().first()},lastKeyOf:function(t){return this.toKeyedSeq().reverse().keyOf(t)},max:function(t){return we(this,t)},maxBy:function(t,e){return we(this,e,t)},min:function(t){return we(this,t?tr(t):nr)},minBy:function(t,e){return we(this,e?tr(e):nr,t)},rest:function(){return this.slice(1)},skip:function(t){return this.slice(Math.max(0,t))},skipLast:function(t){return Be(this,this.toSeq().reverse().skip(t).reverse())},skipWhile:function(t,e){return Be(this,_e(this,t,e,!0))},skipUntil:function(t,e){return this.skipWhile(Qe(t),e)},sortBy:function(t,e){return Be(this,me(this,e,t))},take:function(t){return this.slice(0,Math.max(0,t))},takeLast:function(t){return Be(this,this.toSeq().reverse().take(t).reverse())},takeWhile:function(t,e){return Be(this,de(this,t,e))},takeUntil:function(t,e){return this.takeWhile(Qe(t),e)},valueSeq:function(){return this.toIndexedSeq()},hashCode:function(){return this.__hash||(this.__hash=ir(this))}})
var sn=e.prototype
sn[fr]=!0,sn[Sr]=sn.values,sn.__toJS=sn.toArray,sn.__toStringMapper=er,sn.inspect=sn.toSource=function(){return this.toString()},sn.chain=sn.flatMap,sn.contains=sn.includes,Ye(r,{flip:function(){return Be(this,ae(this))},mapEntries:function(t,e){var r=this,n=0
return Be(this,this.toSeq().map(function(i,o){return t.call(e,[o,i],n++,r)}).fromEntrySeq())},mapKeys:function(t,e){var r=this
return Be(this,this.toSeq().flip().map(function(n,i){return t.call(e,n,i,r)}).flip())}})
var an=r.prototype
return an[ur]=!0,an[Sr]=sn.entries,an.__toJS=sn.toObject,an.__toStringMapper=function(t,e){return JSON.stringify(e)+": "+er(t)},Ye(n,{toKeyedSeq:function(){return new ne(this,!1)},filter:function(t,e){return Be(this,ce(this,t,e,!1))},findIndex:function(t,e){var r=this.findEntry(t,e)
return r?r[0]:-1},indexOf:function(t){var e=this.keyOf(t)
return void 0===e?-1:e},lastIndexOf:function(t){var e=this.lastKeyOf(t)
return void 0===e?-1:e},reverse:function(){return Be(this,ue(this,!1))},slice:function(t,e){return Be(this,pe(this,t,e,!1))},splice:function(t,e){var r=arguments.length
if(e=Math.max(0|e,0),0===r||2===r&&!e)return this
t=v(t,t<0?this.count():this.size)
var n=this.slice(0,t)
return Be(this,1===r?n:n.concat(p(arguments,2),this.slice(t+e)))},findLastIndex:function(t,e){var r=this.findLastEntry(t,e)
return r?r[0]:-1},first:function(){return this.get(0)},flatten:function(t){return Be(this,ye(this,t,!1))},get:function(t,e){return t=_(this,t),t<0||this.size===1/0||void 0!==this.size&&t>this.size?e:this.find(function(e,r){return r===t},void 0,e)},has:function(t){return(t=_(this,t))>=0&&(void 0!==this.size?this.size===1/0||t<this.size:-1!==this.indexOf(t))},interpose:function(t){return Be(this,be(this,t))},interleave:function(){var t=[this].concat(p(arguments)),e=Se(this.toSeq(),O.of,t),r=e.flatten(!0)
return e.size&&(r.size=e.size*t.length),Be(this,r)},keySeq:function(){return Q(0,this.size)},last:function(){return this.get(-1)},skipWhile:function(t,e){return Be(this,_e(this,t,e,!1))},zip:function(){return Be(this,Se(this,rr,[this].concat(p(arguments))))},zipWith:function(t){var e=p(arguments)
return e[0]=this,Be(this,Se(this,t,e))}}),n.prototype[cr]=!0,n.prototype[hr]=!0,Ye(i,{get:function(t,e){return this.has(t)?t:e},includes:function(t){return this.has(t)},keySeq:function(){return this.valueSeq()}}),i.prototype.has=sn.includes,i.prototype.contains=i.prototype.includes,Ye(j,r.prototype),Ye(O,n.prototype),Ye(M,i.prototype),Ye(et,r.prototype),Ye(rt,n.prototype),Ye(nt,i.prototype),{Iterable:e,Seq:A,Collection:tt,Map:ht,OrderedMap:$t,List:Rt,Stack:We,Set:De,OrderedSet:Fe,Record:Me,Range:Q,Repeat:X,is:G,fromJS:V}})},{}],89:[function(t,e,r){"function"==typeof Object.create?e.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:e.exports=function(t,e){t.super_=e
var r=function(){}
r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}},{}],90:[function(t,e,r){!function(r,n){"function"==typeof define&&define.amd?define([],n):"function"==typeof t&&"object"==typeof e&&e&&e.exports?e.exports=n():(r.dcodeIO=r.dcodeIO||{}).Long=n()}(this,function(){"use strict"
function t(t,e,r){this.low=0|t,this.high=0|e,this.unsigned=!!r}function e(t){return!0===(t&&t.__isLong__)}function r(t,e){var r,n,o
return e?(t>>>=0,(o=0<=t&&t<256)&&(n=f[t])?n:(r=i(t,(0|t)<0?-1:0,!0),o&&(f[t]=r),r)):(t|=0,(o=-128<=t&&t<128)&&(n=a[t])?n:(r=i(t,t<0?-1:0,!1),o&&(a[t]=r),r))}function n(t,e){if(isNaN(t)||!isFinite(t))return e?_:d
if(e){if(t<0)return _
if(t>=h)return m}else{if(t<=-l)return w
if(t+1>=l)return b}return t<0?n(-t,e).neg():i(t%c|0,t/c|0,e)}function i(e,r,n){return new t(e,r,n)}function o(t,e,r){if(0===t.length)throw Error("empty string")
if("NaN"===t||"Infinity"===t||"+Infinity"===t||"-Infinity"===t)return d
if("number"==typeof e?(r=e,e=!1):e=!!e,(r=r||10)<2||36<r)throw RangeError("radix")
var i
if((i=t.indexOf("-"))>0)throw Error("interior hyphen")
if(0===i)return o(t.substring(1),e,r).neg()
for(var s=n(u(r,8)),a=d,f=0;f<t.length;f+=8){var c=Math.min(8,t.length-f),h=parseInt(t.substring(f,f+c),r)
if(c<8){var l=n(u(r,c))
a=a.mul(l).add(n(h))}else a=a.mul(s),a=a.add(n(h))}return a.unsigned=e,a}function s(e){return e instanceof t?e:"number"==typeof e?n(e):"string"==typeof e?o(e):i(e.low,e.high,e.unsigned)}t.prototype.__isLong__,Object.defineProperty(t.prototype,"__isLong__",{value:!0,enumerable:!1,configurable:!1}),t.isLong=e
var a={},f={}
t.fromInt=r,t.fromNumber=n,t.fromBits=i
var u=Math.pow
t.fromString=o,t.fromValue=s
var c=4294967296,h=c*c,l=h/2,p=r(1<<24),d=r(0)
t.ZERO=d
var _=r(0,!0)
t.UZERO=_
var g=r(1)
t.ONE=g
var y=r(1,!0)
t.UONE=y
var v=r(-1)
t.NEG_ONE=v
var b=i(-1,2147483647,!1)
t.MAX_VALUE=b
var m=i(-1,-1,!0)
t.MAX_UNSIGNED_VALUE=m
var w=i(0,-2147483648,!1)
t.MIN_VALUE=w
var E=t.prototype
return E.toInt=function(){return this.unsigned?this.low>>>0:this.low},E.toNumber=function(){return this.unsigned?(this.high>>>0)*c+(this.low>>>0):this.high*c+(this.low>>>0)},E.toString=function(t){if((t=t||10)<2||36<t)throw RangeError("radix")
if(this.isZero())return"0"
if(this.isNegative()){if(this.eq(w)){var e=n(t),r=this.div(e),i=r.mul(e).sub(this)
return r.toString(t)+i.toInt().toString(t)}return"-"+this.neg().toString(t)}for(var o=n(u(t,6),this.unsigned),s=this,a="";;){var f=s.div(o),c=s.sub(f.mul(o)).toInt()>>>0,h=c.toString(t)
if(s=f,s.isZero())return h+a
for(;h.length<6;)h="0"+h
a=""+h+a}},E.getHighBits=function(){return this.high},E.getHighBitsUnsigned=function(){return this.high>>>0},E.getLowBits=function(){return this.low},E.getLowBitsUnsigned=function(){return this.low>>>0},E.getNumBitsAbs=function(){if(this.isNegative())return this.eq(w)?64:this.neg().getNumBitsAbs()
for(var t=0!=this.high?this.high:this.low,e=31;e>0&&0==(t&1<<e);e--);return 0!=this.high?e+33:e+1},E.isZero=function(){return 0===this.high&&0===this.low},E.isNegative=function(){return!this.unsigned&&this.high<0},E.isPositive=function(){return this.unsigned||this.high>=0},E.isOdd=function(){return 1==(1&this.low)},E.isEven=function(){return 0==(1&this.low)},E.equals=function(t){return e(t)||(t=s(t)),(this.unsigned===t.unsigned||this.high>>>31!=1||t.high>>>31!=1)&&(this.high===t.high&&this.low===t.low)},E.eq=E.equals,E.notEquals=function(t){return!this.eq(t)},E.neq=E.notEquals,E.lessThan=function(t){return this.comp(t)<0},E.lt=E.lessThan,E.lessThanOrEqual=function(t){return this.comp(t)<=0},E.lte=E.lessThanOrEqual,E.greaterThan=function(t){return this.comp(t)>0},E.gt=E.greaterThan,E.greaterThanOrEqual=function(t){return this.comp(t)>=0},E.gte=E.greaterThanOrEqual,E.compare=function(t){if(e(t)||(t=s(t)),this.eq(t))return 0
var r=this.isNegative(),n=t.isNegative()
return r&&!n?-1:!r&&n?1:this.unsigned?t.high>>>0>this.high>>>0||t.high===this.high&&t.low>>>0>this.low>>>0?-1:1:this.sub(t).isNegative()?-1:1},E.comp=E.compare,E.negate=function(){return!this.unsigned&&this.eq(w)?w:this.not().add(g)},E.neg=E.negate,E.add=function(t){e(t)||(t=s(t))
var r=this.high>>>16,n=65535&this.high,o=this.low>>>16,a=65535&this.low,f=t.high>>>16,u=65535&t.high,c=t.low>>>16,h=65535&t.low,l=0,p=0,d=0,_=0
return _+=a+h,d+=_>>>16,_&=65535,d+=o+c,p+=d>>>16,d&=65535,p+=n+u,l+=p>>>16,p&=65535,l+=r+f,l&=65535,i(d<<16|_,l<<16|p,this.unsigned)},E.subtract=function(t){return e(t)||(t=s(t)),this.add(t.neg())},E.sub=E.subtract,E.multiply=function(t){if(this.isZero())return d
if(e(t)||(t=s(t)),t.isZero())return d
if(this.eq(w))return t.isOdd()?w:d
if(t.eq(w))return this.isOdd()?w:d
if(this.isNegative())return t.isNegative()?this.neg().mul(t.neg()):this.neg().mul(t).neg()
if(t.isNegative())return this.mul(t.neg()).neg()
if(this.lt(p)&&t.lt(p))return n(this.toNumber()*t.toNumber(),this.unsigned)
var r=this.high>>>16,o=65535&this.high,a=this.low>>>16,f=65535&this.low,u=t.high>>>16,c=65535&t.high,h=t.low>>>16,l=65535&t.low,_=0,g=0,y=0,v=0
return v+=f*l,y+=v>>>16,v&=65535,y+=a*l,g+=y>>>16,y&=65535,y+=f*h,g+=y>>>16,y&=65535,g+=o*l,_+=g>>>16,g&=65535,g+=a*h,_+=g>>>16,g&=65535,g+=f*c,_+=g>>>16,g&=65535,_+=r*l+o*h+a*c+f*u,_&=65535,i(y<<16|v,_<<16|g,this.unsigned)},E.mul=E.multiply,E.divide=function(t){if(e(t)||(t=s(t)),t.isZero())throw Error("division by zero")
if(this.isZero())return this.unsigned?_:d
var r,i,o
if(this.unsigned){if(t.unsigned||(t=t.toUnsigned()),t.gt(this))return _
if(t.gt(this.shru(1)))return y
o=_}else{if(this.eq(w)){if(t.eq(g)||t.eq(v))return w
if(t.eq(w))return g
return r=this.shr(1).div(t).shl(1),r.eq(d)?t.isNegative()?g:v:(i=this.sub(t.mul(r)),o=r.add(i.div(t)))}if(t.eq(w))return this.unsigned?_:d
if(this.isNegative())return t.isNegative()?this.neg().div(t.neg()):this.neg().div(t).neg()
if(t.isNegative())return this.div(t.neg()).neg()
o=d}for(i=this;i.gte(t);){r=Math.max(1,Math.floor(i.toNumber()/t.toNumber()))
for(var a=Math.ceil(Math.log(r)/Math.LN2),f=a<=48?1:u(2,a-48),c=n(r),h=c.mul(t);h.isNegative()||h.gt(i);)r-=f,c=n(r,this.unsigned),h=c.mul(t)
c.isZero()&&(c=g),o=o.add(c),i=i.sub(h)}return o},E.div=E.divide,E.modulo=function(t){return e(t)||(t=s(t)),this.sub(this.div(t).mul(t))},E.mod=E.modulo,E.not=function(){return i(~this.low,~this.high,this.unsigned)},E.and=function(t){return e(t)||(t=s(t)),i(this.low&t.low,this.high&t.high,this.unsigned)},E.or=function(t){return e(t)||(t=s(t)),i(this.low|t.low,this.high|t.high,this.unsigned)},E.xor=function(t){return e(t)||(t=s(t)),i(this.low^t.low,this.high^t.high,this.unsigned)},E.shiftLeft=function(t){return e(t)&&(t=t.toInt()),0==(t&=63)?this:t<32?i(this.low<<t,this.high<<t|this.low>>>32-t,this.unsigned):i(0,this.low<<t-32,this.unsigned)},E.shl=E.shiftLeft,E.shiftRight=function(t){return e(t)&&(t=t.toInt()),0==(t&=63)?this:t<32?i(this.low>>>t|this.high<<32-t,this.high>>t,this.unsigned):i(this.high>>t-32,this.high>=0?0:-1,this.unsigned)},E.shr=E.shiftRight,E.shiftRightUnsigned=function(t){if(e(t)&&(t=t.toInt()),0===(t&=63))return this
var r=this.high
if(t<32){return i(this.low>>>t|r<<32-t,r>>>t,this.unsigned)}return 32===t?i(r,0,this.unsigned):i(r>>>t-32,0,this.unsigned)},E.shru=E.shiftRightUnsigned,E.toSigned=function(){return this.unsigned?i(this.low,this.high,!1):this},E.toUnsigned=function(){return this.unsigned?this:i(this.low,this.high,!0)},E.toBytes=function(t){return t?this.toBytesLE():this.toBytesBE()},E.toBytesLE=function(){var t=this.high,e=this.low
return[255&e,e>>>8&255,e>>>16&255,e>>>24&255,255&t,t>>>8&255,t>>>16&255,t>>>24&255]},E.toBytesBE=function(){var t=this.high,e=this.low
return[t>>>24&255,t>>>16&255,t>>>8&255,255&t,e>>>24&255,e>>>16&255,e>>>8&255,255&e]},t})},{}],91:[function(t,e,r){(function(r){"use strict"
function n(){h.call(this,64),this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520}function i(t,e){return t<<e|t>>>32-e}function o(t,e,r,n,o,s,a,f){return i(t+(e^r^n)+s+a|0,f)+o|0}function s(t,e,r,n,o,s,a,f){return i(t+(e&r|~e&n)+s+a|0,f)+o|0}function a(t,e,r,n,o,s,a,f){return i(t+((e|~r)^n)+s+a|0,f)+o|0}function f(t,e,r,n,o,s,a,f){return i(t+(e&n|r&~n)+s+a|0,f)+o|0}function u(t,e,r,n,o,s,a,f){return i(t+(e^(r|~n))+s+a|0,f)+o|0}var c=t("inherits"),h=t("hash-base")
c(n,h),n.prototype._update=function(){for(var t=new Array(16),e=0;e<16;++e)t[e]=this._block.readInt32LE(4*e)
var r=this._a,n=this._b,c=this._c,h=this._d,l=this._e
r=o(r,n,c,h,l,t[0],0,11),c=i(c,10),l=o(l,r,n,c,h,t[1],0,14),n=i(n,10),h=o(h,l,r,n,c,t[2],0,15),r=i(r,10),c=o(c,h,l,r,n,t[3],0,12),l=i(l,10),n=o(n,c,h,l,r,t[4],0,5),h=i(h,10),r=o(r,n,c,h,l,t[5],0,8),c=i(c,10),l=o(l,r,n,c,h,t[6],0,7),n=i(n,10),h=o(h,l,r,n,c,t[7],0,9),r=i(r,10),c=o(c,h,l,r,n,t[8],0,11),l=i(l,10),n=o(n,c,h,l,r,t[9],0,13),h=i(h,10),r=o(r,n,c,h,l,t[10],0,14),c=i(c,10),l=o(l,r,n,c,h,t[11],0,15),n=i(n,10),h=o(h,l,r,n,c,t[12],0,6),r=i(r,10),c=o(c,h,l,r,n,t[13],0,7),l=i(l,10),n=o(n,c,h,l,r,t[14],0,9),h=i(h,10),r=o(r,n,c,h,l,t[15],0,8),c=i(c,10),l=s(l,r,n,c,h,t[7],1518500249,7),n=i(n,10),h=s(h,l,r,n,c,t[4],1518500249,6),r=i(r,10),c=s(c,h,l,r,n,t[13],1518500249,8),l=i(l,10),n=s(n,c,h,l,r,t[1],1518500249,13),h=i(h,10),r=s(r,n,c,h,l,t[10],1518500249,11),c=i(c,10),l=s(l,r,n,c,h,t[6],1518500249,9),n=i(n,10),h=s(h,l,r,n,c,t[15],1518500249,7),r=i(r,10),c=s(c,h,l,r,n,t[3],1518500249,15),l=i(l,10),n=s(n,c,h,l,r,t[12],1518500249,7),h=i(h,10),r=s(r,n,c,h,l,t[0],1518500249,12),c=i(c,10),l=s(l,r,n,c,h,t[9],1518500249,15),n=i(n,10),h=s(h,l,r,n,c,t[5],1518500249,9),r=i(r,10),c=s(c,h,l,r,n,t[2],1518500249,11),l=i(l,10),n=s(n,c,h,l,r,t[14],1518500249,7),h=i(h,10),r=s(r,n,c,h,l,t[11],1518500249,13),c=i(c,10),l=s(l,r,n,c,h,t[8],1518500249,12),n=i(n,10),h=a(h,l,r,n,c,t[3],1859775393,11),r=i(r,10),c=a(c,h,l,r,n,t[10],1859775393,13),l=i(l,10),n=a(n,c,h,l,r,t[14],1859775393,6),h=i(h,10),r=a(r,n,c,h,l,t[4],1859775393,7),c=i(c,10),l=a(l,r,n,c,h,t[9],1859775393,14),n=i(n,10),h=a(h,l,r,n,c,t[15],1859775393,9),r=i(r,10),c=a(c,h,l,r,n,t[8],1859775393,13),l=i(l,10),n=a(n,c,h,l,r,t[1],1859775393,15),h=i(h,10),r=a(r,n,c,h,l,t[2],1859775393,14),c=i(c,10),l=a(l,r,n,c,h,t[7],1859775393,8),n=i(n,10),h=a(h,l,r,n,c,t[0],1859775393,13),r=i(r,10),c=a(c,h,l,r,n,t[6],1859775393,6),l=i(l,10),n=a(n,c,h,l,r,t[13],1859775393,5),h=i(h,10),r=a(r,n,c,h,l,t[11],1859775393,12),c=i(c,10),l=a(l,r,n,c,h,t[5],1859775393,7),n=i(n,10),h=a(h,l,r,n,c,t[12],1859775393,5),r=i(r,10),c=f(c,h,l,r,n,t[1],2400959708,11),l=i(l,10),n=f(n,c,h,l,r,t[9],2400959708,12),h=i(h,10),r=f(r,n,c,h,l,t[11],2400959708,14),c=i(c,10),l=f(l,r,n,c,h,t[10],2400959708,15),n=i(n,10),h=f(h,l,r,n,c,t[0],2400959708,14),r=i(r,10),c=f(c,h,l,r,n,t[8],2400959708,15),l=i(l,10),n=f(n,c,h,l,r,t[12],2400959708,9),h=i(h,10),r=f(r,n,c,h,l,t[4],2400959708,8),c=i(c,10),l=f(l,r,n,c,h,t[13],2400959708,9),n=i(n,10),h=f(h,l,r,n,c,t[3],2400959708,14),r=i(r,10),c=f(c,h,l,r,n,t[7],2400959708,5),l=i(l,10),n=f(n,c,h,l,r,t[15],2400959708,6),h=i(h,10),r=f(r,n,c,h,l,t[14],2400959708,8),c=i(c,10),l=f(l,r,n,c,h,t[5],2400959708,6),n=i(n,10),h=f(h,l,r,n,c,t[6],2400959708,5),r=i(r,10),c=f(c,h,l,r,n,t[2],2400959708,12),l=i(l,10),n=u(n,c,h,l,r,t[4],2840853838,9),h=i(h,10),r=u(r,n,c,h,l,t[0],2840853838,15),c=i(c,10),l=u(l,r,n,c,h,t[5],2840853838,5),n=i(n,10),h=u(h,l,r,n,c,t[9],2840853838,11),r=i(r,10),c=u(c,h,l,r,n,t[7],2840853838,6),l=i(l,10),n=u(n,c,h,l,r,t[12],2840853838,8),h=i(h,10),r=u(r,n,c,h,l,t[2],2840853838,13),c=i(c,10),l=u(l,r,n,c,h,t[10],2840853838,12),n=i(n,10),h=u(h,l,r,n,c,t[14],2840853838,5),r=i(r,10),c=u(c,h,l,r,n,t[1],2840853838,12),l=i(l,10),n=u(n,c,h,l,r,t[3],2840853838,13),h=i(h,10),r=u(r,n,c,h,l,t[8],2840853838,14),c=i(c,10),l=u(l,r,n,c,h,t[11],2840853838,11),n=i(n,10),h=u(h,l,r,n,c,t[6],2840853838,8),r=i(r,10),c=u(c,h,l,r,n,t[15],2840853838,5),l=i(l,10),n=u(n,c,h,l,r,t[13],2840853838,6),h=i(h,10)
var p=this._a,d=this._b,_=this._c,g=this._d,y=this._e
p=u(p,d,_,g,y,t[5],1352829926,8),_=i(_,10),y=u(y,p,d,_,g,t[14],1352829926,9),d=i(d,10),g=u(g,y,p,d,_,t[7],1352829926,9),p=i(p,10),_=u(_,g,y,p,d,t[0],1352829926,11),y=i(y,10),d=u(d,_,g,y,p,t[9],1352829926,13),g=i(g,10),p=u(p,d,_,g,y,t[2],1352829926,15),_=i(_,10),y=u(y,p,d,_,g,t[11],1352829926,15),d=i(d,10),g=u(g,y,p,d,_,t[4],1352829926,5),p=i(p,10),_=u(_,g,y,p,d,t[13],1352829926,7),y=i(y,10),d=u(d,_,g,y,p,t[6],1352829926,7),g=i(g,10),p=u(p,d,_,g,y,t[15],1352829926,8),_=i(_,10),y=u(y,p,d,_,g,t[8],1352829926,11),d=i(d,10),g=u(g,y,p,d,_,t[1],1352829926,14),p=i(p,10),_=u(_,g,y,p,d,t[10],1352829926,14),y=i(y,10),d=u(d,_,g,y,p,t[3],1352829926,12),g=i(g,10),p=u(p,d,_,g,y,t[12],1352829926,6),_=i(_,10),y=f(y,p,d,_,g,t[6],1548603684,9),d=i(d,10),g=f(g,y,p,d,_,t[11],1548603684,13),p=i(p,10),_=f(_,g,y,p,d,t[3],1548603684,15),y=i(y,10),d=f(d,_,g,y,p,t[7],1548603684,7),g=i(g,10),p=f(p,d,_,g,y,t[0],1548603684,12),_=i(_,10),y=f(y,p,d,_,g,t[13],1548603684,8),d=i(d,10),g=f(g,y,p,d,_,t[5],1548603684,9),p=i(p,10),_=f(_,g,y,p,d,t[10],1548603684,11),y=i(y,10),d=f(d,_,g,y,p,t[14],1548603684,7),g=i(g,10),p=f(p,d,_,g,y,t[15],1548603684,7),_=i(_,10),y=f(y,p,d,_,g,t[8],1548603684,12),d=i(d,10),g=f(g,y,p,d,_,t[12],1548603684,7),p=i(p,10),_=f(_,g,y,p,d,t[4],1548603684,6),y=i(y,10),d=f(d,_,g,y,p,t[9],1548603684,15),g=i(g,10),p=f(p,d,_,g,y,t[1],1548603684,13),_=i(_,10),y=f(y,p,d,_,g,t[2],1548603684,11),d=i(d,10),g=a(g,y,p,d,_,t[15],1836072691,9),p=i(p,10),_=a(_,g,y,p,d,t[5],1836072691,7),y=i(y,10),d=a(d,_,g,y,p,t[1],1836072691,15),g=i(g,10),p=a(p,d,_,g,y,t[3],1836072691,11),_=i(_,10),y=a(y,p,d,_,g,t[7],1836072691,8),d=i(d,10),g=a(g,y,p,d,_,t[14],1836072691,6),p=i(p,10),_=a(_,g,y,p,d,t[6],1836072691,6),y=i(y,10),d=a(d,_,g,y,p,t[9],1836072691,14),g=i(g,10),p=a(p,d,_,g,y,t[11],1836072691,12),_=i(_,10),y=a(y,p,d,_,g,t[8],1836072691,13),d=i(d,10),g=a(g,y,p,d,_,t[12],1836072691,5),p=i(p,10),_=a(_,g,y,p,d,t[2],1836072691,14),y=i(y,10),d=a(d,_,g,y,p,t[10],1836072691,13),g=i(g,10),p=a(p,d,_,g,y,t[0],1836072691,13),_=i(_,10),y=a(y,p,d,_,g,t[4],1836072691,7),d=i(d,10),g=a(g,y,p,d,_,t[13],1836072691,5),p=i(p,10),_=s(_,g,y,p,d,t[8],2053994217,15),y=i(y,10),d=s(d,_,g,y,p,t[6],2053994217,5),g=i(g,10),p=s(p,d,_,g,y,t[4],2053994217,8),_=i(_,10),y=s(y,p,d,_,g,t[1],2053994217,11),d=i(d,10),g=s(g,y,p,d,_,t[3],2053994217,14),p=i(p,10),_=s(_,g,y,p,d,t[11],2053994217,14),y=i(y,10),d=s(d,_,g,y,p,t[15],2053994217,6),g=i(g,10),p=s(p,d,_,g,y,t[0],2053994217,14),_=i(_,10),y=s(y,p,d,_,g,t[5],2053994217,6),d=i(d,10),g=s(g,y,p,d,_,t[12],2053994217,9),p=i(p,10),_=s(_,g,y,p,d,t[2],2053994217,12),y=i(y,10),d=s(d,_,g,y,p,t[13],2053994217,9),g=i(g,10),p=s(p,d,_,g,y,t[9],2053994217,12),_=i(_,10),y=s(y,p,d,_,g,t[7],2053994217,5),d=i(d,10),g=s(g,y,p,d,_,t[10],2053994217,15),p=i(p,10),_=s(_,g,y,p,d,t[14],2053994217,8),y=i(y,10),d=o(d,_,g,y,p,t[12],0,8),g=i(g,10),p=o(p,d,_,g,y,t[15],0,5),_=i(_,10),y=o(y,p,d,_,g,t[10],0,12),d=i(d,10),g=o(g,y,p,d,_,t[4],0,9),p=i(p,10),_=o(_,g,y,p,d,t[1],0,12),y=i(y,10),d=o(d,_,g,y,p,t[5],0,5),g=i(g,10),p=o(p,d,_,g,y,t[8],0,14),_=i(_,10),y=o(y,p,d,_,g,t[7],0,6),d=i(d,10),g=o(g,y,p,d,_,t[6],0,8),p=i(p,10),_=o(_,g,y,p,d,t[2],0,13),y=i(y,10),d=o(d,_,g,y,p,t[13],0,6),g=i(g,10),p=o(p,d,_,g,y,t[14],0,5),_=i(_,10),y=o(y,p,d,_,g,t[0],0,15),d=i(d,10),g=o(g,y,p,d,_,t[3],0,13),p=i(p,10),_=o(_,g,y,p,d,t[9],0,11),y=i(y,10),d=o(d,_,g,y,p,t[11],0,11),g=i(g,10)
var v=this._b+c+g|0
this._b=this._c+h+y|0,this._c=this._d+l+p|0,this._d=this._e+r+d|0,this._e=this._a+n+_|0,this._a=v},n.prototype._digest=function(){this._block[this._blockOffset++]=128,this._blockOffset>56&&(this._block.fill(0,this._blockOffset,64),this._update(),this._blockOffset=0),this._block.fill(0,this._blockOffset,56),this._block.writeUInt32LE(this._length[0],56),this._block.writeUInt32LE(this._length[1],60),this._update()
var t=new r(20)
return t.writeInt32LE(this._a,0),t.writeInt32LE(this._b,4),t.writeInt32LE(this._c,8),t.writeInt32LE(this._d,12),t.writeInt32LE(this._e,16),t},e.exports=n}).call(this,t("buffer").Buffer)},{buffer:105,"hash-base":87,inherits:89}],92:[function(t,e,r){e.exports=t("buffer")},{buffer:105}],93:[function(t,e,r){(function(r,n){!function(i){"use strict"
function o(t,e){if(e=e||{type:"Array"},void 0!==r&&"number"==typeof r.pid)return s(t,e)
if(!window.crypto&&!window.msCrypto)throw new Error("Your browser does not support window.crypto.")
return a(t,e)}function s(e,r){var n=t("crypto"),i=n.randomBytes(e)
switch(r.type){case"Array":return[].slice.call(i)
case"Buffer":return i
case"Uint8Array":for(var o=new Uint8Array(e),s=0;s<e;++s)o[s]=i.readUInt8(s)
return o
default:throw new Error(r.type+" is unsupported.")}}function a(t,e){var r=new Uint8Array(t)
switch((window.crypto||window.msCrypto).getRandomValues(r),e.type){case"Array":return[].slice.call(r)
case"Buffer":try{new n(1)}catch(t){throw new Error("Buffer not supported in this environment. Use Node.js or Browserify for browser support.")}return new n(r)
case"Uint8Array":return r
default:throw new Error(e.type+" is unsupported.")}}"undefined"!=typeof define&&define.amd?define([],function(){return o}):void 0!==e&&e.exports?e.exports=o:i.secureRandom=o,o.randomArray=function(t){return o(t,{type:"Array"})},o.randomUint8Array=function(t){return o(t,{type:"Uint8Array"})},o.randomBuffer=function(t){return o(t,{type:"Buffer"})}}(this)}).call(this,t("_process"),t("buffer").Buffer)},{_process:113,buffer:105,crypto:104}],94:[function(t,e,r){function n(t,e){this._block=i.alloc(t),this._finalSize=e,this._blockSize=t,this._len=0}var i=t("safe-buffer").Buffer
n.prototype.update=function(t,e){"string"==typeof t&&(e=e||"utf8",t=i.from(t,e))
for(var r=this._block,n=this._blockSize,o=t.length,s=this._len,a=0;a<o;){for(var f=s%n,u=Math.min(o-a,n-f),c=0;c<u;c++)r[f+c]=t[a+c]
s+=u,a+=u,s%n==0&&this._update(r)}return this._len+=o,this},n.prototype.digest=function(t){var e=this._len%this._blockSize
this._block[e]=128,this._block.fill(0,e+1),e>=this._finalSize&&(this._update(this._block),this._block.fill(0))
var r=8*this._len
if(r<=4294967295)this._block.writeUInt32BE(r,this._blockSize-4)
else{var n=4294967295&r,i=(r-n)/4294967296
this._block.writeUInt32BE(i,this._blockSize-8),this._block.writeUInt32BE(n,this._blockSize-4)}this._update(this._block)
var o=this._hash()
return t?o.toString(t):o},n.prototype._update=function(){throw new Error("_update must be implemented by subclass")},e.exports=n},{"safe-buffer":92}],95:[function(t,e,r){var r=e.exports=function(t){t=t.toLowerCase()
var e=r[t]
if(!e)throw new Error(t+" is not supported (we accept pull requests)")
return new e}
r.sha=t("./sha"),r.sha1=t("./sha1"),r.sha224=t("./sha224"),r.sha256=t("./sha256"),r.sha384=t("./sha384"),r.sha512=t("./sha512")},{"./sha":96,"./sha1":97,"./sha224":98,"./sha256":99,"./sha384":100,"./sha512":101}],96:[function(t,e,r){function n(){this.init(),this._w=h,f.call(this,64,56)}function i(t){return t<<5|t>>>27}function o(t){return t<<30|t>>>2}function s(t,e,r,n){return 0===t?e&r|~e&n:2===t?e&r|e&n|r&n:e^r^n}var a=t("inherits"),f=t("./hash"),u=t("safe-buffer").Buffer,c=[1518500249,1859775393,-1894007588,-899497514],h=new Array(80)
a(n,f),n.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this},n.prototype._update=function(t){for(var e=this._w,r=0|this._a,n=0|this._b,a=0|this._c,f=0|this._d,u=0|this._e,h=0;h<16;++h)e[h]=t.readInt32BE(4*h)
for(;h<80;++h)e[h]=e[h-3]^e[h-8]^e[h-14]^e[h-16]
for(var l=0;l<80;++l){var p=~~(l/20),d=i(r)+s(p,n,a,f)+u+e[l]+c[p]|0
u=f,f=a,a=o(n),n=r,r=d}this._a=r+this._a|0,this._b=n+this._b|0,this._c=a+this._c|0,this._d=f+this._d|0,this._e=u+this._e|0},n.prototype._hash=function(){var t=u.allocUnsafe(20)
return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t},e.exports=n},{"./hash":94,inherits:89,"safe-buffer":92}],97:[function(t,e,r){function n(){this.init(),this._w=l,u.call(this,64,56)}function i(t){return t<<1|t>>>31}function o(t){return t<<5|t>>>27}function s(t){return t<<30|t>>>2}function a(t,e,r,n){return 0===t?e&r|~e&n:2===t?e&r|e&n|r&n:e^r^n}var f=t("inherits"),u=t("./hash"),c=t("safe-buffer").Buffer,h=[1518500249,1859775393,-1894007588,-899497514],l=new Array(80)
f(n,u),n.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this},n.prototype._update=function(t){for(var e=this._w,r=0|this._a,n=0|this._b,f=0|this._c,u=0|this._d,c=0|this._e,l=0;l<16;++l)e[l]=t.readInt32BE(4*l)
for(;l<80;++l)e[l]=i(e[l-3]^e[l-8]^e[l-14]^e[l-16])
for(var p=0;p<80;++p){var d=~~(p/20),_=o(r)+a(d,n,f,u)+c+e[p]+h[d]|0
c=u,u=f,f=s(n),n=r,r=_}this._a=r+this._a|0,this._b=n+this._b|0,this._c=f+this._c|0,this._d=u+this._d|0,this._e=c+this._e|0},n.prototype._hash=function(){var t=c.allocUnsafe(20)
return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t},e.exports=n},{"./hash":94,inherits:89,"safe-buffer":92}],98:[function(t,e,r){function n(){this.init(),this._w=f,s.call(this,64,56)}var i=t("inherits"),o=t("./sha256"),s=t("./hash"),a=t("safe-buffer").Buffer,f=new Array(64)
i(n,o),n.prototype.init=function(){return this._a=3238371032,this._b=914150663,this._c=812702999,this._d=4144912697,this._e=4290775857,this._f=1750603025,this._g=1694076839,this._h=3204075428,this},n.prototype._hash=function(){var t=a.allocUnsafe(28)
return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t},e.exports=n},{"./hash":94,"./sha256":99,inherits:89,"safe-buffer":92}],99:[function(t,e,r){function n(){this.init(),this._w=d,h.call(this,64,56)}function i(t,e,r){return r^t&(e^r)}function o(t,e,r){return t&e|r&(t|e)}function s(t){return(t>>>2|t<<30)^(t>>>13|t<<19)^(t>>>22|t<<10)}function a(t){return(t>>>6|t<<26)^(t>>>11|t<<21)^(t>>>25|t<<7)}function f(t){return(t>>>7|t<<25)^(t>>>18|t<<14)^t>>>3}function u(t){return(t>>>17|t<<15)^(t>>>19|t<<13)^t>>>10}var c=t("inherits"),h=t("./hash"),l=t("safe-buffer").Buffer,p=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],d=new Array(64)
c(n,h),n.prototype.init=function(){return this._a=1779033703,this._b=3144134277,this._c=1013904242,this._d=2773480762,this._e=1359893119,this._f=2600822924,this._g=528734635,this._h=1541459225,this},n.prototype._update=function(t){for(var e=this._w,r=0|this._a,n=0|this._b,c=0|this._c,h=0|this._d,l=0|this._e,d=0|this._f,_=0|this._g,g=0|this._h,y=0;y<16;++y)e[y]=t.readInt32BE(4*y)
for(;y<64;++y)e[y]=u(e[y-2])+e[y-7]+f(e[y-15])+e[y-16]|0
for(var v=0;v<64;++v){var b=g+a(l)+i(l,d,_)+p[v]+e[v]|0,m=s(r)+o(r,n,c)|0
g=_,_=d,d=l,l=h+b|0,h=c,c=n,n=r,r=b+m|0}this._a=r+this._a|0,this._b=n+this._b|0,this._c=c+this._c|0,this._d=h+this._d|0,this._e=l+this._e|0,this._f=d+this._f|0,this._g=_+this._g|0,this._h=g+this._h|0},n.prototype._hash=function(){var t=l.allocUnsafe(32)
return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t.writeInt32BE(this._h,28),t},e.exports=n},{"./hash":94,inherits:89,"safe-buffer":92}],100:[function(t,e,r){function n(){this.init(),this._w=f,s.call(this,128,112)}var i=t("inherits"),o=t("./sha512"),s=t("./hash"),a=t("safe-buffer").Buffer,f=new Array(160)
i(n,o),n.prototype.init=function(){return this._ah=3418070365,this._bh=1654270250,this._ch=2438529370,this._dh=355462360,this._eh=1731405415,this._fh=2394180231,this._gh=3675008525,this._hh=1203062813,this._al=3238371032,this._bl=914150663,this._cl=812702999,this._dl=4144912697,this._el=4290775857,this._fl=1750603025,this._gl=1694076839,this._hl=3204075428,this},n.prototype._hash=function(){function t(t,r,n){e.writeInt32BE(t,n),e.writeInt32BE(r,n+4)}var e=a.allocUnsafe(48)
return t(this._ah,this._al,0),t(this._bh,this._bl,8),t(this._ch,this._cl,16),t(this._dh,this._dl,24),t(this._eh,this._el,32),t(this._fh,this._fl,40),e},e.exports=n},{"./hash":94,"./sha512":101,inherits:89,"safe-buffer":92}],101:[function(t,e,r){function n(){this.init(),this._w=y,d.call(this,128,112)}function i(t,e,r){return r^t&(e^r)}function o(t,e,r){return t&e|r&(t|e)}function s(t,e){return(t>>>28|e<<4)^(e>>>2|t<<30)^(e>>>7|t<<25)}function a(t,e){return(t>>>14|e<<18)^(t>>>18|e<<14)^(e>>>9|t<<23)}function f(t,e){return(t>>>1|e<<31)^(t>>>8|e<<24)^t>>>7}function u(t,e){return(t>>>1|e<<31)^(t>>>8|e<<24)^(t>>>7|e<<25)}function c(t,e){return(t>>>19|e<<13)^(e>>>29|t<<3)^t>>>6}function h(t,e){return(t>>>19|e<<13)^(e>>>29|t<<3)^(t>>>6|e<<26)}function l(t,e){return t>>>0<e>>>0?1:0}var p=t("inherits"),d=t("./hash"),_=t("safe-buffer").Buffer,g=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],y=new Array(160)
p(n,d),n.prototype.init=function(){return this._ah=1779033703,this._bh=3144134277,this._ch=1013904242,this._dh=2773480762,this._eh=1359893119,this._fh=2600822924,this._gh=528734635,this._hh=1541459225,this._al=4089235720,this._bl=2227873595,this._cl=4271175723,this._dl=1595750129,this._el=2917565137,this._fl=725511199,this._gl=4215389547,this._hl=327033209,this},n.prototype._update=function(t){for(var e=this._w,r=0|this._ah,n=0|this._bh,p=0|this._ch,d=0|this._dh,_=0|this._eh,y=0|this._fh,v=0|this._gh,b=0|this._hh,m=0|this._al,w=0|this._bl,E=0|this._cl,S=0|this._dl,B=0|this._el,x=0|this._fl,I=0|this._gl,k=0|this._hl,T=0;T<32;T+=2)e[T]=t.readInt32BE(4*T),e[T+1]=t.readInt32BE(4*T+4)
for(;T<160;T+=2){var A=e[T-30],j=e[T-30+1],O=f(A,j),M=u(j,A)
A=e[T-4],j=e[T-4+1]
var z=c(A,j),L=h(j,A),C=e[T-14],q=e[T-14+1],D=e[T-32],U=e[T-32+1],R=M+q|0,N=O+C+l(R,M)|0
R=R+L|0,N=N+z+l(R,L)|0,R=R+U|0,N=N+D+l(R,U)|0,e[T]=N,e[T+1]=R}for(var P=0;P<160;P+=2){N=e[P],R=e[P+1]
var F=o(r,n,p),K=o(m,w,E),H=s(r,m),V=s(m,r),W=a(_,B),J=a(B,_),Z=g[P],G=g[P+1],Y=i(_,y,v),X=i(B,x,I),$=k+J|0,Q=b+W+l($,k)|0
$=$+X|0,Q=Q+Y+l($,X)|0,$=$+G|0,Q=Q+Z+l($,G)|0,$=$+R|0,Q=Q+N+l($,R)|0
var tt=V+K|0,et=H+F+l(tt,V)|0
b=v,k=I,v=y,I=x,y=_,x=B,B=S+$|0,_=d+Q+l(B,S)|0,d=p,S=E,p=n,E=w,n=r,w=m,m=$+tt|0,r=Q+et+l(m,$)|0}this._al=this._al+m|0,this._bl=this._bl+w|0,this._cl=this._cl+E|0,this._dl=this._dl+S|0,this._el=this._el+B|0,this._fl=this._fl+x|0,this._gl=this._gl+I|0,this._hl=this._hl+k|0,this._ah=this._ah+r+l(this._al,m)|0,this._bh=this._bh+n+l(this._bl,w)|0,this._ch=this._ch+p+l(this._cl,E)|0,this._dh=this._dh+d+l(this._dl,S)|0,this._eh=this._eh+_+l(this._el,B)|0,this._fh=this._fh+y+l(this._fl,x)|0,this._gh=this._gh+v+l(this._gl,I)|0,this._hh=this._hh+b+l(this._hl,k)|0},n.prototype._hash=function(){function t(t,r,n){e.writeInt32BE(t,n),e.writeInt32BE(r,n+4)}var e=_.allocUnsafe(64)
return t(this._ah,this._al,0),t(this._bh,this._bl,8),t(this._ch,this._cl,16),t(this._dh,this._dl,24),t(this._eh,this._el,32),t(this._fh,this._fl,40),t(this._gh,this._gl,48),t(this._hh,this._hl,56),e},e.exports=n},{"./hash":94,inherits:89,"safe-buffer":92}],102:[function(t,e,r){(function(r){"use strict"
function n(t,e){if(t===e)return 0
for(var r=t.length,n=e.length,i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i]
break}return r<n?-1:n<r?1:0}function i(t){return r.Buffer&&"function"==typeof r.Buffer.isBuffer?r.Buffer.isBuffer(t):!(null==t||!t._isBuffer)}function o(t){return Object.prototype.toString.call(t)}function s(t){return!i(t)&&("function"==typeof r.ArrayBuffer&&("function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):!!t&&(t instanceof DataView||!!(t.buffer&&t.buffer instanceof ArrayBuffer))))}function a(t){if(m.isFunction(t)){if(S)return t.name
var e=t.toString(),r=e.match(x)
return r&&r[1]}}function f(t,e){return"string"==typeof t?t.length<e?t:t.slice(0,e):t}function u(t){if(S||!m.isFunction(t))return m.inspect(t)
var e=a(t)
return"[Function"+(e?": "+e:"")+"]"}function c(t){return f(u(t.actual),128)+" "+t.operator+" "+f(u(t.expected),128)}function h(t,e,r,n,i){throw new B.AssertionError({message:r,actual:t,expected:e,operator:n,stackStartFunction:i})}function l(t,e){t||h(t,!0,e,"==",B.ok)}function p(t,e,r,a){if(t===e)return!0
if(i(t)&&i(e))return 0===n(t,e)
if(m.isDate(t)&&m.isDate(e))return t.getTime()===e.getTime()
if(m.isRegExp(t)&&m.isRegExp(e))return t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase
if(null!==t&&"object"==typeof t||null!==e&&"object"==typeof e){if(s(t)&&s(e)&&o(t)===o(e)&&!(t instanceof Float32Array||t instanceof Float64Array))return 0===n(new Uint8Array(t.buffer),new Uint8Array(e.buffer))
if(i(t)!==i(e))return!1
a=a||{actual:[],expected:[]}
var f=a.actual.indexOf(t)
return-1!==f&&f===a.expected.indexOf(e)||(a.actual.push(t),a.expected.push(e),_(t,e,r,a))}return r?t===e:t==e}function d(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function _(t,e,r,n){if(null===t||void 0===t||null===e||void 0===e)return!1
if(m.isPrimitive(t)||m.isPrimitive(e))return t===e
if(r&&Object.getPrototypeOf(t)!==Object.getPrototypeOf(e))return!1
var i=d(t),o=d(e)
if(i&&!o||!i&&o)return!1
if(i)return t=E.call(t),e=E.call(e),p(t,e,r)
var s,a,f=I(t),u=I(e)
if(f.length!==u.length)return!1
for(f.sort(),u.sort(),a=f.length-1;a>=0;a--)if(f[a]!==u[a])return!1
for(a=f.length-1;a>=0;a--)if(s=f[a],!p(t[s],e[s],r,n))return!1
return!0}function g(t,e,r){p(t,e,!0)&&h(t,e,r,"notDeepStrictEqual",g)}function y(t,e){if(!t||!e)return!1
if("[object RegExp]"==Object.prototype.toString.call(e))return e.test(t)
try{if(t instanceof e)return!0}catch(t){}return!Error.isPrototypeOf(e)&&!0===e.call({},t)}function v(t){var e
try{t()}catch(t){e=t}return e}function b(t,e,r,n){var i
if("function"!=typeof e)throw new TypeError('"block" argument must be a function')
"string"==typeof r&&(n=r,r=null),i=v(e),n=(r&&r.name?" ("+r.name+").":".")+(n?" "+n:"."),t&&!i&&h(i,r,"Missing expected exception"+n)
var o="string"==typeof n,s=!t&&m.isError(i),a=!t&&i&&!r
if((s&&o&&y(i,r)||a)&&h(i,r,"Got unwanted exception"+n),t&&i&&r&&!y(i,r)||!t&&i)throw i}var m=t("util/"),w=Object.prototype.hasOwnProperty,E=Array.prototype.slice,S=function(){return"foo"===function(){}.name}(),B=e.exports=l,x=/\s*function\s+([^\(\s]*)\s*/
B.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=c(this),this.generatedMessage=!0)
var e=t.stackStartFunction||h
if(Error.captureStackTrace)Error.captureStackTrace(this,e)
else{var r=new Error
if(r.stack){var n=r.stack,i=a(e),o=n.indexOf("\n"+i)
if(o>=0){var s=n.indexOf("\n",o+1)
n=n.substring(s+1)}this.stack=n}}},m.inherits(B.AssertionError,Error),B.fail=h,B.ok=l,B.equal=function(t,e,r){t!=e&&h(t,e,r,"==",B.equal)},B.notEqual=function(t,e,r){t==e&&h(t,e,r,"!=",B.notEqual)},B.deepEqual=function(t,e,r){p(t,e,!1)||h(t,e,r,"deepEqual",B.deepEqual)},B.deepStrictEqual=function(t,e,r){p(t,e,!0)||h(t,e,r,"deepStrictEqual",B.deepStrictEqual)},B.notDeepEqual=function(t,e,r){p(t,e,!1)&&h(t,e,r,"notDeepEqual",B.notDeepEqual)},B.notDeepStrictEqual=g,B.strictEqual=function(t,e,r){t!==e&&h(t,e,r,"===",B.strictEqual)},B.notStrictEqual=function(t,e,r){t===e&&h(t,e,r,"!==",B.notStrictEqual)},B.throws=function(t,e,r){b(!0,t,e,r)},B.doesNotThrow=function(t,e,r){b(!1,t,e,r)},B.ifError=function(t){if(t)throw t}
var I=Object.keys||function(t){var e=[]
for(var r in t)w.call(t,r)&&e.push(r)
return e}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"util/":133}],103:[function(t,e,r){"use strict"
function n(t){var e=t.length
if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4")
return"="===t[e-2]?2:"="===t[e-1]?1:0}function i(t){return 3*t.length/4-n(t)}function o(t){var e,r,i,o,s,a=t.length
o=n(t),s=new h(3*a/4-o),r=o>0?a-4:a
var f=0
for(e=0;e<r;e+=4)i=c[t.charCodeAt(e)]<<18|c[t.charCodeAt(e+1)]<<12|c[t.charCodeAt(e+2)]<<6|c[t.charCodeAt(e+3)],s[f++]=i>>16&255,s[f++]=i>>8&255,s[f++]=255&i
return 2===o?(i=c[t.charCodeAt(e)]<<2|c[t.charCodeAt(e+1)]>>4,s[f++]=255&i):1===o&&(i=c[t.charCodeAt(e)]<<10|c[t.charCodeAt(e+1)]<<4|c[t.charCodeAt(e+2)]>>2,s[f++]=i>>8&255,s[f++]=255&i),s}function s(t){return u[t>>18&63]+u[t>>12&63]+u[t>>6&63]+u[63&t]}function a(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16)+(t[o+1]<<8)+t[o+2],i.push(s(n))
return i.join("")}function f(t){for(var e,r=t.length,n=r%3,i="",o=[],s=0,f=r-n;s<f;s+=16383)o.push(a(t,s,s+16383>f?f:s+16383))
return 1===n?(e=t[r-1],i+=u[e>>2],i+=u[e<<4&63],i+="=="):2===n&&(e=(t[r-2]<<8)+t[r-1],i+=u[e>>10],i+=u[e>>4&63],i+=u[e<<2&63],i+="="),o.push(i),o.join("")}r.byteLength=i,r.toByteArray=o,r.fromByteArray=f
for(var u=[],c=[],h="undefined"!=typeof Uint8Array?Uint8Array:Array,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p=0,d=l.length;p<d;++p)u[p]=l[p],c[l.charCodeAt(p)]=p
c["-".charCodeAt(0)]=62,c["_".charCodeAt(0)]=63},{}],104:[function(t,e,r){},{}],105:[function(t,e,r){"use strict"
function n(t){if(t>Y)throw new RangeError("Invalid typed array length")
var e=new Uint8Array(t)
return e.__proto__=i.prototype,e}function i(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string")
return f(t)}return o(t,e,r)}function o(t,e,r){if("number"==typeof t)throw new TypeError('"value" argument must not be a number')
return V(t)?h(t,e,r):"string"==typeof t?u(t,e):l(t)}function s(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number')
if(t<0)throw new RangeError('"size" argument must not be negative')}function a(t,e,r){return s(t),t<=0?n(t):void 0!==e?"string"==typeof r?n(t).fill(e,r):n(t).fill(e):n(t)}function f(t){return s(t),n(t<0?0:0|p(t))}function u(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!i.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding')
var r=0|_(t,e),o=n(r),s=o.write(t,e)
return s!==r&&(o=o.slice(0,s)),o}function c(t){for(var e=t.length<0?0:0|p(t.length),r=n(e),i=0;i<e;i+=1)r[i]=255&t[i]
return r}function h(t,e,r){if(e<0||t.byteLength<e)throw new RangeError("'offset' is out of bounds")
if(t.byteLength<e+(r||0))throw new RangeError("'length' is out of bounds")
var n
return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),n.__proto__=i.prototype,n}function l(t){if(i.isBuffer(t)){var e=0|p(t.length),r=n(e)
return 0===r.length?r:(t.copy(r,0,0,e),r)}if(t){if(W(t)||"length"in t)return"number"!=typeof t.length||J(t.length)?n(0):c(t)
if("Buffer"===t.type&&Array.isArray(t.data))return c(t.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function p(t){if(t>=Y)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+Y.toString(16)+" bytes")
return 0|t}function d(t){return+t!=t&&(t=0),i.alloc(+t)}function _(t,e){if(i.isBuffer(t))return t.length
if(W(t)||V(t))return t.byteLength
"string"!=typeof t&&(t=""+t)
var r=t.length
if(0===r)return 0
for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r
case"utf8":case"utf-8":case void 0:return N(t).length
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r
case"hex":return r>>>1
case"base64":return K(t).length
default:if(n)return N(t).length
e=(""+e).toLowerCase(),n=!0}}function g(t,e,r){var n=!1
if((void 0===e||e<0)&&(e=0),e>this.length)return""
if((void 0===r||r>this.length)&&(r=this.length),r<=0)return""
if(r>>>=0,e>>>=0,r<=e)return""
for(t||(t="utf8");;)switch(t){case"hex":return O(this,e,r)
case"utf8":case"utf-8":return k(this,e,r)
case"ascii":return A(this,e,r)
case"latin1":case"binary":return j(this,e,r)
case"base64":return I(this,e,r)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,e,r)
default:if(n)throw new TypeError("Unknown encoding: "+t)
t=(t+"").toLowerCase(),n=!0}}function y(t,e,r){var n=t[e]
t[e]=t[r],t[r]=n}function v(t,e,r,n,o){if(0===t.length)return-1
if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,J(r)&&(r=o?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(o)return-1
r=t.length-1}else if(r<0){if(!o)return-1
r=0}if("string"==typeof e&&(e=i.from(e,n)),i.isBuffer(e))return 0===e.length?-1:b(t,e,r,n,o)
if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):b(t,[e],r,n,o)
throw new TypeError("val must be string, number or Buffer")}function b(t,e,r,n,i){function o(t,e){return 1===s?t[e]:t.readUInt16BE(e*s)}var s=1,a=t.length,f=e.length
if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1
s=2,a/=2,f/=2,r/=2}var u
if(i){var c=-1
for(u=r;u<a;u++)if(o(t,u)===o(e,-1===c?0:u-c)){if(-1===c&&(c=u),u-c+1===f)return c*s}else-1!==c&&(u-=u-c),c=-1}else for(r+f>a&&(r=a-f),u=r;u>=0;u--){for(var h=!0,l=0;l<f;l++)if(o(t,u+l)!==o(e,l)){h=!1
break}if(h)return u}return-1}function m(t,e,r,n){r=Number(r)||0
var i=t.length-r
n?(n=Number(n))>i&&(n=i):n=i
var o=e.length
if(o%2!=0)throw new TypeError("Invalid hex string")
n>o/2&&(n=o/2)
for(var s=0;s<n;++s){var a=parseInt(e.substr(2*s,2),16)
if(J(a))return s
t[r+s]=a}return s}function w(t,e,r,n){return H(N(e,t.length-r),t,r,n)}function E(t,e,r,n){return H(P(e),t,r,n)}function S(t,e,r,n){return E(t,e,r,n)}function B(t,e,r,n){return H(K(e),t,r,n)}function x(t,e,r,n){return H(F(e,t.length-r),t,r,n)}function I(t,e,r){return 0===e&&r===t.length?Z.fromByteArray(t):Z.fromByteArray(t.slice(e,r))}function k(t,e,r){r=Math.min(t.length,r)
for(var n=[],i=e;i<r;){var o=t[i],s=null,a=o>239?4:o>223?3:o>191?2:1
if(i+a<=r){var f,u,c,h
switch(a){case 1:o<128&&(s=o)
break
case 2:f=t[i+1],128==(192&f)&&(h=(31&o)<<6|63&f)>127&&(s=h)
break
case 3:f=t[i+1],u=t[i+2],128==(192&f)&&128==(192&u)&&(h=(15&o)<<12|(63&f)<<6|63&u)>2047&&(h<55296||h>57343)&&(s=h)
break
case 4:f=t[i+1],u=t[i+2],c=t[i+3],128==(192&f)&&128==(192&u)&&128==(192&c)&&(h=(15&o)<<18|(63&f)<<12|(63&u)<<6|63&c)>65535&&h<1114112&&(s=h)}}null===s?(s=65533,a=1):s>65535&&(s-=65536,n.push(s>>>10&1023|55296),s=56320|1023&s),n.push(s),i+=a}return T(n)}function T(t){var e=t.length
if(e<=X)return String.fromCharCode.apply(String,t)
for(var r="",n=0;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=X))
return r}function A(t,e,r){var n=""
r=Math.min(t.length,r)
for(var i=e;i<r;++i)n+=String.fromCharCode(127&t[i])
return n}function j(t,e,r){var n=""
r=Math.min(t.length,r)
for(var i=e;i<r;++i)n+=String.fromCharCode(t[i])
return n}function O(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n)
for(var i="",o=e;o<r;++o)i+=R(t[o])
return i}function M(t,e,r){for(var n=t.slice(e,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1])
return i}function z(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint")
if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function L(t,e,r,n,o,s){if(!i.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance')
if(e>o||e<s)throw new RangeError('"value" argument is out of bounds')
if(r+n>t.length)throw new RangeError("Index out of range")}function C(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range")
if(r<0)throw new RangeError("Index out of range")}function q(t,e,r,n,i){return e=+e,r>>>=0,i||C(t,e,r,4,3.4028234663852886e38,-3.4028234663852886e38),G.write(t,e,r,n,23,4),r+4}function D(t,e,r,n,i){return e=+e,r>>>=0,i||C(t,e,r,8,1.7976931348623157e308,-1.7976931348623157e308),G.write(t,e,r,n,52,8),r+8}function U(t){if(t=t.trim().replace($,""),t.length<2)return""
for(;t.length%4!=0;)t+="="
return t}function R(t){return t<16?"0"+t.toString(16):t.toString(16)}function N(t,e){e=e||1/0
for(var r,n=t.length,i=null,o=[],s=0;s<n;++s){if((r=t.charCodeAt(s))>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189)
continue}if(s+1===n){(e-=3)>-1&&o.push(239,191,189)
continue}i=r
continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r
continue}r=65536+(i-55296<<10|r-56320)}else i&&(e-=3)>-1&&o.push(239,191,189)
if(i=null,r<128){if((e-=1)<0)break
o.push(r)}else if(r<2048){if((e-=2)<0)break
o.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break
o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point")
if((e-=4)<0)break
o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function P(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r))
return e}function F(t,e){for(var r,n,i,o=[],s=0;s<t.length&&!((e-=2)<0);++s)r=t.charCodeAt(s),n=r>>8,i=r%256,o.push(i),o.push(n)
return o}function K(t){return Z.toByteArray(U(t))}function H(t,e,r,n){for(var i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i]
return i}function V(t){return t instanceof ArrayBuffer||null!=t&&null!=t.constructor&&"ArrayBuffer"===t.constructor.name&&"number"==typeof t.byteLength}function W(t){return"function"==typeof ArrayBuffer.isView&&ArrayBuffer.isView(t)}function J(t){return t!==t}var Z=t("base64-js"),G=t("ieee754")
r.Buffer=i,r.SlowBuffer=d,r.INSPECT_MAX_BYTES=50
var Y=2147483647
r.kMaxLength=Y,i.TYPED_ARRAY_SUPPORT=function(){try{var t=new Uint8Array(1)
return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()}catch(t){return!1}}(),i.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),"undefined"!=typeof Symbol&&Symbol.species&&i[Symbol.species]===i&&Object.defineProperty(i,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),i.poolSize=8192,i.from=function(t,e,r){return o(t,e,r)},i.prototype.__proto__=Uint8Array.prototype,i.__proto__=Uint8Array,i.alloc=function(t,e,r){return a(t,e,r)},i.allocUnsafe=function(t){return f(t)},i.allocUnsafeSlow=function(t){return f(t)},i.isBuffer=function(t){return null!=t&&!0===t._isBuffer},i.compare=function(t,e){if(!i.isBuffer(t)||!i.isBuffer(e))throw new TypeError("Arguments must be Buffers")
if(t===e)return 0
for(var r=t.length,n=e.length,o=0,s=Math.min(r,n);o<s;++o)if(t[o]!==e[o]){r=t[o],n=e[o]
break}return r<n?-1:n<r?1:0},i.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0
default:return!1}},i.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers')
if(0===t.length)return i.alloc(0)
var r
if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length
var n=i.allocUnsafe(e),o=0
for(r=0;r<t.length;++r){var s=t[r]
if(!i.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers')
s.copy(n,o),o+=s.length}return n},i.byteLength=_,i.prototype._isBuffer=!0,i.prototype.swap16=function(){var t=this.length
if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits")
for(var e=0;e<t;e+=2)y(this,e,e+1)
return this},i.prototype.swap32=function(){var t=this.length
if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits")
for(var e=0;e<t;e+=4)y(this,e,e+3),y(this,e+1,e+2)
return this},i.prototype.swap64=function(){var t=this.length
if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits")
for(var e=0;e<t;e+=8)y(this,e,e+7),y(this,e+1,e+6),y(this,e+2,e+5),y(this,e+3,e+4)
return this},i.prototype.toString=function(){var t=this.length
return 0===t?"":0===arguments.length?k(this,0,t):g.apply(this,arguments)},i.prototype.equals=function(t){if(!i.isBuffer(t))throw new TypeError("Argument must be a Buffer")
return this===t||0===i.compare(this,t)},i.prototype.inspect=function(){var t="",e=r.INSPECT_MAX_BYTES
return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},i.prototype.compare=function(t,e,r,n,o){if(!i.isBuffer(t))throw new TypeError("Argument must be a Buffer")
if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),e<0||r>t.length||n<0||o>this.length)throw new RangeError("out of range index")
if(n>=o&&e>=r)return 0
if(n>=o)return-1
if(e>=r)return 1
if(e>>>=0,r>>>=0,n>>>=0,o>>>=0,this===t)return 0
for(var s=o-n,a=r-e,f=Math.min(s,a),u=this.slice(n,o),c=t.slice(e,r),h=0;h<f;++h)if(u[h]!==c[h]){s=u[h],a=c[h]
break}return s<a?-1:a<s?1:0},i.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},i.prototype.indexOf=function(t,e,r){return v(this,t,e,r,!0)},i.prototype.lastIndexOf=function(t,e,r){return v(this,t,e,r,!1)},i.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0
else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0
else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")
e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var i=this.length-e
if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds")
n||(n="utf8")
for(var o=!1;;)switch(n){case"hex":return m(this,t,e,r)
case"utf8":case"utf-8":return w(this,t,e,r)
case"ascii":return E(this,t,e,r)
case"latin1":case"binary":return S(this,t,e,r)
case"base64":return B(this,t,e,r)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return x(this,t,e,r)
default:if(o)throw new TypeError("Unknown encoding: "+n)
n=(""+n).toLowerCase(),o=!0}},i.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}}
var X=4096
i.prototype.slice=function(t,e){var r=this.length
t=~~t,e=void 0===e?r:~~e,t<0?(t+=r)<0&&(t=0):t>r&&(t=r),e<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t)
var n=this.subarray(t,e)
return n.__proto__=i.prototype,n},i.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||z(t,e,this.length)
for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i
return n},i.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||z(t,e,this.length)
for(var n=this[t+--e],i=1;e>0&&(i*=256);)n+=this[t+--e]*i
return n},i.prototype.readUInt8=function(t,e){return t>>>=0,e||z(t,1,this.length),this[t]},i.prototype.readUInt16LE=function(t,e){return t>>>=0,e||z(t,2,this.length),this[t]|this[t+1]<<8},i.prototype.readUInt16BE=function(t,e){return t>>>=0,e||z(t,2,this.length),this[t]<<8|this[t+1]},i.prototype.readUInt32LE=function(t,e){return t>>>=0,e||z(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},i.prototype.readUInt32BE=function(t,e){return t>>>=0,e||z(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},i.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||z(t,e,this.length)
for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i
return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},i.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||z(t,e,this.length)
for(var n=e,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i
return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},i.prototype.readInt8=function(t,e){return t>>>=0,e||z(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},i.prototype.readInt16LE=function(t,e){t>>>=0,e||z(t,2,this.length)
var r=this[t]|this[t+1]<<8
return 32768&r?4294901760|r:r},i.prototype.readInt16BE=function(t,e){t>>>=0,e||z(t,2,this.length)
var r=this[t+1]|this[t]<<8
return 32768&r?4294901760|r:r},i.prototype.readInt32LE=function(t,e){return t>>>=0,e||z(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},i.prototype.readInt32BE=function(t,e){return t>>>=0,e||z(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},i.prototype.readFloatLE=function(t,e){return t>>>=0,e||z(t,4,this.length),G.read(this,t,!0,23,4)},i.prototype.readFloatBE=function(t,e){return t>>>=0,e||z(t,4,this.length),G.read(this,t,!1,23,4)},i.prototype.readDoubleLE=function(t,e){return t>>>=0,e||z(t,8,this.length),G.read(this,t,!0,52,8)},i.prototype.readDoubleBE=function(t,e){return t>>>=0,e||z(t,8,this.length),G.read(this,t,!1,52,8)},i.prototype.writeUIntLE=function(t,e,r,n){if(t=+t,e>>>=0,r>>>=0,!n){L(this,t,e,r,Math.pow(2,8*r)-1,0)}var i=1,o=0
for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255
return e+r},i.prototype.writeUIntBE=function(t,e,r,n){if(t=+t,e>>>=0,r>>>=0,!n){L(this,t,e,r,Math.pow(2,8*r)-1,0)}var i=r-1,o=1
for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255
return e+r},i.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,1,255,0),this[e]=255&t,e+1},i.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},i.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},i.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},i.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},i.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){var i=Math.pow(2,8*r-1)
L(this,t,e,r,i-1,-i)}var o=0,s=1,a=0
for(this[e]=255&t;++o<r&&(s*=256);)t<0&&0===a&&0!==this[e+o-1]&&(a=1),this[e+o]=(t/s>>0)-a&255
return e+r},i.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){var i=Math.pow(2,8*r-1)
L(this,t,e,r,i-1,-i)}var o=r-1,s=1,a=0
for(this[e+o]=255&t;--o>=0&&(s*=256);)t<0&&0===a&&0!==this[e+o+1]&&(a=1),this[e+o]=(t/s>>0)-a&255
return e+r},i.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},i.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},i.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},i.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},i.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||L(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},i.prototype.writeFloatLE=function(t,e,r){return q(this,t,e,!0,r)},i.prototype.writeFloatBE=function(t,e,r){return q(this,t,e,!1,r)},i.prototype.writeDoubleLE=function(t,e,r){return D(this,t,e,!0,r)},i.prototype.writeDoubleBE=function(t,e,r){return D(this,t,e,!1,r)},i.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0
if(0===t.length||0===this.length)return 0
if(e<0)throw new RangeError("targetStart out of bounds")
if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds")
if(n<0)throw new RangeError("sourceEnd out of bounds")
n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r)
var i,o=n-r
if(this===t&&r<e&&e<n)for(i=o-1;i>=0;--i)t[i+e]=this[i+r]
else if(o<1e3)for(i=0;i<o;++i)t[i+e]=this[i+r]
else Uint8Array.prototype.set.call(t,this.subarray(r,r+o),e)
return o},i.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var o=t.charCodeAt(0)
o<256&&(t=o)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string")
if("string"==typeof n&&!i.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255)
if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index")
if(r<=e)return this
e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0)
var s
if("number"==typeof t)for(s=e;s<r;++s)this[s]=t
else{var a=i.isBuffer(t)?t:new i(t,n),f=a.length
for(s=0;s<r-e;++s)this[s+e]=a[s%f]}return this}
var $=/[^+\/0-9A-Za-z-_]/g},{"base64-js":103,ieee754:108}],106:[function(t,e,r){(function(t){function e(t){return Array.isArray?Array.isArray(t):"[object Array]"===g(t)}function n(t){return"boolean"==typeof t}function i(t){return null===t}function o(t){return null==t}function s(t){return"number"==typeof t}function a(t){return"string"==typeof t}function f(t){return"symbol"==typeof t}function u(t){return void 0===t}function c(t){return"[object RegExp]"===g(t)}function h(t){return"object"==typeof t&&null!==t}function l(t){return"[object Date]"===g(t)}function p(t){return"[object Error]"===g(t)||t instanceof Error}function d(t){return"function"==typeof t}function _(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||void 0===t}function g(t){return Object.prototype.toString.call(t)}r.isArray=e,r.isBoolean=n,r.isNull=i,r.isNullOrUndefined=o,r.isNumber=s,r.isString=a,r.isSymbol=f,r.isUndefined=u,r.isRegExp=c,r.isObject=h,r.isDate=l,r.isError=p,r.isFunction=d,r.isPrimitive=_,r.isBuffer=t.isBuffer}).call(this,{isBuffer:t("../../is-buffer/index.js")})},{"../../is-buffer/index.js":110}],107:[function(t,e,r){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(t){return"function"==typeof t}function o(t){return"number"==typeof t}function s(t){return"object"==typeof t&&null!==t}function a(t){return void 0===t}e.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(t){if(!o(t)||t<0||isNaN(t))throw TypeError("n must be a positive number")
return this._maxListeners=t,this},n.prototype.emit=function(t){var e,r,n,o,f,u
if(this._events||(this._events={}),"error"===t&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if((e=arguments[1])instanceof Error)throw e
var c=new Error('Uncaught, unspecified "error" event. ('+e+")")
throw c.context=e,c}if(r=this._events[t],a(r))return!1
if(i(r))switch(arguments.length){case 1:r.call(this)
break
case 2:r.call(this,arguments[1])
break
case 3:r.call(this,arguments[1],arguments[2])
break
default:o=Array.prototype.slice.call(arguments,1),r.apply(this,o)}else if(s(r))for(o=Array.prototype.slice.call(arguments,1),u=r.slice(),n=u.length,f=0;f<n;f++)u[f].apply(this,o)
return!0},n.prototype.addListener=function(t,e){var r
if(!i(e))throw TypeError("listener must be a function")
return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",t,i(e.listener)?e.listener:e),this._events[t]?s(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,s(this._events[t])&&!this._events[t].warned&&(r=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners)&&r>0&&this._events[t].length>r&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),"function"==typeof console.trace&&console.trace()),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(t,e){function r(){this.removeListener(t,r),n||(n=!0,e.apply(this,arguments))}if(!i(e))throw TypeError("listener must be a function")
var n=!1
return r.listener=e,this.on(t,r),this},n.prototype.removeListener=function(t,e){var r,n,o,a
if(!i(e))throw TypeError("listener must be a function")
if(!this._events||!this._events[t])return this
if(r=this._events[t],o=r.length,n=-1,r===e||i(r.listener)&&r.listener===e)delete this._events[t],this._events.removeListener&&this.emit("removeListener",t,e)
else if(s(r)){for(a=o;a-- >0;)if(r[a]===e||r[a].listener&&r[a].listener===e){n=a
break}if(n<0)return this
1===r.length?(r.length=0,delete this._events[t]):r.splice(n,1),this._events.removeListener&&this.emit("removeListener",t,e)}return this},n.prototype.removeAllListeners=function(t){var e,r
if(!this._events)return this
if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[t]&&delete this._events[t],this
if(0===arguments.length){for(e in this._events)"removeListener"!==e&&this.removeAllListeners(e)
return this.removeAllListeners("removeListener"),this._events={},this}if(r=this._events[t],i(r))this.removeListener(t,r)
else if(r)for(;r.length;)this.removeListener(t,r[r.length-1])
return delete this._events[t],this},n.prototype.listeners=function(t){return this._events&&this._events[t]?i(this._events[t])?[this._events[t]]:this._events[t].slice():[]},n.prototype.listenerCount=function(t){if(this._events){var e=this._events[t]
if(i(e))return 1
if(e)return e.length}return 0},n.listenerCount=function(t,e){return t.listenerCount(e)}},{}],108:[function(t,e,r){r.read=function(t,e,r,n,i){var o,s,a=8*i-n-1,f=(1<<a)-1,u=f>>1,c=-7,h=r?i-1:0,l=r?-1:1,p=t[e+h]
for(h+=l,o=p&(1<<-c)-1,p>>=-c,c+=a;c>0;o=256*o+t[e+h],h+=l,c-=8);for(s=o&(1<<-c)-1,o>>=-c,c+=n;c>0;s=256*s+t[e+h],h+=l,c-=8);if(0===o)o=1-u
else{if(o===f)return s?NaN:1/0*(p?-1:1)
s+=Math.pow(2,n),o-=u}return(p?-1:1)*s*Math.pow(2,o-n)},r.write=function(t,e,r,n,i,o){var s,a,f,u=8*o-i-1,c=(1<<u)-1,h=c>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,_=e<0||0===e&&1/e<0?1:0
for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=c):(s=Math.floor(Math.log(e)/Math.LN2),e*(f=Math.pow(2,-s))<1&&(s--,f*=2),e+=s+h>=1?l/f:l*Math.pow(2,1-h),e*f>=2&&(s++,f/=2),s+h>=c?(a=0,s=c):s+h>=1?(a=(e*f-1)*Math.pow(2,i),s+=h):(a=e*Math.pow(2,h-1)*Math.pow(2,i),s=0));i>=8;t[r+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,u+=i;u>0;t[r+p]=255&s,p+=d,s/=256,u-=8);t[r+p-d]|=128*_}},{}],109:[function(t,e,r){arguments[4][89][0].apply(r,arguments)},{dup:89}],110:[function(t,e,r){function n(t){return!!t.constructor&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)}function i(t){return"function"==typeof t.readFloatLE&&"function"==typeof t.slice&&n(t.slice(0,0))}e.exports=function(t){return null!=t&&(n(t)||i(t)||!!t._isBuffer)}},{}],111:[function(t,e,r){var n={}.toString
e.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},{}],112:[function(t,e,r){(function(t){"use strict"
function r(e,r,n,i){if("function"!=typeof e)throw new TypeError('"callback" argument must be a function')
var o,s,a=arguments.length
switch(a){case 0:case 1:return t.nextTick(e)
case 2:return t.nextTick(function(){e.call(null,r)})
case 3:return t.nextTick(function(){e.call(null,r,n)})
case 4:return t.nextTick(function(){e.call(null,r,n,i)})
default:for(o=new Array(a-1),s=0;s<o.length;)o[s++]=arguments[s]
return t.nextTick(function(){e.apply(null,o)})}}!t.version||0===t.version.indexOf("v0.")||0===t.version.indexOf("v1.")&&0!==t.version.indexOf("v1.8.")?e.exports=r:e.exports=t.nextTick}).call(this,t("_process"))},{_process:113}],113:[function(t,e,r){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(t){if(h===setTimeout)return setTimeout(t,0)
if((h===n||!h)&&setTimeout)return h=setTimeout,setTimeout(t,0)
try{return h(t,0)}catch(e){try{return h.call(null,t,0)}catch(e){return h.call(this,t,0)}}}function s(t){if(l===clearTimeout)return clearTimeout(t)
if((l===i||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(t)
try{return l(t)}catch(e){try{return l.call(null,t)}catch(e){return l.call(this,t)}}}function a(){g&&d&&(g=!1,d.length?_=d.concat(_):y=-1,_.length&&f())}function f(){if(!g){var t=o(a)
g=!0
for(var e=_.length;e;){for(d=_,_=[];++y<e;)d&&d[y].run()
y=-1,e=_.length}d=null,g=!1,s(t)}}function u(t,e){this.fun=t,this.array=e}function c(){}var h,l,p=e.exports={}
!function(){try{h="function"==typeof setTimeout?setTimeout:n}catch(t){h=n}try{l="function"==typeof clearTimeout?clearTimeout:i}catch(t){l=i}}()
var d,_=[],g=!1,y=-1
p.nextTick=function(t){var e=new Array(arguments.length-1)
if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r]
_.push(new u(t,e)),1!==_.length||g||o(f)},u.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=c,p.addListener=c,p.once=c,p.off=c,p.removeListener=c,p.removeAllListeners=c,p.emit=c,p.prependListener=c,p.prependOnceListener=c,p.listeners=function(t){return[]},p.binding=function(t){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(t){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},{}],114:[function(t,e,r){e.exports=t("./lib/_stream_duplex.js")},{"./lib/_stream_duplex.js":115}],115:[function(t,e,r){"use strict"
function n(t){if(!(this instanceof n))return new n(t)
u.call(this,t),c.call(this,t),t&&!1===t.readable&&(this.readable=!1),t&&!1===t.writable&&(this.writable=!1),this.allowHalfOpen=!0,t&&!1===t.allowHalfOpen&&(this.allowHalfOpen=!1),this.once("end",i)}function i(){this.allowHalfOpen||this._writableState.ended||s(o,this)}function o(t){t.end()}var s=t("process-nextick-args"),a=Object.keys||function(t){var e=[]
for(var r in t)e.push(r)
return e}
e.exports=n
var f=t("core-util-is")
f.inherits=t("inherits")
var u=t("./_stream_readable"),c=t("./_stream_writable")
f.inherits(n,u)
for(var h=a(c.prototype),l=0;l<h.length;l++){var p=h[l]
n.prototype[p]||(n.prototype[p]=c.prototype[p])}Object.defineProperty(n.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed&&this._writableState.destroyed)},set:function(t){void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed=t,this._writableState.destroyed=t)}}),n.prototype._destroy=function(t,e){this.push(null),this.end(),s(e,t)}},{"./_stream_readable":117,"./_stream_writable":119,"core-util-is":106,inherits:109,"process-nextick-args":112}],116:[function(t,e,r){"use strict"
function n(t){if(!(this instanceof n))return new n(t)
i.call(this,t)}e.exports=n
var i=t("./_stream_transform"),o=t("core-util-is")
o.inherits=t("inherits"),o.inherits(n,i),n.prototype._transform=function(t,e,r){r(null,t)}},{"./_stream_transform":118,"core-util-is":106,inherits:109}],117:[function(t,e,r){(function(r,n){"use strict"
function i(t){return D.from(t)}function o(t){return D.isBuffer(t)||t instanceof U}function s(t,e,r){if("function"==typeof t.prependListener)return t.prependListener(e,r)
t._events&&t._events[e]?L(t._events[e])?t._events[e].unshift(r):t._events[e]=[r,t._events[e]]:t.on(e,r)}function a(e,r){z=z||t("./_stream_duplex"),e=e||{},this.objectMode=!!e.objectMode,r instanceof z&&(this.objectMode=this.objectMode||!!e.readableObjectMode)
var n=e.highWaterMark,i=this.objectMode?16:16384
this.highWaterMark=n||0===n?n:i,this.highWaterMark=Math.floor(this.highWaterMark),this.buffer=new K,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.destroyed=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(F||(F=t("string_decoder/").StringDecoder),this.decoder=new F(e.encoding),this.encoding=e.encoding)}function f(e){if(z=z||t("./_stream_duplex"),!(this instanceof f))return new f(e)
this._readableState=new a(e,this),this.readable=!0,e&&("function"==typeof e.read&&(this._read=e.read),"function"==typeof e.destroy&&(this._destroy=e.destroy)),q.call(this)}function u(t,e,r,n,o){var s=t._readableState
if(null===e)s.reading=!1,_(t,s)
else{var a
o||(a=h(s,e)),a?t.emit("error",a):s.objectMode||e&&e.length>0?("string"==typeof e||s.objectMode||Object.getPrototypeOf(e)===D.prototype||(e=i(e)),n?s.endEmitted?t.emit("error",new Error("stream.unshift() after end event")):c(t,s,e,!0):s.ended?t.emit("error",new Error("stream.push() after EOF")):(s.reading=!1,s.decoder&&!r?(e=s.decoder.write(e),s.objectMode||0!==e.length?c(t,s,e,!1):v(t,s)):c(t,s,e,!1))):n||(s.reading=!1)}return l(s)}function c(t,e,r,n){e.flowing&&0===e.length&&!e.sync?(t.emit("data",r),t.read(0)):(e.length+=e.objectMode?1:r.length,n?e.buffer.unshift(r):e.buffer.push(r),e.needReadable&&g(t)),v(t,e)}function h(t,e){var r
return o(e)||"string"==typeof e||void 0===e||t.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}function l(t){return!t.ended&&(t.needReadable||t.length<t.highWaterMark||0===t.length)}function p(t){return t>=W?t=W:(t--,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t++),t}function d(t,e){return t<=0||0===e.length&&e.ended?0:e.objectMode?1:t!==t?e.flowing&&e.length?e.buffer.head.data.length:e.length:(t>e.highWaterMark&&(e.highWaterMark=p(t)),t<=e.length?t:e.ended?e.length:(e.needReadable=!0,0))}function _(t,e){if(!e.ended){if(e.decoder){var r=e.decoder.end()
r&&r.length&&(e.buffer.push(r),e.length+=e.objectMode?1:r.length)}e.ended=!0,g(t)}}function g(t){var e=t._readableState
e.needReadable=!1,e.emittedReadable||(P("emitReadable",e.flowing),e.emittedReadable=!0,e.sync?M(y,t):y(t))}function y(t){P("emit readable"),t.emit("readable"),B(t)}function v(t,e){e.readingMore||(e.readingMore=!0,M(b,t,e))}function b(t,e){for(var r=e.length;!e.reading&&!e.flowing&&!e.ended&&e.length<e.highWaterMark&&(P("maybeReadMore read 0"),t.read(0),r!==e.length);)r=e.length
e.readingMore=!1}function m(t){return function(){var e=t._readableState
P("pipeOnDrain",e.awaitDrain),e.awaitDrain&&e.awaitDrain--,0===e.awaitDrain&&C(t,"data")&&(e.flowing=!0,B(t))}}function w(t){P("readable nexttick read 0"),t.read(0)}function E(t,e){e.resumeScheduled||(e.resumeScheduled=!0,M(S,t,e))}function S(t,e){e.reading||(P("resume read 0"),t.read(0)),e.resumeScheduled=!1,e.awaitDrain=0,t.emit("resume"),B(t),e.flowing&&!e.reading&&t.read(0)}function B(t){var e=t._readableState
for(P("flow",e.flowing);e.flowing&&null!==t.read(););}function x(t,e){if(0===e.length)return null
var r
return e.objectMode?r=e.buffer.shift():!t||t>=e.length?(r=e.decoder?e.buffer.join(""):1===e.buffer.length?e.buffer.head.data:e.buffer.concat(e.length),e.buffer.clear()):r=I(t,e.buffer,e.decoder),r}function I(t,e,r){var n
return t<e.head.data.length?(n=e.head.data.slice(0,t),e.head.data=e.head.data.slice(t)):n=t===e.head.data.length?e.shift():r?k(t,e):T(t,e),n}function k(t,e){var r=e.head,n=1,i=r.data
for(t-=i.length;r=r.next;){var o=r.data,s=t>o.length?o.length:t
if(s===o.length?i+=o:i+=o.slice(0,t),0===(t-=s)){s===o.length?(++n,r.next?e.head=r.next:e.head=e.tail=null):(e.head=r,r.data=o.slice(s))
break}++n}return e.length-=n,i}function T(t,e){var r=D.allocUnsafe(t),n=e.head,i=1
for(n.data.copy(r),t-=n.data.length;n=n.next;){var o=n.data,s=t>o.length?o.length:t
if(o.copy(r,r.length-t,0,s),0===(t-=s)){s===o.length?(++i,n.next?e.head=n.next:e.head=e.tail=null):(e.head=n,n.data=o.slice(s))
break}++i}return e.length-=i,r}function A(t){var e=t._readableState
if(e.length>0)throw new Error('"endReadable()" called on non-empty stream')
e.endEmitted||(e.ended=!0,M(j,e,t))}function j(t,e){t.endEmitted||0!==t.length||(t.endEmitted=!0,e.readable=!1,e.emit("end"))}function O(t,e){for(var r=0,n=t.length;r<n;r++)if(t[r]===e)return r
return-1}var M=t("process-nextick-args")
e.exports=f
var z,L=t("isarray")
f.ReadableState=a
var C=(t("events").EventEmitter,function(t,e){return t.listeners(e).length}),q=t("./internal/streams/stream"),D=t("safe-buffer").Buffer,U=n.Uint8Array||function(){},R=t("core-util-is")
R.inherits=t("inherits")
var N=t("util"),P=void 0
P=N&&N.debuglog?N.debuglog("stream"):function(){}
var F,K=t("./internal/streams/BufferList"),H=t("./internal/streams/destroy")
R.inherits(f,q)
var V=["error","close","destroy","pause","resume"]
Object.defineProperty(f.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&this._readableState.destroyed},set:function(t){this._readableState&&(this._readableState.destroyed=t)}}),f.prototype.destroy=H.destroy,f.prototype._undestroy=H.undestroy,f.prototype._destroy=function(t,e){this.push(null),e(t)},f.prototype.push=function(t,e){var r,n=this._readableState
return n.objectMode?r=!0:"string"==typeof t&&(e=e||n.defaultEncoding,e!==n.encoding&&(t=D.from(t,e),e=""),r=!0),u(this,t,e,!1,r)},f.prototype.unshift=function(t){return u(this,t,null,!0,!1)},f.prototype.isPaused=function(){return!1===this._readableState.flowing},f.prototype.setEncoding=function(e){return F||(F=t("string_decoder/").StringDecoder),this._readableState.decoder=new F(e),this._readableState.encoding=e,this}
var W=8388608
f.prototype.read=function(t){P("read",t),t=parseInt(t,10)
var e=this._readableState,r=t
if(0!==t&&(e.emittedReadable=!1),0===t&&e.needReadable&&(e.length>=e.highWaterMark||e.ended))return P("read: emitReadable",e.length,e.ended),0===e.length&&e.ended?A(this):g(this),null
if(0===(t=d(t,e))&&e.ended)return 0===e.length&&A(this),null
var n=e.needReadable
P("need readable",n),(0===e.length||e.length-t<e.highWaterMark)&&(n=!0,P("length less than watermark",n)),e.ended||e.reading?(n=!1,P("reading or ended",n)):n&&(P("do read"),e.reading=!0,e.sync=!0,0===e.length&&(e.needReadable=!0),this._read(e.highWaterMark),e.sync=!1,e.reading||(t=d(r,e)))
var i
return i=t>0?x(t,e):null,null===i?(e.needReadable=!0,t=0):e.length-=t,0===e.length&&(e.ended||(e.needReadable=!0),r!==t&&e.ended&&A(this)),null!==i&&this.emit("data",i),i},f.prototype._read=function(t){this.emit("error",new Error("_read() is not implemented"))},f.prototype.pipe=function(t,e){function n(t,e){P("onunpipe"),t===l&&e&&!1===e.hasUnpiped&&(e.hasUnpiped=!0,o())}function i(){P("onend"),t.end()}function o(){P("cleanup"),t.removeListener("close",u),t.removeListener("finish",c),t.removeListener("drain",g),t.removeListener("error",f),t.removeListener("unpipe",n),l.removeListener("end",i),l.removeListener("end",h),l.removeListener("data",a),y=!0,!p.awaitDrain||t._writableState&&!t._writableState.needDrain||g()}function a(e){P("ondata"),v=!1,!1!==t.write(e)||v||((1===p.pipesCount&&p.pipes===t||p.pipesCount>1&&-1!==O(p.pipes,t))&&!y&&(P("false write response, pause",l._readableState.awaitDrain),l._readableState.awaitDrain++,v=!0),l.pause())}function f(e){P("onerror",e),h(),t.removeListener("error",f),0===C(t,"error")&&t.emit("error",e)}function u(){t.removeListener("finish",c),h()}function c(){P("onfinish"),t.removeListener("close",u),h()}function h(){P("unpipe"),l.unpipe(t)}var l=this,p=this._readableState
switch(p.pipesCount){case 0:p.pipes=t
break
case 1:p.pipes=[p.pipes,t]
break
default:p.pipes.push(t)}p.pipesCount+=1,P("pipe count=%d opts=%j",p.pipesCount,e)
var d=(!e||!1!==e.end)&&t!==r.stdout&&t!==r.stderr,_=d?i:h
p.endEmitted?M(_):l.once("end",_),t.on("unpipe",n)
var g=m(l)
t.on("drain",g)
var y=!1,v=!1
return l.on("data",a),s(t,"error",f),t.once("close",u),t.once("finish",c),t.emit("pipe",l),p.flowing||(P("pipe resume"),l.resume()),t},f.prototype.unpipe=function(t){var e=this._readableState,r={hasUnpiped:!1}
if(0===e.pipesCount)return this
if(1===e.pipesCount)return t&&t!==e.pipes?this:(t||(t=e.pipes),e.pipes=null,e.pipesCount=0,e.flowing=!1,t&&t.emit("unpipe",this,r),this)
if(!t){var n=e.pipes,i=e.pipesCount
e.pipes=null,e.pipesCount=0,e.flowing=!1
for(var o=0;o<i;o++)n[o].emit("unpipe",this,r)
return this}var s=O(e.pipes,t)
return-1===s?this:(e.pipes.splice(s,1),e.pipesCount-=1,1===e.pipesCount&&(e.pipes=e.pipes[0]),t.emit("unpipe",this,r),this)},f.prototype.on=function(t,e){var r=q.prototype.on.call(this,t,e)
if("data"===t)!1!==this._readableState.flowing&&this.resume()
else if("readable"===t){var n=this._readableState
n.endEmitted||n.readableListening||(n.readableListening=n.needReadable=!0,n.emittedReadable=!1,n.reading?n.length&&g(this):M(w,this))}return r},f.prototype.addListener=f.prototype.on,f.prototype.resume=function(){var t=this._readableState
return t.flowing||(P("resume"),t.flowing=!0,E(this,t)),this},f.prototype.pause=function(){return P("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(P("pause"),this._readableState.flowing=!1,this.emit("pause")),this},f.prototype.wrap=function(t){var e=this._readableState,r=!1,n=this
t.on("end",function(){if(P("wrapped end"),e.decoder&&!e.ended){var t=e.decoder.end()
t&&t.length&&n.push(t)}n.push(null)}),t.on("data",function(i){if(P("wrapped data"),e.decoder&&(i=e.decoder.write(i)),(!e.objectMode||null!==i&&void 0!==i)&&(e.objectMode||i&&i.length)){n.push(i)||(r=!0,t.pause())}})
for(var i in t)void 0===this[i]&&"function"==typeof t[i]&&(this[i]=function(e){return function(){return t[e].apply(t,arguments)}}(i))
for(var o=0;o<V.length;o++)t.on(V[o],n.emit.bind(n,V[o]))
return n._read=function(e){P("wrapped _read",e),r&&(r=!1,t.resume())},n},f._fromList=x}).call(this,t("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./_stream_duplex":115,"./internal/streams/BufferList":120,"./internal/streams/destroy":121,"./internal/streams/stream":122,_process:113,"core-util-is":106,events:107,inherits:109,isarray:111,"process-nextick-args":112,"safe-buffer":127,"string_decoder/":129,util:104}],118:[function(t,e,r){"use strict"
function n(t){this.afterTransform=function(e,r){return i(t,e,r)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null,this.writeencoding=null}function i(t,e,r){var n=t._transformState
n.transforming=!1
var i=n.writecb
if(!i)return t.emit("error",new Error("write callback called multiple times"))
n.writechunk=null,n.writecb=null,null!==r&&void 0!==r&&t.push(r),i(e)
var o=t._readableState
o.reading=!1,(o.needReadable||o.length<o.highWaterMark)&&t._read(o.highWaterMark)}function o(t){if(!(this instanceof o))return new o(t)
a.call(this,t),this._transformState=new n(this)
var e=this
this._readableState.needReadable=!0,this._readableState.sync=!1,t&&("function"==typeof t.transform&&(this._transform=t.transform),"function"==typeof t.flush&&(this._flush=t.flush)),this.once("prefinish",function(){"function"==typeof this._flush?this._flush(function(t,r){s(e,t,r)}):s(e)})}function s(t,e,r){if(e)return t.emit("error",e)
null!==r&&void 0!==r&&t.push(r)
var n=t._writableState,i=t._transformState
if(n.length)throw new Error("Calling transform done when ws.length != 0")
if(i.transforming)throw new Error("Calling transform done when still transforming")
return t.push(null)}e.exports=o
var a=t("./_stream_duplex"),f=t("core-util-is")
f.inherits=t("inherits"),f.inherits(o,a),o.prototype.push=function(t,e){return this._transformState.needTransform=!1,a.prototype.push.call(this,t,e)},o.prototype._transform=function(t,e,r){throw new Error("_transform() is not implemented")},o.prototype._write=function(t,e,r){var n=this._transformState
if(n.writecb=r,n.writechunk=t,n.writeencoding=e,!n.transforming){var i=this._readableState;(n.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},o.prototype._read=function(t){var e=this._transformState
null!==e.writechunk&&e.writecb&&!e.transforming?(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform)):e.needTransform=!0},o.prototype._destroy=function(t,e){var r=this
a.prototype._destroy.call(this,t,function(t){e(t),r.emit("close")})}},{"./_stream_duplex":115,"core-util-is":106,inherits:109}],119:[function(t,e,r){(function(r,n){"use strict"
function i(t){var e=this
this.next=null,this.entry=null,this.finish=function(){I(e,t)}}function o(t){return z.from(t)}function s(t){return z.isBuffer(t)||t instanceof L}function a(){}function f(e,r){T=T||t("./_stream_duplex"),e=e||{},this.objectMode=!!e.objectMode,r instanceof T&&(this.objectMode=this.objectMode||!!e.writableObjectMode)
var n=e.highWaterMark,o=this.objectMode?16:16384
this.highWaterMark=n||0===n?n:o,this.highWaterMark=Math.floor(this.highWaterMark),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1
var s=!1===e.decodeStrings
this.decodeStrings=!s,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(t){y(r,t)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new i(this)}function u(e){if(T=T||t("./_stream_duplex"),!(q.call(u,this)||this instanceof T))return new u(e)
this._writableState=new f(e,this),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev),"function"==typeof e.destroy&&(this._destroy=e.destroy),"function"==typeof e.final&&(this._final=e.final)),M.call(this)}function c(t,e){var r=new Error("write after end")
t.emit("error",r),k(e,r)}function h(t,e,r,n){var i=!0,o=!1
return null===r?o=new TypeError("May not write null values to stream"):"string"==typeof r||void 0===r||e.objectMode||(o=new TypeError("Invalid non-string/buffer chunk")),o&&(t.emit("error",o),k(n,o),i=!1),i}function l(t,e,r){return t.objectMode||!1===t.decodeStrings||"string"!=typeof e||(e=z.from(e,r)),e}function p(t,e,r,n,i,o){if(!r){var s=l(e,n,i)
n!==s&&(r=!0,i="buffer",n=s)}var a=e.objectMode?1:n.length
e.length+=a
var f=e.length<e.highWaterMark
if(f||(e.needDrain=!0),e.writing||e.corked){var u=e.lastBufferedRequest
e.lastBufferedRequest={chunk:n,encoding:i,isBuf:r,callback:o,next:null},u?u.next=e.lastBufferedRequest:e.bufferedRequest=e.lastBufferedRequest,e.bufferedRequestCount+=1}else d(t,e,!1,a,n,i,o)
return f}function d(t,e,r,n,i,o,s){e.writelen=n,e.writecb=s,e.writing=!0,e.sync=!0,r?t._writev(i,e.onwrite):t._write(i,o,e.onwrite),e.sync=!1}function _(t,e,r,n,i){--e.pendingcb,r?(k(i,n),k(B,t,e),t._writableState.errorEmitted=!0,t.emit("error",n)):(i(n),t._writableState.errorEmitted=!0,t.emit("error",n),B(t,e))}function g(t){t.writing=!1,t.writecb=null,t.length-=t.writelen,t.writelen=0}function y(t,e){var r=t._writableState,n=r.sync,i=r.writecb
if(g(r),e)_(t,r,n,e,i)
else{var o=w(r)
o||r.corked||r.bufferProcessing||!r.bufferedRequest||m(t,r),n?A(v,t,r,o,i):v(t,r,o,i)}}function v(t,e,r,n){r||b(t,e),e.pendingcb--,n(),B(t,e)}function b(t,e){0===e.length&&e.needDrain&&(e.needDrain=!1,t.emit("drain"))}function m(t,e){e.bufferProcessing=!0
var r=e.bufferedRequest
if(t._writev&&r&&r.next){var n=e.bufferedRequestCount,o=new Array(n),s=e.corkedRequestsFree
s.entry=r
for(var a=0,f=!0;r;)o[a]=r,r.isBuf||(f=!1),r=r.next,a+=1
o.allBuffers=f,d(t,e,!0,e.length,o,"",s.finish),e.pendingcb++,e.lastBufferedRequest=null,s.next?(e.corkedRequestsFree=s.next,s.next=null):e.corkedRequestsFree=new i(e)}else{for(;r;){var u=r.chunk,c=r.encoding,h=r.callback
if(d(t,e,!1,e.objectMode?1:u.length,u,c,h),r=r.next,e.writing)break}null===r&&(e.lastBufferedRequest=null)}e.bufferedRequestCount=0,e.bufferedRequest=r,e.bufferProcessing=!1}function w(t){return t.ending&&0===t.length&&null===t.bufferedRequest&&!t.finished&&!t.writing}function E(t,e){t._final(function(r){e.pendingcb--,r&&t.emit("error",r),e.prefinished=!0,t.emit("prefinish"),B(t,e)})}function S(t,e){e.prefinished||e.finalCalled||("function"==typeof t._final?(e.pendingcb++,e.finalCalled=!0,k(E,t,e)):(e.prefinished=!0,t.emit("prefinish")))}function B(t,e){var r=w(e)
return r&&(S(t,e),0===e.pendingcb&&(e.finished=!0,t.emit("finish"))),r}function x(t,e,r){e.ending=!0,B(t,e),r&&(e.finished?k(r):t.once("finish",r)),e.ended=!0,t.writable=!1}function I(t,e,r){var n=t.entry
for(t.entry=null;n;){var i=n.callback
e.pendingcb--,i(r),n=n.next}e.corkedRequestsFree?e.corkedRequestsFree.next=t:e.corkedRequestsFree=t}var k=t("process-nextick-args")
e.exports=u
var T,A=!r.browser&&["v0.10","v0.9."].indexOf(r.version.slice(0,5))>-1?setImmediate:k
u.WritableState=f
var j=t("core-util-is")
j.inherits=t("inherits")
var O={deprecate:t("util-deprecate")},M=t("./internal/streams/stream"),z=t("safe-buffer").Buffer,L=n.Uint8Array||function(){},C=t("./internal/streams/destroy")
j.inherits(u,M),f.prototype.getBuffer=function(){for(var t=this.bufferedRequest,e=[];t;)e.push(t),t=t.next
return e},function(){try{Object.defineProperty(f.prototype,"buffer",{get:O.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch(t){}}()
var q
"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(q=Function.prototype[Symbol.hasInstance],Object.defineProperty(u,Symbol.hasInstance,{value:function(t){return!!q.call(this,t)||t&&t._writableState instanceof f}})):q=function(t){return t instanceof this},u.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"))},u.prototype.write=function(t,e,r){var n=this._writableState,i=!1,f=s(t)&&!n.objectMode
return f&&!z.isBuffer(t)&&(t=o(t)),"function"==typeof e&&(r=e,e=null),f?e="buffer":e||(e=n.defaultEncoding),"function"!=typeof r&&(r=a),n.ended?c(this,r):(f||h(this,n,t,r))&&(n.pendingcb++,i=p(this,n,f,t,e,r)),i},u.prototype.cork=function(){this._writableState.corked++},u.prototype.uncork=function(){var t=this._writableState
t.corked&&(t.corked--,t.writing||t.corked||t.finished||t.bufferProcessing||!t.bufferedRequest||m(this,t))},u.prototype.setDefaultEncoding=function(t){if("string"==typeof t&&(t=t.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((t+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+t)
return this._writableState.defaultEncoding=t,this},u.prototype._write=function(t,e,r){r(new Error("_write() is not implemented"))},u.prototype._writev=null,u.prototype.end=function(t,e,r){var n=this._writableState
"function"==typeof t?(r=t,t=null,e=null):"function"==typeof e&&(r=e,e=null),null!==t&&void 0!==t&&this.write(t,e),n.corked&&(n.corked=1,this.uncork()),n.ending||n.finished||x(this,n,r)},Object.defineProperty(u.prototype,"destroyed",{get:function(){return void 0!==this._writableState&&this._writableState.destroyed},set:function(t){this._writableState&&(this._writableState.destroyed=t)}}),u.prototype.destroy=C.destroy,u.prototype._undestroy=C.undestroy,u.prototype._destroy=function(t,e){this.end(),e(t)}}).call(this,t("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./_stream_duplex":115,"./internal/streams/destroy":121,"./internal/streams/stream":122,_process:113,"core-util-is":106,inherits:109,"process-nextick-args":112,"safe-buffer":127,"util-deprecate":130}],120:[function(t,e,r){"use strict"
function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,r){t.copy(e,r)}var o=t("safe-buffer").Buffer
e.exports=function(){function t(){n(this,t),this.head=null,this.tail=null,this.length=0}return t.prototype.push=function(t){var e={data:t,next:null}
this.length>0?this.tail.next=e:this.head=e,this.tail=e,++this.length},t.prototype.unshift=function(t){var e={data:t,next:this.head}
0===this.length&&(this.tail=e),this.head=e,++this.length},t.prototype.shift=function(){if(0!==this.length){var t=this.head.data
return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,t}},t.prototype.clear=function(){this.head=this.tail=null,this.length=0},t.prototype.join=function(t){if(0===this.length)return""
for(var e=this.head,r=""+e.data;e=e.next;)r+=t+e.data
return r},t.prototype.concat=function(t){if(0===this.length)return o.alloc(0)
if(1===this.length)return this.head.data
for(var e=o.allocUnsafe(t>>>0),r=this.head,n=0;r;)i(r.data,e,n),n+=r.data.length,r=r.next
return e},t}()},{"safe-buffer":127}],121:[function(t,e,r){"use strict"
function n(t,e){var r=this,n=this._readableState&&this._readableState.destroyed,i=this._writableState&&this._writableState.destroyed
if(n||i)return void(e?e(t):!t||this._writableState&&this._writableState.errorEmitted||s(o,this,t))
this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(t||null,function(t){!e&&t?(s(o,r,t),r._writableState&&(r._writableState.errorEmitted=!0)):e&&e(t)})}function i(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function o(t,e){t.emit("error",e)}var s=t("process-nextick-args")
e.exports={destroy:n,undestroy:i}},{"process-nextick-args":112}],122:[function(t,e,r){e.exports=t("events").EventEmitter},{events:107}],123:[function(t,e,r){e.exports=t("./readable").PassThrough},{"./readable":124}],124:[function(t,e,r){r=e.exports=t("./lib/_stream_readable.js"),r.Stream=r,r.Readable=r,r.Writable=t("./lib/_stream_writable.js"),r.Duplex=t("./lib/_stream_duplex.js"),r.Transform=t("./lib/_stream_transform.js"),r.PassThrough=t("./lib/_stream_passthrough.js")},{"./lib/_stream_duplex.js":115,"./lib/_stream_passthrough.js":116,"./lib/_stream_readable.js":117,"./lib/_stream_transform.js":118,"./lib/_stream_writable.js":119}],125:[function(t,e,r){e.exports=t("./readable").Transform},{"./readable":124}],126:[function(t,e,r){e.exports=t("./lib/_stream_writable.js")},{"./lib/_stream_writable.js":119}],127:[function(t,e,r){function n(t,e){for(var r in t)e[r]=t[r]}function i(t,e,r){return s(t,e,r)}var o=t("buffer"),s=o.Buffer
s.from&&s.alloc&&s.allocUnsafe&&s.allocUnsafeSlow?e.exports=o:(n(o,r),r.Buffer=i),n(s,i),i.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number")
return s(t,e,r)},i.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number")
var n=s(t)
return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n},i.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number")
return s(t)},i.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number")
return o.SlowBuffer(t)}},{buffer:105}],128:[function(t,e,r){function n(){i.call(this)}e.exports=n
var i=t("events").EventEmitter
t("inherits")(n,i),n.Readable=t("readable-stream/readable.js"),n.Writable=t("readable-stream/writable.js"),n.Duplex=t("readable-stream/duplex.js"),n.Transform=t("readable-stream/transform.js"),n.PassThrough=t("readable-stream/passthrough.js"),n.Stream=n,n.prototype.pipe=function(t,e){function r(e){t.writable&&!1===t.write(e)&&u.pause&&u.pause()}function n(){u.readable&&u.resume&&u.resume()}function o(){c||(c=!0,t.end())}function s(){c||(c=!0,"function"==typeof t.destroy&&t.destroy())}function a(t){if(f(),0===i.listenerCount(this,"error"))throw t}function f(){u.removeListener("data",r),t.removeListener("drain",n),u.removeListener("end",o),u.removeListener("close",s),u.removeListener("error",a),t.removeListener("error",a),u.removeListener("end",f),u.removeListener("close",f),t.removeListener("close",f)}var u=this
u.on("data",r),t.on("drain",n),t._isStdio||e&&!1===e.end||(u.on("end",o),u.on("close",s))
var c=!1
return u.on("error",a),t.on("error",a),u.on("end",f),u.on("close",f),t.on("close",f),t.emit("pipe",u),t}},{events:107,inherits:109,"readable-stream/duplex.js":114,"readable-stream/passthrough.js":123,"readable-stream/readable.js":124,"readable-stream/transform.js":125,"readable-stream/writable.js":126}],129:[function(t,e,r){"use strict"
function n(t){if(!t)return"utf8"
for(var e;;)switch(t){case"utf8":case"utf-8":return"utf8"
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le"
case"latin1":case"binary":return"latin1"
case"base64":case"ascii":case"hex":return t
default:if(e)return
t=(""+t).toLowerCase(),e=!0}}function i(t){var e=n(t)
if("string"!=typeof e&&(v.isEncoding===b||!b(t)))throw new Error("Unknown encoding: "+t)
return e||t}function o(t){this.encoding=i(t)
var e
switch(this.encoding){case"utf16le":this.text=l,this.end=p,e=4
break
case"utf8":this.fillLast=u,e=4
break
case"base64":this.text=d,this.end=_,e=3
break
default:return this.write=g,void(this.end=y)}this.lastNeed=0,this.lastTotal=0,this.lastChar=v.allocUnsafe(e)}function s(t){return t<=127?0:t>>5==6?2:t>>4==14?3:t>>3==30?4:-1}function a(t,e,r){var n=e.length-1
if(n<r)return 0
var i=s(e[n])
return i>=0?(i>0&&(t.lastNeed=i-1),i):--n<r?0:(i=s(e[n]))>=0?(i>0&&(t.lastNeed=i-2),i):--n<r?0:(i=s(e[n]),i>=0?(i>0&&(2===i?i=0:t.lastNeed=i-3),i):0)}function f(t,e,r){if(128!=(192&e[0]))return t.lastNeed=0,"�".repeat(r)
if(t.lastNeed>1&&e.length>1){if(128!=(192&e[1]))return t.lastNeed=1,"�".repeat(r+1)
if(t.lastNeed>2&&e.length>2&&128!=(192&e[2]))return t.lastNeed=2,"�".repeat(r+2)}}function u(t){var e=this.lastTotal-this.lastNeed,r=f(this,t,e)
return void 0!==r?r:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length))}function c(t,e){var r=a(this,t,e)
if(!this.lastNeed)return t.toString("utf8",e)
this.lastTotal=r
var n=t.length-(r-this.lastNeed)
return t.copy(this.lastChar,0,n),t.toString("utf8",e,n)}function h(t){var e=t&&t.length?this.write(t):""
return this.lastNeed?e+"�".repeat(this.lastTotal-this.lastNeed):e}function l(t,e){if((t.length-e)%2==0){var r=t.toString("utf16le",e)
if(r){var n=r.charCodeAt(r.length-1)
if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],r.slice(0,-1)}return r}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1)}function p(t){var e=t&&t.length?this.write(t):""
if(this.lastNeed){var r=this.lastTotal-this.lastNeed
return e+this.lastChar.toString("utf16le",0,r)}return e}function d(t,e){var r=(t.length-e)%3
return 0===r?t.toString("base64",e):(this.lastNeed=3-r,this.lastTotal=3,1===r?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-r))}function _(t){var e=t&&t.length?this.write(t):""
return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e}function g(t){return t.toString(this.encoding)}function y(t){return t&&t.length?this.write(t):""}var v=t("safe-buffer").Buffer,b=v.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0
default:return!1}}
r.StringDecoder=o,o.prototype.write=function(t){if(0===t.length)return""
var e,r
if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return""
r=this.lastNeed,this.lastNeed=0}else r=0
return r<t.length?e?e+this.text(t,r):this.text(t,r):e||""},o.prototype.end=h,o.prototype.text=c,o.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)
t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length}},{"safe-buffer":127}],130:[function(t,e,r){(function(t){function r(t,e){function r(){if(!i){if(n("throwDeprecation"))throw new Error(e)
n("traceDeprecation")?console.trace(e):console.warn(e),i=!0}return t.apply(this,arguments)}if(n("noDeprecation"))return t
var i=!1
return r}function n(e){try{if(!t.localStorage)return!1}catch(t){return!1}var r=t.localStorage[e]
return null!=r&&"true"===String(r).toLowerCase()}e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],131:[function(t,e,r){arguments[4][89][0].apply(r,arguments)},{dup:89}],132:[function(t,e,r){e.exports=function(t){return t&&"object"==typeof t&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8}},{}],133:[function(t,e,r){(function(e,n){function i(t,e){var n={seen:[],stylize:s}
return arguments.length>=3&&(n.depth=arguments[2]),arguments.length>=4&&(n.colors=arguments[3]),_(e)?n.showHidden=e:e&&r._extend(n,e),w(n.showHidden)&&(n.showHidden=!1),w(n.depth)&&(n.depth=2),w(n.colors)&&(n.colors=!1),w(n.customInspect)&&(n.customInspect=!0),n.colors&&(n.stylize=o),f(n,t,n.depth)}function o(t,e){var r=i.styles[e]
return r?"["+i.colors[r][0]+"m"+t+"["+i.colors[r][1]+"m":t}function s(t,e){return t}function a(t){var e={}
return t.forEach(function(t,r){e[t]=!0}),e}function f(t,e,n){if(t.customInspect&&e&&I(e.inspect)&&e.inspect!==r.inspect&&(!e.constructor||e.constructor.prototype!==e)){var i=e.inspect(n,t)
return b(i)||(i=f(t,i,n)),i}var o=u(t,e)
if(o)return o
var s=Object.keys(e),_=a(s)
if(t.showHidden&&(s=Object.getOwnPropertyNames(e)),x(e)&&(s.indexOf("message")>=0||s.indexOf("description")>=0))return c(e)
if(0===s.length){if(I(e)){var g=e.name?": "+e.name:""
return t.stylize("[Function"+g+"]","special")}if(E(e))return t.stylize(RegExp.prototype.toString.call(e),"regexp")
if(B(e))return t.stylize(Date.prototype.toString.call(e),"date")
if(x(e))return c(e)}var y="",v=!1,m=["{","}"]
if(d(e)&&(v=!0,m=["[","]"]),I(e)){y=" [Function"+(e.name?": "+e.name:"")+"]"}if(E(e)&&(y=" "+RegExp.prototype.toString.call(e)),B(e)&&(y=" "+Date.prototype.toUTCString.call(e)),x(e)&&(y=" "+c(e)),0===s.length&&(!v||0==e.length))return m[0]+y+m[1]
if(n<0)return E(e)?t.stylize(RegExp.prototype.toString.call(e),"regexp"):t.stylize("[Object]","special")
t.seen.push(e)
var w
return w=v?h(t,e,n,_,s):s.map(function(r){return l(t,e,n,_,r,v)}),t.seen.pop(),p(w,y,m)}function u(t,e){if(w(e))return t.stylize("undefined","undefined")
if(b(e)){var r="'"+JSON.stringify(e).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'"
return t.stylize(r,"string")}return v(e)?t.stylize(""+e,"number"):_(e)?t.stylize(""+e,"boolean"):g(e)?t.stylize("null","null"):void 0}function c(t){return"["+Error.prototype.toString.call(t)+"]"}function h(t,e,r,n,i){for(var o=[],s=0,a=e.length;s<a;++s)O(e,String(s))?o.push(l(t,e,r,n,String(s),!0)):o.push("")
return i.forEach(function(i){i.match(/^\d+$/)||o.push(l(t,e,r,n,i,!0))}),o}function l(t,e,r,n,i,o){var s,a,u
if(u=Object.getOwnPropertyDescriptor(e,i)||{value:e[i]},u.get?a=u.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):u.set&&(a=t.stylize("[Setter]","special")),O(n,i)||(s="["+i+"]"),a||(t.seen.indexOf(u.value)<0?(a=g(r)?f(t,u.value,null):f(t,u.value,r-1),a.indexOf("\n")>-1&&(a=o?a.split("\n").map(function(t){return"  "+t}).join("\n").substr(2):"\n"+a.split("\n").map(function(t){return"   "+t}).join("\n"))):a=t.stylize("[Circular]","special")),w(s)){if(o&&i.match(/^\d+$/))return a
s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=t.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=t.stylize(s,"string"))}return s+": "+a}function p(t,e,r){var n=0
return t.reduce(function(t,e){return n++,e.indexOf("\n")>=0&&n++,t+e.replace(/\u001b\[\d\d?m/g,"").length+1},0)>60?r[0]+(""===e?"":e+"\n ")+" "+t.join(",\n  ")+" "+r[1]:r[0]+e+" "+t.join(", ")+" "+r[1]}function d(t){return Array.isArray(t)}function _(t){return"boolean"==typeof t}function g(t){return null===t}function y(t){return null==t}function v(t){return"number"==typeof t}function b(t){return"string"==typeof t}function m(t){return"symbol"==typeof t}function w(t){return void 0===t}function E(t){return S(t)&&"[object RegExp]"===T(t)}function S(t){return"object"==typeof t&&null!==t}function B(t){return S(t)&&"[object Date]"===T(t)}function x(t){return S(t)&&("[object Error]"===T(t)||t instanceof Error)}function I(t){return"function"==typeof t}function k(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||void 0===t}function T(t){return Object.prototype.toString.call(t)}function A(t){return t<10?"0"+t.toString(10):t.toString(10)}function j(){var t=new Date,e=[A(t.getHours()),A(t.getMinutes()),A(t.getSeconds())].join(":")
return[t.getDate(),C[t.getMonth()],e].join(" ")}function O(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var M=/%[sdj%]/g
r.format=function(t){if(!b(t)){for(var e=[],r=0;r<arguments.length;r++)e.push(i(arguments[r]))
return e.join(" ")}for(var r=1,n=arguments,o=n.length,s=String(t).replace(M,function(t){if("%%"===t)return"%"
if(r>=o)return t
switch(t){case"%s":return String(n[r++])
case"%d":return Number(n[r++])
case"%j":try{return JSON.stringify(n[r++])}catch(t){return"[Circular]"}default:return t}}),a=n[r];r<o;a=n[++r])g(a)||!S(a)?s+=" "+a:s+=" "+i(a)
return s},r.deprecate=function(t,i){function o(){if(!s){if(e.throwDeprecation)throw new Error(i)
e.traceDeprecation?console.trace(i):console.error(i),s=!0}return t.apply(this,arguments)}if(w(n.process))return function(){return r.deprecate(t,i).apply(this,arguments)}
if(!0===e.noDeprecation)return t
var s=!1
return o}
var z,L={}
r.debuglog=function(t){if(w(z)&&(z=e.env.NODE_DEBUG||""),t=t.toUpperCase(),!L[t])if(new RegExp("\\b"+t+"\\b","i").test(z)){var n=e.pid
L[t]=function(){var e=r.format.apply(r,arguments)
console.error("%s %d: %s",t,n,e)}}else L[t]=function(){}
return L[t]},r.inspect=i,i.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},r.isArray=d,r.isBoolean=_,r.isNull=g,r.isNullOrUndefined=y,r.isNumber=v,r.isString=b,r.isSymbol=m,r.isUndefined=w,r.isRegExp=E,r.isObject=S,r.isDate=B,r.isError=x,r.isFunction=I,r.isPrimitive=k,r.isBuffer=t("./support/isBuffer")
var C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
r.log=function(){console.log("%s - %s",j(),r.format.apply(r,arguments))},r.inherits=t("inherits"),r._extend=function(t,e){if(!e||!S(e))return t
for(var r=Object.keys(e),n=r.length;n--;)t[r[n]]=e[r[n]]
return t}}).call(this,t("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":132,_process:113,inherits:131}]},{},[1])
