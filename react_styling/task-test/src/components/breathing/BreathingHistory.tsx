// src/components/breathing/BreathingHistory.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from '@/components/ui/sonner';
import { 
  Download, 
  Calendar, 
  Clock, 
  Award, 
  Trash2, 
  Play, 
  Wind
} from 'lucide-react';
import { 
  getRecentSessions, 
  getTotalCompletedSessions, 
  getCurrentStreak, 
  getTotalBreathingTime,
  getMostPracticedExercise,
  deleteBreathingSession,
  BreathingSession,
  forceSyncWithDatabase,  
  getLocalBreathingSessions,
  getAllSessionsFromDatabase 
} from '@/lib/breathing-storage';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface BreathingHistoryProps {
  onStartSession?: () => void;
}

const BreathingHistory: React.FC<BreathingHistoryProps> = ({ onStartSession }) => {
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [favoriteExercise, setFavoriteExercise] = useState<{ id: string; name: string; count: number } | null>(null);
  const [debugSessions, setDebugSessions] = useState<BreathingSession[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Inspect current user ID
    const userId = localStorage.getItem('mindflow_user_id');
    console.log('Current user ID:', userId);
    
    // Debug: Show all items in localStorage
    const allKeys = Object.keys(localStorage);
    console.log('All localStorage keys:', allKeys);
    
    // Look for any key containing "user"
    const userKeys = allKeys.filter(key => key.toLowerCase().includes('user'));
    userKeys.forEach(key => {
      console.log(`localStorage["${key}"] =`, localStorage.getItem(key));
    });
  }, []);

  const loadAllSessions = async () => {
    try {
      const allSessions = await getAllSessionsFromDatabase();
      setDebugSessions(allSessions);
      setShowDebug(true);
    } catch (error) {
      console.error('Error loading all sessions:', error);
    }
  };

  const ensureUserId = () => {
    let userId = localStorage.getItem('mindflow_user_id');
    if (!userId) {
      userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
      localStorage.setItem('mindflow_user_id', userId);
      console.log('Created new user ID:', userId);
    } else {
      console.log('Using existing user ID:', userId);
    }
    return userId;
  };

  // Then call this function 
  ensureUserId();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Function to count displayed sessions
  const getTotalDisplayedSessions = () => {
    return sessions.length;
  };
  
  // Function to fetch all data with additional logging
  const fetchData = async () => {
    setIsLoading(true);
    
    // Debug user ID
    const userId = localStorage.getItem('mindflow_user_id');
    console.log('BreathingHistory: Using user ID:', userId);
    
    try {
      console.log('BreathingHistory: Fetching sessions...');
      
      // Get sessions with explicit logging
      const fetchedSessions = await getRecentSessions();
      console.log('BreathingHistory: Received sessions:', fetchedSessions);
      setSessions(fetchedSessions);
      setTotalSessions(fetchedSessions.length);
      
      // Get streak
      const streak = await getCurrentStreak();
      console.log('BreathingHistory: Current streak:', streak);
      setStreakDays(streak);
      
      // Get total minutes
      const minutes = await getTotalBreathingTime();
      console.log('BreathingHistory: Total minutes:', minutes);
      setTotalMinutes(minutes);
      
      // Get favorite exercise
      const favorite = await getMostPracticedExercise();
      console.log('BreathingHistory: Favorite exercise:', favorite);
      setFavoriteExercise(favorite);
    } catch (error) {
      console.error('Error fetching breathing data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete session
  const handleDelete = (id: string) => {
    setSessionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Function to execute the deletion
  const executeDelete = async () => {
    if (!sessionToDelete) return;
    
    try {
      await deleteBreathingSession(sessionToDelete);
      
      // Update local state to reflect the deletion
      setSessions(prev => prev.filter(session => session.id !== sessionToDelete));
      
      // Refresh all stats
      await fetchData();
      
      // Show success message
      toast?.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast?.error('Failed to delete session. Please try again.');
    } finally {
      setSessionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Calculate data for weekly chart
  const getWeeklyChartData = () => {
    // Get last 7 days
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayStr = format(date, 'EEE');
      
      // Count sessions for this day
      const sessionsForDay = sessions.filter(session => {
        const sessionDate = format(new Date(session.date), 'yyyy-MM-dd');
        return sessionDate === dateStr && session.completed;
      });
      
      // Calculate total minutes for this day
      const totalMinutes = sessionsForDay.reduce((total, session) => 
        total + Math.round(session.duration / 60), 0);
      
      result.push({
        day: dayStr,
        count: sessionsForDay.length,
        minutes: totalMinutes
      });
    }
    
    return result;
  };
  
  // Export session data as CSV
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Time', 'Exercise', 'Duration (minutes)', 'Completed'];
      const rows = sessions.map(session => [
        format(new Date(session.date), 'yyyy-MM-dd'),
        format(new Date(session.timestamp), 'HH:mm:ss'),
        session.exerciseName,
        Math.round(session.duration / 60),
        session.completed ? 'Yes' : 'No'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `mindflow_breathing_sessions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    }
  };
  
  // Check if we have any sessions
  const hasNoSessions = sessions.length === 0;
  
  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{getTotalDisplayedSessions()}</div>
              <div className="text-sm text-muted-foreground ml-2">sessions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{streakDays}</div>
              <div className="text-sm text-muted-foreground ml-2">days</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{totalMinutes}</div>
              <div className="text-sm text-muted-foreground ml-2">minutes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold line-clamp-1">
              {favoriteExercise?.name || 'None yet'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your breathing exercise history</CardDescription>
          </div>
          
          {!hasNoSessions && (
            <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {hasNoSessions ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wind className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Complete your first breathing exercise session to start building your history.
                We'll track your progress and show trends over time.
              </p>
              {onStartSession && (
                <Button onClick={onStartSession}>
                  Start Your First Session
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const sessionDate = new Date(session.date);
                const isToday = format(sessionDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const displayDate = isToday
                  ? `Today at ${format(new Date(session.timestamp), 'h:mm a')}`
                  : format(sessionDate, 'MMMM d, yyyy - h:mm a');
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        session.completed 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {session.completed ? <Clock className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{session.exerciseName}</h4>
                        <p className="text-sm text-muted-foreground">{displayDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="inline-flex items-center bg-primary/10 px-2 py-1 rounded-full text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.round(session.duration / 60)} min
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(session.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tips for consistency */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Tips for Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Same Time Daily</h3>
              <p className="text-sm text-muted-foreground">
                Choose a specific time each day for your breathing practice to build a sustainable habit.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Start Small</h3>
              <p className="text-sm text-muted-foreground">
                Begin with just 3-5 minutes daily and gradually increase your session duration.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Link to Existing Habits</h3>
              <p className="text-sm text-muted-foreground">
                Pair breathing exercises with something you already do daily, like brushing your teeth.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Alert Dialog for deletion confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white text-gray-800 border border-gray-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Breathing Session</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this breathing session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Debug panel - helpful for troubleshooting */}
      <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg">
        <h3 className="text-sm text-gray-500 mb-2">Debug Panel</h3>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={async () => {
              const success = await forceSyncWithDatabase();
              if (success) {
                alert('Sync successful! Refreshing...');
                await fetchData();
              } else {
                alert('Sync failed. Check console for details.');
              }
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
          >
            Force Sync with Database
          </button>
          <button
            onClick={() => {
              localStorage.setItem('mindflow_user_id', 'user_maqbttrwfz8');
              alert('User ID set to match database. Refreshing...');
              fetchData();
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
          >
            Set User ID to Database Match
          </button>
          <button
            onClick={loadAllSessions}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
          >
            Load All Database Sessions
          </button>
        </div>
        
        {/* Show database sessions when debug is active */}
        {showDebug && debugSessions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">All Sessions in Database ({debugSessions.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {debugSessions.map((session, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded text-xs font-mono">
                  <div>ID: {session.id}</div>
                  <div>User ID: {session.userId}</div>
                  <div>Exercise: {session.exerciseName}</div>
                  <div>Date: {session.date}</div>
                  <div>Duration: {session.duration} seconds</div>
                  <div>Completed: {session.completed ? 'Yes' : 'No'}</div>
                  <button
                    onClick={() => {
                      localStorage.setItem('mindflow_user_id', session.userId || '');
                      alert(`User ID set to ${session.userId}. Refreshing...`);
                      fetchData();
                    }}
                    className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Use This User ID
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingHistory;