# Vue 3 + Vite
Author: Eric Fuchs <fuchsdevelop@gmx.de.de>
Datum: 08.05.2025

1. Überblick

Das Rezepte-Management-System ist eine webbasierte Anwendung, die folgende Kernfunktionen bietet:

Rezeptverwaltung (Erstellen, Bearbeiten, Löschen von Rezepten)

Favoriten (Rezepte als Favoriten markieren)

Benutzerverwaltung (Admin-Funktion: Benutzer anzeigen und löschen)

Dashboard (Statistiken zu Rezepten und Bewertungen)

Authentifizierung (Login/Logout per einfachem Store)

Die Anwendung wurde mit Vue 3, Composition API und json-server als Mock-Backend realisiert.

2. Architektur & Verzeichnisstruktur

src/
├── assets/                  # globale Styles (Sass/CSS)
├── components/              # wiederverwendbare Vue-Komponenten
│   ├── RecipeForm.vue       # mehrstufiges Formular zur Rezept-Erstellung
│   └── ...                  # weitere UI-Komponenten
├── composables/             # eigene Composables (Stores, Hooks)
│   ├── useRecipeStore.js    # Rezept-Store (CRUD, Filter, Getter)
│   ├── useUserStore.js      # User-Store (Login/Logout)
│   ├── useFavoritesStore.js # Favoriten-Store (localStorage)
│   └── useForm.js           # Formular-Validation
├── router/                  # Vue-Router-Konfiguration
│   └── index.js
├── views/                   # Seiten-Views
│   ├── HomeView.vue         # alle Rezepte anzeigen
│   ├── DashboardView.vue    # Statistiken & Charts
│   ├── CreateRecipeView.vue # Rezept erstellen
│   └── admin/               # Admin-Bereich
│       ├── UserManagement.vue
│       └── RecipeManagement.vue
├── App.vue                  # Root-Komponente mit Navigation
├── main.js                  # App-Initialisierung, globale Provide
└── utils/                   # Hilfsfunktionen & Validation Rules
    └── validationRules.js

3. Installation & Start

Projekt klonen:

git clone <repo-url>
cd Rezepte-Management-System

Abhängigkeiten installieren:

npm install

Mock-Backend starten (db.json im Projekt-Root):

npx json-server --watch db.json --port 3000

Entwicklungs-Server starten:

npm run dev

Anwendung im Browser öffnen: http://localhost:5173

4. Technologiestack

Vue 3 mit Composition API

Vite als Build-Tool

json-server für Mock-API (db.json)

Axios für HTTP-Requests

vue-chartjs & Chart.js für Dashboards

localStorage für Favoriten-Speicherung

5. Hauptfunktionen im Detail

5.1 Rezeptverwaltung

ListView: alle Rezepte anzeigen (HomeView.vue)

Create: CreateRecipeView.vue nutzt RecipeForm.vue für mehrstufiges Formular (Details, Zutaten, Schritte, Bild & Nährwerte)

CRUD: useRecipeStore.js exportiert loadRecipes(), addRecipe(), updateRecipe(), deleteRecipe() und Filter/Sort-Logik

5.2 Favoriten

useFavoritesStore.js speichert Favoriten-IDs in localStorage

Benutzer kann Rezepte als Favoriten markieren und in der Favoriten-Ansicht sehen

5.3 Benutzerverwaltung (Admin)

UserManagement.vue: listet alle Benutzer auf, Admin kann löschen

Routing-Guard schützt /admin/users und /admin/recipes für Admins

5.4 Dashboard

Zeigt Anzahl Rezepte, Top-Bewertungen, Durchschnittsbewertung

Statische Charts für Kategorien & Aktivität mittels vue-chartjs

5.5 Authentifizierung

useUserStore.js verwaltet login(), logout(), user-State und Rolle

App.vue zeigt Navigation je nach Rolle an

