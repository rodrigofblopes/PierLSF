export const downloadFile = async (filePath: string, fileName: string): Promise<boolean> => {
  console.log(`=== INICIANDO DOWNLOAD ===`);
  console.log(`Arquivo: ${filePath}`);
  console.log(`Nome: ${fileName}`);
  
  // Método mais simples e direto
  try {
    console.log('Criando link de download...');
    
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.style.display = 'none';
    
    console.log('Adicionando ao DOM...');
    document.body.appendChild(link);
    
    console.log('Clicando no link...');
    link.click();
    
    console.log('Removendo do DOM...');
    document.body.removeChild(link);
    
    console.log(`✅ Download iniciado: ${fileName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro no download:`, error);
    
    // Fallback: abrir em nova aba
    console.log('Fallback: abrindo em nova aba...');
    window.open(filePath, '_blank');
    return false;
  }
};
