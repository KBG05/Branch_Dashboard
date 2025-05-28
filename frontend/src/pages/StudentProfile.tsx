import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, TrashIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { achievements } from "@/data/mockData";
import CategoryBadge from "@/components/ui/category-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditStudentForm } from "@/components/forms/EditStudentForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useStudent } from "@/hooks/useStudents";
import { embedDashboard } from "@superset-ui/embedded-sdk";

const StudentProfile = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch real student data using the USN
  const { data: student, isLoading, error } = useStudent(id || "");
  
  // Find student's achievements (still using mock data for now)
  const studentAchievements = achievements.filter(
    (a) => a.studentId === id
  );

  // Embed Superset dashboard for individual student
  React.useEffect(() => {
    if (student && id) {
      const timeout = setTimeout(() => {
        const dashboardElement = document.getElementById("student-dashboard");
        if (dashboardElement) {
          // Clear any existing content
          dashboardElement.innerHTML = '';
          
          embedDashboard({
            id: "972ed42d-d930-4d4a-a77b-88846204c5ac", // Individual student dashboard ID
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
                    id: "972ed42d-d930-4d4a-a77b-88846204c5ac"
                  }],
                  rls: [
                    {
                      clause: `usn = '${student.usn}'`,
                      dataset: 1 // Replace with your actual dataset ID
                    }
                  ]
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
    }
  }, [student, id]);

  // Handle delete student
  const handleDelete = () => {
    toast({
      title: "Student deleted",
      description: `${student?.name} has been deleted from the system.`,
    });
    navigate("/students");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
        <p className="text-gray-500 mb-6">The student you are looking for does not exist.</p>
        <Button onClick={() => navigate("/students")}>
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Student Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>{student.usn}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Edit Student</DialogTitle>
                    </DialogHeader>
                    <EditStudentForm 
                      student={student} 
                      onSuccess={() => setIsEditDialogOpen(false)}
                      onCancel={() => setIsEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <TrashIcon className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-600 text-2xl font-medium">
                {student.name.split(' ').map(name => name[0]).join('')}
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">USN</p>
                  <p>{student.usn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Branch</p>
                  <p>{student.branch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Batch</p>
                  <p>{student.batch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p>{student.gender}</p>
                </div>
                {student.doa && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Admission Date</p>
                    <p>{new Date(student.doa).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Seat Type</p>
                  <p>{student.seat_type}</p>
                </div>
                {student.ranking && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ranking</p>
                    <p>{student.ranking}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p>{student.state}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements and Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Achievements</CardTitle>
            <CardDescription>
              All academic and extracurricular achievements of {student.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="grid grid-cols-5 w-full max-w-[600px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="internship">Internship</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="extracurricular">Extracurricular</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <AchievementsList achievements={studentAchievements} />
              </TabsContent>
              <TabsContent value="academic">
                <AchievementsList 
                  achievements={studentAchievements.filter(a => a.category === "academic")} 
                />
              </TabsContent>
              <TabsContent value="internship">
                <AchievementsList 
                  achievements={studentAchievements.filter(a => a.category === "internship")} 
                />
              </TabsContent>
              <TabsContent value="competition">
                <AchievementsList 
                  achievements={studentAchievements.filter(a => a.category === "competition")} 
                />
              </TabsContent>
              <TabsContent value="extracurricular">
                <AchievementsList 
                  achievements={studentAchievements.filter(a => a.category === "extracurricular")} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>
            Interactive dashboard showing {student.name}'s performance metrics and comparison with peers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            id="student-dashboard" 
            className="w-full bg-white"
            style={{ height: '800px', minHeight: '800px' }}
          >
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading student analytics dashboard...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for achievements list
interface AchievementsListProps {
  achievements: Array<{
    id: string;
    title: string;
    category: "academic" | "internship" | "competition" | "extracurricular";
    date: string;
  }>;
}

const AchievementsList = ({ achievements }: AchievementsListProps) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No achievements in this category.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((achievement) => (
            <TableRow key={achievement.id}>
              <TableCell className="font-medium">{achievement.title}</TableCell>
              <TableCell>
                <CategoryBadge category={achievement.category} />
              </TableCell>
              <TableCell>{new Date(achievement.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentProfile;
