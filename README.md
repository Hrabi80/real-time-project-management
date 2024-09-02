

## Description

A real-time project management application using NestJS and TypeORM.
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

```
### 2. Install dependencies

```bash
$ npm install
```
### 3. configure your local environment variables

- Configure your `.env` file (you can use `.env.example` as a reference).
- Ensure your MySQL server is running.
- Create a database, and the entities will be synchronized automatically if you have `synchronize: true` in your TypeORM configuration (located in `config/typeorm.config.ts`).



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
$ npm run test -- --config=jest.config.js

```
