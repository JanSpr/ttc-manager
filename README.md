# TTC-Manager

Webanwendung zur Verwaltung von Tischtennis-Mannschaften, Spielern und Spieltagen.

Ziel ist es, Mannschaftsführern und Spielern eine moderne und einfache Möglichkeit zu bieten, Organisation und Kommunikation rund um Spiele zu vereinfachen.

---

## 🧩 Projektziel

Der TTC-Manager soll insbesondere folgende Fragen lösen:

* Wer kann beim nächsten Spiel teilnehmen?
* Welche Spieler stehen zur Verfügung?
* Wie ist die aktuelle Mannschaftsaufstellung?
* Wann ist das nächste Spiel?
* Wer spielt auf welcher Position?

---

## 🚀 MVP (Minimal Viable Product)

Die aktuelle MVP-Version bietet:

### Für Mannschaftsführer

* Übersicht über Teams und Spieler
* Anzeige der Mannschaftsaufstellung (Lineup)

### Für Spieler

* Übersicht über Teams
* Anzeige der Teammitglieder
* Transparente Darstellung der Aufstellung

---

## 🏗️ Aktueller Stand

Das Projekt ist **funktionsfähig mit Backend + Frontend**.

### ✅ Backend

* Spring Boot Anwendung
* Saubere Domain-Struktur
* REST API vollständig nutzbar
* TeamMembership als zentrale Verknüpfung

### ✅ Frontend

* React + Vite
* Routing mit React Router
* Teamliste & Team-Detailseiten
* Darstellung von Spielern inkl. Aufstellungsposition

---

## 🧠 Domain-Modell

### Zentrale Entities

* **User**

  * Benutzer des Systems (Spieler, Mannschaftsführer)
* **Team**

  * Mannschaft
* **TeamMembership**

  * Verknüpft User ↔ Team
  * Enthält zusätzliche Informationen:

    * `lineupPosition` (Aufstellung im Team)
* **Match** *(in Vorbereitung für MVP-Erweiterung)*
* **Availability** *(in Vorbereitung für MVP-Erweiterung)*

---

## 🧱 Architektur

```text
Backend:
de.janek.ttc.manager
└── domain
    ├── user
    ├── team
    ├── teammembership
    ├── match
    └── availability

Frontend:
src/
├── pages
├── api
└── styles
```

---

## ⚙️ Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* H2 (aktuell)
* PostgreSQL (geplant)

### Frontend

* React
* TypeScript
* Vite
* React Router

---

## ▶️ Projekt starten

### Backend

```bash
cd backend
mvn spring-boot:run
```

Standard-Port:

```
http://localhost:8081
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Standard:

```
http://localhost:5173
```

---

## 📌 Entwicklungsansatz

Dieses Projekt ist ein **Lern- und Praxisprojekt** mit Fokus auf:

* saubere Architektur
* klare Domain-Modelle
* realistische Anwendungsfälle
* iterative Entwicklung (MVP → Erweiterung)
* nachvollziehbare Git-Historie

---

## 🗺️ Nächste Schritte

* Bearbeiten der Aufstellung im Frontend (Drag & Drop / Edit-Modus)
* Match-Planung implementieren
* Verfügbarkeiten (Availability) integrieren
* Rollen & Rechte (z. B. Mannschaftsführer)
* Authentifizierung (Login-System)
* Persistente Datenbank (PostgreSQL)

---

## 🧑‍💻 Autor

Janek Sprengart

---
