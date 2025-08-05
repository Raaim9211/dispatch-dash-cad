import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Save } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  created_at: string;
}

interface UserManagementDialogProps {
  user: UserProfile;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_ROLES = ['admin', 'dispatcher', 'officer'];

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({ 
  user, 
  open, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        })
        .eq('user_id', user.user_id);

      if (profileError) throw profileError;

      // Update roles - remove all existing roles first
      const { error: deleteRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.user_id);

      if (deleteRolesError) throw deleteRolesError;

      // Add new roles
      if (selectedRoles.length > 0) {
        const roleInserts = selectedRoles.map(role => ({
          user_id: user.user_id,
          role: role as any
        }));

        const { error: insertRolesError } = await supabase
          .from('user_roles')
          .insert(roleInserts);

        if (insertRolesError) throw insertRolesError;
      }

      toast({
        title: "User Updated",
        description: "User information and roles have been updated successfully.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update user information.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setSelectedRoles(prev => 
      checked 
        ? [...prev, role]
        : prev.filter(r => r !== role)
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'dispatcher': return 'default';
      case 'officer': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit User: {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Roles Management */}
          <div className="space-y-3">
            <Label>User Roles</Label>
            <div className="space-y-3">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                    />
                    <Label htmlFor={role} className="capitalize cursor-pointer">
                      {role}
                    </Label>
                  </div>
                  <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                    {role}
                  </Badge>
                </div>
              ))}
            </div>
            {selectedRoles.length === 0 && (
              <p className="text-sm text-muted-foreground">
                User will have no special permissions
              </p>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Account Information</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>User ID: {user.user_id}</p>
              <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;