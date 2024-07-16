ALTER TABLE "drops" ALTER COLUMN "tokens" SET DEFAULT 11;--> statement-breakpoint
ALTER TABLE "drops" ADD COLUMN "start_time" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "drops" ADD COLUMN "exhausted" boolean DEFAULT false;