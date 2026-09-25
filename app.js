(() => {
"use strict";
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzDrLyFEsCVSVqLphU7fiCrNo_slakHFf6R8JSHvqT-5Lr6Y5uxyBQbNshS0uzUXSHa/exec";
const $=id=>document.getElementById(id);
const demoMessages=$("demoMessages"),demoInput=$("demoInput"),demoSend=$("demoSend");
const state={industry:null,turns:0,stage:"discovery",profile:{goal:null,service:null,need:null,location:null,timing:null,contactIntent:null,answers:[]},conversation:{leadMode:false,questionIndex:0}};

const industryLabels={WHOLESALE_MOBILE:"Mobilfunk-Großhandel",BEAUTY:"Kosmetiksalon",FITNESS:"Fitnessstudio",SHK:"SHK-/Sanitär-/Heizungsbetrieb",RESTAURANT:"Restaurant",HOTEL:"Hotel",AUTOHAUS:"Autohaus",REAL_ESTATE:"Immobilienunternehmen",LAW_FIRM:"Kanzlei",DENTAL:"Zahnarztpraxis",TAX_ADVISOR:"Steuerberatung",CRAFT:"Handwerksbetrieb"};

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
  CRAFT:["handwerksbetrieb","handwerker","handwerksunternehmen","meisterbetrieb","elektriker","elektrobetrieb","maler","bauunternehmen","dachdecker","tischler","schreiner","metallbauer"]
 };
 for(const [id,words] of Object.entries(patterns)){if(words.some(w=>t.includes(normalize(w))))return id;}
 if(/gross|aussenhandel|grosshandel|grosshaendler/.test(t)&&/mobilfunk|monilfunk|telekommunikation|zubehoer|smartphone|handy/.test(t))return "WHOLESALE_MOBILE";
 if(/mobilfunk|monilfunk|telekommunikation/.test(t)&&/handel|haendler|gross|zubehoer|smartphone|handy/.test(t))return "WHOLESALE_MOBILE";
 return null;
}\n\nfunction remember(text){
 const raw=String(text||"").trim(),t=normalize(raw);
 const industry=detectIndustry(raw);
 if(industry)state.industry=industry;
 if(/qualifizierte kundenkontakte|qualifizierte kunden|qualifizierte leads|qualifizierten kunden|kundenkontakte|mehr kunden|mehr anfragen|mehr termine|kunden gewinnen|neue kunden|mehr leads|mehr lead|anfragen gewinnen|leads sammeln|lead sammeln|lead sammlen|leadgenerierung|lead generieren/.test(t))state.profile.goal="mehr qualifizierte Kundenkontakte";
 if(/geschaeftsfuehrer|geschaeftsfuhrer|inhaber|chef|einkauf|einkaeufer|vertrieb|sales|marketing/.test(t))state.profile.role=raw;
 if(/händler|haendler|wiederverkaeufer|wiederverkäufer|reseller|grosshaendler/.test(t))state.profile.customerType=raw;
 if(/angebot|bestellung|bestellen|kaufen|einkauf|bedarf|lieferung|kondition|preis/.test(t))state.profile.intent=raw;
 if(/heute|sofort|diese woche|diesen monat|dringend|bald|naechste woche/.test(t))state.profile.timing=raw;
 if(/termin/.test(t))state.profile.contactIntent="Termin";
 if(/beratung/.test(t))state.profile.contactIntent="Beratung";
 state.profile.answers.push(raw);
}\n\nfunction knownGoalText(){return state.profile.goal?"Ihr Ziel habe ich bereits erfasst: "+state.profile.goal+".":"";}

function responseForKnownGoal(){
 const data=industryData[state.industry];
 if(!data)return "Ihr Ziel ist klar: mehr qualifizierte Kundenkontakte. Cora kann Besucher informieren, Bedarf konkretisieren und bei echtem Interesse eine strukturierte Anfrage vorbereiten. Welche Branche oder welches Geschäftsmodell möchten Sie mit Cora abbilden?";
 const q=data.questions[Math.min(state.conversation.questionIndex, data.questions.length-1)];
 state.stage="qualification";state.conversation.leadMode=true;
 return "Verstanden. Sie möchten über Ihre Website mehr qualifizierte Kundenkontakte gewinnen. Das lässt sich konkret auf Ihren Vertrieb übertragen.\\n\\nBei einem "+industryLabels[state.industry]+" kann Cora zum Beispiel erkennen, wer anfragt, wonach gesucht wird und ob bereits ein konkreter geschäftlicher Bedarf besteht. Sie führt den Besucher dabei nicht sofort zu einem Kontaktformular, sondern klärt zuerst das Anliegen und baut daraus eine verwertbare Anfrage auf.\\n\\nDamit wir das realistisch testen: "+q;
}

