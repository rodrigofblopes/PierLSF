# 🏗️ Prévia Unique - Visualizador 3D Interativo

## 📋 Descrição

Visualizador 3D interativo para Prévia Unique - Sistema de gestão de serviços com modelo GLB e texturas dinâmicas baseadas em dados CSV. Interface moderna que permite visualizar, destacar e gerenciar elementos arquitetônicos em tempo real.

## ✨ Funcionalidades

* **Visualizador 3D GLB**: Renderização de modelos arquitetônicos com Three.js
* **Texturas Dinâmicas**: Aplicação automática de materiais baseados em dados CSV
* **Sistema de Highlighting**: Destacar elementos específicos no modelo 3D
* **Controle de Visibilidade**: Ocultar/mostrar elementos por categoria
* **Tabela de Serviços**: Interface integrada para gestão de orçamentos
* **Iluminação Realista**: Sistema PBR com sombras e reflexos
* **Design Responsivo**: Interface adaptável para desktop e mobile

## 🎯 Características Técnicas

### 🎨 **Sistema de Texturas**
- **Materiais PBR**: Propriedades físicas realistas (roughness, metalness)
- **Cores Baseadas em CSV**: Pintura, Asfalto, Porcelanato, Telha, Vidro, Madeira
- **Iluminação Natural**: Luz solar, ambiente e preenchimento
- **Transparência**: Vidros com opacidade adequada

### 📊 **Integração CSV**
- **Carregamento Automático**: Dados do arquivo `Link.csv`
- **Mapeamento Dinâmico**: Objetos 3D ↔ Texturas do CSV
- **Coluna de Texturas**: Quinta coluna define material de cada elemento
- **Elementos 3D**: Lista completa de objetos por serviço

### 🎮 **Interatividade**
- **Controles de Órbita**: Navegação livre no modelo 3D
- **Seleção por Clique**: Destacar elementos na tabela
- **Toggle de Visibilidade**: Ocultar/mostrar por categoria
- **Zoom e Pan**: Controles intuitivos de câmera

## 🚀 Deploy e Acesso

### **🌐 Aplicação (Vercel)**

* **URL**: `previa-unique-3d-viewer.vercel.app`
* **Status**: ✅ Deployado e Funcionando
* **Acesso**: Direto pelo navegador, sem instalações

## 🛠️ Tecnologias Utilizadas

* **Frontend**: React 18 + TypeScript
* **3D Engine**: Three.js + React Three Fiber
* **Styling**: Tailwind CSS
* **Ícones**: Lucide React
* **Build Tool**: Vite
* **Deploy**: Vercel
* **Versionamento**: Git + GitHub

## 📁 Estrutura do Projeto

```
previa-unique-3d-viewer/
├── public/
│   ├── ARQ.glb              # Modelo 3D principal
│   ├── Link.csv             # Dados de serviços e texturas
│   ├── Prévia Unique.png    # Logo da empresa
│   └── previa-unique.png    # Logo alternativa
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx   # Cabeçalho com logo
│   │   └── ui/
│   │       ├── CSVTable.tsx # Tabela de serviços
│   │       └── Model3DViewer.tsx # Visualizador 3D
│   ├── utils/
│   │   ├── serviceMapping.ts # Mapeamento serviços ↔ 3D
│   │   └── textureConfig.ts  # Configurações de materiais
│   └── App.tsx              # Componente principal
├── vercel.json              # Configuração de deploy
└── package.json             # Dependências do projeto
```

## 🌟 **Como Usar**

### **1. Acesse a Aplicação**
* Abra: `previa-unique-3d-viewer.vercel.app`
* Aguarde o carregamento do modelo 3D

### **2. Navegue no Modelo 3D**
* **Rotação**: Arraste com o mouse
* **Zoom**: Scroll do mouse
* **Pan**: Shift + arrastar

### **3. Interaja com a Tabela**
* **Clique em uma linha**: Destaca elementos no 3D
* **Ícone do olho**: Oculta/mostra elementos
* **Cores**: Cada serviço tem cor específica

### **4. Visualize Texturas**
* **Paredes**: Pintura bege claro
* **Pisos**: Porcelanato branco
* **Telhados**: Telha vermelha
* **Vidros**: Transparente azul
* **Asfalto**: Preto rugoso

## 🎨 Sistema de Cores

| Material | Cor | Rugosidade | Aplicação |
|----------|-----|------------|-----------|
| Pintura | `#F5F5DC` | 0.3 | Paredes |
| Asfalto | `#2F2F2F` | 0.95 | Calçadas |
| Porcelanato | `#F8F8FF` | 0.05 | Pisos |
| Telha | `#8B0000` | 0.8 | Telhados |
| Vidro | `#87CEEB` | 0.0 | Janelas |
| Madeira | `#8B4513` | 0.7 | Estruturas |

## 🔧 Configuração para Produção

### **Vercel Configuration**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📱 Responsividade

* ✅ Desktop (1024px+)
* ✅ Tablet (768px - 1023px)
* ✅ Mobile (320px - 767px)

## 🎨 Design System

* **Cores**: Paleta baseada em azul, laranja e cinza
* **Tipografia**: Inter + Lucide React
* **Componentes**: Cards, tabelas, controles 3D
* **Animações**: Hover effects, transições suaves

## 🚀 **Vantagens do Deploy Vercel**

* ✅ **Sem Instalação**: Acesso direto pelo navegador
* ✅ **Sempre Atualizado**: Deploy automático do GitHub
* ✅ **Performance**: CDN global para carregamento rápido
* ✅ **Responsivo**: Funciona em qualquer dispositivo
* ✅ **Seguro**: HTTPS automático e proteções de segurança

## 📊 Logs de Debug

No console do navegador você verá:
- `📊 CSV carregado: X itens`
- `🎨 Iniciando aplicação de texturas baseadas no CSV...`
- `🎨 Objeto: [nome] - Textura: [tipo]`
- `✅ Aplicadas X texturas baseadas no CSV`

## 📞 Suporte

Para dúvidas ou problemas:
* Abra uma issue no GitHub
* Entre em contato com a equipe de desenvolvimento

## 📄 Licença

© 2024 Prévia Unique - Visualizador 3D Interativo. Todos os direitos reservados.

---

**Desenvolvido com ❤️ pela equipe de Desenvolvimento 3D**