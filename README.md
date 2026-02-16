# UMLS Code Set Builder

A web application for searching UMLS medical terminologies and building custom code sets. Deployed as an Azure Static Web App with Azure Functions API proxy.

## Features

- Search across 12+ UMLS medical terminologies (ICD-10-CM, SNOMED CT, RxNorm, LOINC, CPT, etc.)
- Explore hierarchical relationships (ancestors/descendants)
- Navigate RxNorm drug hierarchies with NDC code mapping
- Build domain-specific code sets (conditions, drugs, measurements, procedures, observations)
- Export code sets to TXT format

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Hosting**: Azure Static Web Apps
- **API Proxy**: Azure Functions (Node.js) — protects UMLS API key server-side
- **External APIs**: UMLS Terminology Services (NLM), RxNav (NLM)

## Project Structure

```
mcsbumls/
├── src/
│   ├── components/
│   │   └── UMLSSearch.tsx       # Primary search & build interface
│   ├── lib/
│   │   ├── api.ts               # API client (calls /api/umls and /api/rxnav proxy)
│   │   ├── types.ts             # TypeScript type definitions
│   │   └── vocabularyMapping.ts # UMLS ↔ OMOP ↔ UI vocabulary name mapping
│   ├── App.tsx                  # Main application component
│   └── index.css                # Global styles with Tailwind
├── api/                         # Azure Functions (API proxy)
│   ├── src/functions/
│   │   ├── umlsProxy.ts        # Proxies /api/umls/* → NLM UMLS API (injects API key)
│   │   └── rxnavProxy.ts       # Proxies /api/rxnav/* → NLM RxNav API
│   ├── package.json
│   ├── host.json
│   └── tsconfig.json
├── staticwebapp.config.json     # Azure SWA routing config
└── public/                      # Static assets
```

## Setup

### Prerequisites

- Node.js 20+
- UMLS API key ([UTS Account](https://uts.nlm.nih.gov/uts/login))
- Azure Functions Core Tools (for local API development): `npm i -g azure-functions-core-tools@4`

### Install Dependencies

```bash
npm install
cd api && npm install && cd ..
```

### Configure Environment

Copy your UMLS API key to the Azure Functions local settings:

```bash
# Edit api/local.settings.json and set your UMLS_API_KEY
```

### Run Development Server

Start both the frontend and API proxy in separate terminals:

```bash
# Terminal 1: Frontend (port 5173)
npm run dev

# Terminal 2: API proxy (port 7071)
npm run dev:api
```

The frontend Vite dev server proxies `/api/*` requests to the Azure Functions runtime on port 7071.

## Deployment (Azure Static Web Apps)

### Environment Variables

Set in Azure Portal > Static Web App > Configuration:

| Variable | Description |
|----------|-------------|
| `UMLS_API_KEY` | Your NLM UMLS API key (server-side only) |

### Deploy

Azure SWA can be connected to a GitHub repo for automatic deployments, or use the SWA CLI:

```bash
npm run build
cd api && npm run build && cd ..
swa deploy ./dist --api-location ./api
```

## License

MIT
