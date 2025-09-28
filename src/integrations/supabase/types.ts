export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      atividades_sistemicas: {
        Row: {
          descricao: string
          id: string
          ultima_execucao: string | null
        }
        Insert: {
          descricao: string
          id?: string
          ultima_execucao?: string | null
        }
        Update: {
          descricao?: string
          id?: string
          ultima_execucao?: string | null
        }
        Relationships: []
      }
      auditorias: {
        Row: {
          acao: string
          alvo_id: string | null
          alvo_tipo: string | null
          created_at: string | null
          empresa_id: string | null
          id: string
          payload: Json | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          alvo_id?: string | null
          alvo_tipo?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          payload?: Json | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          alvo_id?: string | null
          alvo_tipo?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          payload?: Json | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditorias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditorias_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          ativo: boolean | null
          cor: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          nome: string
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome: string
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_usuario: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          fuso_horario: string | null
          id: string
          idioma: string | null
          notificacoes_email: boolean | null
          notificacoes_sistema: boolean | null
          tema: string | null
          usuario_id: string | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          notificacoes_email?: boolean | null
          notificacoes_sistema?: boolean | null
          tema?: string | null
          usuario_id?: string | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          notificacoes_email?: boolean | null
          notificacoes_sistema?: boolean | null
          tema?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      enderecos: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          documento: string | null
          id: string
          logradouro: string | null
          nome: string | null
          numero: string | null
          pedido_id: string | null
          telefone: string | null
          tipo: string | null
          uf: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          documento?: string | null
          id?: string
          logradouro?: string | null
          nome?: string | null
          numero?: string | null
          pedido_id?: string | null
          telefone?: string | null
          tipo?: string | null
          uf?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          documento?: string | null
          id?: string
          logradouro?: string | null
          nome?: string | null
          numero?: string | null
          pedido_id?: string | null
          telefone?: string | null
          tipo?: string | null
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enderecos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      etiquetas: {
        Row: {
          arquivo_url: string | null
          codigo_rastreamento: string | null
          data_criacao: string | null
          data_impressao: string | null
          empresa_id: string | null
          formato: string | null
          id: string
          impresso: boolean | null
          impresso_em: string | null
          integracao_id: string | null
          observacoes: string | null
          pedido_id: string | null
          prioridade: string | null
          status_etiqueta: string | null
          tamanho_papel: string | null
          tentativas_impressao: number | null
          tipo: string | null
          transportadora: string | null
          ultima_tentativa_impressao: string | null
          usuario_id: string | null
        }
        Insert: {
          arquivo_url?: string | null
          codigo_rastreamento?: string | null
          data_criacao?: string | null
          data_impressao?: string | null
          empresa_id?: string | null
          formato?: string | null
          id?: string
          impresso?: boolean | null
          impresso_em?: string | null
          integracao_id?: string | null
          observacoes?: string | null
          pedido_id?: string | null
          prioridade?: string | null
          status_etiqueta?: string | null
          tamanho_papel?: string | null
          tentativas_impressao?: number | null
          tipo?: string | null
          transportadora?: string | null
          ultima_tentativa_impressao?: string | null
          usuario_id?: string | null
        }
        Update: {
          arquivo_url?: string | null
          codigo_rastreamento?: string | null
          data_criacao?: string | null
          data_impressao?: string | null
          empresa_id?: string | null
          formato?: string | null
          id?: string
          impresso?: boolean | null
          impresso_em?: string | null
          integracao_id?: string | null
          observacoes?: string | null
          pedido_id?: string | null
          prioridade?: string | null
          status_etiqueta?: string | null
          tamanho_papel?: string | null
          tentativas_impressao?: number | null
          tipo?: string | null
          transportadora?: string | null
          ultima_tentativa_impressao?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "etiquetas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etiquetas_integracao_id_fkey"
            columns: ["integracao_id"]
            isOneToOne: false
            referencedRelation: "integracoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etiquetas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etiquetas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      events_outbox: {
        Row: {
          aggregate_id: string
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
        }
        Insert: {
          aggregate_id: string
          created_at?: string | null
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
        }
        Update: {
          aggregate_id?: string
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
        }
        Relationships: []
      }
      fila_impressao: {
        Row: {
          created_at: string | null
          empresa_id: string | null
          erro_mensagem: string | null
          etiqueta_id: string | null
          id: string
          impressora_id: string | null
          status: string | null
          tentativas: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id?: string | null
          erro_mensagem?: string | null
          etiqueta_id?: string | null
          id?: string
          impressora_id?: string | null
          status?: string | null
          tentativas?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string | null
          erro_mensagem?: string | null
          etiqueta_id?: string | null
          id?: string
          impressora_id?: string | null
          status?: string | null
          tentativas?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fila_impressao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fila_impressao_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fila_impressao_impressora_id_fkey"
            columns: ["impressora_id"]
            isOneToOne: false
            referencedRelation: "impressoras"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_acoes: {
        Row: {
          acao: string
          data_acao: string | null
          detalhes: Json | null
          id: string
          registro_id: string | null
          tabela_afetada: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          data_acao?: string | null
          detalhes?: Json | null
          id?: string
          registro_id?: string | null
          tabela_afetada?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          data_acao?: string | null
          detalhes?: Json | null
          id?: string
          registro_id?: string | null
          tabela_afetada?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_acoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      impressoras: {
        Row: {
          ativo: boolean | null
          data_atualizacao: string | null
          data_criacao: string | null
          empresa_id: string | null
          endereco_ip: string | null
          id: string
          impressao_ao_conectar: boolean | null
          impressao_automatica: boolean | null
          impressao_lote: boolean | null
          ip: string | null
          modelo: string
          modo: string | null
          nome: string
          orientacao: string | null
          padrao: boolean | null
          porta: string | null
          printnode_computer_id: number | null
          printnode_printer_id: number | null
          printnode_status: string | null
          qualidade_impressao: string | null
          status: string | null
          status_conexao: string | null
          tamanho_papel: string | null
          usuario_id: string
        }
        Insert: {
          ativo?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          empresa_id?: string | null
          endereco_ip?: string | null
          id?: string
          impressao_ao_conectar?: boolean | null
          impressao_automatica?: boolean | null
          impressao_lote?: boolean | null
          ip?: string | null
          modelo: string
          modo?: string | null
          nome: string
          orientacao?: string | null
          padrao?: boolean | null
          porta?: string | null
          printnode_computer_id?: number | null
          printnode_printer_id?: number | null
          printnode_status?: string | null
          qualidade_impressao?: string | null
          status?: string | null
          status_conexao?: string | null
          tamanho_papel?: string | null
          usuario_id: string
        }
        Update: {
          ativo?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          empresa_id?: string | null
          endereco_ip?: string | null
          id?: string
          impressao_ao_conectar?: boolean | null
          impressao_automatica?: boolean | null
          impressao_lote?: boolean | null
          ip?: string | null
          modelo?: string
          modo?: string | null
          nome?: string
          orientacao?: string | null
          padrao?: boolean | null
          porta?: string | null
          printnode_computer_id?: number | null
          printnode_printer_id?: number | null
          printnode_status?: string | null
          qualidade_impressao?: string | null
          status?: string | null
          status_conexao?: string | null
          tamanho_papel?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "impressoras_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes: {
        Row: {
          access_token: string | null
          apelido_loja: string | null
          api_key: string | null
          api_secret: string | null
          ativo: boolean | null
          auth_tipo: string | null
          auto_import_ativo: boolean | null
          configuracoes: Json | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          marketplace: string | null
          nome: string
          refresh_token: string | null
          seller_id: string | null
          shop_id: string | null
          status: string | null
          tipo: string
          token_expires_at: string | null
          ultima_sincronizacao: string | null
          usuario_id: string | null
        }
        Insert: {
          access_token?: string | null
          apelido_loja?: string | null
          api_key?: string | null
          api_secret?: string | null
          ativo?: boolean | null
          auth_tipo?: string | null
          auto_import_ativo?: boolean | null
          configuracoes?: Json | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          marketplace?: string | null
          nome: string
          refresh_token?: string | null
          seller_id?: string | null
          shop_id?: string | null
          status?: string | null
          tipo: string
          token_expires_at?: string | null
          ultima_sincronizacao?: string | null
          usuario_id?: string | null
        }
        Update: {
          access_token?: string | null
          apelido_loja?: string | null
          api_key?: string | null
          api_secret?: string | null
          ativo?: boolean | null
          auth_tipo?: string | null
          auto_import_ativo?: boolean | null
          configuracoes?: Json | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          marketplace?: string | null
          nome?: string
          refresh_token?: string | null
          seller_id?: string | null
          shop_id?: string | null
          status?: string | null
          tipo?: string
          token_expires_at?: string | null
          ultima_sincronizacao?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integracoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          data_criacao: string | null
          id: string
          nome_produto: string
          pedido_id: string | null
          preco_total: number
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          sku: string | null
        }
        Insert: {
          data_criacao?: string | null
          id?: string
          nome_produto: string
          pedido_id?: string | null
          preco_total?: number
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          sku?: string | null
        }
        Update: {
          data_criacao?: string | null
          id?: string
          nome_produto?: string
          pedido_id?: string | null
          preco_total?: number
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs_sync: {
        Row: {
          created_at: string | null
          erro_mensagem: string | null
          id: string
          integracao_id: string | null
          job_type: string
          last_cursor: string | null
          status: string | null
          tentativas: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          erro_mensagem?: string | null
          id?: string
          integracao_id?: string | null
          job_type: string
          last_cursor?: string | null
          status?: string | null
          tentativas?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          erro_mensagem?: string | null
          id?: string
          integracao_id?: string | null
          job_type?: string
          last_cursor?: string | null
          status?: string | null
          tentativas?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_sync_integracao_id_fkey"
            columns: ["integracao_id"]
            isOneToOne: false
            referencedRelation: "integracoes"
            referencedColumns: ["id"]
          },
        ]
      }
      lc_compartilhadas: {
        Row: {
          created_at: string
          id: string
          lista_id: string
          permissao: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lista_id: string
          permissao?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lista_id?: string
          permissao?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lc_compartilhadas_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "lc_listas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lc_compartilhadas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "lc_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      lc_grupos: {
        Row: {
          cor: string
          created_at: string
          icone: string
          id: string
          lista_id: string
          nome: string
          updated_at: string
        }
        Insert: {
          cor?: string
          created_at?: string
          icone?: string
          id?: string
          lista_id: string
          nome: string
          updated_at?: string
        }
        Update: {
          cor?: string
          created_at?: string
          icone?: string
          id?: string
          lista_id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lc_grupos_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "lc_listas"
            referencedColumns: ["id"]
          },
        ]
      }
      lc_listas: {
        Row: {
          created_at: string
          id: string
          nome: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lc_listas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "lc_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      lc_produtos: {
        Row: {
          comprado: boolean
          created_at: string
          grupo_id: string
          id: string
          nome: string
          preco: number
          quantidade: number
          unidade: string
          updated_at: string
        }
        Insert: {
          comprado?: boolean
          created_at?: string
          grupo_id: string
          id?: string
          nome: string
          preco?: number
          quantidade?: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          comprado?: boolean
          created_at?: string
          grupo_id?: string
          id?: string
          nome?: string
          preco?: number
          quantidade?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lc_produtos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "lc_grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      lc_usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          senha: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          senha: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          senha?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_configuracoes: {
        Row: {
          api_key: string | null
          api_secret: string | null
          ativo: boolean
          aws_access_key_id: string | null
          aws_secret_access_key: string | null
          client_id: string | null
          client_secret: string | null
          created_at: string
          empresa_id: string
          id: string
          marketplace: string
          partner_id: string | null
          partner_key: string | null
          refresh_token: string | null
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          ativo?: boolean
          aws_access_key_id?: string | null
          aws_secret_access_key?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          marketplace: string
          partner_id?: string | null
          partner_key?: string | null
          refresh_token?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          ativo?: boolean
          aws_access_key_id?: string | null
          aws_secret_access_key?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          marketplace?: string
          partner_id?: string | null
          partner_key?: string | null
          refresh_token?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      pedido_itens: {
        Row: {
          id: string
          nome: string
          pedido_id: string | null
          preco_unitario: number
          quantidade: number
          sku: string | null
        }
        Insert: {
          id?: string
          nome: string
          pedido_id?: string | null
          preco_unitario?: number
          quantidade?: number
          sku?: string | null
        }
        Update: {
          id?: string
          nome?: string
          pedido_id?: string | null
          preco_unitario?: number
          quantidade?: number
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_email: string | null
          cliente_nome: string | null
          cliente_telefone: string | null
          codigo_externo: string | null
          comprador_doc: string | null
          comprador_nome: string | null
          criado_externo_at: string | null
          data_atualizacao: string | null
          data_pedido: string | null
          empresa_id: string | null
          endereco_entrega: Json | null
          id: string
          integracao_id: string | null
          marketplace: string | null
          moeda: string | null
          numero_pedido: string
          observacoes: string | null
          origem_marketplace: string | null
          recebido_externo_at: string | null
          status: string | null
          total_bruto: number | null
          total_frete: number | null
          total_liquido: number | null
          usuario_id: string | null
          valor_frete: number | null
          valor_total: number
        }
        Insert: {
          cliente_email?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          codigo_externo?: string | null
          comprador_doc?: string | null
          comprador_nome?: string | null
          criado_externo_at?: string | null
          data_atualizacao?: string | null
          data_pedido?: string | null
          empresa_id?: string | null
          endereco_entrega?: Json | null
          id?: string
          integracao_id?: string | null
          marketplace?: string | null
          moeda?: string | null
          numero_pedido: string
          observacoes?: string | null
          origem_marketplace?: string | null
          recebido_externo_at?: string | null
          status?: string | null
          total_bruto?: number | null
          total_frete?: number | null
          total_liquido?: number | null
          usuario_id?: string | null
          valor_frete?: number | null
          valor_total?: number
        }
        Update: {
          cliente_email?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          codigo_externo?: string | null
          comprador_doc?: string | null
          comprador_nome?: string | null
          criado_externo_at?: string | null
          data_atualizacao?: string | null
          data_pedido?: string | null
          empresa_id?: string | null
          endereco_entrega?: Json | null
          id?: string
          integracao_id?: string | null
          marketplace?: string | null
          moeda?: string | null
          numero_pedido?: string
          observacoes?: string | null
          origem_marketplace?: string | null
          recebido_externo_at?: string | null
          status?: string | null
          total_bruto?: number | null
          total_frete?: number | null
          total_liquido?: number | null
          usuario_id?: string | null
          valor_frete?: number | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_integracao_id_fkey"
            columns: ["integracao_id"]
            isOneToOne: false
            referencedRelation: "integracoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      printnode_config: {
        Row: {
          account_info: Json | null
          api_key_encrypted: string | null
          computer_id: number | null
          computer_name: string | null
          created_at: string | null
          empresa_id: string | null
          id: string
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          account_info?: Json | null
          api_key_encrypted?: string | null
          computer_id?: number | null
          computer_name?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          account_info?: Json | null
          api_key_encrypted?: string | null
          computer_id?: number | null
          computer_name?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printnode_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printnode_config_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          custo: number | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          dimensoes: Json | null
          estoque_atual: number | null
          estoque_minimo: number | null
          id: string
          nome: string
          peso: number | null
          preco: number
          sku: string | null
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria_id?: string | null
          custo?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          dimensoes?: Json | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          id?: string
          nome: string
          peso?: number | null
          preco?: number
          sku?: string | null
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string | null
          custo?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          dimensoes?: Json | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          id?: string
          nome?: string
          peso?: number | null
          preco?: number
          sku?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          senha: string
          tipo_usuario: string | null
        }
        Insert: {
          ativo?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          senha: string
          tipo_usuario?: string | null
        }
        Update: {
          ativo?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          senha?: string
          tipo_usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_outbox_event: {
        Args: {
          p_aggregate_id: string
          p_event_data: Json
          p_event_type: string
        }
        Returns: string
      }
      criptografar_senha: {
        Args: { senha_texto: string }
        Returns: string
      }
      criptografar_senha_lc: {
        Args: { senha_texto: string }
        Returns: string
      }
      gerar_codigo_rastreamento: {
        Args: { transportadora_param: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      verificar_login_lc: {
        Args: { email_input: string; senha_input: string }
        Returns: {
          email: string
          nome: string
          usuario_id: string
        }[]
      }
      verificar_senha: {
        Args: { email_input: string; senha_input: string }
        Returns: {
          nome: string
          tipo_usuario: string
          usuario_id: string
        }[]
      }
    }
    Enums: {
      movement_type: "entrada" | "saida"
      user_permission: "admin" | "usuario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      movement_type: ["entrada", "saida"],
      user_permission: ["admin", "usuario"],
    },
  },
} as const
