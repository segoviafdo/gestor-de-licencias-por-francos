import React, { useState } from 'react';
import { ChatInterface } from './components/RequestForm'; 
import { ResultCard } from './components/ResultCard';
import { AIResponse, AppStatus } from './types';
import { Briefcase, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.CHATTING);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

  const handleRequestComplete = (result: AIResponse) => {
    setAiResponse(result);
    setStatus(AppStatus.SUCCESS);
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setAiResponse(null);
    // Tiny timeout to unmount chat and remount it to reset history
    setTimeout(() => setStatus(AppStatus.CHATTING), 50);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Portal de Francos RM&S',
      text: 'Hola, ingresa aquí para gestionar tus solicitudes de francos:',
      url: window.location.href, // Comparte la URL actual
    };

    // Intenta usar la API nativa de compartir (funciona genial en celulares)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error al compartir', err);
      }
    } else {
      // Fallback para computadoras de escritorio: Abre WhatsApp Web
      const whatsappText = encodeURIComponent(`${shareData.text} ${shareData.url}`);
      window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-4">
              {/* Logo Section */}
              <div className="flex-shrink-0 flex items-center">
                 {/* Placeholder for the logo provided by user. Ensure logo.png is in the public folder */}
                 <img 
                    src="logo.png" 
                    alt="RM&S S.R.L." 
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      // Fallback if image not found
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                 />
                 {/* Fallback Text/Icon if image fails to load */}
                 <div className="hidden flex items-center gap-2">
                    <div className="bg-red-700 p-2 rounded-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">RM&S</span>
                      <span className="text-xs font-bold text-white bg-red-700 px-1 py-0.5 w-fit">S.R.L.</span>
                    </div>
                 </div>
              </div>
              
              <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>
              
              <span className="hidden md:block text-lg font-semibold text-slate-700 tracking-tight">
                Portal de Francos
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareApp}
                className="flex items-center gap-2 text-slate-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                title="Compartir App por WhatsApp"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Compartir</span>
              </button>

              <span className="hidden sm:block text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                AI Online
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
        
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {status === AppStatus.CHATTING && (
             <div className="mb-8 text-center max-w-lg animate-fade-in">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                  Gestión de <span className="text-red-700 border-b-4 border-red-700">Licencias</span>
                </h1>
                <p className="text-slate-600 text-sm mt-4">
                  Sistema automatizado para la solicitud de días compensatorios.
                </p>
             </div>
          )}

          {status === AppStatus.CHATTING && (
            <ChatInterface onRequestComplete={handleRequestComplete} />
          )}

          {status === AppStatus.SUCCESS && aiResponse && (
            <ResultCard response={aiResponse} onReset={handleReset} />
          )}

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} RM&S S.R.L. - Departamento de Relaciones Laborales.
        </div>
      </footer>
    </div>
  );
};

export default App;
