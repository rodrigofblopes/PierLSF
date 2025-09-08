import { useState } from 'react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { Tabs } from '@/components/ui/Tabs';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { Home, FolderOpen, FileText } from 'lucide-react';


// Images data for Clínica UNIQUE
const images = [
  {
    src: '/IMG_0008.jpg',
    alt: 'Imagem 0008',
    title: 'Fotografia da Clínica'
  },
  {
    src: '/IMG_0045.jpg',
    alt: 'Imagem 0045',
    title: 'Fotografia da Clínica'
  },
  {
    src: '/IMG_0046.jpg',
    alt: 'Imagem 0046',
    title: 'Fotografia da Clínica'
  },
  {
    src: '/IMG_0047.jpg',
    alt: 'Imagem 0047',
    title: 'Fotografia da Clínica'
  },
  {
    src: '/IMG_0132.jpg',
    alt: 'Imagem 0132',
    title: 'Fotografia da Clínica'
  },
  {
    src: '/ortomosaicooutboundary.jpg',
    alt: 'Ortomosaico Outboundary',
    title: 'Ortomosaico da Clínica'
  }
];

// Projects data for Clínica UNIQUE
const projects = [
  {
    title: 'Projeto Arquitetônico',
    description: 'Desenvolvimento do projeto arquitetônico completo da Clínica UNIQUE - Medicina Especializada',
    status: 'ativo' as const,
    location: 'Porto Velho, RO',
    type: 'arquitetura' as const,
    files: [
      { name: 'Arquitetura.pdf', path: '/Arquitetura.pdf' }
    ],
    professional: {
      name: 'Mariana Casagrande',
      role: 'Arquiteta Responsável',
      instagram: 'https://www.instagram.com/marianacasagrande/'
    }
  },
  {
    title: 'Projeto Elétrico',
    description: 'Sistema elétrico completo da Clínica UNIQUE - Medicina Especializada',
    status: 'ativo' as const,
    location: 'Porto Velho, RO',
    type: 'eletrico' as const,
    files: [
      { name: 'Elétrico1-3.pdf', path: '/Elétrico1-3.pdf' },
      { name: 'Elétrico2-3.pdf', path: '/Elétrico2-3.pdf' },
      { name: 'Elétrico3-3.pdf', path: '/Elétrico3-3.pdf' }
    ],
    professional: {
      name: 'Rodrigo Bonfim Lopes',
      role: 'Engenheiro Civil',
      instagram: 'https://www.instagram.com/engrodrigofblopes/'
    }
  },
];


