import { createContext, useContext, useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface BookmarkData {
  id: string;
  interviewId: string;
  company: string;
  role: string;
  title: string;
  description: string;
  tags: string[];
  savedDate: string;
  userId: string;
}

interface BookmarksContextType {
  bookmarks: BookmarkData[];
  loading: boolean;
  isBookmarked: (interviewId: string) => boolean;
  addBookmark: (interviewData: {
    interviewId: string;
    company: string;
    role: string;
    title: string;
    description: string;
    tags: string[];
  }) => Promise<void>;
  removeBookmark: (interviewId: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch user's bookmarks from Firebase
  const fetchBookmarks = async () => {
    if (!currentUser) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      const bookmarksRef = collection(db, 'bookmarks');
      const q = query(bookmarksRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const userBookmarks: BookmarkData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userBookmarks.push({
          id: doc.id,
          interviewId: data.interviewId,
          company: data.company,
          role: data.role,
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          savedDate: data.savedDate,
          userId: data.userId,
        });
      });

      // Sort by saved date (most recent first)
      userBookmarks.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
      
      setBookmarks(userBookmarks);
      console.log('Fetched bookmarks:', userBookmarks.length);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if an interview is bookmarked
  const isBookmarked = (interviewId: string): boolean => {
    return bookmarks.some(bookmark => bookmark.interviewId === interviewId);
  };

  // Add a bookmark
  const addBookmark = async (interviewData: {
    interviewId: string;
    company: string;
    role: string;
    title: string;
    description: string;
    tags: string[];
  }) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to bookmark interviews.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookmarkData = {
        ...interviewData,
        userId: currentUser.uid,
        savedDate: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookmarks'), bookmarkData);
      
      const newBookmark: BookmarkData = {
        id: docRef.id,
        ...bookmarkData,
      };

      setBookmarks(prev => [newBookmark, ...prev]);
      
      toast({
        title: "Bookmarked!",
        description: "Interview has been added to your bookmarks.",
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark interview.",
        variant: "destructive",
      });
    }
  };

  // Remove a bookmark
  const removeBookmark = async (interviewId: string) => {
    if (!currentUser) return;

    try {
      const bookmark = bookmarks.find(b => b.interviewId === interviewId);
      if (!bookmark) return;

      await deleteDoc(doc(db, 'bookmarks', bookmark.id));
      
      setBookmarks(prev => prev.filter(b => b.interviewId !== interviewId));
      
      toast({
        title: "Bookmark removed",
        description: "Interview has been removed from your bookmarks.",
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark.",
        variant: "destructive",
      });
    }
  };

  // Refresh bookmarks
  const refreshBookmarks = async () => {
    setLoading(true);
    await fetchBookmarks();
  };

  // Fetch bookmarks when user changes
  useEffect(() => {
    fetchBookmarks();
  }, [currentUser]);

  const value = {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    refreshBookmarks,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}