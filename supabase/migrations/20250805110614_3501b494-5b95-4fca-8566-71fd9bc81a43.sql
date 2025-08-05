-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('BOLO', '911_CALL', 'CUSTOM')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')) DEFAULT 'MEDIUM',
  custom_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (since this is a dispatch system)
CREATE POLICY "Allow all operations on notes" 
ON public.notes 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the existing sample data
INSERT INTO public.notes (type, title, description, priority, custom_type) VALUES
('BOLO', 'Suspect Vehicle - Blue Sedan', 'License plate ABC-123, wanted in connection with robbery on Main Street', 'HIGH', NULL),
('911_CALL', 'Domestic Disturbance', 'Caller reports loud argument at 456 Oak Avenue, multiple units requested', 'MEDIUM', NULL),
('CUSTOM', 'Traffic Advisory', 'Road closure on Highway 101 due to construction, expect delays', 'LOW', 'Traffic');