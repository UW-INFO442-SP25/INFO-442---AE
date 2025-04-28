
import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Sample data for bookmarked interviews
const bookmarkedInterviews = [
  {
    id: 1,
    company: "Google",
    role: "UX Designer",
    title: "Full Interview Process (5 rounds)",
    description: "Detailed walkthrough of Google's UX design interview process including portfolio review, design exercise, and team matching.",
    savedDate: "Apr 15, 2025",
    tags: ["Portfolio", "Design Challenge"]
  },
  {
    id: 2,
    company: "Airbnb",
    role: "Product Designer",
    title: "Design Exercise Tips",
    description: "Tips and tricks for approaching Airbnb's design challenge and presentation with the team.",
    savedDate: "Apr 10, 2025",
    tags: ["Design Challenge", "Presentation"]
  },
  {
    id: 3,
    company: "Spotify",
    role: "Product Designer",
    title: "Interview Questions & Answers",
    description: "Common behavioral and technical questions asked during Spotify's product design interviews with example answers.",
    savedDate: "Mar 28, 2025",
    tags: ["Behavioral", "Technical"]
  },
  {
    id: 4,
    company: "LinkedIn",
    role: "UX Researcher",
    title: "Research Methods Interview",
    description: "How to prepare for LinkedIn's UX research methods interview and common scenarios to expect.",
    savedDate: "Mar 15, 2025",
    tags: ["Research Methods", "Case Study"]
  },
];

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(bookmarkedInterviews);
  const navigate = useNavigate();
  
  const removeBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <div className="text-gray-500">
            {bookmarks.length} saved interview experiences
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="overflow-hidden">
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
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => removeBookmark(bookmark.id)}
                    aria-label="Remove bookmark"
                  >
                    <BookmarkX className="h-5 w-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{bookmark.title}</h3>
                <p className="text-gray-600 mb-4">{bookmark.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {bookmark.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Saved on {bookmark.savedDate}</span>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => navigate(`/interview/${bookmark.company.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bookmarks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-xl font-medium mt-4 mb-2">No bookmarks yet</h3>
            <p className="text-gray-500 mb-4">
              When you find helpful interviews, bookmark them to access later
            </p>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate('/')}
            >
              Browse Interviews
            </Button>
          </div>
        )}
        
        {bookmarks.length > 0 && (
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
      </div>
    </Layout>
  );
};

export default Bookmarks;
