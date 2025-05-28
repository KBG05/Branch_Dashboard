
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Admin Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Admin User</CardTitle>
                <CardDescription>System Administrator</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-primary text-2xl font-medium">
                AD
              </div>
              
              <div className="grid grid-cols-1 gap-y-3 gap-x-6 pt-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p>Admin User</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>admin@college.edu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p>System Administrator</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Quick overview of system statistics and recent activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">System Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Database</span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">API Server</span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Superset</span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Last student added: 2 hours ago</p>
                  <p className="text-gray-600">Last achievement logged: 1 day ago</p>
                  <p className="text-gray-600">Last report generated: 3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
