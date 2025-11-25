import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/api/axiosInstance";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const JoinFamilyModal = ({ open, setOpen, onSuccess }: any) => {
  const [code, setCode] = useState("");
  const { toast } = useToast();

  const join = async () => {
    try {
      await api.post("/family/join", { inviteCode: code });
      toast({ title: "Joined family!" });
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Join Family</DialogTitle></DialogHeader>

        <Input placeholder="Enter Invite Code" value={code} onChange={(e) => setCode(e.target.value)} />

        <Button onClick={join} className="w-full mt-3">Join</Button>
      </DialogContent>
    </Dialog>
  );
};

export default JoinFamilyModal;
