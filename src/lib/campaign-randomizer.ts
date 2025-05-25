// Definição dos tipos de campanha
export interface CampaignData {
  id: string;
  slug: string;
  title: string;
  bannerImage: string;
  contentImage: string;
  description: string;
  patientName: string;
  patientAge: number;
  condition: string;
  location: string;
  raised: number;
  goal: number;
  donorsCount: number;
  daysRemaining: number;
  story: string[];
  testimonial?: {
    quote: string;
    author: string;
  };
  destinationList: string[];
}
// Lista de campanhas disponíveis
const availableCampaigns: CampaignData[] = [
  {
    id: "mateus-campaign",
    slug: "/",
    title: "Menino com escoliose grave chora todos os dias com muita dor e precisa de cirurgia",
    bannerImage: "https://ext.same-assets.com/4073814682/524035916.png",
    contentImage: "https://ext.same-assets.com/4073814682/524035916.png",
    description: "Mateus precisa de uma cirurgia urgente para tratar sua escoliose grave e paralisia cerebral.",
    patientName: "Mateus",
    patientAge: 9,
    condition: "Escoliose grave e paralisia cerebral",
    location: "São Paulo, SP",
    raised: 18750,
    goal: 50000,
    donorsCount: 234,
    daysRemaining: 45,
    story: [
      "Mateus é um menino de apenas 9 anos que enfrenta uma batalha diária contra a dor causada por uma escoliose grave associada à paralisia cerebral. Sua condição médica complexa requer uma cirurgia especializada urgente que pode transformar sua qualidade de vida.",
      "A cada dia que passa, a dor aumenta e sua mobilidade diminui. Os médicos alertam que sem a intervenção cirúrgica adequada, seu quadro pode se agravar irreversivelmente.",
      "Sua família tem lutado incansavelmente para conseguir os recursos necessários para a cirurgia, mas o alto custo do procedimento torna essa missão quase impossível sem ajuda."
    ],
    testimonial: {
      quote: "Cada dia é uma luta para o Mateus. Vê-lo chorar de dor me parte o coração. Esta cirurgia é nossa única esperança.",
      author: "Maria, mãe do Mateus"
    },
    destinationList: [
      "Cirurgia especializada de correção de escoliose",
      "Materiais cirúrgicos e próteses necessárias",
      "Internação e cuidados pós-operatórios",
      "Fisioterapia e reabilitação",
      "Medicamentos e acompanhamento médico"
    ]
  },
  {
    id: "ana-campaign",
    slug: "ana-cancer",
    title: "Ana luta contra o câncer e precisa de tratamento urgente",
    bannerImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    contentImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    description: "Ana, de 12 anos, foi diagnosticada com leucemia e precisa de tratamento imediato.",
    patientName: "Ana",
    patientAge: 12,
    condition: "Leucemia Linfoblástica Aguda",
    location: "Rio de Janeiro, RJ",
    raised: 25600,
    goal: 80000,
    donorsCount: 156,
    daysRemaining: 60,
    story: [
      "Ana sempre foi uma criança cheia de energia e sonhos. Aos 12 anos, descobriu que tem leucemia linfoblástica aguda, um tipo de câncer que ataca as células do sangue.",
      "O diagnóstico veio como um choque para toda a família. De repente, nossa menina alegre se viu enfrentando um inimigo invisível que ameaça seus sonhos de futuro.",
      "O tratamento é longo e custoso, incluindo quimioterapia intensiva e possível transplante de medula óssea. Cada dia é precioso na luta pela vida da Ana."
    ],
    testimonial: {
      quote: "Ana é uma guerreira. Ela me inspira todos os dias com sua força e determinação.",
      author: "Carlos, pai da Ana"
    },
    destinationList: [
      "Sessões de quimioterapia",
      "Exames e monitoramento constante",
      "Medicamentos especializados",
      "Possível transplante de medula óssea",
      "Cuidados médicos especializados"
    ]
  },
  {
    id: "pedro-campaign",
    slug: "pedro-cardiaco",
    title: "Pedro nasceu com problema no coração e precisa de cirurgia",
    bannerImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    contentImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    description: "Pedro, de apenas 6 meses, nasceu com cardiopatia congênita e precisa de cirurgia cardíaca urgente.",
    patientName: "Pedro",
    patientAge: 0, // 6 meses
    condition: "Cardiopatia Congênita Complexa",
    location: "Belo Horizonte, MG",
    raised: 32100,
    goal: 120000,
    donorsCount: 287,
    daysRemaining: 30,
    story: [
      "Pedro chegou ao mundo lutando pela vida. Nasceu com uma cardiopatia congênita complexa que requer intervenção cirúrgica imediata para que possa ter uma chance de crescer como qualquer criança.",
      "Aos 6 meses de vida, Pedro já passou por diversas internações e procedimentos. Seu pequeno coração guerreiro precisa de uma cirurgia especializada que pode salvar sua vida.",
      "Cada dia é uma corrida contra o tempo. Os médicos alertam que a janela para a cirurgia está se fechando, e precisamos agir rapidamente."
    ],
    testimonial: {
      quote: "Pedro é nosso milagre. Vamos lutar por cada batimento do seu coraçãozinho.",
      author: "Fernanda, mãe do Pedro"
    },
    destinationList: [
      "Cirurgia cardíaca pediátrica especializada",
      "UTI neonatal e cuidados intensivos",
      "Equipamentos médicos especializados",
      "Medicamentos cardíacos pediátricos",
      "Acompanhamento médico especializado"
    ]
  }
];
// Função para obter uma campanha aleatória
export function getRandomCampaign(): CampaignData {
  const randomIndex = Math.floor(Math.random() * availableCampaigns.length);
  return availableCampaigns[randomIndex];
}
// Função para obter campanha baseada em hash (para consistência)
export function getCampaignByHash(hash: string): CampaignData {
  // Cria um hash simples para garantir que o mesmo IP veja a mesma campanha
  let hashSum = 0;
  for (let i = 0; i < hash.length; i++) {
    hashSum += hash.charCodeAt(i);
  }
  const index = hashSum % availableCampaigns.length;
  return availableCampaigns[index];
}
// Função para obter campanha por slug
export function getCampaignBySlug(slug: string): CampaignData | null {
  return availableCampaigns.find(campaign => campaign.slug === slug) || null;
}
// Função para obter todas as campanhas
export function getAllCampaigns(): CampaignData[] {
  return availableCampaigns;
}
// Função para gerar hash simples de IP
export function generateIpHash(ip: string): string {
  // Remove caracteres especiais e cria um hash simples
  return ip.replace(/[^\w]/g, '');
}