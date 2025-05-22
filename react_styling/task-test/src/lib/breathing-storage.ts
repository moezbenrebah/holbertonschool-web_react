// src/lib/breathing-storage.ts
import { format } from 'date-fns';
import axios from 'axios';
import api, { getUserId } from './api-client'; // Import getUserId from api-client

// API URL - adjust this based on your backend setup
const API_URL = 'http://localhost:5000/api/breathing';
console.log('Using Breathing API URL:', API_URL);

// Storage key for local fallback
const STORAGE_KEY = 'mindflow_breathing_sessions';

export interface BreathingSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  timestamp: string;
  duration: number; // in seconds
  completed: boolean;
  userId?: string; // Added for server-side storage
  _id?: string; // MongoDB ID
}

// Convert MongoDB document to our frontend model
function convertFromDb(dbSession: any): BreathingSession {
  // Log the raw session for debugging
  console.log('Converting DB session:', dbSession);
  
  return {
    id: dbSession._id || dbSession.id || '',
    exerciseId: dbSession.exerciseId || '',
    exerciseName: dbSession.exerciseName || '',
    date: dbSession.date || new Date().toISOString().split('T')[0],
    timestamp: dbSession.timestamp || new Date().toISOString(),
    duration: dbSession.duration || 0,
    completed: dbSession.completed || false
  };
}

export async function getAllSessionsFromDatabase(): Promise<BreathingSession[]> {
  try {
    console.log('Getting all sessions from database');
    const response = await axios.get(`${API_URL}/all`);
    
    console.log(`Found ${response.data.length} total sessions in database`);
    if (response.data.length > 0) {
      console.log('First session:', response.data[0]);
    }
    
    return response.data.map(convertFromDb);
  } catch (error) {
    console.error('Error getting all sessions:', error);
    return [];
  }
}

// Force-sync with the database
export async function forceSyncWithDatabase(): Promise<boolean> {
  try {
    const userId = getUserId(); // Use the consistent getUserId function
    console.log('Forcing sync with database using userId:', userId);
    
    // Get sessions from API
    const response = await axios.get(`${API_URL}?userId=${userId}`, {
      headers: { 'x-user-id': userId }
    });
    
    console.log(`Force sync found ${response.data.length} sessions`);
    
    // Convert and save to localStorage
    const apiSessions = Array.isArray(response.data) ? response.data.map(convertFromDb) : [];
    saveSessionsToLocalStorage(apiSessions);
    
    return apiSessions.length > 0;
  } catch (error) {
    console.error('Error during force sync:', error);
    return false;
  }
}

// Get all breathing sessions - combined approach
export async function getBreathingSessions(): Promise<BreathingSession[]> {
  try {
    const userId = getUserId(); // Use the consistent getUserId function
    console.log('Getting breathing sessions for user:', userId);
    
    // Try to get from API
    console.log(`Making API request to: ${API_URL}?userId=${userId}`);
    const response = await axios.get(`${API_URL}?userId=${userId}`, {
      headers: { 'x-user-id': userId }
    });
    
    console.log(`API response status: ${response.status}`);
    console.log(`API response data (length): ${response.data.length}`);
    if (response.data.length > 0) {
      console.log('First session from API:', response.data[0]);
    }
    
    // Convert API data
    const apiSessions = Array.isArray(response.data) ? response.data.map(convertFromDb) : [];
    console.log(`Converted ${apiSessions.length} sessions from API`);
    
    // Save to localStorage for offline use
    saveSessionsToLocalStorage(apiSessions);
    
    return apiSessions;
  } catch (error) {
    console.error('Error retrieving breathing sessions from API:', error);
    console.log('Falling back to localStorage');
    
    // Get from localStorage
    return getLocalBreathingSessions();
  }
}

// Save sessions to localStorage
function saveSessionsToLocalStorage(sessions: BreathingSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    console.log(`Saved ${sessions.length} sessions to localStorage`);
  } catch (error) {
    console.error('Error saving sessions to localStorage:', error);
  }
}

// Get sessions from localStorage
export function getLocalBreathingSessions(): BreathingSession[] {
  try {
    const storedSessions = localStorage.getItem(STORAGE_KEY);
    if (!storedSessions) return [];
    return JSON.parse(storedSessions);
  } catch (error) {
    console.error('Error retrieving breathing sessions from localStorage:', error);
    return [];
  }
}

