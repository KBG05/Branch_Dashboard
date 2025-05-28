
import React, { useState, useEffect } from "react";
import { Download, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { studentService } from "@/services/studentService";
import { achievementService } from "@/services/achievementService";
import { reportsService } from "@/services/reportsService";

const Reports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("student-data");
  const [resultUploadOpen, setResultUploadOpen] = useState(false);

  // Embed Superset dashboards with proper tab switching
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Clear both dashboards first
      const studentDashboardElement = document.getElementById("student-data-dashboard");
      const resultsDashboardElement = document.getElementById("results-dashboard");
      
      if (studentDashboardElement) {
        studentDashboardElement.innerHTML = '';
      }
      if (resultsDashboardElement) {
        resultsDashboardElement.innerHTML = '';
      }

      if (activeTab === "student-data" && studentDashboardElement) {
        embedDashboard({
          id: "5a18b44c-8a13-4d7b-abb4-caae2f22b30f", // Student data dashboard ID
          supersetDomain: "http://localhost:5000",
          mountPoint: studentDashboardElement,
          fetchGuestToken: () => 
            fetch("http://localhost:5000/api/v1/security/guest_token/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: {
                  username: "guest",
                  first_name: "Guest",
                  last_name: "User",
                },
                resources: [{
                  type: "dashboard",
                  id: "5a18b44c-8a13-4d7b-abb4-caae2f22b30f"
                }],
                rls: []
              }),
            })
            .then(response => response.json())
            .then(data => data.token),
          dashboardUiConfig: {
            hideTitle: false,
            hideTab: true,
            hideChartControls: false,
          },
        });
      } else if (activeTab === "results" && resultsDashboardElement) {
        embedDashboard({
          id: "972ed42d-d930-4d4a-a77b-88846204c5ac", // Results dashboard ID
          supersetDomain: "http://localhost:5000",
          mountPoint: resultsDashboardElement,
          fetchGuestToken: () => 
            fetch("http://localhost:5000/api/v1/security/guest_token/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: {
                  username: "guest",
                  first_name: "Guest",
                  last_name: "User",
                },
                resources: [{
                  type: "dashboard",
                  id: "972ed42d-d930-4d4a-a77b-88846204c5ac"
                }],
                rls: []
              }),
            })
            .then(response => response.json())
            .then(data => data.token),
          dashboardUiConfig: {
            hideTitle: false,
            hideTab: true,
            hideChartControls: false,
          },
          iframeSandboxExtras: ['allow-same-origin', 'allow-scripts']
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeTab]);

  const handleExport = async (type: string) => {
    try {
      let blob: Blob;
      let filename: string;
      
      if (type === "Students") {
        blob = await studentService.exportStudents();
        filename = 'students.csv';
      } else {
        blob = await achievementService.exportAchievements();
        filename = 'achievements.csv';
      }
      
      reportsService.downloadBlob(blob, filename);
      
      toast({
        title: "Export completed",
        description: `${type} data has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: `Failed to export ${type} data.`,
        variant: "destructive",
      });
    }
  };

  const handleCustomReport = async (reportType: string) => {
    try {
      let reportName: string;
      let filename: string;
      
      if (reportType === "Grade Matrix") {
        reportName = "grade_matrix";
        filename = "grade_matrix.xlsx";
      } else if (reportType === "Category Distribution") {
        reportName = "category_distribution";
        filename = "category_distribution.xlsx";
      } else {
        toast({
          title: "Report Generation",
          description: `${reportType} report generation is not available.`,
        });
        return;
      }
      
      const blob = await reportsService.generateCustomReport(reportName);
      reportsService.downloadBlob(blob, filename);
      
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: `Failed to generate ${reportType} report.`,
        variant: "destructive",
      });
    }
  };

  const handleResultUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await reportsService.uploadResult(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed and uploaded.`,
        });
        setResultUploadOpen(false);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload the result file. Please try again.",
          variant: "destructive",
        });
      }
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("Students")} className="enhanced-button">
            <Download className="h-4 w-4 mr-2" />
            Export Students
          </Button>
          <Button variant="outline" onClick={() => handleExport("Achievements")} className="enhanced-button">
            <Download className="h-4 w-4 mr-2" />
            Export Achievements
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="enhanced-button">
                <FileText className="h-4 w-4 mr-2" />
                Custom Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 enhanced-dropdown bg-background border-border">
              <DropdownMenuItem onClick={() => handleCustomReport("Grade Matrix")} className="focus:bg-muted">
                Grade Matrix Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCustomReport("Category Distribution")} className="focus:bg-muted">
                Category Distribution Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={resultUploadOpen} onOpenChange={setResultUploadOpen}>
            <DialogTrigger asChild>
              <Button className="enhanced-button">
                <Upload className="h-4 w-4 mr-2" />
                Upload Results
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] enhanced-dialog bg-background border-border">
              <DialogHeader>
                <DialogTitle>Upload Results</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload student results in PDF format. The system will process and integrate the data automatically.
                </p>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Select File</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResultUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="w-full enhanced-button">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File (PDF Only)
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Embedded Superset Dashboards */}
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Interactive visualizations powered by Apache Superset
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 py-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="student-data" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Student Data</TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Results</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="student-data" className="m-0">
              <div 
                id="student-data-dashboard" 
                className="w-full bg-white"
                style={{ width: '100%',
                      height: '900px',
                      minHeight: '900px',
                      }}
              >
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading student data dashboard...</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="results" className="m-0">
              <div 
                id="results-dashboard" 
                className="w-full bg-white"
                style={{ height: '900px', minHeight: '900px' }}
              >
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading results dashboard...</p>
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

export default Reports;
