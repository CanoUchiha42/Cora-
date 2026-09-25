(() => {
"use strict";
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzDrLyFEsCVSVqLphU7fiCrNo_slakHFf6R8JSHvqT-5Lr6Y5uxyBQbNshS0uzUXSHa/exec";
const menuBtn=document.getElementById("menuBtn"),mobileNav=document.getElementById("mobileNav");
if(menuBtn&&mobileNav){menuBtn.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.setAttribute("aria-label",open?"Menü schließen":"Menü öffnen")});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mobileNav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")}))}
document.querySelectorAll("[data-scroll-demo]").forEach(btn=>btn.addEventListener("click",()=>document.getElementById("demo")?.scrollIntoView({behavior:"smooth",block:"start"})));
const demoMessages=document.getElementById("demoMessages"),demoInput=document.getElementById("demoInput"),demoForm=document.getElementById("demoForm");
const state={industry:null,lastIntent:null,profile:{company:null,website:null,location:null,needs:[],service:null,budget:null},turns:0};
const industryLabels={RESTAURANT:"Restaurant",HOTEL:"Hotel",AUTOHAUS:"Autohaus",REAL_ESTATE:"Immobilienunternehmen",LAW_FIRM:"Kanzlei",DENTAL:"Zahnarztpraxis",FITNESS:"Fitnessstudio",TAX_ADVISOR:"Steuerberatung",CRAFT:"Handwerksbetrieb",SHK:"SHK-/Sanitär- und Heizungsbetrieb",AGENCY:"Dienstleistungsunternehmen"};

const intents=[
{id:"PRICE",p:["was kostet","wieviel kostet","wie viel kostet","preis","preise","kosten","monatlich","einmalig","basic","pro","enterprise"]},
{id:"FEATURES",p:["was kann","funktionen","feature","kann cora","fähigkeiten","faehigkeiten","möglichkeiten","moeglichkeiten"]},
{id:"LEAD",p:["lead","anfrage erfassen","anfragen erfassen","kontaktdaten","qualifizieren","vorqualifizieren","interessent","anfrage aufnehmen"]},
{id:"SETUP",p:["einrichten","eingerichtet","einbindung","installieren","website einbinden","implementierung","aufsetzen"]},
{id:"HOW_IT_WORKS",p:["wie funktioniert","wie arbeitet","wie läuft","wie laeuft","ablauf","prozess"]},
{id:"PRIVACY",p:["dsgvo","datenschutz","personenbezogene daten","datenverarbeitung","datensicherheit"]},
{id:"INTEGRATIONS",p:["crm","kalender","calendar","schnittstelle","api","hubspot","salesforce","pipedrive","zapier","n8n","google sheets"]},
{id:"DEMO",p:["demo","ausprobieren","testen","test"]},
{id:"PURCHASE",p:["kaufen","buchen","bestellen","angebot","beauftragen","starten"]},
{id:"CONTACT",p:["kontakt","mensch sprechen","mit jemandem","rückruf","rueckruf","berater"]},
{id:"INDUSTRIES",p:["welche branche","welche branchen","für wen","fuer wen","geeignet"]},
{id:"RESTAURANT",p:["restaurant","reservierung","reservierungen","speisekarte","tisch","gastronomie"]},
{id:"HOTEL",p:["hotel","zimmer","check-in","check in","frühstück","fruehstueck","gäste"]},
{id:"AUTOHAUS",p:["autohaus","fahrzeug","fahrzeuge","probefahrt","werkstatt","fahrzeuganfrage","autohändler"]},
{id:"REAL_ESTATE",p:["immobilien","immobilie","makler","besichtigung","mietwohnung","kaufinteresse"]},
{id:"LAW_FIRM",p:["rechtsanwalt","kanzlei","anwalt","mandat"]},
{id:"DENTAL",p:["zahnarzt","zahn","zahnarztpraxis","behandlung","zahnschmerzen"]},
{id:"FITNESS",p:["fitness","fitnessstudio","mitgliedschaft","probetraining","kurs"]},
{id:"TAX_ADVISOR",p:["steuerberater","steuerberatung","steuerkanzlei"]},
{id:"SHK",p:["sanitär","sanitaer","heizung","heizungsbau","heizungsbauer","heizungstechnik","shk","wärmepumpe","waermepumpe","klima","klimatechnik","bad","badsanierung","wasserinstallation","gasinstallation"]},
{id:"CRAFT",p:["handwerk","handwerker","meisterbetrieb","projektanfrage","elektriker","maler","installateur","bauunternehmen"]}];

const responses={
PRICE:()=>{if(state.industry==="SHK")return "Für Ihren SHK-/Heizungsbetrieb stehen aktuell Cora Basic und Pro zur Verfügung: Basic kostet 895 € einmalig + 495 € monatlich, Pro 1.495 € einmalig + 895 € monatlich. Enterprise wird individuell kalkuliert. Die passende Variante hängt vor allem davon ab, wie umfangreich Ihre Website, Lead-Erfassung und gewünschten Prozesse sind.";return "Cora Basic kostet 895 € einmalig + 495 € monatlich. Cora Pro kostet 1.495 € einmalig + 895 € monatlich. Enterprise wird individuell kalkuliert."},
FEATURES:()=> "Cora kann Website-Besucher rund um die Uhr zu Ihren Leistungen informieren, wiederkehrende Fragen beantworten, Anliegen einordnen und qualifizierte Anfragen vorbereiten. Je nach Setup kann sie Kontaktdaten und Projektdetails strukturiert erfassen und an Ihren gewünschten Prozess weitergeben.",
LEAD:()=> "Ja. Cora kann aus einem allgemeinen Website-Besucher Schritt für Schritt eine strukturierte Anfrage machen – zum Beispiel mit Name, Kontakt, Anliegen, gewünschter Leistung, Terminwunsch und weiteren für Ihr Unternehmen relevanten Angaben. Welche Felder abgefragt werden, wird individuell festgelegt.",
SETUP:()=> "Beim Setup wird Cora auf Ihr Unternehmen zugeschnitten: Unternehmenswissen, Leistungen, FAQ, Tonalität, Gesprächslogik, Lead-Felder und gewünschte Weiterleitungen werden definiert. Anschließend wird der Assistent in Ihre bestehende Website eingebunden.",
HOW_IT_WORKS:()=> "Cora verbindet Wissensvermittlung und Lead-Erfassung: Ein Besucher stellt eine Frage, Cora erkennt das Anliegen, antwortet mit den hinterlegten Informationen und kann bei erkennbarem Interesse gezielt zur nächsten sinnvollen Frage führen – statt jedem Besucher dasselbe Formular vorzusetzen.",
PRIVACY:()=> "Die Datenschutzbewertung hängt vom konkreten Einsatzfall, den verarbeiteten Daten, eingesetzten Anbietern, Speicherorten und der technischen Integration ab. Cora kann datenschutzorientiert konfiguriert werden; eine pauschale DSGVO-Rechtsgarantie wäre nicht seriös.",
INTEGRATIONS:()=> "Cora kann je nach Projekt mit Formularen, CRM-Systemen, Kalendern oder Automatisierungsprozessen verbunden werden. Welche Integration sinnvoll ist, hängt von Ihrer vorhandenen Infrastruktur ab. Diese Demo selbst simuliert keine nicht vorhandenen Schnittstellen.",
DEMO:()=> "Sie können sich hier frei austoben. Fragen Sie mich zum Beispiel nach Preisen, Funktionen, Einrichtung, Datenschutz oder einer konkreten Branche. Sie können auch einen eigenen Anwendungsfall beschreiben – etwa „Wir sind ein SHK-Betrieb und bekommen viele Anfragen zu Wärmepumpen“.",
PURCHASE:()=> "Gerne. Für ein konkretes Angebot sind Unternehmen, Website, Branche und gewünschter Einsatz hilfreich. Wenn Sie mir Ihren Anwendungsfall beschreiben, kann ich zuerst zeigen, wie Cora dafür eingesetzt werden könnte.",
CONTACT:()=> "Sie können das Anfrageformular auf dieser Seite nutzen. Wenn Sie mir vorher Branche und Anwendungsfall nennen, kann Cora die Anfrage bereits inhaltlich vorbereiten.",
INDUSTRIES:()=> "Cora ist besonders für Unternehmen interessant, bei denen Website-Besucher häufig dieselben Fragen stellen oder Leistungen erklärungsbedürftig sind – darunter Mittelstand, Handwerk, SHK, Hotels, Restaurants, Immobilien, Autohäuser, Kanzleien, Praxen, Fitness und Beratung.",
RESTAURANT:()=> "Für ein Restaurant kann Cora beispielsweise Öffnungszeiten, Speisekarte, Standort und häufige Fragen beantworten, Reservierungswünsche aufnehmen und bei Interesse Kontaktdaten bzw. gewünschte Zeit oder Personenzahl erfassen. Eine echte Reservierung hängt vom angebundenen System ab.",
HOTEL:()=> "Für ein Hotel kann Cora Fragen zu Zimmern, Ausstattung, Lage, Anreise, Frühstück und Buchungsanfragen beantworten. Bei Interesse kann sie beispielsweise Reisedaten und Kontaktdaten strukturiert aufnehmen. Eine tatsächliche Buchung benötigt die entsprechende Integration.",
AUTOHAUS:()=> "Für ein Autohaus kann Cora Fahrzeug-, Service- und Werkstattfragen beantworten, Probefahrt- oder Rückrufwünsche aufnehmen und Interessenten nach Fahrzeug, Anliegen und Kontaktdaten fragen.",
REAL_ESTATE:()=> "Für Immobilienunternehmen kann Cora Objektfragen beantworten und Interessenten beispielsweise nach Kauf oder Miete, Budget, Suchprofil und Besichtigungswunsch fragen.",
LAW_FIRM:()=> "Für Kanzleien kann Cora allgemeine Informationen zu Fachgebieten, Kontakt und Erstgespräch geben und Anfragen strukturiert aufnehmen. Individuelle Rechtsberatung sollte sie nicht vortäuschen.",
DENTAL:()=> "Für Zahnarztpraxen kann Cora Praxisinformationen und Leistungen erklären und Terminwünsche strukturiert aufnehmen. Medizinische Diagnosen oder individuelle Behandlungsempfehlungen sollte sie nicht vortäuschen.",
FITNESS:()=> "Für Fitnessstudios kann Cora Mitgliedschaft, Kurse, Öffnungszeiten und Probetraining erklären und Interessenten strukturiert aufnehmen.",
TAX_ADVISOR:()=> "Für Steuerberatungen kann Cora Leistungen erklären, allgemeine Erstinformationen geben und Termin- oder Kontaktanfragen strukturieren. Individuelle Steuerberatung sollte sie nicht ersetzen.",
SHK:()=> "Für einen Sanitär-/Heizungsbetrieb kann Cora besonders wertvoll sein, weil viele Website-Anfragen wiederkehrende Muster haben. Sie kann zum Beispiel Fragen zu Heizungsmodernisierung, Wärmepumpe, Sanitärarbeiten, Badsanierung, Wartung, Reparaturen, Klima- oder Wasserinstallationen beantworten. Bei einem konkreten Projekt kann sie den Interessenten Schritt für Schritt vorqualifizieren – etwa: Welche Leistung wird benötigt? Geht es um Neubau, Modernisierung oder Reparatur? Um welche Immobilie handelt es sich? Wo befindet sich das Objekt? Wie dringend ist die Anfrage? Wie kann der Betrieb zurückrufen? Daraus kann eine deutlich strukturiertere Anfrage entstehen, als nur Name und Telefonnummer einzusammeln.",
CRAFT:()=> "Für Handwerksbetriebe kann Cora Leistungen erklären, Einsatzgebiete abfragen und Projektanfragen strukturiert aufnehmen – beispielsweise Art des Projekts, Objekt, gewünschte Leistung, Zeitraum, Kontaktdaten und Rückrufwunsch."
};

function detectIntent(q){
 const text=q.toLowerCase();
 const scored=intents.map(i=>({id:i.id,score:i.p.reduce((n,k)=>n+(text.includes(k.toLowerCase())?(k.includes(" ")?3:1):0),0)})).sort((a,b)=>b.score-a.score);
 return scored[0]?.score>0?scored[0].id:"UNKNOWN";
}
function extractProfile(q){
 const t=q.toLowerCase();
 if(/sanitär|sanitaer|heizung|heizungsbau|heizungsbauer|heizungstechnik|shk|wärmepumpe|waermepumpe/.test(t))state.industry="SHK";
 if(/restaurant|gastronomie/.test(t))state.industry="RESTAURANT";
 if(/hotel/.test(t))state.industry="HOTEL";
 if(/autohaus|autohändler/.test(t))state.industry="AUTOHAUS";
 if(/immobilien|makler/.test(t))state.industry="REAL_ESTATE";
 if(/kanzlei|rechtsanwalt|anwalt/.test(t))state.industry="LAW_FIRM";
 if(/zahnarzt|zahnarztpraxis/.test(t))state.industry="DENTAL";
 if(/fitnessstudio|fitness/.test(t))state.industry="FITNESS";
 if(/steuerberater|steuerkanzlei/.test(t))state.industry="TAX_ADVISOR";
 if(/handwerk|handwerker|meisterbetrieb|elektriker|maler/.test(t)&&!state.industry)state.industry="CRAFT";
 if(/wärmepumpe|waermepumpe/.test(t))state.profile.needs.push("Wärmepumpe");
 if(/badsanierung|bad/.test(t))state.profile.needs.push("Badsanierung");
 if(/wartung|wartungsanfrage/.test(t))state.profile.needs.push("Wartung");
 if(/reparatur|störung|stoerung|defekt/.test(t))state.profile.needs.push("Reparatur");
}
function updateContext(q,intent){extractProfile(q);state.lastIntent=intent;state.turns++;}
function getAnswer(q){
 const intent=detectIntent(q);updateContext(q,intent);
 if(intent==="PRICE"||intent==="FEATURES"||intent==="LEAD"||intent==="SETUP"||intent==="HOW_IT_WORKS"||intent==="PRIVACY"||intent==="INTEGRATIONS"||intent==="DEMO"||intent==="PURCHASE"||intent==="CONTACT"||intent==="INDUSTRIES")return responses[intent]();
 if(industryLabels[intent]){state.industry=intent;return responses[intent]();}
 if(state.industry==="SHK")return responses.SHK();
 if(state.industry)return responses[state.industry]();
 return "Erzählen Sie mir kurz, was Ihr Unternehmen macht und welche Anfragen Sie über die Website erhalten. Dann kann ich Ihnen konkret zeigen, wie Cora eingesetzt werden könnte.";
}

;