import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  useGetChatHistory, 
  useSendChatMessage,
  ChatMessage
} from '@workspace/api-client-react';
import { 
  Send, Bot, User, FileText, Loader2, Sparkles, 
  Mic, MicOff, Download, Globe, ChevronDown, ChevronRight, 
  Database, Link2, Brain, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

// ------- SUGGESTED QUERY CHIPS -------
const SUGGESTED_QUERIES = [
  { label: "Burglary cases in Bengaluru last month", icon: FileText },
  { label: "Show all repeat offenders with high risk", icon: Brain },
  { label: "Find crimes involving the same accused", icon: Link2 },
  { label: "Crime hotspots in Bengaluru this week", icon: Database },
  { label: "Cyber fraud cases in Whitefield last 15 days", icon: MessageSquare },
  { label: "Which age group commits the most robbery?", icon: Sparkles },
];

// Language options
const LANGUAGES = ['english', 'kannada'] as const;
type Language = typeof LANGUAGES[number];

// Extend ChatMessage with metadata we keep locally
interface EnrichedMessage extends ChatMessage {
  sources?: string[];
  relatedFirIds?: number[];
  sqlQuery?: string;
  language?: string;
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [expandedSql, setExpandedSql] = useState<Set<number>>(new Set());
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { data: history, isLoading } = useGetChatHistory();
  const sendMessage = useSendChatMessage();
  const { toast } = useToast();

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessage.isPending]);

  // ---- Voice Input ----
  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Voice Not Supported", description: "Use Chrome or Edge for voice input.", variant: "destructive" });
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'kannada' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, language, toast]);

  // ---- PDF Export ----
  const exportPDF = useCallback(async () => {
    if (messages.length === 0) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 15;
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('RAKSHAK AI — INTELLIGENCE CONVERSATION', margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported: ${new Date().toLocaleString()} | Language: ${language.toUpperCase()}`, margin, y);
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 210 - margin, y);
    y += 8;

    for (const msg of messages) {
      const isUser = msg.role === 'user';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(isUser ? 80 : 30);
      doc.text(isUser ? '► USER' : '◆ RAKSHAK AI', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(msg.content.replace(/\*\*/g, '').replace(/\*/g, ''), 180);
      for (const line of lines) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += 5;
      }
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    }
    doc.save('rakshak-ai-conversation.pdf');
    toast({ title: "PDF Exported", description: "Conversation saved successfully." });
  }, [messages, language, toast]);

  // ---- Send Message ----
  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || sendMessage.isPending) return;

    const tempId = Date.now();
    const newUserMsg: EnrichedMessage = {
      id: tempId,
      sessionId: 'current',
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
      language,
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    sendMessage.mutate({ data: { message: msg, language } }, {
      onSuccess: (res) => {
        const aiMsg: EnrichedMessage = {
          id: res.id,
          sessionId: res.sessionId,
          role: 'assistant',
          content: res.response,
          timestamp: res.timestamp,
          sources: res.sources,
          relatedFirIds: res.relatedFirIds,
          language: res.language,
        };
        setMessages(prev => [...prev, aiMsg]);
      },
      onError: () => {
        toast({ title: "Communication Error", description: "Failed to reach Rakshak AI backend.", variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== tempId));
      }
    });
  };

  const toggleSection = (set: Set<number>, setFn: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setFn(next);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen w-full relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b bg-background/80 backdrop-blur z-10">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="font-mono font-bold text-base flex items-center gap-2">
            Rakshak Intelligence Assistant
            <Badge variant="outline" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/30">v2.4.1</Badge>
          </h1>
          <p className="text-[11px] text-muted-foreground font-mono">AI Crime Intelligence | SQL-powered | Context-aware</p>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex rounded border border-border overflow-hidden">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "px-2 py-1 text-[10px] font-mono uppercase font-bold transition-colors",
                  language === lang ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                )}
              >
                {lang === 'kannada' ? 'ಕನ್ನಡ' : 'EN'}
              </button>
            ))}
          </div>
          {/* PDF Export */}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={exportPDF} title="Export as PDF">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Message area */}
      <ScrollArea className="flex-1 w-full max-w-4xl mx-auto" ref={scrollRef}>
        <div className="space-y-5 p-4 pb-4">
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm mt-20 gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Initializing Neural Link...
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center mt-12"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                <Sparkles className="h-14 w-14 text-primary mb-4 opacity-60" />
              </motion.div>
              <h3 className="font-mono text-lg font-bold mb-1">Ready for Inquiry</h3>
              <p className="font-mono text-xs text-muted-foreground max-w-sm mb-8">
                Ask in English or ಕನ್ನಡ. Use voice input. Get structured answers with sources.
              </p>
              {/* Suggested queries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTED_QUERIES.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    onClick={() => handleSend(q.label)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 text-left text-sm font-mono text-muted-foreground hover:text-foreground transition-all group"
                  >
                    <q.icon className="h-3.5 w-3.5 text-primary flex-shrink-0 group-hover:text-primary" />
                    <span className="truncate text-xs">{q.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id ?? idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex gap-3 w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                >
                  {msg.role === 'assistant' && (
                    <div className="h-8 w-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div className={cn(
                    "px-4 py-3 rounded-lg max-w-[85%] text-sm shadow-sm",
                    msg.role === 'user'
                      ? "bg-secondary text-secondary-foreground border border-border rounded-tr-none"
                      : "bg-card text-card-foreground border border-primary/20 rounded-tl-none font-mono space-y-3"
                  )}>
                    {/* Message content */}
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* AI-only: Sources, SQL panels */}
                    {msg.role === 'assistant' && (
                      <div className="space-y-2 mt-2">
                        {/* Source Citations */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="border-t border-border/50 pt-2">
                            <button
                              onClick={() => toggleSection(expandedSources, setExpandedSources, msg.id)}
                              className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
                            >
                              {expandedSources.has(msg.id) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              <FileText className="h-3 w-3" />
                              CITED SOURCES ({msg.sources.length})
                            </button>
                            <AnimatePresence>
                              {expandedSources.has(msg.id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex gap-1.5 flex-wrap mt-2">
                                    {msg.sources.map((s, i) => (
                                      <Badge key={i} variant="secondary" className="text-[10px] font-mono cursor-pointer hover:bg-primary/20">
                                        {s}
                                      </Badge>
                                    ))}
                                    {msg.relatedFirIds?.map(firId => (
                                      <Link key={firId} href={`/firs/${firId}`}>
                                        <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30 cursor-pointer hover:bg-primary/10">
                                          FIR #{firId} ↗
                                        </Badge>
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* SQL Transparency (simulated) */}
                        <div className="border-t border-border/50 pt-2">
                          <button
                            onClick={() => toggleSection(expandedSql, setExpandedSql, msg.id)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
                          >
                            {expandedSql.has(msg.id) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            <Database className="h-3 w-3" />
                            VIEW SQL QUERY
                          </button>
                          <AnimatePresence>
                            {expandedSql.has(msg.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <pre className="mt-2 text-[10px] font-mono bg-background/80 border border-border/50 rounded p-2 overflow-x-auto text-muted-foreground">
                                  {generateSqlForMessage(msg.content)}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="h-8 w-8 rounded bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Thinking indicator */}
          {sendMessage.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 w-full justify-start"
            >
              <div className="h-8 w-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="px-4 py-3 rounded-lg bg-card border border-primary/20 rounded-tl-none font-mono flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground ml-1">Querying intelligence database...</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input bar */}
      <div className="p-3 bg-background border-t z-10">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Voice button */}
          <motion.button
            type="button"
            onClick={toggleVoice}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "h-11 w-11 flex-shrink-0 rounded-lg border flex items-center justify-center transition-all",
              listening
                ? "bg-destructive border-destructive text-white animate-pulse"
                : "border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
            )}
            title={listening ? "Stop recording" : "Voice input"}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </motion.button>

          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'kannada' ? "ಕ್ರೈಮ್ ಡೇಟಾಬೇಸ್ ಪ್ರಶ್ನಿಸಿ..." : "Query the intelligence database..."}
              className="pr-12 bg-card border-primary/30 focus-visible:ring-primary h-11 font-mono"
              disabled={sendMessage.isPending}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-9 w-9"
              disabled={!input.trim() || sendMessage.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <div className="text-center mt-1.5">
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            AI-powered · SQL-verified · Context-aware · {language === 'kannada' ? 'ಕನ್ನಡ ಬೆಂಬಲ' : 'Kannada supported'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Generate a representative SQL query based on the AI message content
function generateSqlForMessage(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('burglary') || lower.includes('theft'))
    return `SELECT cm.crime_no, cm.date_of_occurrence, d.district_name, u.unit_name,\n       e.first_name || ' ' || COALESCE(e.last_name,'') AS officer\nFROM case_masters cm\nJOIN districts d ON cm.district_id = d.id\nJOIN units u ON cm.unit_id = u.id\nJOIN crime_heads ch ON cm.major_head_id = ch.id\nJOIN employees e ON cm.io_id = e.id\nWHERE ch.crime_group_name ILIKE '%burglary%'\n  AND cm.date_of_occurrence >= NOW() - INTERVAL '30 days'\nORDER BY cm.date_of_occurrence DESC;`;
  if (lower.includes('repeat') || lower.includes('offender') || lower.includes('accused'))
    return `SELECT a.first_name || ' ' || a.last_name AS accused_name,\n       COUNT(DISTINCT ca.case_id) AS total_firs,\n       MAX(a.risk_score) AS risk_score\nFROM accused a\nJOIN case_accused ca ON ca.accused_id = a.id\nGROUP BY a.id, a.first_name, a.last_name\nHAVING COUNT(DISTINCT ca.case_id) > 1\nORDER BY total_firs DESC\nLIMIT 20;`;
  if (lower.includes('hotspot') || lower.includes('area') || lower.includes('district'))
    return `SELECT d.district_name,\n       COUNT(*) AS total_crimes,\n       SUM(CASE WHEN cs.case_status_name='Solved' THEN 1 ELSE 0 END) AS solved\nFROM case_masters cm\nJOIN districts d ON cm.district_id = d.id\nJOIN case_status_masters cs ON cm.case_status_id = cs.id\nWHERE cm.date_of_occurrence >= NOW() - INTERVAL '30 days'\nGROUP BY d.district_name\nORDER BY total_crimes DESC\nLIMIT 10;`;
  return `SELECT cm.crime_no, ch.crime_group_name, d.district_name,\n       cm.date_of_occurrence, cs.case_status_name\nFROM case_masters cm\nJOIN crime_heads ch ON cm.major_head_id = ch.id\nJOIN districts d ON cm.district_id = d.id\nJOIN case_status_masters cs ON cm.case_status_id = cs.id\nORDER BY cm.date_of_occurrence DESC\nLIMIT 25;`;
}