function directAnswer(text){
 const t=normalize(text);
 if(/was kann cora|was macht cora|wie hilft cora|wofuer|wofür|wie generiert cora|wie bekommt cora|wie sammelt cora/.test(t))
   return "Cora arbeitet im Kern wie ein digitaler Erstkontakt im Vertrieb: **1. Besucherfrage beantworten → 2. Anliegen erkennen → 3. Bedarf konkretisieren → 4. passende Rückfragen stellen → 5. qualifizierte Anfrage an den nächsten Kontaktpunkt übergeben.** Dabei soll Cora keine langen Fragebögen abarbeiten, sondern nur Informationen erfassen, die für den jeweiligen Vertriebsprozess relevant sind.";
 if(/lead erfassen|leads erfassen|kundenkontakte erfassen|kontakt erfassen|lead sammeln|lead sammlen|leads sammeln/.test(t))
   return "Ja. Cora kann einen Website-Besucher nicht nur nach Name und E-Mail fragen, sondern den geschäftlichen Kontext davor erfassen: Was wird gesucht, für welchen Zweck, mit welcher Dringlichkeit und welcher gewünschte nächste Schritt? Dadurch erhält der Vertrieb eine Anfrage mit Kontext statt nur einen Kontaktdatensatz.";
 if(/einrichtung|integration|einbinden|crm|kalender|api|n8n/.test(t))
   return "Die Einrichtung wird auf den tatsächlichen Vertriebsprozess zugeschnitten: Wissen, Zielgruppen, Gesprächswege, Qualifikationskriterien, Übergabe und Kontaktziel. Je nach Projekt können anschließend CRM, E-Mail, Kalender oder Automatisierungen angebunden werden.";
 return null;
}\n\nfunction packageForIndustry(){
 if(["WHOLESALE_MOBILE","BEAUTY","FITNESS","AUTOHAUS","SHK","REAL_ESTATE","CRAFT"].includes(state.industry))return packageGuidance.PRO;
 return packageGuidance.BASIC+" "+packageGuidance.PRO;
}

