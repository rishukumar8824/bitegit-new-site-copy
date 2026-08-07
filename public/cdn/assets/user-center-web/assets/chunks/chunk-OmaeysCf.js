const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/chunk-DAk6PF1u.js","assets/chunks/chunk-BsaeD1ID.js","assets/chunks/chunk-9GEbevm_.js"])))=>i.map(i=>d[i]);
import{bj as va,bk as ya,bl as In,bm as ba,bn as me,aw as ye,bo as ze,bp as Qr,bq as wa,br as _a,bs as Ws,G as yt,r as pr,a as Gs,u as mr,J as At,a0 as Fr,j as h,c as V,$ as Qs,D as Ct,K as te,V as Q,U as Pe,bg as Ca,w as Ia,af as Br,g as Jr,bi as Js,W as $r,aY as xa,bt as Ea,as as Sa,aU as Xs,bu as ka,a1 as Ta,bv as Ra,bw as Na,a2 as Aa,e as Se,bx as es,by as ts,bz as Pa,bA as Oa,bB as Ma}from"./chunk-QHIxqCTZ.js";import{i as b,_ as La}from"./chunk-9GEbevm_.js";import{L as Pt}from"./chunk-AZqHfkOf.js";import{K as ja}from"./chunk-Bzfw6Zb4.js";import{h as Lt}from"./chunk-D-dPKF8q.js";import{u as Da,R as Ua,z as Fa,K as Dn,F as Ba,Y as Ys,P as $a,G as rs}from"./chunk-uS9-Kp8Z.js";import{B as ns}from"./chunk-DWtr8mrx.js";import{o as qt}from"./chunk-ByE688D_.js";import{r as g,g as Va,R as I,e as qa}from"./chunk-BsaeD1ID.js";import{P as za,G as Zs,F as ei,a as Ha,u as Ka,M as Wa}from"./chunk-Cd5zafLj.js";import{u as Xr,E as ti,F as ri,a as Ga}from"./chunk-MiMPN0LC.js";import{d as Ke,c as or,e as tr,f as rr,s as Oe,a as ni,r as si,i as Ot,j as Qa,p as Ja,t as ss,k as Xa,g as Ya,b as Za}from"./chunk-D8tEaqPU.js";import{t as xn}from"./chunk-gPbGJ5hP.js";import{X as eo}from"./chunk-D_cPPl-o.js";import{R as cr}from"./chunk-CPlTo2xH.js";import{u as ii}from"./chunk-C10hiRNB.js";import{p as lr,h as ai,i as to,f as ro,j as no,k as so,l as io,e as ao,m as oo}from"./chunk-CbK7jZEf.js";import"./chunk-CdfqSvFz.js";import{l as is,t as co,a as lo,p as uo}from"./chunk-B3m16eEA.js";import{u as En,d as ho,a as Un,i as fo,b as po,c as mo}from"./chunk-i4w0HeNb.js";import{d as go,r as vo,a as yo}from"./chunk-Bw-RecCU.js";import{R as bo}from"./chunk-DVW3ktmx.js";(function(){try{var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};t.SENTRY_RELEASE={id:"user-center-web@0.0.4"};var e=new t.Error().stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="d3335ed9-a359-4878-a9e6-49916eab5606",t._sentryDebugIdIdentifier="sentry-dbid-d3335ed9-a359-4878-a9e6-49916eab5606")}catch{}})();var wo="[object Symbol]";function _o(t){return typeof t=="symbol"||va(t)&&ya(t)==wo}var Co=/\s/;function Io(t){for(var e=t.length;e--&&Co.test(t.charAt(e)););return e}var xo=/^\s+/;function Eo(t){return t&&t.slice(0,Io(t)+1).replace(xo,"")}var as=NaN,So=/^[-+]0x[0-9a-f]+$/i,ko=/^0b[01]+$/i,To=/^0o[0-7]+$/i,Ro=parseInt;function os(t){if(typeof t=="number")return t;if(_o(t))return as;if(In(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=In(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=Eo(t);var r=ko.test(t);return r||To.test(t)?Ro(t.slice(2),r?2:8):So.test(t)?as:+t}var dn=function(){return ba.Date.now()},No="Expected a function",Ao=Math.max,Po=Math.min;function Oo(t,e,r){var n,s,i,o,u,a,c=0,l=!1,d=!1,p=!0;if(typeof t!="function")throw new TypeError(No);e=os(e)||0,In(r)&&(l=!!r.leading,d="maxWait"in r,i=d?Ao(os(r.maxWait)||0,e):i,p="trailing"in r?!!r.trailing:p);function m(M){var R=n,P=s;return n=s=void 0,c=M,o=t.apply(P,R),o}function f(M){return c=M,u=setTimeout(A,e),l?m(M):o}function y(M){var R=M-a,P=M-c,$=e-R;return d?Po($,i-P):$}function w(M){var R=M-a,P=M-c;return a===void 0||R>=e||R<0||d&&P>=i}function A(){var M=dn();if(w(M))return x(M);u=setTimeout(A,y(M))}function x(M){return u=void 0,p&&n?m(M):(n=s=void 0,o)}function C(){u!==void 0&&clearTimeout(u),c=0,n=a=s=u=void 0}function T(){return u===void 0?o:x(dn())}function D(){var M=dn(),R=w(M);if(n=arguments,s=this,a=M,R){if(u===void 0)return f(a);if(d)return clearTimeout(u),u=setTimeout(A,e),m(a)}return u===void 0&&(u=setTimeout(A,e)),o}return D.cancel=C,D.flush=T,D}var oi=function(t,e){var r=e.manual,n=e.ready,s=n===void 0?!0:n,i=e.defaultParams,o=i===void 0?[]:i,u=e.refreshDeps,a=u===void 0?[]:u,c=e.refreshDepsAction,l=g.useRef(!1);return l.current=!1,En(function(){!r&&s&&(l.current=!0,t.run.apply(t,me([],ye(o),!1)))},[s]),En(function(){l.current||r||(l.current=!0,c?c():t.refresh())},me([],ye(a),!1)),{onBefore:function(){if(!s)return{stopNow:!0}}}};oi.onInit=function(t){var e=t.ready,r=e===void 0?!0:e,n=t.manual;return{loading:!n&&r}};var ci=function(t,e){var r=g.useRef({deps:e,obj:void 0,initialized:!1}).current;return(r.initialized===!1||!ho(r.deps,e))&&(r.deps=e,r.obj=t(),r.initialized=!0),r.obj},Ar=new Map,Mo=function(t,e,r){var n=Ar.get(t);n!=null&&n.timer&&clearTimeout(n.timer);var s=void 0;e>-1&&(s=setTimeout(function(){Ar.delete(t)},e)),Ar.set(t,ze(ze({},r),{timer:s}))},Lo=function(t){return Ar.get(t)},Pr=new Map,jo=function(t){return Pr.get(t)},Do=function(t,e){Pr.set(t,e),e.then(function(r){return Pr.delete(t),r}).catch(function(){Pr.delete(t)})},wt={},Uo=function(t,e){wt[t]&&wt[t].forEach(function(r){return r(e)})},hn=function(t,e){return wt[t]||(wt[t]=[]),wt[t].push(e),function(){var n=wt[t].indexOf(e);wt[t].splice(n,1)}},Fo=function(t,e){var r=e.cacheKey,n=e.cacheTime,s=n===void 0?300*1e3:n,i=e.staleTime,o=i===void 0?0:i,u=e.setCache,a=e.getCache,c=g.useRef(void 0),l=g.useRef(void 0),d=function(m,f){u?u(f):Mo(m,s,f),Uo(m,f.data)},p=function(m,f){return f===void 0&&(f=[]),a?a(f):Lo(m)};return ci(function(){if(r){var m=p(r);m&&Object.hasOwnProperty.call(m,"data")&&(t.state.data=m.data,t.state.params=m.params,(o===-1||Date.now()-m.time<=o)&&(t.state.loading=!1)),c.current=hn(r,function(f){t.setState({data:f})})}},[]),Un(function(){var m;(m=c.current)===null||m===void 0||m.call(c)}),r?{onBefore:function(m){var f=p(r,m);return!f||!Object.hasOwnProperty.call(f,"data")?{}:o===-1||Date.now()-f.time<=o?{loading:!1,data:f==null?void 0:f.data,error:void 0,returnNow:!0}:{data:f==null?void 0:f.data,error:void 0}},onRequest:function(m,f){var y=jo(r);return y&&y!==l.current?{servicePromise:y}:(y=m.apply(void 0,me([],ye(f),!1)),l.current=y,Do(r,y),{servicePromise:y})},onSuccess:function(m,f){var y;r&&((y=c.current)===null||y===void 0||y.call(c),d(r,{data:m,params:f,time:Date.now()}),c.current=hn(r,function(w){t.setState({data:w})}))},onMutate:function(m){var f;r&&((f=c.current)===null||f===void 0||f.call(c),d(r,{data:m,params:t.state.params,time:Date.now()}),c.current=hn(r,function(y){t.setState({data:y})}))}}:{}},Bo=function(t,e){var r=e.debounceWait,n=e.debounceLeading,s=e.debounceTrailing,i=e.debounceMaxWait,o=g.useRef(void 0),u=g.useMemo(function(){var a={};return n!==void 0&&(a.leading=n),s!==void 0&&(a.trailing=s),i!==void 0&&(a.maxWait=i),a},[n,s,i]);return g.useEffect(function(){if(r){var a=t.runAsync.bind(t);return o.current=go(function(c){c()},r,u),t.runAsync=function(){for(var c=[],l=0;l<arguments.length;l++)c[l]=arguments[l];return new Promise(function(d,p){var m;(m=o.current)===null||m===void 0||m.call(o,function(){a.apply(void 0,me([],ye(c),!1)).then(d).catch(p)})})},function(){var c;(c=o.current)===null||c===void 0||c.cancel(),t.runAsync=a}}},[r,u]),r?{onCancel:function(){var a;(a=o.current)===null||a===void 0||a.cancel()}}:{}},$o=function(t,e){var r=e.loadingDelay,n=e.ready,s=g.useRef(void 0);if(!r)return{};var i=function(){s.current&&clearTimeout(s.current)};return{onBefore:function(){return i(),n!==!1&&(s.current=setTimeout(function(){t.setState({loading:!0})},r)),{loading:!1}},onFinally:function(){i()},onCancel:function(){i()}}};function Fn(){return Qr?document.visibilityState!=="hidden":!0}var Or=new Set;function Vo(t){return Or.add(t),function(){Or.has(t)&&Or.delete(t)}}if(Qr){var qo=function(){Fn()&&Or.forEach(function(t){return t()})};window.addEventListener("visibilitychange",qo,!1)}var zo=function(t,e){var r=e.pollingInterval,n=e.pollingWhenHidden,s=n===void 0?!0:n,i=e.pollingErrorRetryCount,o=i===void 0?-1:i,u=g.useRef(void 0),a=g.useRef(void 0),c=g.useRef(0),l=function(){var d;u.current&&clearTimeout(u.current),(d=a.current)===null||d===void 0||d.call(a)};return En(function(){r||l()},[r]),r?{onBefore:function(){l()},onError:function(){c.current+=1},onSuccess:function(){c.current=0},onFinally:function(){o===-1||o!==-1&&c.current<=o?u.current=setTimeout(function(){!s&&!Fn()?a.current=Vo(function(){t.refresh()}):t.refresh()},r):c.current=0},onCancel:function(){l()}}:{}};function Ho(t,e){var r=!1;return function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];r||(r=!0,t.apply(void 0,me([],ye(n),!1)),setTimeout(function(){r=!1},e))}}var Ko=function(){return Qr&&typeof navigator.onLine<"u"?navigator.onLine:!0},Mr=new Set;function Wo(t){return Mr.add(t),function(){Mr.has(t)&&Mr.delete(t)}}if(Qr){var cs=function(){!Fn()||!Ko()||Mr.forEach(function(t){return t()})};window.addEventListener("visibilitychange",cs,!1),window.addEventListener("focus",cs,!1)}var Go=function(t,e){var r=e.refreshOnWindowFocus,n=e.focusTimespan,s=n===void 0?5e3:n,i=g.useRef(void 0),o=function(){var u;(u=i.current)===null||u===void 0||u.call(i)};return g.useEffect(function(){if(r){var u=Ho(t.refresh.bind(t),s);i.current=Wo(function(){u()})}return function(){o()}},[r,s]),Un(function(){o()}),{}},Qo=function(t,e){var r=e.retryInterval,n=e.retryCount,s=g.useRef(void 0),i=g.useRef(0),o=g.useRef(!1);return n?{onBefore:function(){o.current||(i.current=0),o.current=!1,s.current&&clearTimeout(s.current)},onSuccess:function(){i.current=0},onError:function(){if(i.current+=1,n===-1||i.current<=n){var u=r??Math.min(1e3*Math.pow(2,i.current),3e4);s.current=setTimeout(function(){o.current=!0,t.refresh()},u)}else i.current=0},onCancel:function(){i.current=0,s.current&&clearTimeout(s.current)}}:{}},fn,ls;function Jo(){if(ls)return fn;ls=1;var t=vo(),e=yo(),r="Expected a function";function n(s,i,o){var u=!0,a=!0;if(typeof s!="function")throw new TypeError(r);return e(o)&&(u="leading"in o?!!o.leading:u,a="trailing"in o?!!o.trailing:a),t(s,i,{leading:u,maxWait:i,trailing:a})}return fn=n,fn}var Xo=Jo();const Yo=Va(Xo);var Zo=function(t,e){var r=e.throttleWait,n=e.throttleLeading,s=e.throttleTrailing,i=g.useRef(void 0),o={};return n!==void 0&&(o.leading=n),s!==void 0&&(o.trailing=s),g.useEffect(function(){if(r){var u=t.runAsync.bind(t);return i.current=Yo(function(a){a()},r,o),t.runAsync=function(){for(var a=[],c=0;c<arguments.length;c++)a[c]=arguments[c];return new Promise(function(l,d){var p;(p=i.current)===null||p===void 0||p.call(i,function(){u.apply(void 0,me([],ye(a),!1)).then(l).catch(d)})})},function(){var a;t.runAsync=u,(a=i.current)===null||a===void 0||a.cancel()}}},[r,n,s]),r?{onCancel:function(){var u;(u=i.current)===null||u===void 0||u.cancel()}}:{}},li=function(t){g.useEffect(function(){var e=t==null?void 0:t();if(!(e&&typeof e=="object"&&typeof e.then=="function"))return e},[])},ec=(function(){function t(e,r,n,s){s===void 0&&(s={}),this.serviceRef=e,this.options=r,this.subscribe=n,this.initState=s,this.pluginImpls=[],this.count=0,this.state={loading:!1,params:void 0,data:void 0,error:void 0},this.state=ze(ze(ze({},this.state),{loading:!r.manual}),s)}return t.prototype.setState=function(e){e===void 0&&(e={}),this.state=ze(ze({},this.state),e),this.subscribe()},t.prototype.runPluginHandler=function(e){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];var s=this.pluginImpls.map(function(i){var o;return(o=i[e])===null||o===void 0?void 0:o.call.apply(o,me([i],ye(r),!1))}).filter(Boolean);return Object.assign.apply(Object,me([{}],ye(s),!1))},t.prototype.runAsync=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return wa(this,void 0,void 0,function(){var n,s,i,o,u,a,c,l,d,p,m,f,y,w,A,x,C,T,D,M,R;return _a(this,function(P){switch(P.label){case 0:if(this.count+=1,n=this.count,s=this.runPluginHandler("onBefore",e),i=s.stopNow,o=i===void 0?!1:i,u=s.returnNow,a=u===void 0?!1:u,c=Ws(s,["stopNow","returnNow"]),o)return[2,Promise.resolve(c.data)];if(this.setState(ze({loading:!0,params:e},c)),a)return[2,Promise.resolve(c.data)];(y=(f=this.options).onBefore)===null||y===void 0||y.call(f,e),P.label=1;case 1:return P.trys.push([1,3,,4]),l=this.runPluginHandler("onRequest",this.serviceRef.current,e).servicePromise,l||(l=(m=this.serviceRef).current.apply(m,me([],ye(e),!1))),[4,l];case 2:return d=P.sent(),n!==this.count?[2,new Promise(function(){})]:(this.setState({data:d,error:void 0,loading:!1}),(A=(w=this.options).onSuccess)===null||A===void 0||A.call(w,d,e),this.runPluginHandler("onSuccess",d,e),(C=(x=this.options).onFinally)===null||C===void 0||C.call(x,e,d,void 0),n===this.count&&this.runPluginHandler("onFinally",e,d,void 0),[2,d]);case 3:if(p=P.sent(),n!==this.count)return[2,new Promise(function(){})];throw this.setState({error:p,loading:!1}),(D=(T=this.options).onError)===null||D===void 0||D.call(T,p,e),this.runPluginHandler("onError",p,e),(R=(M=this.options).onFinally)===null||R===void 0||R.call(M,e,void 0,p),n===this.count&&this.runPluginHandler("onFinally",e,void 0,p),p;case 4:return[2]}})})},t.prototype.run=function(){for(var e=this,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];this.runAsync.apply(this,me([],ye(r),!1)).catch(function(s){e.options.onError||console.error(s)})},t.prototype.cancel=function(){this.count+=1,this.setState({loading:!1}),this.runPluginHandler("onCancel")},t.prototype.refresh=function(){this.run.apply(this,me([],ye(this.state.params||[]),!1))},t.prototype.refreshAsync=function(){return this.runAsync.apply(this,me([],ye(this.state.params||[]),!1))},t.prototype.mutate=function(e){var r=fo(e)?e(this.state.data):e;this.runPluginHandler("onMutate",r),this.setState({data:r})},t})();function tc(t,e,r){e===void 0&&(e={}),r===void 0&&(r=[]);var n=e.manual,s=n===void 0?!1:n,i=e.ready,o=i===void 0?!0:i,u=Ws(e,["manual","ready"]),a=ze({manual:s,ready:o},u),c=po(t),l=mo(),d=ci(function(){var p=r.map(function(m){var f;return(f=m==null?void 0:m.onInit)===null||f===void 0?void 0:f.call(m,a)}).filter(Boolean);return new ec(c,a,l,Object.assign.apply(Object,me([{}],ye(p),!1)))},[]);return d.options=a,d.pluginImpls=r.map(function(p){return p(d,a)}),li(function(){if(!s&&o){var p=d.state.params||e.defaultParams||[];d.run.apply(d,me([],ye(p),!1))}}),Un(function(){d.cancel()}),{loading:d.state.loading,data:d.state.data,error:d.state.error,params:d.state.params||[],cancel:yt(d.cancel.bind(d)),refresh:yt(d.refresh.bind(d)),refreshAsync:yt(d.refreshAsync.bind(d)),run:yt(d.run.bind(d)),runAsync:yt(d.runAsync.bind(d)),mutate:yt(d.mutate.bind(d))}}function rc(t,e,r){return tc(t,e,me(me([],ye([]),!1),[Bo,$o,zo,Go,Zo,oi,Fo,Qo],!1))}const Yr="/rfapi/";function nc(t,e){return pr.get(Yr+`public/invite-code/v2/${t}`,e)}function us(t,e){return pr.get(Yr+`public/custom-register-page/${t}`,e)}function uf(t){return pr.get(Yr+"profile/inviter ",t)}function df(t,e){return pr.get(Yr+`public/partner-reg-page/by-code/${t}`,e)}const Bn="/xt-app/";function sc(t){return pr.get(Bn+"public/banner/list",t)}function ic(t){return Gs(Bn+"public/promotion-channel/trace",t)}function ac(t){return Gs(Bn+"public/channel-access/register",t)}const oc=()=>{const{urlParsed:t}=mr(),e=(t==null?void 0:t.search)??(typeof window<"u"?Object.fromEntries(new URLSearchParams(window.location.search)):{}),r=g.useCallback((s="click")=>{const{channelId:i}=e;i&&ic({data:{action:s&&/^(view|click)$/.test(s)?s:"view",channelId:i}})},[e]),n=g.useRef(!1);return g.useEffect(()=>{e.channelId&&!n.current&&(n.current=!0,r("view"))},[e]),r},cc="_emailDiv_ykm2e_1",lc={emailDiv:cc},uc="_title_lyy7q_1",dc="_description_lyy7q_9",ds={title:uc,description:dc},Zr=`${Fr}/imgs/ssr-web-user-center/account`,hc=`${Zr}/google.svg`,fc=`${Zr}/google-dark.svg`,pc=`${Zr}/apple.svg`,mc=`${Zr}/apple-dark.svg`,gc=({isCreateAcc:t,thirdPartyDoc:e,setPageType:r,className:n})=>{const{isDark:s}=At.app,i=g.useMemo(()=>{const u=e.authType===ar.google?"Google":"Apple",a=b._("app.title");return b._({id:"thirdPartyLogin.home.bindNewAccountTip",values:{0:u,1:a}})},[e]),o=g.useMemo(()=>{if(e.authType===ar.google)return s?fc:hc;if(e.authType===ar.apple)return s?mc:pc},[e,s]);return h.jsx(cr,{children:h.jsxs("div",{className:V("md:w-[400px] mx-auto",n),children:[h.jsx("div",{className:V(ds.title),children:b._("thirdPartyLogin.bindAccount")}),h.jsx("div",{className:V(ds.description),children:i}),e.email&&h.jsxs("div",{className:V(lc.emailDiv),children:[h.jsx(Qs,{lazy:!1,src:o||""}),h.jsx("span",{children:e.email})]}),!e.email&&h.jsx(Ct,{type:"primary",className:"mt-4",size:"large",block:!0,onClick:()=>r(jn.bind),children:b._("account.bindNowAcc")}),t&&h.jsx(Ct,{size:"large",className:"mt-4",block:!0,onClick:()=>r(jn.create),children:b._("account.createNewAcc")})]})})},vc=qt(gc);function yc({setLoading:t,loginType:e,email:r,mobile:n,countryCode:s,password:i,thirdPartyDoc:o}){const{localeNavigate:u}=ii();return g.useCallback(async c=>{console.log(c,"puzzleValidateString"),t&&t(!0);const l=await te(lr,{errorPop:!0});if(l.err)return t&&t(!1),!0;const d={userName:e==="email"?r:n,countryCode:e==="email"?void 0:s,loginPwd:i?await Ke(l.data.publicKey,i):void 0,passwdId:l.data.passwdId,puzzleValidateString:c,version:"2.0",thirdAuthDTO:o};let p="";Q.get("client-device-id")?p=Q.get("client-device-id"):(p=or(),Q.set("client-device-id",p));const{err:m,data:f}=await te(ai,{headers:{"client-device-id":await Ke(l.data.publicKey,p),"client-device-name":`${tr()} (${rr()})`},data:d,errorPop:!0});if(t&&t(!1),m)return!0;Oe.set("2fa",f),Oe.set("puzzleValidateString",c);const y=typeof window<"u"?window.location.search:"";return u(`/accounts/login/2fa${y}`),!1},[e,r,n,s,i,o,u])}function bc([t,e,r,n,s,i,o,u,a,c,l,d]){var M;const p=mr(),m=((M=p.urlParsed)==null?void 0:M.search)??(typeof window<"u"?Object.fromEntries(new URLSearchParams(window.location.search)):{}),f={locale:p.locale,query:m,push:R=>{if(typeof location>"u")return;if(typeof R=="string"){location.href=R;return}const P=R!=null&&R.query?`?${new URLSearchParams(R.query).toString()}`:"";location.href=`${R.pathname}${P}`},replace:R=>{if(typeof location>"u")return;if(typeof R=="string"){location.replace(R);return}const P=R!=null&&R.query?`?${new URLSearchParams(R.query).toString()}`:"";location.replace(`${R.pathname}${P}`)}},y=Xr("/components/Pages/Login/usePasskey.js"),[w,A]=g.useState(),[x,C]=g.useState(!1),T=g.useCallback(()=>{if(At.app.isPasskeySupport===!1||r==="subAccount")return C(!0);C(!1)},[At.app.isPasskeySupport,r]);g.useEffect(()=>{T()},[At.app.isPasskeySupport,r]),g.useEffect(()=>{c(""),l({isOK:!1,errMsg:""})},[x]),g.useEffect(()=>{r==="email"&&T()},[n]),g.useEffect(()=>{r==="mobile"&&T()},[i,u]);const D=g.useCallback(async()=>{if(t)return;if(r==="email"){if(!s(!0).isOK)return}else if(r==="mobile"&&!o(!0).isOK)return;e(!0);const R=await te(lr,{errorPop:!0});if(R.err)return U();let P="";Q.get("client-device-id")?P=Q.get("client-device-id"):(P=or(),Q.set("client-device-id",P));const $={loginType:{email:"EMAIL",mobile:"MOBILE",subAccount:"ACCOUNT"}[r],user:{email:n,mobile:i,subAccount:a}[r],countryCode:{email:void 0,mobile:u,subAccount:void 0}[r],passwdId:R.data.passwdId},W=await te(to,{headers:{"client-device-id":await Ke(R.data.publicKey,P),"client-device-name":`${tr()} (${rr()})`},data:$,contentType:"application/json"});if(console.log("retPreCheck =",W),y({desc:"Next button click",data:$,retPreCheck:W}),W.err)return U();if(!W.data.passkeyEnable)return U(W.data.hasSetPwd===!1),W.data.hasSetPwd===!1;return A(W.data.faCheckId),d(!0),!0;function U(le){e(!1),C(!0),le&&Lt.confirm({content:b._("account.userNoSetPwdPlsReset"),onOk:()=>{f.push({pathname:"/accounts/reset-password",query:f.query})}})}},[t,r,n,i,u,a,s,o]);return g.useEffect(()=>{At.app.initPasskey()},[]),{showPassword:x,setShowPassword:C,handleShowPassword:T,handleNextBtnClick:D,faCheckId:w}}var hs={};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wc=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ui=function(t){const e=[];let r=0;for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);s<128?e[r++]=s:s<2048?(e[r++]=s>>6|192,e[r++]=s&63|128):(s&64512)===55296&&n+1<t.length&&(t.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++n)&1023),e[r++]=s>>18|240,e[r++]=s>>12&63|128,e[r++]=s>>6&63|128,e[r++]=s&63|128):(e[r++]=s>>12|224,e[r++]=s>>6&63|128,e[r++]=s&63|128)}return e},_c=function(t){const e=[];let r=0,n=0;for(;r<t.length;){const s=t[r++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[r++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[r++],o=t[r++],u=t[r++],a=((s&7)<<18|(i&63)<<12|(o&63)<<6|u&63)-65536;e[n++]=String.fromCharCode(55296+(a>>10)),e[n++]=String.fromCharCode(56320+(a&1023))}else{const i=t[r++],o=t[r++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},di={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const r=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,u=o?t[s+1]:0,a=s+2<t.length,c=a?t[s+2]:0,l=i>>2,d=(i&3)<<4|u>>4;let p=(u&15)<<2|c>>6,m=c&63;a||(m=64,o||(p=64)),n.push(r[l],r[d],r[p],r[m])}return n.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ui(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):_c(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const r=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<t.length;){const i=r[t.charAt(s++)],o=s<t.length?r[t.charAt(s)]:0;++s;const u=s<t.length?r[t.charAt(s)]:64;++s;const a=s<t.length?r[t.charAt(s)]:64;if(++s,i==null||o==null||u==null||a==null)throw new Cc;const c=i<<2|o>>4;if(n.push(c),u!==64){const l=o<<4&240|u>>2;if(n.push(l),a!==64){const d=u<<6&192|a;n.push(d)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Cc extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ic=function(t){const e=ui(t);return di.encodeByteArray(e,!0)},hi=function(t){return Ic(t).replace(/\./g,"")},fi=function(t){try{return di.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ec=()=>xc().__FIREBASE_DEFAULTS__,Sc=()=>{if(typeof process>"u"||typeof hs>"u")return;const t=hs.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},kc=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&fi(t[1]);return e&&JSON.parse(e)},$n=()=>{try{return wc()||Ec()||Sc()||kc()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Tc=t=>{var e,r;return(r=(e=$n())===null||e===void 0?void 0:e.emulatorHosts)===null||r===void 0?void 0:r[t]},pi=()=>{var t;return(t=$n())===null||t===void 0?void 0:t.config},mi=t=>{var e;return(e=$n())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,r)=>{this.resolve=e,this.reject=r})}wrapCallback(e){return(r,n)=>{r?this.reject(r):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(r):e(r,n))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Nc(t){return(await fetch(t,{credentials:"include"})).ok}const nr={};function Ac(){const t={prod:[],emulator:[]};for(const e of Object.keys(nr))nr[e]?t.emulator.push(e):t.prod.push(e);return t}function Pc(t){let e=document.getElementById(t),r=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),r=!0),{created:r,element:e}}let fs=!1;function Oc(t,e){if(typeof window>"u"||typeof document>"u"||!en(window.location.host)||nr[t]===e||nr[t]||fs)return;nr[t]=e;function r(d){return`__firebase__banner__${d}`}const n="__firebase__banner",s=Ac().prod.length>0;function i(){const d=document.getElementById(n);d&&d.remove()}function o(d){d.style.display="flex",d.style.background="#7faaf0",d.style.position="fixed",d.style.bottom="5px",d.style.left="5px",d.style.padding=".5em",d.style.borderRadius="5px",d.style.alignItems="center"}function u(d,p){d.setAttribute("width","24"),d.setAttribute("id",p),d.setAttribute("height","24"),d.setAttribute("viewBox","0 0 24 24"),d.setAttribute("fill","none"),d.style.marginLeft="-6px"}function a(){const d=document.createElement("span");return d.style.cursor="pointer",d.style.marginLeft="16px",d.style.fontSize="24px",d.innerHTML=" &times;",d.onclick=()=>{fs=!0,i()},d}function c(d,p){d.setAttribute("id",p),d.innerText="Learn more",d.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",d.setAttribute("target","__blank"),d.style.paddingLeft="5px",d.style.textDecoration="underline"}function l(){const d=Pc(n),p=r("text"),m=document.getElementById(p)||document.createElement("span"),f=r("learnmore"),y=document.getElementById(f)||document.createElement("a"),w=r("preprendIcon"),A=document.getElementById(w)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(d.created){const x=d.element;o(x),c(y,f);const C=a();u(A,w),x.append(A,m,y,C),document.body.appendChild(x)}s?(m.innerText="Preview backend disconnected.",A.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(A.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,m.innerText="Preview backend running in this workspace."),m.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",l):l()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Mc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(be())}function Lc(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function jc(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Dc(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Uc(){const t=be();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Fc(){try{return typeof indexedDB=="object"}catch{return!1}}function Bc(){return new Promise((t,e)=>{try{let r=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),r||self.indexedDB.deleteDatabase(n),t(!0)},s.onupgradeneeded=()=>{r=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(r){e(r)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $c="FirebaseError";class lt extends Error{constructor(e,r,n){super(r),this.code=e,this.customData=n,this.name=$c,Object.setPrototypeOf(this,lt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,gr.prototype.create)}}class gr{constructor(e,r,n){this.service=e,this.serviceName=r,this.errors=n}create(e,...r){const n=r[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?Vc(i,n):"Error",u=`${this.serviceName}: ${o} (${s}).`;return new lt(s,u,n)}}function Vc(t,e){return t.replace(qc,(r,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const qc=/\{\$([^}]+)}/g;function zc(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Bt(t,e){if(t===e)return!0;const r=Object.keys(t),n=Object.keys(e);for(const s of r){if(!n.includes(s))return!1;const i=t[s],o=e[s];if(ps(i)&&ps(o)){if(!Bt(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!r.includes(s))return!1;return!0}function ps(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vr(t){const e=[];for(const[r,n]of Object.entries(t))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(r)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(r)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Hc(t,e){const r=new Kc(t,e);return r.subscribe.bind(r)}class Kc{constructor(e,r){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=r,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(r=>{r.next(e)})}error(e){this.forEachObserver(r=>{r.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,r,n){let s;if(e===void 0&&r===void 0&&n===void 0)throw new Error("Missing Observer.");Wc(e,["next","error","complete"])?s=e:s={next:e,error:r,complete:n},s.next===void 0&&(s.next=pn),s.error===void 0&&(s.error=pn),s.complete===void 0&&(s.complete=pn);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let r=0;r<this.observers.length;r++)this.sendOne(r,e)}sendOne(e,r){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{r(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Wc(t,e){if(typeof t!="object"||t===null)return!1;for(const r of e)if(r in t&&typeof t[r]=="function")return!0;return!1}function pn(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(t){return t&&t._delegate?t._delegate:t}class $t{constructor(e,r,n){this.name=e,this.instanceFactory=r,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gc{constructor(e,r){this.name=e,this.container=r,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const r=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(r)){const n=new Rc;if(this.instancesDeferred.set(r,n),this.isInitialized(r)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:r});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(r).promise}getImmediate(e){var r;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(r=e==null?void 0:e.optional)!==null&&r!==void 0?r:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Jc(e))try{this.getOrInitializeService({instanceIdentifier:bt})}catch{}for(const[r,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(r);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=bt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(r=>"INTERNAL"in r).map(r=>r.INTERNAL.delete()),...e.filter(r=>"_delete"in r).map(r=>r._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=bt){return this.instances.has(e)}getOptions(e=bt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:r={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:r});for(const[i,o]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(i);n===u&&o.resolve(s)}return s}onInit(e,r){var n;const s=this.normalizeInstanceIdentifier(r),i=(n=this.onInitCallbacks.get(s))!==null&&n!==void 0?n:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,r){const n=this.onInitCallbacks.get(r);if(n)for(const s of n)try{s(e,r)}catch{}}getOrInitializeService({instanceIdentifier:e,options:r={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Qc(e),options:r}),this.instances.set(e,n),this.instancesOptions.set(e,r),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=bt){return this.component?this.component.multipleInstances?e:bt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Qc(t){return t===bt?void 0:t}function Jc(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const r=this.getProvider(e.name);if(r.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);r.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const r=new Gc(e,this);return this.providers.set(e,r),r}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(H||(H={}));const Yc={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},Zc=H.INFO,el={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},tl=(t,e,...r)=>{if(e<t.logLevel)return;const n=new Date().toISOString(),s=el[e];if(s)console[s](`[${n}]  ${t.name}:`,...r);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class gi{constructor(e){this.name=e,this._logLevel=Zc,this._logHandler=tl,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Yc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const rl=(t,e)=>e.some(r=>t instanceof r);let ms,gs;function nl(){return ms||(ms=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function sl(){return gs||(gs=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const vi=new WeakMap,Sn=new WeakMap,yi=new WeakMap,mn=new WeakMap,Vn=new WeakMap;function il(t){const e=new Promise((r,n)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{r(at(t.result)),s()},o=()=>{n(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(r=>{r instanceof IDBCursor&&vi.set(r,t)}).catch(()=>{}),Vn.set(e,t),e}function al(t){if(Sn.has(t))return;const e=new Promise((r,n)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{r(),s()},o=()=>{n(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Sn.set(t,e)}let kn={get(t,e,r){if(t instanceof IDBTransaction){if(e==="done")return Sn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||yi.get(t);if(e==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return at(t[e])},set(t,e,r){return t[e]=r,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ol(t){kn=t(kn)}function cl(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...r){const n=t.call(gn(this),e,...r);return yi.set(n,e.sort?e.sort():[e]),at(n)}:sl().includes(t)?function(...e){return t.apply(gn(this),e),at(vi.get(this))}:function(...e){return at(t.apply(gn(this),e))}}function ll(t){return typeof t=="function"?cl(t):(t instanceof IDBTransaction&&al(t),rl(t,nl())?new Proxy(t,kn):t)}function at(t){if(t instanceof IDBRequest)return il(t);if(mn.has(t))return mn.get(t);const e=ll(t);return e!==t&&(mn.set(t,e),Vn.set(e,t)),e}const gn=t=>Vn.get(t);function ul(t,e,{blocked:r,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),u=at(o);return n&&o.addEventListener("upgradeneeded",a=>{n(at(o.result),a.oldVersion,a.newVersion,at(o.transaction),a)}),r&&o.addEventListener("blocked",a=>r(a.oldVersion,a.newVersion,a)),u.then(a=>{i&&a.addEventListener("close",()=>i()),s&&a.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),u}const dl=["get","getKey","getAll","getAllKeys","count"],hl=["put","add","delete","clear"],vn=new Map;function vs(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(vn.get(e))return vn.get(e);const r=e.replace(/FromIndex$/,""),n=e!==r,s=hl.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(s||dl.includes(r)))return;const i=async function(o,...u){const a=this.transaction(o,s?"readwrite":"readonly");let c=a.store;return n&&(c=c.index(u.shift())),(await Promise.all([c[r](...u),s&&a.done]))[0]};return vn.set(e,i),i}ol(t=>({...t,get:(e,r,n)=>vs(e,r)||t.get(e,r,n),has:(e,r)=>!!vs(e,r)||t.has(e,r)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(pl(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function pl(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Tn="@firebase/app",ys="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe=new gi("@firebase/app"),ml="@firebase/app-compat",gl="@firebase/analytics-compat",vl="@firebase/analytics",yl="@firebase/app-check-compat",bl="@firebase/app-check",wl="@firebase/auth",_l="@firebase/auth-compat",Cl="@firebase/database",Il="@firebase/data-connect",xl="@firebase/database-compat",El="@firebase/functions",Sl="@firebase/functions-compat",kl="@firebase/installations",Tl="@firebase/installations-compat",Rl="@firebase/messaging",Nl="@firebase/messaging-compat",Al="@firebase/performance",Pl="@firebase/performance-compat",Ol="@firebase/remote-config",Ml="@firebase/remote-config-compat",Ll="@firebase/storage",jl="@firebase/storage-compat",Dl="@firebase/firestore",Ul="@firebase/ai",Fl="@firebase/firestore-compat",Bl="firebase",$l="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn="[DEFAULT]",Vl={[Tn]:"fire-core",[ml]:"fire-core-compat",[vl]:"fire-analytics",[gl]:"fire-analytics-compat",[bl]:"fire-app-check",[yl]:"fire-app-check-compat",[wl]:"fire-auth",[_l]:"fire-auth-compat",[Cl]:"fire-rtdb",[Il]:"fire-data-connect",[xl]:"fire-rtdb-compat",[El]:"fire-fn",[Sl]:"fire-fn-compat",[kl]:"fire-iid",[Tl]:"fire-iid-compat",[Rl]:"fire-fcm",[Nl]:"fire-fcm-compat",[Al]:"fire-perf",[Pl]:"fire-perf-compat",[Ol]:"fire-rc",[Ml]:"fire-rc-compat",[Ll]:"fire-gcs",[jl]:"fire-gcs-compat",[Dl]:"fire-fst",[Fl]:"fire-fst-compat",[Ul]:"fire-vertex","fire-js":"fire-js",[Bl]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur=new Map,ql=new Map,Nn=new Map;function bs(t,e){try{t.container.addComponent(e)}catch(r){Qe.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,r)}}function dr(t){const e=t.name;if(Nn.has(e))return Qe.debug(`There were multiple attempts to register component ${e}.`),!1;Nn.set(e,t);for(const r of ur.values())bs(r,t);for(const r of ql.values())bs(r,t);return!0}function bi(t,e){const r=t.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),t.container.getProvider(e)}function Me(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ot=new gr("app","Firebase",zl);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hl{constructor(e,r,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},r),this._name=r.name,this._automaticDataCollectionEnabled=r.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new $t("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ot.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yr=$l;function wi(t,e={}){let r=t;typeof e!="object"&&(e={name:e});const n=Object.assign({name:Rn,automaticDataCollectionEnabled:!0},e),s=n.name;if(typeof s!="string"||!s)throw ot.create("bad-app-name",{appName:String(s)});if(r||(r=pi()),!r)throw ot.create("no-options");const i=ur.get(s);if(i){if(Bt(r,i.options)&&Bt(n,i.config))return i;throw ot.create("duplicate-app",{appName:s})}const o=new Xc(s);for(const a of Nn.values())o.addComponent(a);const u=new Hl(r,n,o);return ur.set(s,u),u}function _i(t=Rn){const e=ur.get(t);if(!e&&t===Rn&&pi())return wi();if(!e)throw ot.create("no-app",{appName:t});return e}function Kl(){return Array.from(ur.values())}function jt(t,e,r){var n;let s=(n=Vl[t])!==null&&n!==void 0?n:t;r&&(s+=`-${r}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const u=[`Unable to register library "${s}" with version "${e}":`];i&&u.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&u.push("and"),o&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qe.warn(u.join(" "));return}dr(new $t(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl="firebase-heartbeat-database",Gl=1,hr="firebase-heartbeat-store";let yn=null;function Ci(){return yn||(yn=ul(Wl,Gl,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(hr)}catch(r){console.warn(r)}}}}).catch(t=>{throw ot.create("idb-open",{originalErrorMessage:t.message})})),yn}async function Ql(t){try{const e=(await Ci()).transaction(hr),r=await e.objectStore(hr).get(Ii(t));return await e.done,r}catch(e){if(e instanceof lt)Qe.warn(e.message);else{const r=ot.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qe.warn(r.message)}}}async function ws(t,e){try{const r=(await Ci()).transaction(hr,"readwrite");await r.objectStore(hr).put(e,Ii(t)),await r.done}catch(r){if(r instanceof lt)Qe.warn(r.message);else{const n=ot.create("idb-set",{originalErrorMessage:r==null?void 0:r.message});Qe.warn(n.message)}}}function Ii(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl=1024,Xl=30;class Yl{constructor(e){this.container=e,this._heartbeatsCache=null;const r=this.container.getProvider("app").getImmediate();this._storage=new eu(r),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,r;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=_s();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((r=this._heartbeatsCache)===null||r===void 0?void 0:r.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:n}),this._heartbeatsCache.heartbeats.length>Xl){const i=tu(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Qe.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const r=_s(),{heartbeatsToSend:n,unsentEntries:s}=Zl(this._heartbeatsCache.heartbeats),i=hi(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=r,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(r){return Qe.warn(r),""}}}function _s(){return new Date().toISOString().substring(0,10)}function Zl(t,e=Jl){const r=[];let n=t.slice();for(const s of t){const i=r.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Cs(r)>e){i.dates.pop();break}}else if(r.push({agent:s.agent,dates:[s.date]}),Cs(r)>e){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}class eu{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Fc()?Bc().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Ql(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var r;if(await this._canUseIndexedDBPromise){const n=await this.read();return ws(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var r;if(await this._canUseIndexedDBPromise){const n=await this.read();return ws(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function Cs(t){return hi(JSON.stringify({version:2,heartbeats:t})).length}function tu(t){if(t.length===0)return-1;let e=0,r=t[0].date;for(let n=1;n<t.length;n++)t[n].date<r&&(r=t[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ru(t){dr(new $t("platform-logger",e=>new fl(e),"PRIVATE")),dr(new $t("heartbeat",e=>new Yl(e),"PRIVATE")),jt(Tn,ys,t),jt(Tn,ys,"esm2017"),jt("fire-js","")}ru("");var nu="firebase",su="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */jt(nu,su,"app");function qn(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(t);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(t,n[s])&&(r[n[s]]=t[n[s]]);return r}function xi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const iu=xi,Ei=new gr("auth","Firebase",xi());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vr=new gi("@firebase/auth");function au(t,...e){Vr.logLevel<=H.WARN&&Vr.warn(`Auth (${yr}): ${t}`,...e)}function Lr(t,...e){Vr.logLevel<=H.ERROR&&Vr.error(`Auth (${yr}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(t,...e){throw Hn(t,...e)}function je(t,...e){return Hn(t,...e)}function zn(t,e,r){const n=Object.assign(Object.assign({},iu()),{[e]:r});return new gr("auth","Firebase",n).create(e,{appName:t.name})}function ct(t){return zn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Si(t,e,r){const n=r;if(!(e instanceof n))throw n.name!==e.constructor.name&&Fe(t,"argument-error"),zn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Hn(t,...e){if(typeof t!="string"){const r=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=t.name),t._errorFactory.create(r,...n)}return Ei.create(t,...e)}function L(t,e,...r){if(!t)throw Hn(e,...r)}function We(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Lr(e),new Error(e)}function Je(t,e){t||We(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function An(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function ou(){return Is()==="http:"||Is()==="https:"}function Is(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cu(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ou()||jc()||"connection"in navigator)?navigator.onLine:!0}function lu(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,r){this.shortDelay=e,this.longDelay=r,Je(r>e,"Short delay should be less than long delay!"),this.isMobile=Mc()||Dc()}get(){return cu()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kn(t,e){Je(t.emulator,"Emulator should always be set here");const{url:r}=t.emulator;return e?`${r}${e.startsWith("/")?e.slice(1):e}`:r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{static initialize(e,r,n){this.fetchImpl=e,r&&(this.headersImpl=r),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;We("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;We("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;We("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uu={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const du=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],hu=new br(3e4,6e4);function Wn(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Ht(t,e,r,n,s={}){return Ti(t,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const u=vr(Object.assign({key:t.config.apiKey},o)).slice(1),a=await t._getAdditionalHeaders();a["Content-Type"]="application/json",t.languageCode&&(a["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:a},i);return Lc()||(c.referrerPolicy="no-referrer"),t.emulatorConfig&&en(t.emulatorConfig.host)&&(c.credentials="include"),ki.fetch()(await Ri(t,t.config.apiHost,r,u),c)})}async function Ti(t,e,r){t._canInitEmulator=!1;const n=Object.assign(Object.assign({},uu),e);try{const s=new pu(t),i=await Promise.race([r(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Rr(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const u=i.ok?o.errorMessage:o.error.message,[a,c]=u.split(" : ");if(a==="FEDERATED_USER_ID_ALREADY_LINKED")throw Rr(t,"credential-already-in-use",o);if(a==="EMAIL_EXISTS")throw Rr(t,"email-already-in-use",o);if(a==="USER_DISABLED")throw Rr(t,"user-disabled",o);const l=n[a]||a.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw zn(t,l,c);Fe(t,l)}}catch(s){if(s instanceof lt)throw s;Fe(t,"network-request-failed",{message:String(s)})}}async function fu(t,e,r,n,s={}){const i=await Ht(t,e,r,n,s);return"mfaPendingCredential"in i&&Fe(t,"multi-factor-auth-required",{_serverResponse:i}),i}async function Ri(t,e,r,n){const s=`${e}${r}?${n}`,i=t,o=i.config.emulator?Kn(t.config,s):`${t.config.apiScheme}://${s}`;return du.includes(r)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}class pu{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((r,n)=>{this.timer=setTimeout(()=>n(je(this.auth,"network-request-failed")),hu.get())})}}function Rr(t,e,r){const n={appName:t.name};r.email&&(n.email=r.email),r.phoneNumber&&(n.phoneNumber=r.phoneNumber);const s=je(t,e,n);return s.customData._tokenResponse=r,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mu(t,e){return Ht(t,"POST","/v1/accounts:delete",e)}async function qr(t,e){return Ht(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function gu(t,e=!1){const r=zt(t),n=await r.getIdToken(e),s=Gn(n);L(s&&s.exp&&s.auth_time&&s.iat,r.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:sr(bn(s.auth_time)),issuedAtTime:sr(bn(s.iat)),expirationTime:sr(bn(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function bn(t){return Number(t)*1e3}function Gn(t){const[e,r,n]=t.split(".");if(e===void 0||r===void 0||n===void 0)return Lr("JWT malformed, contained fewer than 3 sections"),null;try{const s=fi(r);return s?JSON.parse(s):(Lr("Failed to decode base64 JWT payload"),null)}catch(s){return Lr("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function xs(t){const e=Gn(t);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fr(t,e,r=!1){if(r)return e;try{return await e}catch(n){throw n instanceof lt&&vu(n)&&t.auth.currentUser===t&&await t.auth.signOut(),n}}function vu({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var r;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const n=((r=this.user.stsTokenManager.expirationTime)!==null&&r!==void 0?r:0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const r=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},r)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e,r){this.createdAt=e,this.lastLoginAt=r,this._initializeTime()}_initializeTime(){this.lastSignInTime=sr(this.lastLoginAt),this.creationTime=sr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zr(t){var e;const r=t.auth,n=await t.getIdToken(),s=await fr(t,qr(r,{idToken:n}));L(s==null?void 0:s.users.length,r,"internal-error");const i=s.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Ni(i.providerUserInfo):[],u=wu(t.providerData,o),a=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(u!=null&&u.length),l=a?c:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:u,metadata:new Pn(i.createdAt,i.lastLoginAt),isAnonymous:l};Object.assign(t,d)}async function bu(t){const e=zt(t);await zr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function wu(t,e){return[...t.filter(r=>!e.some(n=>n.providerId===r.providerId)),...e]}function Ni(t){return t.map(e=>{var{providerId:r}=e,n=qn(e,["providerId"]);return{providerId:r,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _u(t,e){const r=await Ti(t,{},async()=>{const n=vr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=t.config,o=await Ri(t,s,"/v1/token",`key=${i}`),u=await t._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:u,body:n};return t.emulatorConfig&&en(t.emulatorConfig.host)&&(a.credentials="include"),ki.fetch()(o,a)});return{accessToken:r.access_token,expiresIn:r.expires_in,refreshToken:r.refresh_token}}async function Cu(t,e){return Ht(t,"POST","/v2/accounts:revokeToken",Wn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const r="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):xs(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,r)}updateFromIdToken(e){L(e.length!==0,"internal-error");const r=xs(e);this.updateTokensAndExpiration(e,null,r)}async getToken(e,r=!1){return!r&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,r){const{accessToken:n,refreshToken:s,expiresIn:i}=await _u(e,r);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,r,n){this.refreshToken=r||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,r){const{refreshToken:n,accessToken:s,expirationTime:i}=r,o=new Dt;return n&&(L(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(L(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(L(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Dt,this.toJSON())}_performRefresh(){return We("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rt(t,e){L(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Le{constructor(e){var{uid:r,auth:n,stsTokenManager:s}=e,i=qn(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new yu(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=r,this.auth=n,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Pn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const r=await fr(this,this.stsTokenManager.getToken(this.auth,e));return L(r,this.auth,"internal-error"),this.accessToken!==r&&(this.accessToken=r,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),r}getIdTokenResult(e){return gu(this,e)}reload(){return bu(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(r=>Object.assign({},r)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const r=new Le(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return r.metadata._copy(this.metadata),r}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,r=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),r&&await zr(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Me(this.auth.app))return Promise.reject(ct(this.auth));const e=await this.getIdToken();return await fr(this,mu(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,r){var n,s,i,o,u,a,c,l;const d=(n=r.displayName)!==null&&n!==void 0?n:void 0,p=(s=r.email)!==null&&s!==void 0?s:void 0,m=(i=r.phoneNumber)!==null&&i!==void 0?i:void 0,f=(o=r.photoURL)!==null&&o!==void 0?o:void 0,y=(u=r.tenantId)!==null&&u!==void 0?u:void 0,w=(a=r._redirectEventId)!==null&&a!==void 0?a:void 0,A=(c=r.createdAt)!==null&&c!==void 0?c:void 0,x=(l=r.lastLoginAt)!==null&&l!==void 0?l:void 0,{uid:C,emailVerified:T,isAnonymous:D,providerData:M,stsTokenManager:R}=r;L(C&&R,e,"internal-error");const P=Dt.fromJSON(this.name,R);L(typeof C=="string",e,"internal-error"),rt(d,e.name),rt(p,e.name),L(typeof T=="boolean",e,"internal-error"),L(typeof D=="boolean",e,"internal-error"),rt(m,e.name),rt(f,e.name),rt(y,e.name),rt(w,e.name),rt(A,e.name),rt(x,e.name);const $=new Le({uid:C,auth:e,email:p,emailVerified:T,displayName:d,isAnonymous:D,photoURL:f,phoneNumber:m,tenantId:y,stsTokenManager:P,createdAt:A,lastLoginAt:x});return M&&Array.isArray(M)&&($.providerData=M.map(W=>Object.assign({},W))),w&&($._redirectEventId=w),$}static async _fromIdTokenResponse(e,r,n=!1){const s=new Dt;s.updateFromServerResponse(r);const i=new Le({uid:r.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await zr(i),i}static async _fromGetAccountInfoResponse(e,r,n){const s=r.users[0];L(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Ni(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),u=new Dt;u.updateFromIdToken(n);const a=new Le({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:o}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Pn(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(a,c),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=new Map;function Ge(t){Je(t instanceof Function,"Expected a class definition");let e=Es.get(t);return e?(Je(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Es.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,r){this.storage[e]=r}async _get(e){const r=this.storage[e];return r===void 0?null:r}async _remove(e){delete this.storage[e]}_addListener(e,r){}_removeListener(e,r){}}Ai.type="NONE";const Ss=Ai;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jr(t,e,r){return`firebase:${t}:${e}:${r}`}class Ut{constructor(e,r,n){this.persistence=e,this.auth=r,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=jr(this.userKey,s.apiKey,i),this.fullPersistenceKey=jr("persistence",s.apiKey,i),this.boundEventHandler=r._onStorageEvent.bind(r),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const r=await qr(this.auth,{idToken:e}).catch(()=>{});return r?Le._fromGetAccountInfoResponse(this.auth,r,e):null}return Le._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const r=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,r)return this.setCurrentUser(r)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,r,n="authUser"){if(!r.length)return new Ut(Ge(Ss),e,n);const s=(await Promise.all(r.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=s[0]||Ge(Ss);const o=jr(n,e.config.apiKey,e.name);let u=null;for(const c of r)try{const l=await c._get(o);if(l){let d;if(typeof l=="string"){const p=await qr(e,{idToken:l}).catch(()=>{});if(!p)break;d=await Le._fromGetAccountInfoResponse(e,p,l)}else d=Le._fromJSON(e,l);c!==i&&(u=d),i=c;break}}catch{}const a=s.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!a.length?new Ut(i,e,n):(i=a[0],u&&await i._set(o,u.toJSON()),await Promise.all(r.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new Ut(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ks(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Li(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Pi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Di(e))return"Blackberry";if(Ui(e))return"Webos";if(Oi(e))return"Safari";if((e.includes("chrome/")||Mi(e))&&!e.includes("edge/"))return"Chrome";if(ji(e))return"Android";{const r=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=t.match(r);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function Pi(t=be()){return/firefox\//i.test(t)}function Oi(t=be()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Mi(t=be()){return/crios\//i.test(t)}function Li(t=be()){return/iemobile/i.test(t)}function ji(t=be()){return/android/i.test(t)}function Di(t=be()){return/blackberry/i.test(t)}function Ui(t=be()){return/webos/i.test(t)}function Qn(t=be()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Iu(t=be()){var e;return Qn(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function xu(){return Uc()&&document.documentMode===10}function Fi(t=be()){return Qn(t)||ji(t)||Ui(t)||Di(t)||/windows phone/i.test(t)||Li(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bi(t,e=[]){let r;switch(t){case"Browser":r=ks(be());break;case"Worker":r=`${ks(be())}-${t}`;break;default:r=t}const n=e.length?e.join(","):"FirebaseCore-web";return`${r}/JsCore/${yr}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eu{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,r){const n=i=>new Promise((o,u)=>{try{const a=e(i);o(a)}catch(a){u(a)}});n.onAbort=r,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const r=[];try{for(const n of this.queue)await n(e),n.onAbort&&r.push(n.onAbort)}catch(n){r.reverse();for(const s of r)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Su(t,e={}){return Ht(t,"GET","/v2/passwordPolicy",Wn(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ku=6;class Tu{constructor(e){var r,n,s,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(r=o.minPasswordLength)!==null&&r!==void 0?r:ku,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var r,n,s,i,o,u;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=(r=a.meetsMinPasswordLength)!==null&&r!==void 0?r:!0),a.isValid&&(a.isValid=(n=a.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),a.isValid&&(a.isValid=(s=a.containsLowercaseLetter)!==null&&s!==void 0?s:!0),a.isValid&&(a.isValid=(i=a.containsUppercaseLetter)!==null&&i!==void 0?i:!0),a.isValid&&(a.isValid=(o=a.containsNumericCharacter)!==null&&o!==void 0?o:!0),a.isValid&&(a.isValid=(u=a.containsNonAlphanumericCharacter)!==null&&u!==void 0?u:!0),a}validatePasswordLengthOptions(e,r){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(r.meetsMinPasswordLength=e.length>=n),s&&(r.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,r){this.updatePasswordCharacterOptionsStatuses(r,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(r,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,r,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=r)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ru{constructor(e,r,n,s){this.app=e,this.heartbeatServiceProvider=r,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ts(this),this.idTokenSubscription=new Ts(this),this.beforeStateQueue=new Eu(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ei,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,r){return r&&(this._popupRedirectResolver=Ge(r)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted&&(this.persistenceManager=await Ut.create(this,e),(n=this._resolvePersistenceManagerAvailable)===null||n===void 0||n.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(r),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const r=await qr(this,{idToken:e}),n=await Le._fromGetAccountInfoResponse(this,r,e);await this.directlySetCurrentUser(n)}catch(r){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",r),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var r;if(Me(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(u,u))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let s=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId,u=s==null?void 0:s._redirectEventId,a=await this.tryRedirectSignIn(e);(!o||o===u)&&a!=null&&a.user&&(s=a.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let r=null;try{r=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return r}async reloadAndSetCurrentUserOrClear(e){try{await zr(e)}catch(r){if((r==null?void 0:r.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=lu()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Me(this.app))return Promise.reject(ct(this));const r=e?zt(e):null;return r&&L(r.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(r&&r._clone(this))}async _updateCurrentUser(e,r=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),r||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Me(this.app)?Promise.reject(ct(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Me(this.app)?Promise.reject(ct(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ge(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const r=this._getPasswordPolicyInternal();return r.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):r.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Su(this),r=new Tu(e);this.tenantId===null?this._projectPasswordPolicy=r:this._tenantPasswordPolicies[this.tenantId]=r}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new gr("auth","Firebase",e())}onAuthStateChanged(e,r,n){return this.registerStateListener(this.authStateSubscription,e,r,n)}beforeAuthStateChanged(e,r){return this.beforeStateQueue.pushCallback(e,r)}onIdTokenChanged(e,r,n){return this.registerStateListener(this.idTokenSubscription,e,r,n)}authStateReady(){return new Promise((e,r)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},r)}})}async revokeAccessToken(e){if(this.currentUser){const r=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:r};this.tenantId!=null&&(n.tenantId=this.tenantId),await Cu(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,r){const n=await this.getOrInitRedirectPersistenceManager(r);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const r=e&&Ge(e)||this._popupRedirectResolver;L(r,this,"argument-error"),this.redirectPersistenceManager=await Ut.create(this,[Ge(r._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var r,n;return this._isInitialized&&await this.queue(async()=>{}),((r=this._currentUser)===null||r===void 0?void 0:r._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,r;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(r=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&r!==void 0?r:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,r,n,s){if(this._deleted)return()=>{};const i=typeof r=="function"?r:r.next.bind(r);let o=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(u,this,"internal-error"),u.then(()=>{o||i(this.currentUser)}),typeof r=="function"){const a=e.addObserver(r,n,s);return()=>{o=!0,a()}}else{const a=e.addObserver(r);return()=>{o=!0,a()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Bi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const r={"X-Client-Version":this.clientVersion};this.app.options.appId&&(r["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(r["X-Firebase-Client"]=n);const s=await this._getAppCheckToken();return s&&(r["X-Firebase-AppCheck"]=s),r}async _getAppCheckToken(){var e;if(Me(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const r=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return r!=null&&r.error&&au(`Error while retrieving App Check token: ${r.error}`),r==null?void 0:r.token}}function Kt(t){return zt(t)}class Ts{constructor(e){this.auth=e,this.observer=null,this.addObserver=Hc(r=>this.observer=r)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Jn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Nu(t){Jn=t}function Au(t){return Jn.loadJS(t)}function Pu(){return Jn.gapiScript}function Ou(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mu(t,e){const r=bi(t,"auth");if(r.isInitialized()){const n=r.getImmediate(),s=r.getOptions();if(Bt(s,e??{}))return n;Fe(n,"already-initialized")}return r.initialize({options:e})}function Lu(t,e){const r=(e==null?void 0:e.persistence)||[],n=(Array.isArray(r)?r:[r]).map(Ge);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function ju(t,e,r){const n=Kt(t);L(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=$i(e),{host:o,port:u}=Du(e),a=u===null?"":`:${u}`,c={url:`${i}//${o}${a}/`},l=Object.freeze({host:o,port:u,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){L(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),L(Bt(c,n.config.emulator)&&Bt(l,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=c,n.emulatorConfig=l,n.settings.appVerificationDisabledForTesting=!0,en(o)?(Nc(`${i}//${o}${a}`),Oc("Auth",!0)):Uu()}function $i(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Du(t){const e=$i(t),r=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!r)return{host:"",port:null};const n=r[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Rs(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:Rs(o)}}}function Rs(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Uu(){function t(){const e=document.createElement("p"),r=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",r.position="fixed",r.width="100%",r.backgroundColor="#ffffff",r.border=".1em solid #000000",r.color="#b50000",r.bottom="0px",r.left="0px",r.margin="0px",r.zIndex="10000",r.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(e,r){this.providerId=e,this.signInMethod=r}toJSON(){return We("not implemented")}_getIdTokenResponse(e){return We("not implemented")}_linkToIdToken(e,r){return We("not implemented")}_getReauthenticationResolver(e){return We("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ft(t,e){return fu(t,"POST","/v1/accounts:signInWithIdp",Wn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fu="http://localhost";class Xe extends Vi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const r=new Xe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(r.idToken=e.idToken),e.accessToken&&(r.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(r.nonce=e.nonce),e.pendingToken&&(r.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(r.accessToken=e.oauthToken,r.secret=e.oauthTokenSecret):Fe("argument-error"),r}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const r=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s}=r,i=qn(r,["providerId","signInMethod"]);if(!n||!s)return null;const o=new Xe(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const r=this.buildRequest();return Ft(e,r)}_linkToIdToken(e,r){const n=this.buildRequest();return n.idToken=r,Ft(e,n)}_getReauthenticationResolver(e){const r=this.buildRequest();return r.autoCreate=!1,Ft(e,r)}buildRequest(){const e={requestUri:Fu,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const r={};this.idToken&&(r.id_token=this.idToken),this.accessToken&&(r.access_token=this.accessToken),this.secret&&(r.oauth_token_secret=this.secret),r.providerId=this.providerId,this.nonce&&!this.pendingToken&&(r.nonce=this.nonce),e.postBody=vr(r)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt extends tn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class ir extends Wt{static credentialFromJSON(e){const r=typeof e=="string"?JSON.parse(e):e;return L("providerId"in r&&"signInMethod"in r,"argument-error"),Xe._fromParams(r)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return L(e.idToken||e.accessToken,"argument-error"),Xe._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return ir.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return ir.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:r,oauthAccessToken:n,oauthTokenSecret:s,pendingToken:i,nonce:o,providerId:u}=e;if(!n&&!s&&!r&&!i||!u)return null;try{return new ir(u)._credential({idToken:r,accessToken:n,nonce:o,pendingToken:i})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt extends Wt{constructor(){super("facebook.com")}static credential(e){return Xe._fromParams({providerId:nt.PROVIDER_ID,signInMethod:nt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return nt.credentialFromTaggedObject(e)}static credentialFromError(e){return nt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return nt.credential(e.oauthAccessToken)}catch{return null}}}nt.FACEBOOK_SIGN_IN_METHOD="facebook.com";nt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He extends Wt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,r){return Xe._fromParams({providerId:He.PROVIDER_ID,signInMethod:He.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:r})}static credentialFromResult(e){return He.credentialFromTaggedObject(e)}static credentialFromError(e){return He.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:r,oauthAccessToken:n}=e;if(!r&&!n)return null;try{return He.credential(r,n)}catch{return null}}}He.GOOGLE_SIGN_IN_METHOD="google.com";He.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st extends Wt{constructor(){super("github.com")}static credential(e){return Xe._fromParams({providerId:st.PROVIDER_ID,signInMethod:st.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return st.credentialFromTaggedObject(e)}static credentialFromError(e){return st.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return st.credential(e.oauthAccessToken)}catch{return null}}}st.GITHUB_SIGN_IN_METHOD="github.com";st.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it extends Wt{constructor(){super("twitter.com")}static credential(e,r){return Xe._fromParams({providerId:it.PROVIDER_ID,signInMethod:it.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:r})}static credentialFromResult(e){return it.credentialFromTaggedObject(e)}static credentialFromError(e){return it.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:r,oauthTokenSecret:n}=e;if(!r||!n)return null;try{return it.credential(r,n)}catch{return null}}}it.TWITTER_SIGN_IN_METHOD="twitter.com";it.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,r,n,s=!1){const i=await Le._fromIdTokenResponse(e,n,s),o=Ns(n);return new Vt({user:i,providerId:o,_tokenResponse:n,operationType:r})}static async _forOperation(e,r,n){await e._updateTokensIfNecessary(n,!0);const s=Ns(n);return new Vt({user:e,providerId:s,_tokenResponse:n,operationType:r})}}function Ns(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr extends lt{constructor(e,r,n,s){var i;super(r.code,r.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,Hr.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:r.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,r,n,s){return new Hr(e,r,n,s)}}function qi(t,e,r,n){return(e==="reauthenticate"?r._getReauthenticationResolver(t):r._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Hr._fromErrorAndOperation(t,s,e,n):s})}async function Bu(t,e,r=!1){const n=await fr(t,e._linkToIdToken(t.auth,await t.getIdToken()),r);return Vt._forOperation(t,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $u(t,e,r=!1){const{auth:n}=t;if(Me(n.app))return Promise.reject(ct(n));const s="reauthenticate";try{const i=await fr(t,qi(n,s,e,t),r);L(i.idToken,n,"internal-error");const o=Gn(i.idToken);L(o,n,"internal-error");const{sub:u}=o;return L(t.uid===u,n,"user-mismatch"),Vt._forOperation(t,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Fe(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vu(t,e,r=!1){if(Me(t.app))return Promise.reject(ct(t));const n="signIn",s=await qi(t,n,e),i=await Vt._fromIdTokenResponse(t,n,s);return r||await t._updateCurrentUser(i.user),i}function qu(t,e,r,n){return zt(t).onIdTokenChanged(e,r,n)}function zu(t,e,r){return zt(t).beforeAuthStateChanged(e,r)}const Kr="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e,r){this.storageRetriever=e,this.type=r}_isAvailable(){try{return this.storage?(this.storage.setItem(Kr,"1"),this.storage.removeItem(Kr),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,r){return this.storage.setItem(e,JSON.stringify(r)),Promise.resolve()}_get(e){const r=this.storage.getItem(e);return Promise.resolve(r?JSON.parse(r):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hu=1e3,Ku=10;class Hi extends zi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,r)=>this.onStorageEvent(e,r),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Fi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const r of Object.keys(this.listeners)){const n=this.storage.getItem(r),s=this.localCache[r];n!==s&&e(r,s,n)}}onStorageEvent(e,r=!1){if(!e.key){this.forAllChangedKeys((o,u,a)=>{this.notifyListeners(o,a)});return}const n=e.key;r?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!r&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);xu()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Ku):s()}notifyListeners(e,r){this.localCache[e]=r;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(r&&JSON.parse(r))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,r,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:r,newValue:n}),!0)})},Hu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,r){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(r)}_removeListener(e,r){this.listeners[e]&&(this.listeners[e].delete(r),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,r){await super._set(e,r),this.localCache[e]=JSON.stringify(r)}async _get(e){const r=await super._get(e);return this.localCache[e]=JSON.stringify(r),r}async _remove(e){await super._remove(e),delete this.localCache[e]}}Hi.type="LOCAL";const Wu=Hi;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki extends zi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,r){}_removeListener(e,r){}}Ki.type="SESSION";const Wi=Ki;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gu(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(r){return{fulfilled:!1,reason:r}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const r=this.receivers.find(s=>s.isListeningto(e));if(r)return r;const n=new rn(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const r=e,{eventId:n,eventType:s,data:i}=r.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;r.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const u=Array.from(o).map(async c=>c(r.origin,i)),a=await Gu(u);r.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:a})}_subscribe(e,r){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(r)}_unsubscribe(e,r){this.handlersMap[e]&&r&&this.handlersMap[e].delete(r),(!r||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}rn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xn(t="",e=10){let r="";for(let n=0;n<e;n++)r+=Math.floor(Math.random()*10);return t+r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qu{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,r,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((u,a)=>{const c=Xn("",20);s.port1.start();const l=setTimeout(()=>{a(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(d){const p=d;if(p.data.eventId===c)switch(p.data.status){case"ack":clearTimeout(l),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),u(p.data.response);break;default:clearTimeout(l),clearTimeout(i),a(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:r},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ue(){return window}function Ju(t){Ue().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gi(){return typeof Ue().WorkerGlobalScope<"u"&&typeof Ue().importScripts=="function"}async function Xu(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Yu(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function Zu(){return Gi()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi="firebaseLocalStorageDb",ed=1,Wr="firebaseLocalStorage",Ji="fbase_key";class wr{constructor(e){this.request=e}toPromise(){return new Promise((e,r)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{r(this.request.error)})})}}function nn(t,e){return t.transaction([Wr],e?"readwrite":"readonly").objectStore(Wr)}function td(){const t=indexedDB.deleteDatabase(Qi);return new wr(t).toPromise()}function On(){const t=indexedDB.open(Qi,ed);return new Promise((e,r)=>{t.addEventListener("error",()=>{r(t.error)}),t.addEventListener("upgradeneeded",()=>{const n=t.result;try{n.createObjectStore(Wr,{keyPath:Ji})}catch(s){r(s)}}),t.addEventListener("success",async()=>{const n=t.result;n.objectStoreNames.contains(Wr)?e(n):(n.close(),await td(),e(await On()))})})}async function As(t,e,r){const n=nn(t,!0).put({[Ji]:e,value:r});return new wr(n).toPromise()}async function rd(t,e){const r=nn(t,!1).get(e),n=await new wr(r).toPromise();return n===void 0?null:n.value}function Ps(t,e){const r=nn(t,!0).delete(e);return new wr(r).toPromise()}const nd=800,sd=3;class Xi{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await On(),this.db)}async _withRetries(e){let r=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(r++>sd)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Gi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=rn._getInstance(Zu()),this.receiver._subscribe("keyChanged",async(e,r)=>({keyProcessed:(await this._poll()).includes(r.key)})),this.receiver._subscribe("ping",async(e,r)=>["keyChanged"])}async initializeSender(){var e,r;if(this.activeServiceWorker=await Xu(),!this.activeServiceWorker)return;this.sender=new Qu(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((r=n[0])===null||r===void 0)&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Yu()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await On();return await As(e,Kr,"1"),await Ps(e,Kr),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,r){return this._withPendingWrite(async()=>(await this._withRetries(n=>As(n,e,r)),this.localCache[e]=r,this.notifyServiceWorker(e)))}async _get(e){const r=await this._withRetries(n=>rd(n,e));return this.localCache[e]=r,r}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ps(r,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=nn(s,!1).getAll();return new wr(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const r=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),r.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),r.push(s));return r}notifyListeners(e,r){this.localCache[e]=r;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(r)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),nd)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,r){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(r)}_removeListener(e,r){this.listeners[e]&&(this.listeners[e].delete(r),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Xi.type="LOCAL";const id=Xi;new br(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yn(t,e){return e?Ge(e):(L(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn extends Vi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ft(e,this._buildIdpRequest())}_linkToIdToken(e,r){return Ft(e,this._buildIdpRequest(r))}_getReauthenticationResolver(e){return Ft(e,this._buildIdpRequest())}_buildIdpRequest(e){const r={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(r.idToken=e),r}}function ad(t){return Vu(t.auth,new Zn(t),t.bypassAuthState)}function od(t){const{auth:e,user:r}=t;return L(r,e,"internal-error"),$u(r,new Zn(t),t.bypassAuthState)}async function cd(t){const{auth:e,user:r}=t;return L(r,e,"internal-error"),Bu(r,new Zn(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(e,r,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(r)?r:[r]}execute(){return new Promise(async(e,r)=>{this.pendingPromise={resolve:e,reject:r};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:r,sessionId:n,postBody:s,tenantId:i,error:o,type:u}=e;if(o){this.reject(o);return}const a={auth:this.auth,requestUri:r,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ad;case"linkViaPopup":case"linkViaRedirect":return cd;case"reauthViaPopup":case"reauthViaRedirect":return od;default:Fe(this.auth,"internal-error")}}resolve(e){Je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ld=new br(2e3,1e4);async function ud(t,e,r){if(Me(t.app))return Promise.reject(je(t,"operation-not-supported-in-this-environment"));const n=Kt(t);Si(t,e,tn);const s=Yn(n,r);return new _t(n,"signInViaPopup",e,s).executeNotNull()}class _t extends Yi{constructor(e,r,n,s,i){super(e,r,s,i),this.provider=n,this.authWindow=null,this.pollId=null,_t.currentPopupAction&&_t.currentPopupAction.cancel(),_t.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Je(this.filter.length===1,"Popup operations only handle one event");const e=Xn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(r=>{this.reject(r)}),this.resolver._isIframeWebStorageSupported(this.auth,r=>{r||this.reject(je(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(je(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,_t.currentPopupAction=null}pollUserCancellation(){const e=()=>{var r,n;if(!((n=(r=this.authWindow)===null||r===void 0?void 0:r.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(je(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,ld.get())};e()}}_t.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dd="pendingRedirect",Dr=new Map;class hd extends Yi{constructor(e,r,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],r,void 0,n),this.eventId=null}async execute(){let e=Dr.get(this.auth._key());if(!e){try{const r=await fd(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(r){e=()=>Promise.reject(r)}Dr.set(this.auth._key(),e)}return this.bypassAuthState||Dr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const r=await this.auth._redirectUserForId(e.eventId);if(r)return this.user=r,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function fd(t,e){const r=ea(e),n=Zi(t);if(!await n._isAvailable())return!1;const s=await n._get(r)==="true";return await n._remove(r),s}async function pd(t,e){return Zi(t)._set(ea(e),"true")}function md(t,e){Dr.set(t._key(),e)}function Zi(t){return Ge(t._redirectPersistence)}function ea(t){return jr(dd,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gd(t,e,r){return vd(t,e,r)}async function vd(t,e,r){if(Me(t.app))return Promise.reject(ct(t));const n=Kt(t);Si(t,e,tn),await n._initializationPromise;const s=Yn(n,r);return await pd(s,n),s._openRedirect(n,e,"signInViaRedirect")}async function yd(t,e){return await Kt(t)._initializationPromise,ta(t,e,!1)}async function ta(t,e,r=!1){if(Me(t.app))return Promise.reject(ct(t));const n=Kt(t),s=Yn(n,e),i=await new hd(n,s,r).execute();return i&&!r&&(delete i.user._redirectEventId,await n._persistUserIfCurrent(i.user),await n._setRedirectUser(null,e)),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bd=600*1e3;class wd{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let r=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(r=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!_d(e)||(this.hasHandledPotentialRedirect=!0,r||(this.queuedRedirectEvent=e,r=!0)),r}sendToConsumer(e,r){var n;if(e.error&&!ra(e)){const s=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";r.onError(je(this.auth,s))}else r.onAuthEvent(e)}isEventForConsumer(e,r){const n=r.eventId===null||!!e.eventId&&e.eventId===r.eventId;return r.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bd&&this.cachedEventUids.clear(),this.cachedEventUids.has(Os(e))}saveEventToCache(e){this.cachedEventUids.add(Os(e)),this.lastProcessedEventTime=Date.now()}}function Os(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ra({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function _d(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ra(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cd(t,e={}){return Ht(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Id=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,xd=/^https?/;async function Ed(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Cd(t);for(const r of e)try{if(Sd(r))return}catch{}Fe(t,"unauthorized-domain")}function Sd(t){const e=An(),{protocol:r,hostname:n}=new URL(e);if(t.startsWith("chrome-extension://")){const i=new URL(t);return i.hostname===""&&n===""?r==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):r==="chrome-extension:"&&i.hostname===n}if(!xd.test(r))return!1;if(Id.test(t))return n===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kd=new br(3e4,6e4);function Ms(){const t=Ue().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let r=0;r<t.CP.length;r++)t.CP[r]=null}}function Td(t){return new Promise((e,r)=>{var n,s,i;function o(){Ms(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ms(),r(je(t,"network-request-failed"))},timeout:kd.get()})}if(!((s=(n=Ue().gapi)===null||n===void 0?void 0:n.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Ue().gapi)===null||i===void 0)&&i.load)o();else{const u=Ou("iframefcb");return Ue()[u]=()=>{gapi.load?o():r(je(t,"network-request-failed"))},Au(`${Pu()}?onload=${u}`).catch(a=>r(a))}}).catch(e=>{throw Ur=null,e})}let Ur=null;function Rd(t){return Ur=Ur||Td(t),Ur}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nd=new br(5e3,15e3),Ad="__/auth/iframe",Pd="emulator/auth/iframe",Od={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Md=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ld(t){const e=t.config;L(e.authDomain,t,"auth-domain-config-required");const r=e.emulator?Kn(e,Pd):`https://${t.config.authDomain}/${Ad}`,n={apiKey:e.apiKey,appName:t.name,v:yr},s=Md.get(t.config.apiHost);s&&(n.eid=s);const i=t._getFrameworks();return i.length&&(n.fw=i.join(",")),`${r}?${vr(n).slice(1)}`}async function jd(t){const e=await Rd(t),r=Ue().gapi;return L(r,t,"internal-error"),e.open({where:document.body,url:Ld(t),messageHandlersFilter:r.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Od,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=je(t,"network-request-failed"),u=Ue().setTimeout(()=>{i(o)},Nd.get());function a(){Ue().clearTimeout(u),s(n)}n.ping(a).then(a,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dd={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ud=500,Fd=600,Bd="_blank",$d="http://localhost";class Ls{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Vd(t,e,r,n=Ud,s=Fd){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let u="";const a=Object.assign(Object.assign({},Dd),{width:n.toString(),height:s.toString(),top:i,left:o}),c=be().toLowerCase();r&&(u=Mi(c)?Bd:r),Pi(c)&&(e=e||$d,a.scrollbars="yes");const l=Object.entries(a).reduce((p,[m,f])=>`${p}${m}=${f},`,"");if(Iu(c)&&u!=="_self")return qd(e||"",u),new Ls(null);const d=window.open(e||"",u,l);L(d,t,"popup-blocked");try{d.focus()}catch{}return new Ls(d)}function qd(t,e){const r=document.createElement("a");r.href=t,r.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),r.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd="__/auth/handler",Hd="emulator/auth/handler",Kd=encodeURIComponent("fac");async function js(t,e,r,n,s,i){L(t.config.authDomain,t,"auth-domain-config-required"),L(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:r,redirectUrl:n,v:yr,eventId:s};if(e instanceof tn){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",zc(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[l,d]of Object.entries({}))o[l]=d}if(e instanceof Wt){const l=e.getScopes().filter(d=>d!=="");l.length>0&&(o.scopes=l.join(","))}t.tenantId&&(o.tid=t.tenantId);const u=o;for(const l of Object.keys(u))u[l]===void 0&&delete u[l];const a=await t._getAppCheckToken(),c=a?`#${Kd}=${encodeURIComponent(a)}`:"";return`${Wd(t)}?${vr(u).slice(1)}${c}`}function Wd({config:t}){return t.emulator?Kn(t,Hd):`https://${t.authDomain}/${zd}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wn="webStorageSupport";class Gd{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Wi,this._completeRedirectFn=ta,this._overrideRedirectResult=md}async _openPopup(e,r,n,s){var i;Je((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await js(e,r,n,An(),s);return Vd(e,o,Xn())}async _openRedirect(e,r,n,s){await this._originValidation(e);const i=await js(e,r,n,An(),s);return Ju(i),new Promise(()=>{})}_initialize(e){const r=e._key();if(this.eventManagers[r]){const{manager:s,promise:i}=this.eventManagers[r];return s?Promise.resolve(s):(Je(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[r]={promise:n},n.catch(()=>{delete this.eventManagers[r]}),n}async initAndGetManager(e){const r=await jd(e),n=new wd(e);return r.register("authEvent",s=>(L(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=r,n}_isIframeWebStorageSupported(e,r){this.iframes[e._key()].send(wn,{type:wn},n=>{var s;const i=(s=n==null?void 0:n[0])===null||s===void 0?void 0:s[wn];i!==void 0&&r(!!i),Fe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const r=e._key();return this.originValidationPromises[r]||(this.originValidationPromises[r]=Ed(e)),this.originValidationPromises[r]}get _shouldInitProactively(){return Fi()||Oi()||Qn()}}const Qd=Gd;var Ds="@firebase/auth",Us="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jd{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const r=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,r),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const r=this.internalListeners.get(e);r&&(this.internalListeners.delete(e),r(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xd(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Yd(t){dr(new $t("auth",(e,{options:r})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:u}=n.options;L(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:o,authDomain:u,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Bi(t)},c=new Ru(n,s,i,a);return Lu(c,r),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,r,n)=>{e.getProvider("auth-internal").initialize()})),dr(new $t("auth-internal",e=>{const r=Kt(e.getProvider("auth").getImmediate());return(n=>new Jd(n))(r)},"PRIVATE").setInstantiationMode("EXPLICIT")),jt(Ds,Us,Xd(t)),jt(Ds,Us,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zd=300,eh=mi("authIdTokenMaxAge")||Zd;let Fs=null;const th=t=>async e=>{const r=e&&await e.getIdTokenResult(),n=r&&(new Date().getTime()-Date.parse(r.issuedAtTime))/1e3;if(n&&n>eh)return;const s=r==null?void 0:r.token;Fs!==s&&(Fs=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function rh(t=_i()){const e=bi(t,"auth");if(e.isInitialized())return e.getImmediate();const r=Mu(t,{popupRedirectResolver:Qd,persistence:[id,Wu,Wi]}),n=mi("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=th(i.toString());zu(r,o,()=>o(r.currentUser)),qu(r,u=>o(u))}}const s=Tc("auth");return s&&ju(r,`http://${s}`),r}function nh(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}Nu({loadJS(t){return new Promise((e,r)=>{const n=document.createElement("script");n.setAttribute("src",t),n.onload=e,n.onerror=s=>{const i=je("internal-error");i.customData=s,r(i)},n.type="text/javascript",n.charset="UTF-8",nh().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Yd("Browser");const Bs=({className:t})=>h.jsx("svg",{className:t,fill:"none",viewBox:"9 7 12.63 15.24",xmlns:"http://www.w3.org/2000/svg",children:h.jsx("path",{d:"M20.1892 17.0243C20.6082 17.617 21.0884 18.0002 21.63 18.1739C21.395 18.8994 21.022 19.6555 20.5111 20.4424C19.7243 21.6277 18.9477 22.2204 18.1813 22.2204C17.8952 22.2204 17.4711 22.1233 16.9091 21.9292C16.3879 21.735 15.9332 21.6379 15.5449 21.6379C15.1566 21.6379 14.7274 21.7401 14.2574 21.9445C13.7669 22.1386 13.3633 22.2357 13.0465 22.2357C12.1268 22.2357 11.2225 21.454 10.3335 19.8906C9.4445 18.3476 9 16.8301 9 15.3383C9 13.9588 9.33721 12.8296 10.0116 11.9508C10.7065 11.0721 11.5648 10.6327 12.5867 10.6327C12.8115 10.6327 13.0618 10.6608 13.3377 10.717C13.6136 10.7732 13.8997 10.8779 14.1961 11.0312C14.5129 11.2049 14.7734 11.325 14.9778 11.3914C15.1822 11.4578 15.3405 11.491 15.4529 11.491C15.5858 11.491 15.7902 11.4604 16.0661 11.399C16.342 11.3377 16.6179 11.2253 16.8937 11.0618C17.1901 10.8983 17.4455 10.7757 17.6601 10.694C17.8747 10.6122 18.0944 10.5713 18.3192 10.5713C19.0345 10.5713 19.6783 10.7655 20.2505 11.1538C20.5571 11.3582 20.8687 11.6596 21.1855 12.0581C20.7154 12.4669 20.3731 12.8245 20.1585 13.1311C19.76 13.7033 19.5608 14.3266 19.5608 15.001C19.5608 15.747 19.7702 16.4214 20.1892 17.0243ZM17.1083 9.86627C16.7507 10.2035 16.4237 10.4232 16.1274 10.5254C16.0252 10.556 15.8949 10.5841 15.7365 10.6097C15.5781 10.6352 15.3967 10.6582 15.1924 10.6786C15.2026 9.77942 15.4376 9.00282 15.8975 8.34883C16.3573 7.69485 17.1134 7.24524 18.1659 7C18.1864 7.10218 18.2017 7.17371 18.2119 7.21459V7.38319C18.2119 7.75106 18.1251 8.1649 17.9514 8.62473C17.7674 9.07434 17.4864 9.48819 17.1083 9.86627Z",fill:"#333333"})}),$s=({className:t})=>h.jsx("svg",{className:t,fill:"none",viewBox:"9 7 12.63 15.24",xmlns:"http://www.w3.org/2000/svg",children:h.jsx("path",{d:"M20.1892 17.0243C20.6082 17.617 21.0884 18.0002 21.63 18.1739C21.395 18.8994 21.022 19.6555 20.5111 20.4424C19.7243 21.6277 18.9477 22.2204 18.1813 22.2204C17.8952 22.2204 17.4711 22.1233 16.9091 21.9292C16.3879 21.735 15.9332 21.6379 15.5449 21.6379C15.1566 21.6379 14.7274 21.7401 14.2574 21.9445C13.7669 22.1386 13.3633 22.2357 13.0465 22.2357C12.1268 22.2357 11.2225 21.454 10.3335 19.8906C9.4445 18.3476 9 16.8301 9 15.3383C9 13.9588 9.33721 12.8296 10.0116 11.9508C10.7065 11.0721 11.5648 10.6327 12.5867 10.6327C12.8115 10.6327 13.0618 10.6608 13.3377 10.717C13.6136 10.7732 13.8997 10.8779 14.1961 11.0312C14.5129 11.2049 14.7734 11.325 14.9778 11.3914C15.1822 11.4578 15.3405 11.491 15.4529 11.491C15.5858 11.491 15.7902 11.4604 16.0661 11.399C16.342 11.3377 16.6179 11.2253 16.8937 11.0618C17.1901 10.8983 17.4455 10.7757 17.6601 10.694C17.8747 10.6122 18.0944 10.5713 18.3192 10.5713C19.0345 10.5713 19.6783 10.7655 20.2505 11.1538C20.5571 11.3582 20.8687 11.6596 21.1855 12.0581C20.7154 12.4669 20.3731 12.8245 20.1585 13.1311C19.76 13.7033 19.5608 14.3266 19.5608 15.001C19.5608 15.747 19.7702 16.4214 20.1892 17.0243ZM17.1083 9.86627C16.7507 10.2035 16.4237 10.4232 16.1274 10.5254C16.0252 10.556 15.8949 10.5841 15.7365 10.6097C15.5781 10.6352 15.3967 10.6582 15.1924 10.6786C15.2026 9.77942 15.4376 9.00282 15.8975 8.34883C16.3573 7.69485 17.1134 7.24524 18.1659 7C18.1864 7.10218 18.2017 7.17371 18.2119 7.21459V7.38319C18.2119 7.75106 18.1251 8.1649 17.9514 8.62473C17.7674 9.07434 17.4864 9.48819 17.1083 9.86627Z",fill:"white"})}),Vs=({className:t})=>h.jsxs("svg",{className:t,fill:"none",viewBox:"8.684 8.684 12.73 12.63",xmlns:"http://www.w3.org/2000/svg",children:[h.jsx("path",{d:"M21.2171 13.8808H15.0004V16.2953H18.5855C18.417 16.7501 18.1629 17.1685 17.837 17.5277C17.6291 17.7619 17.3971 17.9719 17.1374 18.1485L19.1432 19.7577C19.9691 19.0423 20.5946 18.1243 20.9581 17.0938C21.3216 16.0634 21.4107 14.9561 21.2164 13.8808",fill:"#278BE6"}),h.jsx("path",{d:"M17.1374 18.1493C16.5081 18.5812 15.7628 18.8123 14.9996 18.812C13.8693 18.812 12.8654 18.3104 12.1672 17.5278C11.8446 17.1672 11.5941 16.7481 11.4293 16.2932L9.80309 17.5278L9.3717 17.8563C9.89846 18.8967 10.7032 19.7708 11.6967 20.3815C12.6902 20.9922 13.8334 21.3156 14.9996 21.3159C15.3976 21.3159 15.7857 21.2747 16.1632 21.2045C17.2682 20.9978 18.2975 20.4984 19.1439 19.7585L17.1374 18.1493Z",fill:"#15B457"}),h.jsx("path",{d:"M11.1888 15.0009C11.1888 14.5326 11.2853 14.0891 11.44 13.6741L9.39585 12.0975C8.92829 12.9939 8.68416 13.9899 8.6842 15.0009C8.6842 15.5997 8.7736 16.1773 8.92899 16.7264C9.00703 17.0017 9.1014 17.2699 9.21421 17.5282C9.26317 17.6403 9.31709 17.7481 9.37172 17.8567L9.80382 17.5289L11.4286 16.2943C11.3742 16.1499 11.3287 16.0023 11.2924 15.8523C11.2257 15.5733 11.191 15.2877 11.1888 15.0009Z",fill:"#F0BB2F"}),h.jsx("path",{d:"M16.1632 8.79371C15.7795 8.72163 15.39 8.68505 14.9996 8.68445C12.7377 8.68445 10.7588 9.87643 9.64347 11.6644C9.57252 11.7779 9.50015 11.8915 9.43629 12.0099C9.4221 12.0376 9.40933 12.0667 9.39514 12.0951L11.4393 13.6738C11.5322 13.4247 11.6464 13.187 11.7869 12.9657C12.0211 12.5967 12.3198 12.2789 12.6625 12.0099C13.3095 11.5034 14.1141 11.1883 14.9996 11.1883C15.4076 11.1883 15.7943 11.265 16.1632 11.3834C16.596 11.5232 16.9933 11.7354 17.3424 12.0099C17.3992 12.0539 17.463 12.0894 17.5156 12.137L17.6433 12.0092L19.2865 10.3617C18.4144 9.55436 17.3316 9.01046 16.1632 8.793",fill:"#EC3838"})]}),qs=({className:t})=>h.jsxs("svg",{className:t,fill:"none",viewBox:"8.684 8.684 12.73 12.63",xmlns:"http://www.w3.org/2000/svg",children:[h.jsx("path",{d:"M21.2171 13.8808H15.0004V16.2953H18.5855C18.417 16.7501 18.1629 17.1685 17.837 17.5277C17.6291 17.7619 17.3971 17.9719 17.1374 18.1485L19.1432 19.7577C19.9691 19.0423 20.5946 18.1243 20.9581 17.0938C21.3216 16.0634 21.4107 14.9561 21.2164 13.8808",fill:"#278BE6"}),h.jsx("path",{d:"M17.1374 18.1493C16.5081 18.5812 15.7628 18.8123 14.9996 18.812C13.8693 18.812 12.8654 18.3104 12.1672 17.5278C11.8446 17.1672 11.5941 16.7481 11.4293 16.2932L9.80309 17.5278L9.3717 17.8563C9.89846 18.8967 10.7032 19.7708 11.6967 20.3815C12.6902 20.9922 13.8334 21.3156 14.9996 21.3159C15.3976 21.3159 15.7857 21.2747 16.1632 21.2045C17.2682 20.9978 18.2975 20.4984 19.1439 19.7585L17.1374 18.1493Z",fill:"#15B457"}),h.jsx("path",{d:"M11.1888 15.0009C11.1888 14.5326 11.2853 14.0891 11.44 13.6741L9.39585 12.0975C8.92829 12.9939 8.68416 13.9899 8.6842 15.0009C8.6842 15.5997 8.7736 16.1773 8.92899 16.7264C9.00703 17.0017 9.1014 17.2699 9.21421 17.5282C9.26317 17.6403 9.31709 17.7481 9.37172 17.8567L9.80382 17.5289L11.4286 16.2943C11.3742 16.1499 11.3287 16.0023 11.2924 15.8523C11.2257 15.5733 11.191 15.2877 11.1888 15.0009Z",fill:"#F0BB2F"}),h.jsx("path",{d:"M16.1632 8.79371C15.7795 8.72163 15.39 8.68505 14.9996 8.68445C12.7377 8.68445 10.7588 9.87643 9.64347 11.6644C9.57252 11.7779 9.50015 11.8915 9.43629 12.0099C9.4221 12.0376 9.40933 12.0667 9.39514 12.0951L11.4393 13.6738C11.5322 13.4247 11.6464 13.187 11.7869 12.9657C12.0211 12.5967 12.3198 12.2789 12.6625 12.0099C13.3095 11.5034 14.1141 11.1883 14.9996 11.1883C15.4076 11.1883 15.7943 11.265 16.1632 11.3834C16.596 11.5232 16.9933 11.7354 17.3424 12.0099C17.3992 12.0539 17.463 12.0894 17.5156 12.137L17.6433 12.0092L19.2865 10.3617C18.4144 9.55436 17.3316 9.01046 16.1632 8.793",fill:"#EC3838"})]});function na({isInitReqGoogle:t,isDark:e,needEmail:r=!0}){const[n,s]=g.useState(!1),i=g.useCallback(({cb:f,noErrPop:y})=>{const w=new AbortController,A=setTimeout(()=>w.abort(),3e3);fetch("https://www.google.com",{method:"HEAD",mode:"no-cors",signal:w.signal}).then(()=>{clearTimeout(A),f&&f(!1)}).catch(()=>{!y&&Pe.warning("ThirdPartyLogin networkNotSupport"),f&&f(!0)})},[]);g.useEffect(()=>{t&&i({cb:f=>{s(!f)},noErrPop:!0})},[]);const[o,u]=g.useState(),a=g.useCallback((f,y,w,A="popup")=>{let x;if(f==="google")x=new He;else if(f==="apple")x=new ir("apple.com"),x.addScope("email"),x.addScope("name");else return;if(x.setCustomParameters({prompt:"select_account"}),A==="redirect"){gd(o,x).catch(C=>{console.error(C),w&&w(C)});return}ud(o,x).then(C=>{y&&y(C)}).catch(C=>{console.error(C),w&&w(C)})},[o,r]),c=g.useRef(!1),l=g.useCallback((f,y)=>{if(c.current)return;c.current=!0;const{errorCallback:w,isNet:A=!0,mode:x="popup"}=y||{};A?i({cb:T=>{if(T)return c.current=!1;C()}}):C();function C(){a("google",T=>{c.current=!1,f&&f(T)},(T,D)=>{c.current=!1,w&&w(T,D)},x)}},[i,a]),d=g.useRef(!1),p=g.useCallback((f,y)=>{if(d.current)return;d.current=!0;const{errorCallback:w,isNet:A=!0,mode:x="popup"}=y||{};A?i({cb:T=>{if(T)return d.current=!1;C()}}):C();function C(){a("apple",T=>{d.current=!1,f&&f(T)},(T,D)=>{d.current=!1,w&&w(T,D)},x)}},[i,a]),m=g.useCallback((f,y)=>o?yd(o).then(w=>{w&&(f==null||f(w))}).catch(w=>{console.error("[third-party-login] getRedirectResult failed",w),y==null||y(w)}):Promise.resolve(),[o]);return g.useEffect(()=>{const f={apiKey:"AIzaSyCowFa4D0JoG5Rudez49r6mRvLQ06ln74k",authDomain:typeof window>"u"?"siristars-76299.firebaseapp.com":window.location.hostname,projectId:"siristars-76299",storageBucket:"siristars-76299.firebasestorage.app",messagingSenderId:"463246968812",appId:"1:463246968812:web:1f713715052920f17c62c9",measurementId:"G-PX8JK1F60P"},y=Kl().length>0?_i():wi(f),w=rh(y);u(w)},[]),{isGoogleAccess:n,reqGoogle:i,loginByGoogle:l,loginByApple:p,consumeRedirectResult:m,SvgGoogle:Vs,SvgGoogleDark:qs,SvgApple:Bs,SvgAppleDark:$s,SvgThemeGoogle:e?qs:Vs,SvgThemeApple:e?$s:Bs}}const sh=({isPush:t,isBack:e,border:r=!0,className:n,iconClassName:s})=>{const{locale:i}=Ca(),{isDark:o}=Ia(),{loginByGoogle:u,loginByApple:a,consumeRedirectResult:c,SvgThemeApple:l,SvgThemeGoogle:d}=na({isDark:o}),p=`size-6 ${s} `,m=g.useCallback(y=>{sessionStorage.setItem("firebaseUserImpl",JSON.stringify(y));const w=`/accounts/third-party${e?`?backUrl=${encodeURIComponent(window.location.href)}`:window.location.search}`;if(t){const x=window.location.origin;window.location.href=`${x}/${i}${w}`;return}const A=window.location.origin;window.location.href=`${A}/${i}${w}`},[t,e,i]);g.useEffect(()=>{c(m)},[c,m]);const f=`flex items-center justify-center size-[52px] p-1 cursor-pointer appearance-none touch-manipulation relative outline-0 m-0 text-inherit bg-transparent no-underline select-none hover:outline-0 focus:outline-0 active:outline-0
    border rounded-full ${r?"border-border_strong":"border-transparent"}
    `;return h.jsxs("div",{className:V("flex gap-5",n),children:[h.jsx("button",{className:f,"data-slot":"google",onClick:()=>u(m,{isNet:!1}),children:h.jsx(d,{className:p})}),h.jsx("button",{className:f,"data-slot":"apple",onClick:()=>a(m,{isNet:!1}),children:h.jsx(l,{className:p})})]})},ih="_main_dcarw_2",ah="_line_dcarw_6",oh="_icon_dcarw_33",ch="_iconLightApple_dcarw_45",Nr={main:ih,line:ah,icon:oh,iconLightApple:ch},sa=({className:t,forceAppleDarkIcon:e})=>{const{isGoogleAccess:r}=na({isInitReqGoogle:!0});return r?h.jsxs("div",{className:V(Nr.main,t),children:[h.jsx("div",{className:V(Nr.line),children:h.jsx("span",{children:b._("cmpt.coinSubmitTip2")})}),h.jsx(sh,{className:V(Nr.icon,e&&Nr.iconLightApple),isPush:!0})]}):null},lh="_main_14y6o_1",uh="_title_14y6o_21",dh="_passkey_14y6o_32",_n={main:lh,title:uh,passkey:dh},hh=({faCheckId:t,open:e,thirdAuthDTO:r,successCallback:n,setIsPasskeyOpen:s,setState_loading:i,setShowPassword:o,className:u})=>{const a=g.useCallback(()=>{o(!0),i(!1),s(!1)},[o,i,s]),c=g.useCallback(async({faResultId:l})=>{const d=await te(ro,l,{});if(console.log("retLogin =",d),d.err)return a();n(d.data)},[n,a]);return e?h.jsx("div",{className:V(_n.main,u),children:h.jsxs("div",{children:[h.jsx("div",{className:V(_n.title),children:b._("newAccount.safeCodeTips")}),h.jsx(za,{className:V(_n.passkey),faBizType:0,faCheckId:t,thirdAuthDTO:r,successCallback:c,onSwitch:a,switchLab:b._("userCenter.usePwdLogin")})]})}):h.jsx(h.Fragment,{})},fh=qt(hh);var ph=Object.defineProperty,Gr=Object.getOwnPropertySymbols,ia=Object.prototype.hasOwnProperty,aa=Object.prototype.propertyIsEnumerable,zs=(t,e,r)=>e in t?ph(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Mn=(t,e)=>{for(var r in e||(e={}))ia.call(e,r)&&zs(t,r,e[r]);if(Gr)for(var r of Gr(e))aa.call(e,r)&&zs(t,r,e[r]);return t},Ln=(t,e)=>{var r={};for(var n in t)ia.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(t!=null&&Gr)for(var n of Gr(t))e.indexOf(n)<0&&aa.call(t,n)&&(r[n]=t[n]);return r};/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */var It;(t=>{const e=class B{constructor(a,c,l,d){if(this.version=a,this.errorCorrectionLevel=c,this.modules=[],this.isFunction=[],a<B.MIN_VERSION||a>B.MAX_VERSION)throw new RangeError("Version value out of range");if(d<-1||d>7)throw new RangeError("Mask value out of range");this.size=a*4+17;let p=[];for(let f=0;f<this.size;f++)p.push(!1);for(let f=0;f<this.size;f++)this.modules.push(p.slice()),this.isFunction.push(p.slice());this.drawFunctionPatterns();const m=this.addEccAndInterleave(l);if(this.drawCodewords(m),d==-1){let f=1e9;for(let y=0;y<8;y++){this.applyMask(y),this.drawFormatBits(y);const w=this.getPenaltyScore();w<f&&(d=y,f=w),this.applyMask(y)}}s(0<=d&&d<=7),this.mask=d,this.applyMask(d),this.drawFormatBits(d),this.isFunction=[]}static encodeText(a,c){const l=t.QrSegment.makeSegments(a);return B.encodeSegments(l,c)}static encodeBinary(a,c){const l=t.QrSegment.makeBytes(a);return B.encodeSegments([l],c)}static encodeSegments(a,c,l=1,d=40,p=-1,m=!0){if(!(B.MIN_VERSION<=l&&l<=d&&d<=B.MAX_VERSION)||p<-1||p>7)throw new RangeError("Invalid value");let f,y;for(f=l;;f++){const C=B.getNumDataCodewords(f,c)*8,T=o.getTotalBits(a,f);if(T<=C){y=T;break}if(f>=d)throw new RangeError("Data too long")}for(const C of[B.Ecc.MEDIUM,B.Ecc.QUARTILE,B.Ecc.HIGH])m&&y<=B.getNumDataCodewords(f,C)*8&&(c=C);let w=[];for(const C of a){r(C.mode.modeBits,4,w),r(C.numChars,C.mode.numCharCountBits(f),w);for(const T of C.getData())w.push(T)}s(w.length==y);const A=B.getNumDataCodewords(f,c)*8;s(w.length<=A),r(0,Math.min(4,A-w.length),w),r(0,(8-w.length%8)%8,w),s(w.length%8==0);for(let C=236;w.length<A;C^=253)r(C,8,w);let x=[];for(;x.length*8<w.length;)x.push(0);return w.forEach((C,T)=>x[T>>>3]|=C<<7-(T&7)),new B(f,c,x,p)}getModule(a,c){return 0<=a&&a<this.size&&0<=c&&c<this.size&&this.modules[c][a]}getModules(){return this.modules}drawFunctionPatterns(){for(let l=0;l<this.size;l++)this.setFunctionModule(6,l,l%2==0),this.setFunctionModule(l,6,l%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);const a=this.getAlignmentPatternPositions(),c=a.length;for(let l=0;l<c;l++)for(let d=0;d<c;d++)l==0&&d==0||l==0&&d==c-1||l==c-1&&d==0||this.drawAlignmentPattern(a[l],a[d]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(a){const c=this.errorCorrectionLevel.formatBits<<3|a;let l=c;for(let p=0;p<10;p++)l=l<<1^(l>>>9)*1335;const d=(c<<10|l)^21522;s(d>>>15==0);for(let p=0;p<=5;p++)this.setFunctionModule(8,p,n(d,p));this.setFunctionModule(8,7,n(d,6)),this.setFunctionModule(8,8,n(d,7)),this.setFunctionModule(7,8,n(d,8));for(let p=9;p<15;p++)this.setFunctionModule(14-p,8,n(d,p));for(let p=0;p<8;p++)this.setFunctionModule(this.size-1-p,8,n(d,p));for(let p=8;p<15;p++)this.setFunctionModule(8,this.size-15+p,n(d,p));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let a=this.version;for(let l=0;l<12;l++)a=a<<1^(a>>>11)*7973;const c=this.version<<12|a;s(c>>>18==0);for(let l=0;l<18;l++){const d=n(c,l),p=this.size-11+l%3,m=Math.floor(l/3);this.setFunctionModule(p,m,d),this.setFunctionModule(m,p,d)}}drawFinderPattern(a,c){for(let l=-4;l<=4;l++)for(let d=-4;d<=4;d++){const p=Math.max(Math.abs(d),Math.abs(l)),m=a+d,f=c+l;0<=m&&m<this.size&&0<=f&&f<this.size&&this.setFunctionModule(m,f,p!=2&&p!=4)}}drawAlignmentPattern(a,c){for(let l=-2;l<=2;l++)for(let d=-2;d<=2;d++)this.setFunctionModule(a+d,c+l,Math.max(Math.abs(d),Math.abs(l))!=1)}setFunctionModule(a,c,l){this.modules[c][a]=l,this.isFunction[c][a]=!0}addEccAndInterleave(a){const c=this.version,l=this.errorCorrectionLevel;if(a.length!=B.getNumDataCodewords(c,l))throw new RangeError("Invalid argument");const d=B.NUM_ERROR_CORRECTION_BLOCKS[l.ordinal][c],p=B.ECC_CODEWORDS_PER_BLOCK[l.ordinal][c],m=Math.floor(B.getNumRawDataModules(c)/8),f=d-m%d,y=Math.floor(m/d);let w=[];const A=B.reedSolomonComputeDivisor(p);for(let C=0,T=0;C<d;C++){let D=a.slice(T,T+y-p+(C<f?0:1));T+=D.length;const M=B.reedSolomonComputeRemainder(D,A);C<f&&D.push(0),w.push(D.concat(M))}let x=[];for(let C=0;C<w[0].length;C++)w.forEach((T,D)=>{(C!=y-p||D>=f)&&x.push(T[C])});return s(x.length==m),x}drawCodewords(a){if(a.length!=Math.floor(B.getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");let c=0;for(let l=this.size-1;l>=1;l-=2){l==6&&(l=5);for(let d=0;d<this.size;d++)for(let p=0;p<2;p++){const m=l-p,y=(l+1&2)==0?this.size-1-d:d;!this.isFunction[y][m]&&c<a.length*8&&(this.modules[y][m]=n(a[c>>>3],7-(c&7)),c++)}}s(c==a.length*8)}applyMask(a){if(a<0||a>7)throw new RangeError("Mask value out of range");for(let c=0;c<this.size;c++)for(let l=0;l<this.size;l++){let d;switch(a){case 0:d=(l+c)%2==0;break;case 1:d=c%2==0;break;case 2:d=l%3==0;break;case 3:d=(l+c)%3==0;break;case 4:d=(Math.floor(l/3)+Math.floor(c/2))%2==0;break;case 5:d=l*c%2+l*c%3==0;break;case 6:d=(l*c%2+l*c%3)%2==0;break;case 7:d=((l+c)%2+l*c%3)%2==0;break;default:throw new Error("Unreachable")}!this.isFunction[c][l]&&d&&(this.modules[c][l]=!this.modules[c][l])}}getPenaltyScore(){let a=0;for(let p=0;p<this.size;p++){let m=!1,f=0,y=[0,0,0,0,0,0,0];for(let w=0;w<this.size;w++)this.modules[p][w]==m?(f++,f==5?a+=B.PENALTY_N1:f>5&&a++):(this.finderPenaltyAddHistory(f,y),m||(a+=this.finderPenaltyCountPatterns(y)*B.PENALTY_N3),m=this.modules[p][w],f=1);a+=this.finderPenaltyTerminateAndCount(m,f,y)*B.PENALTY_N3}for(let p=0;p<this.size;p++){let m=!1,f=0,y=[0,0,0,0,0,0,0];for(let w=0;w<this.size;w++)this.modules[w][p]==m?(f++,f==5?a+=B.PENALTY_N1:f>5&&a++):(this.finderPenaltyAddHistory(f,y),m||(a+=this.finderPenaltyCountPatterns(y)*B.PENALTY_N3),m=this.modules[w][p],f=1);a+=this.finderPenaltyTerminateAndCount(m,f,y)*B.PENALTY_N3}for(let p=0;p<this.size-1;p++)for(let m=0;m<this.size-1;m++){const f=this.modules[p][m];f==this.modules[p][m+1]&&f==this.modules[p+1][m]&&f==this.modules[p+1][m+1]&&(a+=B.PENALTY_N2)}let c=0;for(const p of this.modules)c=p.reduce((m,f)=>m+(f?1:0),c);const l=this.size*this.size,d=Math.ceil(Math.abs(c*20-l*10)/l)-1;return s(0<=d&&d<=9),a+=d*B.PENALTY_N4,s(0<=a&&a<=2568888),a}getAlignmentPatternPositions(){if(this.version==1)return[];{const a=Math.floor(this.version/7)+2,c=this.version==32?26:Math.ceil((this.version*4+4)/(a*2-2))*2;let l=[6];for(let d=this.size-7;l.length<a;d-=c)l.splice(1,0,d);return l}}static getNumRawDataModules(a){if(a<B.MIN_VERSION||a>B.MAX_VERSION)throw new RangeError("Version number out of range");let c=(16*a+128)*a+64;if(a>=2){const l=Math.floor(a/7)+2;c-=(25*l-10)*l-55,a>=7&&(c-=36)}return s(208<=c&&c<=29648),c}static getNumDataCodewords(a,c){return Math.floor(B.getNumRawDataModules(a)/8)-B.ECC_CODEWORDS_PER_BLOCK[c.ordinal][a]*B.NUM_ERROR_CORRECTION_BLOCKS[c.ordinal][a]}static reedSolomonComputeDivisor(a){if(a<1||a>255)throw new RangeError("Degree out of range");let c=[];for(let d=0;d<a-1;d++)c.push(0);c.push(1);let l=1;for(let d=0;d<a;d++){for(let p=0;p<c.length;p++)c[p]=B.reedSolomonMultiply(c[p],l),p+1<c.length&&(c[p]^=c[p+1]);l=B.reedSolomonMultiply(l,2)}return c}static reedSolomonComputeRemainder(a,c){let l=c.map(d=>0);for(const d of a){const p=d^l.shift();l.push(0),c.forEach((m,f)=>l[f]^=B.reedSolomonMultiply(m,p))}return l}static reedSolomonMultiply(a,c){if(a>>>8||c>>>8)throw new RangeError("Byte out of range");let l=0;for(let d=7;d>=0;d--)l=l<<1^(l>>>7)*285,l^=(c>>>d&1)*a;return s(l>>>8==0),l}finderPenaltyCountPatterns(a){const c=a[1];s(c<=this.size*3);const l=c>0&&a[2]==c&&a[3]==c*3&&a[4]==c&&a[5]==c;return(l&&a[0]>=c*4&&a[6]>=c?1:0)+(l&&a[6]>=c*4&&a[0]>=c?1:0)}finderPenaltyTerminateAndCount(a,c,l){return a&&(this.finderPenaltyAddHistory(c,l),c=0),c+=this.size,this.finderPenaltyAddHistory(c,l),this.finderPenaltyCountPatterns(l)}finderPenaltyAddHistory(a,c){c[0]==0&&(a+=this.size),c.pop(),c.unshift(a)}};e.MIN_VERSION=1,e.MAX_VERSION=40,e.PENALTY_N1=3,e.PENALTY_N2=3,e.PENALTY_N3=40,e.PENALTY_N4=10,e.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],e.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],t.QrCode=e;function r(u,a,c){if(a<0||a>31||u>>>a)throw new RangeError("Value out of range");for(let l=a-1;l>=0;l--)c.push(u>>>l&1)}function n(u,a){return(u>>>a&1)!=0}function s(u){if(!u)throw new Error("Assertion error")}const i=class ee{constructor(a,c,l){if(this.mode=a,this.numChars=c,this.bitData=l,c<0)throw new RangeError("Invalid argument");this.bitData=l.slice()}static makeBytes(a){let c=[];for(const l of a)r(l,8,c);return new ee(ee.Mode.BYTE,a.length,c)}static makeNumeric(a){if(!ee.isNumeric(a))throw new RangeError("String contains non-numeric characters");let c=[];for(let l=0;l<a.length;){const d=Math.min(a.length-l,3);r(parseInt(a.substring(l,l+d),10),d*3+1,c),l+=d}return new ee(ee.Mode.NUMERIC,a.length,c)}static makeAlphanumeric(a){if(!ee.isAlphanumeric(a))throw new RangeError("String contains unencodable characters in alphanumeric mode");let c=[],l;for(l=0;l+2<=a.length;l+=2){let d=ee.ALPHANUMERIC_CHARSET.indexOf(a.charAt(l))*45;d+=ee.ALPHANUMERIC_CHARSET.indexOf(a.charAt(l+1)),r(d,11,c)}return l<a.length&&r(ee.ALPHANUMERIC_CHARSET.indexOf(a.charAt(l)),6,c),new ee(ee.Mode.ALPHANUMERIC,a.length,c)}static makeSegments(a){return a==""?[]:ee.isNumeric(a)?[ee.makeNumeric(a)]:ee.isAlphanumeric(a)?[ee.makeAlphanumeric(a)]:[ee.makeBytes(ee.toUtf8ByteArray(a))]}static makeEci(a){let c=[];if(a<0)throw new RangeError("ECI assignment value out of range");if(a<128)r(a,8,c);else if(a<16384)r(2,2,c),r(a,14,c);else if(a<1e6)r(6,3,c),r(a,21,c);else throw new RangeError("ECI assignment value out of range");return new ee(ee.Mode.ECI,0,c)}static isNumeric(a){return ee.NUMERIC_REGEX.test(a)}static isAlphanumeric(a){return ee.ALPHANUMERIC_REGEX.test(a)}getData(){return this.bitData.slice()}static getTotalBits(a,c){let l=0;for(const d of a){const p=d.mode.numCharCountBits(c);if(d.numChars>=1<<p)return 1/0;l+=4+p+d.bitData.length}return l}static toUtf8ByteArray(a){a=encodeURI(a);let c=[];for(let l=0;l<a.length;l++)a.charAt(l)!="%"?c.push(a.charCodeAt(l)):(c.push(parseInt(a.substring(l+1,l+3),16)),l+=2);return c}};i.NUMERIC_REGEX=/^[0-9]*$/,i.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,i.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";let o=i;t.QrSegment=i})(It||(It={}));(t=>{(e=>{const r=class{constructor(s,i){this.ordinal=s,this.formatBits=i}};r.LOW=new r(0,1),r.MEDIUM=new r(1,0),r.QUARTILE=new r(2,3),r.HIGH=new r(3,2),e.Ecc=r})(t.QrCode||(t.QrCode={}))})(It||(It={}));(t=>{(e=>{const r=class{constructor(s,i){this.modeBits=s,this.numBitsCharCount=i}numCharCountBits(s){return this.numBitsCharCount[Math.floor((s+7)/17)]}};r.NUMERIC=new r(1,[10,12,14]),r.ALPHANUMERIC=new r(2,[9,11,13]),r.BYTE=new r(4,[8,16,16]),r.KANJI=new r(8,[8,10,12]),r.ECI=new r(7,[0,0,0]),e.Mode=r})(t.QrSegment||(t.QrSegment={}))})(It||(It={}));var Mt=It;/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */var mh={L:Mt.QrCode.Ecc.LOW,M:Mt.QrCode.Ecc.MEDIUM,Q:Mt.QrCode.Ecc.QUARTILE,H:Mt.QrCode.Ecc.HIGH},oa=128,ca="L",la="#FFFFFF",ua="#000000",da=!1,ha=1,gh=4,vh=0,yh=.1;function fa(t,e=0){const r=[];return t.forEach(function(n,s){let i=null;n.forEach(function(o,u){if(!o&&i!==null){r.push(`M${i+e} ${s+e}h${u-i}v1H${i+e}z`),i=null;return}if(u===n.length-1){if(!o)return;i===null?r.push(`M${u+e},${s+e} h1v1H${u+e}z`):r.push(`M${i+e},${s+e} h${u+1-i}v1H${i+e}z`);return}o&&i===null&&(i=u)})}),r.join("")}function pa(t,e){return t.slice().map((r,n)=>n<e.y||n>=e.y+e.h?r:r.map((s,i)=>i<e.x||i>=e.x+e.w?s:!1))}function bh(t,e,r,n){if(n==null)return null;const s=t.length+r*2,i=Math.floor(e*yh),o=s/e,u=(n.width||i)*o,a=(n.height||i)*o,c=n.x==null?t.length/2-u/2:n.x*o,l=n.y==null?t.length/2-a/2:n.y*o,d=n.opacity==null?1:n.opacity;let p=null;if(n.excavate){let f=Math.floor(c),y=Math.floor(l),w=Math.ceil(u+c-f),A=Math.ceil(a+l-y);p={x:f,y,w,h:A}}const m=n.crossOrigin;return{x:c,y:l,h:a,w:u,excavation:p,opacity:d,crossOrigin:m}}function wh(t,e){return e!=null?Math.max(Math.floor(e),0):t?gh:vh}function ma({value:t,level:e,minVersion:r,includeMargin:n,marginSize:s,imageSettings:i,size:o,boostLevel:u}){let a=I.useMemo(()=>{const f=(Array.isArray(t)?t:[t]).reduce((y,w)=>(y.push(...Mt.QrSegment.makeSegments(w)),y),[]);return Mt.QrCode.encodeSegments(f,mh[e],r,void 0,void 0,u)},[t,e,r,u]);const{cells:c,margin:l,numCells:d,calculatedImageSettings:p}=I.useMemo(()=>{let m=a.getModules();const f=wh(n,s),y=m.length+f*2,w=bh(m,o,f,i);return{cells:m,margin:f,numCells:y,calculatedImageSettings:w}},[a,o,i,n,s]);return{qrcode:a,margin:l,cells:c,numCells:d,calculatedImageSettings:p}}var _h=(function(){try{new Path2D().addPath(new Path2D)}catch{return!1}return!0})(),Ch=I.forwardRef(function(e,r){const n=e,{value:s,size:i=oa,level:o=ca,bgColor:u=la,fgColor:a=ua,includeMargin:c=da,minVersion:l=ha,boostLevel:d,marginSize:p,imageSettings:m}=n,y=Ln(n,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","marginSize","imageSettings"]),{style:w}=y,A=Ln(y,["style"]),x=m==null?void 0:m.src,C=I.useRef(null),T=I.useRef(null),D=I.useCallback(K=>{C.current=K,typeof r=="function"?r(K):r&&(r.current=K)},[r]),[M,R]=I.useState(!1),{margin:P,cells:$,numCells:W,calculatedImageSettings:U}=ma({value:s,level:o,minVersion:l,boostLevel:d,includeMargin:c,marginSize:p,imageSettings:m,size:i});I.useEffect(()=>{if(C.current!=null){const K=C.current,ne=K.getContext("2d");if(!ne)return;let ke=$;const se=T.current,ge=U!=null&&se!==null&&se.complete&&se.naturalHeight!==0&&se.naturalWidth!==0;ge&&U.excavation!=null&&(ke=pa($,U.excavation));const De=window.devicePixelRatio||1;K.height=K.width=i*De;const re=i/W*De;ne.scale(re,re),ne.fillStyle=u,ne.fillRect(0,0,W,W),ne.fillStyle=a,_h?ne.fill(new Path2D(fa(ke,P))):$.forEach(function(ie,ue){ie.forEach(function(ae,ut){ae&&ne.fillRect(ut+P,ue+P,1,1)})}),U&&(ne.globalAlpha=U.opacity),ge&&ne.drawImage(se,U.x+P,U.y+P,U.w,U.h)}}),I.useEffect(()=>{R(!1)},[x]);const le=Mn({height:i,width:i},w);let J=null;return x!=null&&(J=I.createElement("img",{src:x,key:x,style:{display:"none"},onLoad:()=>{R(!0)},ref:T,crossOrigin:U==null?void 0:U.crossOrigin})),I.createElement(I.Fragment,null,I.createElement("canvas",Mn({style:le,height:i,width:i,ref:D,role:"img"},A)),J)});Ch.displayName="QRCodeCanvas";var ga=I.forwardRef(function(e,r){const n=e,{value:s,size:i=oa,level:o=ca,bgColor:u=la,fgColor:a=ua,includeMargin:c=da,minVersion:l=ha,boostLevel:d,title:p,marginSize:m,imageSettings:f}=n,y=Ln(n,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","title","marginSize","imageSettings"]),{margin:w,cells:A,numCells:x,calculatedImageSettings:C}=ma({value:s,level:o,minVersion:l,boostLevel:d,includeMargin:c,marginSize:m,imageSettings:f,size:i});let T=A,D=null;f!=null&&C!=null&&(C.excavation!=null&&(T=pa(A,C.excavation)),D=I.createElement("image",{href:f.src,height:C.h,width:C.w,x:C.x+w,y:C.y+w,preserveAspectRatio:"none",opacity:C.opacity,crossOrigin:C.crossOrigin}));const M=fa(T,w);return I.createElement("svg",Mn({height:i,width:i,viewBox:`0 0 ${x} ${x}`,ref:r,role:"img"},y),!!p&&I.createElement("title",null,p),I.createElement("path",{fill:u,d:`M0,0 h${x}v${x}H0z`,shapeRendering:"crispEdges"}),I.createElement("path",{fill:a,d:M,shapeRendering:"crispEdges"}),D)});ga.displayName="QRCodeSVG";function Ih({qrUrl:t,videoWebpUrl:e,videoMp4Url:r,status:n,getQrCodeLoading:s,onRefreshQr:i,appDownloadHref:o}){return g.useEffect(()=>{const u=new Image;u.src=e},[e]),h.jsx(bo,{placement:"bottomRight",trigger:["hover"],overlayClassName:"md:w-[400px] py-[24px] px-[20px] flex items-center justify-center",content:h.jsxs("div",{className:"relative flex flex-col items-center justify-center",children:[h.jsxs("div",{className:"flex items-center justify-center gap-[20px]",children:[h.jsxs("div",{className:"relative rounded-[8px] p-3 bg-bg_inverse_primary",children:[t&&!s?h.jsx(ga,{value:t,marginSize:0,size:141,fgColor:"#000000",imageSettings:{src:"",width:40,height:40,excavate:!1}}):h.jsx("div",{className:"w-[141px] h-[141px] flex items-center justify-center",children:h.jsx(Ua,{className:"w-8 h-8 animate-spin text-text_secondary"})}),n==="EXPIRED"&&h.jsx("div",{className:"absolute z-10 top-0 left-0 w-[170px] h-[170px] flex items-center justify-center",children:h.jsxs("div",{className:V("flex items-center flex-col gap-2 text-title-1 font-medium text-text_primary ",{"opacity-50 cursor-not-allowed":s,"cursor-pointer":!s}),onClick:s?void 0:i,children:[h.jsx(Fa,{className:V("size-8",{"animate-spin":s})}),h.jsx("span",{children:b._("login.refreshQrCode")})]})})]}),h.jsx("div",{className:"w-[170px] h-[170px] overflow-hidden bg-center bg-cover rounded-[8px]",style:{backgroundImage:`url(${e})`},children:h.jsx("video",{className:"block w-full h-full object-cover",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,preload:"none",poster:e,children:h.jsx("source",{src:r,type:"video/mp4"})})})]}),h.jsx("div",{className:"text-title-1 font-medium text-text_primary mt-[20px] relative z-10",children:h.jsx(Br,{id:"login.scanQrCode",values:{0:h.jsx("a",{className:"text-link_default",href:o,children:b._("login.scanQrCodeApp")})}})}),n==="EXPIRED"&&h.jsx("div",{className:"absolute rounded-[8px] top-0 left-0 w-[170px] h-[171px] bg-bg_card opacity-90"})]}),children:h.jsx("div",{className:"bg-bg_disable px-[8px] py-[8px] rounded-[8px] hover:bg-bg_tooltip cursor-pointer flex items-center justify-center",children:h.jsx(Da,{className:"w-[20px] h-[20px] text-text_primary"})})})}function Cn({children:t}){const[e,r]=g.useState(!1);return g.useEffect(()=>r(!0),[]),typeof window>"u"?null:e?h.jsx(h.Fragment,{children:t}):null}async function xh(t,e,r){const{default:n,KEYUTIL:s,KJUR:i}=await La(async()=>{const{default:c,KEYUTIL:l,KJUR:d}=await import("./chunk-DAk6PF1u.js").then(p=>p.j);return{default:c,KEYUTIL:l,KJUR:d}},__vite__mapDeps([0,1,2])),o="-----BEGIN PRIVATE KEY-----"+t+"-----END PRIVATE KEY-----",u=s.getKey(o),a=new i.crypto.Signature({alg:"SHA1withRSA"});return a.init(u),a.updateString(`timestamp=${r}&qrKey=${e}`),n.hextob64(a.sign())}const Hs="/accounts/login/2fa";function Eh(t){const e=new URLSearchParams;for(const[n,s]of Object.entries(t))if(s!==void 0){if(Array.isArray(s)){s.forEach(i=>e.append(n,i));continue}e.set(n,String(s))}const r=e.toString();return r?`${Hs}?${r}`:Hs}function Ks({disabled:t,password:e,onInput:r,onBlur:n,onEnterSubmit:s,errorMsg:i}){const o=Jr().isMobile;return h.jsxs("div",{className:"flex flex-col gap-1 mb-3 mt-[16px] md:mt-0",children:[!o&&h.jsx("div",{className:"flex items-center justify-between",children:h.jsx("span",{className:"text-body-3 text-text_primary",children:b._("register.password")})}),h.jsx(ri,{autoComplete:"current-password",isErr:!!i,disabled:t,value:e,onInput:r,onBlur:n,onKeyPress:u=>u.key==="Enter"&&s(),popover:!1,allowSpace:!0,placeholder:b._("register.plsInputPwd")}),i?h.jsx("div",{className:"text-[12px] text-text_error mt-1",children:i}):null]})}function Sh({thirdPartyDoc:t,hasBindRes:e,setPageType:r}){var Tr;const{localeNavigate:n}=ii(),s="__reset_pwd_prefill__",i=mr(),o=g.useMemo(()=>{var v;return(v=i.urlParsed)!=null&&v.search?i.urlParsed.search:typeof window<"u"?Object.fromEntries(new URLSearchParams(window.location.search)):{}},[(Tr=i.urlParsed)==null?void 0:Tr.search]),u=g.useMemo(()=>({locale:i.locale,query:o,push:v=>{if(typeof location>"u")return;if(typeof v=="string"){location.href=v;return}const N=v!=null&&v.query?`?${new URLSearchParams(v.query).toString()}`:"";location.href=`${v.pathname}${N}`},replace:v=>{if(typeof location>"u")return;if(typeof v=="string"){location.replace(v);return}const N=v!=null&&v.query?`?${new URLSearchParams(v.query).toString()}`:"";location.replace(`${v.pathname}${N}`)}}),[i.locale,o]),a=Jr().isMobile,c=Xr("/components/Pages/Login/index.js"),l=`${Fr}/imgs/ssr-web-user-center/login/login_new.png`,d=`${Fr}/imgs/ssr-web-user-center/login/login_new.mp4`,[p,m]=I.useState("step1"),[f,y]=I.useState(!1),w=a?f:p==="step2",A=g.useCallback(()=>{a?y(!0):m("step2")},[a]);g.useEffect(()=>{a&&p==="step2"?(y(!0),m("step1")):!a&&f&&(m("step2"),y(!1))},[a]);const[x,C]=g.useState("emailOrPhone"),[T,D]=g.useState("email"),M=I.useRef(null),[R,P]=g.useState(""),[$,W]=g.useState(""),[U,le]=g.useState("91"),[J,K]=g.useState(""),[ne,ke]=g.useState({isOK:!1,errMsg:""}),[se,ge]=g.useState(""),[De,re]=g.useState({isOK:!1,errMsg:""}),ie=g.useCallback(()=>{ge(""),re({isOK:!1,errMsg:""}),a?y(!1):m("step1")},[a]),[ue,ae]=g.useState(!1),[ut,Te]=g.useState(""),[dt,Be]=g.useState(""),[xt,Gt]=g.useState(""),[Qt,q]=g.useState(Date.now()),[oe,we]=g.useState(""),[_e,G]=g.useState("NEW"),[Y,ht]=g.useState(!1),{setShowPassword:ce,handleNextBtnClick:Et,faCheckId:Re}=bc([ue,ae,x==="emailOrPhone"?T==="email"?"email":"mobile":"subAccount",R,()=>{var v;return((v=M.current)==null?void 0:v.verifyEmail(!0))||{isOK:!0,errMsg:""}},$,()=>{var v;return((v=M.current)==null?void 0:v.verifyMobile(!0))||{isOK:!0,errMsg:""}},U,J,ge,re,ht]),[Z,Ie]=g.useState();g.useEffect(()=>{let v=!1;const N=()=>{v||Js("?userBehaviorEnum=MOBILE").then(X=>{v||Ie((X==null?void 0:X.data)||{})})};let F,j;return typeof window<"u"&&"requestIdleCallback"in window?F=window.requestIdleCallback(()=>N(),{timeout:2e3}):j=setTimeout(N,300),()=>{v=!0,F!==void 0&&typeof window<"u"&&"cancelIdleCallback"in window&&window.cancelIdleCallback(F),j!==void 0&&clearTimeout(j)}},[]);const Ne=g.useMemo(()=>{if(!Z)return;const v=Z.ipCountryId||Z.defaultCountryId;return v?{id:v}:void 0},[Z]);I.useEffect(()=>{if(u.query.email){const v=Array.isArray(u.query.email)?u.query.email[0]:u.query.email;v&&(C("emailOrPhone"),D("email"),P(v),ft(v))}},[u.query.email]),I.useEffect(()=>{u.query.phone&&setTimeout(()=>{const v=Array.isArray(u.query.phone)?u.query.phone[0]:u.query.phone;v&&(W(v),C("emailOrPhone"),D("mobile"),ft(v))},17)},[u.query.phone]),g.useEffect(()=>{if(x)Q.set("loginType",x==="emailOrPhone"?"email":"subAccount");else{let N=Q.get("loginType");N=/^(email|mobile|subAccount)$/.test(N)?N:"email",C(N==="subAccount"?"subAccount":"emailOrPhone"),N==="mobile"&&D("mobile")}const v=Q.get("xt.userCenter.lastLoginAccount");x==="emailOrPhone"&&v&&(v.type==="email"||v.type==="mobile")?v.type==="email"?(P(v.userName),ft(v.userName)):(W(v.userName),D("mobile"),ft(v.userName)):x==="subAccount"&&v&&v.type==="subAccount"&&K(v.userName)},[x]),g.useEffect(()=>{t&&(C("emailOrPhone"),D("email"),P(t.email),ft(t.email))},[t]);const Jt=v=>{let N={isOK:!0,errMsg:""};const F=b._("register.plsInputCorrectAccount");return J?/^.{6,30}$/.test(J)||(N={isOK:!1,errMsg:F}):N={isOK:!1,errMsg:v?F:""},ke(N),N};g.useEffect(()=>{ke({isOK:!1,errMsg:""})},[J]);const $e=v=>{const N=se,F=b._("register.plsInputPwd");let j={isOK:!0,errMsg:""};return N||(j={isOK:!1,errMsg:v?F:""}),re(j),j};g.useEffect(()=>{re({isOK:!1,errMsg:""})},[se]);const de=()=>{var N,F;let v=!0;return w||(x==="emailOrPhone"?T==="email"?!(((N=M.current)==null?void 0:N.verifyEmail(!0))||{isOK:!0}).isOK&&(v=!1):T==="mobile"&&!(((F=M.current)==null?void 0:F.verifyMobile(!0))||{isOK:!0}).isOK&&(v=!1):x==="subAccount"&&!Jt(!0).isOK&&(v=!1)),w&&!$e(!0).isOK&&(v=!1),v},[Xt,St]=g.useState(null),ve=async()=>{var v;if(St(null),!ue&&de()){if(!w){ae(!0);try{if(await Et()){ae(!1);return}const F=x==="emailOrPhone"?T==="email"?"email":"mobile":"subAccount",j=F==="email"?R:F==="mobile"?$:J,X=F==="mobile"?U:void 0;if(!(x==="emailOrPhone")){A(),ae(!1);return}const{err:Ze,data:z}=await te(oo,{data:{userName:j,countryCode:F==="mobile"?`+${X}`:void 0,loginType:F},errorPop:!1});if(ae(!1),!(z!=null&&z.canLogin)){const Ce=(z==null?void 0:z.errorType)??(z==null?void 0:z.errorCode);if(Ce==="ACCOUNT_LOCK"){Lt.warning({content:b._("login.accountLockedTip"),okText:b._("login.IKnow"),centered:!0,cancelButtonProps:{className:"hidden"}});return}if(Ce==="ACCOUNT_NOT_EXISTS"){St(b._("login.accountNotExistsTip"));return}if(Ce==="ABNORMAL_DEVICE"){Lt.warning({content:b._("login.abnormalDeviceTip"),okText:b._("login.IKnow"),centered:!0,cancelButtonProps:{className:"hidden"}});return}if(Ce==="PASSWORD_LOCK"){Pe.error(b._({id:"UC_SERVICE_UAA_IMPL_016",values:{0:Math.ceil(z.lockTimeRemain/3600)}}));return}Pe.error(xn((z==null?void 0:z.errorType)??(z==null?void 0:z.errorCode),z==null?void 0:z.errorMsg,Ze));return}A()}catch(N){ae(!1),console.error("账号检测接口异常：",N)}return}c({desc:"Log In button click and start up Geetest",data:{type:x==="emailOrPhone"?T:"subAccount",email:R,countryCode:U,mobile:$}}),(v=_r.current)==null||v.verify()}},_r=I.useRef(null),xe=async v=>{var vt,tt;console.log(v,"puzzleValidateString"),ae(!0);let N="";Q.get("client-device-id")?N=Q.get("client-device-id"):(N=or(),Q.set("client-device-id",N));const F=await te(lr,{errorPop:!0});if(F.err)return ae(!1);const j=x==="emailOrPhone"?T==="email"?"email":"mobile":"subAccount",X={userName:j==="email"?R:j==="mobile"?$:J,countryCode:j==="mobile"?U:void 0,loginPwd:await Ke(F.data.publicKey,se),passwdId:F.data.passwdId,puzzleValidateString:v,version:"2.0",thirdAuthDTO:t},gt=j==="subAccount"?io:ai,Ze=j==="subAccount"?{accountName:J,loginPwd:await Ke(F.data.publicKey,se),passwdId:F.data.passwdId,puzzleValidateString:v}:X,{err:z,data:Ce}=await te(gt,{headers:{"client-device-id":await Ke(F.data.publicKey,N),"client-device-name":`${tr()} (${rr()})`},data:Ze,errorPop:!0});if(console.log(Ce,"data"),ae(!1),c({desc:"Log In handle gt success",data:{type:j,email:R,countryCode:U,mobile:$},resData:{err:z,data:Ce}}),z)return;Q.set("xt.userCenter.lastLoginAccount",{type:j,userName:j==="email"?R:j==="mobile"?$:J});try{sensors.track("LoginButtonClick",{login_method:j==="email"?"邮箱":j==="subAccount"?"子账户":"手机"})}catch{}const et=j==="subAccount";Oe.set("2fa",Ce),Oe.set("puzzleValidateString",v);const qe=Oe.get("2fa");if(et&&qe&&qe.faCheckId&&!((vt=qe.faItems)!=null&&vt.length)){const _={faCheckId:qe.faCheckId,faBizType:0},E=await te(xa,{params:_,errorPop:!1}),{err:S,data:k}=await te(ao,(tt=E==null?void 0:E.data)==null?void 0:tt.faResultId,{errorPop:!0});if(S)return;is(k,u);return}const Rt=et?{...u.query,isSubAccount:et}:u.query;n(Eh(Rt))},Cr=async()=>{var v,N,F,j,X,gt,Ze,z,Ce,et,qe,Rt,vt,tt;try{const _=Date.now(),E=await xh(xt,oe,_);let S="";Q.get("client-device-id")?S=Q.get("client-device-id"):(S=or(),Q.set("client-device-id",S));const k=await te(lr,{errorPop:!0});if(k.err)return;const O=await no({headers:{"client-device-id":await Ke(k.data.publicKey,S),"client-device-name":`${tr()} (${rr()})`},params:{qrKey:oe,timestamp:_,sign:E,passwdId:k.data.passwdId}});if(!(O!=null&&O.data)){G("NEW");return}if(((v=O==null?void 0:O.data)==null?void 0:v.loginStatus)===7){G("scanSuccess");return}if(((N=O==null?void 0:O.data)==null?void 0:N.loginStatus)===1){Oe.set("token",(F=O==null?void 0:O.data)==null?void 0:F.accessToken),$r("token",(j=O==null?void 0:O.data)==null?void 0:j.accessToken),$r("refreshToken",(X=O==null?void 0:O.data)==null?void 0:X.refreshToken),co((Ze=(gt=O==null?void 0:O.data)==null?void 0:gt.userVO)==null?void 0:Ze.userId),Ye();try{sensors.login((Ce=(z=O==null?void 0:O.data)==null?void 0:z.userVO)==null?void 0:Ce.userId)}catch{}if((et=O==null?void 0:O.data)!=null&&et.userVO&&!((Rt=(qe=O==null?void 0:O.data)==null?void 0:qe.userVO)!=null&&Rt.regCountryId)&&!((tt=(vt=O==null?void 0:O.data)==null?void 0:vt.userVO)!=null&&tt.kycAuthCountryId))if(typeof location<"u"){const pe=ni({pathname:"/country",locale:u.locale,query:u.query});setTimeout(()=>location.replace(pe),900)}else u.replace({pathname:"/country",query:u.query});else setTimeout(()=>si(u),900)}}catch(_){c({desc:"getQrResult catch error",e:_}),_.code==921&&(G("EXPIRED"),Ye())}},he=v=>{const{host:N,protocol:F}=Qa(),{pathname:j,locale:X}=v;return`${F}//${N}/${X?`${X}`:""}${j}`},Ae=I.useRef(null);g.useEffect(()=>{Oe.remove("puzzleValidateString")},[]),g.useEffect(()=>(Yt(),()=>{Ye()}),[oe]);const Yt=()=>{oe&&(Ae.current=setInterval(()=>{Cr()},5e3))},Ye=()=>{Ae.current&&(clearInterval(Ae.current),Ae.current=null)},{run:Zt,loading:sn}=rc(async()=>{var v,N,F;try{const j=await so({headers:{"client-device-name":`${tr()} (${rr()})`}});we((v=j==null?void 0:j.data)==null?void 0:v.qrKey);let X=(N=j==null?void 0:j.data)==null?void 0:N.privateKey;X=X.replace(/\n/g,""),X=X.replace("-----BEGIN RSA PRIVATE KEY-----",""),X=X.replace("-----END RSA PRIVATE KEY-----",""),Gt(X),Te(`${(F=j==null?void 0:j.data)==null?void 0:F.qrKey}&qrLogin`),G("NEW")}catch(j){c({desc:"getQrCode catch error",e:j})}},{manual:!0}),[Ir,an]=g.useState(!1),Ve=g.useCallback(()=>{Ir||(an(!0),xr())},[Ir]);g.useEffect(()=>{const v=()=>{try{sensors.track("LoginPage",{from_page:Array.isArray(u.query.backurl)?u.query.backurl[0]:u.query.backurl||""})}catch{}};let N,F;return typeof window<"u"&&"requestIdleCallback"in window?F=window.requestIdleCallback(()=>v(),{timeout:3e3}):N=setTimeout(v,1500),()=>{F!==void 0&&typeof window<"u"&&"cancelIdleCallback"in window&&window.cancelIdleCallback(F),N!==void 0&&clearTimeout(N)}},[u.query.backurl]);const xr=()=>{Zt()};g.useEffect(()=>{var N;const v=(N=M.current)==null?void 0:N.getAccountType();v&&D(v)},[R,$]);const[kt,ft]=g.useState(""),on=g.useCallback(v=>{ft(v),St(null),a&&f&&!(t!=null&&t.email)&&ie()},[a,f,t==null?void 0:t.email,ie]),Er=g.useCallback(v=>{v&&(a&&f&&v!==T&&ie(),D(v))},[a,f,T,ie]),Sr=g.useCallback(v=>{a&&f&&v!==U&&ie(),le(v)},[a,f,U,ie]),pt=g.useCallback(v=>{K(v),a&&f&&ie()},[a,f,ie]),mt=g.useCallback(()=>{if(x!=="emailOrPhone")return;const v=T==="email"?{accType:"email",emailphoneNum:R||kt}:{accType:"mobile",emailphoneNum:$||kt,countryCode:U||"91"};if(typeof window<"u"){const N=btoa(encodeURIComponent(JSON.stringify(v)));window.sessionStorage.setItem(s,N)}},[x,T,R,$,kt,U]),cn=[{label:b._("login.emailOrPhone"),value:"emailOrPhone"}],kr=ue||(x==="emailOrPhone"?!kt:!J),Tt=ue||!se,ln=w?Tt:kr,un=g.useMemo(()=>{const v=(t==null?void 0:t.authType)===ar.google?"Google":"Apple",N=b._("app.title");return t!=null&&t.email?b._({id:"thirdPartyLogin.home.bindAccountTip",values:{0:N,1:N,2:v}}):b._({id:"thirdPartyLogin.home.bindNewAccountTip",values:{0:v,1:N}})},[t]),Ee=()=>h.jsx(cr,{countryInfo:Ne,children:h.jsx("div",{className:V("flex w-full mx-auto",a?"min-h-0 flex-1 flex-col":"items-center justify-center md:w-[400px]"),children:h.jsxs("div",{className:V("flex w-full max-w-full flex-col md:max-w-[400px]",a?"flex-1 min-h-[calc(100dvh-120px)] gap-6":"gap-6"),children:[h.jsxs("div",{className:"flex flex-col gap-1",children:[h.jsxs("div",{className:"flex gap-2 items-center justify-between",children:[h.jsx("h1",{className:"text-display-1 text-text_primary font-semibold mb-0",children:t?b._("thirdPartyLogin.bindAccount"):b._("login.title")}),!a&&!t&&h.jsx("div",{onMouseEnter:Ve,onTouchStart:Ve,onFocus:Ve,onClick:Ve,children:h.jsx(Cn,{children:h.jsx(Ih,{qrUrl:ut,videoWebpUrl:l,videoMp4Url:d,status:_e,getQrCodeLoading:sn,onRefreshQr:xr,appDownloadHref:he({pathname:"/app",locale:u.locale,query:u.query})})})}),a&&h.jsx("div",{children:h.jsx(Pt,{href:Ot({pathname:"/register/start",query:u.query}),children:h.jsx("span",{className:"text-text_brand cursor-pointer hover:text-fn_brand_hover text-[14px] font-medium",children:b._("app.register")})})})]}),t&&h.jsx("div",{className:"text-body-3 text-text_secondary",children:un}),!t&&!a&&h.jsxs("div",{className:"flex gap-1 items-center text-body-3",children:[h.jsx("span",{className:"text-text_secondary",children:b._("login.hasAccount")}),h.jsx(Pt,{href:Ot({pathname:"/register/start",query:u.query}),children:h.jsx("span",{className:"text-text_brand cursor-pointer hover:text-fn_brand_hover",children:b._("login.goToRegister")})})]})]}),h.jsxs("div",{className:V("flex flex-col",a&&"min-h-0 flex-1 gap-6 md:flex-none"),children:[h.jsxs("div",{className:"flex flex-col ",children:[!t&&h.jsx("div",{className:"flex items-center gap-4",children:cn.map(v=>h.jsx("div",{className:V("flex items-center justify-center relative py-2.5 cursor-pointer"),onClick:()=>{a&&f&&ie(),C(v.value)},children:h.jsx("span",{className:V("text-body-3",{"text-text_primary font-medium":x===v.value,"text-text_secondary":x!==v.value}),children:v.label})},v.value))}),x==="emailOrPhone"?h.jsx("div",{children:h.jsx(ti,{ref:M,disabled:ue,showLabel:!!t,label:t!=null&&t.email?T==="email"?b._("app.email"):b._("app.mobile"):null,value:kt,onChange:on,countryInfos:Z,defaultCountryCode:"91",onTypeChange:Er,error:Xt||void 0,readonly:!!(t!=null&&t.email),onEmailChange:P,onMobileChange:W,onCountryCodeChange:Sr})}):h.jsxs("div",{className:"flex flex-col gap-1",children:[h.jsx(ei,{autoComplete:"on",isErr:!!ne.errMsg,disabled:ue,value:J,onInput:pt,placeholder:b._("app.userName"),onBlur:()=>Jt(1)}),ne.errMsg&&h.jsx("div",{className:"text-[12px] text-text_error mt-1",children:ne.errMsg})]}),a&&w?h.jsx(h.Fragment,{children:h.jsx(Ks,{disabled:ue,password:se,onInput:ge,onBlur:()=>$e(1),onEnterSubmit:ve,errorMsg:De.errMsg})}):null,h.jsx(Ct,{type:"brand",size:"large",className:"mt-[24px] h-[48px]",onClick:ve,disabled:ln,loading:ue,children:b._("register.nextStep")}),x==="emailOrPhone"&&a&&w?h.jsx(Pt,{href:Ot({pathname:"/reset-password",query:u.query}),onClick:mt,className:"mt-[16px] text-[14px] text-text_primary! underline! decoration-text_primary underline-offset-2",children:b._("login.forgotPassword")}):null]}),t?null:h.jsx("div",{className:V(a&&"mt-auto mb-8 w-full shrink-0 md:mt-0 md:mb-0"),children:h.jsx(Cn,{children:h.jsx(sa,{className:a?"mt-0!":void 0})})})]})]})})}),fe=()=>{const v=x==="emailOrPhone"?T==="email"?R:$:J;return h.jsx(cr,{countryInfo:Ne,children:h.jsx("div",{className:"flex items-center justify-center",children:h.jsxs("div",{className:"flex flex-col gap-6 w-full max-w-full  md:max-w-[400px] ",children:[h.jsxs("div",{className:"flex flex-col gap-1",children:[h.jsx("h1",{className:"text-display-1 text-text_primary font-semibold mb-0",children:b._("login.inputPassword")}),h.jsxs("div",{className:"flex gap-1 items-center text-body-3",children:[h.jsxs("span",{className:"text-text_secondary flex items-center",children:[h.jsx("span",{children:b._("register.account")}),h.jsxs("span",{className:"text-text_primary",children:[b._("common.colon"),v]})]}),!t&&h.jsx("div",{onClick:ie,className:"inline-flex text-text_primary hover:text-text_secondary cursor-pointer",children:h.jsx(Dn,{className:"size-4"})})]})]}),h.jsxs("div",{className:"flex flex-col",children:[h.jsx(Ks,{disabled:ue,password:se,onInput:ge,onBlur:()=>$e(1),onEnterSubmit:ve,errorMsg:De.errMsg}),h.jsx(Ct,{onClick:ve,size:"large",type:"brand",className:"mt-4",disabled:Tt,loading:ue,children:b._("register.nextStep")}),x==="emailOrPhone"&&h.jsx(Pt,{href:Ot({pathname:"/reset-password",query:u.query}),onClick:mt,className:"text-body-3 text-text_primary hover:text-text_secondary mt-[24px] text-[14px]",children:b._("login.forgotPassword")})]})]})})})};return h.jsxs(h.Fragment,{children:[a||p==="step1"?Ee():fe(),h.jsx(Zs,{ref:_r,onSuccess:xe}),h.jsx(Cn,{children:h.jsx(fh,{faCheckId:Re||"",open:Y,successCallback:v=>{const N=x==="emailOrPhone"?T==="email"?"email":"mobile":"subAccount";Q.set("xt.userCenter.lastLoginAccount",{type:N,userName:N==="email"?R:N==="mobile"?$:J}),is(v,u)},thirdAuthDTO:t,setIsPasskeyOpen:ht,setState_loading:ae,setShowPassword:ce})})]})}const kh=qt(Sh);var jn=(t=>(t.home="home",t.bind="bind",t.create="create",t))(jn||{}),ar=(t=>(t.google="GOOGLE",t.apple="APPLE",t))(ar||{});const Th=({className:t})=>{const{isLogin:e}=At.user,[r,n]=g.useState(!1),[s,i]=g.useState(),[o,u]=g.useState(),[a,c]=g.useState(),l=g.useCallback(()=>{typeof window<"u"&&window.history.back()},[]),d=yc({thirdPartyDoc:o}),p=g.useCallback(async()=>{await d()&&l()},[l,d]),m=yt(()=>{n(!0),Ea({data:o}).then(f=>{if(f&&typeof f=="object"&&"isOk"in f&&f.isOk===!1){l();return}const y=(f==null?void 0:f.data)??f;if(y!=null&&y.hasBind)return p();n(!1),c(y),i(o!=null&&o.email?y!=null&&y.thirdExists?"bind":"create":"home")}).catch(()=>{l()}).finally(()=>{n(!1)})});return g.useEffect(()=>{o&&m()},[o]),g.useEffect(()=>{e&&l();const f=Oe.get("firebaseUserImpl");return!f||!f.providerId||!f.user?l():(u({authType:f.providerId==="google.com"?"GOOGLE":f.providerId==="apple.com"?"APPLE":"GOOGLE",email:f.user.email,uid:f.user.uid,accessToken:f.user.stsTokenManager.accessToken}),()=>{Oe.remove("firebaseUserImpl")})},[]),o&&a?h.jsxs(h.Fragment,{children:[s==="home"&&h.jsx(vc,{isCreateAcc:!a.thirdExists,thirdPartyDoc:o,setPageType:i}),s==="bind"&&h.jsx(kh,{thirdPartyDoc:o,hasBindRes:a,setPageType:i}),s==="create"&&h.jsx(Bh,{thirdAuthDTO:o,setPageType:i})]}):h.jsx(cr,{children:h.jsx("div",{className:V("md:w-[400px] mx-auto"),children:r&&h.jsx(eo,{})})})},pf=qt(Th),Rh=t=>{const e=t==null?void 0:t.enableConfirm,r=g.useRef(t==null?void 0:t.onReset);r.current=t==null?void 0:t.onReset;const n=g.useRef(!1),s=g.useRef([]);li(async()=>{const{data:i,err:o}=await te(sc,{params:{type:1,actType:"3"}});o||!i||(s.current=i.filter(u=>u.isNeedLogin===0))}),g.useEffect(()=>{setTimeout(()=>{n.current=!0},200);const i=()=>{history.pushState(null,"",location.pathname+location.search),n.current=!0};let o=!1;const u=()=>{o||(o=!0,a(),i())},a=()=>{window.removeEventListener("click",u,!0),window.removeEventListener("touchstart",u,!0),window.removeEventListener("keydown",u,!0)};return window.addEventListener("click",u,!0),window.addEventListener("touchstart",u,!0),window.addEventListener("keydown",u,!0),()=>{a()}},[]),g.useEffect(()=>{{const i=()=>{var u;(window.location.pathname+window.location.search+window.location.hash).includes("page_flag=1")||(u=r.current)==null||u.call(r)};return window.addEventListener("popstate",i),()=>{window.removeEventListener("popstate",i)}}},[e])},Nh=I.memo(function({cashbackRatio:e,defaultOpen:r=!1,disabled:n=!1,errMsg:s="",expandForPrefill:i=!1,isReadonly:o=!1,isSuccess:u=!1,onBlur:a,onInput:c,value:l}){const[d,p]=I.useState(r);I.useEffect(()=>{i&&p(!0)},[i]);const[m=0,f=0]=e||[],y=+m>0,w=+f>0,A=y||w;return h.jsxs("div",{className:"flex flex-col gap-1",children:[h.jsxs("div",{className:"flex cursor-pointer items-center gap-1 mt-5",onClick:()=>p(x=>!x),role:"button",tabIndex:0,onKeyDown:x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),p(C=>!C))},children:[h.jsx("span",{className:"text-body-3 text-text_primary",children:b._("register.referralCodeOptional")}),h.jsx(Ba,{className:V("size-4 text-text_primary",{"rotate-180":d})})]}),h.jsx("div",{className:V("expand-animation",{"enable-animation":d}),children:h.jsxs("div",{children:[h.jsx(ei,{classNames:{input:"placeholder:text-text_disable"},disabled:n||o,onBlur:a,onInput:c,placeholder:b._("register.inviteCodePlaceholder"),size:"large",status:s?"error":void 0,suffixInteractive:!u&&!o,svgIcon:u?"success":void 0,value:l}),s&&h.jsx("div",{className:"mt-1 text-[12px] text-text_error",children:s}),!!e&&Array.isArray(e)&&A&&h.jsxs("div",{className:"text-body-3 text-text_tertiary mt-1.5",children:[b._("account.cashbackRatioStr"),y&&b._({id:"account.cashbackRatioFutures",values:{0:m}}),y&&w&&"，",w&&b._({id:"account.cashbackRatioSpot",values:{0:f}})]})]})})]})}),Ah=qt(I.forwardRef(function({type:e,email:r,mobile:n,msgType:s,countryCode:i,password:o,recommendCode:u,puzzleValidateString:a,initialSecond:c=0,geetestPop:l,thirdAuthDTO:d,regSuccess:p,onBackToEdit:m,themeMode:f},y){var Qt;const w={email:"app.inputCode",mobile:"app.inputCode"},A=mr(),x=I.useMemo(()=>{var q;return Ja((q=A.urlParsed)==null?void 0:q.searchOriginal)},[(Qt=A.urlParsed)==null?void 0:Qt.searchOriginal]),C=I.useMemo(()=>({locale:A.locale,query:x,push:q=>{typeof location>"u"||(location.href=ss(q))},replace:q=>{typeof location>"u"||location.replace(ss(q))}}),[A.locale,x]),T=Jr().isMobile,D=Xr("/components/Pages/Register/Start/Verification/index.js"),M=I.useMemo(()=>e==="email"?r.replace(/(\w{2}).*(\w{1})@(.*)/,"$1***@$3"):e==="mobile"?n.length>7?n.replace(/(\d{3})\d*(\d{4})/,"$1***$2"):n.replace(/(\d{2})\d*(\d{2})/,"$1***$2"):"",[e,r,n]),[R,P]=I.useState(""),$=I.useRef(null),[W,U]=I.useState(!1);I.useEffect(()=>{typeof navigator<"u"&&navigator.clipboard&&U(!0)},[]);const[le,J]=I.useState("");I.useEffect(()=>{J("")},[R]);const[K,ne]=I.useState(c);I.useEffect(()=>{let q;return K&&(q=setTimeout(()=>{ne(K-1)},1e3)),()=>clearTimeout(q)},[K]);const[ke,se]=I.useState(!1),ge=q=>{const oe=q||a;if(console.log("msgDoSendCode",{puzzleValidateString:a,newPuzzleValidateString:q,pvs:oe}),ke||K)return;se(!0);const we={codeType:"101",receiveAddress:e==="email"?r:n,puzzleValidateString:oe};e==="mobile"&&(we.countryCode=i,we.msgType=s);try{sensors.track("GetCode",{service_type:"注册"})}catch{}Xs({params:{codeType:"101"},data:we,errorPop:!0}).then(_e=>{if(!(_e!=null&&_e.isOk))return;ae(!0),ne(60);const G=e==="email"?b._("login.emailCodeSend"):s?b._("login.voiceCodeSend"):b._("login.smsCodeSend");Pe.success(G)}).finally(()=>{se(!1)})},De=q=>{l&&l(q===!0?1:0)},re=()=>{De(!1)},ie=()=>{if(K)return Pe.warn(b._("login.codeResendTip"));De(!0)},[ue,ae]=I.useState(!1);I.useMemo(()=>!!(ue&&e==="email"),[ue,e]);const ut=Ka(),Te=()=>{ut({email:r,verifyType:e})},[dt,Be]=I.useState(!1),xt=async()=>{var q;try{if(!(navigator!=null&&navigator.clipboard))return;const we=(await navigator.clipboard.readText()||"").replace(/\D/g,"").slice(0,6);if(!we)return;P(we),(q=$.current)==null||q.focus()}catch{}},Gt=async()=>{var ce,Et;if(dt)return;if(!R||R.length<6){J(b._("register.plsEnterRightCode"));return}Be(!0);const q=await te(lr,{});if(q.err){Be(!1),J(q.err);return}let oe="";Q.get("client-device-id")?oe=Q.get("client-device-id"):(oe=or(),Q.set("client-device-id",oe));const we=e==="email"?r:n,_e={userName:we,countryCode:i,dynamicCode:R,loginPwd:o?await Ke(q.data.publicKey,o):void 0,passwdId:q.data.passwdId,recommendCode:u,xtCountryId:Oe.get("countryInfo").id,thirdAuthDTO:d};C.query.client_id&&(_e.organizationAppId=Array.isArray(C.query.client_id)?C.query.client_id[0]:C.query.client_id);const G={...C.query};delete G.backurl,delete G.backUrl,delete G.rebackUrl;const Y=await te(ka,{params:G,data:_e,headers:{"client-device-id":await Ke(q.data.publicKey,oe)}});Be(!1),console.log("post_v2Reg end",Y),lo((Et=(ce=Y==null?void 0:Y.data)==null?void 0:ce.userVO)==null?void 0:Et.userId),D({desc:"Sign Up post_v2Reg end",data:{userName:we,countryCode:i,dynamicCode:R,recommendCode:u}});try{sensors.track("SecurityValidationResult",{code_type:"验证码",is_success:Y.err?"false":"true",fail_reason:Y.err||"",service_type:"注册"});const Re=Array.isArray(C.query.ref)?C.query.ref[0]:C.query.ref||u||"",Z=Array.isArray(C.query.activeCode)?C.query.activeCode[0]:C.query.activeCode,Ie=Array.isArray(C.query.label)?C.query.label[0]:C.query.label,Ne=Z||Ie||"";sensors.track("RegisterButtonClick",{invite_code:String(Re),invite_activity_ID:String(Ne),register_method:e==="email"?"邮箱注册":"手机注册"})}catch{}if(Y.err)return J(Y.err);p&&p(Y.data),Q.set("loginType",e),Q.set("xt.userCenter.lastLoginAccount",{type:e,userName:we});try{sensors.login(Y.data.userVO.userId)}catch{}Oe.set("token",Y.data.accessToken),$r("token",Y.data.accessToken),$r("refreshToken",Y.data.refreshToken);const ht=Q.get("channel");ht&&await te(ac,{headers:{token:Y.data.accessToken,Authorization:"Bearer "+Y.data.accessToken},data:{name:ht,url:location.href}}),uo({action:1,token:Y.data.accessToken}),setTimeout(()=>{var Z,Ie;const Re=Xa(A.urlPathname,x,(Ie=(Z=Y.data)==null?void 0:Z.userVO)==null?void 0:Ie.userId);if(Re&&typeof location<"u"){location.replace(Re);return}si(C,{method:"push"})},900)};return I.useImperativeHandle(y,()=>({msgDoSendCode:ge})),h.jsxs("div",{className:" flex flex-col gap-[16px] w-full max-w-full  md:max-w-[400px] ",children:[T&&h.jsx(Ys,{size:"medium",onClick:()=>m(),className:"text-text_primary"}),h.jsxs("div",{className:"mb-[16px]",children:[h.jsx("div",{className:"text-[30px] md:text-[32px] font-bold text-text_primary mb-[12px]",children:h.jsx(Br,{id:w[e]})}),h.jsxs("div",{className:"text-text_tertiary text-[14px] font-normal leading-[1.4]",children:[h.jsx(Br,{id:"register.codeSendTip",values:{0:h.jsx("span",{className:"text-text_primary font-medium mx-[8px]",children:M})}}),!T&&h.jsx(Dn,{size:"small",className:"ml-[4px] inline-block align-[-2px] cursor-pointer",onClick:()=>m()})]})]}),h.jsxs("div",{className:"iForm",children:[h.jsx("div",{children:h.jsx(Ha,{ref:$,autoFocus:!0,theme:f??"dark",disabled:dt,errMsg:le,value:R,onInput:P})}),h.jsxs("div",{className:"flex items-center justify-between mt-[16px]",children:[h.jsx("div",{children:h.jsxs("button",{className:V("text-text_tertiary text-[14px] flex items-center font-medium cursor-pointer ",{"text-fn_brand_default hover:text-fn_brand_hover cursor-pointer":!K,"cursor-not-allowed ":!!K}),disabled:!!K,onClick:re,children:[b._("register.resend")," ",!!K&&h.jsxs("span",{children:[K,"s"]})]})}),(e==="email"||T)&&h.jsxs("div",{className:V("flex items-center text-text_primary text-[14px] font-medium",{"cursor-pointer":W,"cursor-not-allowed opacity-60":!W}),onClick:W?xt:void 0,children:[h.jsx($a,{size:"small",className:"mr-[4px]"}),b._("register.start.copy")]})]}),e==="mobile"&&Sa.enableVoiceCode&&h.jsx("div",{className:"flex items-center justify-end",children:h.jsx("button",{className:V("text-body-3  flex items-center font-medium cursor-pointer ",{"text-fn_brand_default hover:text-fn_brand_hover cursor-pointer":!0}),onClick:ie,children:b._("login.voiceCode")})}),h.jsx(Ct,{className:"mt-[32px] md:mt-6",type:"brand",disabled:dt||!R||R.length<6,size:"large",block:!0,onClick:Gt,loading:dt,children:b._("register.nextStep")}),h.jsx("div",{className:"flex items-center mt-[24px]",children:h.jsx("button",{className:V("text-[14px] font-normal text-text_primary cursor-pointer hover:text-text_primary",T&&"underline decoration-text_primary underline-offset-2"),onClick:Te,children:b._("register.noReceiveCode")})})]})]})}));function Ph({children:t}){const[e,r]=g.useState(!1);return g.useEffect(()=>r(!0),[]),typeof window>"u"?null:e?h.jsx(h.Fragment,{children:t}):null}const Oh=`${Fr}/imgs/ssr-web-user-center/account`,Mh=`${Oh}/emailCheck.svg`,Lh=/^[A-Z0-9]{4,12}$/i;function er(t){return Lh.test(t)}const jh=400,Dh=new RegExp("[~`!@#$%^&*()_\\-+=[\\]{}|;:,<>.?/]");function Uh(){return[{key:"length",label:b._("register.passwordRule1"),check:e=>e.length>=8&&e.length<=32},{key:"number",label:b._("register.passwordRule2"),check:e=>/\d/.test(e)},{key:"uppercase",label:b._("register.passwordRule3"),check:e=>/[A-Z]/.test(e)},{key:"special",label:b._("register.passwordRule4"),check:e=>Dh.test(e)}]}function Fh({thirdAuthDTO:t,setPageType:e,themeMode:r,originPage:n,onShellChange:s}){var tt;const{isMobile:i}=Jr(),o=mr(),u=Ta().theme,a=Ra(o.urlPathname,i,Na(i,{cookieOrStoreTheme:u,pageTheme:o.theme})),c=r??a,l=r??(i?a:Aa.dark),d=c==="dark",p=g.useMemo(()=>{var k;if(typeof window>"u")return{};const _=((k=o.urlParsed)==null?void 0:k.searchOriginal)??window.location.search,E=new URLSearchParams(_.startsWith("?")?_.slice(1):_),S={};for(const O of E.keys()){const pe=E.getAll(O);S[O]=pe.length<=1?pe[0]:pe}return S},[(tt=o.urlParsed)==null?void 0:tt.searchOriginal]),m=_=>{if(typeof _=="string")return _;const E=_!=null&&_.query?`?${new URLSearchParams(_.query).toString()}`:"";return`${(_==null?void 0:_.pathname)||(_==null?void 0:_.path)||""}${E}`},f=g.useMemo(()=>({locale:o.locale,query:p,push:_=>{typeof location>"u"||(location.href=m(_))},replace:_=>{typeof location>"u"||location.replace(m(_))}}),[o.locale,p]),y=oc(),w=Xr("/components/Pages/Register/Start/index.js"),A=Ga(),x=n&&n==="custom",[C,T]=g.useState();g.useEffect(()=>{let _=!1;const E=()=>{_||Js("?userBehaviorEnum=MOBILE").then(O=>{_||T((O==null?void 0:O.data)||{})})};let S,k;return typeof window<"u"&&"requestIdleCallback"in window?S=window.requestIdleCallback(()=>E(),{timeout:2e3}):k=setTimeout(E,300),()=>{_=!0,S!==void 0&&typeof window<"u"&&"cancelIdleCallback"in window&&window.cancelIdleCallback(S),k!==void 0&&clearTimeout(k)}},[]);const D=g.useMemo(()=>{if(!C)return;const _=C.ipCountryId||C.defaultCountryId;return _?{id:_}:void 0},[C]),[M,R]=I.useState("step1"),[P,$]=I.useState("email"),W=I.useRef(null),[U,le]=I.useState(""),[J,K]=I.useState("");I.useEffect(()=>{if(f.query.email){const _=Array.isArray(f.query.email)?f.query.email[0]:f.query.email;_&&(K(_),$("email"),le(_))}},[f.query.email]);const[ne,ke]=I.useState({isOK:!1,errMsg:""}),se=_=>{const E=U,S=b._("register.plsInputCorrectEmail");let k={isOK:!0,errMsg:""};return E?A(E)||(k={isOK:!1,errMsg:S}):k={isOK:!1,errMsg:S},ke(k),k};I.useEffect(()=>{ke({isOK:!1,errMsg:""})},[U]);const[ge,De]=I.useState("91"),[re,ie]=I.useState("");I.useEffect(()=>{f.query.phone&&($("mobile"),setTimeout(()=>{const _=Array.isArray(f.query.phone)?f.query.phone[0]:f.query.phone;_&&(K(_),$("mobile"),ie(_))},17))},[f.query.phone]);const[ue,ae]=I.useState({isOK:!1,errMsg:""}),ut=_=>{const E=re,S=b._("register.plsInputCorrectPhone");let k={isOK:!0,errMsg:""};return E?Za("phone",E)||(k={isOK:!1,errMsg:b._("register.plsInputCorrectPhone")}):k={isOK:!1,errMsg:S},ae(k),k};I.useEffect(()=>{ae({isOK:!1,errMsg:""})},[re]);const[Te,dt]=I.useState(""),[Be,xt]=I.useState({isOK:!1,errMsg:""}),[Gt,Qt]=I.useState(!!x),q=Uh(),oe=_=>{const E=Te,S=b._("register.plsInputPwd");let k={isOK:!0,errMsg:""};if(E){const O=q.find(pe=>!pe.check(E));O&&(k={isOK:!1,errMsg:O.label})}else k={isOK:!1,errMsg:_?S:""};return xt(k),k};I.useEffect(()=>{xt({isOK:!1,errMsg:""})},[Te]);const[we,_e]=I.useState(!0),[G,Y]=I.useState(""),[ht,ce]=I.useState(""),[Et,Re]=I.useState(""),Z=I.useRef(null),Ie=I.useRef(0),Ne=I.useRef(G),Jt=I.useRef(null),$e=I.useRef(null),de=I.useRef(null);I.useEffect(()=>{Ne.current=G},[G]);const Xt=I.useCallback(_=>{const E=++Ie.current;Z.current&&(Z.current(),Z.current=null),(async()=>{const{data:S,err:k,cancelled:O}=await te(nc,_,{cancelFun:Nt=>Z.current=Nt});if(E!==Ie.current||O||_.trim()!==Ne.current.trim())return;if(k){w({desc:"get_inviteCode catch error",data:{code:_},e:k});return}const pe=[ns(S!=null&&S.futuresCommissionRebate?S.futuresCommissionRebate:0).times(100).toFixedMax(2),ns(S!=null&&S.spotCommissionRebate?S.spotCommissionRebate:0).times(100).toFixedMax(2)];Re(pe)})().finally(()=>{E===Ie.current&&(Z.current=null)})},[]),[St,ve]=g.useState(!1),[_r,xe]=g.useState(!1),Cr=I.useCallback((_,E)=>{const S=E.trim(),k=_&&Jt.current==="url"&&$e.current!==null&&S===$e.current;ve(k)},[]),he=I.useRef(null),Ae=I.useRef(0),Yt=I.useCallback(_=>{const E=_.trim();if(E.length>0&&!/^[A-Z0-9]{4,12}$/i.test(E)){Ae.current+=1,he.current&&(he.current(),he.current=null),ce(b._("register.checkInviteCodeTip")),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=E;return}const S=++Ae.current;he.current&&(he.current(),he.current=null),(async()=>{const{data:k,err:O,cancelled:pe}=await te(us,E,{cancelFun:Nt=>he.current=Nt});if(S===Ae.current&&!pe&&E===Ne.current.trim()){if(O){ce(O),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=E;return}k!=null&&k.correctInviteCode?(ce(""),xe(!0),Cr(!0,E)):(ce(b._("register.checkRecommendCodeTip")),ve(!1),xe(!1)),Se.updateState({agent:{...k,inviteCode:E}}),de.current=E}})().finally(()=>{S===Ae.current&&(he.current=null)})},[Cr]),Ye=I.useRef(!1),Zt=I.useCallback(_=>{const E=_.trim();if(E){if(!er(E)){ce(b._("register.checkInviteCodeTip")),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=null;return}Xt(E),Yt(E)}},[Xt,Yt]),sn=I.useMemo(()=>Oo(()=>{if(Ye.current){Ye.current=!1;return}Zt(Ne.current)},jh),[Zt]),Ir=_=>{if(St)return;Ye.current=!1;const E=_.trim(),S=de.current;(S!==null&&E!==S||$e.current!==null&&E!==$e.current)&&(ce(""),ve(!1)),E?er(E)||(ce(b._("register.checkInviteCodeTip")),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=null):(ce(""),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=null),Y(_),Ne.current=_,E&&sn()};I.useEffect(()=>{const _=G.trim();!_||!er(_)?(de.current=null,Ae.current+=1,Ie.current+=1,he.current&&(he.current(),he.current=null),Z.current&&(Z.current(),Z.current=null)):de.current!==null&&de.current!==_&&(de.current=null)},[G]),I.useEffect(()=>{const _=Ya("ref"),E=Q.get("inviteCode"),S=_||E;if(S){Jt.current=_?"url":"storage",$e.current=S.trim(),_e(!0),Y(S),Qt(!0);const k=S.trim();if(!k)return;if(!er(k)){ce(b._("register.checkInviteCodeTip")),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=null;return}Xt(k),Yt(k)}return()=>{Ie.current+=1,Ae.current+=1,Z.current&&(Z.current(),Z.current=null),he.current&&(he.current(),he.current=null)}},[]),I.useEffect(()=>{Re(""),xe(!1)},[G]);const an=_=>{const{value:E}=_.target;Ne.current=E;const S=E.trim();if(S){if(!er(S)){ce(b._("register.checkInviteCodeTip")),ve(!1),xe(!1),Se.updateState({agent:null}),de.current=null;return}S!==de.current&&(Ye.current=!0,Zt(E))}},[Ve,xr]=I.useState(!1),[kt,ft]=I.useState(!0),[on,Er]=I.useState(!1);I.useEffect(()=>{Ve&&Er(!1)},[Ve]);const Sr=I.useRef(null),[pt,mt]=I.useState(!1),[cn,kr]=I.useState(0),Tt=I.useRef(null),[ln,un]=I.useState(""),[Ee,fe]=I.useState(!1),Tr=()=>{var E,S;let _=!0;return M==="step1"&&(P==="email"?!(((E=W.current)==null?void 0:E.verifyEmail(!0))||se()).isOK&&(_=!1):P==="mobile"&&!(((S=W.current)==null?void 0:S.verifyMobile(!0))||ut()).isOK&&(_=!1)),M==="step2"&&!oe(!0).isOK&&(_=!1),_},v=async()=>{const _={userName:re||U},{err:E,data:S}=await te(Ma,{params:_,errorPop:!0});return S.isIntercept?(Pe.error(b._("register.ipIsIntercept")),!1):!0},N=async()=>{var _;if(Tr()&&!Ee){if(M==="step1"){if(fe(!0),w({desc:"Sign Up button click",data:{type:P,email:U,countryCode:ge,mobile:re}}),G)if(Se.agent&&Se.agent.inviteCode===G){if(!Se.agent.correctInviteCode){fe(!1);const E=b._("register.checkRecommendCodeTip");_e(!0),ce(E),Pe.error(E);return}}else{const{err:E,data:S}=await te(us,G,{errorPop:!0});if(E){fe(!1);return}if(!S||!S.correctInviteCode){fe(!1);const k=b._("register.checkRecommendCodeTip");_e(!0),ce(k),Pe.error(k);return}S.inviteCode=G,Se.updateState({agent:S})}if(!await v()){fe(!1);return}if(P==="email"){const{data:E}=await te(Pa,{data:{email:U}});if(E&&E.whitelist===!1){fe(!1),ke({isOK:!1,errMsg:xn(E.errorMsg,E.errorMsg)});return}}try{const E=P==="email"?U:re,{err:S,data:k}=await te(Oa,{data:{userName:E,countryCode:P==="mobile"?`+${ge}`:void 0,loginType:P},errorPop:!1});if(S||!(k!=null&&k.allowRegister)){const O=k==null?void 0:k.resultCode;if(O==="RESTRICTED_COUNTRY"){fe(!1),Lt.warning({title:b._("account.prompt"),content:b._("register.restrictedCountryTip"),okText:b._("login.IKnow")});return}if(O==="DEVICE_RISK"){fe(!1),Lt.warning({title:b._("account.prompt"),content:b._("register.deviceRiskControlTip"),okText:b._("login.IKnow"),cancelText:b._("register.cancel")});return}if(O==="ACCOUNT_EXISTS"){fe(!1);const pe=P==="email"?U:re;Lt.confirm({title:b._("register.accountExistsTipTitle"),content:b._({id:"register.accountExistsTip",values:{0:pe}}),okText:b._("register.goToLogin"),icon:null,cancelText:b._("register.cancel"),closable:!0,classNames:{footer:"[&>span]:block [&>span]:w-full [&_[data-component=dialog-default-footer]]:w-full pt-4! pb-8!"},okButtonProps:{className:"flex-1"},cancelButtonProps:{className:"flex-1"},onOk:()=>{const Nt=P==="email"?{email:pe}:{phone:pe};typeof location>"u"?f.push({pathname:"/accounts/login",query:{...f.query,...Nt}}):location.href=ni({pathname:"/login",locale:f.locale,query:{...f.query,...Nt}})},onCancel:()=>{}});return}fe(!1),Pe.error(xn((k==null?void 0:k.errorType)??(k==null?void 0:k.errorCode),k==null?void 0:k.errorMsg,S));return}fe(!1),R("step2")}catch(E){fe(!1),console.error("注册检测接口异常：",E)}return}y(),console.log("geetestRef.current.verify();"),(_=Tt.current)==null||_.verify()}};g.useEffect(()=>{t&&($("email"),le(t.email),K(t.email))},[t]);const F=_=>{var E;if(_&&un(_),pt){(E=Sr.current)==null||E.msgDoSendCode(_);return}else{gt(_);return}},[j,X]=I.useState(0),gt=_=>{fe(!0),console.log({state_type:P,state_email:U,state_mobile:re,state_countryCode:ge,state_msgType:j});const E={codeType:"101",receiveAddress:P==="email"?U:re,puzzleValidateString:_};P==="mobile"&&(E.countryCode=ge,E.msgType=j),Xs({params:{codeType:"101"},data:E,errorPop:!0}).then(S=>{kr(S!=null&&S.isOk?60:0),mt(!0)}).finally(()=>{fe(!1)}).catch(S=>{if(w({desc:"post_msgDoSendCode catch error",data:E,e:S}),kr(0),mt(!0),typeof S=="object"){const{code:k}=S;if(k==1404){Wa({isDark:d,icon:!1,inner:h.jsxs("div",{style:{textAlign:"center"},children:[h.jsx(Qs,{alt:"local",lazy:!1,src:Mh}),h.jsx("div",{style:{marginTop:"20px"},children:S.message})]})});return}Pe.error(S.message)}})},Ze=_=>{var E;console.log("geetestPop"),X(_),(E=Tt.current)==null||E.verify()},z=!1,Ce=()=>h.jsxs("div",{className:"flex flex-col gap-1",children:[h.jsx("h1",{className:"text-display-1 text-text_primary font-bold mb-0 text-[20px] md:text-[32px] text-center md:text-start leading-[140%]",children:x?b._("customRegistration.title"):t?b._("register.createAccount"):b._("register.welcomeToSiri")}),!!t&&h.jsx("div",{className:"text-body-3 text-text_secondary",children:b._({id:"account.emailWillBindYourCreateAcc",values:{0:t.email}})}),!x&&!t&&h.jsxs("div",{className:"flex gap-1 items-center text-body-3",children:[h.jsx("span",{className:"text-text_secondary",children:b._("register.hasAccount")}),h.jsx(Pt,{href:Ot({pathname:"/login",query:f.query}),children:h.jsx("span",{className:"text-text_brand cursor-pointer hover:text-fn_brand_hover",children:b._("register.goToLogin")})})]})]}),et=()=>h.jsxs("div",{className:"flex justify-between items-center",children:[h.jsx("div",{className:"text-text_primary font-bold text-[30px]",children:b._("app.register")}),h.jsx("div",{className:"text-text_brand font-medium text-[14px]",children:h.jsx(Pt,{href:Ot({pathname:"/login",query:f.query}),children:h.jsx("span",{className:"text-text_brand cursor-pointer hover:text-fn_brand_hover",children:b._("login.login")})})})]}),qe=()=>h.jsx("div",{className:V("flex w-full",i?"min-h-0 flex-1 flex-col":"justify-center"),children:h.jsxs("div",{className:V("flex w-full max-w-full flex-col md:max-w-[400px]",i?"flex-1 min-h-0 gap-8":"gap-[32px]"),children:[i?h.jsx(et,{}):h.jsx(Ce,{}),h.jsx("div",{className:V("flex flex-col",i&&"min-h-0 flex-1 gap-3 md:flex-none"),children:h.jsxs("div",{className:"flex flex-col",children:[h.jsx("div",{children:h.jsx(ti,{countryInfos:C,defaultCountryCode:"91",disabled:Ee,error:ne.errMsg,label:t?P==="email"?b._("app.email"):b._("app.mobile"):void 0,onChange:K,onCountryCodeChange:De,onEmailChange:le,onMobileChange:ie,onTypeChange:_=>{_&&$(_)},readonly:!!(t!=null&&t.email),ref:W,showLabel:!t,value:J})}),h.jsx(Nh,{cashbackRatio:Et,defaultOpen:!!x,disabled:Ee,errMsg:ht,expandForPrefill:Gt,isReadonly:St,isSuccess:_r,onBlur:an,onInput:Ir,value:G}),h.jsxs("div",{className:"flex flex-col gap-2 mt-8",children:[h.jsx("div",{className:"flex items-start gap-2",children:h.jsx(ja,{checked:Ve,classNames:{root:V(),label:"text-body-3 text-text_secondary"},disabled:Ee,onChange:_=>{xr(_.target.checked),Er(!1)},size:"large",children:h.jsx("div",{className:V("text-body-3 text-text_primary flex-1",{"text-[12px]":i}),children:qa&&h.jsx(Br,{id:"register.agreeTermsWithLinks",values:{0:h.jsx("a",{className:"t",href:es(ts.UserAgreement),rel:"noreferrer",target:"_blank",children:h.jsxs("span",{className:"text-text_primary underline ",children:[" ",b._("register.userAgreement")]})}),1:h.jsx("a",{className:"",href:es(ts.PrivacyPolicy),rel:"noreferrer",target:"_blank",children:h.jsxs("span",{className:"text-text_primary underline",children:[" ",b._("register.privacyPolicy")]})})}})})})}),z,on&&h.jsx("div",{className:"text-body-3 text-text_error",children:b._("register.plsCheckTip")})]}),h.jsx(Ct,{disabled:!Ve||Ee||!J,loading:Ee,onClick:N,size:"large",type:"brand",className:"mt-4",children:b._("register.nextStep")})]})}),!t&&h.jsx("div",{className:V(i&&"mt-auto w-full shrink-0 pb-8 max-md:pb-[calc(32px+env(safe-area-inset-bottom,0px))] md:mt-0 md:pb-0"),children:h.jsx(Ph,{children:h.jsx(sa,{forceAppleDarkIcon:l==="light",className:i?"mt-0!":void 0})})})]})}),Rt=()=>h.jsx("div",{className:"flex items-center justify-center",children:h.jsxs("div",{className:"flex flex-col gap-[32px] w-full max-w-full md:max-w-[400px] ",children:[i&&h.jsx(Ys,{className:"text-text_primary",onClick:()=>R("step1"),size:"medium"}),h.jsxs("div",{className:"flex flex-col gap-1 mt-[-16px]",children:[h.jsx("h1",{className:"text-display-1 text-text_primary font-bold text-[30px]",children:b._("register.setPassword")}),h.jsxs("div",{className:"flex gap-1 items-center text-body-3",children:[!i&&h.jsxs("span",{className:"text-text_secondary",children:[b._("register.account")," ",b._("common.colon")," ",h.jsx("span",{className:"text-text_primary",children:P==="email"?U:re})]}),!i&&h.jsx("div",{className:"inline-flex text-text_primary hover:text-text_secondary cursor-pointer",onClick:()=>R("step1"),children:h.jsx(Dn,{className:"size-3"})})]})]}),h.jsxs("div",{className:"flex flex-col gap-[12px]",children:[h.jsxs("div",{className:"flex flex-col gap-1",children:[h.jsx("span",{className:"text-[14px] font-normal text-text_primary",children:b._("register.password")}),h.jsx(ri,{autoComplete:"new-password",disabled:Ee,isErr:!!Be.errMsg,onBlur:()=>oe(1),onInput:dt,popover:!1,value:Te}),Be.errMsg&&h.jsx("div",{className:"text-[12px] text-text_error mt-1",children:Be.errMsg})]}),h.jsx("div",{className:"flex flex-col gap-1",children:q.map(_=>{const E=Te?_.check(Te):!1;return h.jsxs("div",{className:"flex items-center gap-1",children:[E?h.jsx(rs,{className:"text-text_success [&_path]:stroke-[1.25]",rtl:!0,size:"tiny"}):h.jsx(rs,{className:"text-text_tertiary/60 [&_path]:stroke-[1.25]",rtl:!0,size:"tiny"}),h.jsx("span",{className:`text-[12px] font-normal leading-[140%] ${E?"text-text_primary":"text-text_tertiary"}`,children:h.jsx("span",{children:_.label})})]},_.key)})}),h.jsx(Ct,{className:"mt-[20px]",disabled:Ee||!Te||!!Be.errMsg,loading:Ee,onClick:N,size:"large",type:"brand",children:b._("register.nextStep")})]})]})}),vt=g.useCallback(()=>{if(!t)return;const _=t.authType;Pe.success(b._({id:"account.xAccBindSuccess",values:{0:_[0].toUpperCase()+_.slice(1).toLowerCase()}}))},[t]);return Rh({enableConfirm:!1,onReset:()=>{R("step1"),mt(!1)}}),I.useLayoutEffect(()=>{s==null||s({step:M,isVerification:pt})},[M,pt,s]),h.jsxs(cr,{countryInfo:D,themeMode:c,children:[!pt&&h.jsxs(h.Fragment,{children:[M==="step1"&&qe(),M==="step2"&&Rt()]}),pt&&h.jsx("div",{className:"flex items-center justify-center",children:h.jsx(Ah,{ref:Sr,type:P,email:U,countryCode:ge,mobile:re,msgType:j,password:Te,recommendCode:G,thirdAuthDTO:t,regSuccess:vt,puzzleValidateString:ln,initialSecond:cn,geetestPop:Ze,onBackToEdit:()=>{R("step1"),mt(!1)},themeMode:c})}),h.jsx(Zs,{onSuccess:F,ref:Tt})]})}const Bh=qt(Fh);export{kh as L,pf as M,Ch as Q,Bh as R,ar as T,na as a,uf as b,df as g};
