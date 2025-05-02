import { useState, useRef, useEffect } from "react";
import { SendHorizonal, X, Bot, User } from "lucide-react";
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
    question: "What courses does Dr. Gajendra Purohit offer?",
    answer: "Dr. Gajendra Purohit offers courses in Mathematics for various competitive exams including GATE, IIT JAM, CSIR NET, and other engineering entrance examinations. His courses cover topics like Linear Algebra, Calculus, Differential Equations, and more."
  },
  {
    question: "How can I enroll in Dr. Purohit's courses?",
    answer: "You can enroll in Dr. Purohit's courses through his YouTube channels or by visiting his official website. Many courses are available for free on YouTube, while premium courses with additional materials are available through his official platforms."
  },
  {
    question: "Are there any free resources available?",
    answer: "Yes, Dr. Purohit provides many free educational resources on his YouTube channels. There are thousands of videos covering various mathematical topics, problem-solving techniques, and exam preparation strategies."
  },
  {
    question: "How can I contact Dr. Purohit for doubts?",
    answer: "You can reach out to Dr. Purohit through the contact form on this website, or through his social media channels. For enrolled students, there are dedicated doubt-clearing sessions and forums."
  },
  {
    question: "Which exams do these courses help prepare for?",
    answer: "The courses are designed to help students prepare for GATE (Graduate Aptitude Test in Engineering), IIT JAM (Joint Admission Test for M.Sc.), CSIR NET (Council of Scientific & Industrial Research National Eligibility Test), as well as various engineering entrance exams and college mathematics courses."
  },
  {
    question: "What is Dr. Purohit's teaching experience?",
    answer: "Dr. Gajendra Purohit is a highly experienced mathematics educator with over a decade of teaching experience. He has helped thousands of students achieve success in various competitive exams and has earned recognition for his clear and effective teaching methodologies."
  }
];

// Helper function to find matching FAQs based on user query
function findMatchingAnswers(query: string) {
  const lowercasedQuery = query.toLowerCase();
  
  return faqData.filter(faq => 
    faq.question.toLowerCase().includes(lowercasedQuery) || 
    faq.answer.toLowerCase().includes(lowercasedQuery)
  );
}

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

const ChatbotFAQ = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    goal: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<UserInfo>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && isRegistered) {
      inputRef.current.focus();
    }
  }, [isOpen, isRegistered]);

  useEffect(() => {
    // Start the conversation once registered
    if (isRegistered && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: `Hello ${userInfo.name}! I'm Dr. Purohit's assistant. How can I help you today?`
      }]);
    }
  }, [isRegistered, userInfo.name]);

  const validateForm = () => {
    const errors: Partial<UserInfo> = {};
    
    if (!userInfo.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!userInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!userInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(userInfo.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = "Phone number should be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      // Here you would typically send this data to your backend/API
      console.log("User registered:", userInfo);
      setIsRegistered(true);
      
      // You can store this in localStorage if you want to persist between sessions
      localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for bot
    setTimeout(() => {
      const matches = findMatchingAnswers(userMessage.content);
      
      let botResponse: Message;
      
      if (matches.length > 0) {
        // Use the best match
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: matches[0].answer
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I don't have information about that. Please try asking about Dr. Purohit's courses, teaching experience, or how to enroll in his programs."
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if user is typing
    if (formErrors[name as keyof UserInfo]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <>
      <FloatingControls onOpenChat={toggleChat} isChatOpen={isOpen} />

      {/* Chat window */}
      <Card className={cn(
        "fixed bottom-20 right-5 w-80 md:w-96 z-50 shadow-xl transition-all duration-300 flex flex-col",
        isOpen ? "h-[450px]" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Chat header */}
        <div className="bg-primary text-primary-foreground p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} />
            <h3 className="font-medium">FAQ Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 rounded-full text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
            onClick={() => setIsOpen(false)}
          >
            <X size={16} />
          </Button>
        </div>

        {!isRegistered ? (
          /* Registration form */
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Get personalized assistance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide your information to get started with our assistant. We'll use this information to provide you with better help.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Full Name" 
                  value={userInfo.name}
                  onChange={handleInputChange}
                />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="10-digit phone number" 
                  value={userInfo.phone}
                  onChange={handleInputChange}
                />
                {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">What are you looking for?</Label>
                <Textarea 
                  id="goal" 
                  name="goal" 
                  placeholder="e.g., GATE preparation, mathematics help, etc." 
                  value={userInfo.goal}
                  onChange={handleInputChange}
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleRegister}
              >
                Start Chatting
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-muted/30">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.type === 'user' 
                      ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" 
                      : "bg-card text-card-foreground mr-auto rounded-tl-none"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs font-medium">
                    {message.type === 'user' ? (
                      <>
                        <User size={12} />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Bot size={12} />
                        <span>Assistant</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-card text-card-foreground mr-auto rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1 text-xs font-medium">
                    <Bot size={12} />
                    <span>Assistant</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input area */}
            <div className="p-3 border-t flex gap-2">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="min-h-10 resize-none"
                rows={1}
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <SendHorizonal size={18} />
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default ChatbotFAQ; 