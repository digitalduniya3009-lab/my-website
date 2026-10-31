const menu=document.getElementById("menu");
const nav=document.getElementById("nav");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const revealObserver=new IntersectionObserver((entries,obs)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const sections=document.querySelectorAll("main section[id]");
const navLinks=document.querySelectorAll("#nav a[href^='#']");
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.remove("active"));
      document.querySelector(`#nav a[href="#${entry.target.id}"]`)?.classList.add("active");
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>activeObserver.observe(s));

document.getElementById("year").textContent=new Date().getFullYear();

function trackEvent(name, params={}){
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:name,...params});
  if(typeof gtag==="function") gtag("event",name,params);
}
document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener("click",()=>trackEvent("phone_click",{location:"website"})));
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener("click",()=>trackEvent("email_click",{location:"website"})));
document.getElementById("whatsapp")?.addEventListener("click",()=>trackEvent("whatsapp_click",{location:"floating_button"}));

document.querySelectorAll(".price-btn").forEach(a=>a.addEventListener("click",()=>{
  trackEvent("pricing_cta_click",{package_name:a.closest(".price-card")?.querySelector(".price-top span")?.textContent||"unknown"});
}));

document.getElementById("leadForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const d=new FormData(e.target);
  trackEvent("generate_lead",{service:d.get("service")});
  const subject=encodeURIComponent(`Mars Six Media Enquiry - ${d.get("service")}`);
  const body=encodeURIComponent(
`Name: ${d.get("name")}
Phone: ${d.get("phone")}
Company: ${d.get("company")}
Service: ${d.get("service")}

Project brief:
${d.get("message")}`
  );
  document.getElementById("formStatus").textContent="Opening your email app with the enquiry...";
  window.location.href=`mailto:info@m6media.in?subject=${subject}&body=${body}`;
});
