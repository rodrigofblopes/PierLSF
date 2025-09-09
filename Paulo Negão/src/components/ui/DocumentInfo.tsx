import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Download, MapPin, User, Building } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DocumentInfoProps {
  className?: string;
}

export const DocumentInfo: React.FC<DocumentInfoProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const requiredDocuments = [
    {
      title: "Requerimento Padrão",
      description: "Formulário devidamente preenchido",
      icon: <FileText className="h-4 w-4" />,
      required: true
    },
    {
      title: "Taxa de Abertura de Processo",
      description: "Com comprovante de pagamento",
      icon: <CheckCircle className="h-4 w-4" />,
      required: true
    },
    {
      title: "Documentos Pessoais",
      description: "RG e CPF (originais e cópias legíveis)",
      icon: <User className="h-4 w-4" />,
      required: true
    },
    {
      title: "Documentos Jurídicos",
      description: "CNPJ e última alteração contratual (se pessoa jurídica)",
      icon: <Building className="h-4 w-4" />,
      required: false
    },
    {
      title: "Contrato de Compra e Venda",
      description: "Autenticado em cartório (em casos específicos)",
      icon: <FileText className="h-4 w-4" />,
      required: false
    },
    {
      title: "Croqui da Área",
      description: "Identificando localização do lote (se necessário)",
      icon: <MapPin className="h-4 w-4" />,
      required: false
    },
    {
      title: "Comprovante de Residência",
      description: "Cópia do comprovante do requerente",
      icon: <FileText className="h-4 w-4" />,
      required: true
    }
  ];

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Certidão Informativa</h2>
              <p className="text-white/80 text-sm">Documentos necessários e procedimentos</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-white" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Tempo Estimado */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tempo Estimado</h3>
                <p className="text-green-600 font-medium">Em até 15 dias úteis</p>
              </div>
            </div>
          </div>

          {/* Documentos Necessários */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Documentos Necessários
            </h3>
            <div className="space-y-3">
              {requiredDocuments.map((doc, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    doc.required
                      ? 'bg-red-50 border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    doc.required ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                  )}>
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{doc.title}</h4>
                      {doc.required && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          OBRIGATÓRIO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Observação Importante</h4>
            <p className="text-yellow-700 text-sm">
              Especificar no requerimento, no campo "Informações Adicionais", a finalidade/justificativa da solicitação.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Download className="h-4 w-4" />
              Baixar Requerimento
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              <FileText className="h-4 w-4" />
              Ver Instruções
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
