import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";

const Games = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Games</h1>
              <UserNav user={user} />
            </div>
          </header>
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-muted-foreground mb-6">
                Enjoy these fun games designed for children to learn about culture and traditions!
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Gamepad2 className="h-8 w-8 text-primary" />
                      <CardTitle>Card Memory Game</CardTitle>
                    </div>
                    <CardDescription>
                      Match pairs of cultural symbols and traditions. Test your memory while learning!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Play Card Game</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Gamepad2 className="h-8 w-8 text-primary" />
                      <CardTitle>Cultural Puzzle</CardTitle>
                    </div>
                    <CardDescription>
                      Put together beautiful puzzles featuring cultural artwork and heritage sites.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Play Puzzle Game</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Games;
