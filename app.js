(() => {
"use strict";
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzDrLyFEsCVSVqLphU7fiCrNo_slakHFf6R8JSHvqT-5Lr6Y5uxyBQbNshS0uzUXSHa/exec";
const menuBtn=document.getElementById("menuBtn"),mobileNav=document.getElementById("mobileNav");
if(menuBtn&&mobileNav){menuBtn.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.setAttribute("aria-label",open?"Menü schließen":"Menü öffnen")});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mobileNav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")}))}
document.querySelectorAll("[data-scroll-demo]").forEach(btn=>btn.addEventListener("click",()=>document.getElementById("demo")?.scrollIntoView({behavior:"smooth",block:"start"})));
const demoMessages=document.getElementById("demoMessages"),demoInput=document.getElementById("demoInput"),demoForm=document.getElementById("demoForm");
const state={industry:null,lastIntent:null};
const industryLabels={RESTAURANT:"Restaurant",HOTEL:"Hotel",AUTOHAUS:"Autohaus",REAL_ESTATE:"Immobilienunternehmen",LAW_FIRM:"Kanzlei",DENTAL:"Zahnarztpraxis",FITNESS:"Fitnessstudio",TAX_ADVISOR:"Steuerberatung",CRAFT:"Handwerksbetrieb"};
const intents=[
{id:"PRICE",p:["was kostet","wieviel kostet","wie viel kostet","preis","preise","kosten","monatlich","basic","pro","enterprise"]},
{id:"FEATURES",p:["was kann","funktionen","feature","kann cora","fähigkeiten","faehigkeiten"]},
{id:"LEAD",p:["lead","anfrage erfassen","anfragen erfassen","kontaktdaten","qualifizieren","vorqualifizieren","interessent"]},
{id:"SETUP",p:["einrichten","eingerichtet","einbindung","installieren","website einbinden","implementierung"]},
{id:"HOW_IT_WORKS",p:["wie funktioniert","wie arbeitet","wie läuft","wie laeuft","ablauf","prozess"]},
{id:"PRIVACY",p:["dsgvo","datenschutz","personenbezogene daten","datenverarbeitung","datensicherheit"]},
{id:"INTEGRATIONS",p:["crm","kalender","calendar","schnittstelle","api","hubspot","salesforce","pipedrive","zapier","n8n"]},
{id:"DEMO",p:["demo","ausprobieren","testen","test"]},
{id:"PURCHASE",p:["kaufen","buchen","bestellen","angebot","beauftragen","starten"]},
{id:"CONTACT",p:["kontakt","mensch sprechen","mit jemandem","rückruf","rueckruf","berater"]},
{id:"INDUSTRIES",p:["welche branche","welche branchen","für wen","fuer wen","geeignet"]},
{id:"RESTAURANT",p:["restaurant","reservierung","reservierungen","speisekarte","tisch"]},
{id:"HOTEL",p:["hotel","zimmer","check-in","check in","frühstück","fruehstueck","gäste"]},
{id:"AUTOHAUS",p:["autohaus","fahrzeug","fahrzeuge","probefahrt","werkstatt","fahrzeuganfrage"]},
{id:"REAL_ESTATE",p:["immobilien","immobilie","makler","besichtigung","mietwohnung","kaufinteresse"]},
{id:"LAW_FIRM",p:["rechtsanwalt","kanzlei","anwalt","mandat"]},
{id:"DENTAL",p:["zahnarzt","zahn","zahnarztpraxis","behandlung","zahnschmerzen"]},
{id:"FITNESS",p:["fitness","fitnessstudio","mitgliedschaft","probetraining","kurs"]},
{id:"TAX_ADVISOR",p:["steuerberater","steuerberatung","steuerkanzlei"]},
{id:"CRAFT",p:["handwerk","handwerker","meisterbetrieb","projektanfrage","elektriker","maler"]}];
const responses={
PRICE:()=>state.industry?"Für "+industryLabels[state.industry]+" können Sie mit Cora Basic oder Pro starten: Basic kostet 895 € einmalig + 495 € monatlich, Pro 1.495 € einmalig + 895 € monatlich. Enterprise wird individuell kalkuliert.":"Cora Basic kostet 895 € einmalig + 495 € monatlich. Cora Pro kostet 1.495 € einmalig + 895 € monatlich. Enterprise wird individuell kalkuliert.",
FEATURES:()=>"Cora kann Website-Besucher informieren, wiederkehrende Fragen beantworten, Leistungen erklären, Anfragen strukturieren und – je nach Setup – Leads erfassen und qualifizieren.",
LEAD:()=>"Ja. Cora kann Besucher durch relevante Fragen führen und – abhängig vom vereinbarten Setup – Kontaktdaten und Anliegen strukturiert aufnehmen.",
SETUP:()=>"Bei der Einrichtung werden Unternehmenswissen, Tonalität, Gesprächsführung und der gewünschte Lead-Prozess auf den konkreten Einsatzfall abgestimmt. Die technische Einbindung wird an die bestehende Website angepasst.",
HOW_IT_WORKS:()=>"Cora sitzt als Webassistent auf Ihrer Website. Ein Besucher stellt eine Frage, Cora ordnet das Anliegen ein, antwortet mit dem hinterlegten Unternehmenswissen und kann bei Bedarf Informationen für eine Anfrage erfassen.",
PRIVACY:()=>"Die Datenschutzbewertung hängt vom konkreten Einsatzfall, den verarbeiteten Daten, eingesetzten Anbietern, Speicherorten und der technischen Integration ab. Cora kann datenschutzorientiert konfiguriert werden; eine pauschale Rechtsgarantie wäre nicht seriös.",
INTEGRATIONS:()=>"Integrationen können je nach Setup CRM-, Formular-, Kalender- oder Automatisierungsprozesse betreffen. Welche Schnittstelle sinnvoll ist, hängt vom bestehenden System ab. Nicht jede Integration ist in dieser Demo bereits aktiv.",
DEMO:()=>"Sie befinden sich bereits in der Cora-Demo. Testen Sie zum Beispiel „Was kostet Cora?“, „Kann Cora Leads erfassen?“, „Ich habe ein Autohaus“ oder „Wie wird Cora eingerichtet?“",
PURCHASE:()=>"Gerne. Der nächste sinnvolle Schritt ist eine Anfrage mit Unternehmen, Website, Branche und gewünschtem Einsatz. Danach kann Ace AI Agents das passende Cora-Setup prüfen.",
CONTACT:()=>"Sie können über das Anfrageformular auf dieser Seite Kontakt aufnehmen. Wenn Sie vorher Branche und Anwendungsfall nennen, kann die Anfrage gezielter vorbereitet werden.",
INDUSTRIES:()=>"Cora kann besonders für Mittelstand und Dienstleister, Handwerk, Hotels, Restaurants, Immobilien, Beratung und weitere Unternehmen mit wiederkehrenden Website-Fragen interessant sein.",
RESTAURANT:()=>"Für Restaurants kann Cora Fragen zu Öffnungszeiten, Angebot, Standort und Reservierungsanfragen abfangen. Tatsächliche Reservierungen hängen von der jeweiligen Integration ab.",
HOTEL:()=>"Für Hotels kann Cora Fragen zu Zimmern, Ausstattung, Lage, Anreise, Frühstück und Buchungsanfragen beantworten. Eine tatsächliche Buchung hängt von der jeweiligen Integration ab.",
AUTOHAUS:()=>"Für Autohäuser kann Cora Fahrzeug- und Servicefragen beantworten, Probefahrt- oder Werkstattanfragen strukturieren und Rückrufwünsche erfassen.",
REAL_ESTATE:()=>"Für Immobilienunternehmen kann Cora Interessenten zu Objekten informieren und Suchprofil, Budget oder Besichtigungswunsch strukturiert aufnehmen.",
LAW_FIRM:()=>"Für Kanzleien kann Cora allgemeine Informationen zu Fachgebieten, Kontakt und Erstgespräch bereitstellen. Individuelle Rechtsberatung sollte Cora nicht vortäuschen.",
DENTAL:()=>"Für Zahnarztpraxen kann Cora Praxisinformationen, Leistungen und Terminwünsche abfangen. Medizinische Diagnosen sollte Cora nicht vortäuschen.",
FITNESS:()=>"Für Fitnessstudios kann Cora Fragen zu Mitgliedschaft, Kursen, Öffnungszeiten und Probetraining beantworten und Interessenten strukturiert aufnehmen.",
TAX_ADVISOR:()=>"Für Steuerberatungen kann Cora Leistungen erklären, allgemeine Erstinformationen geben und Anfragen oder Terminwünsche strukturieren. Individuelle Steuerberatung sollte Cora nicht ersetzen.",
CRAFT:()=>"Für Handwerksbetriebe kann Cora Leistungen erklären und Projektanfragen mit Angaben wie Projektart, Kontaktdaten und Rückrufwunsch strukturiert aufnehmen."
};
function detectIntent(q){const text=q.toLowerCase();const scored=intents.map(i=>({id:i.id,score:i.p.reduce((n,k)=>n+(text.includes(k.toLowerCase())?(k.includes(" ")?3:1):0),0)})).sort((a,b)=>b.score-a.score);return scored[0]?.score>0?scored[0].id:"UNKNOWN";}
function updateContext(q,intent){if(industryLabels[intent])state.industry=intent;state.lastIntent=intent;}
function getAnswer(q){const intent=detectIntent(q);updateContext(q,intent);if(intent==="UNKNOWN")return "Damit ich gezielt antworte: Geht es um Funktionen, Preise, Einrichtung, Datenschutz, eine bestimmte Branche oder darum, Cora für Ihr Unternehmen einzusetzen?";return responses[intent]?responses[intent]():responses.FEATURES();})();