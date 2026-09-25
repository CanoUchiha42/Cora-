# Cora AI — ACE AI AGENTS

Premium, statische Website für Cora AI, den KI-Webagenten von ACE AI AGENTS.

## Live-Ziel

GitHub Pages: https://canouchiha42.github.io/Cora-/

## Enthalten

- Premium responsive Landingpage
- Cora Produktvisualisierung
- interaktive Cora-Demo ohne externe KI-Kosten
- Funktionen, Branchen, Ablauf, Datenschutz, Preise und FAQ
- Lead-Formular
- Google Apps Script / Google Sheets Übergabe
- Honeypot gegen einfache Spam-Bots
- Einwilligungscheckbox mit Datenschutzhinweis
- 404-Seite
- robots.txt
- sitemap.xml
- mobile Navigation
- reduced-motion Unterstützung
- keine Analytics- oder Werbetracker
- keine geheimen API-Schlüssel im Frontend

## Preise

- Cora Basic: 895 € Einrichtung + 495 €/Monat
- Cora Pro: 1.495 € Einrichtung + 895 €/Monat
- Cora Enterprise: auf Anfrage

## Lead-System

Das Formular in app.js sendet an den aktuell eingerichteten Google-Apps-Script-Web-App-Endpunkt.

Der Lead-Prozess ist:

Cora Website → Google Apps Script → Google Sheets

Nach Änderungen sollte mindestens ein Testlead erzeugt und in der Tabelle kontrolliert werden.

## GitHub Pages aktivieren

1. Repository öffnen.
2. Settings → Pages.
3. Deploy from a branch auswählen.
4. Branch main und Verzeichnis / (root) wählen.
5. Speichern.
6. HTTPS aktivieren, sobald GitHub die Option anbietet.

## Rechtliches

impressum.html und datenschutz.html sind technisch vorbereitet.

Vor dem geschäftlichen Livebetrieb müssen insbesondere die echten Anbieterangaben, Anschrift, geschäftliche E-Mail-Adresse und die tatsächlichen Datenverarbeitungen ergänzt und geprüft werden. Es werden absichtlich keine Anschrift, Telefonnummer, Zertifikate oder sonstige Unternehmensdaten erfunden.

## Struktur

- index.html — Hauptseite
- styles.css — Design und responsive Layout
- app.js — Demo, Navigation und Lead-Formular
- impressum.html — Impressum
- datenschutz.html — Datenschutz
- 404.html — Fehlerseite
- robots.txt — Crawler-Regeln
- sitemap.xml — Sitemap

## Grundprinzip

Die Website ist bewusst als statische Seite aufgebaut. Dadurch benötigt die Landingpage selbst keinen kostenpflichtigen Server oder eine laufende Node-/Next.js-Instanz.
