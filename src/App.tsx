import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { Model3DViewer } from '@/components/ui/Model3DViewer';
import { CSVTable } from '@/components/ui/CSVTable';
import { MobileTabBar, MobileNavigation } from '@/components/ui/MobileNavigation';
import { FolderOpen, FileText, Box } from 'lucide-react';
import { ServiceMapping } from '@/utils/serviceMapping';
import { useIsMobile, useIsExtraSmall } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';





function App() {
  const [activeTab, setActiveTab] = useState('3d');
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
    console.log('🔄 handleToggleVisibility chamado com:', serviceMapping);
    if (serviceMapping) {
      setHiddenServices(prev => {
        console.log('📋 hiddenServices atual:', prev);
        if (prev.includes(serviceMapping.serviceName)) {
          // Remover da lista de ocultos (mostrar)
          const newList = prev.filter(name => name !== serviceMapping.serviceName);
          console.log('👁️ Removendo da lista de ocultos, nova lista:', newList);
          return newList;
        } else {
          // Adicionar à lista de ocultos
          const newList = [...prev, serviceMapping.serviceName];
          console.log('🙈 Adicionando à lista de ocultos, nova lista:', newList);
          return newList;
        }
      });
    } else {
      console.log('❌ serviceMapping é null');
    }
  };



  // Definir as abas
  const tabs = [
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
            
            {/* Layout responsivo para mobile - Enhanced */}
            <div className="flex flex-col lg:block">
              
              {/* Header Shopping - Enhanced Mobile */}
              <div className="flex flex-col justify-center items-center min-h-[70px] sm:min-h-[90px] lg:min-h-[100px] space-y-1 sm:space-y-2">
                {/* Título Principal Shopping */}
                <div className="flex justify-center items-center">
                  <div className="relative group">
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-center relative leading-tight">
                      <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-yellow-400/70 animate-pulse">
                        {isMobile ? (
                          <>
                            FLUTUANTE<br />
                            LSF
                          </>
                        ) : (
                          <>
                            FLUTUANTE<br />
                            EM LIGHT STEEL FRAME
                          </>
                        )}
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

      {/* Conteúdo das Abas - Enhanced Mobile Layout */}
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === '3d' && (
            <div className={cn(
              "flex gap-2 sm:gap-4",
              isMobile 
                ? "flex-col h-[calc(100vh-200px)]" 
                : "flex-row h-[calc(100vh-140px)]"
            )}>
              {/* Visualizador 3D - Enhanced Mobile */}
              <div className={cn(
                "flex-1 min-h-0 rounded-xl overflow-hidden shadow-lg",
                isMobile 
                  ? "h-1/2 min-h-[300px]" 
                  : "h-full"
              )}>
                <Model3DViewer
                  modelPath="/Pier.glb"
                  className="h-full rounded-xl border border-white/10 touch-manipulation"
                  selectedService={selectedService}
                  hiddenServices={hiddenServices}
                  selectedElements3d={selectedElements3d}
                />
              </div>
              
              {/* Painel lateral - Enhanced Mobile */}
              <div className={cn(
                "min-h-0 overflow-hidden rounded-xl shadow-lg bg-white/95 backdrop-blur-sm",
                isMobile 
                  ? "h-1/2 w-full" 
                  : "h-full w-[500px]"
              )}>
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
