## Project setup

```bash
npx @nestjs/cli new thai-health-product-server
```

```bash
yarn add -D prisma
yarn add @prisma/client
```

```bash
npx prisma init
```

- This command creates a new prisma directory with a schema.prisma file and a .env file for your database connection string.

```bash
nest generate module prisma
nest generate service prisma
```

```bash
npm install @prisma/adapter-pg pg
npm install -D @types/pg
```

```bash
npm install @nestjs/throttler @nestjs/serve-static
yarn add @nestjs/throttler @nestjs/serve-static
yarn add -D @types/node
```

- install @nestjs/config package

```bash
yarn add @nestjs/config
```

- To add class validation in NestJS: class-validator (to define the rules) and class-transformer (to convert plain objects into class instances).

```bash
yarn add class-validator class-transformer
```

```bash
yarn add @nestjs/config class-validator class-transformer
```

- update `main.ts` to enable global validation

- Generate Client: Run this whenever you change your schema

```bash
npx prisma generate
```

```bash
npx prisma studio

```

- Get a free hosted Postgres database in seconds:

```bash
npx create-db
```

#### Migration Command:

```bash
npx prisma migrate dev --name write-modification-creation
```

- stop if server is running and run

```bash
npx prisma generate
```

```bash
yarn add @nestjs/swagger swagger-ui-express
```

<!-- ? ========= COMMAND TO CRETE ALL FOLDERS OF A MODULE  ========== -->

```bash
# Generate the Module
nest generate module modules/user

# Generate the Controller
nest generate controller modules/user --no-spec

# Generate the Service
nest generate service modules/user --no-spec

# Create the Repository manually (Nest CLI doesn't have a repo command)
touch src/modules/user/user.repository.ts

# Create the DTO folder and files
mkdir src/modules/user/dto
touch src/modules/user/dto/create-user-multipart.dto.ts
touch src/modules/user/dto/user-response.dto.ts
```

```bash
nest generate module modules/session
nest generate controller modules/session
nest generate service modules/session
```

#### JSON Web Token

```bash
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
```

```bash

```

```bash
$ yarn install
```

#### Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

#### Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

#### DB URL

- DATABASE_URL="postgresql://root:password@localhost:5432/thai_health_db"
- DATABASE_URL="postgresql://root:samiha25@localhost:5432/thp_ecommerce"

#### Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- This is your Prisma schema file, learn more about it in the docs: [Doc](https://pris.ly/d/prisma-schema)

#### Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


- to remove node modules

```bash
Remove-Item -Recurse -Force node_modules
```