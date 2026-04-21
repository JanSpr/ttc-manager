# TTC Manager

TTC Manager ist eine Webanwendung zur Organisation von Tischtennis-Mannschaften.
Der Fokus liegt auf der Unterstützung von Mannschaftsführern bei der Planung von Spielen sowie der Verwaltung von Spielern, Teams und Verfügbarkeiten.

Das Projekt dient als Lern- und Entwicklungsprojekt mit dem Ziel, eine saubere und erweiterbare Architektur aufzubauen.

---

## 🚀 Aktueller Funktionsumfang

### 🔐 Authentifizierung

* Login über **E-Mail oder Username**
* Session-basierte Authentifizierung (Spring Security)
* „Angemeldeter Benutzer“ (`/api/auth/me`)
* Logout-Funktion
* Benutzerprofil bearbeiten (inkl. E-Mail ändern)

---

### 👤 Benutzer & Mitglieder

* **User** = Login-Account
* **Member** = reale Vereinsperson (kann ohne User existieren)
* User kann einem Member zugeordnet werden

---

### 🏓 Teams & Aufstellung

* Teams anzeigen
* Team-Detailseite mit Spielern
* Spieler werden über **TeamMembership** verwaltet
* Unterstützung für **lineupPosition** (Aufstellungsreihenfolge innerhalb eines Teams)

---

### 🎨 Frontend

* React + Vite
* Geschützte Routen (ProtectedRoute)
* Globaler Auth-Context
* Toast-Benachrichtigungen (zentrale Anzeige unten im Screen)
* Konsistente UI-Struktur mit Header & Seitenlayout

---

## 🧱 Architektur

### Backend (Spring Boot)

```id="backend-structure"
de.janek.ttc.manager
├── config          # Security, Konfiguration
├── domain
│   ├── user        # User (Login-Accounts)
│   ├── member      # Vereinsmitglieder
│   ├── team        # Team + TeamMembership
│   ├── match       # (geplant)
│   └── availability # (geplant)
├── exception       # GlobalExceptionHandler etc.
```

---

### 🧠 Domänenmodell

* **User**

  * Login-Daten (Email, Username, Passwort)
  * optional mit Member verknüpft

* **Member**

  * reale Person im Verein
  * existiert unabhängig vom Login

* **Team**

  * Mannschaft

* **TeamMembership**

  * Verbindung zwischen Member und Team
  * enthält zusätzliche Informationen:

    * `lineupPosition` (Spielstärke/Reihenfolge)

---

### Frontend (React)

```id="frontend-structure"
src/
├── components      # Wiederverwendbare UI-Komponenten
├── context         # Auth, Toast
├── pages           # Seiten (Teams, Login, Profil etc.)
├── services        # API-Kommunikation
├── types           # TypeScript-Typen
```

---

## ⚙️ Technologie-Stack

### Backend

* Spring Boot
* Spring Security
* Hibernate
* PostgreSQL

### Frontend

* React
* Vite
* TypeScript

---

## 🛠️ Setup

### Backend starten

```bash
cd backend
./mvnw spring-boot:run
```

oder in Eclipse / IntelliJ direkt starten.

---

### Frontend starten

```bash
cd frontend
npm install
npm run dev
```

Frontend läuft standardmäßig auf:

```
http://localhost:5173
```

Backend:

```
http://localhost:8081
```

---

## 🔒 Sicherheit (aktueller Stand)

* Session-basierte Authentifizierung
* CORS für lokales Frontend aktiviert
* 일부 Endpoints aktuell bewusst offen (z. B. User-Erstellung für Entwicklung)

⚠️ Wird später verschärft (Rollen, Rechte, Admin-Funktionen)

---

## 🧭 Roadmap (nächste Schritte)

* Spielplanung (Matches)
* Verfügbarkeiten (Availability)
* Aufstellungslogik erweitern
* Rollenmodell (Admin, Mannschaftsführer, Spieler)
* UI-Komponenten vereinheitlichen
* Einladungs-/Registrierungsprozess für User

---

## 🎯 Ziel des Projekts

* saubere Fullstack-Architektur lernen
* reale Problemstellung (Vereinsorganisation) abbilden
* langfristig ausbaufähige Anwendung entwickeln

---

## 📌 Hinweis

Dieses Projekt befindet sich aktiv in Entwicklung.
Struktur und Features können sich noch ändern.

---