// Add a new breathing session
export async function addBreathingSession(session: Omit<BreathingSession, 'id'>): Promise<BreathingSession> {
  try {
    const userId = getUserId(); // Use the consistent getUserId function
    console.log('Adding breathing session for user:', userId);
    
    const clientId = generateId();
    const sessionWithUser = { 
      ...session, 
      userId,
      clientId 
    };
    
    console.log('Sending session data to API');
    const response = await axios.post(API_URL, sessionWithUser);
    console.log('Session saved to API:', response.data);
    
    const newSession = convertFromDb(response.data);
    
    // Update local storage with the new session
    const localSessions = getLocalBreathingSessions();
    localSessions.push(newSession);
    saveSessionsToLocalStorage(localSessions);
    
    return newSession;
  } catch (error) {
    console.error('Error saving breathing session to API:', error);
    console.log('Falling back to localStorage');
    
    // Add to localStorage only
    return addLocalBreathingSession(session);
  }
}

// Add to localStorage as fallback
function addLocalBreathingSession(session: Omit<BreathingSession, 'id'>): BreathingSession {
  try {
    const sessions = getLocalBreathingSessions();
    
    // Generate a unique ID
    const newSession = {
      ...session,
      id: generateId(),
      userId: getUserId() // Use the consistent getUserId function
    };
    
    sessions.push(newSession);
    saveSessionsToLocalStorage(sessions);
    
    console.log('Added session to localStorage with ID:', newSession.id);
    return newSession;
  } catch (error) {
    console.error('Error saving breathing session to localStorage:', error);
    throw new Error('Failed to save breathing session');
  }
}

// Update an existing breathing session
export async function updateBreathingSession(updatedSession: BreathingSession): Promise<BreathingSession> {
  try {
    console.log('Updating breathing session with ID:', updatedSession.id);
    
    // Create a copy without the client id field
    const { id, ...sessionData } = updatedSession;
    
    // Send the update
    const response = await axios.put(`${API_URL}/${id}`, {
      ...sessionData,
      userId: getUserId() // Use the consistent getUserId function
    });
    
    console.log('Session updated in API:', response.data);
    const updated = convertFromDb(response.data);
    
    // Update in localStorage too
    const localSessions = getLocalBreathingSessions();
    const index = localSessions.findIndex(session => session.id === updatedSession.id);
    
    if (index !== -1) {
      localSessions[index] = updated;
      saveSessionsToLocalStorage(localSessions);
    }
    
    return updated;
  } catch (error) {
    console.error('Error updating breathing session in API:', error);
    console.log('Falling back to localStorage');
    
    // Update in localStorage only
    return updateLocalBreathingSession(updatedSession);
  }
}

// Update in localStorage as fallback
function updateLocalBreathingSession(updatedSession: BreathingSession): BreathingSession {
  try {
    const sessions = getLocalBreathingSessions();
    const index = sessions.findIndex(session => session.id === updatedSession.id);
    
    if (index === -1) {
      throw new Error('Session not found');
    }
    
    sessions[index] = updatedSession;
    saveSessionsToLocalStorage(sessions);
    
    console.log('Updated session in localStorage with ID:', updatedSession.id);
    return updatedSession;
  } catch (error) {
    console.error('Error updating breathing session in localStorage:', error);
    throw new Error('Failed to update breathing session');
  }
}

// Delete a breathing session
export async function deleteBreathingSession(id: string): Promise<void> {
  try {
    console.log('Deleting breathing session with ID:', id);
    
    // Make sure we have the correct headers
    const userId = getUserId(); // Use the consistent getUserId function
    const headers = { 'x-user-id': userId };
    
    // Call the API to delete the session
    await axios.delete(`${API_URL}/${id}`, { headers });
    console.log('Session successfully deleted from database');
    
    // Also remove from local storage for offline consistency
    const sessions = getLocalBreathingSessions();
    const updatedSessions = sessions.filter(session => session.id !== id);
    saveSessionsToLocalStorage(updatedSessions);
    
  } catch (error) {
    console.error('Error deleting breathing session:', error);
    
    // Even if the API call fails, remove from localStorage
    try {
      const sessions = getLocalBreathingSessions();
      const updatedSessions = sessions.filter(session => session.id !== id);
      saveSessionsToLocalStorage(updatedSessions);
      console.log('Session removed from local storage despite API error');
    } catch (localError) {
      console.error('Error removing session from localStorage:', localError);
    }
    
    throw new Error('Failed to delete breathing session');
  }
}

// Get sessions for a specific date range
export async function getSessionsByDateRange(startDate: Date, endDate: Date): Promise<BreathingSession[]> {
  try {
    // Get all sessions
    const sessions = await getBreathingSessions();
    
    // Filter by date range
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  } catch (error) {
    console.error('Error filtering breathing sessions by date range:', error);
    return [];
  }
}

