CREATE TABLE IF NOT EXISTS "drops" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"token_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"tokens" integer DEFAULT 0,
	"listing" boolean DEFAULT true
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drops" ADD CONSTRAINT "drops_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
