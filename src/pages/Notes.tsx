import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertTriangle, Phone, FileText, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  type: 'BOLO' | '911_CALL' | 'CUSTOM';
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  customType?: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      type: 'BOLO',
      title: 'Suspect Vehicle - Blue Sedan',
      description: 'License plate ABC-123, wanted in connection with robbery on Main Street',
      priority: 'HIGH',
      timestamp: '2024-01-15 14:30'
    },
    {
      id: '2',
      type: '911_CALL',
      title: 'Domestic Disturbance',
      description: 'Caller reports loud argument at 456 Oak Avenue, multiple units requested',
      priority: 'MEDIUM',
      timestamp: '2024-01-15 14:25'
    },
    {
      id: '3',
      type: 'CUSTOM',
      title: 'Traffic Advisory',
      description: 'Road closure on Highway 101 due to construction, expect delays',
      priority: 'LOW',
      timestamp: '2024-01-15 13:45',
      customType: 'Traffic'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState<{
    type: 'BOLO' | '911_CALL' | 'CUSTOM';
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    customType: string;
  }>({
    type: 'CUSTOM',
    title: '',
    description: '',
    priority: 'MEDIUM',
    customType: ''
  });

  const { toast } = useToast();

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (newNote.type === 'CUSTOM' && !newNote.customType.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please specify the custom call type.",
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      type: newNote.type,
      title: newNote.title,
      description: newNote.description,
      priority: newNote.priority,
      timestamp: new Date().toLocaleString(),
      customType: newNote.type === 'CUSTOM' ? newNote.customType : undefined
    };

    setNotes([note, ...notes]);
    setNewNote({
      type: 'CUSTOM',
      title: '',
      description: '',
      priority: 'MEDIUM',
      customType: ''
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Note Added",
      description: `${note.type} note has been successfully added.`,
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BOLO': return <AlertTriangle className="w-4 h-4" />;
      case '911_CALL': return <Phone className="w-4 h-4" />;
      case 'CUSTOM': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BOLO': return 'bg-warning/20 text-warning border-warning/30';
      case '911_CALL': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'CUSTOM': return 'bg-info/20 text-info border-info/30';
      default: return 'bg-secondary/20 text-secondary border-secondary/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Notes</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-type">Note Type</Label>
                <Select 
                  value={newNote.type} 
                  onValueChange={(value: 'BOLO' | '911_CALL' | 'CUSTOM') => 
                    setNewNote({...newNote, type: value})
                  }
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="BOLO">BOLO</SelectItem>
                    <SelectItem value="911_CALL">911 Call</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newNote.type === 'CUSTOM' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-type">Custom Type</Label>
                  <Input
                    id="custom-type"
                    value={newNote.customType}
                    onChange={(e) => setNewNote({...newNote, customType: e.target.value})}
                    placeholder="e.g., Traffic, Weather, etc."
                    className="bg-input border-border"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Brief description"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-description">Description</Label>
                <Textarea
                  id="note-description"
                  value={newNote.description}
                  onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                  placeholder="Detailed information..."
                  className="bg-input border-border min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-priority">Priority</Label>
                <Select 
                  value={newNote.priority} 
                  onValueChange={(value: 'HIGH' | 'MEDIUM' | 'LOW') => 
                    setNewNote({...newNote, priority: value})
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
                <Button onClick={handleAddNote} className="flex-1">
                  Add Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-border"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="border-warning/30 hover:bg-warning/10 text-warning hover:text-warning p-6"
          onClick={() => {
            setNewNote({...newNote, type: 'BOLO'});
            setIsAddDialogOpen(true);
          }}
        >
          <AlertTriangle className="w-6 h-6 mr-2" />
          <div className="text-left">
            <div className="font-medium">Add BOLO</div>
            <div className="text-xs opacity-70">Be On Lookout</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive p-6"
          onClick={() => {
            setNewNote({...newNote, type: '911_CALL'});
            setIsAddDialogOpen(true);
          }}
        >
          <Phone className="w-6 h-6 mr-2" />
          <div className="text-left">
            <div className="font-medium">Add 911 Call</div>
            <div className="text-xs opacity-70">Emergency Response</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="border-info/30 hover:bg-info/10 text-info hover:text-info p-6"
          onClick={() => {
            setNewNote({...newNote, type: 'CUSTOM'});
            setIsAddDialogOpen(true);
          }}
        >
          <FileText className="w-6 h-6 mr-2" />
          <div className="text-left">
            <div className="font-medium">Add Custom</div>
            <div className="text-xs opacity-70">Custom Note Type</div>
          </div>
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getTypeColor(note.type)}`}>
                    {getTypeIcon(note.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(note.type)}>
                        {note.type === 'CUSTOM' && note.customType ? note.customType : note.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(note.priority)}>
                        {note.priority}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {note.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{note.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first BOLO, 911 call, or custom note</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Note
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notes;