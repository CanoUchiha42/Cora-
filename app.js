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
 conversation:{questionCount:0,leadMode:false,packageMode:false,packageQuestionCount:0}
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

const packageGuidance={
 BASIC:"Basic eignet sich besonders, wenn Cora vor allem als Webchat für Unternehmenswissen, häufige Fragen und eine einfache Lead-Erfassung eingesetzt werden soll.",
 PRO:"Pro ist in der Regel das umfassendere Paket, wenn Cora aktiv Gespräche führen, Interessenten qualifizieren, mehrere Gesprächswege abbilden und den Lead-Prozess stärker auf den Betrieb zuschneiden soll.",
 ENTERPRISE:"Enterprise ist für individuelle oder komplexere Anforderungen gedacht, etwa besondere Integrationen, mehrere Standorte, umfangreichere Prozesse oder einen individuell definierten Leistungsumfang."
};

function packageRecommendation(industry){
 const label=industryLabels[industry]||"Unternehmen";
 if(industry==="SHK"){
  state.stage="package";
  state.conversation.packageMode=true;
  state.conversation.packageQuestionCount=1;
  return "Für einen Heizungsbetrieb ist Pro zunächst die naheliegende Ausgangsbasis, wenn Cora nicht nur Fragen beantworten, sondern Interessenten aktiv aufnehmen und vorqualifizieren soll.\n\nBasic kann bereits sinnvoll sein, wenn hauptsächlich Webchat, Unternehmenswissen, FAQs und einfache Anfrageerfassung benötigt werden. Enterprise würde ich erst bei wirklich komplexen individuellen Anforderungen prüfen.\n\nDamit ich die Einordnung für Ihren Betrieb besser treffen kann, gehen wir kurz Schritt für Schritt vor.\n\n1. Wie viele Standorte oder Betriebe sollen Cora nutzen?";
 }
 return "Für Ihre "+label+" ist Pro zunächst eine naheliegende Ausgangsbasis, wenn Cora aktiv Gespräche führen und Leads qualifizieren soll. Basic kann bereits sehr gute Ergebnisse liefern, wenn Webchat, Unternehmenswissen, FAQs und einfache Anfrageerfassung im Mittelpunkt stehen. Enterprise prüfen wir erst bei komplexen individuellen Anforderungen.\n\nDamit die Einordnung nicht pauschal erfolgt, können wir kurz Ihren konkreten Einsatz, die gewünschten Gesprächswege, Lead-Felder, Integrationen und den Umfang prüfen. Danach führen wir Sie Schritt für Schritt zum Anfrageformular und zu einem persönlichen Beratungsgespräch.";
}

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
  intro:"Für ein Autohaus kann Cora Besucher nicht nur über Fahrzeuge informieren, sondern ihr konkretes Anliegen erkennen und daraus einen verwertbaren Verkaufs-, Probefahrt- oder Service-Lead entwickeln. Der Dialog richtet sich dabei nach dem, was der Besucher tatsächlich fragt.",
  capabilities:["Fahrzeugmodelle, Ausstattung und verfügbare Leistungen erklären","Kauf-, Leasing- und Finanzierungsinteresse vorstrukturieren","Marke, Modell, Fahrzeugtyp und gewünschte Ausstattung erfassen","Budget, Anzahlung oder gewünschte monatliche Rate als freiwillige Qualifizierungsangabe aufnehmen","Neu- oder Gebrauchtwageninteresse unterscheiden","Probefahrt- und Beratungstermine vorbereiten","Inzahlungnahme und Fahrzeugwechsel als Anliegen erkennen","Werkstatt-, Inspektions- und Serviceanfragen aufnehmen","Rückruf-, Angebots- und Kontaktwünsche strukturieren"],
  flow:["Was suchen Sie konkret – ein bestimmtes Modell, ein Fahrzeug in einer bestimmten Preisklasse oder zunächst eine Beratung?","Geht es um Kauf, Leasing, Finanzierung, Probefahrt, Inzahlungnahme oder Service?","Welche Anforderungen sind Ihnen wichtig, zum Beispiel Budget, Fahrzeugart, Antrieb oder Ausstattung?","Wann möchten Sie das Fahrzeug ungefähr kaufen oder einen Termin wahrnehmen?","Wie können wir Sie für die weitere Beratung erreichen?"],
  lead:"Am Ende kann Cora die Angaben als kompakte Anfrage zusammenfassen, damit der Vertrieb nicht bei null anfangen muss."
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

