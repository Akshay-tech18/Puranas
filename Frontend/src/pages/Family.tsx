import { useEffect, useState } from "react";
import { UserNav } from "@/components/UserNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/api/axiosInstance";
import CreateFamilyModal from "@/components/family/CreateFamilyModal";
import JoinFamilyModal from "@/components/family/JoinFamilyModal";
import FamilyDetails from "@/components/family/FamilyDetails";
import { useToast } from "@/hooks/use-toast";

const Family = () => {
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState<any>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);

  const fetchFamily = async () => {
    try {
      const { data } = await api.get("/family/me");
      setFamily(data.familyGroup || null);
    } catch (error: any) {
      console.log("No family yet.");
      setFamily(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchFamily();
  }, []);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Family Group</h1>
              <UserNav user={user} />
            </div>
          </header>

          <main className="p-6">
            {loading ? (
              <Card><CardContent className="py-12 text-center">Loading...</CardContent></Card>
            ) : family ? (
              <FamilyDetails family={family} refresh={fetchFamily} />
            ) : (
              <Card>
                <CardHeader><CardTitle>No Family Group</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p>You are not part of any family group yet.</p>
                  <div className="flex gap-3">
                    <Button onClick={() => setOpenCreate(true)}>Create Family</Button>
                    <Button variant="secondary" onClick={() => setOpenJoin(true)}>
                      Join Family
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      <CreateFamilyModal open={openCreate} setOpen={setOpenCreate} onSuccess={fetchFamily} />
      <JoinFamilyModal open={openJoin} setOpen={setOpenJoin} onSuccess={fetchFamily} />
    </SidebarProvider>
  );
};

export default Family;
