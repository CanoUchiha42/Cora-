const API_URL="https://script.google.com/macros/s/AKfycbzDrLyFEsCVSVqLphU7fiCrNo_slakHFf6R8JSHvqT-5Lr6Y5uxyBQbNshS0uzUXSHa/exec";
const $=s=>document.querySelector(s);
const menuBtn=$("#menuBtn"),mobileNav=$("#mobileNav");
menuBtn?.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>{mobileNav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")}));
document.querySelector("[data-scroll-demo]")?.addEventListener("click",()=>$("#demo")?.scrollIntoView({behavior:"smooth"}));

const answers={
"was kann cora für mein unternehmen tun?":"Cora kann wiederkehrende Website-Fragen beantworten, Besucher durch Ihr Angebot führen und – je nach Konfiguration – relevante Informationen für eine Anfrage aufnehmen.",
"was kann cora?":"Cora beantwortet Fragen, erklärt Leistungen und kann Interessenten strukturiert zur Anfrage führen.",
"kann cora leads erfassen?":"Ja. Die Lead-Erfassung gehört zum angebotenen Leistungsumfang. Welche Informationen erfasst werden, wird passend zu Ihrem Prozess definiert.",
"leads erfassen?":"Ja. Cora kann relevante Kontaktdaten und das Anliegen eines Interessenten strukturiert aufnehmen.",
"wie läuft die einrichtung ab?":"Zuerst werden Unternehmen, Zielgruppe und relevante Informationen definiert. Danach wird Cora konfiguriert und in die Website eingebunden. Der genaue Ablauf hängt vom Einsatzfall ab.",
"einrichtung?":"Die Einrichtung beginnt mit Ihrem Use Case und den relevanten Unternehmensinformationen. Anschließend wird Cora konfiguriert und eingebunden.",
"was kostet cora?":"Cora Basic kostet 895 € einmalig für die Einrichtung und 495 € pro Monat. Cora Pro kostet 1.495 € einmalig und 895 € pro Monat. Enterprise wird individuell kalkuliert.",
"preise?":"Basic: 895 € Einrichtung + 495 €/Monat. Pro: 1.495 € Einrichtung + 895 €/Monat. Enterprise: auf Anfrage."
};
function demoAnswer(q){const k=q.toLowerCase().trim();for(const key in answers)if(k.includes(key)||key.includes(k))return answers[key];return "Das lässt sich für Ihren konkreten Anwendungsfall individuell definieren. Ich kann Fragen zu Cora, Preisen, Einrichtung und Lead-Erfassung beantworten."}
function addDemo(text,type="cora"){const box=$("#demoMessages");const el=document.createElement("div");el.className="msg "+type;el.textContent=text;box.appendChild(el);box.scrollTop=box.scrollHeight}
function runDemo(q){if(!q)return;addDemo(q,"user");setTimeout(()=>addDemo(demoAnswer(q)),350)}
document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>runDemo(b.dataset.prompt)));
$("#demoForm")?.addEventListener("submit",e=>{e.preventDefault();const input=$("#demoInput");runDemo(input.value.trim());input.value=""});

$("#leadForm")?.addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget,status=$("#formStatus");const data=new FormData(form);
 const email=String(data.get("email")||"");if(!/^\S+@\S+\.\S+$/.test(email)){status.textContent="Bitte geben Sie eine gültige E-Mail-Adresse ein.";status.className="form-status error";return}
 status.textContent="Anfrage wird übermittelt …";status.className="form-status";
 const params=new URLSearchParams();data.forEach((v,k)=>params.append(k,String(v)));params.append("source","Cora Website");params.append("status","Neu");
 try{await fetch(API_URL,{method:"POST",mode:"no-cors",body:params});form.reset();status.textContent="Vielen Dank. Ihre Anfrage wurde übermittelt. Wir melden uns.";status.className="form-status success"}catch(err){status.textContent="Die Übermittlung ist gerade nicht möglich. Bitte versuchen Sie es später erneut.";status.className="form-status error";console.error(err)}
});