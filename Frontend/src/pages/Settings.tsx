// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// const Settings = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [user, setUser] = useState<any>(null);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));
//   }, [navigate]);

//   const handlePasswordChange = () => {
//     if (newPassword !== confirmPassword) {
//       toast({ title: "Passwords don't match", variant: "destructive" });
//       return;
//     }

//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     const updatedUsers = users.map((u: any) =>
//       u.id === user.id ? { ...u, password: newPassword } : u
//     );
//     localStorage.setItem("users", JSON.stringify(updatedUsers));
    
//     const updatedUser = { ...user, password: newPassword };
//     localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
//     toast({ title: "Password updated successfully!" });
//     setNewPassword("");
//     setConfirmPassword("");
//   };

//   const handleDeleteAccount = () => {
//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     const filteredUsers = users.filter((u: any) => u.id !== user.id);
//     localStorage.setItem("users", JSON.stringify(filteredUsers));
    
//     const entries = JSON.parse(localStorage.getItem("entries") || "[]");
//     const filteredEntries = entries.filter((e: any) => e.userId !== user.id);
//     localStorage.setItem("entries", JSON.stringify(filteredEntries));
    
//     localStorage.removeItem("currentUser");
//     toast({ title: "Account deleted" });
//     navigate("/login");
//   };

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Settings</h1>
//               <UserNav user={user} />
//             </div>
//           </header>
//           <main className="p-6">
//             <div className="max-w-2xl mx-auto space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Change Password</CardTitle>
//                   <CardDescription>Update your account password</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="new-password">New Password</Label>
//                     <Input
//                       id="new-password"
//                       type="password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirm-password">Confirm Password</Label>
//                     <Input
//                       id="confirm-password"
//                       type="password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                   </div>
//                   <Button onClick={handlePasswordChange}>Update Password</Button>
//                 </CardContent>
//               </Card>

//               <Card className="border-destructive">
//                 <CardHeader>
//                   <CardTitle className="text-destructive">Danger Zone</CardTitle>
//                   <CardDescription>Irreversible actions</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant="destructive">Delete Account</Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This action cannot be undone. This will permanently delete your account
//                           and remove all your data including diary entries.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleDeleteAccount}>
//                           Delete Account
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </CardContent>
//               </Card>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Settings;

// src/pages/Settings.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle,
// } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription,
//   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// const API_BASE = "http://localhost:5000/api/users";

// const Settings = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [user, setUser] = useState<any>(null);
//   const [newPassword, setNewPassword] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");
//     if (!storedUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(storedUser));
//   }, [navigate]);

//   // ✅ Change password using backend
//   const handlePasswordChange = async () => {
//     if (newPassword !== confirmPassword) {
//       toast({ title: "Passwords don't match", variant: "destructive" });
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/${user._id}/password`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword,
//           newPassword,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Error updating password");

//       toast({ title: "Password updated successfully!" });
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err: any) {
//       toast({ title: err.message, variant: "destructive" });
//     }
//   };

//   // ✅ Delete account using backend
//   const handleDeleteAccount = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/${user._id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Error deleting account");

//       toast({ title: "Account deleted successfully" });
//       localStorage.clear();
//       navigate("/login");
//     } catch (err: any) {
//       toast({ title: err.message, variant: "destructive" });
//     }
//   };

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Settings</h1>
//               <UserNav user={user} />
//             </div>
//           </header>

//           <main className="p-6">
//             <div className="max-w-2xl mx-auto space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Change Password</CardTitle>
//                   <CardDescription>Update your account password</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label htmlFor="current-password">Current Password</Label>
//                     <Input
//                       id="current-password"
//                       type="password"
//                       value={currentPassword}
//                       onChange={(e) => setCurrentPassword(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="new-password">New Password</Label>
//                     <Input
//                       id="new-password"
//                       type="password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="confirm-password">Confirm Password</Label>
//                     <Input
//                       id="confirm-password"
//                       type="password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                   </div>
//                   <Button onClick={handlePasswordChange}>Update Password</Button>
//                 </CardContent>
//               </Card>

//               <Card className="border-destructive">
//                 <CardHeader>
//                   <CardTitle className="text-destructive">Danger Zone</CardTitle>
//                   <CardDescription>Irreversible actions</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant="destructive">Delete Account</Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This action cannot be undone. This will permanently delete your account
//                           and all related data.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleDeleteAccount}>
//                           Delete Account
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </CardContent>
//               </Card>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Settings;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle,
// } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
//   AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// const API_BASE = "http://localhost:5000/api/users";

// const Settings = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [user, setUser] = useState<any>(null);
//   const [editForm, setEditForm] = useState({
//     name: "",
//     email: "",
//     profilePicture: "",
//     culturalIntrest: "",
//     religion: "",
//     caste: "",
//   });

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");
//     if (!storedUser) {
//       navigate("/login");
//       return;
//     }
//     const parsedUser = JSON.parse(storedUser);
//     setUser(parsedUser);
//     setEditForm({
//       name: parsedUser.name || "",
//       email: parsedUser.email || "",
//       profilePicture: parsedUser.profilePicture || "",
//       culturalIntrest: parsedUser.culturalIntrest || "",
//       religion: parsedUser.religion || "",
//       caste: parsedUser.caste || "",
//     });
//   }, [navigate]);

//   // ✅ Edit Profile API call
//   const handleProfileUpdate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/${user._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(editForm),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Error updating profile");

//       localStorage.setItem("currentUser", JSON.stringify(data));
//       setUser(data);
//       toast({ title: "Profile updated successfully!" });
//     } catch (err: any) {
//       toast({ title: err.message, variant: "destructive" });
//     }
//   };

//   // ✅ Change Password API call
//   const handlePasswordChange = async () => {
//     if (newPassword !== confirmPassword) {
//       toast({ title: "Passwords don't match", variant: "destructive" });
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/${user._id}/password`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword,
//           newPassword,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Error updating password");

