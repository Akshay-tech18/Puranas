// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));
//   }, [navigate]);

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">My Profile</h1>
//               <UserNav user={user} />
//             </div>
//           </header>
//           <main className="p-6">
//             <Card className="max-w-2xl mx-auto">
//               <CardHeader>
//                 <CardTitle>Profile Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex items-center gap-6">
//                   <Avatar className="h-24 w-24">
//                     <AvatarImage src={user.profilePicture} />
//                     <AvatarFallback className="text-2xl">
//                       {user.name.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h2 className="text-2xl font-bold">{user.name}</h2>
//                     <p className="text-muted-foreground">{user.email}</p>
//                   </div>
//                 </div>

//                 <div className="grid gap-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Cultural Interests</h3>
//                     <p>{user.culturalInterest}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold mb-2">Religion</h3>
//                     <p>{user.religion}</p>
//                   </div>

//                   {user.caste && (
//                     <div>
//                       <h3 className="font-semibold mb-2">Caste</h3>
//                       <p>{user.caste}</p>
//                     </div>
//                   )}

//                   <div>
//                     <h3 className="font-semibold mb-2">Family Group</h3>
//                     <div className="flex items-center gap-2">
//                       <Badge variant="outline">Code: {user.familyCode}</Badge>
//                       <Badge>{user.familyOption === "create" ? "Creator" : "Member"}</Badge>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Profile;

// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const API_BASE = "http://localhost:5000/api/users";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load profile");
        setUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data));
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <UserNav user={user} />
            </div>
          </header>

          <main className="p-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Cultural Interests</h3>
                    <p>{user.culturalInterest || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Religion</h3>
                    <p>{user.religion || "N/A"}</p>
                  </div>
                  {user.caste && (
                    <div>
                      <h3 className="font-semibold mb-2">Caste</h3>
                      <p>{user.caste}</p>
                    </div>
                  )}
                  {user.familyGroups?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Family Groups</h3>
                      {user.familyGroups.map((group: any) => (
                        <div key={group._id} className="flex gap-2">
                          <Badge variant="outline">Name: {group.name}</Badge>
                          <Badge>Code: {group.inviteCode}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
