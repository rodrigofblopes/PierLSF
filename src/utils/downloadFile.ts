export const downloadFile = async (url: string, filename: string) => {
  try {
    // Primeiro, tentar download direto
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Erro no download direto:', error);
    
    try {
      // Fallback: usar fetch para baixar o arquivo
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar o URL do objeto
      window.URL.revokeObjectURL(downloadUrl);
    } catch (fetchError) {
      console.error('Erro no download com fetch:', fetchError);
      // Último fallback: abrir em nova aba
      window.open(url, '_blank');
    }
  }
};
