"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PixPayment, checkPixPaymentStatus } from "@/lib/stripe";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: PixPayment | null;
  amount: number;
}

export default function PixModal({ isOpen, onClose, pixData, amount }: PixModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [statusChecking, setStatusChecking] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Atualiza o contador de tempo
    if (isOpen && pixData) {
      const updateTimeLeft = () => {
        const expiry = new Date(pixData.expiresAt).getTime();
        const now = new Date().getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          clearInterval(intervalId);
          setTimeLeft("Expirado");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      };

      updateTimeLeft();
      intervalId = setInterval(updateTimeLeft, 1000);

      // Verifica o status do pagamento a cada 10 segundos
      const statusInterval = setInterval(async () => {
        if (pixData.paymentId && !statusChecking) {
          setStatusChecking(true);
          try {
            const status = await checkPixPaymentStatus(pixData.paymentId);
            if (status === 'completed') {
              toast.success("Pagamento confirmado! Obrigado pela sua doação!");
              clearInterval(statusInterval);
              clearInterval(intervalId);
              setTimeout(onClose, 2000);
            } else if (status === 'expired') {
              toast.error("Este PIX expirou. Por favor, gere um novo.");
              clearInterval(statusInterval);
              clearInterval(intervalId);
            }
          } finally {
            setStatusChecking(false);
          }
        }
      }, 10000);

      return () => {
        clearInterval(intervalId);
        clearInterval(statusInterval);
      };
    }
  }, [isOpen, pixData, onClose, statusChecking]);

  const copyToClipboard = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      setIsCopied(true);
      toast.success("Código PIX copiado!");

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  if (!isOpen || !pixData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Pagamento via PIX</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <Separator className="my-4" />

          <div className="text-center mb-4">
            <p className="font-medium">Valor da doação</p>
            <p className="text-2xl font-bold text-[#15346a]">
              R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Tempo restante: <span className="font-medium">{timeLeft}</span>
            </p>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              {/* QR Code */}
              <div className="w-60 h-60 mx-auto relative">
                <img
                  src={pixData.qrCodeImage}
                  alt="QR Code PIX"
                  className="w-full h-full"
                />
              </div>
            </div>

            <button
              className="w-full py-3 bg-[#15346a] text-white font-medium rounded-md hover:bg-[#122c59] transition mb-2 flex justify-center items-center"
              onClick={copyToClipboard}
            >
              {isCopied ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Código PIX Copiado!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                  Copiar Código PIX
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-md text-sm">
            <h3 className="font-medium text-blue-800 mb-2">Como pagar com PIX:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Abra o aplicativo do seu banco</li>
              <li>Acesse a área de PIX</li>
              <li>Selecione "Pagar com QR Code" ou "Copiar e colar"</li>
              <li>Escaneie o QR code acima ou cole o código copiado</li>
              <li>Confira os dados e confirme o pagamento</li>
            </ol>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Após o pagamento, aguarde alguns instantes para a confirmação automática.
          </p>
        </div>
      </div>
    </div>
  );
}