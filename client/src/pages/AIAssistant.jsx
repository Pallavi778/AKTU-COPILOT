import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  Send,
  Sparkles,
  User,
  Brain,
  HelpCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Plus
} from 'lucide-react';

const AIAssistant = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: `Welcome to **AKTU Academic Copilot**! Select a subject from the selector above to get contextual exam guides, summary definitions, or coding algorithms. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock conversation history listing
  const [historySessions, setHistorySessions] = useState([
    { id: 1, title: 'Data Structures Trees Summary', subject: 'KCS301' },
    { id: 2, title: 'CPU Scheduling Numerical', subject: 'KCS401' },
    { id: 3, title: 'AKTU Passing & Grace Rules', subject: 'General' },
  ]);

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await API.get(`/subjects?branch=${user?.branch || ''}&semester=${user?.semester || ''}`);
        if (data.success) {
          setSubjects(data.data);
          if (data.data.length > 0) {
            setSelectedSubject(data.data[0].code);
          }
        }
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    };
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: msg,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTyping(true);

    try {
      const { data } = await API.post('/ai/chat', {
        message: msg,
        subjectCode: selectedSubject !== 'All' ? selectedSubject : null,
      });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'copilot',
            text: data.data.response,
            timestamp: new Date(data.data.timestamp),
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: `I'm sorry, I encountered a connection issue. Please make sure the server is active and try again.`,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        sender: 'copilot',
        text: `New conversation started. Select a subject code or type a query below!`,
        timestamp: new Date()
      }
    ]);
  };

  const presetChips = [
    { label: 'Exam Pattern Guidelines', query: 'What is the AKTU semester exam Section C pattern?' },
    { label: 'Grace Marks Rules', query: 'What is the grace marks rule for AKTU?' },
    { label: 'Bankers Algorithm Tracing', query: 'Explain the safety state in Bankers Algorithm.' },
    { label: 'Recursive Tree traversals', query: 'Show recursive implementations of Preorder, Inorder, and Postorder Traversals.' },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 animate-fade-in">
      {/* LEFT DRAWER - CHAT HISTORY SIDE PANEL */}
      <aside className="w-80 hidden md:flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex-shrink-0">
        <button
          onClick={startNewChat}
          className="w-full glass-button-primary flex items-center justify-center space-x-2 text-xs py-3.5 mb-5"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-400">Recent Chats</span>
          </div>

          <div className="space-y-1">
            {historySessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSubject(session.subject);
                  setMessages([
                    {
                      sender: 'copilot',
                      text: `Pulled context from: **${session.title}** (${session.subject}). Type any query or question related to it.`,
                      timestamp: new Date()
                    }
                  ]);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800/60 transition-colors flex items-start space-x-3 group text-xs text-slate-300 font-medium cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-slate-600 mt-0.5 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                <div className="min-w-0 flex-1">
                  <p className="truncate group-hover:text-slate-100">{session.title}</p>
                  <span className="text-[10px] text-primary-400 font-bold mt-1 inline-block uppercase bg-primary-500/10 border border-primary-500/20 px-1 py-0.2 rounded">
                    {session.subject}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200">Academic Copilot Chat</h2>
              <span className="text-[10px] text-slate-500 font-semibold">LOCAL MOCK ASSISTANT</span>
            </div>
          </div>

          {/* Subject Dropdown Context */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Subject Focus:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="All">All / General</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message Bubble Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
          {messages.map((msg, index) => {
            const isCopilot = msg.sender === 'copilot';
            return (
              <div key={index} className={`flex items-start space-x-3 ${!isCopilot ? 'justify-end' : ''}`}>
                {isCopilot && (
                  <div className="w-8 h-8 rounded-full bg-primary-950/80 border border-primary-800 flex items-center justify-center flex-shrink-0 text-primary-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-4 text-sm font-sans ${
                    isCopilot
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md leading-relaxed'
                      : 'bg-primary-600 text-white shadow-lg shadow-primary-950/20'
                  }`}
                >
                  {/* Simplistic renderer for markdown boldness, code highlights */}
                  <p className="whitespace-pre-line">
                    {msg.text.split('\n').map((line, lIdx) => {
                      // Handle formatting tags
                      let processed = line;
                      // Replace bold formatting (**text**)
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      const matches = [...processed.matchAll(boldRegex)];
                      
                      if (matches.length > 0) {
                        return (
                          <span key={lIdx} className="block mt-1">
                            {processed.split('**').map((part, pIdx) => {
                              return pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-bold">{part}</strong> : part;
                            })}
                          </span>
                        );
                      }
                      return <span key={lIdx} className="block">{line}</span>;
                    })}
                  </p>
                  <span className={`text-[9px] block mt-2 ${isCopilot ? 'text-slate-500' : 'text-primary-200'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {!isCopilot && (
                  <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-850 flex items-center justify-center flex-shrink-0 text-indigo-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {typing && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-950/80 border border-primary-850 flex items-center justify-center flex-shrink-0 text-primary-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex space-x-1.5 items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-typing"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-typing [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-typing [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        {messages.length === 1 && (
          <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-850">
            <span className="text-[10px] font-bold text-slate-500 flex items-center mb-2 uppercase">
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              <span>Suggested Academic Queries</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {presetChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/35 transition-all"
              placeholder="Ask Copilot a question (e.g. explain dynamic programming in details)..."
              disabled={typing}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || typing}
              className="p-3 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-500 hover:to-indigo-550 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-40 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
