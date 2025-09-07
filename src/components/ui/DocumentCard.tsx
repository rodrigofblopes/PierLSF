import React, { useState } from 'react';
import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
}

interface DocumentCardProps {
  title: string;
  description: string;
  type: 'certificado' | 'licenca' | 'projeto';
  status: 'aprovado' | 'pendente' | 'vencido';
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  fileSize: string;
  version: string;
  checklist: ChecklistItem[];
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
  checklist
}) => {
  const [showChecklist, setShowChecklist] = useState(false);

  // Função para detectar e abrir links nos itens do checklist
  const renderChecklistText = (text: string) => {
    // Regex para detectar arquivos PDF mencionados no texto
    const pdfRegex = /([a-zA-Z0-9_-]+\.pdf)/g;
    
    return text.split(pdfRegex).map((part, index) => {
      if (part.match(pdfRegex)) {
        return (
          <button
            key={index}
            onClick={() => handleFileClick(part)}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  // Função para lidar com cliques em arquivos
  const handleFileClick = (fileName: string) => {
    // Remove a extensão para usar como caminho
    const filePath = `/${fileName}`;
    
    // Tenta abrir o arquivo
    const link = document.createElement('a');
    link.href = filePath;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Se for um PDF, abre em nova aba, senão faz download
    if (fileName.endsWith('.pdf')) {
      window.open(filePath, '_blank', 'noopener,noreferrer');
    } else {
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p><strong>Emissor:</strong> {issuer}</p>
        <p><strong>Data de Emissão:</strong> {new Date(issueDate).toLocaleDateString('pt-BR')}</p>
        {expiryDate && (
          <p><strong>Validade:</strong> {new Date(expiryDate).toLocaleDateString('pt-BR')}</p>
        )}
        <p><strong>Tamanho:</strong> {fileSize}</p>
        <p><strong>Versão:</strong> {version}</p>
      </div>

      {/* Checklist Toggle */}
      <button
        onClick={() => setShowChecklist(!showChecklist)}
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium">Documentos Necessários ({checklist.length})</span>
        {showChecklist ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Checklist */}
      {showChecklist && (
        <div className="mt-4 space-y-2">
          {checklist.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-3 rounded-lg border ${item.required ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-1 text-xs px-2 py-1 rounded ${
                  item.required ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
                }`}>
                  {item.required ? 'Obrigatório' : 'Opcional'}
                </span>
                <p className="text-sm text-gray-700 flex-1">
                  {renderChecklistText(item.text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Download Principal */}
      <button
        onClick={() => handleFileClick(`${title.replace(/\s+/g, '')}.pdf`)}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Download size={16} />
        Baixar Documento
      </button>
    </div>
  );
};