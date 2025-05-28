
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { branches } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Customize how StudentAchieve works for your institution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-save Forms</h4>
                      <p className="text-sm text-gray-500">
                        Automatically save form data while editing
                      </p>
                    </div>
                    <Switch id="auto-save" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Default Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-branch">Default Branch</Label>
                    <Select defaultValue={branches[0]}>
                      <SelectTrigger id="default-branch">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveSettings}>Save Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive email notifications for important events
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Student Alerts</h4>
                      <p className="text-sm text-gray-500">
                        Get notified when new students are registered
                      </p>
                    </div>
                    <Switch id="new-student-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Achievement Updates</h4>
                      <p className="text-sm text-gray-500">
                        Receive notifications for new achievements
                      </p>
                    </div>
                    <Switch id="achievement-updates" defaultChecked />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveSettings}>Save Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Achievement Categories</h3>
                <p className="text-sm text-gray-500">
                  Manage the categories used for classifying student achievements.
                </p>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Academic</h4>
                      <p className="text-sm text-gray-500">
                        Academic achievements, certifications, and research
                      </p>
                    </div>
                    <Switch id="academic-category" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Internship</h4>
                      <p className="text-sm text-gray-500">
                        Professional internships and work experience
                      </p>
                    </div>
                    <Switch id="internship-category" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Competition</h4>
                      <p className="text-sm text-gray-500">
                        Participation and awards in competitions
                      </p>
                    </div>
                    <Switch id="competition-category" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Extracurricular</h4>
                      <p className="text-sm text-gray-500">
                        Sports, arts, and other non-academic activities
                      </p>
                    </div>
                    <Switch id="extracurricular-category" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-gray-500">
                  Manage your data, exports, and backups.
                </p>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention Period</Label>
                    <Select defaultValue="1-year">
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="3-years">3 Years</SelectItem>
                        <SelectItem value="5-years">5 Years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Data Management Actions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        Export All Data
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Create Backup
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Restore from Backup
                      </Button>
                      <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
                        Purge Old Records
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveSettings}>Save Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
