import { useState } from 'react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { Tabs } from '@/components/ui/Tabs';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { Home, FolderOpen, FileText } from 'lucide-react';


// Sample images data - Comentado para projeto novo
// const images = [
//   {
//     src: '/IMG_0008.jpg',
//     alt: 'Imagem 0008',
//     title: 'Fotografia da Clínica'
//   },
//   {
//     src: '/IMG_0045.jpg',
//     alt: 'Imagem 0045',
//     title: 'Fotografia da Clínica'
//   },
//   {
//     src: '/IMG_0046.jpg',
//     alt: 'Imagem 0046',
//     title: 'Fotografia da Clínica'
//   },
//   {
//     src: '/IMG_0047.jpg',
//     alt: 'Imagem 0047',
//     title: 'Fotografia da Clínica'
//   },
//   {
//     src: '/IMG_0132.jpg',
//     alt: 'Imagem 0132',
//     title: 'Fotografia da Clínica'
//   },
//   {
//     src: '/ortomosaicooutboundary.jpg',
//     alt: 'Ortomosaico Outboundary',
//     title: 'Ortomosaico da Clínica'
//   }
// ];

// Sample projects data
const projects = [
  {
    title: 'Projeto Arquitetônico',
    description: 'Projeto de arquitetura do Lote 10x30 - 10 Apartamentos.',
    status: 'concluido' as const,
    location: 'Porto Velho, RO',
    type: 'arquitetura' as const,
    progress: 100,
    files: [
      // Arquivos removidos - serão adicionados posteriormente
    ],
    professional: {
      name: 'Rodrigo Bonfim Lopes',
      role: 'Engenheiro',
      instagram: 'https://www.instagram.com/engrodrigofblopes/'
    }
  },
  {
    title: 'Projeto Estrutural',
    description: 'Projeto estrutural do Lote 10x30 - 10 Apartamentos.',
    status: 'concluido' as const,
    location: 'Porto Velho, RO',
    type: 'estrutural' as const,
    progress: 100,
    files: [
      // Arquivos removidos - serão adicionados posteriormente
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-gray-100">
      {/* Header do Dashboard - Cores da Empresa */}
      <div className="relative bg-gradient-to-r from-black via-yellow-600 to-black shadow-2xl border-b-2 border-yellow-400 p-3 sm:p-6 overflow-hidden z-10">
        {/* Efeito de brilho animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent animate-pulse z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-pulse z-0"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col gap-4 mb-4">
            {/* Logo BIMTECH e Nome da Empresa - Canto Esquerdo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-yellow-400/30">
                <img 
                  src="/BIMTECH.jpg" 
                  alt="BIMTECH Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h2 className="text-sm sm:text-lg font-semibold text-white drop-shadow-lg hover:text-yellow-300 transition-colors duration-300">
                Bonfim Imobiliária e Engenharia
              </h2>
            </div>
            
            {/* Título do Projeto - Centralizado */}
            <div className="flex justify-center">
              <h1 className="text-lg sm:text-2xl font-bold text-center relative group">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg filter drop-shadow-yellow-400/50 animate-pulse">
                  Lote 10x30
                </span>
                <span className="text-white ml-2 drop-shadow-lg">- 10 Apartamentos</span>
                {/* Efeito de brilho ao redor do título */}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 via-yellow-300/40 to-yellow-500/30 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
                {/* Linha de destaque abaixo do título */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              </h1>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Dashboard do Lote 10x30 - 10 Apartamentos</h2>
                <p className="text-gray-600">
                  Explore os projetos e documentos do Lote 10x30 - 10 Apartamentos. Navegue pelas abas para acessar diferentes funcionalidades.
                </p>
              </div>

              {/* Galeria de Imagens */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Fotografias pré-obra</h3>
                <p className="text-gray-600 mb-6">
                  Explore o registro fotográfico do estado inicial do Lote 10x30 - 10 Apartamentos, documentando as condições pré-obra. Esta galeria apresenta o ambiente antes do início das intervenções arquitetônicas e estruturais. Clique nas imagens para visualização em tela cheia.
                </p>
                {/* <ImageGallery images={images} /> */}
              </div>
            </div>
          )}


          {activeTab === 'projetos' && (
            <div className="space-y-6">
              {/* Header da aba Projetos */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Projetos do Lote 10x30 - 10 Apartamentos</h2>
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
                  Documentos oficiais, licenças e certificações do Lote 10x30 - 10 Apartamentos.
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

                {/* Card do Licenciamento de Obra Multifamiliar */}
                <div className="w-full">
                  <DocumentCard
                    title="Licenciamento de Obra Multifamiliar"
                    type="projeto"
                    checklist={[
                      {
                        id: "requerimento_padrao",
                        text: "Requerimento padrão com Declaração, totalmente preenchido e assinado",
                        required: true
                      },
                      {
                        id: "certidao_negativa_iptu",
                        text: "Certidão Negativa de Débitos do Imóvel atualizada - IPTU, conforme Art. 265 LC 199/2004 (exceto para imóveis em zona rural)",
                        required: true
                      },
                      {
                        id: "comprovacao_propriedade_terreno",
                        text: "Documentos de comprovação de propriedade do terreno: Certidão de Inteiro Teor atualizada do lote para áreas escrituradas individualmente; ou Certidão Narrativa do lote, emitida pela SEMUR, para casos em que não há escritura (exceto para casos de condomínio)",
                        required: true
                      },
                      {
                        id: "documentos_pessoais_interessado",
                        text: "Documentos pessoais do Interessado e Procurador (caso tenha): Pessoa Física: cópia do RG e CPF ou carteira de habilitação/profissional; Pessoa Jurídica: cópia do Contrato Social da última alteração e CNPJ",
                        required: true
                      },
                      {
                        id: "arquivo_cad_dwg",
                        text: "01 (um) arquivo eletrônico em plataforma CAD (com extensão DWG) dos projetos (salvo em versão 2010 ou anterior), conforme art. 19, incisos III, IV da LC 560/14",
                        required: true
                      },
                      {
                        id: "art_rrt_profissionais",
                        text: "Cópia das Anotações de Responsabilidades Técnicas – ART (autenticada pelo CREA) ou Registro de Responsabilidade Técnicas - RRT (autenticada pelo CAU) dos profissionais responsáveis pela elaboração dos projetos: Regularização de Obras; e Laudo Técnico",
                        required: true
                      },
                      {
                        id: "projeto_arquitetonico_regularizacao",
                        text: "Apresentar 03 jogos de Projeto Arquitetônico completo com titulo de REGULARIZAÇÃO (plantas baixas, cortes e fachadas, inclusive com plantas de situação e locação, contendo quadro de esquadrias e quadro de áreas), conforme art. 18 da LC 560/14, devidamente assinados",
                        required: true
                      },
                      {
                        id: "projeto_acessibilidade_nbr",
                        text: "Apresentar 03 jogos de Projeto de Acessibilidade, de acordo com Decreto Federal 5.296 de 2 Dez. de 2004, inclusive NBR-9050",
                        required: true
                      },
                      {
                        id: "laudo_tecnico_fotografico",
                        text: "Laudo Técnico com Relatório Fotográfico (NÍTIDO) da edificação na data da apresentação do projeto de regularização, atestando as condições técnicas de habitabilidade do espaço construído e a data que a obra foi concluída; Devidamente assinado pelo proprietário e profissional, conforme modelo no Anexo IV desta Instrução Normativa",
                        required: true
                      },
                      {
                        id: "certificado_bombeiros_ro",
                        text: "Apresentar Certificado de Vistoria Final da Obra expedido pelo CORPO DE BOMBEIROS Militar de Rondônia",
                        required: true
                      },
                      {
                        id: "licenca_ambiental_operacao",
                        text: "Licença Ambiental de Operação emitida pelo Órgão Ambiental Municipal (Subsecretaria Municipal de Meio Ambiente e Desenvolvimento Sustentável - SEMA) ou Estadual, ou Federal",
                        required: true
                      },
                      {
                        id: "certidao_calcadas_fotografico",
                        text: "Apresentar Certidão de Conclusão de Calçadas com Relatório Fotográfico assinado por Técnico da Comissão Específica de Padronização de Calçadas ou Notificação de Dispensa Temporária de padronização de Calçadas",
                        required: true
                      },
                      {
                        id: "trd_trad_semtrans",
                        text: "Apresentar Termo de Recebimento Definitivo (TRD) ou Termo de Recebimento e Aceitação Definitivo (TRAD) emitido pela Secretaria Municipal de Trânsito, Mobilidade e Transportes - SEMTRAN, acompanhado de PARECER FAVORÁVEL",
                        required: true
                      },
                      {
                        id: "autorizacao_iphan_tombado",
                        text: "Autorização do IPHAN para execução de obras em área de bem tombado e seu entorno no Município de Porto Velho, seguindo as normativas contidas nas Portarias do IPHAN nº 231/2007 e a nº 420/2010",
                        required: false
                      },
                      {
                        id: "declaracao_conformidade_sanitaria",
                        text: "Declaração de Conformidade Sanitária de Projeto Arquitetônico emitida pela Vigilância Sanitária, para estabelecimentos de assistência a saúde. (Art. 31 do Código Sanitário do Município – Lei n° 1562/2003 e Resoluções e Normas Técnicas específicas da ANVISA e Ministério da Saúde). SEMUSA",
                        required: false
                      }
                    ]}
                  />
                </div>

                {/* Card da Regularização de Obra Multifamiliar */}
                <div className="w-full">
                  <DocumentCard
                    title="Regularização de Obra Multifamiliar"
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
