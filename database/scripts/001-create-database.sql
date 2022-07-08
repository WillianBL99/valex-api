CREATE TABLE companies (
	"id" SERIAL PRIMARY KEY,
	"name" TEXT NOT NULL UNIQUE,
  "apiKey" TEXT NOT NULL
);

CREATE TABLE employees (
  "id" SERIAL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "cpf" VARCHAR(11) NOT NULL,
  "email" TEXT NOT NULL,
  "companyId" INTEGER REFERENCES companies("id")
);

CREATE TYPE CARDS_TYPE AS ENUM ('credit', 'debit');

CREATE TABLE cards (
  "id" SERIAL PRIMARY KEY,
  "employeeId" INTEGER REFERENCES employees("id"),
  "number" TEXT NOT NULL UNIQUE,
  "cardholderName" TEXT NOT NULL,
  "securityCode" TEXT NOT NULL,
  "expirationDate" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "isVirtual" BOOLEAN NOT NULL DEFAULT false,
  "originalCardId" INTEGER NOT NULL REFERENCES cards("id"),
  "isBlocked" BOOLEAN NOT NULL DEFAULT false,
  "type" CARDS_TYPE NOT NULL
);

CREATE TYPE BUSINESSES_TYPE AS ENUM
('groceries', 'restaurants', 'transport', 'education', 'health');

CREATE TABLE businesses (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "type" BUSINESSES_TYPE NOT NULL
);

CREATE TABLE payments (
  "id" SERIAL PRIMARY KEY,
  "cardId" INTEGER NOT NULL REFERENCES cards("id"),
  "businessId" INTEGER NOT NULL REFERENCES businesses("id"),
  "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "amount" INTEGER NOT NULL
);

CREATE TABLE recharges (
  "id" SERIAL PRIMARY KEY,
  "cardId" INTEGER NOT NULL REFERENCES cards("id"),
  "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "amount" INTEGER NOT NULL
);