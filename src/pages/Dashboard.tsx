import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, AlertTriangle, Radio, Phone, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Call {
  id: string;
  type: string;
  location: string;
  time: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
}

interface Unit {
  id: string;
  callSign: string;
  status: 'AVAILABLE' | 'BUSY' | 'OUT_OF_SERVICE';
  location: string;
  officer: string;
}

const Dashboard = () => {
  const [recentCalls, setRecentCalls] = useState<Call[]>([
    {
      id: '1',
      type: '911 Emergency',
      location: '123 Main St',
      time: '14:32',
      priority: 'HIGH',
      status: 'ACTIVE'
    },
    {
      id: '2',
      type: 'Traffic Stop',
      location: 'Highway 101',
      time: '14:28',
      priority: 'MEDIUM',
      status: 'ACTIVE'
    },
    {
      id: '3',
      type: 'Welfare Check',
      location: '456 Oak Ave',
      time: '14:15',
      priority: 'LOW',
      status: 'CLOSED'
    }
  ]);

  const [activeUnits, setActiveUnits] = useState<Unit[]>([
    {
      id: '1',
      callSign: 'Unit 101',
      status: 'AVAILABLE',
      location: 'Downtown Patrol',
      officer: 'Officer Smith'
    },
    {
      id: '2',
      callSign: 'Unit 205',
      status: 'BUSY',
      location: '123 Main St',
      officer: 'Officer Johnson'
    },
    {
      id: '3',
      callSign: 'Unit 312',
      status: 'AVAILABLE',
      location: 'North District',
      officer: 'Officer Williams'
    }
  ]);

  const { toast } = useToast();

  const activeCalls = recentCalls.filter(call => call.status === 'ACTIVE').length;
  const availableUnits = activeUnits.filter(unit => unit.status === 'AVAILABLE').length;
  const totalBolos = 3; // Mock data

  const handleEditCall = (callId: string) => {
    toast({
      title: "Edit Call",
      description: `Editing call ${callId}`,
    });
  };

  const handleDeleteCall = (callId: string) => {
    setRecentCalls(recentCalls.filter(call => call.id !== callId));
    toast({
      title: "Call Deleted",
      description: "Call has been removed from the system",
    });
  };

  const handleEditUnit = (unitId: string) => {
    toast({
      title: "Edit Unit",
      description: `Editing unit ${unitId}`,
    });
  };

  const handleDeleteUnit = (unitId: string) => {
    setActiveUnits(activeUnits.filter(unit => unit.id !== unitId));
    toast({
      title: "Unit Deleted", 
      description: "Unit has been removed from the system",
    });
  };

  const handleStatusChange = (unitId: string, newStatus: 'AVAILABLE' | 'BUSY' | 'OUT_OF_SERVICE') => {
    setActiveUnits(activeUnits.map(unit => 
      unit.id === unitId ? { ...unit, status: newStatus } : unit
    ));
    const unit = activeUnits.find(u => u.id === unitId);
    toast({
      title: "Status Updated",
      description: `${unit?.callSign} status changed to ${newStatus.replace('_', ' ')}`,
    });
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
              <div className="flex gap-2">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant="outline" className="border-border">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="border-destructive/20 hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
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
                    <p className="text-xs text-muted-foreground">{call.time}</p>
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
              <div className="flex gap-2">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant="outline" className="border-border">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="border-destructive/20 hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
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
                      <h4 className="font-medium">{unit.callSign}</h4>
                      
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