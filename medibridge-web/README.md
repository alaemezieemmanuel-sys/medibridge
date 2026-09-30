# MEDIBRIDGE web

React + TypeScript + Vite. Talks to the MEDIBRIDGE Express API (port 5000) through the Vite dev proxy, because the backend does not enable CORS.

    npm install
    npm run dev        # http://localhost:5173, API expected on http://localhost:5000

Production: set VITE_API_URL to the API origin and add `app.use(require('cors')())` to the backend.

Structure: src/lib (api client, auth, hooks), src/components (shared UI), src/pages (Auth, Doctors, Consultations, Admin).
Health Passport: patient screen (create/update, allergies, conditions, medications, grant/revoke access) and doctor read-only view. Blood group and genotype option lists are assumed; check them against the backend validators.
