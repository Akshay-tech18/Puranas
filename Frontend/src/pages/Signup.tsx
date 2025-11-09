import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [culturalInterest, setCulturalInterest] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [familyOption, setFamilyOption] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.some((u: any) => u.email === email)) {
      toast({ 
        title: "Email already exists", 
        description: "Please use a different email.",
        variant: "destructive" 
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      culturalInterest,
      religion,
      caste,
      familyOption,
      familyCode: familyOption === "join" ? familyCode : Date.now().toString().slice(-6),
      profilePicture: ""
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    toast({ title: "Account created!", description: "Welcome to your cultural diary." });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join our cultural community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cultural">Cultural Interests</Label>
              <Input id="cultural" value={culturalInterest} onChange={(e) => setCulturalInterest(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input id="religion" value={religion} onChange={(e) => setReligion(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caste">Caste (Optional)</Label>
              <Input id="caste" value={caste} onChange={(e) => setCaste(e.target.value)} />
              <p className="text-xs text-muted-foreground">This field is optional</p>
            </div>
            <div className="space-y-2">
              <Label>Family Group</Label>
              <Select value={familyOption} onValueChange={setFamilyOption} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Create New Family</SelectItem>
                  <SelectItem value="join">Join via Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {familyOption === "join" && (
              <div className="space-y-2">
                <Label htmlFor="code">Family Code</Label>
                <Input id="code" value={familyCode} onChange={(e) => setFamilyCode(e.target.value)} required />
              </div>
            )}
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