function startQualification(){
 const data=industryData[state.industry];
 if(!data)return null;
 state.stage="qualification";state.conversation.leadMode=true;state.conversation.questionIndex=0;
 const context=state.profile.goal?"Sie möchten "+state.profile.goal+". ":"";
 return context+"Für einen "+industryLabels[state.industry]+" würde ich nicht einfach mehr Chat-Nachrichten sammeln, sondern den Dialog auf verwertbare Geschäftsanfragen ausrichten. Cora kann zuerst die Frage beantworten, dann erkennen, was der Besucher konkret erreichen möchte, und anschließend nur die Informationen abfragen, die für den nächsten Vertriebsschritt relevant sind."+
 "\n\nZum Beispiel kann Cora bei Ihnen zwischen Neukunde, Bestandskunde, Händler/Wiederverkäufer, Produktanfrage und konkretem Angebotsbedarf unterscheiden. "+data.intro+
 "\n\nDamit wir keinen Fragebogen daraus machen, starten wir mit der wichtigsten Information: "+(state.profile.intent||data.questions[0]);
}\n\nfunction nextQualification(answer){
 const data=industryData[state.industry],raw=String(answer||"").trim(),t=normalize(raw),idx=state.conversation.questionIndex;
 state.profile.answers.push(raw);
 if(idx===0){state.profile.need=raw;if(!state.profile.service)state.profile.service=raw;}
 if(idx===1)state.profile.customerType=raw;
 if(idx===2)state.profile.intent=raw;
 if(idx===3)state.profile.timing=raw;
 state.conversation.questionIndex++;

 // Branch instead of a rigid questionnaire: acknowledge what was learned and ask only the next missing business-critical point.
 if(state.industry==="WHOLESALE_MOBILE"){
   if(idx===0){
     return "Verstanden. Sie suchen also konkret nach: "+raw+". Das ist bereits ein verwertbarer Bedarf.\n\nDer nächste Punkt ist für den Vertrieb wichtiger als allgemeine Kontaktdaten: Geht es dabei um einen konkreten Einkaufs-/Angebotsbedarf oder möchten Sie zunächst Produkte, Marken und Konditionen vergleichen?";
   }
   if(idx===1){
     return "Verstanden. Damit ist auch die Art der Anfrage klarer.\n\nWenn Cora solche Besucher erkennt, sollte sie den nächsten Schritt an der Kaufabsicht ausrichten. Welche Größenordnung ist für Sie ungefähr relevant – einzelne Geräte, kleinere Händlerbestellungen oder größere Stückzahlen?";
   }
   if(idx===2){
     return "Das hilft bei der Einordnung. Cora würde jetzt nicht noch fünf weitere Pflichtfragen stellen, sondern die Anfrage für den Vertrieb verdichten. Wann besteht der Bedarf ungefähr – kurzfristig, in den nächsten Wochen oder eher zur Orientierung?";
   }
   if(idx===3){
     state.conversation.leadMode=false;state.stage="contact";
     return "Damit haben wir bereits einen verwertbaren B2B-Kontext: Mobilfunk-Großhandel, konkreter Bedarf, Kauf-/Angebotsabsicht und zeitliche Einordnung.\n\nGenau so sollte Cora arbeiten: **erst verstehen, dann qualifizieren, dann Kontakt herstellen**. Die Kontaktdaten werden nicht blind abgefragt, sondern an einen konkreten Geschäftsanlass gebunden.\n\nWenn Sie Cora für Ihren Vertrieb einsetzen möchten, können Sie jetzt eine Cora-Anfrage starten. Im persönlichen Gespräch werden Datenfelder, CRM-/E-Mail-Übergabe und der genaue Gesprächsprozess auf Ihren Betrieb abgestimmt.";
   }
 }

 if(state.conversation.questionIndex<data.questions.length){
   return "Danke. Ich habe das berücksichtigt. "+data.questions[state.conversation.questionIndex]+"\n\nIch frage das nur, weil die Antwort bestimmt, wie Cora die Anfrage an Ihr Team weitergibt.";
 }
 state.conversation.leadMode=false;state.stage="contact";
 return "Damit ist aus dem allgemeinen Website-Interesse eine strukturierte Anfrage geworden.\n\nCora hat die relevanten Angaben aus dem Gespräch übernommen, statt dieselben Informationen erneut abzufragen. Der nächste Schritt ist die Übergabe an den Vertrieb bzw. an das gewünschte Kontaktziel.";
}\n\nfunction answer(text){
 state.turns++;remember(text);
 const t=normalize(text);

 // Commercial intent must always win over generic FAQ routing once
 // industry + lead goal are known. This also handles short follow-ups such
 // as "lead sammeln", "mehr leads" or "lead sammlen".
 const hasLeadGoal=/lead|kundenkontakt|kunden gewinnen|mehr kunden|mehr anfragen|qualifiz/.test(t);
 const isNonLeadTopic=/preis|kosten|dsgvo|datenschutz|integration|crm|wie funktioniert.*integration/.test(t);
 if(state.industry && state.profile.goal && !state.conversation.leadMode && hasLeadGoal && !isNonLeadTopic){
   return startQualification();
 }

 if(state.conversation.leadMode&&state.industry&&!/preis|kosten|dsgvo|datenschutz|integration|crm/.test(t))return nextQualification(text);

 const direct=directAnswer(text);
 if(direct && !state.conversation.leadMode)return direct;
 if(!state.industry){
  if(state.profile.goal){
   return "Ich habe Ihr Ziel bereits verstanden: mehr qualifizierte Kundenkontakte. Ich brauche dafür nicht dieselbe Angabe noch einmal.\n\nWelche Branche bzw. welches konkrete Geschäftsmodell soll Cora auf Ihrer Website unterstützen? Ein kurzer Begriff reicht, z. B. Mobilfunk-Großhandel, Autohaus, Kanzlei, Fitnessstudio oder Handwerksbetrieb.";
  }
  return "Was möchten Sie über Ihre Website erreichen – mehr qualifizierte Kundenkontakte, mehr Termine, mehr Angebotsanfragen oder etwas anderes? Und in welcher Branche sind Sie tätig?";
 }
 const data=industryData[state.industry];
 if(state.profile.goal && /kundenkontakte|qualifiz|kunden gewinnen|mehr kunden|mehr lead|mehr leads|mehr anfragen/.test(t) && !/welches paket|welcher tarif|basic|pro|enterprise/.test(t)) return startQualification();
 if(/welches paket|welcher tarif|basic|pro|enterprise|was passt|geeignet|empfehl/.test(t)){
  if(/wie hilft|was kann|mehrwert|nutzen|einsatz|mehr kunden|mehr anfragen|mehr termine/.test(t))return startQualification();
  return packageForIndustry()+"\\n\\nBasic ist sinnvoll, wenn hauptsächlich Informationen, FAQs und einfache Anfragen im Mittelpunkt stehen. Pro ist der naheliegende Ausgangspunkt, wenn Cora aktiv Bedarf ermitteln und Leads qualifizieren soll. Enterprise prüfen wir bei komplexeren individuellen Anforderungen.\\n\\nDamit ich es für Ihren Betrieb konkret einordne: "+data.questions[0];
 }
 if(/wie hilft|was kann|mehrwert|nutzen|einsatz|wie funktioniert|anwendungsfall|anwendungsfaelle|mehr kunden|mehr anfragen|mehr termine|kunden gewinnen/.test(t))return startQualification();
 if(/lead|qualifiz|anfrage|kontakt aufnehmen/.test(t))return state.profile.goal?responseForKnownGoal():startQualification();
 if(/dsgvo|datenschutz/.test(t))return "Datenschutz muss anhand des konkreten Setups, der verwendeten Anbieter, Datenarten, Speicherorte und Prozesse geprüft werden. Cora kann datenschutzorientiert konfiguriert werden; eine pauschale DSGVO-Rechtsgarantie wäre nicht seriös. Wenn Sie möchten, können wir als Nächstes festlegen, welche Daten Cora überhaupt für Ihre Leads erfassen soll.";
 if(/integration|crm|kalender|api|n8n|hubspot|salesforce|pipedrive/.test(t))return "Je nach Projekt können Formulare, CRM, Kalender oder Automatisierungen angebunden werden. Entscheidend ist zuerst, wohin eine qualifizierte Anfrage bei Ihnen gehen soll. Welche Systeme oder Prozesse nutzen Sie heute?";
 if(/preis|kosten|monatlich|einmalig/.test(t))return "Cora Basic: 895 € einmalig + 495 €/Monat. Cora Pro: 1.495 € einmalig + 895 €/Monat. Enterprise: individuell.\\n\\nBasic ist für Webchat, Unternehmenswissen, FAQs und einfache Lead-Erfassung gedacht. Pro ist für aktive Gesprächsführung und Lead-Qualifizierung ausgelegt. Die endgültige Einordnung erfolgt anhand Ihres konkreten Einsatzes.";
 if(/beispiel|wie wuerde|wie würde|zeig|testen|simulier/.test(t))return startQualification();
 return data.intro+"\\n\\nDer relevante nächste Schritt für Ihr Ziel wäre: "+data.questions[0];
}

