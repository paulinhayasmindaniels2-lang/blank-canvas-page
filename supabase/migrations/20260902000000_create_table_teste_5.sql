CREATE TABLE IF NOT EXISTS public.teste_5 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teste_5 TO authenticated;
GRANT ALL ON public.teste_5 TO service_role;

ALTER TABLE public.teste_5 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own teste_5 records" ON public.teste_5;
CREATE POLICY "Users can manage their own teste_5 records"
ON public.teste_5
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_teste_5_updated_at
BEFORE UPDATE ON public.teste_5
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
