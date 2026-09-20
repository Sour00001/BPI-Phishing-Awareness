# BPI Phishing Awareness Simulation

> A cybersecurity awareness and phishing-simulation project designed to demonstrate how convincing financial-service login pages can be used as social-engineering lures.

## ⚠️ Security & Ethical Use Notice

**This project is intended strictly for authorized cybersecurity education, phishing-awareness training, demonstrations, and controlled security exercises.**

It must **not** be used to impersonate BPI or any other financial institution against real users, collect real banking credentials, distribute malicious links, or conduct unauthorized social-engineering campaigns.

Only use this project in an environment where you have explicit authorization from the participants and system owner.

**Do not enter real banking credentials, passwords, OTPs, card information, or other sensitive information into this application.**

---

## Overview

**BPI Phishing Awareness Simulation** is a web-based cybersecurity training project that demonstrates the visual and technical characteristics of a financial-service phishing page.

The project is designed to help students, cybersecurity learners, and security-awareness participants understand how phishing pages can imitate familiar financial interfaces and potentially deceive users into interacting with fraudulent forms.

The project uses a modern web application stack with a React/Vite frontend and an Express-based server/API layer. The repository also contains MongoDB/Mongoose-related dependencies and a local server configuration.

The repository is publicly available on GitHub:

**Repository:**
https://github.com/Sour00001/BPI

---

## Purpose

The primary purpose of this project is **security education**.

It can be used to demonstrate:

* Phishing awareness
* Social-engineering concepts
* Visual impersonation techniques
* Fake login-page indicators
* User awareness and verification habits
* Secure handling of credentials
* Risks associated with clicking unfamiliar links
* Why users should verify website domains before entering sensitive information

The project should only be demonstrated in an authorized and controlled environment.

---

## Learning Objectives

This project can help learners understand:

1. How phishing pages can imitate familiar websites.
2. Why visual similarity does not guarantee website authenticity.
3. How attackers can use familiar branding and interface patterns as social-engineering techniques.
4. Why users should inspect the website address before signing in.
5. Why credentials should never be entered into an unverified website.
6. How security-awareness exercises can demonstrate phishing risks without targeting real users.

---

## Technology Stack

The repository currently uses the following technologies based on its project configuration:

### Frontend

* React 19
* React DOM
* Vite
* TypeScript
* Tailwind CSS
* Tailwind CSS Vite integration
* Lucide React
* Motion

### Backend

* Node.js
* Express
* TypeScript
* TSX

### Database / Data Layer

* MongoDB
* Mongoose

### Development

* Vite development server
* TypeScript
* npm
* Git/GitHub

The repository's `package.json` defines scripts for Vite development, a local Express server, production builds, previewing the build, cleaning the build output, and TypeScript checking.

---

## Architecture

At a high level, the project is structured around a React frontend and an Express server/API layer.

```text
                    ┌──────────────────────┐
                    │      Web Browser      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Frontend     │
                    │       + Vite          │
                    └──────────┬───────────┘
                               │
                               │ API Requests
                               ▼
                    ┌──────────────────────┐
                    │    Express Server     │
                    │      / API Layer      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Data / Database     │
                    │  MongoDB / Mongoose   │
                    └──────────────────────┘
```

The repository includes both an `api/` directory and server entry points, including `server.ts` and `local-server.ts`.

---

## Project Structure

The current repository contains the following major components:

```text
BPI/
├── api/
├── src/
├── index.html
├── local-server.ts
├── server.ts
├── metadata.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── test-mongo.js
├── users.db
└── README.md
```

### `src/`

Contains the frontend application source code.

### `api/`

Contains the server/API-related implementation.

### `server.ts`

Contains the Express server implementation and server-side functionality.

### `local-server.ts`

Provides a local development entry point that imports the API application and starts an Express server. The configured port defaults to `3000` when no `PORT` environment variable is supplied.

### `index.html`

The main HTML entry point used by the Vite frontend.

### `vite.config.ts`

Vite configuration for the frontend development and build process.

### `vercel.json`

Deployment-related configuration for Vercel.

### `test-mongo.js`

Database-related testing/connection utility.

### `users.db`

A database-related file included in the repository. **Do not place real user credentials or sensitive personal information in this file.**

---

## Installation

### Prerequisites

Install the following before running the project:

* Node.js
* npm
* Git

If database functionality is being used, configure the required MongoDB environment separately.

---

## Clone the Repository

```bash
git clone https://github.com/Sour00001/BPI.git
cd BPI
```

---

## Install Dependencies

```bash
npm install
```

