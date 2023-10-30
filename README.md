# Task Management API

This Task Management System is a web application built using NestJS, TypeScript, Prisma, and Docker. It allows you to manage tasks, organize them in lists, add tags, and create subtasks. Below, you will find information on setting up, running, and using this application.

## Getting Started
These instructions will help you set up and run the Task Management System on your local machine.

### Prerequisites
Make sure you have the following tools installed on your machine:

- Node.js
- Docker
### Installation
1. Clone the repository:

```shell
git clone https://github.com/helioLJ/task-management-api
cd task-management-api
```
2. Install project dependencies:

```shell
npm install
```

3. Create a .env and .env.test file in the project root and configure the environment variables as needed. You may want to configure the database connection settings and other environment-specific variables.

```shell
DATABASE_URL= // take this URL from docker-compose file
JWT_SECRET= // your secret
```

### Running the Application
To start the application, run the following commands:

```shell
# Start the PostgreSQL database in a Docker container
npm run db:dev:up

# Run the NestJS application
npm run start:dev
```

The application should now be accessible at http://localhost:3000.


### Database Migration
If you make changes to the data model (e.g., add new tables or modify existing ones), you can create a new database migration using Prisma. After making the changes, run the following commands:

```shell
# Generate a new migration
npm run prisma:dev:deploy
```

## API Documentation
The application provides an API with several endpoints for managing tasks, lists, tags, and subtasks. You can explore the API documentation by accessing the Swagger UI at http://localhost:3000/api.

## Usage
Once the application is up and running, you can use it to manage your tasks, lists, tags, and subtasks. Here are some of the key features:

- Tasks: Create, update, and delete tasks. Assign due dates, tags, and organize them into lists.
- Lists: Organize your tasks into lists for better task management.
- Tags: Add and manage tags to categorize your tasks and make them easier to find.
- Subtasks: Create subtasks for more detailed task management.
