# Claude Context & Instructions

This file contains important context and instructions for Claude to remember when working on this project.

## Project Overview

**Project Name:** UMLS Code Set Builder (mcsbumls)
**Type:** React + TypeScript web application
**Purpose:** A clinical code set builder that allows users to search UMLS (Unified Medical Language System) terminologies, navigate hierarchical relationships, and build domain-specific code sets for healthcare data analytics and OMOP CDM integration.

### What This Application Does
1. **Search UMLS Terminologies**: Search across 12+ medical vocabularies (ICD-10-CM, SNOMED CT, RxNorm, LOINC, CPT, etc.)
2. **Navigate Hierarchies**: Browse parent/child relationships in hierarchical vocabularies
3. **Build Code Sets**: Create domain-specific code sets (conditions, drugs, measurements, procedures, observations)
4. **RxNorm to NDC Mapping**: Special support for mapping RxNorm drug codes to NDC (National Drug Code) codes
5. **Export**: Export code sets for use in OMOP CDM and other data systems

## Tech Stack

- **Frontend**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Icons**: Lucide React 0.562.0
- **Hosting**: Azure Static Web Apps
- **API Proxy**: Azure Functions v4 (Node.js) — protects UMLS API key server-side
- **APIs Used**:
  - UMLS Terminology Services API (NLM) - 2025AB version (proxied via /api/umls)
  - RxNav API (NLM) - for RxNorm drug hierarchies and NDC mappings (proxied via /api/rxnav)

## Important Context

### Current State
- Application deploys as an **Azure Static Web App** with Azure Functions API proxy
- Two main views: "Search & Build" (implemented) and "Saved Code Sets" (placeholder)
- UMLS API key is protected server-side via Azure Functions proxy (never exposed to browser)
- Recent features: RxNorm hierarchy support, NDC code mapping, dose form filtering, TTY labels

### Recent Development (from git history)
- `9d86ba3` - Add dose form filter and TTY labels for hierarchy view
- `58d6933` - Add consolidated dose form display for RxNorm/NDC codes
- `0fb2989` - Add RxNorm drug hierarchy support with NDC code mapping

### Key Files & Structure

**Core Application**
- `src/App.tsx` - Main app with header, navigation, view switching
- `src/main.tsx` - Application entry point
- `src/components/UMLSSearch.tsx` - Primary search & build interface (large, complex component)

**Library/Utilities**
- `src/lib/api.ts` - API client (calls /api/umls and /api/rxnav proxy — no API keys in client)
- `src/lib/types.ts` - TypeScript interfaces for UMLS data, API requests/responses, UI state
- `src/lib/vocabularyMapping.ts` - Bidirectional mapping between UMLS codes ↔ OMOP vocabulary_id ↔ UI display names

