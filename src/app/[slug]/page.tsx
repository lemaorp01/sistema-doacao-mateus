"use client";

import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import Image from "next/image";
import DonateModal from "@/components/donate-modal";
import { getCampaignBySlug, getAllCampaigns, CampaignData } from "@/lib/campaign-randomizer";
import { trackPageView } from "@/lib/pixel-tracking";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  // Gera as rotas estáticas para todas as campanhas
  const campaigns = getAllCampaigns();
  return campaigns.map((campaign) => ({
    slug: campaign.slug.replace("/", ""),
  }));
}

export default function CampaignPage({ params }: { params: { slug: string } }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("contexto");
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  useEffect(() => {
    // Normaliza o slug para busca
    const normalizedSlug = params.slug ? `/${params.slug}` : "/";

    // Busca os dados da campanha pelo slug
    const campaign = getCampaignBySlug(normalizedSlug);

    if (!campaign) {
      notFound();
      return;
    }

    setCampaignData(campaign);

    // Rastreia visualização da página
    trackPageView(`campaign_${campaign.id}`, campaign.id);
  }, [params.slug]);

  // Componente para o alerta de urgência
  const TimeIsRunning = () => {
    if (!campaignData) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 my-4 animate-pulse">
        <p className="text-red-600 font-bold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          URGENTE: {campaignData.patientName} tem apenas {campaignData.daysRemaining} dias para conseguir sua cirurgia!
        </p>
      </div>
    );
  };

  // Se os dados da campanha ainda não foram carregados
  if (!campaignData) {
    return <div className="container mx-auto p-8 text-center">Carregando...</div>;
  }

  // Calcula o percentual arrecadado
  const percentRaised = (campaignData.raised / campaignData.goal) * 100;

  return (
    <div className="mt-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content - 8 columns on large screens */}
          <div className="lg:col-span-8">
            {/* Banner */}
            <div className="mb-3 rounded-md overflow-hidden">
              <Image
                src={campaignData.bannerImage}
                alt={`Banner da campanha de ${campaignData.patientName}`}
                width={736}
                height={386}
                className="w-full h-auto"
              />
            </div>

            {/* Title */}
            <h1 className="mb-3 text-2xl md:text-3xl font-bold">
              {campaignData.title}
            </h1>

            <TimeIsRunning />

            {/* Campaign tags */}
            <div className="border-t border-b py-2 mb-4">
              <button className="filter-button my-1">Doação Protegida</button>
              <button className="filter-button my-1">Campanha Transparente</button>
            </div>

            {/* Necessity tag */}
            <div className="mb-4">
              <Card className="p-3 max-w-md">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 9V11C21 15.418 21 17.627 19.828 18.828C18.627 20 16.418 20 12 20C7.582 20 5.373 20 4.172 18.828C3 17.627 3 15.418 3 11V9C3 7.114 3 6.172 3.281 5.414C3.731 4.214 4.651 3.264 5.828 2.804C6.558 2.5 7.47 2.5 9.292 2.5H14.708C16.53 2.5 17.442 2.5 18.172 2.804C19.349 3.264 20.269 4.214 20.719 5.414C21 6.172 21 7.114 21 9Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 13H10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 2.5V6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 2.5V6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Necessidade Imediata
                    </h3>
                    <p className="text-sm">
                      Verificada
                      <Image
                        src="https://ext.same-assets.com/3916209880/450811750.svg"
                        width={16}
                        height={14}
                        alt="Ícone verificado"
                        className="inline-block ml-1"
                      />
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Campaign content */}
            <div className="mb-6">
              <div className="border rounded-md">
                <div className="border-b">
                  <ul className="flex">
                    <li
                      className={`p-4 cursor-pointer ${
                        activeTab === "contexto"
                          ? "border-b-2 border-green-600 font-medium"
                          : ""
                      }`}
                      onClick={() => setActiveTab("contexto")}
                    >
                      Contexto
                    </li>
                  </ul>
                </div>

                <div className="p-4">
                  {activeTab === "contexto" && (
                    <div>
                      <p className="text-lg mb-4">
                        <strong className="text-red-600 text-xl">QUE SOFRIMENTO 😢</strong>
                        <br />
                        {campaignData.story[0]}
                      </p>

                      <div className="my-6">
                        <Image
                          src={campaignData.contentImage}
                          alt={`Imagens de ${campaignData.patientName}`}
                          width={712}
                          height={401}
                          className="w-full h-auto rounded-md"
                        />
                      </div>

                      {campaignData.testimonial && (
                        <div className="bg-blue-50 p-4 rounded-md mb-4 border-l-4 border-blue-500">
                          <p className="italic text-blue-800 font-medium">
                            "{campaignData.testimonial.quote}"
                            <span className="block mt-1 text-sm text-gray-700">— {campaignData.testimonial.author}</span>
                          </p>
                        </div>
                      )}

                      {campaignData.story.slice(1).map((paragraph, index) => (
                        <p key={index} className="text-lg mb-4">
                          {index === 0 ? (
                            <span>
                              {paragraph.includes("esperar") ? (
                                <>
                                  {paragraph.split("esperar!")[0]}
                                  <span className="text-red-600 font-bold">esperar!</span>
                                  {paragraph.split("esperar!")[1] && (
                                    <strong className="text-red-600 text-xl"> MUITO SOFRIMENTO!</strong>
                                  )}
                                </>
                              ) : (
                                paragraph
                              )}
                            </span>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}

                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                        <p className="text-lg font-bold text-yellow-800 mb-2">⏰ O tempo está se esgotando!</p>
                        <p className="text-md">
                          <span className="text-red-600 font-bold">NÃO PODEMOS ESPERAR MAIS!</span> {campaignData.patientName} precisa da nossa ajuda {" "}
                          <strong className="text-blue-600 text-lg">
                            {campaignData.patientName} tem apenas {campaignData.patientAge} anos e uma vida linda pra viver
                          </strong>.
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-md mb-6">
                        <p className="text-green-800 font-medium mb-2">💰 Sua doação faz diferença REAL:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><span className="font-bold">R$ 20</span> - Ajuda com medicamentos para dor</li>
                          <li><span className="font-bold">R$ 50</span> - Contribui para o transporte às consultas</li>
                          <li><span className="font-bold">R$ 100</span> - Ajuda com exames pré-operatórios</li>
                          <li><span className="font-bold">R$ 200+</span> - Contribuição significativa para a cirurgia</li>
                        </ul>
                        <p className="mt-3 text-center">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
                            onClick={() => setShowDonateModal(true)}
                          >
                            Quero ajudar agora
                          </button>
                        </p>
                      </div>

                      <Separator className="my-8" />

                      <h3 className="text-xl font-medium mb-4">
                        PARA ONDE SERÃO DESTINADAS AS DOAÇÕES?
                      </h3>
                      <p className="text-lg mb-4">
                        Eles precisam <span className="text-red-600 font-bold">desesperadamente</span> de ajuda.
                      </p>
                      <p className="text-lg mb-4">
                        O dinheiro arrecadado será usado para:
                      </p>
                      <ul className="list-none space-y-3 mb-4 ml-4">
                        {campaignData.destinationList.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <span className="bg-green-100 text-green-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">{index + 1}</span>
                            <span className="font-bold">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-md mb-6">
                        <p className="text-gray-700 italic">
                          "Cada dia que passa sem a cirurgia, a condição piora. Não podemos mais esperar. <span className="font-bold">Cada doação é um passo para salvar {campaignData.patientName}.</span>"
                        </p>
                      </div>

                      <Separator className="my-8" />

                      <p className="text-gray-600 font-medium">
                        Sobre nossas campanhas
                      </p>

                      <p className="text-gray-600 mb-4">
                        Apuramos e verificamos todas as histórias antes de serem
                        publicadas. Assim, você pode doar com total segurança,
                        sabendo que sua contribuição vai realmente fazer a
                        diferença na vida de quem precisa. Após o encerramento
                        da campanha, compartilhamos nas nossas redes sociais o
                        destino das doações e a transformação que elas geraram
                        na vida dessas pessoas.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 4 columns on large screens */}
          <div className="lg:col-span-4 sticky top-4 self-start">
            <Card className="p-6">
              <div className="mb-4">
                <p className="mb-3">
                  <span className="color-principal font-bold text-2xl">
                    R$ {campaignData.raised.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-gray-600">
                    {" "}
                    captados da meta de R$ {campaignData.goal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </p>

                <Progress value={percentRaised} className="h-2 mb-3" />

                <div className="flex justify-between">
                  <div>
                    <p className="flex items-center cursor-pointer">
                      <span className="color-principal font-bold text-2xl">
                        {campaignData.donorsCount}
                      </span>
                      <span className="ml-1">Doadores</span>
                      <Image
                        src="https://ext.same-assets.com/3916209880/658060486.svg"
                        alt="Ver doadores"
                        width={16}
                        height={15}
                        className="ml-1"
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-right">
                      <span className="color-principal font-bold text-2xl">
                        {campaignData.daysRemaining}
                      </span>
                      <span className="ml-1 text-red-600 font-bold">dias restantes</span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="btn-home-1 mb-3 relative overflow-hidden group"
                onClick={() => setShowDonateModal(true)}
              >
                <span className="absolute -inset-x-1 -bottom-1 h-1 bg-white/20 animate-[shimmer_2s_infinite]"></span>
                Doar agora
              </button>

              <p className="text-sm text-center text-gray-600 mb-4">
                Sua doação pode <span className="font-bold text-blue-600">salvar a vida {campaignData.patientName === 'Mateus' ? 'dele' : 'dela'}</span>
              </p>
            </Card>

            {/* Últimos doadores */}
            <Card className="p-6 mt-4">
              <h3 className="font-bold text-lg mb-4">ÚLTIMOS 10 DOADORES</h3>
              <p className="text-sm text-gray-600 mb-4">
                Lista atualizada automaticamente em tempo real.
              </p>

              <div className="bg-blue-50 p-3 rounded-md mb-4 text-center">
                <p className="text-blue-700 font-medium">
                  Junte-se a essas pessoas generosas que já ajudaram {campaignData.patientName}!
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 21V19C3 17.9391 3.42143 16.9217 4.17157 16.1716C4.92172 15.4214 5.93913 15 7 15H17C18.0609 15 19.0783 15.4214 19.8284 16.1716C20.5786 16.9217 21 17.9391 21 19V21"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Amanda J.</p>
                    <p className="text-sm">
                      <strong>Doou R$ 20,00</strong> há 7 minutos.
                    </p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 21V19C3 17.9391 3.42143 16.9217 4.17157 16.1716C4.92172 15.4214 5.93913 15 7 15H17C18.0609 15 19.0783 15.4214 19.8284 16.1716C20.5786 16.9217 21 17.9391 21 19V21"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Pedro D.</p>
                    <p className="text-sm">
                      <strong>Doou R$ 10,00</strong> há 31 minutos.
                    </p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 21V19C3 17.9391 3.42143 16.9217 4.17157 16.1716C4.92172 15.4214 5.93913 15 7 15H17C18.0609 15 19.0783 15.4214 19.8284 16.1716C20.5786 16.9217 21 17.9391 21 19V21"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Ricardo S.</p>
                    <p className="text-sm">
                      <strong>Doou R$ 50,00</strong> há 38 minutos.
                    </p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 21V19C3 17.9391 3.42143 16.9217 4.17157 16.1716C4.92172 15.4214 5.93913 15 7 15H17C18.0609 15 19.0783 15.4214 19.8284 16.1716C20.5786 16.9217 21 17.9391 21 19V21"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Júlia A.</p>
                    <p className="text-sm">
                      <strong>Doou R$ 33,00</strong> há 46 minutos.
                    </p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 21V19C3 17.9391 3.42143 16.9217 4.17157 16.1716C4.92172 15.4214 5.93913 15 7 15H17C18.0609 15 19.0783 15.4214 19.8284 16.1716C20.5786 16.9217 21 17.9391 21 19V21"
                        stroke="#4B78BC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Bárbara P.</p>
                    <p className="text-sm">
                      <strong>Doou R$ 17,28</strong> há 58 minutos.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-center text-sm font-bold text-red-600">
                  Apenas {campaignData.daysRemaining} dias para atingir a meta!
                </p>
                <button
                  className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors"
                  onClick={() => setShowDonateModal(true)}
                >
                  Seja o próximo a ajudar
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        campaignId={campaignData.id}
        campaignTitle={`Campanha do ${campaignData.patientName}`}
      />
    </div>
  );
}