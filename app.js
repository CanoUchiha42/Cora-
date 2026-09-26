(() => {
"use strict";
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzDrLyFEsCVSVqLphU7fiCrNo_slakHFf6R8JSHvqT-5Lr6Y5uxyBQbNshS0uzUXSHa/exec";
const $=id=>document.getElementById(id);
const demoMessages=$("demoMessages"),demoInput=$("demoInput"),demoSend=$("demoSend");
const STATE_KEY="cora_demo_state_v4";
const state={industry:null,companyType:null,companySize:null,customerType:null,turns:0,stage:"discovery",profile:{goal:null,service:null,need:null,location:null,timing:null,contactIntent:null,leadIntent:null,answers:[]},conversation:{leadMode:false,questionIndex:0}};
function restoreState(){
 try{
  const saved=sessionStorage.getItem(STATE_KEY);
  if(!saved)return;
  const parsed=JSON.parse(saved);
  if(parsed&&typeof parsed==="object"){
   state.industry=parsed.industry||null;
   state.turns=Number(parsed.turns)||0;
   state.stage=parsed.stage||"discovery";
   state.profile={...state.profile,...(parsed.profile||{})};
   state.profile.answers=Array.isArray(state.profile.answers)?state.profile.answers:[];
   state.conversation={...state.conversation,...(parsed.conversation||{})};
  }
 }catch(err){console.warn("Cora demo state restore failed",err);}
}
function persistState(){
 try{sessionStorage.setItem(STATE_KEY,JSON.stringify(state));}
 catch(err){console.warn("Cora demo state save failed",err);}
}
restoreState();

const industryLabels={WHOLESALE_MOBILE:"Mobilfunk-Großhandel",BEAUTY:"Kosmetiksalon / Beauty",FITNESS:"Fitnessstudio",SHK:"SHK-/Sanitär-/Heizungsbetrieb",RESTAURANT:"Restaurant / Café",HOTEL:"Hotel",AUTOHAUS:"Autohaus / Kfz",REAL_ESTATE:"Immobilienunternehmen",LAW_FIRM:"Kanzlei",DENTAL:"Zahnarztpraxis",TAX_ADVISOR:"Steuerberatung",CRAFT:"Handwerksbetrieb",PHYSIO:"Physiotherapie",DOCTOR:"Arztpraxis",AGENCY:"Agentur / Beratung",SOFTWARE:"Software / IT / SaaS",ECOMMERCE:"E-Commerce",RETAIL:"Einzelhandel",EDUCATION:"Bildung",COACHING:"Coaching",LOGISTICS:"Logistik / Spedition"};

const industryData={
WHOLESALE_MOBILE:{
 intro:"Für einen Mobilfunk-Großhandel ist Cora besonders interessant, wenn Website-Besucher nicht nur Informationen suchen, sondern als Händler, Geschäftskunden oder Vertriebspartner mit konkretem Bedarf anfragen sollen.",
 useCases:["Händler und gewerbliche Interessenten gezielt zu passenden Produkt- und Warengruppen führen","zwischen Neukunde, Bestandskunde, Wiederverkäufer und allgemeiner Produktanfrage unterscheiden","Bedarf wie Geräte, Zubehör, Mengen, Marken oder bestimmte Produktgruppen erfassen","Liefer-, Preis- oder Angebotsinteresse erkennen und die Anfrage entsprechend einordnen","Unternehmensdaten und Kontaktdaten erst nach geklärtem Bedarf aufnehmen","die Anfrage mit den bereits genannten Informationen strukturiert an den Vertrieb übergeben"],
 questions:["Was suchen Sie aktuell für Ihr Geschäft – bestimmte Smartphones, Zubehör, Produktgruppen oder ein konkretes Sortiment?","Sind Sie bereits Händler bzw. Wiederverkäufer oder möchten Sie erstmals mit Ihnen als Lieferant arbeiten?","Geht es eher um eine konkrete Bestellung, ein Angebot oder zunächst um Informationen zu verfügbaren Produkten und Konditionen?","Welche Mengen, Marken oder Produktgruppen sind für Sie ungefähr relevant?","Wie können wir Sie für die weitere Abstimmung erreichen?"],
 examples:["Smartphones","Zubehör","Wiederverkäufer","B2B-Angebot","größere Stückzahlen"],
 value:"Cora kann aus einer allgemeinen B2B-Anfrage schrittweise ein verwertbares Vertriebsgespräch machen. Der entscheidende Unterschied zu einem einfachen Kontaktformular: Der Vertrieb erhält bereits Kontext zu Rolle, Bedarf und konkretem Interesse."
},
BEAUTY:{intro:"Für einen Kosmetiksalon ist Cora besonders interessant, wenn aus Website-Besuchern mehr konkrete Termin-, Beratungs- und Behandlungsanfragen entstehen sollen.",useCases:["Behandlungen verständlich erklären und passende Leistungen anhand des Wunsches einordnen","zwischen konkretem Terminwunsch, Erstberatung und allgemeiner Information unterscheiden","Interesse und Ziel erfassen, z. B. Hautbild, Haarentfernung, Nägel, Wimpern oder Ästhetik","Wunschzeitraum und relevante Anforderungen aufnehmen","Kontaktdaten erst dann abfragen, wenn ein konkretes Interesse erkennbar ist","die Anfrage mit den bereits genannten Informationen strukturiert an den Salon übergeben"],questions:["Welche Behandlung oder welches Ergebnis interessiert Sie?","Geht es um einen konkreten Termin oder möchten Sie zunächst beraten werden?","Was ist Ihnen dabei besonders wichtig?","Wann wäre ein passender Zeitraum?","Wie können wir Sie für die weitere Abstimmung erreichen?"],examples:["Gesichtsbehandlung","Haarentfernung","Nägel","Wimpern","ästhetische Behandlung"],value:"Der entscheidende Mehrwert ist nicht der Chat an sich: Cora beantwortet zuerst das Anliegen und nutzt die Antworten anschließend, um die Anfrage sinnvoll zu qualifizieren. Der Salon erhält dadurch mehr Kontext als bei einem einfachen „Name + Telefonnummer“-Formular und muss im ersten Kontakt weniger Grundlagen erfragen."},
FITNESS:{intro:"Für ein Fitnessstudio kann Cora Besucher zu Probetraining, Mitgliedschaft oder Beratung führen und das konkrete Ziel des Interessenten erfassen.",useCases:["Mitgliedschaften und Leistungen erklären","Trainingsziel erkennen","Probetraining oder Beratung vorbereiten","Kurse und Öffnungszeiten beantworten","Interesse nach Zeitraum und Bedarf konkretisieren","Kontaktanfragen strukturiert erfassen"],questions:["Was möchten Sie erreichen – Muskelaufbau, Abnehmen, Ausdauer oder allgemeine Fitness?","Möchten Sie ein Probetraining oder zunächst Informationen zu einer Mitgliedschaft?","Wann wäre ein passender Zeitraum?","Wie können wir Sie für die weitere Abstimmung erreichen?"],examples:["Probetraining","Mitgliedschaft","Personal Training","Abnehmen"],value:"Der Mehrwert liegt darin, dass aus einem anonymen Website-Besuch ein konkreter Gesprächsanlass werden kann und Ihr Team bereits weiß, welches Ziel und welches Interesse der Besucher hat."},
SHK:{intro:"Für einen SHK-, Sanitär- oder Heizungsbetrieb kann Cora aus einer allgemeinen Website-Frage eine strukturierte Projekt- oder Rückrufanfrage entwickeln.",useCases:["Reparatur, Wartung, Modernisierung und Neubau unterscheiden","Leistung wie Heizung, Wärmepumpe, Sanitär, Bad oder Klima einordnen","Objektart, Ort und Dringlichkeit erfassen","Projektinformationen strukturiert aufnehmen","Rückruf- und Angebotsanfragen vorbereiten"],questions:["Geht es um Reparatur, Wartung, Modernisierung oder Neubau?","Welche Leistung oder Anlage ist betroffen?","Um welche Immobilie handelt es sich und wo befindet sie sich?","Wie dringend ist die Anfrage?","Wie kann der Betrieb Sie erreichen?"],examples:["Wärmepumpe","Heizung defekt","Badsanierung","Angebot"],value:"Der Betrieb erhält vor dem ersten Rückruf bereits die wichtigsten Angaben und kann dadurch gezielter reagieren, statt bei jeder Anfrage wieder bei null zu beginnen."},
RESTAURANT:{intro:"Für ein Restaurant kann Cora Gäste informieren und Reservierungs-, Gruppen- oder Veranstaltungsanfragen strukturiert aufnehmen.",useCases:["Speisekarte und Leistungen erklären","Öffnungszeiten und Standort beantworten","Reservierungswunsch erfassen","Personenzahl und Wunschzeit abfragen","Gruppen- und Veranstaltungsanfragen vorsortieren"],questions:["Für welchen Tag möchten Sie anfragen?","Wie viele Personen sind es?","Welche Uhrzeit wäre ungefähr gewünscht?","Gibt es besondere Wünsche oder Hinweise?"],examples:["Tisch reservieren","6 Personen","Feier","Gruppenanfrage"],value:"Gäste bekommen sofort Antworten, während das Restaurant aus relevanten Anfragen strukturierte Informationen erhält."},
HOTEL:{intro:"Für ein Hotel kann Cora Fragen zu Zimmern und Leistungen beantworten und Buchungsinteressen strukturiert vorbereiten.",useCases:["Zimmer und Ausstattung erklären","Anreise, Frühstück und Leistungen beantworten","Reisezeitraum und Personenzahl erfassen","Sonderwünsche aufnehmen","Buchungs- oder Rückrufinteresse qualifizieren"],questions:["Wann möchten Sie anreisen?","Wie lange möchten Sie bleiben?","Für wie viele Personen suchen Sie?","Gibt es besondere Anforderungen an das Zimmer?"],examples:["Doppelzimmer","Wochenende","Familienzimmer","Sonderwunsch"],value:"Der Besucher erhält unmittelbar Orientierung und das Hotel bekommt bereits vor dem persönlichen Kontakt die wichtigsten Eckdaten."},
AUTOHAUS:{intro:"Für ein Autohaus kann Cora nicht nur Fahrzeuge erklären, sondern Kauf-, Leasing-, Probefahrt- und Serviceinteressen unterscheiden und vorqualifizieren.",useCases:["Modell, Fahrzeugtyp und Ausstattung einordnen","Kauf, Leasing und Finanzierung unterscheiden","Budget und Anforderungen als freiwillige Angaben erfassen","Probefahrt- und Beratungstermine vorbereiten","Inzahlungnahme und Fahrzeugwechsel erkennen","Werkstatt- und Serviceanfragen vorsortieren"],questions:["Was suchen Sie konkret – ein bestimmtes Modell, eine Preisklasse oder zunächst eine Beratung?","Geht es um Kauf, Leasing, Finanzierung, Probefahrt, Inzahlungnahme oder Service?","Welche Anforderungen sind Ihnen wichtig?","Wann möchten Sie ungefähr kaufen oder einen Termin wahrnehmen?","Wie können wir Sie erreichen?"],examples:["Probefahrt","Leasing","Gebrauchtwagen","Werkstatttermin"],value:"Der Vertrieb erhält vor dem Rückruf bereits Kontext zum Fahrzeuginteresse und muss nicht mit einer völlig unqualifizierten Anfrage beginnen."},
REAL_ESTATE:{intro:"Für ein Immobilienunternehmen kann Cora Suchprofile und Besichtigungsinteressen strukturiert erfassen.",useCases:["Kauf- und Mietinteresse unterscheiden","Objektart und Lage erfassen","Budget und Suchkriterien aufnehmen","Besichtigungswünsche strukturieren","Kontaktdaten qualifizieren"],questions:["Suchen Sie zum Kauf oder zur Miete?","Welche Lage und Objektart kommt infrage?","Welches Budget ist vorgesehen?","Möchten Sie eine Besichtigung anfragen?"],examples:["Wohnung kaufen","Mietwohnung","Besichtigung","Budget"],value:"Statt einer unstrukturierten Nachricht entsteht ein klareres Suchprofil, mit dem das Team schneller weiterarbeiten kann."},
LAW_FIRM:{intro:"Für eine Kanzlei kann Cora allgemeine Informationen geben und neue Anfragen vorsortieren, ohne individuelle Rechtsberatung vorzutäuschen.",useCases:["Fachgebiete und Leistungen erklären","Anliegen grob einordnen","Erstgespräch vorbereiten","Rückruf- und Kontaktwünsche erfassen"],questions:["Worum geht es bei Ihrer Anfrage?","Welches Rechtsgebiet betrifft das ungefähr?","Möchten Sie ein Erstgespräch anfragen?","Wie können wir Sie erreichen?"],examples:["Arbeitsrecht","Erstgespräch","Rückruf"],value:"Die Kanzlei erhält eine besser strukturierte Erstinformation, während der Besucher schneller zum passenden nächsten Schritt geführt wird."},
DENTAL:{intro:"Für eine Zahnarztpraxis kann Cora Praxisinformationen beantworten und Termin- oder Rückrufanfragen strukturieren.",useCases:["Leistungen und Praxisinformationen erklären","Neupatienten-Anfragen erfassen","Terminwünsche strukturieren","organisatorische Fragen beantworten"],questions:["Geht es um einen Termin, eine allgemeine Frage oder eine bestehende Behandlung?","Sind Sie bereits Patient oder neu in der Praxis?","Welcher Zeitraum wäre passend?"],examples:["Neupatient","Termin","Behandlung"],value:"Die Praxis erhält relevante organisatorische Informationen vor dem persönlichen Kontakt. Medizinische Diagnosen oder individuelle Behandlungsempfehlungen sollte Cora nicht ersetzen."},
TAX_ADVISOR:{intro:"Für eine Steuerberatung kann Cora Leistungsinteressen und neue Anfragen vorstrukturieren.",useCases:["Leistungsbereiche erklären","Privat- und Unternehmenskunden unterscheiden","Erstgespräche vorbereiten","Anliegen und Kontaktdaten erfassen"],questions:["Geht es um private oder unternehmerische Themen?","Welche Leistung wird ungefähr benötigt?","Handelt es sich um eine neue Anfrage?","Wie können wir Sie erreichen?"],examples:["Unternehmen","Buchhaltung","Steuererklärung","Erstgespräch"],value:"Das Team erhält vor dem Erstkontakt bereits eine klarere Vorstellung vom Anliegen und kann die Anfrage gezielter bearbeiten."},
CRAFT:{intro:"Für einen Handwerksbetrieb kann Cora aus einer kurzen Problembeschreibung eine strukturierte Projekt- oder Angebotsanfrage entwickeln.",useCases:["Leistung und Projektart erkennen","Reparatur, Wartung, Modernisierung und Neubau unterscheiden","Objekt und Standort erfassen","Zeitraum und Dringlichkeit abfragen","Rückruf- und Angebotsanfragen vorbereiten"],questions:["Welche Arbeit soll durchgeführt werden?","Geht es um Neubau, Modernisierung, Wartung oder Reparatur?","Wo befindet sich das Objekt?","Wann soll die Arbeit ungefähr stattfinden?"],examples:["Elektriker","Renovierung","Reparatur","Angebot"],value:"Der Betrieb erhält vor dem Rückruf bereits die wichtigsten Eckdaten und kann schneller entscheiden, wie die Anfrage weiterbearbeitet wird."}
};

const packageGuidance={
BASIC:"Basic passt vor allem, wenn Cora als professioneller Webchat für Unternehmenswissen, häufige Fragen und einfache Lead-Erfassung eingesetzt werden soll.",
PRO:"Pro passt besonders, wenn Cora aktiv Gespräche führen, Interessenten qualifizieren, mehrere Gesprächswege abbilden und den Lead-Prozess stärker auf den Betrieb zuschneiden soll.",
ENTERPRISE:"Enterprise ist für individuelle oder komplexere Anforderungen gedacht, etwa mehrere Standorte, besondere Integrationen oder umfangreichere Prozesse."
};

function normalize(value){return String(value||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[.,!?;:()[\]{}"' ]/g," ").replace(/\s+/g," ").trim();}

function detectIndustry(text){
 const t=normalize(text);
 const patterns={
  WHOLESALE_MOBILE:["grosshandel mobilfunk","mobilfunk grosshandel","grosshandel fuer mobilfunk","grosshandel fuer mobilfunk und zubehoer","grosshandel mobilfunk und zubehoer","mobilfunk grosshandel und zubehoer","mobilfunk und zubehoer grosshandel","mobilfunk zubehoer grosshandel","telekommunikationsgrosshandel","telekommunikation grosshandel","telekommunikations grosshandel","gross und aussenhandel mobilfunk","gross und aussenhandel fuer mobilfunk","grosshandel und aussenhandel mobilfunk","grosshandel und aussenhandel fuer mobilfunk","grosshaendler mobilfunk","mobilfunk grosshaendler","handy grosshandel","smartphone grosshandel","monilfunk","mobilfunk grosshandel"],
  BEAUTY:["kosmetiksalon","kosmetikstudio","beautysalon","beauty salon","nagelstudio","friseursalon","friseur","barbershop","wimpernstudio","wimpern","gesichtsbehandlung","haarentfernung","aesthetik"],
  FITNESS:["fitnessstudio","fitnesscenter","fitnessclub","fitness","probetraining","mitgliedschaft","personal training","crossfit","yogastudio"],
  SHK:["heizung","heizungsbau","heizungsbauer","heizungsbetrieb","waermepumpe","sanitaer","sanitaerbetrieb","sanitaerinstallateur","shk","badsanierung","badinstallation","klima","klimaanlage","wasserinstallation"],
  RESTAURANT:["restaurant","gastronomie","gaststaette","gasthaus","imbiss","cafe","bistro","reservierung","speisekarte","tisch reservieren","catering"],
  HOTEL:["hotel","hotelbetrieb","gasthof","pension","ferienhotel","zimmer buchen","check in","fruehstueck","uebernachtung","beherbergung"],
  AUTOHAUS:["autohaus","autohandel","autoverkauf","fahrzeughandel","fahrzeughaendler","kfz handel","kfz betrieb","fahrzeug","probefahrt","leasing","autowerkstatt","gebrauchtwagen"],
  REAL_ESTATE:["immobilien","immobilie","immobilienmakler","immobilienunternehmen","immobilienagentur","makler","hausverwaltung","besichtigung","mietwohnung","wohnimmobilien","gewerbeimmobilien"],
  LAW_FIRM:["kanzlei","rechtsanwalt","anwalt","anwaltskanzlei","rechtsberatung","rechtsanwaltskanzlei"],
  DENTAL:["zahnarzt","zahnarztpraxis","zahnmedizin","zahnarztzentrum","zahnklinik","zahnbehandlung"],
  TAX_ADVISOR:["steuerberater","steuerberatung","steuerkanzlei","steuerberaterkanzlei","steuerbuero","buchhaltungsbuero"],
  CRAFT:["handwerksbetrieb","handwerker","handwerksunternehmen","meisterbetrieb","elektriker","elektrobetrieb","maler","bauunternehmen","dachdecker","tischler","schreiner","metallbauer","installateur","sanitaer","heizung","zimmerer","trockenbau"], 
  PHYSIO:["physiotherapie","physio","physiotherapeut","physiopraxis","krankengymnastik"], 
  DOCTOR:["arztpraxis","arzt","hausarzt","facharzt","praxis","medizinisches zentrum"], 
  AGENCY:["agentur","marketingagentur","werbeagentur","digitalagentur","consulting","beratung"], 
  SOFTWARE:["software","saas","softwareunternehmen","it unternehmen","it dienstleister","webagentur","entwickler"], 
  ECOMMERCE:["e commerce","ecommerce","onlineshop","online shop","webshop"], 
  RETAIL:["einzelhandel","fachhandel","laden","geschäft","geschaeft","store"], 
  EDUCATION:["bildung","schule","akademie","weiterbildung","sprachschule","nachhilfe"], 
  COACHING:["coaching","coach","mentoring","trainer"], 
  LOGISTICS:["logistik","spedition","transport","fuhrunternehmen","lagerlogistik"]
 };
 for(const [id,words] of Object.entries(patterns)){if(words.some(w=>t.includes(normalize(w))))return id;}
 if(/fitness|gym|muckibude|training|probetraining|mitglied/.test(t))return "FITNESS";
 if(/physio|krankengymnastik/.test(t))return "PHYSIO";
 if(/zahnarzt|zahnmedizin/.test(t))return "DENTAL";
 if(/restaurant|cafe|gastronomie|reservier|speisekarte/.test(t))return "RESTAURANT";
 if(/makler|immobilien|besichtigung|wohnung|grundstueck/.test(t))return "REAL_ESTATE";
 if(/autohaus|autowerkstatt|fahrzeug|probefahrt|leasing/.test(t))return "AUTOHAUS";
 if(/gross|aussenhandel|grosshandel|grosshaendler/.test(t)&&/mobilfunk|monilfunk|telekommunikation|zubehoer|smartphone|handy/.test(t))return "WHOLESALE_MOBILE";
 if(/mobilfunk|monilfunk|telekommunikation/.test(t)&&/handel|haendler|gross|zubehoer|smartphone|handy/.test(t))return "WHOLESALE_MOBILE";
 return null;
}

function remember(text){
 const raw=String(text||"").trim(),t=normalize(raw);
 const industry=detectIndustry(raw);
 if(industry){state.industry=industry;state.companyType=industryLabels[industry]||industry;}
 const city=raw.match(/\\b(in|aus|bei)\\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]+(?:\\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]+)?)\\b/);
 if(city)state.profile.location=city[2];
 if(/klein|kleine|kleiner|mitarbeiter|mitarbeitende/.test(t))state.companySize=raw;
 if(/b2b|geschäftskunden|geschaeftskunden|firmenkunden|wiederverkaeufer|haendler|händler/.test(t))state.customerType=raw;
 if(/qualifizierte kundenkontakte|qualifizierte kunden|qualifizierte leads|qualifizierten kunden|kundenkontakte|mehr kunden|mehr anfragen|mehr termine|kunden gewinnen|neue kunden|mehr leads|mehr lead|anfragen gewinnen|leads sammeln|lead sammeln|lead sammlen|leadgenerierung|lead generieren/.test(t)){state.profile.goal="mehr qualifizierte Kundenkontakte";state.profile.leadIntent="high";}
 if(/faq|standardfragen|wiederkehrende fragen|immer dieselben fragen/.test(t))state.profile.goal="FAQ-/Standardfragen automatisieren";
 if(/telefon|klingelt|ausserhalb|außerhalb|24.?7|nachts/.test(t))state.profile.goal="Anfragen auch außerhalb der Öffnungszeiten bearbeiten";
 if(/termin|beratung/.test(t))state.profile.contactIntent="Termin / Beratung";
 if(/geschaeftsfuehrer|geschaeftsfuhrer|inhaber|chef|einkauf|einkaeufer|vertrieb|sales|marketing/.test(t))state.profile.role=raw;
 if(/händler|haendler|wiederverkaeufer|wiederverkäufer|reseller|grosshaendler/.test(t))state.profile.customerType=raw;
 if(/angebot|bestellung|bestellen|kaufen|einkauf|bedarf|lieferung|kondition|preis/.test(t))state.profile.intent=raw;
 if(/heute|sofort|diese woche|diesen monat|dringend|bald|naechste woche/.test(t))state.profile.timing=raw;
 if(/termin/.test(t))state.profile.contactIntent="Termin";
 if(/beratung/.test(t))state.profile.contactIntent="Beratung";
 state.profile.answers.push(raw);
}

function knownGoalText(){return state.profile.goal?"Ihr Ziel habe ich bereits erfasst: "+state.profile.goal+".":"";}

function responseForKnownGoal(){
 const data=industryData[state.industry];
 if(!data)return "Ihr Ziel ist klar: mehr qualifizierte Kundenkontakte. Cora kann Besucher informieren, Bedarf konkretisieren und bei echtem Interesse eine strukturierte Anfrage vorbereiten. Welche Branche oder welches Geschäftsmodell möchten Sie mit Cora abbilden?";
 const q=data.questions[Math.min(state.conversation.questionIndex, data.questions.length-1)];
 state.stage="qualification";state.conversation.leadMode=true;
 return "Verstanden. Sie möchten über Ihre Website mehr qualifizierte Kundenkontakte gewinnen. Das lässt sich konkret auf Ihren Vertrieb übertragen.\\n\\nBei einem "+industryLabels[state.industry]+" kann Cora zum Beispiel erkennen, wer anfragt, wonach gesucht wird und ob bereits ein konkreter geschäftlicher Bedarf besteht. Sie führt den Besucher dabei nicht sofort zu einem Kontaktformular, sondern klärt zuerst das Anliegen und baut daraus eine verwertbare Anfrage auf.\\n\\nDamit wir das realistisch testen: "+q;
}

function classifyIntent(text){
 const t=normalize(text);
 if(/neu starten|reset|von vorne/.test(t))return "reset";
 if(/preis|preise|kosten|monatlich|einmalig|setup|einrichtungskosten|was kostet/.test(t))return "pricing";
 if(/dsgvo|datenschutz|daten|speicher|server|eu|av/.test(t))return "privacy";
 if(/integration|crm|kalender|api|n8n|hubspot|salesforce|pipedrive|email|e mail|uebergabe/.test(t))return "integration";
 if(/wie funktioniert|wie arbeitet|wie genau|was macht cora|was kann cora|wie hilft|mehrwert|nutzen|vorteil/.test(t))return "how";
 if(/lead|leads|kundenkontakt|kundenkontakte|kunden gewinnen|mehr kunden|mehr anfragen|anfrage|qualifiz/.test(t))return "lead";
 if(/branche|unternehmen|firma|geschaeft|geschaeftsmodell/.test(t))return "industry";
 if(/basic|pro|enterprise|paket|tarif|welches paket|welcher tarif|was passt|geeignet/.test(t))return "package";
 if(/beispiel|use case|anwendungsfall|anwendungsfaelle|simulier|testen|test/.test(t))return "example";
 if(/termin|beratung|gespraech|kontakt|anrufen|rueckruf/.test(t))return "contact";
 if(/roi|umsatz|conversion|abschlussquote|besucher/.test(t))return "roi";
 return "general";
}

function leadQuestion(){
 const data=industryData[state.industry];
 if(!data)return "Welche Branche oder welches Geschäftsmodell möchten Sie mit Cora abbilden?";
 const idx=Math.min(state.conversation.questionIndex,data.questions.length-1);
 return data.questions[idx];
}

function profileSummary(){
 const p=state.profile,parts=[];
 if(state.industry)parts.push(industryLabels[state.industry]);
 if(p.goal)parts.push("Ziel: "+p.goal);
 if(p.need)parts.push("Bedarf: "+p.need);
 if(p.customerType)parts.push("Rolle/Kundentyp: "+p.customerType);
 if(p.intent)parts.push("Absicht: "+p.intent);
 if(p.timing)parts.push("Zeitraum: "+p.timing);
 return parts.join(" · ");
}

function directAnswer(text){
 const intent=classifyIntent(text);
 if(intent==="how")return "Cora arbeitet als digitaler Erstkontakt auf Ihrer Website. Sie beantwortet zunächst die konkrete Frage, erkennt anschließend das Anliegen und entscheidet anhand des Gesprächs, welche Information als Nächstes wirklich relevant ist. Bei einem Vertriebsziel kann daraus eine qualifizierte Anfrage entstehen – ohne Besucher direkt mit einem langen Formular zu konfrontieren.";
 if(intent==="lead"){
   if(state.industry)return "Ja. Cora kann aus einem Website-Besucher schrittweise einen verwertbaren Lead machen: Anliegen verstehen, Bedarf konkretisieren, Kauf- oder Kontaktabsicht erkennen und erst danach die passenden Kontaktdaten abfragen. Bei Ihrem "+industryLabels[state.industry]+" können wir das jetzt direkt simulieren.\n\n"+leadQuestion();
   return "Ja. Cora kann Leads nicht nur über Name und E-Mail erfassen, sondern den geschäftlichen Kontext davor aufnehmen. In welcher Branche soll Cora eingesetzt werden?";
 }
 if(intent==="pricing")return "Cora Basic: 895 € einmalig + 495 €/Monat. Cora Pro: 1.495 € einmalig + 895 €/Monat. Enterprise: individuell.\n\nBasic deckt Webchat, Unternehmenswissen, FAQs und einfache Lead-Erfassung ab. Pro ist für aktive Gesprächsführung, Qualifizierung und individuellere Gesprächswege ausgelegt. Enterprise wird bei komplexeren Anforderungen individuell geplant.";
 if(intent==="privacy")return "Datenschutz wird vom konkreten Setup bestimmt: Welche Daten werden erfasst, welche Anbieter werden eingesetzt, wo werden Daten verarbeitet oder gespeichert und wohin werden Leads übergeben? Cora kann datensparsam konfiguriert werden. Eine pauschale DSGVO-Garantie wäre ohne Prüfung des konkreten Setups nicht seriös.";
 if(intent==="integration")return "Cora kann je nach Projekt an bestehende Prozesse angebunden werden, zum Beispiel Formular-/E-Mail-Übergaben, CRM, Kalender oder Automatisierungen. Entscheidend ist zuerst, was nach einer qualifizierten Anfrage passieren soll. Welches System oder welcher Prozess wird heute für Leads verwendet?";
 if(intent==="package")return packageForIndustry()+"\n\nDie Auswahl wird nicht allein nach Branche getroffen. Entscheidend sind Gesprächslogik, Qualifizierung, Anzahl der Wege, gewünschte Übergabe und Integrationen. Wenn Sie mir kurz sagen, was Cora bei Ihnen konkret leisten soll, kann ich den passenden Umfang im Demo-Gespräch erklären.";
 if(intent==="example"){
   if(state.industry)return "Ein Beispiel für "+industryLabels[state.industry]+": Cora beantwortet zuerst die Frage des Besuchers, erkennt den konkreten Bedarf und fragt danach nur die Informationen ab, die für die Bearbeitung relevant sind. "+industryData[state.industry].value+"\n\nWenn Sie möchten, spielen wir genau so einen Interessenten jetzt Schritt für Schritt durch.";
   return "Wir können mehrere Szenarien testen: Neukunde, konkrete Angebotsanfrage, Preisfrage, allgemeine Information, Terminwunsch, Bestandskunde, Integrationsfrage oder Datenschutzfrage. Nennen Sie einfach eines davon.";
 }
 if(intent==="roi")return "Der ROI-Rechner auf der Website ist eine Szenario-Rechnung. Er verbindet Website-Traffic, Anfragequote, Abschlussquote und Auftragswert mit einer angenommenen zusätzlichen Anfragequote. Er ist bewusst keine Umsatzgarantie.";
 if(intent==="contact")return "Wenn der Anwendungsfall grundsätzlich passt, kann Cora am Ende des Dialogs zur persönlichen Anfrage führen. Dabei können wir vorher festhalten, was der Interessent sucht, warum er anfragt und welcher nächste Schritt gewünscht ist.";
 if(intent==="industry")return "Cora kann für unterschiedliche Geschäftsmodelle konfiguriert werden. Im Demo sind unter anderem Mobilfunk-Großhandel, Kosmetik, Fitness, SHK, Restaurant, Hotel, Autohaus, Immobilien, Kanzlei, Zahnarztpraxis, Steuerberatung und Handwerk vorbereitet. Welche Branche möchten Sie testen?";
 return null;
}

function startQualification(){
 const data=industryData[state.industry];
 if(!data)return "Welche Branche möchten Sie testen?";
 state.stage="qualification";
 state.conversation.leadMode=true;
 state.conversation.questionIndex=0;
 const goal=state.profile.goal?"Ihr Ziel ist "+state.profile.goal+". ":"";
 return goal+"Für einen "+industryLabels[state.industry]+" würde ich nicht einfach möglichst viele Chat-Nachrichten sammeln. Cora soll aus dem Gespräch eine verwertbare Geschäftsanfrage machen: Anliegen verstehen, Bedarf einordnen, relevante Rückfragen stellen und erst dann den passenden nächsten Kontaktpunkt anbieten.\n\n"+data.intro+"\n\nStarten wir mit dem wichtigsten Punkt: "+(state.profile.need||state.profile.intent||data.questions[0]);
}

function nextQualification(answer){
 const data=industryData[state.industry],raw=String(answer||"").trim(),idx=state.conversation.questionIndex;
 if(!data)return directAnswer(raw)||"Welche Branche möchten Sie testen?";
 state.profile.answers.push(raw);
 const nt=normalize(raw);
 if(idx===0){state.profile.need=raw;state.profile.service=raw;}
 if(/haendler|wiederverkaeufer|reseller|neukunde|bestandskunde|geschaeftskunde/.test(nt))state.profile.customerType=raw;
 if(/angebot|bestellung|bestellen|kaufen|einkauf|preis|kondition/.test(nt))state.profile.intent=raw;
 if(/heute|sofort|diese woche|diesen monat|dringend|bald|naechste woche|wochen/.test(nt))state.profile.timing=raw;

 if(state.industry==="WHOLESALE_MOBILE"){
   if(idx===0){state.conversation.questionIndex=1;return "Verstanden. Ich habe als Bedarf „"+raw+"“ erfasst.\n\nJetzt würde ich die Anfrage geschäftlich einordnen: Sind Sie bereits Händler/Wiederverkäufer, suchen Sie erstmals einen Lieferanten oder geht es um einen konkreten Einkaufs- bzw. Angebotsbedarf?";}
   if(idx===1){state.conversation.questionIndex=2;return "Verstanden. Damit ist die Rolle bzw. Kaufabsicht klarer.\n\nWelche Größenordnung ist ungefähr relevant – einzelne Geräte, kleinere Händlerbestellungen oder größere Stückzahlen? Eine grobe Angabe reicht.";}
   if(idx===2){state.conversation.questionIndex=3;return "Das ist für die Qualifizierung hilfreich.\n\nWann besteht der Bedarf ungefähr – kurzfristig, in den nächsten Wochen oder zunächst nur zur Orientierung?";}
   if(idx===3){state.conversation.questionIndex=4;return "Damit ist bereits ein brauchbarer B2B-Kontext vorhanden:\n\n"+profileSummary()+"\n\nCora würde jetzt nicht unnötig weitere Fragen stellen. Wenn tatsächlich Interesse besteht, wäre der nächste sinnvolle Schritt die Kontaktdatenaufnahme und Übergabe an Ihren Vertrieb. Wie soll der Interessent am Ende bevorzugt kontaktiert werden – E-Mail, Telefon oder persönliches Gespräch?";}
   state.conversation.leadMode=false;state.stage="contact";state.profile.contactIntent=raw;
   return "Perfekt. Die Demo hat jetzt aus dem Gespräch einen konkreten Lead-Kontext aufgebaut:\n\n"+profileSummary()+"\n\nGenau das ist der Unterschied zwischen einem einfachen Chat und einem vertriebsorientierten Cora-Dialog: Der Kontakt wird erst dann angefragt, wenn bereits klar ist, warum der Besucher anfragt. Für Ihren echten Einsatz können Felder, Qualifikationsregeln, CRM-/E-Mail-Übergabe und Gesprächswege individuell definiert werden.";
 }
 if(state.conversation.questionIndex<data.questions.length){state.conversation.questionIndex++;return "Verstanden. Ich berücksichtige „"+raw+"“.\n\n"+data.questions[state.conversation.questionIndex]+"\n\nDie nächste Frage ergibt sich aus dem bisherigen Gespräch – Cora muss also nicht jedem Besucher denselben Fragebogen stellen.";}
 state.conversation.leadMode=false;state.stage="contact";
 return "Damit ist aus dem allgemeinen Website-Interesse eine strukturierte Anfrage geworden.\n\n"+profileSummary()+"\n\nDer nächste Schritt wäre die Übergabe an den gewünschten Kontaktpunkt.";
}

function answer(text){
 const raw=String(text||"").trim();
 if(!raw)return "Stellen Sie mir eine Frage oder beschreiben Sie kurz Ihr Ziel.";
 state.turns++;
 remember(raw);
 const intent=classifyIntent(raw);
 const finish=result=>{persistState();return result;};

 if(intent==="reset"){resetDemo();return "Die Demo wurde zurückgesetzt. Welche Branche und welches Ziel möchten Sie testen?";}

 // In an active dialog, answer side questions without destroying the qualification context.
 if(state.conversation.leadMode && state.industry){
   if(["pricing","privacy","integration","package","how","example","roi","contact","industry"].includes(intent)){
     const faq=directAnswer(raw);
     if(faq)return finish(faq);
   }
   // Short repetitions like “lead sammeln” keep the conversation alive instead of restarting it.
   if(intent==="lead" && raw.length<35)return finish("Genau. Dann bleiben wir beim Lead-Ziel und machen den Dialog konkreter.\n\n"+leadQuestion());
   return finish(nextQualification(raw));
 }

 if(state.industry && state.profile.goal && (intent==="lead"||intent==="how"||intent==="example"))return finish(startQualification());

 const direct=directAnswer(raw);
 if(direct)return finish(direct);

 if(!state.industry){
   if(state.profile.goal)return finish("Ihr Ziel ist bereits klar: mehr qualifizierte Kundenkontakte. Welche Branche bzw. welches Geschäftsmodell soll Cora auf Ihrer Website unterstützen? Ein kurzer Begriff reicht, z. B. Mobilfunk-Großhandel, Autohaus, Kanzlei, Fitnessstudio oder Handwerksbetrieb.");
   return finish("Was möchten Sie mit Cora erreichen – mehr qualifizierte Kundenkontakte, mehr Termine, mehr Angebotsanfragen, weniger Standardfragen oder etwas anderes? Und in welcher Branche sind Sie tätig?");
 }

 if(state.profile.goal && intent==="lead")return finish(startQualification());
 if(intent==="how"||intent==="example")return finish(startQualification());

 const data=industryData[state.industry];
 if(intent==="general")return finish(data.intro+"\n\nEin möglicher nächster Schritt wäre: "+data.questions[0]);
 return finish(data.intro+"\n\nWas möchten Sie konkret testen – Lead-Qualifizierung, Fragen beantworten, Termin-/Anfrageaufnahme, Integration oder Preise?");
}

function runDemo(text){
 text=String(text||"").trim();
 if(!text||demoSend?.disabled)return;
 addMessage(text,"user");
 if(demoSend)demoSend.disabled=true;
 let result;
 try{result=answer(text);}catch(err){console.error("Cora demo error:",err);result="Die Demo konnte diese Eingabe gerade nicht verarbeiten. Bitte versuchen Sie es erneut.";}
 const cta=/cora.?anfrage|anfrage.*formular|kontaktdaten|kontaktpunkt/i.test(result);
 setTimeout(()=>addMessage(result,"cora",cta?"Cora-Anfrage starten":null),180);
 setTimeout(()=>{if(demoSend)demoSend.disabled=false;demoInput?.focus({preventScroll:true});},240);
}

function resetDemo(){
 try{sessionStorage.removeItem(STATE_KEY);}catch(err){}
 state.industry=null;
 state.turns=0;
 state.stage="discovery";
 state.profile={goal:null,service:null,need:null,location:null,timing:null,contactIntent:null,answers:[]};
 state.conversation={leadMode:false,questionIndex:0};
 if(demoMessages)demoMessages.innerHTML='<div class="msg cora">Hallo. Ich bin Cora. Testen Sie mich mit einer Frage.</div>';
 demoInput?.focus({preventScroll:true});
}

window.coraSubmitDemoQuestion=function(event){
 if(event){
   event.preventDefault();
   event.stopPropagation();
   event.stopImmediatePropagation?.();
 }
 const value=demoInput?.value||"";
 if(!value.trim()||demoSend?.disabled)return;
 demoInput.value="";
 runDemo(value);
};

demoSend?.addEventListener("click",window.coraSubmitDemoQuestion);
demoInput?.addEventListener("keydown",e=>{
 if(e.key==="Enter"){
   e.preventDefault();
   window.coraSubmitDemoQuestion(e);
 }
});
document.getElementById("demoReset")?.addEventListener("click",resetDemo);

document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>runDemo(b.dataset.prompt)));

