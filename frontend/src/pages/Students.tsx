
import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Download, 
  Filter, 
  Plus, 
  Search,
  Upload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddStudentForm } from "@/components/forms/AddStudentForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudents, useUploadExcel } from "@/hooks/useStudents";
import { embedDashboard } from "@superset-ui/embedded-sdk";

const Students = () => {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  
  const { data: studentsData, isLoading, error } = useStudents();
  const uploadExcelMutation = useUploadExcel();

  // Get unique branches and batches from actual data
  const uniqueBranches = React.useMemo(() => {
    if (!studentsData?.data) return [];
    return [...new Set(studentsData.data.map(student => student.branch))].sort();
  }, [studentsData]);

  const uniqueBatches = React.useMemo(() => {
    if (!studentsData?.data) return [];
    return [...new Set(studentsData.data.map(student => student.batch))].sort((a, b) => b - a);
  }, [studentsData]);

  // Embed Superset dashboard for student analytics
  useEffect(() => {
    const timeout = setTimeout(() => {
      const dashboardElement = document.getElementById("students-analytics-dashboard");
      if (dashboardElement && studentsData?.data) {
        // Clear any existing content
        dashboardElement.innerHTML = '';
        
        embedDashboard({
          id: "5a18b44c-8a13-4d7b-abb4-caae2f22b30f", // Student data dashboard ID
          supersetDomain: "http://localhost:5000",
          mountPoint: dashboardElement,
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
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [studentsData]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadExcelMutation.mutate(file);
    }
  };

  // Filter students based on search and filters
  const filteredStudents = studentsData?.data?.filter(student => {
    // Search filter
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.usn.toLowerCase().includes(search.toLowerCase());
    
    // Branch filter
    const matchesBranch = branchFilter ? student.branch === branchFilter : true;
    
    // Year filter - using batch as year equivalent
    const matchesYear = yearFilter ? student.batch === yearFilter : true;
    
    return matchesSearch && matchesBranch && matchesYear;
  }) || [];

  const clearFilters = () => {
    setBranchFilter(null);
    setYearFilter(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Students</h2>
          <p className="text-gray-500 mb-4">Failed to fetch students from the server.</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Students</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students Directory</CardTitle>
          <CardDescription>
            Manage and view all student profiles in the system. Total: {studentsData?.count || 0} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by name or USN..." 
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white z-50">
                  <div className="p-2">
                    <h4 className="font-medium mb-2">By Branch</h4>
                    <div className="space-y-1">
                      {uniqueBranches.map(branch => (
                        <DropdownMenuItem 
                          key={branch}
                          className="cursor-pointer"
                          onClick={() => setBranchFilter(branch)}
                        >
                          {branch}
                        </DropdownMenuItem>
                      ))}
                    </div>
                    
                    <h4 className="font-medium mb-2 mt-4">By Batch</h4>
                    <div className="space-y-1">
                      {uniqueBatches.map(batch => (
                        <DropdownMenuItem 
                          key={batch}
                          className="cursor-pointer"
                          onClick={() => setYearFilter(batch)}
                        >
                          Batch {batch}
                        </DropdownMenuItem>
                      ))}
                    </div>
                    
                    {(branchFilter || yearFilter) && (
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadExcelMutation.isPending}
                />
                <Button variant="outline" disabled={uploadExcelMutation.isPending}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadExcelMutation.isPending ? 'Uploading...' : 'Upload Excel'}
                </Button>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <AddStudentForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active filters */}
          {(branchFilter || yearFilter) && (
            <div className="flex gap-2 mb-4">
              {branchFilter && (
                <div className="bg-accent text-accent-foreground text-xs rounded-full px-3 py-1 flex items-center">
                  Branch: {branchFilter}
                  <button 
                    className="ml-2 hover:text-gray-700"
                    onClick={() => setBranchFilter(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
              {yearFilter && (
                <div className="bg-accent text-accent-foreground text-xs rounded-full px-3 py-1 flex items-center">
                  Batch: {yearFilter}
                  <button 
                    className="ml-2 hover:text-gray-700"
                    onClick={() => setYearFilter(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Students Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.usn}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.usn}</TableCell>
                      <TableCell>{student.branch}</TableCell>
                      <TableCell>Batch {student.batch}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/students/${student.usn}`}>View Profile</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredStudents.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">No students match your filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Embedded Dashboard Section */}
      <Card>
        <CardHeader>
          <CardTitle>Student Analytics</CardTitle>
          <CardDescription>
            Interactive visualizations of student performance and metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            id="students-analytics-dashboard" 
            className="w-full min-h-[800px] border rounded-lg overflow-hidden"
            style={{ height: '800px' }}
          >
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading analytics dashboard...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
