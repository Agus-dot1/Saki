/*
  # Add variant support to orders system

  1. Schema Changes
    - Add variant_details JSONB column to order_items table
    - Add variant_label TEXT column to order_items table
    - Add kit_items JSONB column to order_items table for storing kit item details

  2. Indexes
    - Add GIN index on variant_details for efficient querying
    - Add index on variant_label for text searches

  3. Functions
    - Add function to extract variant information from JSONB
*/

-- Add variant support columns to order_items table
DO $$
BEGIN
  -- Add variant_details column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'variant_details'
  ) THEN
    ALTER TABLE order_items ADD COLUMN variant_details JSONB;
  END IF;

  -- Add variant_label column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'variant_label'
  ) THEN
    ALTER TABLE order_items ADD COLUMN variant_label TEXT;
  END IF;

  -- Add kit_items column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'kit_items'
  ) THEN
    ALTER TABLE order_items ADD COLUMN kit_items JSONB;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_items_variant_details 
ON order_items USING GIN (variant_details);

CREATE INDEX IF NOT EXISTS idx_order_items_variant_label 
ON order_items (variant_label);

-- Function to extract variant information for display
CREATE OR REPLACE FUNCTION get_variant_display(variant_details JSONB)
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  parts TEXT[] := '{}';
BEGIN
  IF variant_details IS NULL THEN
    RETURN NULL;
  END IF;

  -- Add model if exists
  IF variant_details->>'model' IS NOT NULL THEN
    parts := array_append(parts, 'Modelo: ' || (variant_details->>'model'));
  END IF;

  -- Add size if exists
  IF variant_details->>'size' IS NOT NULL THEN
    parts := array_append(parts, 'Talle: ' || (variant_details->>'size'));
  END IF;

  -- Add color if exists (without prefix)
  IF variant_details->>'color' IS NOT NULL THEN
    parts := array_append(parts, variant_details->>'color');
  END IF;

  -- Add tone if exists
  IF variant_details->>'tone' IS NOT NULL THEN
    parts := array_append(parts, 'Tono: ' || (variant_details->>'tone'));
  END IF;

  IF array_length(parts, 1) > 0 THEN
    result := array_to_string(parts, ' | ');
  END IF;

  RETURN NULLIF(result, '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to format kit items for display
CREATE OR REPLACE FUNCTION format_kit_items(kit_items JSONB)
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  item JSONB;
  item_text TEXT;
  parts TEXT[] := '{}';
BEGIN
  IF kit_items IS NULL OR jsonb_array_length(kit_items) = 0 THEN
    RETURN NULL;
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(kit_items)
  LOOP
    item_text := item->>'name';
    
    -- Add quantity if > 1
    IF (item->>'quantity')::INTEGER > 1 THEN
      item_text := item_text || ' x' || (item->>'quantity');
    END IF;
    
    -- Add color and size if they exist
    IF item->>'color' IS NOT NULL OR item->>'size' IS NOT NULL THEN
      item_text := item_text || ' (' || 
        COALESCE(item->>'color', '') || 
        CASE WHEN item->>'color' IS NOT NULL AND item->>'size' IS NOT NULL THEN ', ' ELSE '' END ||
        COALESCE(item->>'size', '') || ')';
    END IF;
    
    parts := array_append(parts, '– ' || item_text);
  END LOOP;

  IF array_length(parts, 1) > 0 THEN
    result := array_to_string(parts, E'\n');
  END IF;

  RETURN NULLIF(result, '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing order_items to have empty variant_details if NULL
UPDATE order_items 
SET variant_details = '{}'::JSONB 
WHERE variant_details IS NULL;

-- Add comment to document the new columns
COMMENT ON COLUMN order_items.variant_details IS 'JSONB object containing variant information like model, size, color, tone';
COMMENT ON COLUMN order_items.variant_label IS 'Human-readable variant label for display purposes';
COMMENT ON COLUMN order_items.kit_items IS 'JSONB array containing kit item details with their variants';