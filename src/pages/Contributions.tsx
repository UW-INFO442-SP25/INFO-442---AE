
import { Layout } from "@/components/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";

// Sample data for user contributions
const userContributions = [
  {
    id: 1,
    company: "Microsoft",
    role: "UX Research Intern",
    title: "5-Round Interview Process",
    date: "Apr 10, 2025",
    views: 342,
    status: "published",
  },
  {
    id: 2,
    company: "Adobe",
    role: "Product Design Intern",
    title: "Portfolio Review + Design Challenge",
    date: "Mar 15, 2025",
    views: 127,
    status: "published",
  },
  {
    id: 3,
    company: "Spotify",
    role: "Product Designer",
    title: "End-to-End Interview Experience",
    date: "Feb 28, 2025",
    views: 56,
    status: "draft",
  },
];

const Contributions = () => {
  const [activeTab, setActiveTab] = useState("published");
  const navigate = useNavigate();
  
  const filteredContributions = userContributions.filter(
    (contribution) => activeTab === "all" || contribution.status === activeTab
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Contributions</h1>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              navigate('/create-interview')
              toast({
                title: "Create New Interview Experience",
                description: "The form has been opened.",
              });
            }}
          >
            Share New Experience
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6 border-b">
            <button 
              className={`pb-2 px-1 ${activeTab === 'published' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('published')}
            >
              Published
            </button>
            <button 
              className={`pb-2 px-1 ${activeTab === 'draft' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('draft')}
            >
              Drafts
            </button>
            <button 
              className={`pb-2 px-1 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experience</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contribution.title}</div>
                      <div className="text-sm text-gray-500">
                        {contribution.company} • {contribution.role}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contribution.date}</TableCell>
                  <TableCell>{contribution.views}</TableCell>
                  <TableCell>
                    <Badge 
                      className={contribution.status === "published" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => {
                        toast({
                          title: "Edit Interview Experience",
                          description: `Editing ${contribution.title}`,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        navigate(`/interview/${contribution.company.toLowerCase().replace(/\s+/g, '-')}`);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-6">
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
        </div>
      </div>
    </Layout>
  );
};

export default Contributions;
