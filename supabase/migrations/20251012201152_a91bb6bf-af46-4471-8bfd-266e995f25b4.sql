-- Corrigir verificar_login_lc com CAST explícito para evitar erro de tipo
CREATE OR REPLACE FUNCTION public.verificar_login_lc(email_input text, senha_input text)
RETURNS TABLE(usuario_id uuid, nome text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT u.id::uuid AS usuario_id,
           u.nome::text AS nome,
           u.email::text AS email
    FROM public.lc_usuarios u
    WHERE u.email = email_input 
    AND u.senha = md5(senha_input || 'salt_lista_compras');
END;
$function$;

-- Criar função para cadastro seguro que bypassa RLS
CREATE OR REPLACE FUNCTION public.cadastrar_usuario_lc(nome_input text, email_input text, senha_input text)
RETURNS TABLE(usuario_id uuid, nome text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Verifica se email já existe
  IF EXISTS (SELECT 1 FROM public.lc_usuarios WHERE email = email_input) THEN
    RAISE EXCEPTION 'EMAIL_JA_EXISTE' USING ERRCODE = '23505';
  END IF;

  RETURN QUERY
  INSERT INTO public.lc_usuarios (nome, email, senha)
  VALUES (nome_input, email_input, md5(senha_input || 'salt_lista_compras'))
  RETURNING id::uuid AS usuario_id, nome::text, email::text;
END;
$function$;

-- Garantir constraint UNIQUE no email (idempotente)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'lc_usuarios_email_key'
  ) THEN
    ALTER TABLE public.lc_usuarios ADD CONSTRAINT lc_usuarios_email_key UNIQUE (email);
  END IF;
END $$;

-- Conceder permissões de execução para as roles do Supabase
GRANT EXECUTE ON FUNCTION public.verificar_login_lc(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cadastrar_usuario_lc(text, text, text) TO anon, authenticated;