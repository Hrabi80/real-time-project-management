

## Description

An real time project management application using NestJs and typeORM
## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version 14 or above, version 18 is recommended) 
- **npm** (Node Package Manager)
- **MySQL**  database server


## Project setup

### 1. Clone the Repository

```bash
git clone https://github.com/Hrabi80/real-time-project-management.git
cd real-time-project-management
## Compile and run the project
```
### 2. Install dependencies

```bash
$ npm install
```
### 3. configure your local environment variables

-configure your .env file ,(you can configure it based on env.example)
-Ensure your MySQL or PostgreSQL server is running. Create a database  and the entities will be synchronized automatically if you have synchronize: true in your TypeORM configuration in file config/typeorm.config.ts.


### 4. Run the project
```bash
# development
$ nest start

# watch mode
$ nest start --watch

# production mode
$ npm run start:prod

```

## API Documentation
The application includes Swagger API documentation. You can access it at: 
```bash
http://localhost:3000/api/documentation
```
## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
