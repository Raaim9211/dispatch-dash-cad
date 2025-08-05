import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, MapPin, Clock, Users, AlertTriangle } from 'lucide-react';

const Dispatch = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dispatch</h1>
      
      {/* Under Construction Notice */}
      <Card className="bg-card border-border">
        <CardContent className="text-center py-12">
          <Radio className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Dispatch Center</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The dispatch module is currently under development. This section will include 
            real-time unit tracking, call assignment, and communication tools.
          </p>
          <Badge variant="outline" className="border-info/30 text-info">
            Coming Soon
          </Badge>
        </CardContent>
      </Card>

      {/* Preview Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Real-time unit positions and incident locations on interactive map
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Call Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Prioritized queue of incoming calls awaiting dispatch
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Unit Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Drag-and-drop interface for assigning units to calls
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dispatch;