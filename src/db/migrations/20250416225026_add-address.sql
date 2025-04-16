CREATE TABLE "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash" text NOT NULL,
	"street" text NOT NULL,
	"street2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "address_id" uuid;--> statement-breakpoint
CREATE INDEX "address_hash_idx" ON "address" USING btree ("hash");--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_index" ON "users" USING btree ("email");