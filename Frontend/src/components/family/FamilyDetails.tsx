import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/api/axiosInstance";
import { useToast } from "@/hooks/use-toast";

const FamilyDetails = ({ family, refresh }: any) => {
  const { toast } = useToast();

  const removeMember = async (userId: string) => {
    try {
      await api.delete(`/family/${family._id}/member/${userId}`);
      toast({ title: "Member removed!" });
      refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  const leaveFamily = async () => {
    await api.delete(`/family/${family._id}/leave`);
    toast({ title: "You left the family." });
    refresh();
  };

  const deleteFamily = async () => {
    await api.delete(`/family/${family._id}`);
    toast({ title: "Family deleted." });
    refresh();
  };

  const isCreator = family.creatorId === family.currentUser;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{family.name}</CardTitle>
        <p>Invite Code: {family.inviteCode}</p>
      </CardHeader>

      <CardContent>
        <h3 className="font-semibold">Members:</h3>
        <ul className="mt-2 space-y-1">
          {family.members.map((m: any) => (
            <li key={m._id} className="flex justify-between">
              {m.name}

              {isCreator && m._id !== family.creatorId && (
                <Button size="sm" variant="destructive" onClick={() => removeMember(m._id)}>
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>

        <div className="flex gap-3 mt-6">
          {!isCreator && (
            <Button variant="destructive" onClick={leaveFamily}>Leave Family</Button>
          )}

          {isCreator && (
            <Button variant="destructive" onClick={deleteFamily}>Delete Family</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyDetails;