function addMessage(text,type,cta){
 if(!demoMessages)return;
 const wrap=document.createElement("div");wrap.className="msg "+type;
 const body=document.createElement("div");body.textContent=text;wrap.appendChild(body);
 if(cta){const b=document.createElement("button");b.type="button";b.className="demo-cta";b.textContent=cta;b.addEventListener("click",()=>$("kontakt")?.scrollIntoView({behavior:"smooth",block:"start"}));wrap.appendChild(b);}
 demoMessages.appendChild(wrap);demoMessages.scrollTop=demoMessages.scrollHeight;
}

function runDemo(text){
 text=String(text||"").trim();if(!text)return;
 addMessage(text,"user");
 setTimeout(()=>{const result=answer(text);const cta=/cora.?anfrage|anfrage.*formular|hinterlassen.*kontaktdaten/i.test(result);addMessage(result,"cora",cta?"Cora-Anfrage starten":null);},220);
}

window.coraSubmitDemoQuestion=function(event){
 if(event){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();}
 const value=demoInput?.value||"";if(!value.trim())return;
 if(demoSend)demoSend.disabled=true;demoInput.value="";runDemo(value);
 setTimeout(()=>{if(demoSend)demoSend.disabled=false;demoInput?.focus({preventScroll:true});},400);
};
demoSend?.addEventListener("click",window.coraSubmitDemoQuestion);
demoInput?.addEventListener("keydown",e=>{if(e.key==="Enter")window.coraSubmitDemoQuestion(e);});
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