(() => {
"use strict";
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzDrLyFEsCVSVqLphU7fiCrNo_slakHFf6R8JSHvqT-5Lr6Y5uxyBQbNshS0uzUXSHa/exec";
const menuBtn=document.getElementById("menuBtn"),mobileNav=document.getElementById("mobileNav");
if(menuBtn&&mobileNav){menuBtn.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.setAttribute("aria-label",open?"Menü schließen":"Menü öffnen")});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mobileNav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")}))}
document.querySelectorAll("[data-scroll-demo]").forEach(btn=>btn.addEventListener("click",()=>document.getElementById("demo")?.scrollIntoView({behavior:"smooth",block:"start"})));
const demoMessages=document.getElementById("demoMessages"),demoInput=document.getElementById("demoInput"),demoForm=document.getElementById("demoForm");
const state={
 industry:null,lastIntent:null,turns:0,stage:"discovery",
 profile:{company:null,website:null,location:null,needs:[],service:null,budget:null,goal:null},
 conversation:{questionCount:0,leadMode:false}
};

const industryLabels={
 RESTAURANT:"Restaurant",HOTEL:"Hotel",AUTOHAUS:"Autohaus",REAL_ESTATE:"Immobilienunternehmen",
 LAW_FIRM:"Kanzlei",DENTAL:"Zahnarztpraxis",FITNESS:"Fitnessstudio",TAX_ADVISOR:"Steuerberatung",
 CRAFT:"Handwerksbetrieb",SHK:"SHK-/Sanitär- und Heizungsbetrieb"
};

const intents=[
 {id:"PRICE",p:["was kostet","wieviel kostet","wie viel kostet","preis","preise","kosten","monatlich","einmalig","basic","pro","enterprise"]},
 {id:"FEATURES",p:["was kann","was kannst du","was kannst","was bietet","was bietest","funktionen","feature","fähigkeiten","faehigkeiten","möglichkeiten","moeglichkeiten"]},
 {id:"LEAD",p:["lead","anfrage erfassen","anfragen erfassen","kontaktdaten","qualifizieren","vorqualifizieren","interessent","anfrage aufnehmen","kunden gewinnen"]},
 {id:"SETUP",p:["einrichten","eingerichtet","einbindung","installieren","website einbinden","implementierung","aufsetzen","integration"]},
 {id:"HOW_IT_WORKS",p:["wie funktioniert","wie arbeitet","wie läuft","wie laeuft","ablauf","prozess","wie gehst du vor"]},
 {id:"PRIVACY",p:["dsgvo","datenschutz","personenbezogene daten","datenverarbeitung","datensicherheit"]},
 {id:"INTEGRATIONS",p:["crm","kalender","calendar","schnittstelle","api","hubspot","salesforce","pipedrive","zapier","n8n","google sheets"]},
 {id:"PURCHASE",p:["kaufen","buchen","bestellen","angebot","beauftragen","starten"]},
 {id:"CONTACT",p:["kontakt","mensch sprechen","mit jemandem","rückruf","rueckruf","berater"]},
 {id:"INDUSTRIES",p:["welche branche","welche branchen","für wen","fuer wen","geeignet"]},
 {id:"RESTAURANT",p:["restaurant","reservierung","reservierungen","speisekarte","tisch","gastronomie"]},
 {id:"HOTEL",p:["hotel","zimmer","check-in","check in","frühstück","fruehstueck","gäste"]},
 {id:"AUTOHAUS",p:["autohaus","fahrzeug","fahrzeuge","probefahrt","werkstatt","fahrzeuganfrage","autohändler"]},
 {id:"REAL_ESTATE",p:["immobilien","immobilie","makler","besichtigung","mietwohnung","kaufinteresse"]},
 {id:"LAW_FIRM",p:["rechtsanwalt","kanzlei","anwalt","mandat"]},
 {id:"DENTAL",p:["zahnarzt","zahn","zahnarztpraxis","behandlung","zahnschmerzen"]},
 {id:"FITNESS",p:["fitness","fitnessstudio","mitgliedschaft","probetraining","kurs","personal training"]},
 {id:"TAX_ADVISOR",p:["steuerberater","steuerberatung","steuerkanzlei"]},
 {id:"SHK",p:["sanitär","sanitaer","heizung","heizungsbau","heizungsbauer","heizungstechnik","shk","wärmepumpe","waermepumpe","klima","klimatechnik","bad","badsanierung","wasserinstallation","gasinstallation"]},
 {id:"CRAFT",p:["handwerk","handwerker","meisterbetrieb","projektanfrage","elektriker","maler","installateur","bauunternehmen"]}
];

const industryResponses={
 FITNESS:{
  intro:"Für ein Fitnessstudio kann Cora deutlich mehr als eine klassische FAQ-Box. Sie kann Website-Besucher beraten, Interesse erkennen und aus einem unverbindlichen Besucher schrittweise eine qualifizierte Anfrage machen.",
  capabilities:["Mitgliedschaften und Tarife erklären","Probetraining und Beratungsgespräche aufnehmen","Kurse, Öffnungszeiten und Ausstattung erklären","Trainingsziele und Interessen erfassen","Fragen zu Vertragslaufzeit, Beiträgen und Kündigung beantworten","Interessenten nach Standort, Zeitraum und Kontaktdaten qualifizieren"],
  flow:["Was möchtest du erreichen – Muskelaufbau, Abnehmen, Ausdauer oder allgemeine Fitness?","Möchtest du ein Probetraining oder zunächst Informationen zu einer Mitgliedschaft?","Wann wäre ein passender Zeitraum für dich?","Wie können wir dich für die Terminabstimmung erreichen?"],
  lead:"Aus diesen Antworten kann Cora eine strukturierte Anfrage erzeugen, statt nur Name und Telefonnummer einzusammeln."
 },
 SHK:{
  intro:"Für einen SHK-, Sanitär- oder Heizungsbetrieb kann Cora Website-Anfragen bereits vorqualifizieren und den Interessenten anhand seines konkreten Problems durch das Gespräch führen.",
  capabilities:["Heizung, Wärmepumpe, Sanitär, Badsanierung und Klima erklären","zwischen Reparatur, Wartung, Modernisierung und Neubau unterscheiden","Objektart und Projektort erfassen","Dringlichkeit und gewünschte Leistung abfragen","technisch relevante Erstinformationen strukturiert aufnehmen","Rückruf- oder Angebotsanfragen vorbereiten"],
  flow:["Geht es um eine Reparatur, Wartung, Modernisierung oder einen Neubau?","Welche Anlage oder Leistung ist betroffen?","Um welche Immobilie handelt es sich?","Wo befindet sich das Objekt und wie dringend ist die Anfrage?","Wie kann Ihr Betrieb den Interessenten erreichen?"],
  lead:"So entsteht aus einer allgemeinen Website-Anfrage eine deutlich verwertbarere Projektanfrage."
 },
 RESTAURANT:{
  intro:"Für ein Restaurant kann Cora Gäste informieren und gleichzeitig Reservierungs- und Kontaktanfragen strukturiert aufnehmen.",
  capabilities:["Speisekarte und Leistungen erklären","Öffnungszeiten und Standort beantworten","Reservierungswünsche aufnehmen","Personenzahl und gewünschten Zeitpunkt abfragen","Fragen zu Veranstaltungen oder Gruppenanfragen beantworten"],
  flow:["Für welchen Tag möchtest du anfragen?","Wie viele Personen seid ihr?","Welche Uhrzeit wäre ungefähr gewünscht?","Gibt es besondere Wünsche oder Hinweise?"],
  lead:"Die Anfrage kann anschließend strukturiert an den gewünschten Prozess übergeben werden. Eine echte Reservierung erfordert die entsprechende Integration."
 },
 HOTEL:{
  intro:"Für ein Hotel kann Cora Gäste vor, während und nach einer Buchungsanfrage informieren und qualifizieren.",
  capabilities:["Zimmer und Ausstattung erklären","Fragen zu Anreise und Frühstück beantworten","Buchungsinteresse strukturieren","Reisezeitraum und Personenzahl erfassen","Sonderwünsche aufnehmen"],
  flow:["Wann möchten Sie anreisen?","Wie lange möchten Sie bleiben?","Für wie viele Personen wird gesucht?","Gibt es besondere Anforderungen an das Zimmer?"],
  lead:"Die erhobenen Informationen können als strukturierte Anfrage weitergegeben werden."
 },
 AUTOHAUS:{
  intro:"Für ein Autohaus kann Cora aus einem allgemeinen Fahrzeuginteresse einen konkreten Verkaufs- oder Servicetermin vorbereiten.",
  capabilities:["Fahrzeugmodelle und Leistungen erklären","Kaufinteresse qualifizieren","Probefahrten vorbereiten","Werkstatt- und Serviceanfragen aufnehmen","Fahrzeug, Budget und Wunschzeitraum erfassen"],
  flow:["Für welches Fahrzeug oder Modell interessieren Sie sich?","Geht es um Kauf, Leasing, Probefahrt oder Service?","Wann wäre ein Termin für Sie interessant?","Wie können wir Sie erreichen?"],
  lead:"Damit erhält der Vertrieb bereits vor dem Rückruf einen strukturierten Überblick über die Anfrage."
 },
 REAL_ESTATE:{
  intro:"Für Immobilienunternehmen kann Cora Interessenten zu Objekten führen und Suchprofile strukturiert erfassen.",
  capabilities:["Objekte und Ausstattungsmerkmale erklären","Kauf- oder Mietinteresse unterscheiden","Budget und Suchkriterien erfassen","Besichtigungswünsche aufnehmen","Kontaktdaten qualifizieren"],
  flow:["Suchen Sie zum Kauf oder zur Miete?","Welche Lage oder Objektart kommt infrage?","Welches Budget ist vorgesehen?","Möchten Sie eine Besichtigung anfragen?"],
  lead:"Aus den Antworten kann ein strukturierter Interessenten-Lead entstehen."
 },
 LAW_FIRM:{
  intro:"Für eine Kanzlei kann Cora Erstinformationen geben und neue Anfragen vorsortieren, ohne individuelle Rechtsberatung vorzutäuschen.",
  capabilities:["Fachgebiete und Leistungen erklären","allgemeine Erstinformationen geben","Anliegen und Rückrufwünsche aufnehmen","Kontakt- und Terminwünsche strukturieren"],
  flow:["Worum geht es bei Ihrer Anfrage?","Welches Rechtsgebiet betrifft das ungefähr?","Möchten Sie ein Erstgespräch anfragen?","Wie können wir Sie erreichen?"],
  lead:"Die Anfrage kann anschließend strukturiert an die Kanzlei übergeben werden."
 },
 DENTAL:{
  intro:"Für eine Zahnarztpraxis kann Cora Praxisinformationen liefern und Termin- oder Rückrufwünsche strukturieren.",
  capabilities:["Leistungen und Praxisinformationen erklären","Terminwünsche aufnehmen","Neupatienten-Anfragen strukturieren","Öffnungszeiten und organisatorische Fragen beantworten"],
  flow:["Geht es um einen Termin, eine allgemeine Frage oder eine bestehende Behandlung?","Sind Sie bereits Patient oder neu in der Praxis?","Welcher Zeitraum wäre für Sie passend?"],
  lead:"Medizinische Diagnosen oder individuelle Behandlungsempfehlungen sollte Cora nicht vortäuschen."
 },
 TAX_ADVISOR:{
  intro:"Für eine Steuerberatung kann Cora Leistungen erklären und neue Anfragen vorstrukturieren.",
  capabilities:["Leistungsbereiche erklären","Erstgespräche vorbereiten","Unternehmens- oder Privatkunden unterscheiden","Anliegen und Kontaktdaten erfassen"],
  flow:["Geht es um private oder unternehmerische Steuerfragen?","Welche Leistung wird ungefähr benötigt?","Handelt es sich um eine neue Anfrage oder einen bestehenden Mandanten?","Wie können wir Sie erreichen?"],
  lead:"Individuelle Steuerberatung sollte weiterhin durch die zuständige Fachperson erfolgen."
 },
 CRAFT:{
  intro:"Für Handwerksbetriebe kann Cora aus einer kurzen Problembeschreibung eine strukturierte Projektanfrage entwickeln.",
  capabilities:["Leistungen erklären","Projektart und Umfang erfassen","Objekt und Standort abfragen","Zeitraum und Dringlichkeit erfassen","Rückruf- und Angebotsanfragen vorbereiten"],
  flow:["Welche Arbeit soll durchgeführt werden?","Geht es um Neubau, Modernisierung, Wartung oder Reparatur?","Wo befindet sich das Objekt?","Wann soll die Arbeit ungefähr stattfinden?"],
  lead:"So erhält der Betrieb vor dem ersten Rückruf bereits die wichtigsten Informationen."
 }
};

function normalize(t){
 return String(t||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").trim();
}

function detectIndustry(q){
 const t=normalize(q);
 const ordered=["SHK","FITNESS","AUTOHAUS","RESTAURANT","HOTEL","REAL_ESTATE","LAW_FIRM","DENTAL","TAX_ADVISOR","CRAFT"];
 for(const id of ordered){
  const found=intents.find(x=>x.id===id);
  if(found&&found.p.some(k=>t.includes(normalize(k))))return id;
 }
 return null;
}

function detectIntent(q){
 const t=normalize(q);
 const industry=detectIndustry(q);
 const scored=intents.map(i=>({
  id:i.id,
  score:i.p.reduce((n,k)=>n+(t.includes(normalize(k))?(k.includes(" ")?4:2):0),0)
 })).sort((a,b)=>b.score-a.score);
 const top=scored[0];
 if(industry && /wie kannst|was kannst|was kann|was bietest|was bietet|wie kannst du|hilfst du|hilfe|für mein unternehmen|fuer mein unternehmen/.test(t))return industry;
 return top&&top.score>0?top.id:"UNKNOWN";
}

function extractProfile(q){
 const t=normalize(q);
 const industry=detectIndustry(q);
 if(industry)state.industry=industry;
 if(/waermepumpe/.test(t)&&!state.profile.needs.includes("Wärmepumpe"))state.profile.needs.push("Wärmepumpe");
 if(/badsanierung|bad/.test(t)&&!state.profile.needs.includes("Badsanierung"))state.profile.needs.push("Badsanierung");
 if(/wartung/.test(t)&&!state.profile.needs.includes("Wartung"))state.profile.needs.push("Wartung");
 if(/reparatur|stoerung|defekt/.test(t)&&!state.profile.needs.includes("Reparatur"))state.profile.needs.push("Reparatur");
 if(/probetraining/.test(t)&&!state.profile.needs.includes("Probetraining"))state.profile.needs.push("Probetraining");
 if(/mitgliedschaft|mitglied/.test(t)&&!state.profile.needs.includes("Mitgliedschaft"))state.profile.needs.push("Mitgliedschaft");
 if(/neubau/.test(t)&&!state.profile.needs.includes("Neubau"))state.profile.needs.push("Neubau");
 if(/modernisierung/.test(t)&&!state.profile.needs.includes("Modernisierung"))state.profile.needs.push("Modernisierung");
 if(/reparatur/.test(t)&&!state.profile.needs.includes("Reparatur"))state.profile.needs.push("Reparatur");
}

function contextualIndustryResponse(){
 const data=industryResponses[state.industry];
 if(!data)return null;
 let out=data.intro+"\n\nCora kann unter anderem:\n• "+data.capabilities.join("\n• ");
 out+="\n\nBeispiel für die Gesprächsführung:\n1. "+data.flow[0]+"\n2. "+data.flow[1]+"\n3. "+data.flow[2]+"\n4. "+data.flow[3];
 out+="\n\n"+data.lead;
 return out;
}

function industryFollowUp(){
 const data=industryResponses[state.industry];
 if(!data)return null;
 const idx=Math.min(Math.max(state.conversation.questionCount,0),data.flow.length-1);
 return data.flow[idx];
}

function answerIndustry(q){
 const data=industryResponses[state.industry];
 const t=normalize(q);
 if(!data)return null;
 if(/wie|warum|konkret|beispiel|genau/.test(t)&&/fragen|gespraech|qualifiz|kunden|interessent|lead/.test(t)){
  return "Genau dafür ist die Gesprächslogik gedacht. Cora soll nicht einfach eine Liste von FAQs ausgeben. Sie erkennt das Anliegen und entscheidet, welche Rückfrage als Nächstes sinnvoll ist. Für Ihren "+industryLabels[state.industry]+" könnte das beispielsweise so aussehen:\n\nBesucher: „Ich interessiere mich für ein Probetraining.“\nCora: „Gerne. Was möchtest du mit deinem Training hauptsächlich erreichen – Muskelaufbau, Abnehmen, Ausdauer oder allgemeine Fitness?“\n\nDanach kann Cora abhängig von der Antwort weiterfragen, statt jedes Mal denselben Text zu senden.";
 }
 if(/mach|spiel|simulier|testen|durchspielen/.test(t)){
  state.stage="lead";
  state.conversation.leadMode=true;
  state.conversation.questionCount=0;
  return "Gerne. Wir können den echten Gesprächsfluss simulieren. Sie sind jetzt der Besucher Ihrer Website. Schreiben Sie zum Beispiel: „Ich möchte ein Probetraining.“ Ich übernehme die Rolle von Cora und führe Sie Schritt für Schritt durch die Anfrage.";
 }
 if(/lead|anfrage|kontakt/.test(t)){
  state.stage="lead";
  state.conversation.leadMode=true;
  return data.lead+" Wenn Sie möchten, starten wir die Qualifizierung jetzt.";
 }
 return contextualIndustryResponse();
}

const responses={
 PRICE:()=> "Cora Basic: 895 € einmalig + 495 € monatlich. Cora Pro: 1.495 € einmalig + 895 € monatlich. Enterprise wird individuell kalkuliert. Entscheidend für die Auswahl sind Umfang des Wissens, Gesprächslogik, Lead-Prozess und gewünschte Integrationen.",
 FEATURES:()=> state.industry?contextualIndustryResponse():"Cora beantwortet nicht nur FAQs. Sie kann Unternehmenswissen erklären, Anliegen erkennen, Gespräche führen, Rückfragen stellen, Interessenten qualifizieren und – je nach Setup – strukturierte Leads an den gewünschten Prozess übergeben.",
 LEAD:()=> state.industry?answerIndustry("lead"): "Cora kann Interessenten Schritt für Schritt qualifizieren: Anliegen erkennen, relevante Rückfragen stellen, Kontaktdaten aufnehmen und die Anfrage strukturiert weitergeben.",
 SETUP:()=> "Beim Setup werden Unternehmenswissen, Leistungen, FAQ, Tonalität, Gesprächslogik, Lead-Felder und Weiterleitungen auf den konkreten Betrieb zugeschnitten. Danach wird Cora in die Website eingebunden.",
 HOW_IT_WORKS:()=> "Cora arbeitet als dialogorientierter Webassistent. Sie ordnet die Nachricht ein, berücksichtigt den bisherigen Gesprächskontext, antwortet passend zum Unternehmen und entscheidet, ob eine Information, Rückfrage oder Lead-Qualifizierung als nächster Schritt sinnvoll ist.",
 PRIVACY:()=> "Datenschutz hängt vom konkreten Einsatz, den Daten, Anbietern, Speicherorten und der technischen Integration ab. Cora kann datenschutzorientiert konfiguriert werden; eine pauschale Rechtsgarantie wäre nicht seriös.",
 INTEGRATIONS:()=> "Je nach Projekt können Formulare, CRM, Kalender und Automatisierungsprozesse angebunden werden. Diese Demo behauptet keine Schnittstelle als aktiv, wenn sie nicht tatsächlich implementiert ist.",
 PURCHASE:()=> "Für den Start sind Unternehmen, Website, Branche und gewünschter Einsatz sinnvoll. Beschreiben Sie mir Ihren konkreten Anwendungsfall; ich kann daraus direkt einen passenden Cora-Gesprächsablauf ableiten.",
 CONTACT:()=> "Über das Anfrageformular können Sie Kontakt aufnehmen. Vorher kann Cora bereits Branche, Anwendungsfall und gewünschte Lead-Funktion strukturieren.",
 INDUSTRIES:()=> "Cora lässt sich auf unterschiedliche Geschäftsmodelle zuschneiden, unter anderem Fitness, SHK, Handwerk, Gastronomie, Hotels, Autohäuser, Immobilien, Kanzleien, Praxen und Steuerberatung."
};

function getAnswer(q){
 state.turns++;
 extractProfile(q);
 const intent=detectIntent(q);
 state.lastIntent=intent;

 if(state.conversation.leadMode&&state.industry){
  const t=normalize(q);
  if(!/preis|kosten|dsgvo|datenschutz|integration|setup|einrichten/.test(t)){
   const data=industryResponses[state.industry];
   const idx=state.conversation.questionCount++;
   if(idx<data.flow.length){
    return "Danke. Das hilft bei der Einordnung. "+data.flow[idx];
   }
   state.conversation.leadMode=false;
   return "Damit ist die Anfrage bereits deutlich konkreter. Cora würde die gesammelten Angaben jetzt als strukturierten Interessenten-Lead weitergeben. Sie können noch nach Preisen, Datenschutz, Integration oder dem konkreten Cora-Setup fragen.";
  }
 }

 if(industryLabels[intent]){
  state.industry=intent;
  if(/wie kannst|was kannst|was kann|was bietest|was bietet|hilfst du|hilfe|für mein unternehmen|fuer mein unternehmen/.test(normalize(q)))return contextualIndustryResponse();
  return answerIndustry(q);
 }
 if(intent==="FEATURES"&&state.industry)return contextualIndustryResponse();
 if(intent==="LEAD"&&state.industry)return answerIndustry(q);
 if(intent==="PRICE")return responses.PRICE();
 if(responses[intent])return responses[intent]();
 if(state.industry)return contextualIndustryResponse();

 return "Beschreiben Sie einfach Ihr Unternehmen und eine echte Situation. Zum Beispiel: „Ich leite ein Fitnessstudio und möchte mehr Probetrainings über meine Website gewinnen.“ Cora kann anschließend zeigen, welche Fragen sie stellen und wie daraus eine qualifizierte Anfrage entsteht.";
}

;