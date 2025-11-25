import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/api/axiosInstance";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CreateFamilyModal = ({ open, setOpen, onSuccess }: any) => {
  const [name, setName] = useState("");
  const { toast } = useToast();

  const create = async () => {
    try {
      const { data } = await api.post("/family/create", { name });
      toast({ title: "Family created!" });
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Family</DialogTitle>
        </DialogHeader>

        <Input placeholder="Family Name" value={name} onChange={(e) => setName(e.target.value)} />

        <Button onClick={create} className="w-full mt-3">Create</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyModal;
