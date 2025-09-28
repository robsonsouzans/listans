-- Fase 1: Criação das tabelas com prefixo lc_

-- Tabela de usuários
CREATE TABLE public.lc_usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de listas de compras
CREATE TABLE public.lc_listas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  usuario_id UUID NOT NULL REFERENCES public.lc_usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de grupos
CREATE TABLE public.lc_grupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cor VARCHAR(10) NOT NULL DEFAULT '#3B82F6',
  icone VARCHAR(50) NOT NULL DEFAULT 'ShoppingCart',
  lista_id UUID NOT NULL REFERENCES public.lc_listas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de produtos/itens
CREATE TABLE public.lc_produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  unidade VARCHAR(50) NOT NULL DEFAULT 'un',
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  comprado BOOLEAN NOT NULL DEFAULT false,
  grupo_id UUID NOT NULL REFERENCES public.lc_grupos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de compartilhamento de listas
CREATE TABLE public.lc_compartilhadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lista_id UUID NOT NULL REFERENCES public.lc_listas(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.lc_usuarios(id) ON DELETE CASCADE,
  permissao VARCHAR(20) NOT NULL DEFAULT 'edit',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lista_id, usuario_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.lc_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lc_listas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lc_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lc_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lc_compartilhadas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lc_usuarios (usuários podem ver/editar apenas seus próprios dados)
CREATE POLICY "Usuários podem ver seus próprios dados" 
ON public.lc_usuarios 
FOR ALL 
USING (id = auth.uid());

-- Políticas RLS para lc_listas (usuários podem ver listas próprias ou compartilhadas)
CREATE POLICY "Usuários podem ver suas listas" 
ON public.lc_listas 
FOR ALL 
USING (
  usuario_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.lc_compartilhadas 
    WHERE lista_id = lc_listas.id AND usuario_id = auth.uid()
  )
);

-- Políticas RLS para lc_grupos
CREATE POLICY "Usuários podem ver grupos de suas listas" 
ON public.lc_grupos 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.lc_listas 
    WHERE id = lc_grupos.lista_id AND (
      usuario_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM public.lc_compartilhadas 
        WHERE lista_id = lc_listas.id AND usuario_id = auth.uid()
      )
    )
  )
);

-- Políticas RLS para lc_produtos
CREATE POLICY "Usuários podem ver produtos de suas listas" 
ON public.lc_produtos 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.lc_grupos g
    JOIN public.lc_listas l ON g.lista_id = l.id
    WHERE g.id = lc_produtos.grupo_id AND (
      l.usuario_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM public.lc_compartilhadas 
        WHERE lista_id = l.id AND usuario_id = auth.uid()
      )
    )
  )
);

-- Políticas RLS para lc_compartilhadas
CREATE POLICY "Usuários podem ver compartilhamentos de suas listas" 
ON public.lc_compartilhadas 
FOR ALL 
USING (
  usuario_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.lc_listas 
    WHERE id = lc_compartilhadas.lista_id AND usuario_id = auth.uid()
  )
);

-- Função para criptografar senhas
CREATE OR REPLACE FUNCTION public.criptografar_senha_lc(senha_texto text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN crypt(senha_texto, gen_salt('bf'));
END;
$$;

-- Função para verificar login
CREATE OR REPLACE FUNCTION public.verificar_login_lc(email_input text, senha_input text)
RETURNS TABLE(usuario_id uuid, nome text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nome, u.email
    FROM public.lc_usuarios u
    WHERE u.email = email_input 
    AND u.senha = crypt(senha_input, u.senha);
END;
$$;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_lc()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Aplicar triggers em todas as tabelas
CREATE TRIGGER update_lc_usuarios_updated_at
BEFORE UPDATE ON public.lc_usuarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_lc();

CREATE TRIGGER update_lc_listas_updated_at
BEFORE UPDATE ON public.lc_listas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_lc();

CREATE TRIGGER update_lc_grupos_updated_at
BEFORE UPDATE ON public.lc_grupos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_lc();

CREATE TRIGGER update_lc_produtos_updated_at
BEFORE UPDATE ON public.lc_produtos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_lc();