# Janus Frontend

Repository for the Janus FE app build with react

## Project Setup

Once you downloaded this project first run `pnpm intall` command to get all the needed dependencies.

In case you don't have pnpm you will need to install it, in most of the cases and if you already have npm `npm install -g pnpm` should work, you can also read https://pnpm.io/installation for help.

You will also need to create an `.env` file using `.env.example` as reference, you can alse have multilpe .env files for different environements or modes, more info on https://vitejs.dev/guide/env-and-mode

## Running Project

After install all the dependencies you should be able to run the project locally using the command `pnpm dev`

A local server will start running at http://localhost:3000/ in case the port is available

## Additional Validations

This project includes linter tools to avoid different code styles, the available commands are:

- validate: Run all the static validations including linters
- lint:all: Run eslint over all the files to get warnings and errors
- format:check: Run prettier over all the files to get warnings and errors
- format:write: Run prettier over all the files to overwrite failing files if posible
