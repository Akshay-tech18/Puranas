// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Badge } from "@/components/ui/badge";

// const FamilyDiary = () => {
//   const navigate = useNavigate();
//   const [entries, setEntries] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     const parsedUser = JSON.parse(currentUser);
//     setUser(parsedUser);

//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     const familyMembers = users.filter((u: any) => u.familyCode === parsedUser.familyCode);
//     const familyUserIds = familyMembers.map((u: any) => u.id);

//     const allEntries = JSON.parse(localStorage.getItem("entries") || "[]");
//     const familyEntries = allEntries
//       .filter((e: any) => familyUserIds.includes(e.userId) && e.privacyMode === "family")
//       .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//     setEntries(familyEntries);
//   }, [navigate]);

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Family Diary</h1>
//               <UserNav user={user} />
//             </div>
//           </header>
//           <main className="p-6">
//             <div className="grid gap-4">
//               {entries.length === 0 ? (
//                 <Card>
//                   <CardContent className="py-12">
//                     <p className="text-muted-foreground text-center">
//                       No family entries yet.
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
//                           <Badge variant="secondary">family</Badge>
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
//                 ))
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default FamilyDiary;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axiosInstance";

const FamilyDiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch family entries from backend
  const fetchFamilyEntries = async (token: string) => {
    try {
      const { data } = await api.get("/entries?mode=family", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(data);
    } catch (error: any) {
      console.error("Error fetching family entries:", error);
      toast({
        title: "Failed to load family entries",
        description:
          error.response?.data?.message || "Something went wrong while loading data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run on mount
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    if (!currentUser || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(currentUser);
    setUser(parsedUser);

    fetchFamilyEntries(token);
  }, [navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Family Diary</h1>
              <UserNav user={user} />
            </div>
          </header>

          <main className="p-6">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Loading family entries...
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {entries.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-muted-foreground text-center">
                        No family entries yet.
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
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-3">{entry.content}</p>

                          {/* ✅ Display tags if any */}
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
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FamilyDiary;
