# Typescript starting backend

This project intends to provide a template for starting a typescript-express backend project from scratch as well as to include all boilerplate required when starting a new project as authorization and authentication features.

It includes prisma query builder (Because we want safe type checks on ts) for accessing/modifying database data and knex as database migration tool and auxiliary query builder for specialized tasks.

The reason for including knex is because prisma migration tool is not enough for running up and down migrations in a predictive way as well as the prisma raw builder is not as good as knex's is.

For code styling this project uses eslint rules from the standard config, airbnb and typescript-recommended but some rules are overwritten

The project include a folder structure based on data entities and REST patterns.

Feel free to clone and modify to your needs.

## instructions

1. Clone the project
2. `npm install`
3. `npm run dev or yarn dev`

For debugging run `npm run debug` or use vscode provided base vsconfig on folder .vscode


## tools

- Prisma (Query builder)
- Knex (Auxiliary Query builder and migration tool)
- eslint (linting and format tool)
- Express (web server)
- Log4js (logs)

Created by **Oscar Cruz**