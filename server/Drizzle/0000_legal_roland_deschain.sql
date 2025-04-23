CREATE TABLE "sensor_data" (
	"timestamp" timestamp with time zone PRIMARY KEY DEFAULT now() NOT NULL,
	"temperature" real,
	"humidity" real,
	"device_id" serial NOT NULL
);
