'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Bot,
  User,
  Loader2,
  Plus,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chat } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Types from the old Chatbot.tsx
type Message = {
  role: 'user' | 'model';
  content: string;
};

// Social links data
const socialLinks = [
  {
    name: 'Instagram',
    icon: <Instagram className="h-7 w-7" />,
    href: 'https://www.instagram.com/aymanfuniture?igsh=MWJ1dDNmZHI5ZXMydQ==',
    bgColor: 'bg-card hover:bg-muted border',
    iconColor: 'text-card-foreground',
  },
  {
    name: 'WhatsApp',
    icon: <MessageCircle className="h-7 w-7" />,
    href: 'https://wa.me/255657687266?text=Hello%20Sheby%20One%20Furniture!%20I\'m%20interested%20in%20your%20products.',
    bgColor: 'bg-[#25D366] hover:bg-[#25D366]/90',
    iconColor: 'text-white',
  },
];

// The new unified component
export function FloatingActionMenu() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  // Chatbot logic from the old Chatbot.tsx
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content:
            "Karibu! I'm the Sheby One Furniture assistant. How can I help you find the perfect furniture today?",
        },
      ]);
    }
  }, [isChatOpen, messages.length]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    startTransition(async () => {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      try {
        const aiResponse = await chat({
          history: history,
          message: input,
        });
        const modelMessage: Message = { role: 'model', content: aiResponse };
        setMessages((prev) => [...prev, modelMessage]);
      } catch (error) {
        console.error('Chatbot error:', error);
        const errorMessage: Message = {
          role: 'model',
          content:
            "I'm sorry, I'm having a little trouble right now. Please try again in a moment.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };
  // End of chatbot logic

  return (
    <>
      <Sheet open={isChatOpen} onOpenChange={setChatOpen}>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
          {/* Expanding buttons */}
          <div
            className={cn(
              'flex flex-col items-center gap-3 transition-all duration-300 ease-in-out',
              isMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            )}
          >
            {/* Chatbot trigger */}
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="h-14 w-14 rounded-full shadow-lg bg-card text-card-foreground hover:bg-muted border"
                aria-label="Open Chat"
              >
                <Bot className="h-7 w-7" />
              </Button>
            </SheetTrigger>

            {/* Social Links */}
            {socialLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  className={cn(
                    'h-14 w-14 rounded-full shadow-lg',
                    link.bgColor,
                    link.iconColor
                  )}
                  aria-label={link.name}
                >
                  {link.icon}
                </Button>
              </Link>
            ))}
          </div>

          {/* Main Toggle Button */}
          <Button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            aria-expanded={isMenuOpen}
          >
            <Plus
              className={cn(
                'h-8 w-8 transition-transform duration-300',
                isMenuOpen && 'rotate-45'
              )}
            />
          </Button>
        </div>

        {/* Chatbot Sheet Content */}
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="font-headline text-2xl flex items-center gap-2">
              <Bot className="h-6 w-6" /> AI Assistant
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs lg:max-w-md rounded-lg px-4 py-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-xs lg:max-w-md rounded-lg px-4 py-3 text-sm bg-card border flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter className="p-6 pt-4 bg-background border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about furniture..."
                disabled={isPending}
              />
              <Button onClick={handleSend} disabled={isPending}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
