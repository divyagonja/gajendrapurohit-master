import { useState, useRef, useEffect } from "react";
import { SendHorizonal, X, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FloatingControls from "./FloatingControls";

// FAQ data
const faqData = [
  {
    question: "Who can enroll in the (UTKARSH BATCH) RPSC Mathematics course?",
    answer: "This course is designed for aspirants preparing for the RPSC (Rajasthan Public Service Commission) 1st & 2nd grade Mathematics exam, especially those targeting Lecturer or Assistant Professor posts."
  },
  {
    question: "Is this course available online or offline?",
    answer: "Currently, the course is available online through our secure learning portal, allowing you to study at your own pace from anywhere."
  },
  {
    question: "What is the duration of the course?",
    answer: "The course is valid till the RPSC exam date, so you can access all content and support until your exam is over. This ensures you stay prepared right up to the finish line."
  },
  {
    question: "Can I get a refund after purchasing the course?",
    answer: "Unfortunately, we don't offer refunds once the batch is purchased. This is because we've already made significant investments in providing top-quality learning materials, infrastructure, and faculty. We recommend you make a careful decision before proceeding with the purchase."
  },
  {
    question: "Who can I contact for batch-related queries?",
    answer: "For any questions or concerns related to your batch, please reach out to us via call at 9571085397."
  },
  {
    question: "How do I join the live classes after buying the course?",
    answer: "You'll receive notifications about upcoming live classes through your app. You can also access them directly from the \"My Courses\" section."
  }
];

type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
};

type UserInfo = {
  name: string;
  email: string;
  phone: string;
  goal: string;
};

// Update this URL with your correct Google Apps Script deployment URL
// To get this URL:
// 1. Open your Google Apps Script project
// 2. Click Deploy > New deployment 
// 3. Select "Web app" as type
// 4. Set access to "Anyone" or "Anyone, even anonymous"
// 5. Click Deploy and copy the Web App URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwiCLTVHjnsAWnjy1CmRZK6iqNvpGxRT68mFX5T8Vdba72WYSqMF-ayfsPvPhoa7A07Mw/exec";

const ChatbotFAQ = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "", phone: "", goal: "" });
  const [formErrors, setFormErrors] = useState<Partial<UserInfo>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && isRegistered) {
      inputRef.current.focus();
    }
  }, [isOpen, isRegistered]);

  useEffect(() => {
    if (isRegistered && messages.length === 0) {
      setMessages([{
        id: "1",
        type: "bot",
        content: `Hello ${userInfo.name}! I'm Dr. Purohit's assistant. How can I help you today?`
      }]);
    }
  }, [isRegistered, userInfo.name]);

  // Check for stored user info on component load
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("chatUserInfo");
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        // Only restore if the data has the expected structure
        if (parsedInfo.name && parsedInfo.email && parsedInfo.phone !== undefined) {
          setUserInfo(parsedInfo);
          setIsRegistered(true);
        }
      } catch (e) {
        // If parsing fails, remove the invalid data
        localStorage.removeItem("chatUserInfo");
      }
    }
  }, []);

  const validateForm = () => {
    const errors: Partial<UserInfo> = {};
    if (!userInfo.name.trim()) errors.name = "Name is required";
    if (!userInfo.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userInfo.email)) errors.email = "Email is invalid";
    if (!userInfo.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(userInfo.phone.replace(/[^0-9]/g, ""))) errors.phone = "Phone number should be 10 digits";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    // Format data for the Google Sheet
    const formData = new FormData();
    formData.append('name', userInfo.name);
    formData.append('email', userInfo.email);
    formData.append('phone', userInfo.phone);
    formData.append('goal', userInfo.goal);
    formData.append('timestamp', new Date().toISOString());
    
    // POST to Apps Script Web App using no-cors mode
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // Important for cross-origin requests to Google Apps Script
      body: formData
    })
    .then(() => {
      console.log("Form submitted to Google Sheets");
      setIsRegistered(true);
      localStorage.setItem("chatUserInfo", JSON.stringify(userInfo));
    })
    .catch(err => {
      console.error("Submission error:", err);
      // Still allow chat to open even if sheet save fails
      setIsRegistered(true);
      localStorage.setItem("chatUserInfo", JSON.stringify(userInfo));
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), type: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const matches = faqData.filter(faq =>
        faq.question.toLowerCase().includes(userMessage.content.toLowerCase()) ||
        faq.answer.toLowerCase().includes(userMessage.content.toLowerCase())
      );
      const botResponse: Message = matches.length > 0
        ? { id: (Date.now()+1).toString(), type: "bot", content: matches[0].answer }
        : { id: (Date.now()+1).toString(), type: "bot", content: "I'm sorry, I don't have information about that. Please try asking about Dr. Purohit's courses or enrollment." };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => setIsOpen(prev => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof UserInfo]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEndChat = () => {
    // Reset to registration form
    setIsRegistered(false);
    setMessages([]);
    setInputValue("");
    // Clear stored user info and reset form
    localStorage.removeItem("chatUserInfo");
    setUserInfo({ name: "", email: "", phone: "", goal: "" });
    setFormErrors({});
  };

  return (
    <>
      <FloatingControls onOpenChat={toggleChat} isChatOpen={isOpen} />
      <Card className={cn(
        "fixed bottom-20 right-5 w-80 md:w-96 z-50 shadow-xl transition-all duration-300 flex flex-col",
        isOpen ? "h-[450px]" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2"><Bot size={18}/><h3 className="font-medium">FAQ Assistant</h3></div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={16}/>
          </Button>
        </div>
        {!isRegistered ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Get personalized assistance</h3>
            <p className="text-sm text-muted-foreground mb-4">Please provide your information to get started.</p>
            <div className="space-y-4">
              {/** Name **/}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" placeholder="Full Name" value={userInfo.name} onChange={handleInputChange} />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              {/** Email **/}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={userInfo.email} onChange={handleInputChange} />
                {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
              </div>
              {/** Phone **/}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="10-digit number" value={userInfo.phone} onChange={handleInputChange} />
                {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
              </div>
              {/** Goal **/}
              <div className="space-y-2">
                <Label htmlFor="goal">What are you looking for?</Label>
                <Textarea id="goal" name="goal" rows={2} className="resize-none" placeholder="e.g. GATE prep, math help" value={userInfo.goal} onChange={handleInputChange} />
              </div>
              <Button className="w-full" onClick={handleRegister} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Start Chatting"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-muted/30">
              {messages.map(msg => (
                <div key={msg.id} className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  msg.type === 'user' ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" : "bg-card text-card-foreground mr-auto rounded-tl-none"
                )}>
                  <div className="flex items-center gap-2 mb-1 text-xs font-medium">
                    {msg.type === 'user' ? <><User size={12}/><span>You</span></> : <><Bot size={12}/><span>Assistant</span></>}
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-card text-card-foreground mr-auto rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1 text-xs font-medium"><Bot size={12}/><span>Assistant</span></div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="p-3 border-t">
              <div className="flex gap-2 mb-2">
                <Textarea ref={inputRef} rows={1} className="min-h-10 resize-none" placeholder="Ask a question..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}><SendHorizonal size={18}/></Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-1 text-xs"
                onClick={handleEndChat}
              >
                <RefreshCw size={14} /> End Chat & Start New Registration
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default ChatbotFAQ;