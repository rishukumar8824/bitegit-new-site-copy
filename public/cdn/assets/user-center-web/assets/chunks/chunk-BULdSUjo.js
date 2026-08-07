import{V as H,r as O,j as l,Y as ee,Z as te,H as ne}from"./chunk-QHIxqCTZ.js";import{i as re}from"./chunk-9GEbevm_.js";import{a as ae,g as ie,r as g}from"./chunk-BsaeD1ID.js";import"./chunk-eS6eWJxM.js";/* empty css              *//* empty css              *//* empty css              *//* empty css              */(function(){try{var s=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};s.SENTRY_RELEASE={id:"user-center-web@0.0.4"};var e=new s.Error().stack;e&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[e]="eab9ae5c-4472-48a7-9db7-dbc76de1b01f",s._sentryDebugIdIdentifier="sentry-dbid-eab9ae5c-4472-48a7-9db7-dbc76de1b01f")}catch{}})();var k={},T;function se(){if(T)return k;T=1;function s(a){if(typeof window>"u")return;const c=document.createElement("style");return c.setAttribute("type","text/css"),c.innerHTML=a,document.head.appendChild(c),a}Object.defineProperty(k,"__esModule",{value:!0});var e=ae();function x(a){return a&&typeof a=="object"&&"default"in a?a:{default:a}}var u=x(e);s(`.rfm-marquee-container {
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: var(--width);
  transform: var(--transform);
}
.rfm-marquee-container:hover div {
  animation-play-state: var(--pause-on-hover);
}
.rfm-marquee-container:active div {
  animation-play-state: var(--pause-on-click);
}

.rfm-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}
.rfm-overlay::before, .rfm-overlay::after {
  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));
  content: "";
  height: 100%;
  position: absolute;
  width: var(--gradient-width);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.rfm-overlay::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.rfm-overlay::before {
  left: 0;
  top: 0;
}

.rfm-marquee {
  flex: 0 0 auto;
  min-width: var(--min-width);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rfm-initial-child-container {
  flex: 0 0 auto;
  display: flex;
  min-width: auto;
  flex-direction: row;
  align-items: center;
}

.rfm-child {
  transform: var(--transform);
}`);const E=e.forwardRef(function({style:c={},className:M="",autoFill:m=!1,play:h=!0,pauseOnHover:w=!1,pauseOnClick:R=!1,direction:n="left",speed:o=50,delay:f=0,loop:t=0,gradient:r=!1,gradientColor:p="white",gradientWidth:d=200,onFinish:_,onCycleComplete:X,onMount:z,children:N},Y){const[D,G]=e.useState(0),[C,J]=e.useState(0),[S,B]=e.useState(1),[A,K]=e.useState(!1),Q=e.useRef(null),v=Y||Q,j=e.useRef(null),q=e.useCallback(()=>{if(j.current&&v.current){const i=v.current.getBoundingClientRect(),W=j.current.getBoundingClientRect();let y=i.width,b=W.width;(n==="up"||n==="down")&&(y=i.height,b=W.height),B(m&&y&&b&&b<y?Math.ceil(y/b):1),G(y),J(b)}},[m,v,n]);e.useEffect(()=>{if(A&&(q(),j.current&&v.current)){const i=new ResizeObserver(()=>q());return i.observe(v.current),i.observe(j.current),()=>{i&&i.disconnect()}}},[q,v,A]),e.useEffect(()=>{q()},[q,N]),e.useEffect(()=>{K(!0)},[]),e.useEffect(()=>{typeof z=="function"&&z()},[]);const L=e.useMemo(()=>m?C*S/o:C<D?D/o:C/o,[m,D,C,S,o]),U=e.useMemo(()=>Object.assign(Object.assign({},c),{"--pause-on-hover":!h||w?"paused":"running","--pause-on-click":!h||w&&!R||R?"paused":"running","--width":n==="up"||n==="down"?"100vh":"100%","--transform":n==="up"?"rotate(-90deg)":n==="down"?"rotate(90deg)":"none"}),[c,h,w,R,n]),F=e.useMemo(()=>({"--gradient-color":p,"--gradient-width":typeof d=="number"?`${d}px`:d}),[p,d]),V=e.useMemo(()=>({"--play":h?"running":"paused","--direction":n==="left"?"normal":"reverse","--duration":`${L}s`,"--delay":`${f}s`,"--iteration-count":t?`${t}`:"infinite","--min-width":m?"auto":"100%"}),[h,n,L,f,t,m]),I=e.useMemo(()=>({"--transform":n==="up"?"rotate(90deg)":n==="down"?"rotate(-90deg)":"none"}),[n]),Z=e.useCallback(i=>[...Array(Number.isFinite(i)&&i>=0?i:0)].map((W,y)=>u.default.createElement(e.Fragment,{key:y},e.Children.map(N,b=>u.default.createElement("div",{style:I,className:"rfm-child"},b)))),[I,N]);return A?u.default.createElement("div",{ref:v,style:U,className:"rfm-marquee-container "+M},r&&u.default.createElement("div",{style:F,className:"rfm-overlay"}),u.default.createElement("div",{className:"rfm-marquee",style:V,onAnimationIteration:X,onAnimationEnd:_},u.default.createElement("div",{className:"rfm-initial-child-container",ref:j},e.Children.map(N,i=>u.default.createElement("div",{style:I,className:"rfm-child"},i))),Z(S-1)),u.default.createElement("div",{className:"rfm-marquee",style:V},Z(S))):null});return k.default=E,k}var oe=se();const $=ie(oe),le=$.default??$,P="ipLimitBannerDismissed",ue=720*60*60*1e3,ce={home:1,auth:2,wallet:4};function ge({page:s,debugShow:e,displayTheme:x,className:u}){const[E,a]=g.useState(!1),[c,M]=g.useState(!1),m=g.useRef(null),h=g.useRef(null),w=g.useRef(null);if(g.useEffect(()=>{if(e){a(!0);return}if(!s)return;const o=ce[s];try{const t=H.get(P);if(t!=null&&t.time&&Date.now()-t.time<ue)return}catch{}const f={isAutoPopError:!1,noHandle401:!0};O.get("/uaapi/user/public/user/ip-limit/checkV2",f).then(t=>{var r;if(!(!(t!=null&&t.isOk)||!(((r=t.data)==null?void 0:r.limit)??!1)))return O.get("/exapi/user/public/user/compliance-bar/config",f)}).then(t=>{var r;t!=null&&t.isOk&&((((r=t.data)==null?void 0:r.webPages)??0)&o)!==0&&a(!0)}).catch(()=>{})},[e,s]),g.useLayoutEffect(()=>{if(!E)return;let o,f;if(c){const r=m.current,p=h.current;if(!r||!p)return;o=r,f=()=>{const d=p.scrollWidth>r.clientWidth;M(_=>_===d?_:d)}}else{const r=w.current;if(!r)return;o=r,f=()=>{const p=r.scrollWidth>r.clientWidth;M(d=>d===p?d:p)}}f();const t=new ResizeObserver(f);return t.observe(o),()=>t.disconnect()},[E,c]),!E)return null;const R=()=>{a(!1);try{H.set(P,{time:Date.now()})}catch{}},n=re._("header.ipLimitBanner");return l.jsxs("div",{className:ne("w-full flex items-center gap-2 px-4 py-1.5 bg-bg_secondary text-text_secondary text-sm leading-relaxed",u),...x?{theme:x}:{},children:[l.jsx(ee,{className:"shrink-0",icon:o=>l.jsx("svg",{...o,fill:"none",viewBox:"0 0 14 14",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M6.66667 9.53674e-06C2.98477 9.53674e-06 0 2.98481 0 6.66668C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3485 13.3333 13.3333 10.3486 13.3333 6.66668C13.3333 2.98481 10.3485 9.53674e-06 6.66667 9.53674e-06ZM6.66667 1.33334C9.6122 1.33334 12 3.72114 12 6.66668C12 9.6122 9.6122 12 6.66667 12C3.72115 12 1.33333 9.6122 1.33333 6.66668C1.33333 3.72114 3.72115 1.33334 6.66667 1.33334ZM6 10H7.33333V8.66668H6V10ZM6 7.33334H7.33333V3.33334H6V7.33334Z",fill:"#A0A3A7"})}),size:14}),c?l.jsxs("div",{className:"flex-1 overflow-hidden min-w-0 relative",ref:m,children:[l.jsx("span",{"aria-hidden":!0,className:"absolute invisible whitespace-nowrap pointer-events-none banner-text",ref:h,children:n}),l.jsx(le,{gradient:!1,speed:40,children:l.jsx("span",{className:"me-16 banner-text",children:n})})]}):l.jsx("span",{className:"truncate min-w-0 shrink banner-text",ref:w,children:n}),l.jsx("button",{className:"shrink-0 flex items-center cursor-pointer hover:text-text_primary transition-colors",onClick:R,children:l.jsx(te,{size:16})})]})}export{ge as IpLimitBanner};
