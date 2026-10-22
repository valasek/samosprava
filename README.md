# Bratislava and Stupava Self-Government Elections 2026 – Voter Guide

A simple, mobile-first web guide for voters in Bratislava and Stupava for the combined municipal and regional elections on **Saturday 24 October 2026**.

It explains what is elected, how, where and when to vote, and where to find the results. It lists the candidates with filtering, to help undecided voters decide and to prevent mistakes when voting.

- Languages: Slovak, English, Hungarian, Czech, Russian, Ukrainian, Vietnamese, Rusyn
- Scope: Bratislava with its city districts, and the town of Stupava
- Live at: https://samosprava.stanislavvalasek.com
- Stack: Astro (static site), JSON data, deployed to Netlify on git push

See [docs/plan.md](docs/plan.md) for scope, decisions and the realization plan.

## Run locally

### With a dev container (recommended)

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or another running Docker-compatible engine), [VS Code](https://code.visualstudio.com/), and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

1. Clone this repository and open its folder in VS Code.
2. Run **Dev Containers: Reopen in Container** from the Command Palette. The container provides Node.js 22 and installs dependencies with `npm ci` on creation.
3. In the VS Code terminal inside the container, start Astro:

	```sh
	npm run dev -- --host 0.0.0.0
	```

4. Open http://localhost:4321. Port 4321 is forwarded to your machine automatically; if VS Code assigns a different local port, use the URL in the **Ports** panel.

### Without a container

Install [Node.js](https://nodejs.org/) 22 or newer (including npm), then run these commands from the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. Astro reloads the page as you edit source files. Stop the server with `Ctrl+C`.

### Build and preview

```sh
npm run build
npm run preview
```

The static site is generated in `dist/`. Preview it at http://localhost:4321. Inside the dev container, use `npm run preview -- --host 0.0.0.0` instead.

Author: Stanislav Valasek
