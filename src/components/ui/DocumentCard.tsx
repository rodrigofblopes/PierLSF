import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Lock, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { downloadFile } from '@/utils/downloadFile';

interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
}

interface DocumentCardProps {
  title: string;
  type: 'licenca' | 'alvara' | 'habite-se' | 'projeto' | 'laudo' | 'certificado';
  checklist?: ChecklistItem[];
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  type,
  checklist,
  className,
}) => {
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(true); // Começar expandido
  const [checkedItems] = useState<Set<string>>(new Set([
    'pessoa_fisica',           // CNH-e.pdf ✓
    'contrato',                // contratocompraevenda.pdf ✓
    'comprovante_residencia',  // comprovanteendereco.pdf ✓
    'pessoa_fisica_narrativa', // CNH-e.pdf ✓
    'comprovante_residencia_narrativa', // comprovanteendereco.pdf ✓
    'contrato_narrativa',      // contratocompraevenda.pdf ✓
    'documentos_pessoais',     // CNH-e.pdf ✓
    'art_rrt'                  // ART.pdf ✓
  ]));
  
  // Estado para modal de senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [pendingDownload, setPendingDownload] = useState<{filePath: string, fileName: string} | null>(null);
  const [passwordError, setPasswordError] = useState('');

  // Função para verificar senha
  const verifyPassword = (inputPassword: string): boolean => {
    // Senha padrão - em produção, isso deveria vir de uma API ou variável de ambiente
    const correctPassword = "eduardoferreira";
    return inputPassword === correctPassword;
  };

  // Função para solicitar download com senha
  const requestDownload = (filePath: string, fileName: string) => {
    setPendingDownload({ filePath, fileName });
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  // Função para processar download após autenticação
  const handleAuthenticatedDownload = async () => {
    if (!pendingDownload) return;

    if (verifyPassword(password)) {
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      
      try {
        await downloadFile(pendingDownload.filePath, pendingDownload.fileName);
        console.log(`Download de ${pendingDownload.fileName} autorizado e iniciado`);
      } catch (error) {
        console.error(`Erro ao baixar ${pendingDownload.fileName}:`, error);
        alert(`Erro ao baixar ${pendingDownload.fileName}. Tente novamente.`);
      }
      
      setPendingDownload(null);
    } else {
      setPasswordError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  // Função para cancelar download
  const cancelDownload = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
    setPendingDownload(null);
  };


  const getChecklistProgress = () => {
    if (!checklist) return 0;
    const checkedCount = checklist.filter(item => checkedItems.has(item.id)).length;
    return Math.round((checkedCount / checklist.length) * 100);
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

  return (
    <>
    <div 
      className={cn(
        'group relative overflow-hidden rounded-2xl border-0 transition-all duration-500 shadow-lg hover:shadow-xl',
        className
      )}
    >
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        getTypeColor()
      )} />
      
      {/* Decorative Elements - CORRIGIDO: pointer-events-none para não bloquear cliques */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 pointer-events-none" />
      
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
                    onClick={async (e) => {
                      // Só fazer download se não for o checkbox ou botão de download
                      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) {
                        return;
                      }
                      
                      // Determinar qual arquivo baixar baseado no ID
                      let filePath = '';
                      let fileName = '';
                      
                      if (item.id === 'pessoa_fisica' || item.id === 'pessoa_fisica_narrativa' || item.id === 'documentos_pessoais') {
                        filePath = '/CNH-e.pdf';
                        fileName = 'CNH-e.pdf';
                      } else if (item.id === 'contrato' || item.id === 'contrato_narrativa') {
                        filePath = '/contratocompraevenda.pdf';
                        fileName = 'contratocompraevenda.pdf';
                      } else if (item.id === 'comprovante_residencia' || item.id === 'comprovante_residencia_narrativa') {
                        filePath = '/comprovanteendereco.pdf';
                        fileName = 'comprovanteendereco.pdf';
                      } else if (item.id === 'art_rrt') {
                        filePath = '/ART.pdf';
                        fileName = 'ART.pdf';
                      }
                      
                      if (filePath && fileName) {
                        console.log(`Download da linha: ${fileName}`);
                        requestDownload(filePath, fileName);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={checkedItems.has(item.id)}
                      disabled={true}
                      readOnly={true}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-default"
                    />
                    <label
                      htmlFor={item.id}
                      className={cn(
                        'text-sm cursor-default flex-1 flex items-center gap-2',
                        checkedItems.has(item.id) ? 'text-white/70 line-through' : 'text-white/90'
                      )}
                    >
                      {item.text}
                      {(item.id === 'pessoa_fisica' || item.id === 'pessoa_fisica_narrativa' || item.id === 'documentos_pessoais') && (
                        <button
                          onClick={(e) => {
                            console.log('Botão CNH-e.pdf clicado!');
                            e.stopPropagation();
                            e.preventDefault();
                            requestDownload('/CNH-e.pdf', 'CNH-e.pdf');
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Baixar CNH-e.pdf (Requer senha)"
                        >
                          <Lock className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                        </button>
                      )}
                      {(item.id === 'contrato' || item.id === 'contrato_narrativa') && (
                        <button
                          onClick={(e) => {
                            console.log('Botão contrato clicado!');
                            e.stopPropagation();
                            e.preventDefault();
                            requestDownload('/contratocompraevenda.pdf', 'contratocompraevenda.pdf');
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Baixar contratocompraevenda.pdf (Requer senha)"
                        >
                          <Lock className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                        </button>
                      )}
                      {item.id === 'comprovante_residencia' && (
                        <button
                          onClick={(e) => {
                            console.log('Botão comprovante clicado!');
                            e.stopPropagation();
                            e.preventDefault();
                            requestDownload('/comprovanteendereco.pdf', 'comprovanteendereco.pdf');
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Baixar comprovanteendereco.pdf (Requer senha)"
                        >
                          <Lock className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                        </button>
                      )}
                      {item.id === 'comprovante_residencia_narrativa' && (
                        <button
                          onClick={(e) => {
                            console.log('Botão comprovante narrativa clicado!');
                            e.stopPropagation();
                            e.preventDefault();
                            requestDownload('/comprovanteendereco.pdf', 'comprovanteendereco.pdf');
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Baixar comprovanteendereco.pdf (Requer senha)"
                        >
                          <Lock className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                        </button>
                      )}
                      {item.id === 'art_rrt' && (
                        <button
                          onClick={(e) => {
                            console.log('Botão ART clicado!');
                            e.stopPropagation();
                            e.preventDefault();
                            requestDownload('/ART.pdf', 'ART.pdf');
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Baixar ART.pdf (Requer senha)"
                        >
                          <Lock className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                        </button>
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

      {/* Hover Effect - CORRIGIDO: pointer-events-none para não bloquear cliques */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>

    {/* Modal de Senha */}
    {showPasswordModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Acesso Restrito</h3>
                <p className="text-sm text-gray-600">Digite a senha para baixar o documento</p>
              </div>
            </div>
            <button
              onClick={cancelDownload}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAuthenticatedDownload();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite a senha"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={cancelDownload}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAuthenticatedDownload}
              disabled={!password.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Baixar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};