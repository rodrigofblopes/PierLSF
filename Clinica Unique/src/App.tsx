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
        {/* Efeitos de fundo sofisticados - Responsivos */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.05),transparent_40%)] sm:bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.03),transparent_40%)] sm:bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.05),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        {/* Padrão geométrico sutil - Responsivo */}
        <div className="absolute inset-0 opacity-3 sm:opacity-5">
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 border border-yellow-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/6 sm:left-1/4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border border-yellow-500 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 px-3 sm:px-4 lg:px-8">
          <div className="relative py-4 sm:py-6 lg:py-8">
            {/* Botão WhatsApp - Canto Superior Direito */}
            <div className="absolute top-4 right-4 z-20">
              <a
                href="https://wa.me/5569992561830"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                title="Fale conosco no WhatsApp"
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 bg-green-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </a>
            </div>
            
            {/* Layout responsivo para mobile */}
            <div className="flex flex-col lg:block">
              {/* Logo BIMTECH e Nome da Empresa - Mobile: Topo, Desktop: Canto Esquerdo */}
              <div className="flex justify-center lg:absolute lg:left-0 lg:top-6 lg:justify-start mb-4 lg:mb-0">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-yellow-300 transform group-hover:scale-105 transition-all duration-300">
                      <img 
                        src="/BIMTECH.jpg" 
                        alt="BIMTECH Logo" 
                        className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                      />
                    </div>
                    {/* Efeito de brilho na logo */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-xl lg:rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="space-y-0.5 lg:space-y-1">
                    <h2 className="text-xs sm:text-sm lg:text-base font-bold text-yellow-400 drop-shadow-lg tracking-wide">
                      Bonfim Imobiliária
                    </h2>
                    <p className="text-xs sm:text-sm text-yellow-300/80 font-medium">
                      e Engenharia
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Título do Projeto - Responsivo */}
              <div className="flex justify-center items-center min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]">
                <div className="text-center relative group px-2 sm:px-4">
                  <div className="relative">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-center relative leading-tight">
                      <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-yellow-400/70 animate-pulse">
                        Clínica UNIQUE
                      </span>
                      <br />
                      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-yellow-300 font-bold mt-1 sm:mt-2 lg:mt-3 block tracking-wide">
                        Medicina Especializada
                      </span>
                    </h1>
                    
                    {/* Efeitos de brilho responsivos */}
                    <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-to-r from-yellow-400/10 via-yellow-300/20 to-yellow-500/10 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
                    <div className="absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gradient-to-r from-yellow-400/5 via-yellow-300/10 to-yellow-500/5 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    
                    {/* Linha de destaque responsiva */}
                    <div className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-6 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-40 lg:w-48 h-1 sm:h-1.5 lg:h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-lg shadow-yellow-400/30"></div>
                    <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-5 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full"></div>
                  </div>
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
                  description="📑 Certidão Informativa - Informa os dados do imóvel na Prefeitura quando não há registro em cartório. Obs.: Não substitui a matrícula."
                  deadline="15 dias"
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
                  description="📜 Certidão Narrativa - Apresenta as características físicas, fundiárias e cadastrais do lote — emitida pela Prefeitura."
                  deadline="15 dias"
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
                    description="Certidão de Regularização de Obra - Documento que regulariza construções realizadas sem autorização municipal, permitindo a obtenção do Habite-se e a legalização do imóvel."
                    checklist={[
                      {
                        id: "requerimento_regularizacao",
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

                {/* Card do HABITE-SE */}
                <div className="w-full">
                  <DocumentCard
                    title="HABITE-SE"
                    type="projeto"
                    description="Laudo técnico expedido pelo município atestando a conclusão de obra devidamente licenciada, e que autoriza a sua utilização."
                    checklist={[
                      {
                        id: "requerimento_habite",
                        text: "Requerimento padrão com Declaração, totalmente preenchido e assinado",
                        required: true
                      },
                      {
                        id: "certidao_negativa_habite",
                        text: "Certidão Negativa de Débitos do Imóvel atualizada - IPTU, conforme Art. 265 LC 199/2004 (exceto para imóveis em zona rural)",
                        required: true
                      },
                      {
                        id: "comprovacao_propriedade_habite",
                        text: "Apresentar um dos documentos de comprovação de propriedade do terreno: Certidão de Inteiro Teor atualizada do lote para áreas escrituradas individualmente; Certidão Narrativa do lote, emitida pela SEMUR, para casos em que não há escritura (exceto para casos de condomínio)",
                        required: true
                      },
                      {
                        id: "documentos_pessoais_habite",
                        text: "Documentos pessoais do Interessado e Procurador (caso tenha): Pessoa Física: cópia do RG e CPF ou carteira de habilitação/profissional; Pessoa Jurídica: cópia do Contrato Social da última alteração e CNPJ",
                        required: true
                      },
                      {
                        id: "licenca_ambiental_habite",
                        text: "Licença Ambiental de Operação emitida pelo Órgão Ambiental Municipal (Subsecretaria Municipal de Meio Ambiente e Desenvolvimento Sustentável - SEMA) ou Estadual, ou Federal, conforme disposto em Lei, exceto para residências unifamiliares",
                        required: true
                      },
                      {
                        id: "laudo_tecnico_habite",
                        text: "Laudo Técnico de edificação emitido pelo profissional responsável técnico da obra atestando a conclusão das instalações prediais, registrado no Conselho Profissional, com RRT/ART, conforme art. 40, inciso IV da Lei 560/2014",
                        required: true
                      },
                      {
                        id: "certificado_bombeiros_habite",
                        text: "Apresentar Certificado de Vistoria Final da Obra expedido pelo Corpo de Bombeiros Militar de Rondônia, exceto para residências unifamiliares",
                        required: true
                      },
                      {
                        id: "certidao_calcadas_habite",
                        text: "Apresentar Certidão de Conclusão de Calçadas com Relatório Fotográfico assinado por Técnico da Comissão Específica de Padronização de Calçadas ou Notificação de Dispensa Temporária de padronização de Calçadas. SEMTRAN",
                        required: true
                      },
                      {
                        id: "trd_trad_habite",
                        text: "Apresentar Termo de Recebimento Definitivo (TRD) ou Termo de Recebimento e Aceitação Definitivo (TRAD) emitido pela Secretaria Municipal de Trânsito, Mobilidade e Transportes - SEMTRAN, exceto para residências unifamiliares. SEMTRAN",
                        required: true
                      },
                      {
                        id: "licenca_obra_habite",
                        text: "01 Cópia da última Licença de Obra expedida",
                        required: true
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
