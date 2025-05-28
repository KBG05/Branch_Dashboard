import React, { useState } from "react";
import { Users, Trophy, GraduationCap, Briefcase, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/ui/stats-card";
import CategoryBadge from "@/components/ui/category-badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { AddAchievementForm } from "@/components/forms/AddAchievementForm";
import { useStudents } from "@/hooks/useStudents";
import { useAchievements } from "@/hooks/useAchievements";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [studentSearch, setStudentSearch] = useState("");
  const [achievementTab, setAchievementTab] = useState("all");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch real student and achievement data
  const { data: studentsData, isLoading: studentsLoading } = useStudents();
  const { data: achievementsData, isLoading: achievementsLoading } = useAchievements();

  // Helper function to ensure valid category type
  const getValidCategoryType = (type: string | null | undefined): "academic" | "internship" | "competition" | "extracurricular" => {
    if (type === "academic" || type === "internship" || type === "competition" || type === "extracurricular") {
      return type;
    }
    return "academic"; // default fallback
  };

  // Filter achievements based on the selected tab
  const filteredAchievements = achievementsData?.data?.filter(achievement => {
    if (achievementTab !== "all") {
      return achievement.achievement_type === achievementTab;
    }
    return true;
  }) || [];

  // Filter students based on search query
  const filteredStudents = studentsData?.data?.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.usn.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.branch.toLowerCase().includes(studentSearch.toLowerCase())
  ) || [];

  // Calculate stats from real data
  const totalStudents = studentsData?.count || 0;
  const totalAchievements = achievementsData?.count || 0;
  const academicAchievements = achievementsData?.data?.filter(a => a.achievement_type === 'academic').length || 0;
  const internships = achievementsData?.data?.filter(a => a.achievement_type === 'internship').length || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Students" value={totalStudents} icon={Users} />
        <StatsCard title="Total Achievements" value={totalAchievements} icon={Trophy} />
        <StatsCard title="Academic Achievements" value={academicAchievements} icon={GraduationCap} />
        <StatsCard title="Internships" value={internships} icon={Briefcase} />
      </div>

      {/* Recent Students */}
      <Card className="enhanced-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Students</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-8 w-[250px] border-2 border-border focus:border-primary"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                />
              </div>
              <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button className="border-2 border-primary hover:border-primary/80">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] enhanced-dialog">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <AddStudentForm onSuccess={() => setIsAddStudentOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="table-enhanced">
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
                    {filteredStudents.slice(0, 5).map((student) => (
                      <TableRow key={student.usn}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.usn}</TableCell>
                        <TableCell>{student.branch}</TableCell>
                        <TableCell>Batch {student.batch}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.usn}`)} className="border-2 border-border hover:border-primary">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <div className="mt-4 text-center border-t border-border pt-4">
            <Button variant="outline" onClick={() => navigate('/students')} className="border-2 border-border hover:border-primary">
              View All Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="enhanced-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Achievements</CardTitle>
            <Dialog open={isAddAchievementOpen} onOpenChange={setIsAddAchievementOpen}>
              <DialogTrigger asChild>
                <Button className="border-2 border-primary hover:border-primary/80">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Achievement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] enhanced-dialog">
                <DialogHeader>
                  <DialogTitle>Add New Achievement</DialogTitle>
                </DialogHeader>
                <AddAchievementForm 
                  onSuccess={() => setIsAddAchievementOpen(false)}
                  onCancel={() => setIsAddAchievementOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-border rounded-lg p-4 bg-muted/20">
            <Tabs defaultValue="all" onValueChange={setAchievementTab} className="mb-6">
              <TabsList className="grid grid-cols-5 w-full max-w-[600px] border-2 border-border bg-muted">
                <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:text-foreground">All</TabsTrigger>
                <TabsTrigger value="academic" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Academic</TabsTrigger>
                <TabsTrigger value="internship" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Internship</TabsTrigger>
                <TabsTrigger value="competition" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Competition</TabsTrigger>
                <TabsTrigger value="extracurricular" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Extracurricular</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-x-auto mt-4">
            {achievementsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="table-enhanced">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Student USN</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAchievements.slice(0, 5).map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium">{achievement.title}</TableCell>
                        <TableCell>
                          <CategoryBadge category={getValidCategoryType(achievement.achievement_type)} />
                        </TableCell>
                        <TableCell>{achievement.usn}</TableCell>
                        <TableCell>{achievement.achievement_date ? new Date(achievement.achievement_date).toLocaleDateString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="mt-4 text-center border-t border-border pt-4">
            <Button variant="outline" onClick={() => navigate('/achievements')} className="border-2 border-border hover:border-primary">
              View All Achievements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
