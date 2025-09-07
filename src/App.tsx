import { useState } from 'react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { Tabs } from '@/components/ui/Tabs';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { Home, FolderOpen, FileText } from 'lucide-react';


// Sample images data
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

// Sample projects data
const projects = [
  {
    title: 'Projeto Arquitetônico',
    description: 'Projeto de arquitetura da Clínica UNIQUE - Medicina Especializada.',
    status: 'concluido' as const,
    location: 'Porto Velho, RO',
    type: 'arquitetura' as const,
    progress: 100,
    files: [
      { name: 'Arquitetura.pdf', path: '/Arquitetura.pdf' }
    ],
    professional: {
      name: 'Mariana Casagrande',
      role: 'Arquiteta',
      instagram: 'https://www.instagram.com/arq_marianacasagrande/'
    }
  },
  {
    title: 'Projeto Elétrico',
    description: 'Projeto elétrico da Clínica UNIQUE - Medicina Especializada.',
    status: 'concluido' as const,
    location: 'Porto Velho, RO',
    type: 'eletrico' as const,
    progress: 100,
    files: [
      { name: 'Elétrico1-3.pdf', path: '/Elétrico1-3.pdf' },
      { name: 'Elétrico2-3.pdf', path: '/Elétrico2-3.pdf' },
      { name: 'Elétrico3-3.pdf', path: '/Elétrico3-3.pdf' }
    ],
    professional: {
      name: 'Rodrigo Bonfim Lopes',
      role: 'Engenheiro',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header do Dashboard - Colorido */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg border-b border-purple-300 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            {/* Logo BIMTECH */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/BIMTECH.jpg" 
                alt="BIMTECH Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">Clínica UNIQUE - Medicina Especializada</h1>
          </div>
          
          {/* Sistema de Abas */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Fotografias da Clínica</h3>
                <p className="text-gray-600 mb-6">
                  Visualize as imagens da Clínica UNIQUE - Medicina Especializada. Clique nas imagens para visualização em tela cheia.
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
                    progress={project.progress}
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
                <p className="text-gray-600">
                  Documentos oficiais, licenças e certificações da Clínica UNIQUE - Medicina Especializada.
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
                      text: "Pessoa Física: CNH-e.pdf (arquivo da pasta)",
                      required: true
                    },
                    {
                      id: "contrato",
                      text: "Contrato de Compra e Venda: contratocompraevenda.pdf (arquivo da pasta)",
                      required: false
                    },
                    {
                      id: "croqui",
                      text: "Croqui da área identificando a localização do lote em relação à quadra, constando nome das ruas no entorno da quadra e número predial, se houver (ANEXO VIII)",
                      required: false
                    },
                    {
                      id: "comprovante_residencia",
                      text: "Cópia do comprovante de residência: comprovanteendereco.pdf (arquivo da pasta)",
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
                      text: "Pessoa Física: CNH-e.pdf (arquivo da pasta)",
                      required: true
                    },
                    {
                      id: "comprovante_residencia_narrativa",
                      text: "Cópia do comprovante de residência: contratocompraevenda.pdf (arquivo da pasta)",
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
                      text: "Contrato de Compra e Venda: contratocompraevenda.pdf (arquivo da pasta)",
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
                        text: "Documentos pessoais do Interessado e Procurador: CNH-e.pdf (arquivo da pasta)",
                        required: true
                      },
                      {
                        id: "arquivo_cad",
                        text: "01 arquivo eletrônico em plataforma CAD (extensão DWG) dos projetos (versão 2010 ou anterior)",
                        required: true
                      },
                      {
                        id: "art_rrt",
                        text: "Cópia das ART (autenticada pelo CREA) ou RRT (autenticada pelo CAU) dos profissionais responsáveis: ART.pdf (arquivo da pasta)",
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
