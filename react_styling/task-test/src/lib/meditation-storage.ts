// src/lib/meditation-storage.ts (Updated)
import { format } from 'date-fns';
import axios from 'axios';
import { getUserId } from './api-client'; // Import getUserId directly from api-client

// API URL - adjust based on your backend setup
const API_URL = 'http://localhost:5000/api/meditation';
console.log('Using Meditation API URL:', API_URL);

// Define types for meditation data
export interface MeditationSession {
  id: string;
  technique: {
    id: string;
    title: string;
    category?: string;
    image?: string;
  };
  startedAt?: string;
  completedAt: string;
  duration: number; // in seconds
  completed: boolean;
  userId?: string; // Added for MongoDB
  _id?: string; // MongoDB ID
}

// Storage key for local storage fallback
const STORAGE_KEY = 'mindflow_meditation_sessions';

// Save sessions to localStorage for offline use
function saveSessionsToLocalStorage(sessions: MeditationSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    console.log(`Saved ${sessions.length} meditation sessions to localStorage`);
  } catch (error) {
    console.error('Error saving meditation sessions to localStorage:', error);
  }
}

// Convert MongoDB document to our frontend model
function convertFromDb(dbSession: any): MeditationSession {
  // Add debug logging for troubleshooting
  console.log('Converting meditation session from DB:', dbSession);
  
  return {
    id: dbSession._id || dbSession.id || '',
    technique: {
      id: dbSession.technique?.id || 'unknown',
      title: dbSession.technique?.title || 'Meditation',
      category: dbSession.technique?.category,
      image: dbSession.technique?.image
    },
    startedAt: dbSession.startedAt,
    completedAt: dbSession.completedAt,
    duration: dbSession.duration || 0,
    completed: dbSession.completed !== undefined ? dbSession.completed : true
  };
}

// Get all meditation sessions from API with localStorage fallback
export async function getMeditationSessions(): Promise<MeditationSession[]> {
  try {
    const userId = getUserId(); // Use the getUserId from api-client
    console.log('Getting meditation sessions for user:', userId);
    
    // Try to get from API
    const response = await axios.get(`${API_URL}?userId=${userId}`, {
      headers: { 'x-user-id': userId }
    });
    
    console.log(`Received ${response.data.length} meditation sessions from API`);
    
    // Convert API data
    const apiSessions = Array.isArray(response.data) ? response.data.map(convertFromDb) : [];
    
    // Save to localStorage for offline use
    saveSessionsToLocalStorage(apiSessions);
    
    return apiSessions;
  } catch (error) {
    console.error('Error retrieving meditation sessions from API:', error);
    console.log('Falling back to localStorage');
    
    // Get from localStorage
    return getLocalMeditationSessions();
  }
}

// Get sessions from localStorage (fallback)
export function getLocalMeditationSessions(): MeditationSession[] {
  try {
    const storedSessions = localStorage.getItem(STORAGE_KEY);
    if (!storedSessions) return [];
    return JSON.parse(storedSessions);
  } catch (error) {
    console.error('Error retrieving meditation sessions from localStorage:', error);
    return [];
  }
}

// Add a new meditation session
export async function addMeditationSession(session: Omit<MeditationSession, 'id'>): Promise<MeditationSession> {
  try {
    const userId = getUserId(); // Use the getUserId from api-client
    console.log('Adding meditation session for user:', userId);
    
    const sessionWithUser = { 
      ...session, 
      userId,
      clientId: generateId() // Add a client-side ID for reference
    };
    
    console.log('Sending meditation session data to API:', sessionWithUser);
    const response = await axios.post(API_URL, sessionWithUser);
    console.log('Meditation session saved to API:', response.data);
    
    const newSession = convertFromDb(response.data);
    
    // Update local storage with the new session
    const localSessions = getLocalMeditationSessions();
    localSessions.unshift(newSession);
    saveSessionsToLocalStorage(localSessions);
    
    return newSession;
  } catch (error) {
    console.error('Error saving meditation session to API:', error);
    console.log('Falling back to localStorage');
    
    // Add to localStorage only
    return addLocalMeditationSession(session);
  }
}

