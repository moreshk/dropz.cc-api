CREATE TABLE IF NOT EXISTS "spins" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"wallet_address" varchar(44) NOT NULL,
	"spin" integer NOT NULL,
	"points" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