const menuBtn=$("menuBtn"),mobileNav=$("mobileNav");
if(menuBtn&&mobileNav){menuBtn.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.setAttribute("aria-label",open?"Menü schließen":"Menü öffnen");});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("open")));}
document.querySelectorAll("[data-scroll-demo]").forEach(b=>b.addEventListener("click",()=>$("demo")?.scrollIntoView({behavior:"smooth",block:"start"})));

const roiEls={visitors:$("roiVisitors"),rate:$("roiRate"),close:$("roiClose"),value:$("roiValue"),lift:$("roiLift"),liftValue:$("roiLiftValue"),leads:$("roiLeads"),revenue:$("roiRevenue"),year:$("roiYear"),cta:$("roiCta")};
function euro(n){return new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Math.max(0,n));}
function updateROI(){
 if(!roiEls.visitors)return;
 const visitors=Number(roiEls.visitors.value)||0,close=(Number(roiEls.close?.value)||0)/100,value=Number(roiEls.value?.value)||0,lift=(Number(roiEls.lift?.value)||0)/100;
 const extraLeads=visitors*lift,extraRevenue=extraLeads*close*value;
 if(roiEls.leads)roiEls.leads.textContent=extraLeads.toFixed(1).replace(".",",");
 if(roiEls.revenue)roiEls.revenue.textContent=euro(extraRevenue);
 if(roiEls.year)roiEls.year.textContent=euro(extraRevenue*12);
 if(roiEls.liftValue)roiEls.liftValue.textContent="+"+(lift*100).toFixed(1).replace(".",",")+" %-Punkte";
 if(roiEls.cta)roiEls.cta.onclick=()=>{const msg=document.querySelector('[name="message"]');if(msg)msg.value="Ich habe den Cora ROI-Rechner genutzt. Website-Besucher/Monat: "+visitors+" | Anfragequote: "+(Number(roiEls.rate?.value)||0)+"% | Abschlussquote: "+(Number(roiEls.close?.value)||0)+"% | Auftragswert: "+euro(value)+" | Szenario: +"+(lift*100).toFixed(1)+" Prozentpunkte. Ich möchte dazu ein Beratungsgespräch."; $("kontakt")?.scrollIntoView({behavior:"smooth",block:"start"});};
}
[roiEls.visitors,roiEls.rate,roiEls.close,roiEls.value,roiEls.lift].forEach(el=>el?.addEventListener("input",updateROI));updateROI();

const leadForm=$("leadForm"),status=$("formStatus");
leadForm?.addEventListener("submit",async e=>{
 e.preventDefault();if(!leadForm.reportValidity())return;
 const hp=leadForm.querySelector('[name="website_check"]');if(hp?.value)return;
 const button=leadForm.querySelector('button[type="submit"]'),original=button?.innerHTML;
 if(button){button.disabled=true;button.innerHTML="Wird übermittelt …";}
 try{
  const data=new URLSearchParams();new FormData(leadForm).forEach((value,key)=>data.append(key,String(value)));
  data.append("source","Cora Website");data.append("page",window.location.href);data.append("submitted_at_client",new Date().toISOString());
  await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",body:data});leadForm.reset();
  if(status){status.className="form-status success";status.textContent="Ihre Anfrage wurde übermittelt. Vielen Dank.";}
 }catch(err){console.error(err);if(status){status.className="form-status error";status.textContent="Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut.";}}
 finally{if(button){button.disabled=false;button.innerHTML=original||"Cora anfragen";}}
});
})();