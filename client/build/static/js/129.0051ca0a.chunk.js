"use strict";(self.webpackChunktoysmena_client=self.webpackChunktoysmena_client||[]).push([[129],{2507:(e,t,a)=>{a.d(t,{A:()=>o});var n=a(3235),s=a(4414);const o=(0,n.A)((0,s.jsx)("path",{d:"M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2m-5 12H9v-2h6zm5-7H4V4l16-.02z"}),"Inventory")},3129:(e,t,a)=>{a.r(t),a.d(t,{default:()=>se});var n=a(9950),s=a(8429),o=a(2074),r=a(6491),i=a(9808),l=a(899),c=a(2235),d=a(249),m=a(8587),p=a(8168),u=a(2004),y=a(8465),h=a(9269),A=a(1467),v=a(9254),g=a(8463),b=a(8079),x=a(3828),f=a(9044),I=a(1506),S=a(3372),j=a(1763),C=a(423);function k(e){return(0,C.Ay)("MuiListItem",e)}const N=(0,j.A)("MuiListItem",["root","container","focusVisible","dense","alignItemsFlexStart","disabled","divider","gutters","padding","button","secondaryAction","selected"]);const w=(0,j.A)("MuiListItemButton",["root","focusVisible","dense","alignItemsFlexStart","disabled","divider","gutters","selected"]);function M(e){return(0,C.Ay)("MuiListItemSecondaryAction",e)}(0,j.A)("MuiListItemSecondaryAction",["root","disableGutters"]);var P=a(4414);const R=["className"],L=(0,v.Ay)("div",{name:"MuiListItemSecondaryAction",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,a.disableGutters&&t.disableGutters]}})((e=>{let{ownerState:t}=e;return(0,p.A)({position:"absolute",right:16,top:"50%",transform:"translateY(-50%)"},t.disableGutters&&{right:0})})),V=n.forwardRef((function(e,t){const a=(0,g.b)({props:e,name:"MuiListItemSecondaryAction"}),{className:s}=a,o=(0,m.A)(a,R),r=n.useContext(S.A),i=(0,p.A)({},a,{disableGutters:r.disableGutters}),l=(e=>{const{disableGutters:t,classes:a}=e,n={root:["root",t&&"disableGutters"]};return(0,y.A)(n,M,a)})(i);return(0,P.jsx)(L,(0,p.A)({className:(0,u.A)(l.root,s),ownerState:i,ref:t},o))}));V.muiName="ListItemSecondaryAction";const $=V,G=["className"],O=["alignItems","autoFocus","button","children","className","component","components","componentsProps","ContainerComponent","ContainerProps","dense","disabled","disableGutters","disablePadding","divider","focusVisibleClassName","secondaryAction","selected","slotProps","slots"],T=(0,v.Ay)("div",{name:"MuiListItem",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,a.dense&&t.dense,"flex-start"===a.alignItems&&t.alignItemsFlexStart,a.divider&&t.divider,!a.disableGutters&&t.gutters,!a.disablePadding&&t.padding,a.button&&t.button,a.hasSecondaryAction&&t.secondaryAction]}})((e=>{let{theme:t,ownerState:a}=e;return(0,p.A)({display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",width:"100%",boxSizing:"border-box",textAlign:"left"},!a.disablePadding&&(0,p.A)({paddingTop:8,paddingBottom:8},a.dense&&{paddingTop:4,paddingBottom:4},!a.disableGutters&&{paddingLeft:16,paddingRight:16},!!a.secondaryAction&&{paddingRight:48}),!!a.secondaryAction&&{[`& > .${w.root}`]:{paddingRight:48}},{[`&.${N.focusVisible}`]:{backgroundColor:(t.vars||t).palette.action.focus},[`&.${N.selected}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:(0,h.X4)(t.palette.primary.main,t.palette.action.selectedOpacity),[`&.${N.focusVisible}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.focusOpacity}))`:(0,h.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},[`&.${N.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity}},"flex-start"===a.alignItems&&{alignItems:"flex-start"},a.divider&&{borderBottom:`1px solid ${(t.vars||t).palette.divider}`,backgroundClip:"padding-box"},a.button&&{transition:t.transitions.create("background-color",{duration:t.transitions.duration.shortest}),"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${N.selected}:hover`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:(0,h.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:(0,h.X4)(t.palette.primary.main,t.palette.action.selectedOpacity)}}},a.hasSecondaryAction&&{paddingRight:48})})),z=(0,v.Ay)("li",{name:"MuiListItem",slot:"Container",overridesResolver:(e,t)=>t.container})({position:"relative"}),H=n.forwardRef((function(e,t){const a=(0,g.b)({props:e,name:"MuiListItem"}),{alignItems:s="center",autoFocus:o=!1,button:r=!1,children:i,className:l,component:c,components:d={},componentsProps:h={},ContainerComponent:v="li",ContainerProps:{className:j}={},dense:C=!1,disabled:w=!1,disableGutters:M=!1,disablePadding:R=!1,divider:L=!1,focusVisibleClassName:V,secondaryAction:H,selected:F=!1,slotProps:B={},slots:W={}}=a,D=(0,m.A)(a.ContainerProps,G),X=(0,m.A)(a,O),_=n.useContext(S.A),Y=n.useMemo((()=>({dense:C||_.dense||!1,alignItems:s,disableGutters:M})),[s,_.dense,C,M]),E=n.useRef(null);(0,f.A)((()=>{o&&E.current&&E.current.focus()}),[o]);const U=n.Children.toArray(i),q=U.length&&(0,x.A)(U[U.length-1],["ListItemSecondaryAction"]),J=(0,p.A)({},a,{alignItems:s,autoFocus:o,button:r,dense:Y.dense,disabled:w,disableGutters:M,disablePadding:R,divider:L,hasSecondaryAction:q,selected:F}),K=(e=>{const{alignItems:t,button:a,classes:n,dense:s,disabled:o,disableGutters:r,disablePadding:i,divider:l,hasSecondaryAction:c,selected:d}=e,m={root:["root",s&&"dense",!r&&"gutters",!i&&"padding",l&&"divider",o&&"disabled",a&&"button","flex-start"===t&&"alignItemsFlexStart",c&&"secondaryAction",d&&"selected"],container:["container"]};return(0,y.A)(m,k,n)})(J),Q=(0,I.A)(E,t),Z=W.root||d.Root||T,ee=B.root||h.root||{},te=(0,p.A)({className:(0,u.A)(K.root,ee.className,l),disabled:w},X);let ae=c||"li";return r&&(te.component=c||"div",te.focusVisibleClassName=(0,u.A)(N.focusVisible,V),ae=b.A),q?(ae=te.component||c?ae:"div","li"===v&&("li"===ae?ae="div":"li"===te.component&&(te.component="div")),(0,P.jsx)(S.A.Provider,{value:Y,children:(0,P.jsxs)(z,(0,p.A)({as:v,className:(0,u.A)(K.container,j),ref:Q,ownerState:J},D,{children:[(0,P.jsx)(Z,(0,p.A)({},ee,!(0,A.A)(Z)&&{as:ae,ownerState:(0,p.A)({},J,ee.ownerState)},te,{children:U})),U.pop()]}))})):(0,P.jsx)(S.A.Provider,{value:Y,children:(0,P.jsxs)(Z,(0,p.A)({},ee,{as:ae,ref:Q},!(0,A.A)(Z)&&{ownerState:(0,p.A)({},J,ee.ownerState)},te,{children:[U,H&&(0,P.jsx)($,{children:H})]}))})}));var F=a(2455);const B=["className"],W=(0,v.Ay)("div",{name:"MuiListItemIcon",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,"flex-start"===a.alignItems&&t.alignItemsFlexStart]}})((e=>{let{theme:t,ownerState:a}=e;return(0,p.A)({minWidth:56,color:(t.vars||t).palette.action.active,flexShrink:0,display:"inline-flex"},"flex-start"===a.alignItems&&{marginTop:8})})),D=n.forwardRef((function(e,t){const a=(0,g.b)({props:e,name:"MuiListItemIcon"}),{className:s}=a,o=(0,m.A)(a,B),r=n.useContext(S.A),i=(0,p.A)({},a,{alignItems:r.alignItems}),l=(e=>{const{alignItems:t,classes:a}=e,n={root:["root","flex-start"===t&&"alignItemsFlexStart"]};return(0,y.A)(n,F.f,a)})(i);return(0,P.jsx)(W,(0,p.A)({className:(0,u.A)(l.root,s),ownerState:i,ref:t},o))}));var X=a(2053),_=a(8543);const Y=["children","className","disableTypography","inset","primary","primaryTypographyProps","secondary","secondaryTypographyProps"],E=(0,v.Ay)("div",{name:"MuiListItemText",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[{[`& .${_.A.primary}`]:t.primary},{[`& .${_.A.secondary}`]:t.secondary},t.root,a.inset&&t.inset,a.primary&&a.secondary&&t.multiline,a.dense&&t.dense]}})((e=>{let{ownerState:t}=e;return(0,p.A)({flex:"1 1 auto",minWidth:0,marginTop:4,marginBottom:4},t.primary&&t.secondary&&{marginTop:6,marginBottom:6},t.inset&&{paddingLeft:56})})),U=n.forwardRef((function(e,t){const a=(0,g.b)({props:e,name:"MuiListItemText"}),{children:s,className:o,disableTypography:r=!1,inset:i=!1,primary:l,primaryTypographyProps:c,secondary:d,secondaryTypographyProps:h}=a,A=(0,m.A)(a,Y),{dense:v}=n.useContext(S.A);let b=null!=l?l:s,x=d;const f=(0,p.A)({},a,{disableTypography:r,inset:i,primary:!!b,secondary:!!x,dense:v}),I=(e=>{const{classes:t,inset:a,primary:n,secondary:s,dense:o}=e,r={root:["root",a&&"inset",o&&"dense",n&&s&&"multiline"],primary:["primary"],secondary:["secondary"]};return(0,y.A)(r,_.b,t)})(f);return null==b||b.type===X.A||r||(b=(0,P.jsx)(X.A,(0,p.A)({variant:v?"body2":"body1",className:I.primary,component:null!=c&&c.variant?void 0:"span",display:"block"},c,{children:b}))),null==x||x.type===X.A||r||(x=(0,P.jsx)(X.A,(0,p.A)({variant:"body2",className:I.secondary,color:"text.secondary",display:"block"},h,{children:x}))),(0,P.jsxs)(E,(0,p.A)({className:(0,u.A)(I.root,o),ownerState:f,ref:t},A,{children:[b,x]}))}));var q=a(3235);const J=(0,q.A)((0,P.jsx)("path",{d:"M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z"}),"Dashboard");var K=a(7920),Q=a(2507),Z=a(4085);const ee=(0,q.A)((0,P.jsx)("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z"}),"Assessment"),te=(0,q.A)((0,P.jsx)("path",{d:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"}),"Home"),ae=(0,q.A)((0,P.jsx)("path",{d:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6"}),"Settings"),ne=[{text:"Dashboard",icon:(0,P.jsx)(J,{}),link:"/admin"},{text:"Users",icon:(0,P.jsx)(K.A,{}),link:"/admin/users"},{text:"Products",icon:(0,P.jsx)(Q.A,{}),link:"/admin/products"},{text:"Orders",icon:(0,P.jsx)(Z.A,{}),link:"/admin/orders"},{text:"Analytics",icon:(0,P.jsx)(ee,{}),link:"/admin/analytics"},{text:"Home Page",icon:(0,P.jsx)(te,{}),link:"/admin/home-edit"},{text:"Settings",icon:(0,P.jsx)(ae,{}),link:"/admin/settings"}],se=()=>{const e=(0,s.zy)();return(0,P.jsx)(r.A,{sx:{display:"flex",minHeight:"100vh",bgcolor:"grey.100",pt:3,pb:3},children:(0,P.jsx)(i.A,{maxWidth:"xl",children:(0,P.jsxs)(l.Ay,{container:!0,spacing:3,children:[(0,P.jsx)(l.Ay,{item:!0,xs:12,md:3,lg:2,children:(0,P.jsx)(c.A,{elevation:0,sx:{borderRadius:2,position:"sticky",top:"1rem",maxHeight:"calc(100vh - 2rem)",overflowY:"auto"},children:(0,P.jsx)(d.A,{component:"nav",children:ne.map((t=>(0,P.jsxs)(H,{component:o.N_,to:t.link,selected:e.pathname===t.link,sx:{py:1.5,borderRadius:1,mb:.5,"&.Mui-selected":{bgcolor:"primary.light",color:"primary.main","&:hover":{bgcolor:"primary.light"}},"&:hover":{bgcolor:"action.hover"}},children:[(0,P.jsx)(D,{sx:{minWidth:40,color:e.pathname===t.link?"primary.main":"inherit"},children:t.icon}),(0,P.jsx)(U,{primary:t.text,primaryTypographyProps:{fontSize:"0.9rem",fontWeight:e.pathname===t.link?600:500}})]},t.text)))})})}),(0,P.jsx)(l.Ay,{item:!0,xs:12,md:9,lg:10,children:(0,P.jsx)(c.A,{elevation:0,sx:{p:3,borderRadius:2,minHeight:"calc(100vh - 2rem)"},children:(0,P.jsx)(s.sv,{})})})]})})})}},3828:(e,t,a)=>{a.d(t,{A:()=>s});var n=a(9950);const s=function(e,t){var a,s;return n.isValidElement(e)&&-1!==t.indexOf(null!=(a=e.type.muiName)?a:null==(s=e.type)||null==(s=s._payload)||null==(s=s.value)?void 0:s.muiName)}},7920:(e,t,a)=>{a.d(t,{A:()=>o});var n=a(3235),s=a(4414);const o=(0,n.A)((0,s.jsx)("path",{d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"}),"People")}}]);