// Generate a unique ID for sessions (fallback)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Get recent sessions (last 7 days)
export async function getRecentSessions(limit: number = 10): Promise<BreathingSession[]> {
  try {
    console.log(`Getting recent ${limit} sessions`);
    const sessions = await getBreathingSessions();
    console.log(`Total sessions available: ${sessions.length}`);
    
    // Sort by date & time (newest first)
    const sortedSessions = [...sessions].sort((a, b) => {
      // First sort by date
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      
      // If same date, sort by timestamp
      if (dateComparison === 0) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      return dateComparison;
    });
    
    const limitedSessions = sortedSessions.slice(0, limit);
    console.log(`Returning ${limitedSessions.length} recent sessions`);
    return limitedSessions;
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    return [];
  }
}

// Get total completed sessions
export async function getTotalCompletedSessions(): Promise<number> {
  try {
    const sessions = await getBreathingSessions();
    const completed = sessions.filter(session => session.completed).length;
    console.log(`Total completed sessions: ${completed} out of ${sessions.length}`);
    return completed;
  } catch (error) {
    console.error('Error getting total completed sessions:', error);
    
    // Fallback to localStorage
    try {
      const localSessions = getLocalBreathingSessions();
      const localCompleted = localSessions.filter(session => session.completed).length;
      console.log(`Fallback: ${localCompleted} completed sessions from localStorage`);
      return localCompleted;
    } catch (localError) {
      console.error('Error with localStorage fallback:', localError);
      return 0;
    }
  }
}

// Get current streak (consecutive days with completed sessions)
export async function getCurrentStreak(): Promise<number> {
  try {
    const sessions = await getBreathingSessions();
    
    if (sessions.length === 0) {
      console.log('No sessions available, streak is 0');
      return 0;
    }
    
    // Get completed sessions
    const completedSessions = sessions.filter(session => session.completed);
    
    if (completedSessions.length === 0) {
      console.log('No completed sessions, streak is 0');
      return 0;
    }
    
    // Sort by date (newest first)
    const sortedSessions = [...completedSessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Format dates as YYYY-MM-DD for comparison
    const formatDateString = (dateStr: string) => {
      const date = new Date(dateStr);
      return format(date, 'yyyy-MM-dd');
    };
    
    // Get today's date as YYYY-MM-DD
    const today = formatDateString(new Date().toISOString());
    
    // Check if there's a session for today
    const hasSessionToday = sortedSessions.some(session => formatDateString(session.date) === today);
    
    if (!hasSessionToday) {
      console.log('No session for today, streak is 0');
      return 0;
    }
    
    let streak = 1;
    let currentDate = new Date();
    
    // Loop through previous days
    for (let i = 1; i <= 365; i++) {
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = formatDateString(currentDate.toISOString());
      
      // Check if there's a session for this day
      const hasSession = sortedSessions.some(session => formatDateString(session.date) === dateStr);
      
      if (hasSession) {
        streak++;
      } else {
        break;
      }
    }
    
    console.log(`Current streak: ${streak} days`);
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

// Get total time spent on breathing exercises (in minutes)
export async function getTotalBreathingTime(): Promise<number> {
  try {
    const sessions = await getBreathingSessions();
    const completedSessions = sessions.filter(session => session.completed);
    
    if (completedSessions.length === 0) {
      console.log('No completed sessions, total time is 0');
      return 0;
    }
    
    const totalSeconds = completedSessions.reduce((total, session) => total + session.duration, 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    
    console.log(`Total breathing time: ${totalMinutes} minutes`);
    return totalMinutes;
  } catch (error) {
    console.error('Error calculating total breathing time:', error);
    return 0;
  }
}

// Get most practiced exercise
export async function getMostPracticedExercise(): Promise<{ id: string; name: string; count: number } | null> {
  try {
    const sessions = await getBreathingSessions();
    const completedSessions = sessions.filter(session => session.completed);
    
    if (completedSessions.length === 0) {
      console.log('No completed sessions, no favorite exercise');
      return null;
    }
    
    // Count occurrences of each exercise
    const exerciseCounts: Record<string, { id: string; name: string; count: number }> = {};
    
    completedSessions.forEach(session => {
      if (!exerciseCounts[session.exerciseId]) {
        exerciseCounts[session.exerciseId] = {
          id: session.exerciseId,
          name: session.exerciseName,
          count: 0
        };
      }
      
      exerciseCounts[session.exerciseId].count += 1;
    });
    
    // Find the exercise with the highest count
    const favorite = Object.values(exerciseCounts).sort((a, b) => b.count - a.count)[0] || null;
    
    if (favorite) {
      console.log(`Most practiced exercise: ${favorite.name} (${favorite.count} times)`);
    } else {
      console.log('No favorite exercise found');
    }
    
    return favorite;
  } catch (error) {
    console.error('Error calculating most practiced exercise:', error);
    return null;
  }
}