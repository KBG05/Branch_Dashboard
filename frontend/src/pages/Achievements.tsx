
import React, { useState } from "react";
import { 
  ChevronDown, 
  Download, 
  Edit, 
  Filter, 
  Plus, 
  Search, 
  Trash2,
  Upload 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryBadge from "@/components/ui/category-badge";
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
import { AddAchievementForm } from "@/components/forms/AddAchievementForm";
import { EditAchievementForm } from "@/components/forms/EditAchievementForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAchievements, useDeleteAchievement, useUploadAchievementExcel } from "@/hooks/useAchievements";
import * as XLSX from 'xlsx';

const Achievements = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: achievementsData, isLoading, error } = useAchievements();
  const deleteAchievement = useDeleteAchievement();
  const uploadExcel = useUploadAchievementExcel();

  const achievements = achievementsData?.data || [];

  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    // Search filter
    const matchesSearch = 
      achievement.title.toLowerCase().includes(search.toLowerCase()) ||
      achievement.usn.toLowerCase().includes(search.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter ? achievement.achievement_type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    deleteAchievement.mutate(id);
  };

  const handleExportCSV = () => {
    if (filteredAchievements.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no achievements to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = filteredAchievements.map(achievement => ({
      USN: achievement.usn,
      Title: achievement.title,
      Description: achievement.description || '',
      Type: achievement.achievement_type || '',
      Date: achievement.achievement_date ? new Date(achievement.achievement_date).toLocaleDateString() : '',
      'Certificate URL': achievement.certificated_url || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Achievements");
    XLSX.writeFile(wb, `achievements_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Export successful",
      description: "Achievements data has been exported to Excel.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadExcel.mutate(file);
      event.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Error Loading Achievements</h2>
        <p className="text-gray-500 mb-6">Failed to load achievements data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>

      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle>Student Achievements</CardTitle>
          <CardDescription>
            Track and manage all student achievements across different categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by title or USN..." 
                className="pl-9 enhanced-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 enhanced-button">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 enhanced-dropdown">
                  <div className="p-2">
                    <h4 className="font-medium mb-2">By Type</h4>
                    <div className="space-y-1">
                      {["academic", "internship", "competition", "extracurricular"].map(type => (
                        <DropdownMenuItem 
                          key={type}
                          className="cursor-pointer"
                          onClick={() => setTypeFilter(type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </div>
                    
                    {typeFilter && (
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4"
                        onClick={() => setTypeFilter(null)}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handleExportCSV} className="enhanced-button">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="enhanced-button">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Excel
                </Button>
              </div>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="enhanced-button">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] enhanced-dialog">
                  <DialogHeader>
                    <DialogTitle>Add New Achievement</DialogTitle>
                  </DialogHeader>
                  <AddAchievementForm onSuccess={() => setAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active filters */}
          {typeFilter && (
            <div className="flex gap-2 mb-4">
              <div className="bg-accent text-accent-foreground text-xs rounded-full px-3 py-1 flex items-center border-2 border-border">
                Type: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                <button 
                  className="ml-2 hover:text-gray-700"
                  onClick={() => setTypeFilter(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Achievements Table */}
          <div className="table-enhanced">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Student USN</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell className="font-medium">{achievement.title}</TableCell>
                      <TableCell>
                        {achievement.achievement_type && (
                          <CategoryBadge category={achievement.achievement_type as any} />
                        )}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={`/students/${achievement.usn}`}
                          className="text-primary hover:underline"
                        >
                          {achievement.usn}
                        </a>
                      </TableCell>
                      <TableCell>
                        {achievement.achievement_date 
                          ? new Date(achievement.achievement_date).toLocaleDateString() 
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setEditingAchievement(achievement)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px] enhanced-dialog">
                              <DialogHeader>
                                <DialogTitle>Edit Achievement</DialogTitle>
                              </DialogHeader>
                              {editingAchievement && (
                                <EditAchievementForm 
                                  achievement={editingAchievement} 
                                  onSuccess={() => setEditDialogOpen(false)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(achievement.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredAchievements.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">No achievements match your filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
