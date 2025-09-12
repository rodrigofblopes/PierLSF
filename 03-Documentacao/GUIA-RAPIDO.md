# ⚡ Guia Rápido - Template de Projetos

## 🚀 Criar Novo Projeto (5 minutos)

### 1. Executar Script
```bash
cd "01-Template-Base"
node create-new-project.js
```

### 2. Responder Perguntas
- Nome do projeto: `Meu Projeto`
- Empresa: `Minha Empresa`
- Logo: `/logo.jpg`
- Cor primária: `blue`
- Cor secundária: `yellow`

### 3. Executar Projeto
```bash
cd "../02-Projetos-Ativos/meu-projeto"
npm install
npm run dev
```

## 📁 Estrutura de Arquivos

```
meu-projeto/
├── public/                 # Imagens e documentos
│   ├── logo.jpg           # Logo da empresa
│   ├── foto1.jpg          # Fotos do projeto
│   └── documento.pdf      # Documentos
├── src/
│   └── App.tsx            # Código principal
├── project-config.json    # Configurações
└── package.json           # Dependências
```

## ⚙️ Configurações Essenciais

### `project-config.json`
```json
{
  "project": {
    "name": "Nome do Projeto",
    "company": "Nome da Empresa",
    "logo": "/logo.jpg"
  },
  "branding": {
    "primaryColor": "blue",
    "secondaryColor": "yellow"
  }
}
```

## 🎨 Cores Disponíveis

**Primárias**: black, blue, red, green, purple, indigo, gray  
**Secundárias**: yellow, orange, pink, teal, cyan, emerald

## 📸 Adicionar Imagens

1. Coloque em `public/`
2. Atualize `project-config.json`:
```json
{
  "images": [
    {
      "src": "/minha-foto.jpg",
      "alt": "Descrição",
      "title": "Título"
    }
  ]
}
```

## 📄 Adicionar Documentos

1. Coloque PDFs em `public/`
2. Atualize projetos:
```json
{
  "files": [
    { "name": "documento.pdf", "path": "/documento.pdf" }
  ]
}
```

## 🚀 Deploy

### Local
```bash
npm run dev
```

### Produção
```bash
npm run build
```

## ❓ Problemas Comuns

**Erro de dependências**: `npm install`  
**Imagens não carregam**: Verificar caminhos em `public/`  
**Cores não aplicam**: Verificar nomes no Tailwind CSS  

## 📞 Ajuda

- Documentação completa: `README.md`
- Exemplos: `Template-Projeto/`
- Configurações: `project-config.json`