function startLeadFlow(){
 const data=industryResponses[state.industry];
 if(!data)return null;
 state.stage="lead";
 state.conversation.leadMode=true;
 state.conversation.questionCount=1;
 return "Dann machen wir es konkret. Ich führe Sie Schritt für Schritt durch die Anfrage und stelle jeweils nur die nächste sinnvolle Frage.\n\n"+data.flow[0];
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
 const leadQuestion=data.flow[0];
 return data.intro+"\n\nCora kann unter anderem:\n• "+data.capabilities.join("\n• ")+"\n\nFür eine echte Demo würde ich aber nicht bei einer Funktionsliste stehen bleiben. Ich würde direkt mit der Qualifizierung beginnen:\n\n"+leadQuestion;
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

 if(/welches paket|welches produkt|was passt|welcher tarif|basic|pro|enterprise|geeignetsten|geeignetste|am besten|empfehl/.test(t)){
  return packageRecommendation(state.industry);
 }

 if(/roi|rentabil|rendite|mehrumsatz|umsatz|lohnt sich/.test(t)){
  return "Ja. Der ROI-Rechner ist auch für Immobilienmakler sinnvoll, wenn Sie ihn als Szenario für zusätzliche qualifizierte Anfragen betrachten. Entscheidend sind vor allem Website-Besucher, aktuelle Anfragequote, Abschlussquote und der durchschnittliche wirtschaftliche Wert einer erfolgreichen Vermittlung.\\n\\nDer Rechner ist keine Umsatzgarantie. Er zeigt rechnerisch, wie sich eine angenommene zusätzliche Anfragequote auf potenzielle Anfragen und Umsatz auswirken kann.\\n\\n→ Öffnen Sie den Bereich „ROI-Rechner“ und tragen Sie Ihre eigenen Werte ein. Wenn Sie möchten, können wir Ihren konkreten Fall danach gemeinsam einordnen.";
 }
 if(/preis|kosten|monatlich|einmalig/.test(t))return responses.PRICE();

 if(/dsgvo|datenschutz|daten/.test(t))return responses.PRIVACY();

 if(/wie bekomme ich|bekomme ich cora|cora bekommen|cora kaufen|cora buchen|beauftragen|starten/.test(t)){
  state.stage="contact";
  return "Wenn Sie Cora für Ihr Immobilienunternehmen einsetzen möchten, starten wir mit Ihrem konkreten Ziel. Das kann zum Beispiel die Gewinnung und Vorqualifizierung von Kaufinteressenten, Mietinteressenten, Besichtigungsanfragen, Eigentümeranfragen oder konkreten Objektanfragen sein.\\n\\nDanach werden Gesprächslogik, relevante Lead-Daten und der gewünschte Übergabeprozess festgelegt.\\n\\nDer nächste Schritt ist jetzt das Formular „Cora anfragen“. Hinterlassen Sie dort Name, Unternehmen, E-Mail, Website und kurz, welche Anfragen Cora für Sie gewinnen oder vorqualifizieren soll. Im persönlichen Gespräch klären wir anschließend den passenden Umfang und das passende Paket.";
 }

 if(/integration|crm|kalender|schnittstelle|api|n8n|salesforce|hubspot|pipedrive/.test(t)){
  return "Je nach gewünschtem Setup können z. B. CRM, Kalender, Formulare oder Automatisierungen angebunden werden. Für "+industryLabels[state.industry]+" wäre entscheidend, wohin qualifizierte Anfragen anschließend gehen sollen.\n\nMögliche Varianten:\n• Anfrage direkt an Ihr Team\n• Formular/Lead-Tabelle\n• CRM-Übergabe\n• Terminprozess\n• individuelle Automatisierung\n\nWelche Systeme oder Prozesse nutzen Sie heute?";
 }

 if(/wie|warum|konkret|beispiel|genau|ablauf/.test(t)&&/fragen|gespraech|qualifiz|kunden|interessent|lead|funktion/.test(t)){
  return "Der Lead-Fokus funktioniert kontextabhängig: Cora gibt zuerst eine kurze Antwort, erkennt danach das Anliegen und stellt nur die nächste sinnvolle Frage. Für "+industryLabels[state.industry]+" kann das so aussehen:\n\n"+data.flow.map((x,i)=>(i+1)+". "+x).join("\n")+"\n\nJe nach Antwort kann Cora Fragen überspringen, vertiefen oder direkt auf Kontaktaufnahme wechseln. Am Ende steht eine strukturierte Anfrage statt eines beliebigen Chatverlaufs.";
 }

 if(/mach|spiel|simulier|testen|durchspielen/.test(t)){
  return startLeadFlow();
 }

 if(/lead|anfrage|kontakt|kunden gewinnen|qualifiz/.test(t)){
  return startLeadFlow();
 }

 // Context-sensitive examples give visitors several natural ways to continue.
 const prompts={
  SHK:"Zum Beispiel können Sie antworten mit: „Wärmepumpe für ein Einfamilienhaus“, „Heizung defekt“, „Badsanierung geplant“ oder „Ich möchte ein Angebot“.",
  FITNESS:"Zum Beispiel: „Ich möchte abnehmen“, „Ich will ein Probetraining“, „Was kostet die Mitgliedschaft?“ oder „Ich suche Personal Training“.",
  RESTAURANT:"Zum Beispiel: „Ich möchte für 6 Personen reservieren“, „Wir planen eine Feier“, „Habt ihr vegetarische Optionen?“ oder „Welche Öffnungszeiten habt ihr?“",
  HOTEL:"Zum Beispiel: „Ich suche ein Doppelzimmer“, „Wir reisen mit Kindern“, „Ich möchte ein Zimmer für ein Wochenende“ oder „Wie funktioniert der Check-in?“",
  AUTOHAUS:"Zum Beispiel: „Ich interessiere mich für einen BMW“, „Ich möchte eine Probefahrt“, „Ich suche Leasing“ oder „Ich brauche einen Werkstatttermin“.",
  REAL_ESTATE:"Zum Beispiel: „Ich suche eine Wohnung“, „Ich möchte eine Immobilie kaufen“, „Ich will eine Besichtigung“ oder „Mein Budget liegt bei 400.000 €“.",
  LAW_FIRM:"Zum Beispiel: „Ich brauche einen Anwalt“, „Es geht um Arbeitsrecht“, „Ich möchte ein Erstgespräch“ oder „Ich möchte zurückgerufen werden“.",
  DENTAL:"Zum Beispiel: „Ich brauche einen Termin“, „Ich bin Neupatient“, „Ich habe eine allgemeine Frage“ oder „Ich möchte eine Behandlung anfragen“.",
  TAX_ADVISOR:"Zum Beispiel: „Ich bin Unternehmer“, „Ich brauche Unterstützung bei der Buchhaltung“, „Ich suche einen Steuerberater“ oder „Ich möchte ein Erstgespräch“.",
  CRAFT:"Zum Beispiel: „Ich brauche einen Elektriker“, „Wir planen eine Renovierung“, „Ich möchte ein Angebot“ oder „Es geht um eine Reparatur“."
 };
 return data.intro+"\n\n"+data.lead+"\n\nSie können frei antworten. "+(prompts[state.industry]||"Beschreiben Sie einfach Ihr Anliegen, Ziel oder Ihre gewünschte Leistung.")+"\n\nWenn echtes Interesse erkennbar ist, wechselt Cora automatisch in die Lead-Qualifizierung.";
}

