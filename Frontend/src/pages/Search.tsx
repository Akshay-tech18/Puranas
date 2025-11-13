// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Search as SearchIcon } from "lucide-react";

// const Search = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<any>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [results, setResults] = useState<any[]>([]);

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));
//   }, [navigate]);

//   useEffect(() => {
//     if (!searchQuery) {
//       setResults([]);
//       return;
//     }

//     const allEntries = JSON.parse(localStorage.getItem("entries") || "[]");
//     const filtered = allEntries.filter((entry: any) => {
//       const matchesQuery = 
//         entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         entry.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
//       const matchesFilter = filter === "all" || entry.privacyMode === filter;
      
//       return matchesQuery && matchesFilter;
//     });

//     setResults(filtered);
//   }, [searchQuery, filter]);

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Search</h1>
//               <UserNav user={user} />
//             </div>
//           </header>
//           <main className="p-6">
//             <div className="max-w-3xl mx-auto space-y-6">
//               <div className="flex gap-4">
//                 <div className="flex-1 relative">
//                   <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search by title, content, or tags..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//                 <Select value={filter} onValueChange={setFilter}>
//                   <SelectTrigger className="w-40">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     <SelectItem value="personal">Personal</SelectItem>
//                     <SelectItem value="family">Family</SelectItem>
//                     <SelectItem value="community">Community</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-4">
//                 {results.length === 0 && searchQuery && (
//                   <Card>
//                     <CardContent className="py-12">
//                       <p className="text-muted-foreground text-center">
//                         No results found for "{searchQuery}"
//                       </p>
//                     </CardContent>
//                   </Card>
//                 )}
                
//                 {results.map((entry) => (
//                   <Link key={entry.id} to={`/entry/${entry.id}`}>
//                     <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
//                       <CardHeader>
//                         <div className="flex items-start justify-between">
//                           <CardTitle>{entry.title}</CardTitle>
//                           <Badge variant="secondary">{entry.privacyMode}</Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           {new Date(entry.createdAt).toLocaleDateString()}
//                         </p>
//                       </CardHeader>
//                       <CardContent>
//                         <p className="line-clamp-3">{entry.content}</p>
//                         {entry.tags && entry.tags.length > 0 && (
//                           <div className="flex gap-2 mt-3">
//                             {entry.tags.map((tag: string, idx: number) => (
//                               <Badge key={idx} variant="outline">{tag}</Badge>
//                             ))}
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Search;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axiosInstance";

const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params: any = { keyword: searchQuery };
        if (filter !== "all") params.mode = filter;

        const { data } = await api.get("/search", {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });

        setResults(data);
      } catch (error: any) {
        console.error("Search error:", error);
        toast({
          title: "Search failed",
          description:
            error.response?.data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, filter, toast]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Search</h1>
              <UserNav user={user} />
            </div>
          </header>

          {/* Main */}
          <main className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, content, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {loading && (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Searching...
                    </CardContent>
                  </Card>
                )}

                {!loading && results.length === 0 && searchQuery && (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-muted-foreground text-center">
                        No results found for "{searchQuery}"
                      </p>
                    </CardContent>
                  </Card>
                )}

                {!loading &&
                  results.map((entry) => (
                    <Link key={entry._id} to={`/entry/${entry._id}`}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle>{entry.title}</CardTitle>
                            <Badge variant="secondary">{entry.mode}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-3">{entry.content}</p>
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {entry.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Search;
