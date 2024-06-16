CREATE TABLE IF NOT EXISTS "tokens" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"address" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"symbol" varchar(256) NOT NULL,
	"decimals" integer NOT NULL,
	"image_url" text NOT NULL,
	"coingecko_id" varchar,
	"chain_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"password" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"salt" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "widgets" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"fee_wallet_address" varchar(256) NOT NULL,
	"fee_percentage" integer DEFAULT 30 NOT NULL,
	"widget_site" text,
	"token_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets" ADD CONSTRAINT "widgets_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets" ADD CONSTRAINT "widgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
