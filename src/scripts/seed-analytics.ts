import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Semeando dados de Analytics...');

  // 1. Limpar dados antigos (opcional, mas bom para o teste)
  // await prisma.pageView.deleteMany();
  // await prisma.linkClick.deleteMany();

  const pages = ['/', '/projects', '/about', '/contact'];
  const devices = ['desktop', 'mobile', 'tablet'];
  const browsers = ['chrome', 'firefox', 'safari'];
  const countries = ['Brasil', 'EUA', 'Portugal', 'Alemanha'];
  const links = ['whatsapp', 'github', 'linkedin', 'projeto_lanchonete', 'projeto_ia'];

  // Gerar Visitas (últimos 30 dias)
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Aleatoriedade de visitas por dia (10 a 50)
    const dailyVisits = Math.floor(Math.random() * 40) + 10;
    
    const views = Array.from({ length: dailyVisits }).map(() => ({
      page: pages[Math.floor(Math.random() * pages.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      createdAt: new Date(date.getTime() + Math.random() * 86400000), // Hora aleatória no dia
    }));

    await prisma.pageView.createMany({ data: views });
  }

  // Gerar Cliques
  const clicks = Array.from({ length: 150 }).map(() => ({
    link: links[Math.floor(Math.random() * links.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000),
  }));

  await prisma.linkClick.createMany({ data: clicks });

  // Gerar Tentativas Bloqueadas
  const emails = ['hacker@gmail.com', 'admin@teste.com', 'user123@hotmail.com', 'rober@outlook.com'];
  const ips = ['192.168.1.1', '10.0.0.15', '172.217.15.123', '34.212.11.88'];
  
  const blockedAttempts = Array.from({ length: 15 }).map(() => ({
    email: emails[Math.floor(Math.random() * emails.length)],
    ip: ips[Math.floor(Math.random() * ips.length)],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: new Date(Date.now() - Math.random() * 7 * 86400000), // Últimos 7 dias
  }));

  await prisma.blockedAttempt.createMany({ data: blockedAttempts });

  console.log('✅ Analytics e Segurança semeados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
