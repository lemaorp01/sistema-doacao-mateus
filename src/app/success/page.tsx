"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // In a real app, you would verify the session with Stripe
    // For demo purposes, we'll just simulate this
    if (sessionId) {
      // Simulate loading
      setTimeout(() => {
        setSession({
          id: sessionId,
          amount_total: 10000,
          currency: "brl",
          customer_details: {
            email: "doador@example.com",
            name: "João Silva",
          },
        });
        setIsLoading(false);
      }, 1500);
    } else {
      setError("Sessão de pagamento não encontrada");
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Processando pagamento...</h1>
          <p className="text-gray-600">Por favor, aguarde enquanto confirmamos sua doação.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Ocorreu um erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="btn-home-1 inline-block px-6">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Doação realizada com sucesso!</h1>
            <p className="text-gray-600">
              Obrigado pela sua generosidade. Sua contribuição fará a diferença na vida da Pietra.
            </p>
          </div>

          <div className="mb-8 border rounded-md p-4 bg-gray-50">
            <h2 className="font-semibold mb-3">Detalhes da transação</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor da doação:</span>
                <span className="font-medium">
                  R$ {(session?.amount_total / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID da transação:</span>
                <span className="font-mono text-xs">{session?.id.substring(0, 16)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Enviamos um recibo para o seu e-mail.
              Agradecemos por fazer parte desta corrente de solidariedade!
            </p>
            <Link href="/" className="btn-home-1 inline-block px-6">
              Voltar para a página inicial
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}