function App() {
  const [activeTab, setActiveTab] = useState('home');




  // Definir as abas
  const tabs = [
    { id: 'home', label: 'Início', icon: <Home /> },
    { id: 'projetos', label: 'Projetos', icon: <FolderOpen /> },
    { id: 'documentos', label: 'Documentos Regularização', icon: <FileText /> },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-gray-100">
      {/* Header do Dashboard - Design Moderno */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl overflow-hidden z-10">
        {/* Efeitos de fundo sofisticados */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.05),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        {/* Padrão geométrico sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-yellow-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-yellow-500 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="relative py-8">
            {/* Logo BIMTECH e Nome da Empresa - Canto Esquerdo */}
            <div className="absolute left-0 top-8 flex items-center gap-3 sm:gap-4 group">
              <div className="relative">
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-yellow-300 transform group-hover:scale-105 transition-all duration-300">
                  <img 
                    src="/BIMTECH.jpg" 
                    alt="BIMTECH Logo" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {/* Efeito de brilho na logo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-bold text-yellow-400 drop-shadow-lg tracking-wide">
                  Bonfim Imobiliária
                </h2>
                <p className="text-xs sm:text-sm text-yellow-300/80 font-medium">
                  e Engenharia
                </p>
              </div>
            </div>
            
            {/* Título do Projeto - Perfeitamente Centralizado */}
            <div className="flex justify-center items-center min-h-[120px]">
              <div className="text-center relative group">
                <div className="relative">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-center relative leading-tight">
                    <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-yellow-400/70 animate-pulse">
                      Clínica UNIQUE
                    </span>
                    <br />
                    <span className="text-xl sm:text-2xl lg:text-3xl text-yellow-300 font-bold mt-3 block tracking-wide">
                      Medicina Especializada
                    </span>
                  </h1>
                  
                  {/* Efeitos de brilho sofisticados */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-yellow-400/10 via-yellow-300/20 to-yellow-500/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/5 via-yellow-300/10 to-yellow-500/5 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  
                  {/* Linha de destaque moderna */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-lg shadow-yellow-400/30"></div>
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sistema de Abas */}
          <div className="relative z-20">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Header da aba Início */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Dashboard da Clínica UNIQUE</h2>
                <p className="text-gray-600">
                  Explore os projetos e documentos da Clínica UNIQUE - Medicina Especializada. Navegue pelas abas para acessar diferentes funcionalidades.
                </p>
              </div>

              {/* Galeria de Imagens */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Fotografias pré-obra</h3>
                <p className="text-gray-600 mb-6">
                  Explore o registro fotográfico do estado inicial da Clínica UNIQUE - Medicina Especializada, documentando as condições pré-obra. Esta galeria apresenta o ambiente antes do início das intervenções arquitetônicas e estruturais. Clique nas imagens para visualização em tela cheia.
                </p>
                <ImageGallery images={images} />
              </div>
            </div>
          )}


          {activeTab === 'projetos' && (
            <div className="space-y-6">
              {/* Header da aba Projetos */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Projetos da Clínica UNIQUE</h2>
                <p className="text-gray-600">
                  Acompanhe o progresso dos projetos em andamento e planejados.
                </p>
              </div>

              {/* Grid de Cards dos Projetos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    location={project.location}
                    type={project.type}
                    files={project.files}
                    professional={project.professional}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="space-y-6">
              {/* Header da aba Documentos */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Documentos de Regularização</h2>
                <p className="text-gray-600 text-sm">
                  <strong>Inscrição do Imóvel:</strong> 03010170062001
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Endereço:</strong> Rua Duque de Caxias N 604 - Caiari - Porto Velho -RO
                </p>
              </div>

            {/* Cards dos Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Card da Certidão Informativa */}
              <div className="w-full">
                <DocumentCard
                  title="Certidão Informativa"
                  type="certificado"
                  checklist={[
                    {
                      id: "requerimento",
                      text: "Requerimento Padrão devidamente preenchido",
                      required: true
                    },
                    {
                      id: "taxa",
                      text: "Taxa de Abertura de Processo com comprovante de pagamento",
                      required: true
                    },
                    {
                      id: "pessoa_fisica",
                      text: "Pessoa Física",
                      required: true
                    },
                    {
                      id: "contrato",
                      text: "Contrato de Compra e Venda",
                      required: false
                    },
                    {
                      id: "croqui",
                      text: "Croqui da área identificando a localização do lote em relação à quadra, constando nome das ruas no entorno da quadra e número predial, se houver (ANEXO VIII)",
                      required: false
                    },
                    {
                      id: "comprovante_residencia",
                      text: "Cópia do comprovante de residência",
                      required: true
                    }
                  ]}
                />
              </div>

              {/* Card da Certidão Narrativa */}
              <div className="w-full">
                <DocumentCard
                  title="Certidão Narrativa"
                  type="certificado"
                  checklist={[
                    {
                      id: "requerimento_narrativa",
                      text: "Requerimento Padrão devidamente preenchido",
                      required: true
                    },
                    {
                      id: "taxa_narrativa",
                      text: "Taxa de Abertura de Processo (original) com comprovante de pagamento",
                      required: true
                    },
                    {
                      id: "pessoa_fisica_narrativa",
                      text: "Pessoa Física",
                      required: true
                    },
                    {
                      id: "comprovante_residencia_narrativa",
                      text: "Cópia do comprovante de residência",
                      required: true
                    },
                    {
                      id: "certidao_registro",
                      text: "Certidão de Registro de Imóveis - Inteiro Teor atualizada. (Somente para área escriturada)",
                      required: false
                    },
                    {
                      id: "certidao_fiscal",
                      text: "Certidão de Regularidade Fiscal do Imóvel Atualizada (Negativa de Tributos Municipais)",
                      required: true
                    },
                    {
                      id: "contrato_narrativa",
                      text: "Contrato de Compra e Venda",
                      required: false
                    }
                  ]}
                />
              </div>


                {/* Card da Regularização de Obra Comercial */}
                <div className="w-full">
                  <DocumentCard
                    title="Regularização de Obra Comercial"
                    type="projeto"
                    checklist={[
                      {
                        id: "requerimento",
                        text: "Requerimento padrão com Declaração, totalmente preenchido e assinado",
                        required: true
                      },
                      {
                        id: "certidao_negativa",
                        text: "Certidão Negativa de Débitos do Imóvel atualizada - IPTU (exceto para imóveis em zona rural)",
                        required: true
                      },
                      {
                        id: "comprovacao_propriedade",
                        text: "Documentos de comprovação de propriedade do terreno (Certidão de Inteiro Teor ou Certidão Narrativa)",
                        required: true
                      },
                      {
                        id: "documentos_pessoais",
                        text: "Documentos pessoais do Interessado e Procurador",
                        required: true
                      },
                      {
                        id: "arquivo_cad",
                        text: "01 arquivo eletrônico em plataforma CAD (extensão DWG) dos projetos (versão 2010 ou anterior)",
                        required: true
                      },
                      {
                        id: "art_rrt",
                        text: "Cópia das ART (autenticada pelo CREA) ou RRT (autenticada pelo CAU) dos profissionais responsáveis",
                        required: true
                      },
                      {
                        id: "projeto_arquitetonico",
                        text: "03 jogos de Projeto Arquitetônico completo com título de REGULARIZAÇÃO (plantas, cortes, fachadas)",
                        required: true
                      },
                      {
                        id: "projeto_acessibilidade",
                        text: "03 jogos de Projeto de Acessibilidade (Decreto Federal 5.296/2004 e NBR-9050)",
                        required: true
                      },
                      {
                        id: "laudo_tecnico",
                        text: "Laudo Técnico com Relatório Fotográfico NÍTIDO da edificação, atestando condições de habitabilidade",
                        required: true
                      },
                      {
                        id: "certificado_bombeiros",
                        text: "Certificado de Vistoria Final da Obra expedido pelo CORPO DE BOMBEIROS Militar de Rondônia",
                        required: true
                      },
                      {
                        id: "licenca_ambiental",
                        text: "Licença Ambiental de Operação emitida pelo Órgão Ambiental Municipal, Estadual ou Federal",
                        required: true
                      },
                      {
                        id: "certidao_calcadas",
                        text: "Certidão de Conclusão de Calçadas com Relatório Fotográfico ou Notificação de Dispensa Temporária",
                        required: true
                      },
                      {
                        id: "trd_trad",
                        text: "Termo de Recebimento Definitivo (TRD) ou TRAD emitido pela SEMTRAN com PARECER FAVORÁVEL",
                        required: true
                      },
                      {
                        id: "autorizacao_iphan",
                        text: "Autorização do IPHAN para execução de obras em área de bem tombado e seu entorno",
                        required: false
                      },
                      {
                        id: "declaracao_conformidade_sanitaria",
                        text: "Declaração de Conformidade Sanitária de Projeto Arquitetônico emitida pela Vigilância Sanitária (SEMUSA)",
                        required: false
                      }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
