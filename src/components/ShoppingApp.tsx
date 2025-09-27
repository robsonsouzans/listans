import React, { useState, useEffect } from 'react';
import { Plus, Search, ShoppingCart, Edit2, Trash2, Check, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
interface ShoppingItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  purchased: boolean;
}

interface ShoppingGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
  items: ShoppingItem[];
}

// Unit options
const DEFAULT_UNITS = ['UN', 'KG', 'L', 'G', 'ML', 'M', 'PC', 'CX', 'PAC', 'DZ', 'LT'];

// Color options for groups
const GROUP_COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#84CC16', '#6366F1'
];

// Icon options for groups
const GROUP_ICONS = ['🛒', '🥕', '🍞', '🥛', '🧴', '🍎', '🧽', '📦', '🍖', '🐟', '🧀', '🥚', '🍕', '🍰', '☕', '🧊', '🍇', '🥬', '🌶️', '🧄', '🥔', '🍌', '🥑', '🍊', '🍓', '🥒', '🍅', '🥦', '🌽', '🥨', '🍪', '🍫'];

const ShoppingApp: React.FC = () => {
  const [groups, setGroups] = useState<ShoppingGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ShoppingGroup | null>(null);
  const [newGroup, setNewGroup] = useState({ name: '', color: GROUP_COLORS[0], icon: GROUP_ICONS[0] });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [customUnits, setCustomUnits] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('shopping-groups');
    const savedCustomUnits = localStorage.getItem('custom-units');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    } else {
      // Add sample data
      const sampleGroups: ShoppingGroup[] = [
        {
          id: '1',
          name: 'Frutas & Verduras',
          color: '#10B981',
          icon: '🥕',
          items: [
            { id: '1', name: 'Banana', unit: 'KG', quantity: 2, price: 5.99, purchased: false },
            { id: '2', name: 'Tomate', unit: 'KG', quantity: 1, price: 8.50, purchased: true },
          ]
        },
        {
          id: '2',
          name: 'Padaria',
          color: '#F59E0B',
          icon: '🍞',
          items: [
            { id: '3', name: 'Pão Francês', unit: 'UN', quantity: 10, price: 0.80, purchased: false },
          ]
        }
      ];
      setGroups(sampleGroups);
    }
    if (savedCustomUnits) {
      setCustomUnits(JSON.parse(savedCustomUnits));
    }
  }, []);

  // Save to localStorage whenever groups change
  useEffect(() => {
    localStorage.setItem('shopping-groups', JSON.stringify(groups));
  }, [groups]);

  // Save custom units to localStorage
  useEffect(() => {
    localStorage.setItem('custom-units', JSON.stringify(customUnits));
  }, [customUnits]);

  // Calculate totals
  const calculateGroupTotal = (group: ShoppingGroup) => {
    return group.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateGrandTotal = () => {
    return groups.reduce((total, group) => total + calculateGroupTotal(group), 0);
  };

  const calculatePurchasedTotal = () => {
    return groups.reduce((total, group) => {
      return total + group.items
        .filter(item => item.purchased)
        .reduce((groupTotal, item) => groupTotal + (item.quantity * item.price), 0);
    }, 0);
  };

  const getPurchasedItemsCount = (group: ShoppingGroup) => {
    return group.items.filter(item => item.purchased).length;
  };

  const getProgressPercentage = (group: ShoppingGroup) => {
    if (group.items.length === 0) return 0;
    return (getPurchasedItemsCount(group) / group.items.length) * 100;
  };

  // Calculate global stats
  const getTotalItemsCount = () => {
    return groups.reduce((total, group) => total + group.items.length, 0);
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
  const addGroup = () => {
    if (newGroup.name.trim()) {
      const group: ShoppingGroup = {
        id: Date.now().toString(),
        name: newGroup.name,
        color: newGroup.color,
        icon: newGroup.icon,
        items: []
      };
      setGroups([...groups, group]);
      setNewGroup({ name: '', color: GROUP_COLORS[0], icon: GROUP_ICONS[0] });
      setIsAddingGroup(false);
    }
  };

  const updateGroup = (groupId: string, updates: Partial<ShoppingGroup>) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
    setEditingGroup(null);
    setNewGroup({ name: '', color: GROUP_COLORS[0], icon: GROUP_ICONS[0] });
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  // Item management
  const addItem = (groupId: string, item: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, items: [...group.items, newItem] }
        : group
    ));
  };

  const updateItem = (groupId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            items: group.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : group
    ));
  };

  const deleteItem = (groupId: string, itemId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, items: group.items.filter(item => item.id !== itemId) }
        : group
    ));
  };

  const toggleItemPurchased = (groupId: string, itemId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            items: group.items.map(item => 
              item.id === itemId ? { ...item, purchased: !item.purchased } : item
            )
          }
        : group
    ));
  };

  // Add custom unit
  const addCustomUnit = (unit: string) => {
    if (unit && !getAllUnits().includes(unit.toUpperCase())) {
      setCustomUnits([...customUnits, unit.toUpperCase()]);
    }
  };

  // Get all available units
  const getAllUnits = () => {
    return [...DEFAULT_UNITS, ...customUnits].sort();
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
    items: group.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) || group.items.length > 0
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
                Organize suas compras por grupos e acompanhe seus gastos
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
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
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
                                newGroup.color === color ? 'border-white' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewGroup({ ...newGroup, color })}
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
                                newGroup.icon === icon ? 'border-white bg-muted' : 'border-transparent'
                              }`}
                              onClick={() => setNewGroup({ ...newGroup, icon })}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={addGroup} className="gradient-btn w-full">
                      Criar Grupo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                  onUpdateGroup={updateGroup}
                  onDeleteGroup={deleteGroup}
                  onAddItem={addItem}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  onToggleItemPurchased={toggleItemPurchased}
                  calculateGroupTotal={calculateGroupTotal}
                  getPurchasedItemsCount={getPurchasedItemsCount}
                  getProgressPercentage={getProgressPercentage}
                  editingGroup={editingGroup}
                  setEditingGroup={setEditingGroup}
                  newGroup={newGroup}
                  setNewGroup={setNewGroup}
                  expandedGroups={expandedGroups}
                  toggleGroupExpansion={toggleGroupExpansion}
                  getAllUnits={getAllUnits}
                  addCustomUnit={addCustomUnit}
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
                onUpdateGroup={updateGroup}
                onDeleteGroup={deleteGroup}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
                onToggleItemPurchased={toggleItemPurchased}
                calculateGroupTotal={calculateGroupTotal}
                getPurchasedItemsCount={getPurchasedItemsCount}
                getProgressPercentage={getProgressPercentage}
                editingGroup={editingGroup}
                setEditingGroup={setEditingGroup}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                expandedGroups={expandedGroups}
                toggleGroupExpansion={toggleGroupExpansion}
                getAllUnits={getAllUnits}
                addCustomUnit={addCustomUnit}
              />
            ))}
          </div>
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum grupo encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Tente uma busca diferente' : 'Crie seu primeiro grupo de compras para começar'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddingGroup(true)} className="gradient-btn">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Grupo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Group Card Component
interface GroupCardProps {
  group: ShoppingGroup;
  onUpdateGroup: (groupId: string, updates: Partial<ShoppingGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddItem: (groupId: string, item: Omit<ShoppingItem, 'id'>) => void;
  onUpdateItem: (groupId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (groupId: string, itemId: string) => void;
  onToggleItemPurchased: (groupId: string, itemId: string) => void;
  calculateGroupTotal: (group: ShoppingGroup) => number;
  getPurchasedItemsCount: (group: ShoppingGroup) => number;
  getProgressPercentage: (group: ShoppingGroup) => number;
  editingGroup: ShoppingGroup | null;
  setEditingGroup: (group: ShoppingGroup | null) => void;
  newGroup: { name: string; color: string; icon: string };
  setNewGroup: (group: { name: string; color: string; icon: string }) => void;
  expandedGroups: Set<string>;
  toggleGroupExpansion: (groupId: string) => void;
  getAllUnits: () => string[];
  addCustomUnit: (unit: string) => void;
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
  getAllUnits,
  addCustomUnit,
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    unit: 'UN',
    quantity: 1,
    price: 0,
    purchased: false
  });
  const [newCustomUnit, setNewCustomUnit] = useState('');

  const isExpanded = expandedGroups.has(group.id);

  const addItem = () => {
    if (newItem.name.trim()) {
      if (editingItem) {
        onUpdateItem(group.id, editingItem.id, newItem);
        setEditingItem(null);
      } else {
        onAddItem(group.id, newItem);
      }
      setNewItem({ name: '', unit: 'UN', quantity: 1, price: 0, purchased: false });
      setIsAddingItem(false);
    }
  };

  const startEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      price: item.price,
      purchased: item.purchased
    });
    setIsAddingItem(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: '', unit: 'UN', quantity: 1, price: 0, purchased: false });
    setIsAddingItem(false);
  };

  const handleAddCustomUnit = () => {
    if (newCustomUnit.trim()) {
      addCustomUnit(newCustomUnit.trim());
      setNewItem({ ...newItem, unit: newCustomUnit.trim().toUpperCase() });
      setNewCustomUnit('');
    }
  };

  const sortedItems = [...group.items].sort((a, b) => {
    if (a.purchased === b.purchased) return 0;
    return a.purchased ? 1 : -1;
  });

  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader className="pb-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleGroupExpansion(group.id)}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${group.color}20`, border: `2px solid ${group.color}40` }}
            >
              {group.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {getPurchasedItemsCount(group)}/{group.items.length} itens
              </p>
            </div>
          </div>
          
          {isExpanded && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                setIsAddingItem(true);
              }}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                setEditingGroup(group);
                setNewGroup({ name: group.name, color: group.color, icon: group.icon });
              }}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                onDeleteGroup(group.id);
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {isExpanded && (
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${getProgressPercentage(group)}%`,
                  backgroundColor: group.color 
                }}
              />
            </div>
          </div>
        )}
        
        {/* Total */}
        {!isExpanded ? (
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-bold text-lg" style={{ color: group.color }}>
                R$ {calculateGroupTotal(group).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total do grupo:</span>
              <span className="font-bold text-lg" style={{ color: group.color }}>
                R$ {calculateGroupTotal(group).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-3">
          {/* Add/Edit Item Form */}
          {isAddingItem && (
          <div className="space-y-3 p-3 glass-card animate-slide-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">
                {editingItem ? 'Editar Item' : 'Adicionar Item'}
              </h4>
            </div>
            
            <Input
              placeholder="Nome do item"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="glass-input"
            />
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                  <SelectTrigger className="glass-input flex-1">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border bg-popover z-50">
                    {getAllUnits().map((unit) => (
                      <SelectItem key={unit} value={unit} className="cursor-pointer hover:bg-muted focus:bg-muted">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Nova unidade"
                  value={newCustomUnit}
                  onChange={(e) => setNewCustomUnit(e.target.value)}
                  className="glass-input flex-1"
                />
                <Button onClick={handleAddCustomUnit} variant="outline" size="sm">
                  +
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Quantidade"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="glass-input"
              />
              
              <Input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="glass-input"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addItem} className="gradient-btn-secondary flex-1">
                {editingItem ? 'Salvar' : 'Adicionar'}
              </Button>
              <Button onClick={cancelEdit} variant="ghost">
                Cancelar
              </Button>
            </div>
          </div>
        )}
        
        {/* Items List */}
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all duration-200 animate-slide-in ${
                item.purchased 
                  ? 'bg-success/10 border-success/20' 
                  : 'glass-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleItemPurchased(group.id, item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.purchased
                        ? 'bg-success border-success text-white'
                        : 'border-muted-foreground/30 hover:border-success'
                    }`}
                  >
                    {item.purchased && <Check className="h-3 w-3" />}
                  </button>
                  
                  <div>
                    <p className={`font-medium ${item.purchased ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {item.quantity} {item.unit} × <span className="whitespace-nowrap">R$ {item.price.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="whitespace-nowrap">
                    R$ {(item.quantity * item.price).toFixed(2)}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => startEditItem(item)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDeleteItem(group.id, item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
          {group.items.length === 0 && (
            <div className="text-center py-6">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum item neste grupo</p>
            </div>
          )}
        </CardContent>
      )}
      
      {/* Edit Group Dialog */}
      <Dialog open={editingGroup?.id === group.id} onOpenChange={(open) => {
        if (!open) {
          setEditingGroup(null);
          setNewGroup({ name: '', color: GROUP_COLORS[0], icon: GROUP_ICONS[0] });
        }
      }}>
        <DialogContent className="glass-card border-none">
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do grupo"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
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
                        newGroup.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewGroup({ ...newGroup, color })}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Ícone</label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                  {GROUP_ICONS.map((icon) => (
                    <button
                      key={icon}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg ${
                        newGroup.icon === icon ? 'border-white bg-muted' : 'border-transparent'
                      }`}
                      onClick={() => setNewGroup({ ...newGroup, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                if (newGroup.name.trim()) {
                  onUpdateGroup(group.id, newGroup);
                }
              }} 
              className="gradient-btn w-full"
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ShoppingApp;