// Add to localStorage as fallback
function addLocalMeditationSession(session: Omit<MeditationSession, 'id'>): MeditationSession {
  try {
    const sessions = getLocalMeditationSessions();
    
    // Generate a unique ID
    const newSession = {
      ...session,
      id: generateId(),
      userId: getUserId() // Use the getUserId from api-client
    };
    
    // Add to beginning of array (most recent first)
    sessions.unshift(newSession);
    saveSessionsToLocalStorage(sessions);
    return newSession;
  } catch (error) {
    console.error('Error saving meditation session to localStorage:', error);
    throw new Error('Failed to save meditation session');
  }
}

// Delete a meditation session
export async function deleteMeditationSession(id: string): Promise<void> {
  try {
    console.log('Deleting meditation session with ID:', id);
    
    // Make sure we have the correct headers
    const userId = getUserId(); // Use the getUserId from api-client
    const headers = { 'x-user-id': userId };
    
    // Call the API to delete the session
    await axios.delete(`${API_URL}/${id}`, { headers });
    console.log('Meditation session successfully deleted from database');
    
    // Also remove from local storage for offline consistency
    const sessions = getLocalMeditationSessions();
    const updatedSessions = sessions.filter(session => session.id !== id);
    saveSessionsToLocalStorage(updatedSessions);
    
  } catch (error) {
    console.error('Error deleting meditation session:', error);
    
    // Even if the API call fails, remove from localStorage
    try {
      const sessions = getLocalMeditationSessions();
      const updatedSessions = sessions.filter(session => session.id !== id);
      saveSessionsToLocalStorage(updatedSessions);
      console.log('Session removed from local storage despite API error');
    } catch (localError) {
      console.error('Error removing session from localStorage:', localError);
    }
    
    throw new Error('Failed to delete meditation session');
  }
}

// Function to save a completed meditation session
export async function saveCompletedSession(technique: any, durationInSeconds: number): Promise<void> {
  try {
    console.log('Saving completed meditation session:', technique.title, 'Duration:', durationInSeconds);
    const now = new Date();
    
    // Create a simplified version of the technique data
    const simplifiedTechnique = {
      id: technique.id || 'unknown',
      title: technique.title || 'Meditation',
      category: technique.category || 'Focus',
      image: technique.backgroundImage || technique.coverImage || '/images/meditation/default.jpg'
    };
    
    // Create the session object
    const session: Omit<MeditationSession, 'id'> = {
      technique: simplifiedTechnique,
      startedAt: new Date(now.getTime() - durationInSeconds * 1000).toISOString(),
      completedAt: now.toISOString(),
      duration: durationInSeconds,
      completed: true
    };
    
    // Add the session to API storage
    await addMeditationSession(session);
    console.log('Meditation session saved successfully');
  } catch (error) {
    console.error('Error saving completed meditation session:', error);
    
    // Try to save to localStorage as fallback
    try {
      const now = new Date();
      const simplifiedTechnique = {
        id: technique.id || 'unknown',
        title: technique.title || 'Meditation',
        category: technique.category || 'Focus',
        image: technique.backgroundImage || technique.coverImage || '/images/meditation/default.jpg'
      };
      
      const session: Omit<MeditationSession, 'id'> = {
        technique: simplifiedTechnique,
        startedAt: new Date(now.getTime() - durationInSeconds * 1000).toISOString(),
        completedAt: now.toISOString(),
        duration: durationInSeconds,
        completed: true
      };
      
      addLocalMeditationSession(session);
      console.log('Meditation session saved to localStorage as fallback');
    } catch (fallbackError) {
      console.error('Failed to save to localStorage too:', fallbackError);
    }
  }
}

