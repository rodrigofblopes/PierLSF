#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createNewProject() {
  console.log('🚀 Criador de Novos Projetos - Template Base\n');
  
  // Coletar informações do projeto
  const projectName = await question('📝 Nome do projeto: ');
  const companyName = await question('🏢 Nome da empresa: ');
  const logoPath = await question('🖼️  Caminho da logo (ex: /logo.jpg): ');
  const primaryColor = await question('🎨 Cor primária (ex: blue, red, green): ');
  const secondaryColor = await question('🎨 Cor secundária (ex: yellow, orange, purple): ');
  
  console.log('\n📋 Configurando abas...');
  const homeTitle = await question('🏠 Título da aba Início: ');
  const homeDescription = await question('📄 Descrição da aba Início: ');
  const galleryTitle = await question('📸 Título da galeria: ');
  
  const projectsTitle = await question('📁 Título da aba Projetos: ');
  const documentsTitle = await question('📄 Título da aba Documentos: ');
  
  // Criar nome da pasta do projeto
  const projectFolder = projectName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  const targetPath = path.join('..', '02-Projetos-Ativos', projectFolder);
  
  console.log(`\n📂 Criando projeto em: ${targetPath}`);
  
  // Copiar template
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  // Copiar arquivos do template (excluindo node_modules)
  copyTemplateFiles('./Template-Projeto', targetPath);
  
  // Atualizar configuração
  const configPath = path.join(targetPath, 'project-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Atualizar configurações
  config.project.name = projectName;
  config.project.company = companyName;
  config.project.logo = logoPath;
  config.branding.primaryColor = primaryColor;
  config.branding.secondaryColor = secondaryColor;
  config.branding.gradient = `from-${primaryColor} via-${secondaryColor}-600 to-${primaryColor}`;
  config.branding.accentColor = `${secondaryColor}-400`;
  
  // Atualizar abas
  config.tabs[0].content.title = homeTitle;
  config.tabs[0].content.description = homeDescription;
  config.tabs[0].content.gallery.title = galleryTitle;
  config.tabs[1].content.title = projectsTitle;
  config.tabs[2].content.title = documentsTitle;
  
  // Salvar configuração atualizada
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  // Atualizar package.json
  const packagePath = path.join(targetPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.name = projectFolder;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  console.log('\n✅ Projeto criado com sucesso!');
  console.log(`📁 Localização: ${targetPath}`);
  console.log('\n📋 Próximos passos:');
  console.log(`1. cd "${targetPath}"`);
  console.log('2. npm install');
  console.log('3. npm run dev');
  console.log('\n🎨 Personalize os arquivos em public/ com suas imagens e documentos');
  
  rl.close();
}

function copyTemplateFiles(src, dest) {
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (file === 'node_modules') {
      return; // Pular node_modules
    }
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyTemplateFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

createNewProject().catch(console.error);