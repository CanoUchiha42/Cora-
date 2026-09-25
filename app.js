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
  WHOLESALE_MOBILE:["grosshandel mobilfunk","mobilfunk grosshandel","grosshandel fuer mobilfunk","grosshandel für mobilfunk","mobilfunk grosshandel und zubehoer","mobilfunk und zubehoer grosshandel","mobilfunk zubehoer grosshandel","telekommunikationsgrosshandel","telekommunikation grosshandel"],
  BEAUTY:["kosmetiksalon","kosmetiksaloon","kosmetiksalons","kosmetik salon","beautysalon","beauty salon","nagelstudio","friseursalon","friseur","wimpern","gesichtsbehandlung","haarentfernung","aesthetik"],
  FITNESS:["fitnessstudio","fitness studio","fitness","probetraining","mitgliedschaft","personal training"],
  SHK:["heizung","heizungsbau","heizungsbauer","waermepumpe","sanitaer","sanitaerbetrieb","shk","badsanierung","klima","wasserinstallation"],
  RESTAURANT:["restaurant","gastronomie","reservierung","speisekarte","tisch reservieren"],
  HOTEL:["hotel","zimmer buchen","check in","check-in","fruehstueck"],
  AUTOHAUS:["autohaus","autohandel","fahrzeug","probefahrt","leasing","werkstatt"],
  REAL_ESTATE:["immobilien","immobilie","immobilienmakler","makler","besichtigung","mietwohnung"],
  LAW_FIRM:["kanzlei","rechtsanwalt","anwalt","rechtsberatung"],
  DENTAL:["zahnarzt","zahnarztpraxis","zahnbehandlung"],
  TAX_ADVISOR:["steuerberater","steuerberatung","steuerkanzlei"],
  CRAFT:["handwerksbetrieb","handwerker","meisterbetrieb","elektriker","maler","bauunternehmen"]
 };
 for(const [id,words] of Object.entries(patterns)){if(words.some(w=>t.includes(w)))return id;}
 return null;
}

function remember(text){
 const t=normalize(text);
 const industry=detectIndustry(text);
 if(industry)state.industry=industry;
 if(/qualifizierte kundenkontakte|qualifizierte kunden|qualifizierte leads|qualifizierten kunden|kundenkontakte|kunden kontakt|kundenkontakte gewinnen|mehr kunden|mehr anfragen|mehr termine|kunden gewinnen|neue kunden|mehr leads|anfragen gewinnen/.test(t))state.profile.goal="mehr qualifizierte Kundenkontakte";
 if(/gesichtsbehandlung|haarentfernung|naegel|wimpern|aesthetik|haut/.test(t))state.profile.service=text;
 if(/termin/.test(t))state.profile.contactIntent="Termin";
 if(/beratung/.test(t))state.profile.contactIntent="Beratung";
 state.profile.answers.push(String(text).trim());
}

function knownGoalText(){return state.profile.goal?"Ihr Ziel habe ich bereits erfasst: "+state.profile.goal+".":"";}

function responseForKnownGoal(){
 const data=industryData[state.industry];
 if(!data)return "Ihr Ziel ist klar: mehr qualifizierte Kundenkontakte. Cora kann Besucher informieren, Bedarf konkretisieren und bei echtem Interesse eine strukturierte Anfrage vorbereiten. Welche Branche oder welches Geschäftsmodell möchten Sie mit Cora abbilden?";
 const q=data.questions[Math.min(state.conversation.questionIndex, data.questions.length-1)];
 return "Verstanden. Ihr Ziel ist bereits erfasst: mehr qualifizierte Kundenkontakte.\\n\\nCora kann dabei drei Dinge verbinden: Fragen sofort beantworten, den konkreten Bedarf des Besuchers herausarbeiten und – wenn echtes Interesse besteht – eine strukturierte Anfrage vorbereiten. Das Ergebnis ist nicht nur ein Kontakt, sondern mehr verwertbarer Kontext für Ihr Team.\\n\\nFür Ihren "+industryLabels[state.industry]+" ist jetzt entscheidend, welche Leistung oder welches konkrete Anliegen hinter dem Kontakt steckt. "+q;
}

function directAnswer(text){
 const t=normalize(text);
 if(/was kann cora|was macht cora|wie hilft cora|wofuer|wofür/.test(t))return "Cora ist nicht nur ein FAQ-Chat. Sie kann Besucherfragen beantworten, auf das konkrete Anliegen eingehen, passende Rückfragen stellen und bei echtem Interesse eine strukturierte Anfrage vorbereiten. So entsteht aus einem Website-Besuch ein Gespräch mit verwertbarem Kontext.";
 if(/lead erfassen|leads erfassen|kundenkontakte erfassen|kontakt erfassen/.test(t))return "Ja. Cora kann Kontaktdaten mit dem konkreten Anliegen verbinden. Statt nur Name und Telefonnummer zu sammeln, kann der Dialog vorher klären, wonach der Besucher sucht, welche Leistung relevant ist und welcher nächste Schritt gewünscht wird. Welche Angaben sinnvoll sind, hängt vom jeweiligen Unternehmen ab.";
 if(/einrichtung|integration|einbinden/.test(t))return "Die Einrichtung beginnt mit Ihrem Anwendungsfall: Unternehmenswissen und gewünschte Gesprächswege werden definiert, anschließend wird Cora in die Website eingebunden und mit realistischen Fragen getestet. Erst danach wird der produktive Ablauf festgelegt.";
 return null;
}

