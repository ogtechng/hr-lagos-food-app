ALTER TABLE "applications" ADD COLUMN "cover_letter_url" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "cover_letter_file_name" varchar(255);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "cover_letter_storage_path" text;