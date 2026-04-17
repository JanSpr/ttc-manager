# TTC-Manager

Backend-Anwendung zur Verwaltung von Tischtennis-Mannschaften.

Ziel des Projekts ist es, Mannschaftsführern und Spielern eine einfache Möglichkeit zu bieten, Spiele zu organisieren und Verfügbarkeiten zu koordinieren.

---

## 🧩 Projektziel

Der TTC-Manager soll insbesondere folgende Probleme lösen:

* Wer kann beim nächsten Spiel teilnehmen?
* Welche Spieler stehen zur Verfügung?
* Wer wird aufgestellt?
* Wann ist das nächste Spiel?

---

## 🚀 MVP (Minimal Viable Product)

Folgende Kernfunktionen sind für die erste Version geplant:

* Spieler können ihre Verfügbarkeit für Spiele angeben
* Mannschaftsführer sehen:

  * verfügbare Spieler
  * geplante Aufstellungen
* Spieler sehen:

  * ihre kommenden Spiele
  * ihren Einsatzstatus

---

## 🏗️ Aktueller Stand

Das Projekt befindet sich aktuell im Backend-Grundaufbau.

### Domain-Modelle

* **User**

  * Benutzer des Systems (Spieler, Mannschaftsführer, etc.)
* **Team**

  * Mannschaft mit mehreren Spielern
* **Match**

  * Spieltermin einer Mannschaft
* **Availability**

  * Rückmeldung eines Spielers zu einem Spiel

### Technischer Stand

* Spring Boot Projekt initialisiert
* JPA Entities definiert
* Repositories vorhanden
* Grundstruktur und Packages bereinigt und vereinheitlicht

---

## 🧱 Architektur (aktuell)

```text
de.janek.ttc.manager
└── domain
    ├── user
    ├── team
    ├── match
    └── availability
```

Weitere Schichten (Services, Controller, Security, etc.) werden im nächsten Schritt aufgebaut.

---

## ⚙️ Tech Stack

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* (geplant) PostgreSQL
* (aktuell möglich) H2 für lokale Entwicklung

---

## ▶️ Projekt starten

### Mit Maven

```bash
mvn spring-boot:run
```

Alternativ direkt über die IDE (z. B. Eclipse) starten.

---

## 📌 Entwicklungsansatz

Dieses Projekt wird als Lern- und Praxisprojekt entwickelt mit Fokus auf:

* saubere Architektur
* verständliche Domain-Modelle
* iterative Entwicklung (MVP → Erweiterung)
* nachvollziehbare Git-Historie

---

## 🗺️ Nächste Schritte

* Services für Domain-Logik implementieren
* REST-Controller hinzufügen
* Erste API-Endpunkte definieren
* Validierung und Fehlerhandling
* Security / Authentifizierung

---

## 🧑‍💻 Autor

Janek

---
