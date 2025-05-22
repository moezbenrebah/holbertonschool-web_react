// src/pages/Profile.tsx (Fixed)
import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/components/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { User, Settings, Mail, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Profile = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract tab from URL query params
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'security' ? 'security' : 'account';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Update URL when tab changes
  useEffect(() => {
    const newSearch = new URLSearchParams();
    if (activeTab === 'security') {
      newSearch.set('tab', 'security');
    }
    navigate({ search: newSearch.toString() }, { replace: true });
  }, [activeTab, navigate]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically call an API to update the user profile
    // For now, we'll just show a success message
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Here you would typically call an API to update the password
    // For now, we'll just show a success message
    toast.success("Password updated successfully!");
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  // If not logged in, show a message
  if (!isLoggedIn || !user) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              You need to be logged in to view your profile.
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => window.location.href = "/auth"}>
            Go to Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile sidebar */}
          <div className="md:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </p>
                  
                  <div className="w-full mt-6">
                    {/* Use Tabs component around TabsList */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="account">
                          <User className="h-4 w-4 mr-2" />
                          Account
                        </TabsTrigger>
                        <TabsTrigger value="security">
                          <Key className="h-4 w-4 mr-2" />
                          Security
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Add empty TabsContent elements to make the component hierarchy valid */}
                      <TabsContent value="account"></TabsContent>
                      <TabsContent value="security"></TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                  >
                    Log Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>View and update your account details</CardDescription>
                      </div>
                      <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={formData.name} 
                              onChange={handleChange} 
                              placeholder="Enter your name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={formData.email} 
                              onChange={handleChange} 
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">Account ID</p>
                          <p className="font-medium">{user.id}</p>
                        </div>
                        
                        <Alert className="mt-6 bg-green-50">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-600">Account in Good Standing</AlertTitle>
                          <AlertDescription>
                            Your account is active and all features are available.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                    <CardDescription>
                      Your recent activity in the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <div>
                          <p className="font-medium">Last login</p>
                          <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-b pb-3">
                        <div>
                          <p className="font-medium">Account created</p>
                          <p className="text-sm text-muted-foreground">May 15, 2023</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Sessions completed</p>
                          <p className="text-sm text-muted-foreground">12 meditation, 8 breathing</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>
                      Update your password and manage security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input 
                            id="currentPassword" 
                            name="currentPassword" 
                            type="password" 
                            value={formData.currentPassword} 
                            onChange={handleChange} 
                            placeholder="Enter your current password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input 
                            id="newPassword" 
                            name="newPassword" 
                            type="password" 
                            value={formData.newPassword} 
                            onChange={handleChange} 
                            placeholder="Enter new password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage your data privacy and notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Email notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications about your account
                          </p>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            className="form-checkbox h-5 w-5 text-primary rounded"
                            defaultChecked={true}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Activity tracking</p>
                          <p className="text-sm text-muted-foreground">
                            Track your meditation and breathing sessions
                          </p>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="activityTracking"
                            className="form-checkbox h-5 w-5 text-primary rounded"
                            defaultChecked={true}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Data analytics</p>
                          <p className="text-sm text-muted-foreground">
                            Allow us to use your data for app improvements
                          </p>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="dataAnalytics"
                            className="form-checkbox h-5 w-5 text-primary rounded"
                            defaultChecked={false}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline">Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;