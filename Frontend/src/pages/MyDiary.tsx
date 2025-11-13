// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Plus } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// const MyDiary = () => {
//   const navigate = useNavigate();
//   const [entries, setEntries] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));

//     const allEntries = JSON.parse(localStorage.getItem("entries") || "[]");
//     const userEntries = allEntries
//       .filter((e: any) => e.userId === JSON.parse(currentUser).id)
//       .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//     setEntries(userEntries);
//   }, [navigate]);

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">My Diary</h1>
//               <UserNav user={user} />
//             </div>
//           </header>
//           <main className="p-6">
//             <div className="mb-6">
//               <Link to="/create-entry">
//                 <Button className="gap-2">
//                   <Plus className="h-4 w-4" />
//                   New Entry
//                 </Button>
//               </Link>
//             </div>
//             <div className="grid gap-4">
//               {entries.length === 0 ? (
//                 <Card>
//                   <CardContent className="py-12">
//                     <p className="text-muted-foreground text-center">
//                       No entries yet. Create your first entry!
//                     </p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 entries.map((entry) => (
//                   <Link key={entry.id} to={`/entry/${entry.id}`}>
//                     <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
//                       <CardHeader>
//                         <div className="flex items-start justify-between">
//                           <CardTitle>{entry.title}</CardTitle>
//                           <Badge variant="secondary">{entry.privacyMode}</Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           {new Date(entry.createdAt).toLocaleDateString()} • {new Date(entry.createdAt).toLocaleTimeString()}
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
//                 ))
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default MyDiary;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/api/axiosInstance"; // ✅ added import
import { useToast } from "@/hooks/use-toast";

interface Entry {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  mode: string;
  tags?: string[];
  userId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

const MyDiary = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(currentUser));

    const fetchEntries = async () => {
      try {
        const { data } = await api.get("/entries?mode=personal");
        setEntries(data);
      } catch (error: any) {
        toast({
          title: "Error loading diary entries",
          description: error.response?.data?.message || "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [navigate]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">My Diary</h1>
              <UserNav user={user} />
            </div>
          </header>
          <main className="p-6">
            <div className="mb-6">
              <Link to="/create-entry">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {entries.length === 0 ? (
                <Card>
                  <CardContent className="py-12">
                    <p className="text-muted-foreground text-center">
                      No entries yet. Create your first entry!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                entries.map((entry) => (
                  <Link key={entry._id} to={`/entry/${entry._id}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle>{entry.title}</CardTitle>
                          <Badge variant="secondary">{entry.mode}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()} •{" "}
                          {new Date(entry.createdAt).toLocaleTimeString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3">{entry.content}</p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {entry.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MyDiary;
