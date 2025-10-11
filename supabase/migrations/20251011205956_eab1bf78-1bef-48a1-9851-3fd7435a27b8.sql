-- Atualizar todas as senhas existentes para usar o novo hash MD5
-- Importante: Esta migração assume que as senhas estão em texto plano ou em hash antigo
-- Se você tiver senha 'rrs007', ela será convertida para o novo formato

-- Como não sabemos a senha original, vamos precisar resetar senhas
-- Vamos criar uma senha temporária padrão para usuários existentes

UPDATE public.lc_usuarios
SET senha = md5('senha123' || 'salt_lista_compras')
WHERE senha IS NOT NULL;