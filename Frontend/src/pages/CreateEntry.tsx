// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { useToast } from "@/hooks/use-toast";
// import { Mic, MicOff, Upload, X, Image as ImageIcon } from "lucide-react";

// const CreateEntry = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [user, setUser] = useState<any>(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [privacyMode, setPrivacyMode] = useState("");
//   const [tags, setTags] = useState("");
//   const [images, setImages] = useState<string[]>([]);
//   const [audioFile, setAudioFile] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));
//   }, [navigate]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     Array.from(files).forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImages(prev => [...prev, reader.result as string]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setAudioFile(reader.result as string);
//       setRecordedAudio(null);
//     };
//     reader.readAsDataURL(file);
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setRecordedAudio(reader.result as string);
//           setAudioFile(null);
//         };
//         reader.readAsDataURL(audioBlob);
//         stream.getTracks().forEach(track => track.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       toast({ title: "Error", description: "Could not access microphone", variant: "destructive" });
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const removeImage = (index: number) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const newEntry = {
//       id: Date.now().toString(),
//       userId: user.id,
//       title,
//       content,
//       privacyMode,
//       tags: tags.split(",").map(t => t.trim()),
//       createdAt: new Date().toISOString(),
//       comments: [],
//       images,
//       audio: recordedAudio || audioFile
//     };

//     const entries = JSON.parse(localStorage.getItem("entries") || "[]");
//     entries.push(newEntry);
//     localStorage.setItem("entries", JSON.stringify(entries));

//     toast({ title: "Entry created!", description: "Your entry has been saved." });
//     navigate("/my-diary");
//   };

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1">
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Create New Entry</h1>
//               <UserNav user={user} />
//             </div>
//           </header>
//           <main className="p-6">
//             <Card className="max-w-2xl mx-auto">
//               <CardHeader>
//                 <CardTitle>New Entry</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="title">Title</Label>
//                     <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="content">Content</Label>
//                     <Textarea 
//                       id="content" 
//                       value={content} 
//                       onChange={(e) => setContent(e.target.value)} 
//                       rows={8}
//                       required 
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Privacy Mode</Label>
//                     <Select value={privacyMode} onValueChange={setPrivacyMode} required>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select privacy mode" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="personal">Personal</SelectItem>
//                         <SelectItem value="family">Family</SelectItem>
//                         <SelectItem value="community">Community</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="tags">Tags (comma-separated)</Label>
//                     <Input 
//                       id="tags" 
//                       value={tags} 
//                       onChange={(e) => setTags(e.target.value)} 
//                       placeholder="culture, tradition, family"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Images</Label>
//                     <div className="flex items-center gap-2">
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={handleImageUpload}
//                         className="hidden"
//                         id="image-upload"
//                       />
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => document.getElementById('image-upload')?.click()}
//                       >
//                         <ImageIcon className="mr-2 h-4 w-4" />
//                         Upload Images
//                       </Button>
//                     </div>
//                     {images.length > 0 && (
//                       <div className="grid grid-cols-3 gap-2 mt-2">
//                         {images.map((img, idx) => (
//                           <div key={idx} className="relative group">
//                             <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-24 object-cover rounded" />
//                             <Button
//                               type="button"
//                               variant="destructive"
//                               size="icon"
//                               className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//                               onClick={() => removeImage(idx)}
//                             >
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Audio</Label>
//                     <div className="flex flex-col gap-2">
//                       <div className="flex items-center gap-2">
//                         <Input
//                           type="file"
//                           accept="audio/*"
//                           onChange={handleAudioUpload}
//                           className="hidden"
//                           id="audio-upload"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => document.getElementById('audio-upload')?.click()}
//                         >
//                           <Upload className="mr-2 h-4 w-4" />
//                           Upload Audio
//                         </Button>
//                         <Button
//                           type="button"
//                           variant={isRecording ? "destructive" : "outline"}
//                           onClick={isRecording ? stopRecording : startRecording}
//                         >
//                           {isRecording ? (
//                             <>
//                               <MicOff className="mr-2 h-4 w-4" />
//                               Stop Recording
//                             </>
//                           ) : (
//                             <>
//                               <Mic className="mr-2 h-4 w-4" />
//                               Record Voice
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                       {(audioFile || recordedAudio) && (
//                         <div className="space-y-2">
//                           <audio controls src={recordedAudio || audioFile || ""} className="w-full" />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => {
//                               setAudioFile(null);
//                               setRecordedAudio(null);
//                             }}
//                           >
//                             <X className="mr-2 h-4 w-4" />
//                             Remove Audio
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex gap-4">
//                     <Button type="submit">Save Entry</Button>
//                     <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default CreateEntry;

// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { useToast } from "@/hooks/use-toast";
// import { Mic, MicOff, Upload, X, Image as ImageIcon } from "lucide-react";
// import { createEntry, getEntryById, updateEntry } from "@/api/entriesApi"; // ✅ import APIs

// const CreateEntry = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // ✅ detects edit mode
//   const { toast } = useToast();

//   const [user, setUser] = useState<any>(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [privacyMode, setPrivacyMode] = useState("");
//   const [tags, setTags] = useState("");
//   const [images, setImages] = useState<string[]>([]);
//   const [audioFile, setAudioFile] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   // ✅ Load user and existing entry (if editing)
//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));

//     if (id) {
//       (async () => {
//         try {
//           const { data } = await getEntryById(id);
//           setTitle(data.title);
//           setContent(data.content);
//           setPrivacyMode(data.mode);
//           setTags(data.tags?.join(", ") || "");
//           setImages(data.media?.images || []);
//           setAudioFile(data.media?.audio?.[0] || null);
//         } catch (error: any) {
//           toast({
//             title: "Error loading entry",
//             description: error.response?.data?.message || "Failed to load entry.",
//             variant: "destructive",
//           });
//         }
//       })();
//     }
//   }, [navigate, id]);

//   // ✅ File uploads
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     Array.from(files).forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImages(prev => [...prev, reader.result as string]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setAudioFile(reader.result as string);
//       setRecordedAudio(null);
//     };
//     reader.readAsDataURL(file);
//   };

//   // ✅ Audio recording
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setRecordedAudio(reader.result as string);
//           setAudioFile(null);
//         };
//         reader.readAsDataURL(audioBlob);
//         stream.getTracks().forEach(track => track.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       toast({ title: "Error", description: "Could not access microphone", variant: "destructive" });
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

//   // ✅ Unified submit for create + update
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);
//       formData.append("mode", privacyMode);
//       formData.append("tags", tags);

//       const imageInputs = document.getElementById("image-upload") as HTMLInputElement;
//       if (imageInputs?.files) {
//         Array.from(imageInputs.files).forEach((file) => formData.append("images", file));
//       }

//       const audioInput = document.getElementById("audio-upload") as HTMLInputElement;
//       if (audioInput?.files?.length) {
//         formData.append("audio", audioInput.files[0]);
//       } else if (recordedAudio) {
//         const byteString = atob(recordedAudio.split(",")[1]);
//         const arrayBuffer = new ArrayBuffer(byteString.length);
//         const intArray = new Uint8Array(arrayBuffer);
//         for (let i = 0; i < byteString.length; i++) intArray[i] = byteString.charCodeAt(i);
//         const blob = new Blob([intArray], { type: "audio/webm" });
//         formData.append("audio", blob, "recorded_audio.webm");
//       }

//       if (id) {
//         await updateEntry(id, formData);
//         toast({ title: "Entry updated!", description: "Your entry has been updated." });
//       } else {
//         await createEntry(formData);
//         toast({ title: "Entry created!", description: "Your new entry has been saved." });
//       }

//       navigate("/my-diary");
//     } catch (error: any) {
//       console.error("Entry submission error:", error);
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Something went wrong.",
//         variant: "destructive",
//       });
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
//               <h1 className="text-2xl font-bold">
//                 {id ? "Edit Entry" : "Create New Entry"}
//               </h1>
//               <UserNav user={user} />
//             </div>
//           </header>

//           <main className="p-6">
//             <Card className="max-w-2xl mx-auto">
//               <CardHeader>
//                 <CardTitle>{id ? "Edit Entry" : "New Entry"}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {/* Title */}
//                   <div className="space-y-2">
//                     <Label htmlFor="title">Title</Label>
//                     <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//                   </div>

//                   {/* Content */}
//                   <div className="space-y-2">
//                     <Label htmlFor="content">Content</Label>
//                     <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
//                   </div>

//                   {/* Privacy Mode */}
//                   <div className="space-y-2">
//                     <Label>Privacy Mode</Label>
//                     <Select value={privacyMode} onValueChange={setPrivacyMode} required>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select privacy mode" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="personal">Personal</SelectItem>
//                         <SelectItem value="family">Family</SelectItem>
//                         <SelectItem value="community">Community</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Tags */}
//                   <div className="space-y-2">
//                     <Label htmlFor="tags">Tags (comma-separated)</Label>
//                     <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="culture, tradition" />
//                   </div>

//                   {/* Images */}
//                   <div className="space-y-2">
//                     <Label>Images</Label>
//                     <div className="flex items-center gap-2">
//                       <Input type="file" accept="image/*" multiple onChange={handleImageUpload} id="image-upload" className="hidden" />
//                       <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
//                         <ImageIcon className="mr-2 h-4 w-4" /> Upload Images
//                       </Button>
//                     </div>
//                     {images.length > 0 && (
//                       <div className="grid grid-cols-3 gap-2 mt-2">
//                         {images.map((img, idx) => (
//                           <div key={idx} className="relative group">
//                             <img src={img.startsWith("http") ? img : `http://localhost:5000${img}`} alt={`Upload ${idx + 1}`} className="w-full h-24 object-cover rounded" />
//                             <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(idx)}>
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Audio */}
//                   <div className="space-y-2">
//                     <Label>Audio</Label>
//                     <div className="flex flex-col gap-2">
//                       <div className="flex items-center gap-2">
//                         <Input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" id="audio-upload" />
//                         <Button type="button" variant="outline" onClick={() => document.getElementById("audio-upload")?.click()}>
//                           <Upload className="mr-2 h-4 w-4" /> Upload Audio
//                         </Button>
//                         <Button type="button" variant={isRecording ? "destructive" : "outline"} onClick={isRecording ? stopRecording : startRecording}>
//                           {isRecording ? (<><MicOff className="mr-2 h-4 w-4" /> Stop Recording</>) : (<><Mic className="mr-2 h-4 w-4" /> Record Voice</>)}
//                         </Button>
//                       </div>
//                       {(audioFile || recordedAudio) && (
//                         <div className="space-y-2">
//                           <audio controls src={recordedAudio || audioFile || ""} className="w-full" />
//                           <Button type="button" variant="ghost" size="sm" onClick={() => { setAudioFile(null); setRecordedAudio(null); }}>
//                             <X className="mr-2 h-4 w-4" /> Remove Audio
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex gap-4">
//                     <Button type="submit">{id ? "Update Entry" : "Save Entry"}</Button>
//                     <Button type="button" variant="outline" onClick={() => navigate("/my-diary")}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default CreateEntry;

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Upload, X, Image as ImageIcon } from "lucide-react";
import { createEntry, getEntryById, updateEntry } from "@/api/entriesApi";

