Buyer Lead Intake App

A feature-rich web application built with Next.js for managing buyer leads in a real estate context. The app allows users to create, view, edit, and manage buyer data, with support for CSV imports/exports, role-based access, and change history tracking. It uses SQLite for lightweight storage, Prisma for ORM, TailwindCSS for styling, and Zod for form validation.

Features





User Authentication: Simple demo login system with role-based access (user/admin).



Buyer Management:





Create new buyers with validated fields (e.g., full name, phone, city, property type).



Edit existing buyers with concurrency checks using updatedAt.



View buyer details and recent changes (history).



List View:





Sortable table with search and filters (city, property type, status, etc.).



Pagination (10 items per page).



CSV export for all buyers.



CSV Import: Bulk import buyers from CSV (up to 200 rows), with validation and error reporting.



Change History: Tracks updates to buyer records with JSON diffs.



Responsive UI: Clean, professional design with TailwindCSS.



Validation: Client- and server-side validation using Zod for robust data integrity.



Accessibility: Form fields include ARIA attributes for screen reader support.



Testing: Unit tests for budget validation logic using Jest.

Tech Stack





Frontend: Next.js 14 (App Router), React, TailwindCSS



Backend: Next.js API Routes, Prisma ORM



Database: SQLite (lightweight, file-based)



Validation: Zod for schema validation



Testing: Jest for unit tests



Dependencies: react-hot-toast, papaparse, date-fns

Prerequisites





Node.js v18 or higher (node -v to check)



npm v8 or higher (npm -v)



SQLite CLI (optional, for manual DB inspection: sqlite3 --version)

Setup Instructions





Clone the Repository

git clone <repository-url>
cd buyer-lead-app

Expected: Project files are downloaded, including package.json, app/, components/, etc.



Install Dependencies

npm install

Expected: Installs all dependencies, creates node_modules/ and package-lock.json.



Set Up Environment





Copy .env.example to .env:

cp .env.example .env



Ensure .env contains:

DATABASE_URL="file:./dev.db"

Expected: .env file created with SQLite database path.



Initialize Database





Run Prisma migrations to create the SQLite database:

npx prisma migrate dev --name init

Expected: Creates dev.db and applies schema (prisma/schema.prisma), generating tables: User, buyers, buyer_history.



Generate Prisma Client

npx prisma generate

Expected: Generates Prisma client in node_modules/@prisma/client.



Run Development Server

npm run dev

Expected: Starts server at http://localhost:3000. Terminal shows:

▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2s



Access the App





Open http://localhost:3000 in a browser.



Log in with demo credentials:





Email: user@example.com, Password: pass123 (user role)



Email: admin@example.com, Password: admin123 (admin role)



Or: Email: adityagaur086@gmail.com, Password: any (user role, ID: user-apdzpmxbrmo) Expected: Redirects to /auth/login, then to /buyers after login.

Usage





Login: Use demo credentials to access the app. Admins see all buyers; users see only their own.



Create Buyer: Navigate to /buyers/new, fill the form (e.g., name, phone, city), submit. BHK field appears for Apartment/Villa.



List Buyers: View /buyers for a sortable, filterable table. Search by name, filter by city/status, export to CSV.



View/Edit: Click "View" (/buyers/[id]) for details and history, or "Edit" (/buyers/[id]/edit) to update.



Import CSV: Upload a CSV at /buyers (format: fullName,email,phone,city,...). Errors shown for invalid rows.



Run Tests: Execute npm test to verify budget validation logic. Expected: 3 passing tests for budgetValidator.

File Structure

buyer-lead-app/
├── app/
│   ├── auth/login/page.js          # Login page
│   ├── buyers/
│   │   ├── page.js                # Buyers list with search/filters
│   │   ├── new/page.js            # New buyer form
│   │   ├── [id]/
│   │   │   ├── page.js            # Buyer details
│   │   │   ├── edit/page.js       # Edit buyer form
│   ├── api/
│   │   ├── auth/login/route.js    # Login API
│   │   ├── buyers/
│   │   │   ├── route.js           # Create/list buyers
│   │   │   ├── [id]/route.js      # Get/update/delete buyer
│   │   │   ├── [id]/history/route.js  # Buyer change history
│   │   │   ├── import/route.js    # CSV import
│   │   ├── export/route.js        # CSV export
│   ├── layout.js                  # App layout (navbar, footer)
│   ├── page.js                    # Root redirect to login
│   ├── globals.css                # TailwindCSS styles
├── components/
│   ├── BuyerTable.js              # Buyers list table component
│   ├── BuyerForm.js               # Reusable form for create/edit
│   ├── ErrorBoundary.js           # Error boundary component
├── lib/
│   ├── auth.js                    # Demo auth logic
│   ├── validation.js              # Zod schemas
├── hooks/
│   ├── useDebounce.js             # Debounce hook for search
├── prisma/
│   ├── schema.prisma              # Prisma schema (User, buyers, buyer_history)
├── tests/
│   ├── validation.test.js         # Jest tests for validation
├── .env.example                   # Environment template
├── package.json                   # Dependencies and scripts
├── next.config.js                 # Next.js config
├── tailwind.config.js             # TailwindCSS config
├── README.md                      # This file

Database Schema





User: id, email, name, role (enum: user, admin)



buyers: id, fullName, email, phone, city (enum), propertyType (enum), bhk (enum), purpose (enum), budgetMin, budgetMax, timeline (enum), source (enum), status (enum), notes, tags (JSON), ownerId, updatedAt



buyer_history: id, buyerId, changedBy, changedAt, diff (JSON)

Sample Data





User: id: "user-apdzpmxbrmo", email: "adityagaur086@gmail.com", name: "adi", role: "user"



Buyers: 5 sample records (e.g., Rahul Sharma, Chandigarh, Apartment, 3 BHK, Buy, etc.) tied to ownerId: "user-apdzpmxbrmo".



History: 1 entry per buyer, tracking status/name changes.

To insert sample data:

sqlite3 dev.db

INSERT INTO buyers (id, fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, status, notes, tags, ownerId, updatedAt) VALUES
('buyer-uuid-001', 'Rahul Sharma', 'rahul.sharma@example.com', '9876543210', 'Chandigarh', 'Apartment', '3', 'Buy', 5000000, 7500000, '0-3m', 'Website', 'New', 'Looking for a 3BHK...', '{"urgent","family"}', 'user-apdzpmxbrmo', '2025-09-12T10:00:00.000Z');
-- Add more rows as needed

Troubleshooting





No Buyers in List: Verify dev.db has data (SELECT * FROM buyers;). Check ownerId matches logged-in user.



Login Fails: Ensure lib/auth.js upserts user. Clear browser cookies.



Form Validation Errors: Debug lib/validation.js (Zod schemas). BHK required for Apartment/Villa.



CSV Import Fails: Check CSV format (headers: fullName,email,phone,...). Max 200 rows.



Server Errors: Check terminal logs or browser console (F12). Restart with npm run dev.

Development Notes





Auth: Demo-based (hardcoded users in lib/auth.js). For production, integrate NextAuth or Clerk.



Database: SQLite for simplicity. For production, consider PostgreSQL (update DATABASE_URL).



Testing: Expand Jest tests in tests/ for UI and API routes.



Security: Add input sanitization and rate limiting for APIs in production.
