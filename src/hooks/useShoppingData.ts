import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ShoppingItem {
  id: string;
  nome: string;
  unidade: string;
  quantidade: number;
  preco: number;
  comprado: boolean;
  grupo_id: string;
}

export interface ShoppingGroup {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  lista_id: string;
  items?: ShoppingItem[];
}

export interface ShoppingList {
  id: string;
  nome: string;
  usuario_id: string;
  groups?: ShoppingGroup[];
}

export const useShoppingData = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const [groups, setGroups] = useState<ShoppingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar listas do usuário
  const loadLists = async () => {
    if (!user?.usuario_id && !user?.id) return;
    
    const userId = user.usuario_id || user.id;

    try {
      const { data, error } = await supabase
        .from('lc_listas')
        .select('*')
        .eq('usuario_id', userId);

      if (error) throw error;

      setLists(data || []);
      
      // Se não há lista atual, pegar a primeira ou criar uma nova
      if (!currentList && data && data.length > 0) {
        setCurrentList(data[0]);
      } else if (!currentList && data && data.length === 0) {
        await createDefaultList();
      }
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar listas de compras",
        variant: "destructive",
      });
    }
  };

  // Criar lista padrão
  const createDefaultList = async () => {
    if (!user?.usuario_id && !user?.id) return;
    
    const userId = user.usuario_id || user.id;

    try {
      const { data, error } = await supabase
        .from('lc_listas')
        .insert([{
          nome: 'Minha Lista',
          usuario_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      setCurrentList(data);
      setLists([data]);
    } catch (error) {
      console.error('Erro ao criar lista padrão:', error);
    }
  };

  // Carregar grupos da lista atual
  const loadGroups = async () => {
    if (!currentList?.id) return;

    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('lc_grupos')
        .select('*')
        .eq('lista_id', currentList.id);

      if (groupsError) throw groupsError;

      // Carregar produtos para cada grupo
      const groupsWithItems = await Promise.all(
        (groupsData || []).map(async (group) => {
          const { data: items, error: itemsError } = await supabase
            .from('lc_produtos')
            .select('*')
            .eq('grupo_id', group.id);

          if (itemsError) {
            console.error('Erro ao carregar itens:', itemsError);
            return { ...group, items: [] };
          }

          return { ...group, items: items || [] };
        })
      );

      setGroups(groupsWithItems);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar grupos",
        variant: "destructive",
      });
    }
  };

  // Adicionar grupo
  const addGroup = async (groupData: Omit<ShoppingGroup, 'id' | 'lista_id'>) => {
    if (!currentList?.id) return;

    try {
      const { data, error } = await supabase
        .from('lc_grupos')
        .insert([{
          ...groupData,
          lista_id: currentList.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newGroup = { ...data, items: [] };
      setGroups(prev => [...prev, newGroup]);
    } catch (error) {
      console.error('Erro ao adicionar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar grupo",
        variant: "destructive",
      });
    }
  };

  // Atualizar grupo
  const updateGroup = async (groupId: string, updates: Partial<ShoppingGroup>) => {
    try {
      const { error } = await supabase
        .from('lc_grupos')
        .update(updates)
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
      ));
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar grupo",
        variant: "destructive",
      });
    }
  };

  // Deletar grupo
  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('lc_grupos')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar grupo",
        variant: "destructive",
      });
    }
  };

  // Adicionar item
  const addItem = async (groupId: string, itemData: Omit<ShoppingItem, 'id' | 'grupo_id'>) => {
    try {
      const { data, error } = await supabase
        .from('lc_produtos')
        .insert([{
          ...itemData,
          grupo_id: groupId
        }])
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, items: [...(group.items || []), data] }
          : group
      ));
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar item",
        variant: "destructive",
      });
    }
  };

  // Atualizar item
  const updateItem = async (itemId: string, updates: Partial<ShoppingItem>) => {
    try {
      const { error } = await supabase
        .from('lc_produtos')
        .update(updates)
        .eq('id', itemId);

      if (error) throw error;

      setGroups(prev => prev.map(group => ({
        ...group,
        items: group.items?.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      })));
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar item",
        variant: "destructive",
      });
    }
  };

  // Deletar item
  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('lc_produtos')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setGroups(prev => prev.map(group => ({
        ...group,
        items: group.items?.filter(item => item.id !== itemId)
      })));
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar item",
        variant: "destructive",
      });
    }
  };

  // Toggle item comprado
  const toggleItemPurchased = async (itemId: string, comprado: boolean) => {
    await updateItem(itemId, { comprado });
  };

  useEffect(() => {
    if (user?.usuario_id || user?.id) {
      loadLists();
    }
  }, [user]);

  useEffect(() => {
    if (currentList?.id) {
      loadGroups();
    }
  }, [currentList]);

  useEffect(() => {
    setLoading(false);
  }, [groups]);

  return {
    lists,
    currentList,
    groups,
    loading,
    setCurrentList,
    addGroup,
    updateGroup,
    deleteGroup,
    addItem,
    updateItem,
    deleteItem,
    toggleItemPurchased,
    loadGroups
  };
};