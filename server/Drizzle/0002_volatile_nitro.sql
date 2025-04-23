CREATE TYPE "public"."relay_state" AS ENUM('ON', 'OFF');--> statement-breakpoint
CREATE TABLE "relay_switches" (
	"id" serial PRIMARY KEY NOT NULL,
	"relay1" "relay_state" NOT NULL
);
