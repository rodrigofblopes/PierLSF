# 🏗️ Clínica 3D Viewer

Um visualizador 3D moderno e interativo para modelos arquitetônicos, construído com React, Three.js e TypeScript.

## ✨ Características

- **Visualização 3D Avançada**: Suporte completo para arquivos GLB/GLTF
- **Interface Moderna**: Design responsivo com Tailwind CSS
- **Controles Intuitivos**: Câmera, iluminação e exibição personalizáveis
- **Performance Otimizada**: Lazy loading e otimizações de renderização
- **Animações Suaves**: Transições fluidas com GSAP
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **3D**: Three.js + React Three Fiber + Drei
- **Styling**: Tailwind CSS
- **Animações**: GSAP
- **Build**: Vite
- **Linting**: ESLint + TypeScript

## 🚀 Instalação

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd clinica-3d-viewer
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure os arquivos 3D**:
   - Coloque seus arquivos `.glb` ou `.gltf` na pasta `public/`
   - Atualize o array `availableModels` em `src/App.tsx` se necessário

4. **Execute o projeto**:
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**:
   - Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── 3d/              # Componentes 3D
│   │   └── ModelViewer.tsx
│   ├── ui/              # Componentes de interface
│   │   ├── ControlPanel.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   └── layout/          # Componentes de layout
│       ├── Header.tsx
│       └── FileSelector.tsx
├── hooks/               # Custom hooks
│   └── useViewerState.ts
├── types/               # Definições TypeScript
│   └── index.ts
├── utils/               # Utilitários
│   └── cn.ts
├── styles/              # Estilos customizados
│   └── animations.css
├── App.tsx              # Componente principal
├── main.tsx             # Ponto de entrada
└── index.css            # Estilos globais
```

## 🎮 Como Usar

### Carregando Modelos

1. **Modelos Pré-carregados**: Selecione um dos modelos disponíveis na sidebar
2. **Upload de Arquivo**: Arraste e solte um arquivo GLB/GLTF ou clique para selecionar
3. **Formatos Suportados**: `.glb`, `.gltf`

### Controles 3D

- **Câmera**:
  - 🖱️ **Rotação**: Clique e arraste
  - 🔍 **Zoom**: Scroll do mouse
  - 📱 **Pan**: Clique direito + arraste
  - 🔄 **Auto-rotação**: Ative no painel de controles

- **Exibição**:
  - 📐 **Grade**: Mostra/oculta grade de referência
  - 📏 **Eixos**: Mostra/oculta eixos coordenados
  - 🔲 **Wireframe**: Alterna entre sólido e wireframe

- **Iluminação**:
  - ☀️ **Ambiente**: Controla iluminação ambiente
  - 💡 **Direcional**: Controla intensidade da luz direcional
  - 🌑 **Sombras**: Ativa/desativa sombras

### Funcionalidades

- **Download**: Baixe o modelo atual
- **Compartilhamento**: Compartilhe a visualização
- **Reset**: Restaura configurações padrão
- **Responsivo**: Interface adaptável para mobile

## 🔧 Configuração Avançada

### Adicionando Novos Modelos

1. Coloque o arquivo `.glb` ou `.gltf` na pasta `public/`
2. Atualize o array `availableModels` em `src/App.tsx`:

```typescript
const availableModels: ModelInfo[] = [
  {
    name: 'SeuModelo.glb',
    path: '/SeuModelo.glb',
    format: 'glb',
    description: 'Descrição do seu modelo',
  },
  // ... outros modelos
];
```

### Personalizando Controles

Modifique os controles padrão em `src/hooks/useViewerState.ts`:

```typescript
const initialControls: ViewerControls = {
  autoRotate: false,
  enableZoom: true,
  enablePan: true,
  enableRotate: true,
  showGrid: true,
  showAxes: true,
  wireframe: false,
};
```

### Otimizações de Performance

- **LOD (Level of Detail)**: Implementado automaticamente
- **Frustum Culling**: Ativado por padrão
- **Shadow Mapping**: Configurável via controles
- **Texture Compression**: Suporte para WebP e Basis

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Build Local

```bash
npm run build
npm run preview
```

## 🐛 Solução de Problemas

### Modelo não carrega
- Verifique se o arquivo está na pasta `public/`
- Confirme se o formato é `.glb` ou `.gltf`
- Verifique o console do navegador para erros

### Performance lenta
- Reduza a qualidade das texturas
- Desative sombras se não necessário
- Use modelos com menos polígonos

### Erro de CORS
- Certifique-se de que os arquivos estão na pasta `public/`
- Para desenvolvimento local, use `npm run dev`

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificação de código

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [Three.js](https://threejs.org/) - Biblioteca 3D
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - Integração React + Three.js
- [Drei](https://github.com/pmndrs/drei) - Helpers para R3F
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [GSAP](https://greensock.com/gsap/) - Animações
