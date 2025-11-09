import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const ViewEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    const allEntries = JSON.parse(localStorage.getItem("entries") || "[]");
    const foundEntry = allEntries.find((e: any) => e.id === id);
    if (foundEntry) {
      setEntry(foundEntry);
    }
  }, [id, navigate]);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const allEntries = JSON.parse(localStorage.getItem("entries") || "[]");
    const updatedEntries = allEntries.map((e: any) => {
      if (e.id === id) {
        return {
          ...e,
          comments: [
            ...(e.comments || []),
            {
              id: Date.now().toString(),
              userId: user.id,
              userName: user.name,
              content: comment,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return e;
    });

    localStorage.setItem("entries", JSON.stringify(updatedEntries));
    setEntry(updatedEntries.find((e: any) => e.id === id));
    setComment("");
    toast({ title: "Comment added!" });
  };

  if (!user || !entry) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">View Entry</h1>
              <UserNav user={user} />
            </div>
          </header>
          <main className="p-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-3xl">{entry.title}</CardTitle>
                  <Badge>{entry.privacyMode}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </div>

                {entry.images && entry.images.length > 0 && (
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {entry.images.map((img: string, idx: number) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Entry image ${idx + 1}`} 
                          className="w-full h-48 object-cover rounded border border-border" 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {entry.audio && (
                  <div className="space-y-2">
                    <Label>Audio Recording</Label>
                    <audio controls src={entry.audio} className="w-full" />
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex gap-2">
                    {entry.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Comments</h3>
                  <div className="space-y-4 mb-4">
                    {entry.comments && entry.comments.length > 0 ? (
                      entry.comments.map((c: any) => (
                        <Card key={c.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">{c.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{c.content}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No comments yet</p>
                    )}
                  </div>
                  
                  {entry.privacyMode !== "personal" && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddComment}>Add Comment</Button>
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

export default ViewEntry;