const responses={
 PRICE:()=> "Cora Basic: 895 € einmalig + 495 €/Monat. Cora Pro: 1.495 € einmalig + 895 €/Monat. Enterprise: individuell.\n\nBasic passt, wenn Webchat, Unternehmenswissen, FAQs und einfache Lead-Erfassung im Mittelpunkt stehen. Pro ist umfassender für aktive Gesprächsführung, Lead-Qualifizierung und mehrere Gesprächswege. Enterprise prüfen wir bei komplexen individuellen Anforderungen. Die genaue Einordnung erfolgt am besten im kurzen Beratungsgespräch.",
 FEATURES:()=> state.industry?contextualIndustryResponse():"Cora beantwortet nicht nur FAQs. Sie kann Unternehmenswissen erklären, Anliegen erkennen, Gespräche führen, Rückfragen stellen, Interessenten qualifizieren und – je nach Setup – strukturierte Leads an den gewünschten Prozess übergeben.",
 LEAD:()=> state.industry?answerIndustry("lead"): "Cora kann Interessenten Schritt für Schritt qualifizieren: Anliegen erkennen, relevante Rückfragen stellen, Kontaktdaten aufnehmen und die Anfrage strukturiert weitergeben.",
 SETUP:()=> "Der Prozess läuft typischerweise in sechs Schritten: 1. Website und Ziel prüfen. 2. Leistungen, FAQ und Unternehmenswissen strukturieren. 3. Gesprächslogik und Lead-Felder festlegen. 4. Cora konfigurieren und testen. 5. Auf der Website einbinden. 6. Nach dem Start Gespräche und Leads auswerten und den Ablauf optimieren.",
 HOW_IT_WORKS:()=> "Cora arbeitet als dialogorientierter Webassistent. Sie ordnet die Nachricht ein, berücksichtigt den bisherigen Gesprächskontext, antwortet passend zum Unternehmen und entscheidet, ob eine Information, Rückfrage oder Lead-Qualifizierung als nächster Schritt sinnvoll ist. Bei einem SHK-Betrieb kann das zum Beispiel von 'Ich brauche eine neue Heizung' über Objekt, Leistung und Zeitraum bis zur konkreten Rückrufanfrage führen.",
 PRIVACY:()=> "Datenschutz hängt vom konkreten Einsatz, den Daten, Anbietern, Speicherorten und der technischen Integration ab. Cora kann datenschutzorientiert konfiguriert werden; eine pauschale Rechtsgarantie wäre nicht seriös.",
 INTEGRATIONS:()=> "Je nach Projekt können Formulare, CRM, Kalender und Automatisierungsprozesse angebunden werden. Diese Demo behauptet keine Schnittstelle als aktiv, wenn sie nicht tatsächlich implementiert ist.",
 PURCHASE:()=> "Wenn Sie Cora ernsthaft einsetzen möchten, ist der nächste sinnvolle Schritt ein kurzes Beratungsgespräch. Dabei klären wir Website, Branche, Ziele, gewünschte Lead-Daten und den passenden Umfang. Wenn Sie mir Name, Unternehmen, E-Mail und Website hinterlassen, kann die Anfrage direkt strukturiert weiterbearbeitet werden.",
 CONTACT:()=> "Der schnellste nächste Schritt ist ein kurzes Beratungsgespräch. Hinterlassen Sie dafür im Anfrageformular Name, Unternehmen, E-Mail, Website und Ihr Ziel mit Cora. So können wir bereits vor dem Gespräch einschätzen, ob Basic, Pro oder ein individueller Enterprise-Aufbau sinnvoll ist.",
 INDUSTRIES:()=> "Cora lässt sich auf unterschiedliche Geschäftsmodelle zuschneiden, unter anderem Fitness, SHK, Handwerk, Gastronomie, Hotels, Autohäuser, Immobilien, Kanzleien, Praxen und Steuerberatung."
};

