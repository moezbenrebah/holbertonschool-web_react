// src/components/meditation/MeditationHistory.tsx (Updated)
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Play, BookOpen as Lotus, Clock, Award, Heart, Trash2, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  getMeditationSessions, 
  saveCompletedSession, 
  deleteMeditationSession, 
  getTotalSessions,
  getTotalMeditationTime,
  getMostPracticedMeditation,
  forceSyncWithDatabase,
  getLocalMeditationSessions,
  MeditationSession
} from '@/lib/meditation-storage';
import { getUserId } from '@/lib/api-client';

interface MeditationHistoryProps {
  onStartSession?: () => void;
}

const MeditationHistory: React.FC<MeditationHistoryProps> = ({ onStartSession }) => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    favorite: null as { id: string; title: string; count: number } | null
  });

  // Debug user ID when component mounts
  useEffect(() => {
    const userId = getUserId();
    console.log('MeditationHistory component using user ID:', userId);
  }, []);

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Function to fetch sessions
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      // Get sessions from API
      const fetchedSessions = await getMeditationSessions();
      console.log('Fetched meditation sessions:', fetchedSessions);
      setSessions(fetchedSessions);
      
      // Get stats
      const totalSessions = await getTotalSessions();
      const totalMinutes = await getTotalMeditationTime();
      const favorite = await getMostPracticedMeditation();
      
      setStats({
        totalSessions,
        totalMinutes,
        favorite
      });
    } catch (error) {
      console.error('Error fetching meditation sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a test session
  const addTestSession = async () => {
    try {
      // Create a test technique
      const testTechnique = {
        id: 'test-meditation',
        title: 'Test Meditation',
        category: 'Focus',
        backgroundImage: '/images/meditation/mindfulness.jpg'
      };
      
      // Save a 10-minute session
      await saveCompletedSession(testTechnique, 10 * 60);
      
      // Refresh the sessions
      setTimeout(fetchSessions, 300);
      
      toast.success('Test session added successfully');
    } catch (error) {
      console.error('Error adding test session:', error);
      toast.error('Failed to add test session');
    }
  };

  // Function to handle deletion confirmation
  const confirmDelete = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsDeleteDialogOpen(true);
  };

  // Function to execute session deletion
  const executeDelete = async () => {
    if (!sessionToDelete) return;
    
    try {
      await deleteMeditationSession(sessionToDelete);
      
      // Update the local state to reflect the deletion
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionToDelete));
      
      // Refresh stats
      const totalSessions = await getTotalSessions();
      const totalMinutes = await getTotalMeditationTime();
      const favorite = await getMostPracticedMeditation();
      
      setStats({
        totalSessions,
        totalMinutes,
        favorite
      });
      
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    } finally {
      setSessionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle export data as CSV
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Time', 'Meditation', 'Duration (minutes)', 'Category'];
      const rows = sessions.map(session => [
        new Date(session.completedAt).toLocaleDateString(),
        new Date(session.completedAt).toLocaleTimeString(),
        session.technique?.title || 'Meditation',
        Math.round(session.duration / 60),
        session.technique?.category || 'Unknown'
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
      link.setAttribute('download', `mindflow_meditation_sessions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
    
  // Check if we have sessions
  const hasSessions = sessions.length > 0;

  // Empty state when no sessions
  if (!hasSessions) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <Lotus className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No meditation sessions yet</h3>
          <p className="text-gray-500 max-w-md mb-8">
            Track your progress and build a consistent meditation practice. 
            All your completed sessions will appear here.
          </p>
          
          <div className="flex gap-2">
            {onStartSession && (
              <Button 
                onClick={onStartSession}
                className="bg-purple-600 hover:bg-purple-700 gap-2"
              >
                <Play className="h-4 w-4" />
                Start Your First Meditation
              </Button>
            )}
            
            {process.env.NODE_ENV === 'development' && (
              <Button 
                onClick={addTestSession}
                variant="outline"
              >
                Add Test Session
              </Button>
            )}
          </div>
        </div>
        
        {/* Debug panel for empty state */}
        <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-2">Debug Panel</h3>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                const success = await forceSyncWithDatabase();
                if (success) {
                  toast.success('Sync successful! Refreshing...');
                  fetchSessions();
                } else {
                  toast.error('Sync failed. Check console for details.');
                }
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
            >
              Force Sync with Database
            </button>
            <button
              onClick={() => {
                console.log('Current user ID:', getUserId());
                console.log('Local sessions:', getLocalMeditationSessions());
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
            >
              Log Debug Info
            </button>
            <button
              onClick={addTestSession}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
            >
              Add Test Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Content when sessions exist
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{stats.totalSessions}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{stats.totalMinutes}</div>
              <div className="text-sm text-muted-foreground ml-2">minutes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Meditation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold line-clamp-1">
              {stats.favorite?.title || 'None yet'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Your meditation history
              </CardDescription>
            </div>
            
            <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session, index) => {
            // Format date
            const sessionDate = new Date(session.completedAt || Date.now());
            const displayDate = sessionDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
            
            // Calculate duration in minutes
            const durationMinutes = Math.floor((session.duration || 0) / 60);
            
            return (
              <div key={session.id || index} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <h4 className="font-medium">{session.technique?.title || 'Meditation'}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{displayDate}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => confirmDelete(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{durationMinutes} minutes</span>
                </div>
                {session.technique?.category && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {session.technique.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Simple insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-500" />
            Meditation Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            You've completed {stats.totalSessions} meditation sessions for a total of {stats.totalMinutes} minutes. 
            Regular meditation practice can help reduce stress and improve focus and mindfulness.
          </p>
          <div className="mt-4">
            <Button 
              onClick={onStartSession}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Another Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meditation Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this meditation session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSessionToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Debug panel */}
      <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg">
        <h3 className="text-sm text-gray-500 mb-2">Debug Panel</h3>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              const success = await forceSyncWithDatabase();
              if (success) {
                toast.success('Sync successful! Refreshing...');
                fetchSessions();
              } else {
                toast.error('Sync failed. Check console for details.');
              }
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
          >
            Force Sync with Database
          </button>
          <button
            onClick={() => {
              console.log('Current user ID:', getUserId());
              console.log('Local sessions:', getLocalMeditationSessions());
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
          >
            Log Debug Info
          </button>
          <button
            onClick={addTestSession}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
          >
            Add Test Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationHistory;