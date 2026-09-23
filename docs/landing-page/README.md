# Landing Page — Frontend Team Handoff Guide

Welcome to the **MeetFloo Landing Page** project repository! This guide provides all necessary context for the frontend team to finalize and polish the landing page before integrating the completed code back into the main product workflow.

## Overview

The `landing-page` directory contains a completely isolated, standalone React + Vite + TypeScript application. It has zero coupling with Electron or desktop-specific modules, allowing you to develop, style, and test freely.

## Directory Structure

```
landing-page/
├── public/                # Static assets (favicons, public images)
├── src/
│   ├── assets/            # Component-level media & logo assets
│   ├── components/
│   │   ├── layout/        # Navbar & Footer
│   │   ├── sections/      # Hero, Features, Pricing, DownloadSection
│   │   └── common/        # Reusable buttons, cards, badges
│   ├── App.tsx            # Main layout assembly
│   ├── main.tsx           # React entry point
│   └── index.css          # Styling & theme variables
├── index.html
├── package.json
└── vite.config.ts
```

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   cd landing-page
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or port indicated in terminal).

3. **Build Production Assets**:
   ```bash
   npm run build
   ```
   Outputs production bundle to `landing-page/dist/`.

## Shared Resources

- Shared constants (such as installer download URLs and plan labels) can be imported from `../../shared/constants`.
- Color schemes and design tokens are configured via CSS variables in `src/index.css`.

## Handoff & Return Process

1. **Frontend Team Tasks**:
   - Enhance visual animations, micro-interactions, and responsiveness.
   - Replace demo graphics/screenshots with finalized UI assets in `src/assets/`.
   - Ensure SEO meta tags and open-graph tags are populated in `index.html`.

2. **Returning Code**:
   - Push updated changes directly to the `landing-page/` directory in this workspace repository.
