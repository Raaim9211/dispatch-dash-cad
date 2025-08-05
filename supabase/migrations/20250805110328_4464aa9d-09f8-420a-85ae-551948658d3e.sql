-- Create calls table
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'PENDING', 'CLOSED')) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create units table
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_number TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'BUSY', 'OUT_OF_SERVICE')) DEFAULT 'AVAILABLE',
  location TEXT NOT NULL,
  officer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (since this is a dispatch system)
CREATE POLICY "Allow all operations on calls" 
ON public.calls 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on units" 
ON public.units 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON public.calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();