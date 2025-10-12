-- Adicionar constraint UNIQUE no email se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'lc_usuarios_email_key'
  ) THEN
    ALTER TABLE public.lc_usuarios ADD CONSTRAINT lc_usuarios_email_key UNIQUE (email);
  END IF;
END $$;

-- Recriar função verificar_login_lc para retornar id como usuario_id
CREATE OR REPLACE FUNCTION public.verificar_login_lc(email_input text, senha_input text)
RETURNS TABLE(usuario_id uuid, nome text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT u.id AS usuario_id, u.nome, u.email
    FROM public.lc_usuarios u
    WHERE u.email = email_input 
    AND u.senha = md5(senha_input || 'salt_lista_compras');
END;
$function$;