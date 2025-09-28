import React, { useState } from 'react';
import { Plus, Search, ShoppingCart, Edit2, Trash2, Check, Package, DollarSign, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useShoppingData, ShoppingGroup, ShoppingItem } from '@/hooks/useShoppingData';
import AddItemModal from './AddItemModal';

// Color options for groups
const GROUP_COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#84CC16', '#6366F1'
];

// Icon options for groups
const GROUP_ICONS = ['🛒', '🥕', '🍞', '🥛', '🧴', '🍎', '🧽', '📦', '🍖', '🐟', '🧀', '🥚', '🍕', '🍰', '☕', '🧊', '🍇', '🥬', '🌶️', '🧄'];

const ShoppingApp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ShoppingGroup | null>(null);
  const [newGroup, setNewGroup] = useState({ nome: '', cor: GROUP_COLORS[0], icone: GROUP_ICONS[0] });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { user, logout } = useAuth();
  const { 
    groups, 
    loading, 
    addGroup, 
    updateGroup, 
    deleteGroup, 
    addItem, 
    updateItem, 
    deleteItem, 
    toggleItemPurchased 
  } = useShoppingData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate totals
  const calculateGroupTotal = (group: ShoppingGroup) => {
    if (!group.items) return 0;
    return group.items.reduce((total, item) => total + (item.quantidade * item.preco), 0);
  };

  const calculateGrandTotal = () => {
    return groups.reduce((total, group) => total + calculateGroupTotal(group), 0);
  };

  const calculatePurchasedTotal = () => {
    return groups.reduce((total, group) => {
      if (!group.items) return total;
      return total + group.items
        .filter(item => item.comprado)
        .reduce((groupTotal, item) => groupTotal + (item.quantidade * item.preco), 0);
    }, 0);
  };

  const getPurchasedItemsCount = (group: ShoppingGroup) => {
    if (!group.items) return 0;
    return group.items.filter(item => item.comprado).length;
  };

  const getProgressPercentage = (group: ShoppingGroup) => {
    if (!group.items || group.items.length === 0) return 0;
    return (getPurchasedItemsCount(group) / group.items.length) * 100;
  };

  // Calculate global stats
  const getTotalItemsCount = () => {
    return groups.reduce((total, group) => total + (group.items?.length || 0), 0);
  };

  const getTotalPurchasedItemsCount = () => {
    return groups.reduce((total, group) => total + getPurchasedItemsCount(group), 0);
  };

  const getGlobalProgressPercentage = () => {
    const totalItems = getTotalItemsCount();
    if (totalItems === 0) return 0;
    return (getTotalPurchasedItemsCount() / totalItems) * 100;
  };

  // Group management
  const handleAddGroup = async () => {
    if (newGroup.nome.trim()) {
      await addGroup(newGroup);
      setNewGroup({ nome: '', cor: GROUP_COLORS[0], icone: GROUP_ICONS[0] });
      setIsAddingGroup(false);
    }
  };

  const handleUpdateGroup = async (groupId: string, updates: Partial<ShoppingGroup>) => {
    await updateGroup(groupId, updates);
    setEditingGroup(null);
    setNewGroup({ nome: '', cor: GROUP_COLORS[0], icone: GROUP_ICONS[0] });
  };

  const handleDeleteGroup = async (groupId: string) => {
    await deleteGroup(groupId);
    // Remove from expanded groups if it was expanded
    const newExpanded = new Set(expandedGroups);
    newExpanded.delete(groupId);
    setExpandedGroups(newExpanded);
  };

  // Item management
  const handleAddItem = async (groupId: string, item: Omit<ShoppingItem, 'id' | 'grupo_id'>) => {
    await addItem(groupId, { ...item, comprado: false });
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<ShoppingItem>) => {
    await updateItem(itemId, updates);
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
  };

  const handleToggleItemPurchased = async (itemId: string, comprado: boolean) => {
    await toggleItemPurchased(itemId, comprado);
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Filter items based on search
  const filteredGroups = groups.map(group => ({
    ...group,
    items: group.items?.filter(item => 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  })).filter(group => 
    group.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (group.items && group.items.length > 0)
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Lista de Compras
              </h1>
              <p className="text-muted-foreground mt-2">
                Olá, {user?.nome}! Organize suas compras por grupos e acompanhe seus gastos
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar itens ou grupos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 w-full sm:w-80"
                />
              </div>
              
              <Dialog open={isAddingGroup} onOpenChange={setIsAddingGroup}>
                <DialogTrigger asChild>
                  <Button className="gradient-btn gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Grupo
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-none">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Grupo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome do grupo"
                      value={newGroup.nome}
                      onChange={(e) => setNewGroup({ ...newGroup, nome: e.target.value })}
                      className="glass-input"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Cor</label>
                        <div className="grid grid-cols-4 gap-2">
                          {GROUP_COLORS.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-lg border-2 ${
                                newGroup.cor === color ? 'border-white' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewGroup({ ...newGroup, cor: color })}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ícone</label>
                        <div className="grid grid-cols-8 gap-2">
                          {GROUP_ICONS.map((icon) => (
                            <button
                              key={icon}
                              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg ${
                                newGroup.icone === icon ? 'border-white bg-muted' : 'border-transparent'
                              }`}
                              onClick={() => setNewGroup({ ...newGroup, icone: icon })}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleAddGroup} className="gradient-btn w-full">
                      Criar Grupo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
          
          {/* Total Geral */}
          <div className="mt-6 p-4 glass-card bg-gradient-to-r from-primary/20 to-accent/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Geral */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">Total Geral</h3>
                  <p className="text-sm text-muted-foreground">
                    {getTotalItemsCount()} itens total
                  </p>
                  <p className="text-xl font-bold text-primary">
                    R$ {calculateGrandTotal().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Total Comprado */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <Check className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">Total Comprado</h3>
                  <p className="text-sm text-muted-foreground">
                    {getTotalPurchasedItemsCount()} itens comprados
                  </p>
                  <p className="text-xl font-bold text-success">
                    R$ {calculatePurchasedTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso das compras</span>
                <span>{Math.round(getGlobalProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-success to-primary"
                  style={{ width: `${getGlobalProgressPercentage()}%` }}
                />
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-muted-foreground">
                    {getTotalPurchasedItemsCount()} comprados
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                  <span className="text-muted-foreground">
                    {getTotalItemsCount() - getTotalPurchasedItemsCount()} faltando
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="space-y-6">
          {/* Active Groups - Full Width */}
          {filteredGroups
            .filter(group => expandedGroups.has(group.id))
            .map((group) => (
              <div key={`active-${group.id}`} className="w-full">
                <GroupCard
                  group={group}
                  onUpdateGroup={handleUpdateGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleItemPurchased={handleToggleItemPurchased}
                  calculateGroupTotal={calculateGroupTotal}
                  getPurchasedItemsCount={getPurchasedItemsCount}
                  getProgressPercentage={getProgressPercentage}
                  editingGroup={editingGroup}
                  setEditingGroup={setEditingGroup}
                  newGroup={newGroup}
                  setNewGroup={setNewGroup}
                  expandedGroups={expandedGroups}
                  toggleGroupExpansion={toggleGroupExpansion}
                />
              </div>
            ))}
          
          {/* Inactive Groups - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGroups
              .filter(group => !expandedGroups.has(group.id))
              .map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onUpdateGroup={handleUpdateGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleItemPurchased={handleToggleItemPurchased}
                  calculateGroupTotal={calculateGroupTotal}
                  getPurchasedItemsCount={getPurchasedItemsCount}
                  getProgressPercentage={getProgressPercentage}
                  editingGroup={editingGroup}
                  setEditingGroup={setEditingGroup}
                  newGroup={newGroup}
                  setNewGroup={setNewGroup}
                  expandedGroups={expandedGroups}
                  toggleGroupExpansion={toggleGroupExpansion}
                />
              ))}
          </div>
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum grupo encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Tente buscar por outros termos' : 'Comece criando seu primeiro grupo de compras'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddingGroup(true)} className="gradient-btn gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Grupo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// GroupCard component
interface GroupCardProps {
  group: ShoppingGroup;
  onUpdateGroup: (groupId: string, updates: Partial<ShoppingGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddItem: (groupId: string, item: Omit<ShoppingItem, 'id' | 'grupo_id'>) => void;
  onUpdateItem: (itemId: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleItemPurchased: (itemId: string, comprado: boolean) => void;
  calculateGroupTotal: (group: ShoppingGroup) => number;
  getPurchasedItemsCount: (group: ShoppingGroup) => number;
  getProgressPercentage: (group: ShoppingGroup) => number;
  editingGroup: ShoppingGroup | null;
  setEditingGroup: (group: ShoppingGroup | null) => void;
  newGroup: { nome: string; cor: string; icone: string };
  setNewGroup: (group: { nome: string; cor: string; icone: string }) => void;
  expandedGroups: Set<string>;
  toggleGroupExpansion: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onUpdateGroup,
  onDeleteGroup,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItemPurchased,
  calculateGroupTotal,
  getPurchasedItemsCount,
  getProgressPercentage,
  editingGroup,
  setEditingGroup,
  newGroup,
  setNewGroup,
  expandedGroups,
  toggleGroupExpansion,
}) => {
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [newItem, setNewItem] = useState({
    nome: '',
    unidade: 'un',
    quantidade: 1,
    preco: 0
  });

  const isExpanded = expandedGroups.has(group.id);
  const items = group.items || [];

  const handleAddNewItem = (itemData: Omit<ShoppingItem, 'id' | 'grupo_id'>) => {
    onAddItem(group.id, itemData);
    setNewItem({ nome: '', unidade: 'un', quantidade: 1, preco: 0 });
  };

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setNewItem({
      nome: item.nome,
      unidade: item.unidade,
      quantidade: item.quantidade,
      preco: item.preco
    });
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      onUpdateItem(editingItem.id, newItem);
      setEditingItem(null);
      setNewItem({ nome: '', unidade: 'un', quantidade: 1, preco: 0 });
    }
  };

  return (
    <Card 
      className="glass-card group hover:shadow-xl transition-all duration-300 cursor-pointer"
      style={{ borderLeft: `4px solid ${group.cor}` }}
      onClick={() => toggleGroupExpansion(group.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl font-semibold"
              style={{ backgroundColor: group.cor }}
            >
              {group.icone}
            </div>
            <div>
              <CardTitle className="text-lg">{group.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge 
              variant="secondary" 
              className="px-3 py-1 font-medium whitespace-nowrap"
              style={{ backgroundColor: `${group.cor}20`, color: group.cor }}
            >
              R$ {calculateGroupTotal(group).toFixed(2)}
            </Badge>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingGroup(group);
                    setNewGroup({ nome: group.nome, cor: group.cor, icone: group.icone });
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Editar Grupo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome do grupo"
                    value={newGroup.nome}
                    onChange={(e) => setNewGroup({ ...newGroup, nome: e.target.value })}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Cor</label>
                      <div className="grid grid-cols-4 gap-2">
                        {GROUP_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-lg border-2 ${
                              newGroup.cor === color ? 'border-white' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewGroup({ ...newGroup, cor: color })}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ícone</label>
                      <div className="grid grid-cols-8 gap-2">
                        {GROUP_ICONS.map((icon) => (
                          <button
                            key={icon}
                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg ${
                              newGroup.icone === icon ? 'border-white bg-muted' : 'border-transparent'
                            }`}
                            onClick={() => setNewGroup({ ...newGroup, icone: icon })}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onUpdateGroup(group.id, newGroup)}
                      className="flex-1"
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteGroup(group.id)}
                      className="px-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>{getPurchasedItemsCount(group)} de {items.length} comprados</span>
            <span>{Math.round(getProgressPercentage(group))}%</span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${getProgressPercentage(group)}%`,
                backgroundColor: group.cor
              }}
            />
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent onClick={(e) => e.stopPropagation()}>
          {/* Add Item Section */}
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Adicionar Item</h4>
              <AddItemModal onAddItem={handleAddNewItem} />
            </div>
          </div>
          
          {/* Items List */}
          <div className="space-y-2">
            {items.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  item.comprado 
                    ? 'bg-success/10 border-success/20 text-muted-foreground' 
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.comprado}
                  onChange={(e) => onToggleItemPurchased(item.id, e.target.checked)}
                  className="w-4 h-4 rounded border border-input"
                />
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${item.comprado ? 'line-through' : ''}`}>
                    {item.nome}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantidade} {item.unidade}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold whitespace-nowrap ${item.comprado ? 'line-through' : ''}`}>
                    R$ {(item.quantidade * item.preco).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    R$ {item.preco.toFixed(2)} cada
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteItem(item.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum item neste grupo</p>
                <p className="text-sm">Clique no botão "Adicionar Item" para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ShoppingApp;