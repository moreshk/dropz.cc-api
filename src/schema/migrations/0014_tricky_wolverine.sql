CREATE TABLE IF NOT EXISTS "bumps" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"token_address" varchar(256) NOT NULL,
	"user_wallet_address" varchar(44) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