**Azure Functions Proxy**
- `api/src/functions/umlsProxy.ts` - Proxies /api/umls/* → NLM UMLS API (injects API key server-side)
- `api/src/functions/rxnavProxy.ts` - Proxies /api/rxnav/* → NLM RxNav API (CORS proxy)

**Configuration**
- `vite.config.ts` - Vite build configuration (includes dev proxy to Azure Functions)
- `staticwebapp.config.json` - Azure SWA routing (SPA fallback, API routing)
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` - TypeScript configs
- `eslint.config.js` - ESLint configuration
- `api/local.settings.json` - Azure Functions local env vars (gitignored, contains UMLS_API_KEY)

## Coding Preferences & Guidelines

- **Components**: Functional components with React hooks
- **TypeScript**: Strict typing with explicit interfaces (see `src/lib/types.ts`)
- **State Management**: useState hooks (no Redux/Zustand - keep it simple)
- **API Calls**: Centralized in `src/lib/api.ts`
- **Error Handling**: Try/catch with user-friendly error messages
- **Console Logging**: Extensive logging in api.ts with prefixes like `[RXNORM→NDC]`, `[UMLS ATTRIBUTES]` for debugging
- **Naming Conventions**:
  - `camelCase` for variables/functions
  - `PascalCase` for components/interfaces
  - `UPPER_SNAKE_CASE` for constants/config objects

## Business Rules & Domain Knowledge

### UMLS Terminology System

**CUI (Concept Unique Identifier)**: A unique ID for a medical concept across all vocabularies
**AUI (Atom Unique Identifier)**: A unique ID for a specific term/code in a specific vocabulary
**Atoms**: The actual codes from source vocabularies that represent a concept

### Supported Vocabularies

The app uses a **three-layer vocabulary naming system**:

1. **UMLS Vocabulary** (API codes): `SNOMEDCT_US`, `LNC`, `RXNORM`, `ICD10CM`, etc.
2. **OMOP vocabulary_id** (database standard): `SNOMED`, `LOINC`, `RxNorm`, `ICD10CM`, etc.
3. **Display Name** (UI labels): `SNOMED`, `LOINC`, `RxNorm`, `ICD10CM`, etc.

See `src/lib/vocabularyMapping.ts` for complete mappings.

**12 Supported Vocabularies:**
- **ICD10CM** - ICD-10 Clinical Modification (diagnosis codes)
- **SNOMED** (SNOMEDCT_US) - SNOMED CT US Edition (clinical concepts)
- **ICD9CM** - ICD-9 Clinical Modification (legacy diagnosis codes)
- **LOINC** (LNC) - Logical Observation Identifiers (lab tests, clinical observations)
- **CPT4** (CPT) - Current Procedural Terminology (procedures)
- **HCPCS** - Healthcare Common Procedure Coding System
- **RxNorm** (RXNORM) - Drug terminology (ingredients, clinical drugs, branded drugs)
- **NDC** - National Drug Code (specific drug products)
- **CVX** - Vaccines Administered
- **ATC** - Anatomical Therapeutic Chemical Classification
- **ICD10PCS** - ICD-10 Procedure Coding System
- **ICD9Proc** (ICD9PCS) - ICD-9 Procedure Codes

### Hierarchical Vocabularies

These vocabularies support parent/child navigation:
- `SNOMEDCT_US`, `ICD10CM`, `ICD9CM`, `RXNORM`, `ATC`, `LNC`, `ICD10PCS`

### Build Domains

The app supports building code sets for 5 clinical domains:

1. **Condition** 🏥 - Diseases, disorders (uses ICD10CM, SNOMED, ICD9CM)
2. **Drug** 💊 - Medications (uses NDC, RxNorm, CPT, CVX, HCPCS, ATC)
3. **Measurement** 📊 - Lab tests, vitals (uses LOINC, CPT, SNOMED, HCPCS)
4. **Procedure** ⚕️ - Clinical procedures (uses CPT, HCPCS, SNOMED, ICD9PCS, LOINC, ICD10PCS)
5. **Observation** 👁️ - Clinical observations (uses ICD10CM, SNOMED, LOINC, CPT, HCPCS)

### RxNorm Specifics

**RxNorm TTY (Term Types):**
- `IN` - Ingredient (e.g., "Aspirin")
- `SCD` - Semantic Clinical Drug (e.g., "Aspirin 81 MG Oral Tablet")
- `SBD` - Semantic Branded Drug (e.g., "Bayer Aspirin 81 MG Oral Tablet")
- `SCDC/SBDC` - Drug Components
- `SCDF/SBDF` - Drug Forms
- `GPCK/BPCK` - Generic/Branded Packs

**Dose Forms** (consolidated categories):
- Oral Solid, Oral Liquid, Injectable, Topical, Inhalation, Ophthalmic, Otic, Other

**RxNorm → NDC Mapping:**
The app fetches NDC codes from **two sources**:
1. RxNav API (`/rxcui/{rxcui}/ndcs.json`)
2. UMLS Attributes (both RxNorm source-level and CUI-level attributes)

### API Behavior

**Search:**
- Fetches 4 pages × 75 results = 300 total results max
- Parallel page fetches for performance
- Deduplicates by CUI
- Supports relevance or alphabetical sorting
- Includes suppressible and obsolete codes (`includeSuppressible=true`, `includeObsolete=true`)

**Hierarchy:**
- Ancestors: Single API call (usually small result set)
- Descendants: Paginated with 5000 results/page, up to 20 pages max (100k descendants)
- RxNorm uses RxNav API instead of UMLS for better hierarchy support

**Code Extraction:**
- If `atom.code` is a URL, extract the last path segment as the actual code
- Store original URL in `codeUrl` field for reference

## Common Tasks & Commands

```bash
npm run dev          # Start frontend dev server (localhost:5173)
npm run dev:api      # Start Azure Functions proxy (localhost:7071) — run in separate terminal
npm run build        # Build for production (TypeScript compile + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Things to Remember

### API Integration
- **Always include** `includeSuppressible=true` and `includeObsolete=true` in UMLS API calls to get all codes
- UMLS API key is server-side only (in `api/local.settings.json` or Azure Portal) — never in client code
- All UMLS/RxNav calls go through Azure Functions proxy (`/api/umls/*`, `/api/rxnav/*`)
- The UMLS proxy rewrites absolute URLs in API responses to proxy-relative paths
- UMLS API version is `2025AB` (hardcoded in api.ts)
- Handle URL-based codes by extracting the last path segment

### RxNorm/NDC
- Use RxNav API for RxNorm hierarchies (more complete than UMLS)
- Check both RxNav and UMLS attributes for NDC codes (union of both sources)
- Parse drug names for dose forms and strengths (see `parseRxNormName` function)

### Vocabulary Mapping
- Always use `vocabularyMapping.ts` functions to convert between naming systems
- Never hardcode vocabulary name conversions
- UI uses Display Names, API uses UMLS codes, database uses OMOP vocabulary_id

### UI/UX
- Extensive use of Lucide React icons
- Tailwind CSS utility classes for styling
- Multi-step workflow: Search → View Atoms → Navigate Hierarchy → Build Code Set
- Progress indicators for long-running operations (large hierarchy fetches)

### TypeScript
- All UMLS data types are in `src/lib/types.ts`
- Use existing interfaces instead of `any` types
- Component props should have explicit type definitions

## Future Plans

- ✅ RxNorm hierarchy navigation (completed)
- ✅ NDC code mapping (completed)
- ✅ Dose form filtering (completed)
- ✅ Azure Static Web App deployment with API proxy (completed)
- 🔲 Complete "Saved Code Sets" functionality (database integration)
- 🔲 Code set export to CSV/JSON
- 🔲 User authentication
- 🔲 Sharing/collaboration features

## Environment Variables Required

**Server-side (Azure Functions)** — set in `api/local.settings.json` for local dev, or Azure Portal for production:
```
UMLS_API_KEY=your_umls_api_key_here
```

**UMLS API Key**: Obtain from [UTS Account](https://uts.nlm.nih.gov/uts/login)

**Note:** No `VITE_` prefixed env vars are used. The API key is never exposed to the browser.

## Domain-Specific Notes

### OMOP CDM Integration
This app is designed to support OMOP Common Data Model workflows:
- vocabulary_id values align with OMOP standard vocabularies
- Code sets can be exported for use in OMOP concept_id mappings
- Hierarchical relationships support concept ancestor/descendant tables

### Clinical Use Cases
- Building condition cohorts for research studies
- Creating drug formularies for EHR systems
- Mapping lab test panels to LOINC codes
- Standardizing procedure coding across systems

---

**Last Updated:** 2026-02-16 (Azure SWA refactor — removed Supabase, added API proxy)
**Update this file when major architectural changes occur!**
