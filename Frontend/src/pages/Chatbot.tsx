import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

const Chatbot = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Welcome! I'm your Cultural Guide. Ask me anything about traditions, customs, and cultural practices.",
    },
  ]);

  const [input, setInput] = useState("");

  // Scroll reference
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // const handleSend = () => {
  //   if (!input.trim()) return;

  //   const userMessage = { role: "user", content: input };
  //   const botReply = {
  //     role: "assistant",
  //     content:
  //       "Thank you for your question! This is a mock response. In a real implementation, this would connect to an AI service to provide cultural insights and information.",
  //   };

  //   // Add both messages at once (prevents flicker & async issues)
  //   setMessages((prev) => [...prev, userMessage, botReply]);
  //   setInput("");
  // };

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: "Thinking..." },
  ]);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
      }),
    });

    const data = await response.json();

    const botReply = {
      role: "assistant",
      content: data.reply,
    };

    setMessages((prev) => {
      const withoutThinking = prev.filter(
        (m) => m.content !== "Thinking..."
      );
      return [...withoutThinking, botReply];
    });
  } catch (error) {
    setMessages((prev) => {
      const withoutThinking = prev.filter(
        (m) => m.content !== "Thinking..."
      );
      return [
        ...withoutThinking,
        {
          role: "assistant",
          content: "Backend Error: Could not reach the server.",
        },
      ];
    });
  }
};



  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-2xl font-bold">Cultural Guide</h1>
              <UserNav user={user} />
            </div>
          </header>

          {/* Chat Container */}
          <main className="p-6">
            <Card className="max-w-3xl mx-auto flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <CardTitle>Chat with Cultural Guide</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div
                  ref={chatRef}
                  className="flex-1 overflow-y-auto space-y-4 mb-4 p-2"
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about cultural traditions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chatbot;

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserNav } from "@/components/UserNav";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { MessageSquare } from "lucide-react";

// const Chatbot = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<any>(null);

//   const [messages, setMessages] = useState<
//     Array<{ role: string; content: string }>
//   >([
//     {
//       role: "assistant",
//       content:
//         "Welcome! I'm your Cultural Guide. Ask me anything about traditions, customs, and cultural practices.",
//     },
//   ]);

//   const [input, setInput] = useState("");

//   // Ref for auto-scroll
//   const chatRef = useRef<HTMLDivElement | null>(null);

//   // Load logged-in user
//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser");
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(currentUser));
//   }, [navigate]);

//   // Auto-scroll to bottom whenever messages change
//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Send message function
//   const handleSend = () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", content: input };
//     const botMessage = {
//       role: "assistant",
//       content:
//         "Thank you for your question! This is a mock response. In a real implementation, this would connect to an AI service to provide cultural insights and information.",
//     };

//     // Add both messages at the same time
//     setMessages((prev) => [...prev, userMessage, botMessage]);

//     setInput("");
//   };

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />

//         {/* MAIN CONTENT */}
//         <div className="flex-1 h-full">

//           {/* HEADER */}
//           <header className="border-b bg-card">
//             <div className="flex h-16 items-center px-4 justify-between">
//               <h1 className="text-2xl font-bold">Cultural Guide</h1>
//               <UserNav user={user} />
//             </div>
//           </header>

//           {/* CHAT AREA */}
//           <main className="p-6 h-[calc(100vh-4rem)]">
//             <Card className="max-w-3xl mx-auto flex flex-col h-full">
//               <CardHeader>
//                 <div className="flex items-center gap-2">
//                   <MessageSquare className="h-5 w-5" />
//                   <CardTitle>Chat with Cultural Guide</CardTitle>
//                 </div>
//               </CardHeader>

//               <CardContent className="flex-1 flex flex-col">

//                 {/* MESSAGE LIST */}
//                 <div
//                   ref={chatRef}
//                   className="flex-1 overflow-y-auto space-y-4 p-2"
//                 >
//                   {messages.map((msg, idx) => (
//                     <div
//                       key={idx}
//                       className={`flex ${
//                         msg.role === "user" ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
//                           msg.role === "user"
//                             ? "bg-primary text-primary-foreground"
//                             : "bg-muted"
//                         }`}
//                       >
//                         {msg.content}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* INPUT BAR */}
//                 <div className="flex gap-2 mt-2">
//                   <Input
//                     placeholder="Ask about cultural traditions..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                   />
//                   <Button onClick={handleSend}>Send</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Chatbot;