The project uses npm dependencies defined in `package.json`.

---

## Development

Start the Vite development environment:

```bash
npm run dev
```

For the local Express server:

```bash
npm run dev:server
```

The repository defines `dev` as the Vite development command and `dev:server` as the local server command.

The local server uses:

```text
http://localhost:3000
```

by default when `PORT` is not configured.

---

## Production Build

Create a production frontend build:

```bash
npm run build
```

Preview the generated build:

```bash
npm run preview
```

The project also provides a clean command:

```bash
npm run clean
```

and a TypeScript check:

```bash
npm run lint
```

These commands are defined in the repository's `package.json`.

---

## Environment Variables

If the application requires environment variables, configure them locally rather than committing sensitive values to GitHub.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

### Never commit:

```text
.env
.env.local
.env.production
```

or files containing:

* Database passwords
* API keys
* Authentication secrets
* Access tokens
* Private keys
* Real banking credentials
* Personal information

Use placeholder values when documenting environment variables.

---

## Phishing Simulation Concept

The project demonstrates a common phishing scenario:

```text
Potential Victim
       │
       ▼
Suspicious Link
       │
       ▼
Imitation Login Page
       │
       ▼
User Interaction
       │
       ▼
Security Awareness Point
```

The important lesson is that a page can look familiar while still being hosted on an unauthorized domain.

Users should therefore verify:

* The domain name
* HTTPS and browser security indicators
* The source of the link
* Unexpected login requests
* Requests for sensitive information
* Suspicious messages or emails
* Unusual URLs or redirects

---

## Recommended Training Scenario

For an authorized classroom or security-awareness demonstration:

1. Explain that the website is a controlled simulation.
2. Provide participants with the appropriate training instructions.
3. Use only test accounts or dummy information.
4. Never request actual banking credentials.
5. Do not collect real passwords or OTPs.
6. Do not distribute the simulation outside the authorized environment.
7. Explain the phishing indicators after the demonstration.
8. Teach participants how to identify and report suspicious websites.

The purpose of the exercise should be **learning and awareness**, not credential acquisition.

---

## Safe Data Policy

This project should use **dummy data only**.

Example:

```text
Username: training-user
Password: NOT-A-REAL-PASSWORD
```

Do not use:

```text
Real BPI account credentials
Real banking passwords
Real OTPs
Real card numbers
Real PINs
Real customer information
```

Any database used for demonstrations should contain synthetic training data.

---

## Security Considerations

Because this project represents a phishing-style interface, additional care should be taken when running or demonstrating it.

### Do

* Run it in a controlled environment.
* Use dummy accounts.
* Obtain authorization before demonstrations.
* Clearly identify the exercise to organizers.
* Keep collected training data non-sensitive.
* Remove unnecessary data after the exercise.

### Do Not

* Target real banking customers.
* Send unsolicited phishing messages.
* Attempt to obtain real credentials.
* Capture real passwords or OTPs.
* Impersonate a financial institution for fraudulent purposes.
* Use the application for unauthorized credential harvesting.
* Deploy the application against people who have not consented to the exercise.

---

## Responsible Disclosure

If you discover a security issue in this educational project, avoid publishing sensitive details that could facilitate misuse.

Instead:

1. Document the issue.
2. Reproduce it only in an authorized environment.
3. Notify the project owner privately.
4. Provide enough information to reproduce and fix the issue.
5. Avoid exposing credentials or personal information.

---

## Disclaimer

This project is an **educational cybersecurity simulation**.

The project is not affiliated with, sponsored by, or endorsed by BPI or any other financial institution unless explicitly stated by the project owner.

The use of financial institution names, visual references, or related concepts in a training simulation does not establish an affiliation with the organization being represented.

The author is not responsible for unauthorized, fraudulent, malicious, or illegal use of this project.

Users are responsible for complying with applicable laws, regulations, institutional policies, and authorization requirements.

---

## Project Status

**Status:** Educational / Cybersecurity Training Project

The repository is publicly available on GitHub and currently contains the application's frontend, API/server components, configuration files, and supporting development files.

---

## License

No specific open-source license is currently identified from the repository information reviewed.

If this project is intended to be publicly reusable, add an appropriate license after confirming the licensing requirements for the project and any third-party assets.

---

## Author

**Sour00001**

GitHub:

https://github.com/Sour00001

Project repository:

https://github.com/Sour00001/BPI

---

## Final Reminder

> **Use this project to teach people how to recognize phishing — never to steal credentials.**

Cybersecurity training is most effective when simulations are conducted with authorization, dummy data, and clear educational objectives.
