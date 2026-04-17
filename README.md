## Project Setup

```bash
npx @nestjs/cli new nest-prisma-postgres-codebase -p yarn

yarn add @prisma/client @nestjs/config class-validator class-transformer @nestjs/swagger swagger-ui-express
yarn add -D prisma @types/node

npx prisma init

nest generate module prisma
nest generate service prisma --no-spec

yarn add -D @types/jest
```

- add this line in `tsconfig.json` file:

```bash
{
  "compilerOptions": {
    // ... other settings
    "types": ["node", "jest"]
  }
}
```

- module creation:

```bash
# Generate standard Nest files
nest generate module modules/user
nest generate controller modules/user --no-spec
nest generate service modules/user --no-spec

# Create the Repository and DTOs
New-Item -ItemType Directory -Path "src/modules/user/dto"
New-Item -Path "src/modules/user/user.repository.ts"
New-Item -Path "src/modules/user/dto/create-user.dto.ts"
```

```bash
# Generate standard Nest files
nest generate module modules/user
nest generate controller modules/user
nest generate service modules/user

# Create the Repository and DTOs
New-Item -ItemType Directory -Path "src/modules/user/dto"
New-Item -Path "src/modules/user/user.repository.ts"
New-Item -Path "src/modules/user/dto/create-user.dto.ts"
```

### git user config

```bash
git config --global user.name "QuaziSamiha"
git config --global user.email "quazi.samiha4@gmail.com"
```
