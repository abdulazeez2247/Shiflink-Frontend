
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, DollarSign, Shield, Bell, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlatformSettingsDialogProps {
  children: React.ReactNode;
}

const PlatformSettingsDialog = ({ children }: PlatformSettingsDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Platform configuration state
  const [settings, setSettings] = useState({
    platformName: 'DSP Training Platform',
    adminEmail: 'admin@dsptraining.com',
    supportEmail: 'support@dsptraining.com',
    maxUsersPerAgency: 100,
    defaultCommissionRate: 15,
    enableAutoApprovals: false,
    enableNotifications: true,
    requireCertificateUploads: true,
    enablePaymentProcessing: true,
    maintenanceMode: false,
    maxFileSize: 10,
    sessionTimeout: 60
  });

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save settings
    console.log('Saving platform settings:', settings);
    toast({
      title: "Settings Saved",
      description: "Platform settings have been successfully updated.",
    });
    setIsOpen(false);
  };

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Platform Settings
          </DialogTitle>
          <DialogDescription>
            Configure platform-wide settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) => handleInputChange('platformName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable platform access</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  User Management
                </CardTitle>
                <CardDescription>Configure user limits and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">Max Users Per Agency</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={settings.maxUsersPerAgency}
                      onChange={(e) => handleInputChange('maxUsersPerAgency', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto Approvals</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve trainer applications</p>
                  </div>
                  <Switch
                    checked={settings.enableAutoApprovals}
                    onCheckedChange={(checked) => handleInputChange('enableAutoApprovals', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Certificate Uploads</Label>
                    <p className="text-sm text-muted-foreground">Trainers must upload certificates to get approved</p>
                  </div>
                  <Switch
                    checked={settings.requireCertificateUploads}
                    onCheckedChange={(checked) => handleInputChange('requireCertificateUploads', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commission" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Commission Settings
                </CardTitle>
                <CardDescription>Configure commission rates and payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Default Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.defaultCommissionRate}
                      onChange={(e) => handleInputChange('defaultCommissionRate', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Payment Processing</Label>
                    <p className="text-sm text-muted-foreground">Allow automatic commission payments</p>
                  </div>
                  <Switch
                    checked={settings.enablePaymentProcessing}
                    onCheckedChange={(checked) => handleInputChange('enablePaymentProcessing', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxFileSize}
                      onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Security Notice</h4>
                  <p className="text-sm text-yellow-700">
                    Additional security settings like two-factor authentication and password policies 
                    can be configured through the advanced security panel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  System Information
                </CardTitle>
                <CardDescription>Platform status and system details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Platform Version</Label>
                    <p className="text-sm text-muted-foreground">v2.1.4</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Database Status</Label>
                    <p className="text-sm text-green-600">Connected</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Last Backup</Label>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Server Status</Label>
                    <p className="text-sm text-green-600">Operational</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">System Health</h4>
                  <p className="text-sm text-blue-700">
                    All systems are operating normally. Regular maintenance is scheduled for weekends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformSettingsDialog;
