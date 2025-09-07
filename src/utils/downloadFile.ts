export const downloadFile = async (url: string, filename: string) => {
  console.log('downloadFile chamado com:', url, filename);
  
  try {
    // Método mais simples e direto
    console.log('Criando link de download...');
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Adicionar ao DOM
    document.body.appendChild(link);
    
    // Simular clique
    link.click();
    
    // Remover do DOM
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 100);
    
    console.log('Download iniciado com sucesso');
    return true;
    
  } catch (error) {
    console.error('Erro no download:', error);
    
    // Fallback: abrir em nova aba
    console.log('Abrindo arquivo em nova aba...');
    window.open(url, '_blank');
    return false;
  }
};
