import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/organisms/NavBar';
import { sendMessageToBot } from '../../api/chatbotApi';


export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Namaste! I am the Bhopal Smart City AI Assistant. I can help you with real-time city data, grievance tracking, and emergency information.\n\nHow can I assist you today?',
      showButtons: true,
    },
    {
      id: 2,
      type: 'user',
      content: 'Is there heavy traffic near MP Nagar right now?',
    },
    {
      id: 3,
      type: 'ai',
      content: 'Analyzing real-time sensor data from MP Nagar Zone...',
      showAlert: true,
      alertType: 'warning',
      alertTitle: 'Traffic Alert: High Congestion',
      alertMessage: 'Heavy traffic reported near Jyoti Talkies intersection. Estimated delay: 12 minutes.',
      timestamp: 'Data updated 45 seconds ago.',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [selectedFile, setSelectedFile] = useState(null);
  const messageAreaRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };




const handleSend = async () => {
  if (!inputValue.trim()) return;

  const userText = inputValue;

  setMessages((prev) => [
  ...prev,
  {
    id: Date.now(),
    type: 'user',
    content: userText,
    file: selectedFile?.name || null,
  },
]);
  

  setInputValue('');
  setSelectedFile(null);

  // Start loading BEFORE API call
  setIsLoading(true);

  try {
    const result = await sendMessageToBot(
  language === 'hi'
    ? `Please answer in Hindi: ${userText}`
    : userText
);

    if (result.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: result.response,
        },
      ]);
    }
  } catch (error) {
    console.error('Chatbot Error:', error);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        type: 'ai',
        content:
          'Sorry, I am unable to connect to the GenWin AI service right now.',
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
const handleSuggestedQuestion = async (question) => {
  // Add user message
  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      type: 'user',
      content: question,
    },
  ]);

  setIsLoading(true);

  try {
    const result = await sendMessageToBot(
      language === 'hi'
        ? `Please answer in Hindi: ${question}`
        : question
    );

    if (result.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: result.response,
        },
      ]);
    }
  } catch (error) {
    console.error('Chatbot Error:', error);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        type: 'ai',
        content:
          language === 'hi'
            ? 'क्षमा करें, मैं इस समय GenWin AI सेवा से कनेक्ट नहीं कर पा रहा हूँ।'
            : 'Sorry, I am unable to connect to the GenWin AI service right now.',
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

const handleClearChat = () => {
  setMessages([
    {
      id: 1,
      type: 'ai',
      content:
        'Namaste! I am the Bhopal Smart City AI Assistant. I can help you with real-time city data, grievance tracking, and emergency information.\n\nHow can I assist you today?',
      showButtons: true,
    },
  ]);
};

const handleExportLogs = () => {
  const chatText = messages
    .map(
      (msg) =>
        `${msg.type === 'user' ? 'User' : 'GenWin'}: ${msg.content}`
    )
    .join('\n\n');

  const blob = new Blob([chatText], {
    type: 'text/plain',
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `genwin-chat-${new Date()
    .toISOString()
    .slice(0, 10)}.txt`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
const handleLanguageToggle = () => {
  setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      type: 'ai',
      content:
        language === 'en'
          ? 'भाषा हिन्दी में बदल दी गई है। अब मैं हिन्दी में उत्तर दूंगा।'
          : 'Language switched to English. I will now respond in English.',
    },
  ]);
};
const handleVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Speech Recognition is not supported in this browser');
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  recognition.interimResults = false;

  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    setInputValue(transcript);
    setIsListening(false);
  };

  recognition.onerror = () => {
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };
};
const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  setSelectedFile(file);
};

  return (
    <div className="flex flex-col h-screen font-['Hanken_Grotesk'] text-body-lg bg-[#191d18]">
      {/* Top Navigation */}
      {/* <header className="bg-surface/70 dark:bg-surface-container-highest/70 backdrop-blur-xl border-b border-outline-variant/30 dark:border-outline/20 shadow-sm sticky top-0 z-50 h-16 w-full">
        <div className="flex justify-between items-center px-16 w-full max-w-full mx-auto h-full">
          <div className="flex items-center gap-3">
            <span className="font-headline-lg text-headline-lg font-bold text-[#00450d] dark:text-inverse-primary">
              Bhopal Twin
            </span>
            <div className="h-6 w-[1px] bg-outline-variant/50 ml-4 hidden md:block"></div>
            <nav className="hidden md:flex gap-6 ml-4">
              <a className="text-on-surface-variant dark:text-surface-variant hover:text-[#00450d] transition-colors font-label-data text-label-data" href="#">
                Home
              </a>
              <a className="text-on-surface-variant dark:text-surface-variant hover:text-[#00450d] transition-colors font-label-data text-label-data" href="#">
                Map
              </a>
              <a className="text-on-surface-variant dark:text-surface-variant hover:text-[#00450d] transition-colors font-label-data text-label-data" href="#">
                Traffic
              </a>
              <a className="text-on-surface-variant dark:text-surface-variant hover:text-[#00450d] transition-colors font-label-data text-label-data" href="#">
                Alerts
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined text-[#00450d] dark:text-inverse-primary p-2 hover:bg-surface-variant/50 rounded-full transition-colors">
              language
            </button>
            <button className="material-symbols-outlined text-[#00450d] dark:text-inverse-primary p-2 hover:bg-surface-variant/50 rounded-full transition-colors">
              notifications
            </button>
            <button className="bg-[#00450d] text-white px-6 py-2 rounded-full font-label-data text-label-data hover:opacity-90 transition-transform active:scale-95">
              Login
            </button>
          </div>
        </div>
      </header> */}
      <Navbar />    

      <main className="flex-1 flex overflow-hidden relative">
        <button
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  className="hidden lg:flex absolute left-2 top-4 z-50 bg-[#00450d] text-white p-2 rounded-lg shadow-lg hover:bg-[#006b14] transition-all"
>
     <span className="material-symbols-outlined">
         {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
        </span>
        </button>
        {/* Left Sidebar - City Status */}
         <aside
  className={`hidden lg:flex flex-col bg-[rgba(0,69,13,0.1)] backdrop-blur-[12px]
  border-r border-[rgba(145,215,138,0.2)] z-10 overflow-hidden
  transition-all duration-500 ease-in-out
  ${isSidebarOpen ? 'w-80' : 'w-16'}`}
>
     <div
  className={`p-6 flex flex-col h-full  ${
    isSidebarOpen
      ? 'opacity-100'
      : 'opacity-0 pointer-events-none'
  }`}
>
            <div className="flex items-center justify-between mb-6 -mt-2">
  <div className="flex items-center gap-3 ml-8">
    {isSidebarOpen && (
      <h2 className="font-title-md text-title-md text-surface-variant">
        City Status
      </h2>
    )}
  </div>

  {isSidebarOpen && (
    <span className="material-symbols-outlined text-[#00450d]">
      monitoring
    </span>
  )}
</div>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {/* Water Supply Widget */}
              <div className="p-3 bg-surface-container-highest/10 rounded-xl border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#00450d] text-sm">water_drop</span>
                  <span className="font-label-data text-label-data text-surface-variant text-xs uppercase tracking-wide">WATER SUPPLY</span>
                </div>
                <p className="text-body-sm font-medium">Bhopal Lake Levels: Normal</p>
                <div className="w-full bg-outline-variant/20 h-1.5 rounded-full mt-2">
                  <div className="bg-[#00450d] h-full w-[72%] rounded-full shadow-[0_0_8px_rgba(145,215,138,0.5)]"></div>
                </div>
              </div>

              {/* Traffic Density Widget */}
              <div className="p-3 bg-surface-container-highest/10 rounded-xl border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-error text-sm">traffic</span>
                  <span className="font-label-data text-label-data text-surface-variant text-xs uppercase tracking-wide">TRAFFIC DENSITY</span>
                </div>
                <p className="text-body-sm font-medium">MP Nagar: Heavy Congestion</p>
                <div className="flex gap-1 mt-2">
                  <div className="h-1 flex-1 bg-[#00450d] opacity-30"></div>
                  <div className="h-1 flex-1 bg-[#00450d] opacity-30"></div>
                  <div className="h-1 flex-1 bg-error"></div>
                </div>
              </div>

              {/* Chat History */}
              <div className="mt-6 border-t border-outline-variant/20 pt-6">
                <h3 className="font-label-data text-label-data text-surface-variant mb-3 uppercase tracking-widest text-xs">Recent Sessions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 px-3 hover:bg-[#91d78a]/20 rounded-lg text-body-sm transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100">history</span>
                    Water billing query...
                  </button>
                  <button className="w-full text-left p-2 px-3 hover:bg-[#91d78a]/20 rounded-lg text-body-sm transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100">history</span>
                    Road repair status
                  </button>
                </div>
              </div>
            </div>

            <button
  onClick={handleLanguageToggle}
  className="w-full flex items-center justify-center gap-3 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 py-3 rounded-xl border border-outline-variant/20 transition-all font-label-data text-label-data text-[#00450d] mt-auto text-xs uppercase tracking-wide text-surface-variant"
>
  <span className="material-symbols-outlined">translate</span>

  {language === 'en'
    ? 'Switch to Hindi (हिन्दी)'
    : 'Switch to English'}
</button>
          </div>
        </aside>

        {/* Center Chat Area */}
        <section className="flex-1 flex flex-col relative z-10 h-full">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#91d78a]/10 flex items-center justify-center border border-[#00450d]/30">
                <span className="material-symbols-outlined text-[#00450d]">smart_toy</span>
              </div>
              <div>
                <h1 className="font-title-md text-title-md leading-tight">Bhopal Twin Assistant</h1>
                <p className="text-xs font-label-data text-[#00450d] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00450d] animate-pulse"></span> SYSTEM ONLINE
                </p>
              </div>
            </div>
            <button className="material-symbols-outlined text-surface-variant">more_vert</button>
          </div>

          {/* Messages Area */}
          <div
            ref={messageAreaRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                  {/* Avatar and name */}
                  <div className={`flex items-center gap-2 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.type === 'ai' ? (
                      <div className="w-6 h-6 rounded-full bg-[#91d78a]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-[#00450d]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          smart_toy
                        </span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-secondary-container/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-secondary-fixed">person</span>
                      </div>
                    )}
                        <span className="font-label-data text-label-data text-surface-variant text-xs">
                      {message.type === 'ai' ? 'Bhopal Twin Assistant' : 'You'}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl shadow-lg ${
                      message.type === 'ai'
                        ? 'bg-[rgba(0,69,13,0.4)] border-l-3 border-[#acf4a4] rounded-tl-none'
                        : 'bg-[rgba(75,101,71,0.2)] border-r-3 border-[#717a6d] rounded-tr-none'
                    }`}
                  >
                    <p className="font-body-lg text-body-lg text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.file && (
  <div className="mt-2 flex items-center gap-2 text-sm text-[#91d78a]">
    <span className="material-symbols-outlined text-sm">
      attach_file
    </span>

    <span>{message.file}</span>
  </div>
)}
                    {/* Alert if present */}
                    {message.showAlert && (
                      <div className="p-3 bg-error/10 border border-error/30 rounded-lg mt-3 flex items-start gap-3">
                        <span className="material-symbols-outlined text-error text-sm flex-shrink-0">warning</span>
                        <div>
                          <p className="text-error font-semibold text-body-sm">{message.alertTitle}</p>
                          <p className="text-white text-body-sm opacity-80">{message.alertMessage}</p>
                        </div>
                      </div>
                    )}

                    {message.timestamp && (
                      <p className="text-body-sm italic opacity-60 mt-2">{message.timestamp}</p>
                    )}

                    {/* Suggested Buttons */}
                    {message.showButtons && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSuggestedQuestion('Find Emergency Contacts')}
                          className="bg-surface-container-highest/20 hover:bg-[#91d78a]/40 border border-outline-variant/30 px-3 py-1.5 rounded-full text-body-sm transition-all font-medium text-xs"
                        >
                          Find Emergency Contacts
                        </button>
                        <button
                          onClick={() => handleSuggestedQuestion('Check Complaint Status')}
                          className="bg-surface-container-highest/20 hover:bg-[#91d78a]/40 border border-outline-variant/30 px-3 py-1.5 rounded-full text-body-sm transition-all font-medium text-xs"
                        >
                          Check Complaint Status
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
   {isLoading && (
  <div className="flex justify-start">
    <div className="bg-[rgba(0,69,13,0.4)] p-4 rounded-xl text-white">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce"></div>
        <div
          className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
          style={{ animationDelay: '0.15s' }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
          style={{ animationDelay: '0.3s' }}
        ></div>
      </div>

      <p className="mt-2 text-sm text-green-200">
        GenWin is thinking...
      </p>
    </div>
  </div>
)}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-outline-variant/10 bg-surface-container-lowest/5 backdrop-blur-xl">
            {/* Suggested Questions */}
            <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar scroll-smooth mb-4">
              <button
                onClick={() => handleSuggestedQuestion('Submit a Complaint')}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant/20 hover:border-[#00450d]/50 hover:bg-[#91d78a]/20 transition-all flex items-center gap-2 text-body-sm font-medium text-xs text-white"
              >
                <span className="material-symbols-outlined text-base">report_problem</span>
                Submit a Complaint
              </button>
              <button
                onClick={() => handleSuggestedQuestion('Check Water Supply')}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant/20 hover:border-[#00450d]/50 hover:bg-[#91d78a]/20 transition-all flex items-center gap-2 text-body-sm font-medium text-xs text-white"
              >
                <span className="material-symbols-outlined text-base">water_drop</span>
                Check Water Supply
              </button>
              <button
                onClick={() => handleSuggestedQuestion('Power Outage Info')}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant/20 hover:border-[#00450d]/50 hover:bg-[#91d78a]/20 transition-all flex items-center gap-2 text-body-sm font-medium text-xs text-white"
              >
                <span className="material-symbols-outlined text-base">electric_bolt</span>
                Power Outage Info
              </button>
              <button
                onClick={() => handleSuggestedQuestion('Public Transport')}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant/20 hover:border-[#00450d]/50 hover:bg-[#91d78a]/20 transition-all flex items-center gap-2 text-body-sm font-medium text-xs text-white"
              >
                <span className="material-symbols-outlined text-base">bus_alert</span>
                Public Transport
              </button>
            </div>

            {/* Input Field */}
            <div className="relative group">
              {selectedFile && (
  <div className="mb-3 flex items-center justify-between bg-[rgba(0,69,13,0.2)] border border-[#91d78a]/30 rounded-lg p-3">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined">
        description
      </span>

      <span className="text-sm">
        {selectedFile.name}
      </span>
    </div>

    <button
      onClick={() => setSelectedFile(null)}
      className="material-symbols-outlined text-red-500"
    >
      close
    </button>
  </div>
)}
  <textarea
    ref={textareaRef}
    value={inputValue}
    onChange={handleInputChange}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
    className="w-full bg-surface-container-highest/20 border border-outline-variant/30 rounded-2xl py-4 pl-6 pr-32 focus:ring-2 focus:ring-[#00450d]/50 focus:border-[#00450d] transition-all resize-none text-body-lg text-white placeholder:text-white/60"
    placeholder="Ask me about Bhopal traffic, water, or utilities..."
    rows="1"
  />

  {/* Hidden File Input */}
  <input
    type="file"
    ref={fileInputRef}
    className="hidden"
    onChange={handleFileUpload}
  />

  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
    {/* Voice Button */}
    <button
      onClick={handleVoiceInput}
      className={`material-symbols-outlined p-2 transition-colors ${
        isListening
          ? 'text-red-500 animate-pulse'
          : 'text-surface-variant hover:text-[#00450d]'
      }`}
    >
      mic
    </button>

    {/* File Upload Button */}
    <button
      onClick={() => fileInputRef.current?.click()}
      className="material-symbols-outlined p-2 text-surface-variant hover:text-[#00450d] transition-colors"
    >
      attach_file
    </button>

    {/* Send Button */}
    <button
      onClick={handleSend}
      disabled={isLoading}
      className="bg-[#00450d] hover:bg-[#91d78a] text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-symbols-outlined">
        {isLoading ? 'hourglass_top' : 'send'}
      </span>
    </button>
  </div>
</div>

            {/* Footer */}
            <div className="mt-3 flex justify-between items-center px-2">
              <p className="text-xs font-label-data text-white/60 tracking-wider">VERSION 2.4.0-RAG | POWERED BY BHOPAL SMART CITY TWIN</p>
              <div className="flex gap-4">
                <button
             onClick={handleClearChat}
           className="text-xs font-label-data text-surface-variant/60 hover:text-[#00450d] transition-colors"
            >
         Clear Chat
           </button>
              <button
       onClick={handleExportLogs}
       className="text-xs font-label-data text-surface-variant/60 hover:text-[#00450d] transition-colors"
      >
       Export Logs
         </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Assistant Context */}
        <aside className="hidden xl:flex w-72 flex-col bg-[rgba(0,69,13,0.1)] backdrop-blur-[12px] border-l border-[rgba(145,215,138,0.2)] z-10">
          <div className="p-6 flex flex-col h-full overflow-hidden">
            <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6 border border-outline-variant/20">
              <img
                className="w-full h-full object-cover"
                alt="A futuristic digital 3D model of Bhopal city"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAREbzUHFORNfds_47utFcW36RlsX-XIsAwGyouXsd4-wNideUhMu3u_XWkPcCK9fQcgf7DmfBwVfJaKCQhu6kLEIIpuhu8WXdEcNoH1lWYa1pDxIRBSznCVUkKAuYkbyKdatPlUmT1HbWF9rW0kNIv5Wm-0ub_kfe2bSCOtU7tHas0MDvG8jCEtNf4DusWAXD2Inu9sLsfaHH9M6oOD9Bjl-kXNOfYqysu4KnKZmoOsYirTDxd5h0WAR066GRrABpN0aXA4iaYSMw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <p className="text-[#00450d] font-label-data text-xs flex items-center gap-1 bg-background/80 px-2 py-1 rounded backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00450d] animate-pulse"></span> LIVE SIMULATION
                </p>
              </div>
            </div>

            <div className="space-y-3 flex-1 custom-scrollbar pr-2 overflow-y-auto">
              <h3 className="font-title-md text-title-md text-inverse-primary">Assistant Context</h3>
              <p className="text-body-sm text-surface-variant leading-relaxed">
                The Bhopal Twin Assistant leverages RAG (Retrieval-Augmented Generation) with a ChromaDB knowledge base updated every 15 minutes from municipal servers.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-surface-container-highest/10 p-3 rounded-lg border border-outline-variant/10 flex flex-col items-center">
                  <span className="text-[#00450d] font-bold text-lg">0.8s</span>
                  <span className="text-xs text-surface-variant uppercase font-label-data">Latency</span>
                </div>
                <div className="bg-surface-container-highest/10 p-3 rounded-lg border border-outline-variant/10 flex flex-col items-center">
                  <span className="text-[#00450d] font-bold text-lg">99%</span>
                  <span className="text-xs text-surface-variant uppercase font-label-data">Accuracy</span>
                </div>
              </div>

              <div className="mt-4 bg-[#91d78a]/10 p-4 rounded-xl border border-[#00450d]/20 animate-pulse-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#00450d] text-sm">info</span>
                  <span className="text-xs font-bold text-[#00450d] uppercase tracking-tight">Active Knowledge</span>
                </div>
                <ul className="text-xs text-surface-variant space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00450d]">•</span>
                    <span>Current Municipal Election dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00450d]">•</span>
                    <span>Monsoon flood zones 2024</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00450d]">•</span>
                    <span>Metro Line 1 testing phase</span>
                  </li>
                </ul>
              </div>
            </div>

            <button className="mt-6 w-full bg-surface-container-highest/10 hover:bg-error/10 hover:text-error py-3 rounded-xl border border-outline-variant/20 transition-all font-label-data text-label-data text-surface-variant flex items-center justify-center gap-2 text-xs uppercase tracking-wide">
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Reset Session
            </button>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest/5 border-t border-outline-variant/10 text-surface-variant/40 py-2 px-16 text-center text-xs font-label-data z-20">
        © 2026 BHOPAL SMART CITY DEVELOPMENT CORPORATION LTD. | AI CITIZEN PORTAL v6.2
      </footer>
    </div>
  );
}
