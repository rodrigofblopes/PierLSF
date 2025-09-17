import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { Model3DViewer } from '@/components/ui/Model3DViewer';
import { CSVTable } from '@/components/ui/CSVTable';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { MobileTabBar, MobileNavigation } from '@/components/ui/MobileNavigation';
import { Home, FolderOpen, FileText, Box } from 'lucide-react';
import { ServiceMapping } from '@/utils/serviceMapping';
import { useIsMobile, useIsExtraSmall } from '@/hooks/useMediaQuery';





function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<ServiceMapping | null>(null);
  const [hiddenServices, setHiddenServices] = useState<string[]>([]);
  const [selectedElements3d, setSelectedElements3d] = useState<string[]>([]);
  
  // Mobile detection hooks
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();

  const handleServiceSelect = (serviceMapping: ServiceMapping | null, textureType?: string, elements3d?: string[]) => {
    setSelectedService(serviceMapping);
    setSelectedElements3d(elements3d || []);
    console.log('🎯 Elementos 3D selecionados:', elements3d);
  };

  const handleToggleVisibility = (serviceMapping: ServiceMapping | null) => {
    if (serviceMapping) {
      setHiddenServices(prev => {
        if (prev.includes(serviceMapping.serviceName)) {
          // Remover da lista de ocultos (mostrar)
          return prev.filter(name => name !== serviceMapping.serviceName);
        } else {
          // Adicionar à lista de ocultos
          return [...prev, serviceMapping.serviceName];
        }
      });
    }
  };



  // Definir as abas
  const tabs = [
    { id: 'home', label: 'Início', icon: <Home /> },
    { id: '3d', label: '3D', icon: <Box /> },
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
              {/* Logo Bonfim Imobiliária e Engenharia - Mobile: Topo, Desktop: Canto Esquerdo */}
              <div className="flex justify-center lg:absolute lg:left-0 lg:top-6 lg:justify-start mb-4 lg:mb-0">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-yellow-300 transform group-hover:scale-105 transition-all duration-300">
                      <img 
                        src="/BIMTECH.jpg" 
                        alt="Bonfim Imobiliária e Engenharia Logo" 
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
              
              {/* Header Shopping */}
              <div className="flex flex-col justify-center items-center min-h-[80px] sm:min-h-[90px] lg:min-h-[100px] space-y-1 sm:space-y-2">
                {/* Título Principal Shopping */}
                <div className="flex justify-center items-center">
                  <div className="relative group">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-center relative leading-tight">
                      <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-yellow-400/70 animate-pulse">
                        YASAIBOWL<br />
                        PORTO VELHO SHOPPING
                      </span>
                    </h1>
                    
                    {/* Efeitos de brilho responsivos */}
                    <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-to-r from-yellow-400/10 via-yellow-300/20 to-yellow-500/10 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
                    <div className="absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gradient-to-r from-yellow-400/5 via-yellow-300/10 to-yellow-500/5 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Dashboard do YasaiBowl Porto Velho Shopping</h2>
                <p className="text-gray-600">
                  Explore os projetos e documentos do YasaiBowl Porto Velho Shopping. Navegue pelas abas para acessar diferentes funcionalidades e visualizar o modelo 3D interativo.
                </p>
              </div>

              {/* Galeria de Imagens */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6">
                <ImageGallery 
                  images={['/1.jpeg', '/2.jpeg', '/3.jpeg']}
                  className="w-full"
                />
              </div>

            </div>
          )}




          {activeTab === '3d' && (
            <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] flex flex-col gap-1 p-1 sm:gap-4 sm:p-4 lg:flex-row">
              {/* Visualizador 3D - Mobile Optimized */}
              <div className="flex-1 min-h-0 h-2/5 sm:h-2/5 lg:h-full">
                    <Model3DViewer
                      modelPath="./Shopping.glb"
                      className="h-full rounded-lg border border-white/10 touch-manipulation"
                      selectedService={selectedService}
                      hiddenServices={hiddenServices}
                      selectedElements3d={selectedElements3d}
                    />
              </div>
              
              {/* Painel lateral - Tabela Mobile Optimized */}
              <div className="w-full h-3/5 sm:h-3/5 lg:h-full lg:w-[500px] min-h-0 overflow-hidden">
                {/* Tabela CSV - Mobile Responsive */}
                <CSVTable 
                  className="h-full" 
                  onServiceSelect={handleServiceSelect}
                  selectedService={selectedService?.serviceName || null}
                  onToggleVisibility={handleToggleVisibility}
                  hiddenServices={hiddenServices}
                />
              </div>
            </div>
          )}


        </div>
      </div>
      
      {/* Mobile Navigation - Bottom Bar */}
      {isMobile && (
        <MobileNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
      
      {/* Safe area spacing for mobile */}
      {isMobile && <div className="h-20 safe-area-inset-bottom"></div>}
    </div>
  );
}

export default App;