function packageForIndustry(){
 if(["WHOLESALE_MOBILE","BEAUTY","FITNESS","AUTOHAUS","SHK","REAL_ESTATE","CRAFT"].includes(state.industry))return packageGuidance.PRO;
 return packageGuidance.BASIC+" "+packageGuidance.PRO;
}

function startQualification(){
 const data=industryData[state.industry];
 if(!data)return null;
 state.stage="qualification";state.conversation.leadMode=true;state.conversation.questionIndex=0;
 return "Für Ihren "+industryLabels[state.industry]+" ist Pro besonders interessant, wenn Cora aktiv aus Besuchern qualifizierte Anfragen entwickeln soll. "+data.intro+
 "\\n\\nKonkrete Einsatzfälle:\\n• "+data.useCases.join("\\n• ")+
 "\\n\\nDer Mehrwert: "+data.value+
 "\\n\\nDamit ich den Einsatz nicht pauschal, sondern anhand Ihres Ziels einordne, starten wir direkt mit der Qualifizierung. "+data.questions[0];
}

function nextQualification(answer){
 const data=industryData[state.industry],idx=state.conversation.questionIndex;
 if(idx===0)state.profile.service=answer;
 if(idx===1)state.profile.contactIntent=answer;
 if(idx===2)state.profile.need=answer;
 if(idx===3)state.profile.timing=answer;
 state.profile.answers.push(String(answer).trim());
 state.conversation.questionIndex++;
 if(state.conversation.questionIndex<data.questions.length){
  return "Danke. Das macht den Einsatz konkreter. "+data.questions[state.conversation.questionIndex]+
  "\\n\\nWarum ich das frage: Die Antwort hilft Cora, die Anfrage später mit echtem Kontext statt nur mit Kontaktdaten zu übergeben.";
 }
 state.conversation.leadMode=false;state.stage="contact";
 return "Damit ist aus dem allgemeinen Wunsch bereits eine konkrete Anfrage geworden.\\n\\nCora hat bisher erkannt:\\n• Branche: "+industryLabels[state.industry]+
 "\\n• Ziel: "+(state.profile.goal||"Kunden-/Anfragengewinnung")+
 "\\n• Interesse/Leistung: "+(state.profile.service||"erfasst")+
 "\\n• Bedarf: "+(state.profile.need||"erfasst")+
 "\\n• Zeitraum: "+(state.profile.timing||"erfasst")+
 "\\n\\nGenau darin liegt der praktische Mehrwert: Der Besucher wurde nicht einfach auf ein Kontaktformular verwiesen. Cora hat das Anliegen aufgenommen, passende Rückfragen gestellt und den nächsten Schritt vorbereitet. Ihr Team kann dadurch mit mehr Kontext in die Anfrage einsteigen.\\n\\nWenn Sie Cora für Ihren Betrieb einsetzen möchten, starten Sie jetzt die „Cora-Anfrage“. Dort können Sie Unternehmen, E-Mail, Website und weitere Kontaktdaten hinterlassen. Im persönlichen Gespräch wird der tatsächliche Umfang und das passende Paket festgelegt.";
}

function answer(text){
 state.turns++;remember(text);
 const t=normalize(text);
 const direct=directAnswer(text);
 if(direct && !state.conversation.leadMode)return direct;
 if(state.conversation.leadMode&&state.industry&&!/preis|kosten|dsgvo|datenschutz|integration|crm/.test(t))return nextQualification(text);
 if(!state.industry){
  if(/sag.*anders|was anderes|andere antwort|weiter|naechste|nächste|konkret/.test(t) && state.profile.goal){
   return "Ja. Wir können die Paketfrage zunächst zurückstellen. Ihr Ziel ist bereits klar: mehr qualifizierte Kundenkontakte.\\n\\nCora kann dafür Besucher im Gespräch von der ersten Frage bis zu einer strukturierten Anfrage begleiten – Informationen geben, Bedarf erkennen und erst bei konkretem Interesse relevante Kontaktdaten erfassen.\\n\\nWenn Sie möchten, testen wir das direkt an Ihrem Unternehmen. Nennen Sie mir nur Ihre Branche, dann spiele ich einen realistischen Gesprächsablauf für Ihren Anwendungsfall durch.";
  }
  if(state.profile.goal)return responseForKnownGoal();
  return "Damit ich Ihnen nicht pauschal ein Paket nenne: Welche Branche betreiben Sie und was möchten Sie über Ihre Website erreichen – zum Beispiel mehr Termine, mehr Angebotsanfragen oder mehr qualifizierte Kundenkontakte?";
 }
 const data=industryData[state.industry];
 if(state.profile.goal && /kundenkontakte|qualifiz|kunden gewinnen|mehr kunden|mehr leads|mehr anfragen/.test(t) && !/welches paket|welcher tarif|basic|pro|enterprise/.test(t)) return responseForKnownGoal();
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