// Get recent sessions
export async function getRecentSessions(limit: number = 10): Promise<MeditationSession[]> {
  try {
    console.log(`Getting recent ${limit} meditation sessions`);
    const sessions = await getMeditationSessions();
    console.log(`Total meditation sessions available: ${sessions.length}`);
    
    // Return limited number of sessions (already sorted in getMeditationSessions)
    return sessions.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent meditation sessions:', error);
    return [];
  }
}

// Get total sessions count
export async function getTotalSessions(): Promise<number> {
  try {
    const sessions = await getMeditationSessions();
    return sessions.length;
  } catch (error) {
    console.error('Error getting total meditation sessions count:', error);
    return 0;
  }
}

// Get total meditation time in minutes
export async function getTotalMeditationTime(): Promise<number> {
  try {
    const sessions = await getMeditationSessions();
    
    if (sessions.length === 0) return 0;
    
    const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
    return Math.round(totalSeconds / 60); // Convert to minutes
  } catch (error) {
    console.error('Error calculating total meditation time:', error);
    return 0;
  }
}

// Get meditation streak (consecutive days)
export async function getMeditationStreak(): Promise<number> {
  try {
    const sessions = await getMeditationSessions();
    
    if (sessions.length === 0) return 0;
    
    // Format dates as YYYY-MM-DD for comparison
    const formatDateString = (dateStr: string) => {
      const date = new Date(dateStr);
      return format(date, 'yyyy-MM-dd');
    };
    
    // Group sessions by date
    const sessionsByDate: Record<string, boolean> = {};
    sessions.forEach(session => {
      const dateStr = formatDateString(session.completedAt);
      sessionsByDate[dateStr] = true;
    });
    
    // Get all dates with sessions
    const dates = Object.keys(sessionsByDate).sort().reverse();
    
    if (dates.length === 0) return 0;
    
    // Get today's date as YYYY-MM-DD
    const today = formatDateString(new Date().toISOString());
    
    // Check if there's a session for today
    if (dates[0] !== today) return 0;
    
    let streak = 1;
    
    // Check consecutive days
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1]);
      const currDate = new Date(dates[i]);
      
      // Set hours to 0 to compare just the dates
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const diffTime = prevDate.getTime() - currDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating meditation streak:', error);
    return 0;
  }
}

// Get most practiced meditation type
export async function getMostPracticedMeditation(): Promise<{ id: string; title: string; count: number } | null> {
  try {
    const sessions = await getMeditationSessions();
    
    if (sessions.length === 0) return null;
    
    // Count occurrences of each technique
    const techniqueCounts: Record<string, { id: string; title: string; count: number }> = {};
    
    sessions.forEach(session => {
      const id = session.technique.id;
      if (!techniqueCounts[id]) {
        techniqueCounts[id] = {
          id,
          title: session.technique.title,
          count: 0
        };
      }
      
      techniqueCounts[id].count += 1;
    });
    
    // Find the technique with the highest count
    return Object.values(techniqueCounts).sort((a, b) => b.count - a.count)[0] || null;
  } catch (error) {
    console.error('Error finding most practiced meditation:', error);
    return null;
  }
}

// Generate a unique ID for sessions (fallback)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Clear all meditation sessions (for testing)
export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Force-sync with the database (for debugging)
export async function forceSyncWithDatabase(): Promise<boolean> {
  try {
    const userId = getUserId(); // Use the getUserId from api-client
    console.log('Forcing sync with database using userId:', userId);
    
    if (!userId) return false;
    
    // Get sessions from API
    const response = await axios.get(`${API_URL}?userId=${userId}`, {
      headers: { 'x-user-id': userId }
    });
    
    console.log(`Force sync found ${response.data.length} meditation sessions`);
    
    // Convert and save to localStorage
    const apiSessions = Array.isArray(response.data) ? response.data.map(convertFromDb) : [];
    saveSessionsToLocalStorage(apiSessions);
    
    return apiSessions.length > 0;
  } catch (error) {
    console.error('Error during force sync for meditation:', error);
    return false;
  }
}