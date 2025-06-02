import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkX, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useBookmarks } from "@/contexts/BookmarksContext";

const Bookmarks = () => {
  const { bookmarks, loading, removeBookmark } = useBookmarks();
  const navigate = useNavigate();
  
  const handleRemoveBookmark = async (interviewId: string) => {
    await removeBookmark(interviewId);
  };

  const handleViewInterview = (company: string) => {
    const companySlug = company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/interview/${companySlug}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading your bookmarks...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
            <p className="text-gray-600 mt-1">
              {bookmarks.length === 0 
                ? "You haven't bookmarked any interviews yet" 
                : `${bookmarks.length} saved interview experience${bookmarks.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          <Button
            onClick={() => navigate('/interviews')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Browse Interviews
          </Button>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Bookmark className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              When you find helpful interview experiences, bookmark them to access later. 
              Click the bookmark icon on any interview card to save it here.
            </p>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate('/interviews')}
            >
              Browse Interviews
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          {bookmark.company}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          {bookmark.role}
                        </Badge>
                      </div>
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveBookmark(bookmark.interviewId)}
                        aria-label="Remove bookmark"
                      >
                        <BookmarkX className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{bookmark.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {bookmark.description}
                    </p>
                    
                    {bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bookmark.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Saved on {new Date(bookmark.savedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleViewInterview(bookmark.company)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {bookmarks.length > 10 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Bookmarks;