function getAnswer(q){
 state.turns++;
 extractProfile(q);
 const intent=detectIntent(q);
 state.lastIntent=intent;

 if(state.conversation.packageMode&&state.industry==="SHK"){
  const t=normalize(q);
  if(!/preis|kosten|dsgvo|datenschutz|integration|setup|einrichten/.test(t)){
   const n=state.conversation.packageQuestionCount++;
   if(n===2) return "Danke. Das hilft.\n\n2. Was soll Cora auf Ihrer Website hauptsächlich übernehmen: eher FAQs und einfache Anfragen oder aktiv Leads qualifizieren, Projekte vorsortieren und Rückruf-/Angebotsanfragen vorbereiten?";
   if(n===3) return "Verstanden.\n\n3. Brauchen Sie Anbindungen an bestehende Systeme, zum Beispiel CRM, Kalender, Formulare oder andere interne Prozesse?";
   state.conversation.packageMode=false;
   state.stage="discovery";
   state.profile.goal="Paket-/Einsatzqualifizierung";
   return "Auf Basis Ihrer Angaben lässt sich der Einsatz jetzt konkret besprechen. Ich würde daraus noch keine automatische Kaufentscheidung ableiten. Basic ist für einen schlankeren Webchat mit Unternehmenswissen, FAQs und einfacher Lead-Erfassung gedacht. Pro ist umfassender für aktive Gesprächsführung, Qualifizierung und mehrere Gesprächswege. Enterprise kommt bei individuellen, komplexeren Strukturen infrage.\\n\\nIhre bisherige Einordnung kann im Anfrageformular direkt weitergegeben werden. Klicken Sie dort auf „Cora anfragen“ und hinterlassen Sie Name, Unternehmen, E-Mail und kurz Ihren gewünschten Einsatz. Im anschließenden Gespräch können wir den tatsächlichen Umfang gemeinsam festlegen.";
  }
 }
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

 if(state.industry && /wie funktioniert|wie laeuft|ablauf|prozess/.test(normalize(q))){
  const data=industryResponses[state.industry];
  if(data){
   return "Für "+industryLabels[state.industry]+" würde ich den Ablauf nicht mit einer allgemeinen Funktionsliste beginnen. Cora reagiert zuerst auf das konkrete Anliegen, gibt eine kurze fachlich passende Antwort und stellt anschließend genau die nächste Frage, die für die Anfrage relevant ist.\\n\\nTypischer Ablauf:\\n1. Anliegen erkennen\\n2. Relevante Information geben\\n3. Bedarf mit 1–2 gezielten Rückfragen konkretisieren\\n4. Nur notwendige Angaben für den Lead erfassen\\n5. Anfrage zusammenfassen\\n6. Kontaktaufnahme über das Anfrageformular auslösen\\n\\nFür Ihr Unternehmen können Sie jetzt direkt mit einem konkreten Fall starten. Beispiel: „Ich interessiere mich für ein Fahrzeug und möchte wissen, was für mich infrage kommt."";
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


function addDemoMessage(text,type,cta){
 if(!demoMessages)return;
 const wrap=document.createElement("div");
 wrap.className="msg "+type;
 const el=document.createElement("div");
 el.textContent=text;
 wrap.appendChild(el);
 if(cta){
  const button=document.createElement("button");
  button.type="button";
  button.className="demo-cta";
  button.textContent=cta.label;
  button.addEventListener("click",()=>document.getElementById("kontakt")?.scrollIntoView({behavior:"smooth",block:"start"}));
  wrap.appendChild(button);
 }
 demoMessages.appendChild(wrap);
 demoMessages.scrollTop=demoMessages.scrollHeight;
}

function runDemo(q){
 q=String(q||"").trim();
 if(!q||!demoMessages)return;
 addDemoMessage(q,"user");
 setTimeout(()=>{
  const answer=getAnswer(q);
  const wantsForm=/anfrageformular|cora anfragen|hinterlassen sie name|kontaktformular/.test(normalize(answer));
  addDemoMessage(answer,"cora",wantsForm?{label:"Cora-Anfrage starten"}:null);
  if(wantsForm) state.profile.goal=state.profile.goal||"Lead-Anfrage";
 },320);
}

document.querySelectorAll("[data-prompt]").forEach(btn=>{
 btn.addEventListener("click",()=>runDemo(btn.dataset.prompt));
});

demoForm?.addEventListener("submit",e=>{
 e.preventDefault();
 const value=demoInput?.value||"";
 if(!value.trim())return;
 runDemo(value);
 demoInput.value="";
 demoInput.focus();
});

const roiEls={
 visitors:document.getElementById("roiVisitors"),rate:document.getElementById("roiRate"),close:document.getElementById("roiClose"),
 value:document.getElementById("roiValue"),lift:document.getElementById("roiLift"),liftValue:document.getElementById("roiLiftValue"),
 leads:document.getElementById("roiLeads"),revenue:document.getElementById("roiRevenue"),year:document.getElementById("roiYear"),cta:document.getElementById("roiCta")
};
function euro(n){return new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Math.max(0,n));}
function updateROI(){
 if(!roiEls.visitors)return;
 const visitors=Math.max(0,Number(roiEls.visitors.value)||0);
 const rate=Math.max(0,Number(roiEls.rate.value)||0)/100;
 const close=Math.max(0,Number(roiEls.close.value)||0)/100;
 const value=Math.max(0,Number(roiEls.value.value)||0);
 const lift=Math.max(0,Number(roiEls.lift.value)||0)/100;
 const extraLeads=visitors*lift;
 const extraRevenue=extraLeads*close*value;
 if(roiEls.leads)roiEls.leads.textContent=extraLeads.toFixed(1).replace(".",",");
 if(roiEls.revenue)roiEls.revenue.textContent=euro(extraRevenue);
 if(roiEls.year)roiEls.year.textContent=euro(extraRevenue*12);
 if(roiEls.liftValue)roiEls.liftValue.textContent="+"+(lift*100).toFixed(1).replace(".",",")+" %-Punkte";
 if(roiEls.cta){
  roiEls.cta.onclick=()=>{
   const msg=document.querySelector('[name="message"]');
   if(msg)msg.value="Ich habe den Cora ROI-Rechner genutzt. Website-Besucher/Monat: "+visitors+" | Anfragequote aktuell: "+(rate*100).toFixed(1)+"% | Abschlussquote: "+(close*100).toFixed(1)+"% | Auftragswert: "+euro(value)+" | Szenario: +"+(lift*100).toFixed(1)+" Prozentpunkte. Ich möchte dazu ein Beratungsgespräch.";
  };
 }
}
[roiEls.visitors,roiEls.rate,roiEls.close,roiEls.value,roiEls.lift].forEach(el=>el?.addEventListener("input",updateROI));
updateROI();

const leadForm=document.getElementById("leadForm"),status=document.getElementById("formStatus");
leadForm?.addEventListener("submit",async e=>{
 e.preventDefault();
 if(!leadForm.reportValidity())return;
 const hp=leadForm.querySelector('[name="website_check"]');
 if(hp?.value)return;
 const button=leadForm.querySelector('button[type="submit"]');
 const original=button?.innerHTML;
 if(button){button.disabled=true;button.innerHTML="Wird übermittelt …";}
 if(status){status.className="form-status";status.textContent="";}
 const data=new URLSearchParams();
 new FormData(leadForm).forEach((value,key)=>data.append(key,String(value)));
 data.append("source","Cora Website");
 data.append("page",window.location.href);
 data.append("submitted_at_client",new Date().toISOString());
 try{
  await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",body:data});
  leadForm.reset();
  if(status){status.className="form-status success";status.textContent="Ihre Anfrage wurde übermittelt. Vielen Dank.";}
 }catch(error){
  console.error(error);
  if(status){status.className="form-status error";status.textContent="Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut.";}
 }finally{
  if(button){button.disabled=false;button.innerHTML=original||"Cora anfragen";}
 }
});
})();