const BASE_URL = "http://localhost:5000"; // ✅ backend base URL

const CreateEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ detects edit mode
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacyMode, setPrivacyMode] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ✅ Load user and existing entry (if editing)
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    if (id) {
      (async () => {
        try {
          const token = localStorage.getItem("token");
          const { data } = await getEntryById(id, token);
          setTitle(data.title);
          setContent(data.content);
          setPrivacyMode(data.mode);
          setTags(data.tags?.join(", ") || "");
          setImages(data.media?.images || []);
          setAudioFile(data.media?.audio?.[0] || null);
        } catch (error: any) {
          toast({
            title: "Error loading entry",
            description:
              error.response?.data?.message || "Failed to load entry.",
            variant: "destructive",
          });
        }
      })();
    }
  }, [navigate, id]);

  // ✅ Handle image preview before upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setImages((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ Audio upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAudioFile(reader.result as string);
      setRecordedAudio(null);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudio(reader.result as string);
          setAudioFile(null);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // ✅ Unified submit for create + update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please login again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("mode", privacyMode);
      formData.append("tags", tags);

      // Add image files
      const imageInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (imageInput?.files) {
        Array.from(imageInput.files).forEach((file) =>
          formData.append("images", file)
        );
      }

      // Add audio file or recording
      const audioInput = document.getElementById(
        "audio-upload"
      ) as HTMLInputElement;
      if (audioInput?.files?.length) {
        formData.append("audio", audioInput.files[0]);
      } else if (recordedAudio) {
        const byteString = atob(recordedAudio.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++)
          intArray[i] = byteString.charCodeAt(i);
        const blob = new Blob([intArray], { type: "audio/webm" });
        formData.append("audio", blob, "recorded_audio.webm");
      }

      if (id) {
        await updateEntry(id, formData, token);
        toast({ title: "Entry updated!", description: "Changes saved." });
      } else {
        await createEntry(formData, token);
        toast({ title: "Entry created!", description: "Entry saved successfully." });
      }

      navigate("/my-diary");
    } catch (error: any) {
      console.error("Entry submission error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
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
              <h1 className="text-2xl font-bold">
                {id ? "Edit Entry" : "Create New Entry"}
              </h1>
              <UserNav user={user} />
            </div>
          </header>

          <main className="p-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>{id ? "Edit Entry" : "New Entry"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      required
                    />
                  </div>

                  {/* Privacy Mode */}
                  <div className="space-y-2">
                    <Label>Privacy Mode</Label>
                    <Select
                      value={privacyMode}
                      onValueChange={setPrivacyMode}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="culture, tradition"
                    />
                  </div>

                  {/* Images
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        id="image-upload"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <ImageIcon className="mr-2 h-4 w-4" /> Upload Images
                      </Button>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={
                                img.startsWith("http")
                                  ? img
                                  : `${BASE_URL}${img}`
                              }
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div> */}
                  {/* Images */}
<div className="space-y-2">
  <Label>Images</Label>
  <div className="flex items-center gap-2">
    <Input
      type="file"
      accept="image/*"
      multiple
      id="image-upload"
      className="hidden"
      onChange={handleImageUpload}
    />
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        document.getElementById("image-upload")?.click()
      }
    >
      <ImageIcon className="mr-2 h-4 w-4" /> Upload Images
    </Button>
  </div>

  {images.length > 0 && (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {images.map((img, idx) => {
        // 👉 FIXED: correct preview for all types
        const imgSrc = img.startsWith("data:image")
          ? img
          : img.startsWith("http")
          ? img
          : `${BASE_URL}${img}`;

        return (
          <div key={idx} className="relative group">
            <img
              src={imgSrc}
              alt={`Upload ${idx + 1}`}
              className="w-full h-24 object-cover rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(idx)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  )}
</div>


                  {/* Audio */}
                  <div className="space-y-2">
                    <Label>Audio</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="audio/*"
                          id="audio-upload"
                          className="hidden"
                          onChange={handleAudioUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("audio-upload")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Audio
                        </Button>
                        <Button
                          type="button"
                          variant={isRecording ? "destructive" : "outline"}
                          onClick={
                            isRecording ? stopRecording : startRecording
                          }
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="mr-2 h-4 w-4" /> Record Voice
                            </>
                          )}
                        </Button>
                      </div>

                      {(audioFile || recordedAudio) && (
                        <div className="space-y-2">
                          <audio
                            controls
                            src={recordedAudio || audioFile || ""}
                            className="w-full"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAudioFile(null);
                              setRecordedAudio(null);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" /> Remove Audio
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4">
                    <Button type="submit">
                      {id ? "Update Entry" : "Save Entry"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/my-diary")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreateEntry;
