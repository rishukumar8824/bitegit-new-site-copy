const e=(u,n="value",o=r=>r)=>u.reduce((r,t)=>(r[typeof n=="function"?n(t):t[n]]=o(t),r),{});export{e as l};
