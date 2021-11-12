# TypeScript Next.js

This is a really simple project that shows the usage of Next.js with TypeScript.

## Notes

This example shows how to integrate the TypeScript type system into Next.js. Since TypeScript is supported out of the box with Next.js, all we have to do is to install TypeScript.

```
npm install --save-dev typescript
```

To enable TypeScript's features, we install the type declarations for React and Node.

```
npm install --save-dev @types/react @types/react-dom @types/node
```

When we run `next dev` the next time, Next.js will start looking for any `.ts` or `.tsx` files in our project and builds it. It even automatically creates a `tsconfig.json` file for our project with the recommended settings.

Next.js has built-in TypeScript declarations, so we'll get autocompletion for Next.js' modules straight away.

A `type-check` script is also added to `package.json`, which runs TypeScript's `tsc` CLI in `noEmit` mode to run type-checking separately. You can then include this, for example, in your `test` scripts.


## Getting Started

### Prerequisites
You will need to have the following installed:
- git
- make
- NodeJS v14 LTS
- Docker and docker-compose

Install Docker and docker-compose on Ubuntu 20+
```
sudo apt update
sudo apt install docker.io docker-compose make curl git
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install nodejs
```
### Set environment for database

```
$ export DATABASE_URL=postgres://root:password@postgres_db:5432/postgres_db

or

$ export POSTGRES_HOST=localhost
$ export POSTGRES_PORT=5432
$ export POSTGRES_USER=root
$ export POSTGRES_PASSWORD=password
$ export POSTGRES_DB=postgres_db
```

### How to Start Production

```
$ export NODE_ENV=production
$ export DOMAIN=demo.com
$ export SESSION_SECRET=TopSecret
$ export COOKIE_NAME=demo

# Bootstrap docker (reset and rebuild)
$ export DOCKER_GID=$(id -g)
$ export DOCKER_UID=$(id -u)
# sudo make bootstrap

# Start docker
$ make up

# Stop docker
$ make down
```

### Developer guide

```
$ export DOCKER_GID=$(id -g)
$ export DOCKER_UID=$(id -u)
$ make dev
```

## Structured Tree with Clean Architecture
```
├── app                     (Application Layer)
│   ├── config
│   │   └── index.js
│   ├── data
│   │   ├── README.md
│   │   └── sample-data.ts
│   ├── helpers
│   └── views
│       ├── components
│       ├── layouts
│       └── scss
├── data
├── docker-compose.yml
├── Dockerfile
├── domain                  (Domain Layer)
│   ├── models
│   ├── presenters
│   │   └── README.md
│   ├── repositories
│   │   ├── eloquents
│   │   ├── interfaces
│   │   └── README.md
│   ├── services
│   ├── transformers
│   └── validators
├── infrastructure          (Infrastructure Layer)
│   ├── console
│   ├── db
│   ├── events
│   ├── exceptions
│   ├── helpers
│   ├── jobs
│   ├── listeners
│   ├── providers
│   └── services
├── Makefile
├── next-env.d.ts
├── package.json
├── pages
│   ├── api
│   │   └── users
│   └── index.tsx
├── public
│   ├── favicon.ico
│   ├── robots.txt
│   └── vercel.svg
├── README.md
├── tsconfig.json
└── yarn.lock
```
