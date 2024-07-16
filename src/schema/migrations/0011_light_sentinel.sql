ALTER TABLE "drops" ALTER COLUMN "tokens" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "drops" ADD COLUMN "maxDuration" integer DEFAULT 86400;--> statement-breakpoint
ALTER TABLE "drops" ADD COLUMN "winners" integer DEFAULT 11;