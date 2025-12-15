import React from 'react';
import { AIResponse } from '../types';
import { CheckCircle, Copy, ArrowLeft, Mail } from 'lucide-react';

interface ResultCardProps {
  response: AIResponse;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ response, onReset }) => {
  const recipientEmail = "fsegovia@rm-arg.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(response.formalEmail);
    alert('Texto copiado al portapapeles');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(response.subject || "Solicitud de Licencia");
    const body = encodeURIComponent(response.formalEmail);
    
    // Open default mail client
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in-up">
      <div className="bg-slate-900 border-b-4 border-red-700 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-red-500" />
            Solicitud Lista
          </h2>
          <p className="text-slate-400 mt-1">{response.summaryStatus}</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-2 rounded-full text-red-700">
            <Mail className="w-5 h-5" />
          </div>
          <div>
             <p className="text-sm text-slate-900 font-bold">Destinatario del Correo</p>
             <p className="text-xs text-slate-600">Se enviará a: <strong>{recipientEmail}</strong></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 relative group shadow-sm">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy}
              className="bg-slate-50 p-2 rounded-lg shadow-sm border border-slate-200 hover:text-red-700 transition-colors"
              title="Copiar texto"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Asunto sugerido</span>
                <span className="text-slate-800 font-medium">{response.subject}</span>
            </div>
          </div>
          <div className="whitespace-pre-wrap font-mono text-sm text-slate-800 leading-relaxed">
            {response.formalEmail}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button
            onClick={handleSendEmail}
            className="col-span-1 sm:col-span-2 py-4 px-6 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Mail className="w-5 h-5" />
            Abrir Correo
          </button>
          
          <button
            onClick={onReset}
            className="py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex justify-center items-center gap-2 w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            Nueva Solicitud
          </button>
        </div>
      </div>
    </div>
  );
};