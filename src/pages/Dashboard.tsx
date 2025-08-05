import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, AlertTriangle, Radio, Phone, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Call {
  id: string;
  type: string;
  location: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  created_at: string;
}

interface Unit {
  id: string;
  unit_number: string;
  status: 'AVAILABLE' | 'BUSY' | 'OUT_OF_SERVICE';
  location: string;
  officer: string;
  created_at: string;
}

const Dashboard = () => {
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [activeUnits, setActiveUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [callsResponse, unitsResponse] = await Promise.all([
        supabase.from('calls').select('*').order('created_at', { ascending: false }),
        supabase.from('units').select('*').order('created_at', { ascending: false })
      ]);

      if (callsResponse.data) setRecentCalls(callsResponse.data as Call[]);
      if (unitsResponse.data) setActiveUnits(unitsResponse.data as Unit[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const { toast } = useToast();

  // Dialog states
  const [isAddCallDialogOpen, setIsAddCallDialogOpen] = useState(false);
  const [isAddUnitDialogOpen, setIsAddUnitDialogOpen] = useState(false);
  
  // New call form state
  const [newCall, setNewCall] = useState({
    type: '',
    location: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW'
  });

  // New unit form state
  const [newUnit, setNewUnit] = useState({
    callSign: '',
    officer: '',
    location: '',
    status: 'AVAILABLE' as 'AVAILABLE' | 'BUSY' | 'OUT_OF_SERVICE'
  });

  const activeCalls = recentCalls.filter(call => call.status === 'ACTIVE').length;
  const availableUnits = activeUnits.filter(unit => unit.status === 'AVAILABLE').length;
  const totalBolos = recentCalls.filter(call => call.type.includes('BOLO') && call.status === 'ACTIVE').length;

  const handleAddCall = async () => {
    if (!newCall.type.trim() || !newCall.location.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.from('calls').insert([{
        type: newCall.type,
        location: newCall.location,
        priority: newCall.priority,
        status: 'ACTIVE'
      }]).select();

      if (error) throw error;
      
      if (data) {
        setRecentCalls([data[0] as Call, ...recentCalls]);
        setNewCall({ type: '', location: '', priority: 'MEDIUM' });
        setIsAddCallDialogOpen(false);

        toast({
          title: "Call Added",
          description: "New call has been successfully added.",
        });
      }
    } catch (error) {
      console.error('Error adding call:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add call",
      });
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.callSign.trim() || !newUnit.officer.trim() || !newUnit.location.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.from('units').insert([{
        unit_number: newUnit.callSign,
        officer: newUnit.officer,
        location: newUnit.location,
        status: newUnit.status
      }]).select();

      if (error) throw error;
      
      if (data) {
        setActiveUnits([...activeUnits, data[0] as Unit]);
        setNewUnit({ callSign: '', officer: '', location: '', status: 'AVAILABLE' });
        setIsAddUnitDialogOpen(false);

        toast({
          title: "Unit Added",
          description: "New unit has been successfully added.",
        });
      }
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add unit",
      });
    }
  };

  const handleEditCall = (callId: string) => {
    toast({
      title: "Edit Call",
      description: `Editing call ${callId}`,
    });
  };

  const handleDeleteCall = async (callId: string) => {
    try {
      await supabase.from('calls').delete().eq('id', callId);
      setRecentCalls(recentCalls.filter(call => call.id !== callId));
      toast({
        title: "Call Deleted",
        description: "Call has been removed from the system",
      });
    } catch (error) {
      console.error('Error deleting call:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete call",
      });
    }
  };

  const handleEditUnit = (unitId: string) => {
    toast({
      title: "Edit Unit",
      description: `Editing unit ${unitId}`,
    });
  };

  const handleDeleteUnit = async (unitId: string) => {
    try {
      await supabase.from('units').delete().eq('id', unitId);
      setActiveUnits(activeUnits.filter(unit => unit.id !== unitId));
      toast({
        title: "Unit Deleted", 
        description: "Unit has been removed from the system",
      });
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete unit",
      });
    }
  };

  const handleStatusChange = async (unitId: string, newStatus: 'AVAILABLE' | 'BUSY' | 'OUT_OF_SERVICE') => {
    try {
      await supabase.from('units').update({ status: newStatus }).eq('id', unitId);
      setActiveUnits(activeUnits.map(unit => 
        unit.id === unitId ? { ...unit, status: newStatus } : unit
      ));
      const unit = activeUnits.find(u => u.id === unitId);
      toast({
        title: "Status Updated",
        description: `${unit?.unit_number} status changed to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM': return 'bg-warning text-warning-foreground';
      case 'LOW': return 'bg-info text-info-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-success text-success-foreground';
      case 'BUSY': return 'bg-warning text-warning-foreground';
      case 'OUT_OF_SERVICE': return 'bg-destructive text-destructive-foreground';
      case 'ACTIVE': return 'bg-info text-info-foreground';
      case 'PENDING': return 'bg-warning text-warning-foreground';
      case 'CLOSED': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{activeCalls}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{availableUnits}</div>
            <p className="text-xs text-muted-foreground">Ready for dispatch</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BOLOs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalBolos}</div>
            <p className="text-xs text-muted-foreground">Be on lookout notices</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Calls</CardTitle>
              <Dialog open={isAddCallDialogOpen} onOpenChange={setIsAddCallDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Call</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="call-type">Call Type</Label>
                      <Input
                        id="call-type"
                        value={newCall.type}
                        onChange={(e) => setNewCall({...newCall, type: e.target.value})}
                        placeholder="e.g., 911 Emergency, Traffic Stop"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="call-location">Location</Label>
                      <Input
                        id="call-location"
                        value={newCall.location}
                        onChange={(e) => setNewCall({...newCall, location: e.target.value})}
                        placeholder="Address or intersection"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="call-priority">Priority</Label>
                      <Select 
                        value={newCall.priority} 
                        onValueChange={(value: 'HIGH' | 'MEDIUM' | 'LOW') => 
                          setNewCall({...newCall, priority: value})
                        }
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddCall} className="flex-1">
                        Add Call
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddCallDialogOpen(false)}
                        className="border-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                      onClick={() => handleEditCall(call.id)}
                    >
                      <Edit className="w-3 h-3 text-primary" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                      onClick={() => handleDeleteCall(call.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>

                  {/* Call Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{call.type}</h4>
                      <Badge className={getPriorityColor(call.priority)}>
                        {call.priority}
                      </Badge>
                      <Badge className={getStatusColor(call.status)}>
                        {call.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{call.location}</p>
                    <p className="text-xs text-muted-foreground">{new Date(call.created_at).toLocaleTimeString()}</p>
                  </div>

                  <Radio className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Units */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Active Units</CardTitle>
              <Dialog open={isAddUnitDialogOpen} onOpenChange={setIsAddUnitDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Unit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit-callsign">Call Sign</Label>
                      <Input
                        id="unit-callsign"
                        value={newUnit.callSign}
                        onChange={(e) => setNewUnit({...newUnit, callSign: e.target.value})}
                        placeholder="e.g., Unit 101"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit-officer">Officer</Label>
                      <Input
                        id="unit-officer"
                        value={newUnit.officer}
                        onChange={(e) => setNewUnit({...newUnit, officer: e.target.value})}
                        placeholder="Officer name"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit-location">Location</Label>
                      <Input
                        id="unit-location"
                        value={newUnit.location}
                        onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
                        placeholder="Current patrol location"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit-status">Status</Label>
                      <Select 
                        value={newUnit.status} 
                        onValueChange={(value: 'AVAILABLE' | 'BUSY' | 'OUT_OF_SERVICE') => 
                          setNewUnit({...newUnit, status: value})
                        }
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="BUSY">Busy</SelectItem>
                          <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddUnit} className="flex-1">
                        Add Unit
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddUnitDialogOpen(false)}
                        className="border-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeUnits.map((unit) => (
                <div key={unit.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                      onClick={() => handleEditUnit(unit.id)}
                    >
                      <Edit className="w-3 h-3 text-primary" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                      onClick={() => handleDeleteUnit(unit.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>

                  {/* Unit Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{unit.unit_number}</h4>
                      
                      {/* Status Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-6 px-2 text-xs border-0 ${getStatusColor(unit.status)} hover:opacity-80`}
                          >
                            {unit.status.replace('_', ' ')}
                            <MoreVertical className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="bg-popover border-border shadow-lg z-50"
                          align="start"
                        >
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(unit.id, 'AVAILABLE')}
                            className="hover:bg-success/10 hover:text-success"
                          >
                            Available
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(unit.id, 'BUSY')}
                            className="hover:bg-warning/10 hover:text-warning"
                          >
                            Busy
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(unit.id, 'OUT_OF_SERVICE')}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            Out of Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground">{unit.officer}</p>
                    <p className="text-xs text-muted-foreground">{unit.location}</p>
                  </div>

                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
