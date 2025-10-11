-- Hash any plaintext passwords in lc_usuarios to make login work with crypt()
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='lc_usuarios') THEN
    UPDATE public.lc_usuarios
    SET senha = crypt(senha, gen_salt('bf'))
    WHERE senha IS NOT NULL AND senha NOT LIKE '$2%';
  END IF;
END $$;