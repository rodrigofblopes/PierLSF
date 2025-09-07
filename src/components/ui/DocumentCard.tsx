import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, User, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
}

interface DocumentCardProps {
  title: string;
  description: string;
  type: 'licenca' | 'alvara' | 'habite-se' | 'projeto' | 'laudo' | 'certificado';
  status: 'aprovado' | 'pendente' | 'vencido' | 'em-analise';
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  fileSize?: string;
  version?: string;
  checklist?: ChecklistItem[];
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  description,
  type,
  status,
  issueDate,
  expiryDate,
  issuer,
  fileSize,
  version,
  checklist,
  className,
}) => {
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(true); // Começar expandido
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(['pessoa_fisica', 'contrato', 'comprovante_residencia', 'pessoa_fisica_narrativa', 'comprovante_residencia_narrativa', 'contrato_narrativa', 'documentos_pessoais', 'art_rrt']));

  const handleCheckboxChange = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const handleItemClick = (itemId: string, itemText: string) => {
    // Se for o item pessoa_fisica, pessoa_fisica_narrativa ou documentos_pessoais, fazer download do CNH-e.pdf
    if (itemId === 'pessoa_fisica' || itemId === 'pessoa_fisica_narrativa' || itemId === 'documentos_pessoais') {
      const link = document.createElement('a');
      link.href = '/CNH-e.pdf'; // Assumindo que o arquivo está na pasta public
      link.download = 'CNH-e.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Se for o item contrato ou contrato_narrativa, fazer download do contratocompraevenda.pdf
    else if (itemId === 'contrato' || itemId === 'contrato_narrativa') {
      const link = document.createElement('a');
      link.href = '/contratocompraevenda.pdf'; // Assumindo que o arquivo está na pasta public
      link.download = 'contratocompraevenda.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Se for o item comprovante_residencia, fazer download do comprovanteendereco.pdf
    else if (itemId === 'comprovante_residencia') {
      const link = document.createElement('a');
      link.href = '/comprovanteendereco.pdf'; // Assumindo que o arquivo está na pasta public
      link.download = 'comprovanteendereco.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Se for o item comprovante_residencia_narrativa, fazer download do contratocompraevenda.pdf
    else if (itemId === 'comprovante_residencia_narrativa') {
      const link = document.createElement('a');
      link.href = '/contratocompraevenda.pdf'; // Assumindo que o arquivo está na pasta public
      link.download = 'contratocompraevenda.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Se for o item art_rrt, fazer download do ART.pdf
    else if (itemId === 'art_rrt') {
      const link = document.createElement('a');
      link.href = '/ART.pdf'; // Assumindo que o arquivo está na pasta public
      link.download = 'ART.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getChecklistProgress = () => {
    if (!checklist) return 0;
    const checkedCount = checklist.filter(item => checkedItems.has(item.id)).length;
    return Math.round((checkedCount / checklist.length) * 100);
  };
  const getStatusColor = () => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-500';
      case 'pendente':
        return 'bg-yellow-500';
      case 'vencido':
        return 'bg-red-500';
      case 'em-analise':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'pendente':
        return 'Pendente';
      case 'vencido':
        return 'Vencido';
      case 'em-analise':
        return 'Em Análise';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'vencido':
        return <AlertCircle className="h-4 w-4" />;
      case 'em-analise':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'licenca':
        return 'from-green-500 to-green-600';
      case 'alvara':
        return 'from-blue-500 to-blue-600';
      case 'habite-se':
        return 'from-purple-500 to-purple-600';
      case 'projeto':
        return 'from-orange-500 to-orange-600';
      case 'laudo':
        return 'from-red-500 to-red-600';
      case 'certificado':
        return 'from-cyan-500 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeText = () => {
    switch (type) {
      case 'licenca':
        return 'Licença';
      case 'alvara':
        return 'Alvará';
      case 'habite-se':
        return 'Habite-se';
      case 'projeto':
        return 'Projeto';
      case 'laudo':
        return 'Laudo';
      case 'certificado':
        return 'Certificado';
      default:
        return 'Documento';
    }
  };

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border-0 transition-all duration-500 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl',
      className
    )}>
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        getTypeColor()
      )} />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      
      {/* Content */}
      <div className="relative p-6 sm:p-8">
        {/* Header Simplificado */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-white/80 text-sm">
              Documentos necessários para solicitação
            </p>
          </div>
        </div>


        {/* Checklist */}
        {checklist && checklist.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
              className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Checklist de Documentos ({checklist.filter(item => checkedItems.has(item.id)).length}/{checklist.length})
                </span>
                <div className="w-16 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getChecklistProgress()}%` }}
                  />
                </div>
              </div>
              {isChecklistExpanded ? (
                <ChevronUp className="h-4 w-4 text-white" />
              ) : (
                <ChevronDown className="h-4 w-4 text-white" />
              )}
            </button>

            {isChecklistExpanded && (
              <div className="mt-3 space-y-2">
                       {checklist.map((item) => (
                         <div
                           key={item.id}
                           className={cn(
                             "flex items-center gap-3 p-2 bg-white/5 rounded-lg",
                             (item.id === 'pessoa_fisica' || item.id === 'pessoa_fisica_narrativa' || item.id === 'documentos_pessoais' || item.id === 'contrato' || item.id === 'contrato_narrativa' || item.id === 'comprovante_residencia' || item.id === 'comprovante_residencia_narrativa' || item.id === 'art_rrt') && "cursor-pointer hover:bg-white/10 transition-colors"
                           )}
                           onClick={(item.id === 'pessoa_fisica' || item.id === 'pessoa_fisica_narrativa' || item.id === 'documentos_pessoais' || item.id === 'contrato' || item.id === 'contrato_narrativa' || item.id === 'comprovante_residencia' || item.id === 'comprovante_residencia_narrativa' || item.id === 'art_rrt') ? () => handleItemClick(item.id, item.text) : undefined}
                         >
                           <input
                             type="checkbox"
                             id={item.id}
                             checked={checkedItems.has(item.id)}
                             onChange={() => handleCheckboxChange(item.id)}
                             className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                           />
                           <label
                             htmlFor={item.id}
                             className={cn(
                               'text-sm cursor-pointer flex-1 flex items-center gap-2',
                               checkedItems.has(item.id) ? 'text-white/70 line-through' : 'text-white/90'
                             )}
                           >
                             {item.text}
                             {(item.id === 'pessoa_fisica' || item.id === 'pessoa_fisica_narrativa' || item.id === 'documentos_pessoais' || item.id === 'contrato' || item.id === 'contrato_narrativa' || item.id === 'comprovante_residencia' || item.id === 'comprovante_residencia_narrativa' || item.id === 'art_rrt') && (
                               <Download className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                             )}
                             {item.required && (
                               <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                                 OBRIGATÓRIO
                               </span>
                             )}
                           </label>
                         </div>
                       ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
