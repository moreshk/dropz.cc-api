CREATE TABLE IF NOT EXISTS "referral" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"fee_wallet_address" varchar(256) NOT NULL,
	"fee_percentage" integer DEFAULT 30 NOT NULL,
	"token_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral" ADD CONSTRAINT "referral_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
