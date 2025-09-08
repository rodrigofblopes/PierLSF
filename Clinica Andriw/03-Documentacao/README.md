# 🏗️ Template de Gerenciamento de Projetos

Este é um template reutilizável para criar dashboards de gerenciamento de projetos arquitetônicos, baseado no projeto da Clínica UNIQUE.

## 📁 Estrutura do Sistema

```
Gerenciamento de Projetos/
├── 01-Template-Base/           # Template base reutilizável
│   ├── Template-Projeto/       # Código fonte do template
│   └── create-new-project.js   # Script para criar novos projetos
├── 02-Projetos-Ativos/         # Projetos criados a partir do template
├── 03-Documentacao/            # Documentação e guias
└── 04-Configuracoes/           # Configurações globais
```

## 🚀 Como Criar um Novo Projeto

### Método 1: Script Automático (Recomendado)

1. Navegue até a pasta do template:
   ```bash
   cd "01-Template-Base"
   ```

2. Execute o script de criação:
   ```bash
   node create-new-project.js
   ```

3. Siga as instruções interativas:
   - Nome do projeto
   - Nome da empresa
   - Caminho da logo
   - Cores da marca
   - Títulos das abas

### Método 2: Cópia Manual

1. Copie a pasta `Template-Projeto` para `02-Projetos-Ativos/`
2. Renomeie para o nome do seu projeto
3. Edite o arquivo `project-config.json`
4. Atualize os arquivos em `public/` com suas imagens

## ⚙️ Configuração do Projeto

### Arquivo `project-config.json`

Este arquivo controla toda a personalização do projeto:

```json
{
  "project": {
    "name": "Nome do Projeto",
    "company": "Nome da Empresa",
    "logo": "/caminho/para/logo.jpg",
    "description": "Descrição do projeto"
  },
  "branding": {
    "primaryColor": "blue",
    "secondaryColor": "yellow",
    "gradient": "from-blue via-yellow-600 to-blue",
    "accentColor": "yellow-400"
  },
  "tabs": [...],
  "images": [...],
  "projects": [...]
}
```

### Personalização de Cores

O sistema usa Tailwind CSS. Cores disponíveis:
- **Primárias**: black, blue, red, green, purple, indigo, etc.
- **Secundárias**: yellow, orange, pink, teal, cyan, etc.

Exemplo de gradiente: `from-blue via-yellow-600 to-blue`

## 📸 Adicionando Imagens

1. Coloque suas imagens na pasta `public/`
2. Atualize o array `images` no `project-config.json`:

```json
{
  "src": "/sua-imagem.jpg",
  "alt": "Descrição da imagem",
  "title": "Título da imagem"
}
```

## 📄 Adicionando Documentos

1. Coloque os PDFs na pasta `public/`
2. Atualize o array `projects` no `project-config.json`
3. Adicione os arquivos na propriedade `files` de cada projeto

## 🎨 Personalização Visual

### Header
- Logo da empresa (canto esquerdo)
- Nome da empresa (ao lado da logo)
- Título do projeto (centralizado, com efeitos visuais)

### Efeitos Visuais
- Gradientes animados
- Efeitos de brilho
- Animações de pulso
- Sombras e blur effects

### Cores da Empresa
- Header: Gradiente preto/amarelo (personalizável)
- Fundo: Gradiente suave
- Acentos: Cores da marca

## 📱 Responsividade

O template é totalmente responsivo:
- **Mobile**: Layout adaptado para telas pequenas
- **Tablet**: Layout intermediário
- **Desktop**: Layout completo

## 🔧 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool
- **Three.js** - Visualização 3D
- **Lucide React** - Ícones

## 📋 Funcionalidades

### Aba Início
- Galeria de imagens interativa
- Visualização em tela cheia
- Download de imagens
- Navegação por setas

### Aba Projetos
- Cards de projetos com progresso
- Informações do profissional responsável
- Download de arquivos
- Status visual dos projetos

### Aba Documentos
- Checklist de documentos
- Download de PDFs
- Organização por tipo de documento
- Status de aprovação

## 🚀 Deploy

### Desenvolvimento Local
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
npm run preview
```

### Deploy no Vercel
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📝 Exemplos de Uso

### Projeto de Clínica
- Fotografias pré-obra
- Projetos arquitetônicos e elétricos
- Documentos de regularização

### Projeto de Edifício Comercial
- Fotos do terreno
- Projetos estruturais
- Licenças e alvarás

### Projeto Residencial
- Imagens do local
- Plantas e projetos
- Documentação legal

## 🛠️ Manutenção

### Atualizações do Template
1. Faça melhorias no `Template-Projeto`
2. Atualize a documentação
3. Teste com novos projetos

### Backup
- Mantenha backup dos projetos ativos
- Versionamento com Git
- Documentação atualizada

## 📞 Suporte

Para dúvidas ou sugestões:
- Documentação completa neste README
- Exemplos no template base
- Configurações em `project-config.json`

---

**Template criado por**: Bonfim Imobiliária e Engenharia  
**Versão**: 1.0  
**Última atualização**: Janeiro 2025