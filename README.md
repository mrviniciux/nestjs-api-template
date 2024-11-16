# nestjs-api-template
A template for backend api's using NestJS

![image](https://github.com/user-attachments/assets/42f7fa0e-02e2-43a6-b04e-ba3a10156429)


## Requirements

- Mysql >= 9
- Node >= 16


## Integrations and libs

* MySQL
* NestJS
* Passport JWT
* Sequelize
* Typescript
* Docker
* Eslint
* Prettier
* Jest

## Pre-existent endpoints and collections

![Screen Shot 2024-11-15 at 21 02 29](https://github.com/user-attachments/assets/377f8805-892f-4cae-9865-5e5ddbd1cb4b)

You can import those collections into your `postman` on misc/ folder

## Project setup

```bash
$ npm install
```

### .env

generate a .env file from .env.example

### run migrations and seeds

This project uses sequelize to ORM layer

execute the following commands to populate database

`CREATE DATABASE ecommerce;` make sure it's created before running migrations

`npm run db:migrate`

and finally

`npm run db:seed`
