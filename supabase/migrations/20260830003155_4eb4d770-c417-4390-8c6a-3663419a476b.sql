CREATE TABLE public.teste (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teste TO authenticated;
GRANT ALL ON public.teste TO service_role;

ALTER TABLE public.teste ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own teste records"
ON public.teste
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_teste_updated_at
BEFORE UPDATE ON public.teste
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();