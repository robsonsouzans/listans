-- Criar funções de autenticação que funcionem sem pgcrypto
-- Usar MD5 simples para hash (menos seguro mas funcional para demonstração)

CREATE OR REPLACE FUNCTION public.criptografar_senha_lc(senha_texto text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Usar MD5 com salt simples para hash da senha
    RETURN md5(senha_texto || 'salt_lista_compras');
END;
$$;

CREATE OR REPLACE FUNCTION public.verificar_login_lc(email_input text, senha_input text)
RETURNS TABLE(usuario_id uuid, nome text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nome, u.email
    FROM public.lc_usuarios u
    WHERE u.email = email_input 
    AND u.senha = md5(senha_input || 'salt_lista_compras');
END;
$$;