"use strict";(self.webpackChunktoysmena_client=self.webpackChunktoysmena_client||[]).push([[418],{6418:(s,e,t)=>{t.r(e),t.d(e,{default:()=>P});var r=t(9950),l=t(8089),a=t(704),i=t(6491),n=t(2053),o=t(6699),c=t(5333),d=t(899),x=t(2235),h=t(1320),j=t(5769),A=t(9780),u=t(9213),m=t(1671),p=t(4075),v=t(9240),g=t(4085),y=t(7920),f=t(2507),b=t(6812),O=t(6187),D=t(5298),w=t(4414);function R(s){let{title:e,value:t,icon:r,color:o}=s;return(0,w.jsx)(l.A,{children:(0,w.jsx)(a.A,{children:(0,w.jsxs)(i.A,{sx:{display:"flex",alignItems:"center"},children:[(0,w.jsx)(i.A,{sx:{bgcolor:`${o}.light`,borderRadius:2,p:1,mr:2},children:r}),(0,w.jsxs)(i.A,{children:[(0,w.jsx)(n.A,{variant:"h6",gutterBottom:!0,children:e}),(0,w.jsx)(n.A,{variant:"h4",children:t})]})]})})})}D.t1.register(D.PP,D.kc,D.FN,D.No,D.hE,D.m_,D.s$);const P=function(){const[s,e]=(0,r.useState)(!0),[t,l]=(0,r.useState)({totalOrders:0,totalUsers:0,totalProducts:0,totalRevenue:0,recentOrders:[],salesData:{labels:[],datasets:[]}}),a=async()=>{try{e(!0);const s=await fetch("/api/admin/dashboard"),t=await s.json();t.success&&l({totalOrders:t.totalOrders,totalUsers:t.totalUsers,totalProducts:t.totalProducts,totalRevenue:t.totalRevenue,recentOrders:t.recentOrders,salesData:{labels:t.salesData.labels,datasets:[{label:"Sales",data:t.salesData.values,fill:!1,borderColor:"rgb(75, 192, 192)",tension:.1}]}})}catch(s){console.error("Error fetching dashboard data:",s)}finally{e(!1)}};return(0,r.useEffect)((()=>{a()}),[]),s?(0,w.jsx)(o.A,{}):(0,w.jsxs)(i.A,{children:[(0,w.jsxs)(i.A,{sx:{display:"flex",justifyContent:"space-between",mb:3},children:[(0,w.jsx)(n.A,{variant:"h4",children:"Dashboard"}),(0,w.jsx)(c.A,{onClick:a,children:(0,w.jsx)(v.A,{})})]}),(0,w.jsxs)(d.Ay,{container:!0,spacing:3,children:[(0,w.jsx)(d.Ay,{item:!0,xs:12,sm:6,md:3,children:(0,w.jsx)(R,{title:"Total Orders",value:t.totalOrders,icon:(0,w.jsx)(g.A,{sx:{color:"primary.main"}}),color:"primary"})}),(0,w.jsx)(d.Ay,{item:!0,xs:12,sm:6,md:3,children:(0,w.jsx)(R,{title:"Total Users",value:t.totalUsers,icon:(0,w.jsx)(y.A,{sx:{color:"success.main"}}),color:"success"})}),(0,w.jsx)(d.Ay,{item:!0,xs:12,sm:6,md:3,children:(0,w.jsx)(R,{title:"Total Products",value:t.totalProducts,icon:(0,w.jsx)(f.A,{sx:{color:"info.main"}}),color:"info"})}),(0,w.jsx)(d.Ay,{item:!0,xs:12,sm:6,md:3,children:(0,w.jsx)(R,{title:"Total Revenue",value:`AED ${t.totalRevenue}`,icon:(0,w.jsx)(b.A,{sx:{color:"warning.main"}}),color:"warning"})}),(0,w.jsx)(d.Ay,{item:!0,xs:12,md:8,children:(0,w.jsxs)(x.A,{sx:{p:2},children:[(0,w.jsx)(n.A,{variant:"h6",gutterBottom:!0,children:"Sales Overview"}),(0,w.jsx)(i.A,{sx:{height:300},children:(0,w.jsx)(O.N1,{data:t.salesData,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},title:{display:!1}}}})})]})}),(0,w.jsx)(d.Ay,{item:!0,xs:12,md:4,children:(0,w.jsxs)(x.A,{sx:{p:2},children:[(0,w.jsx)(n.A,{variant:"h6",gutterBottom:!0,children:"Recent Orders"}),(0,w.jsx)(h.A,{children:(0,w.jsxs)(j.A,{size:"small",children:[(0,w.jsx)(A.A,{children:(0,w.jsxs)(u.A,{children:[(0,w.jsx)(m.A,{children:"Order ID"}),(0,w.jsx)(m.A,{children:"Customer"}),(0,w.jsx)(m.A,{align:"right",children:"Amount"})]})}),(0,w.jsx)(p.A,{children:t.recentOrders.map((s=>(0,w.jsxs)(u.A,{children:[(0,w.jsx)(m.A,{children:s.id}),(0,w.jsx)(m.A,{children:s.customer}),(0,w.jsxs)(m.A,{align:"right",children:["AED ",s.amount]})]},s.id)))})]})})]})})]})]})}}}]);