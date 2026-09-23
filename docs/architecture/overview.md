# Meeting-bot Monorepo Architecture Overview

This repository is structured as a multi-application codebase containing three distinct frontend applications, shared libraries, and documentation.

## Project Structure

```
Meeting-bot/
├── natively-cluely-ai-assistant/  # Desktop Application (Electron + React)
├── admin-panel/                   # Administrative Management Panel (React + Vite)
├── landing-page/                  # Product Landing Page (React + Vite)
├── shared/                        # Shared Types, Constants & Utilities
└── docs/                          # Architecture & Application Guides
```

## Component Overview

### 1. Desktop App (`natively-cluely-ai-assistant/`)
- **Tech Stack**: Electron 34, React 19, TypeScript, Rust (NAPI), Vite
- **Function**: AI meeting co-pilot featuring real-time audio transcription, context-aware answer generation, stealth overlay, and native system hooks.

### 2. Admin Panel (`admin-panel/`)
- **Tech Stack**: React 19, Vite, TypeScript, React Router DOM, Lucide Icons
- **Function**: Operational dashboard for user credit management, manual UPI/UTR payment verification, and license key generation.
- **Backend API**: Communicates with `natively-cluely-ai-assistant/server.mjs` running on port 8080.

### 3. Landing Page (`landing-page/`)
- **Tech Stack**: React 19, Vite, TypeScript, Lucide Icons
- **Function**: Customer-facing marketing site detailing features, pricing tiers, and providing installer downloads.
- **Handoff Status**: Designed as an isolated standalone React app for handover to the dedicated frontend team.

### 4. Shared Library (`shared/`)
- `shared/types`: Common TypeScript interfaces (`UserRecord`, `PaymentRecord`, `LicenseRecord`, `AdminOverviewStats`)
- `shared/constants`: Centralized API URLs, plan names, download links
- `shared/utils`: Common helper functions (date formatting, string manipulation)

## Development Quick Start

To run any application locally:

```bash
# Admin Panel
cd admin-panel
npm run dev # Runs on http://localhost:5173

# Landing Page
cd landing-page
npm run dev # Runs on http://localhost:5174

# Desktop App
cd natively-cluely-ai-assistant
npm run app:dev
```
