-- Align webhook event storage with the TypeORM entity.
-- duplicate_of_event_id stores provider event identifiers, not internal webhook UUIDs.

ALTER TABLE webhook_events
    DROP CONSTRAINT IF EXISTS webhook_events_duplicate_of_event_id_fkey;

ALTER TABLE webhook_events
    ALTER COLUMN duplicate_of_event_id TYPE VARCHAR(512)
    USING duplicate_of_event_id::text;

ALTER TABLE webhook_events
    ALTER COLUMN event_type TYPE VARCHAR(255);
