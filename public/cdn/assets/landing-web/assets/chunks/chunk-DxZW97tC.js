import{a as n}from"./chunk-rLaxep6e.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"landing-web@0.0.4"};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="315d63d9-51b1-4cf1-995a-48106d8fe769",e._sentryDebugIdIdentifier="sentry-dbid-315d63d9-51b1-4cf1-995a-48106d8fe769")}catch{}})();/**
 * @license lucide-react v0.559.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),b=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase()),i=e=>{const t=b(e);return t.charAt(0).toUpperCase()+t.slice(1)},c=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim(),g=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.559.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var m={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.559.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=n.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:s="",children:a,iconNode:l,...d},f)=>n.createElement("svg",{ref:f,...m,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:c("lucide",s),...!a&&!g(d)&&{"aria-hidden":"true"},...d},[...l.map(([u,p])=>n.createElement(u,p)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.559.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(e,t)=>{const r=n.forwardRef(({className:o,...s},a)=>n.createElement(y,{ref:a,iconNode:t,className:c(`lucide-${w(i(e))}`,`lucide-${e}`,o),...s}));return r.displayName=i(e),r};export{C as c};
