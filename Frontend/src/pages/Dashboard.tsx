// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Plus } from "lucide-react";

// const Dashboard = () => {
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
//       .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//       .slice(0, 5);
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
//               <h1 className="text-2xl font-bold">Dashboard</h1>
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
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Entries</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {entries.length === 0 ? (
//                   <p className="text-muted-foreground text-center py-8">
//                     No entries yet. Create your first entry!
//                   </p>
//                 ) : (
//                   <div className="space-y-4">
//                     {entries.map((entry) => (
//                       <Link
//                         key={entry.id}
//                         to={`/entry/${entry.id}`}
//                         className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                       >
//                         <h3 className="font-semibold">{entry.title}</h3>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           {new Date(entry.createdAt).toLocaleDateString()}
//                         </p>
//                         <p className="text-sm mt-2 line-clamp-2">{entry.content}</p>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Plus } from "lucide-react";
import api from "@/api/axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    // If user not logged in → redirect
    if (!currentUser || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(currentUser);
    setUser(parsedUser);

    // Fetch recent personal entries from backend
    const fetchDashboardEntries = async () => {
      try {
        const { data } = await api.get("/entries?mode=personal", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Show latest 5
        setEntries(data.slice(0, 5));
      } catch (error) {
        console.error("Error loading personal entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardEntries();
  }, [navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <UserNav user={user} />
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            {/* New Entry Button */}
            <div className="mb-6">
              <Link to="/create-entry">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
              </Link>
            </div>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">
                    Loading entries...
                  </p>
                ) : entries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No entries yet. Create your first entry!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <Link
                        key={entry._id}
                        to={`/entry/${entry._id}`}
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2 line-clamp-2">
                          {entry.content}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
