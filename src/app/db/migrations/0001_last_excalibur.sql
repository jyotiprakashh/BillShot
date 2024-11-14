ALTER TABLE "bank_info" ALTER COLUMN "account_number" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "customer_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "total_amount" SET DATA TYPE numeric;