"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getAllCampaigns } from "@/lib/campaign-randomizer";
import { trackPageView } from "@/lib/pixel-tracking";

export default function CampanhasPage() {
  // Obter todas as campanhas do sistema
  const campaigns = getAllCampaigns();

  useEffect(() => {
    // Rastrear visualização da página
    trackPageView("campaigns_list");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Campanhas Ativas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          // Calculate percentage
          const percentRaised = (campaign.raised / campaign.goal) * 100;

          return (
            <Link href={campaign.slug} key={campaign.id}>
              <Card className="overflow-hidden h-full transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative w-full h-48">
                  <Image
                    src={campaign.bannerImage}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      Necessidade Urgente
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold line-clamp-2 mb-4">
                    {campaign.title}
                  </h2>

                  <Progress value={percentRaised} className="h-2 mb-3" />

                  <div className="flex justify-between mb-2">
                    <span className="text-green-600 font-medium">
                      R$ {campaign.raised.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                    <span className="text-gray-600">
                      de R$ {campaign.goal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>{campaign.donorsCount} doadores</span>
                    <span className="text-red-600 font-semibold">{campaign.daysRemaining} dias restantes</span>
                  </div>

                  <button className="mt-4 w-full py-2 bg-[#15346a] text-white font-medium rounded-md hover:bg-[#122c59] transition">
                    Ver detalhes
                  </button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}