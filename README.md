# nestjs-api-template
A template for backend api's using NestJS

<img width="50" height="50" src="https://github.com/user-attachments/assets/42f7fa0e-02e2-43a6-b04e-ba3a10156429" />
<img width="50" height="50" src="https://github.com/user-attachments/assets/96442bf5-47cd-43a0-8d64-20b59c4e1aec" />
<img width="50" height="50" src="https://github.com/user-attachments/assets/56802a50-e6de-436e-9804-da75095887b4" />
<img width="50" height="50" src="https://github.com/user-attachments/assets/8d579f8b-f2f4-4906-b005-c9edf70ab58c" />

## DDD
Domain-driven design (DDD) is a major software design approach

DDD is against the idea of having a single unified model; instead it divides a large system into bounded contexts, each of which have their own model.

![image](https://github.com/user-attachments/assets/2cd72f1e-e124-4b27-b2a9-7bbb0837f003)



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