//       toast({ title: "Password updated successfully!" });
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err: any) {
//       toast({ title: err.message, variant: "destructive" });
//     }
//   };

//   // ✅ Delete Account API call
//   const handleDeleteAccount = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/${user._id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Error deleting account");

//       toast({ title: "Account deleted successfully" });
//       localStorage.clear();
//       navigate("/login");
//     } catch (err: any) {
//       toast({ title: err.message, variant: "destructive" });
//     }
//   };

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Settings</h1>
//               <UserNav user={user} />
//             </div>
//           </header>

//           <main className="p-6">
//             <div className="max-w-2xl mx-auto space-y-6">
//               {/* ✏️ Edit Profile */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Edit Profile</CardTitle>
//                   <CardDescription>Update your personal details</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label>Name</Label>
//                     <Input
//                       value={editForm.name}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, name: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Email</Label>
//                     <Input
//                       type="email"
//                       value={editForm.email}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, email: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Profile Picture (URL)</Label>
//                     <Input
//                       value={editForm.profilePicture}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, profilePicture: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Cultural Interest</Label>
//                     <Input
//                       value={editForm.culturalIntrest}
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           culturalIntrest: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Religion</Label>
//                     <Input
//                       value={editForm.religion}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, religion: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Caste</Label>
//                     <Input
//                       value={editForm.caste}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, caste: e.target.value })
//                       }
//                     />
//                   </div>
//                   <Button onClick={handleProfileUpdate}>Save Changes</Button>
//                 </CardContent>
//               </Card>

//               {/* 🔐 Change Password */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Change Password</CardTitle>
//                   <CardDescription>Update your account password</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label>Current Password</Label>
//                     <Input
//                       type="password"
//                       value={currentPassword}
//                       onChange={(e) => setCurrentPassword(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label>New Password</Label>
//                     <Input
//                       type="password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label>Confirm Password</Label>
//                     <Input
//                       type="password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                   </div>
//                   <Button onClick={handlePasswordChange}>Update Password</Button>
//                 </CardContent>
//               </Card>

//               {/* ☠️ Danger Zone */}
//               <Card className="border-destructive">
//                 <CardHeader>
//                   <CardTitle className="text-destructive">Danger Zone</CardTitle>
//                   <CardDescription>Irreversible actions</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant="destructive">Delete Account</Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This action cannot be undone. This will permanently delete
//                           your account and all data.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleDeleteAccount}>
//                           Delete Account
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </CardContent>
//               </Card>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Settings;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE = "http://localhost:5000/api/users";
const UPLOAD_URL = "http://localhost:5000/api/upload";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    profilePicture: "",
    culturalInterest: "",
    religion: "",
    caste: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setEditForm({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      profilePicture: parsedUser.profilePicture || "",
      culturalInterest: parsedUser.culturalInterest || "",
      religion: parsedUser.religion || "",
      caste: parsedUser.caste || "",
    });
  }, [navigate]);

  // ✅ Edit Profile API call
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating profile");

      localStorage.setItem("currentUser", JSON.stringify(data));
      setUser(data);
      toast({ title: "Profile updated successfully!" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  // ✅ Change Password
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/${user._id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating password");

      toast({ title: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting account");

      toast({ title: "Account deleted successfully" });
      localStorage.clear();
      navigate("/login");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  // ✅ Upload Profile Picture
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      const fullImageUrl = `http://localhost:5000${data.imagePath}`;
      setEditForm({ ...editForm, profilePicture: fullImageUrl });
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Settings</h1>
              <UserNav user={user} />
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* ✏️ Edit Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Picture</Label>

                    {editForm.profilePicture && (
                      <img
                        src={editForm.profilePicture}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    )}

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    {isUploading && (
                      <p className="text-sm text-muted-foreground">
                        Uploading image...
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Cultural Interest</Label>
                    <Input
                      value={editForm.culturalInterest}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          culturalInterest: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Religion</Label>
                    <Input
                      value={editForm.religion}
                      onChange={(e) =>
                        setEditForm({ ...editForm, religion: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Caste</Label>
                    <Input
                      value={editForm.caste}
                      onChange={(e) =>
                        setEditForm({ ...editForm, caste: e.target.value })
                      }
                    />
                  </div>

                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </CardContent>
              </Card>

              {/* 🔐 Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                </CardContent>
              </Card>

              {/* ☠️ Danger Zone */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete
                          your account and all data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
