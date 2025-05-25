"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getStripe, DonationItem, PixPayment } from "@/lib/stripe";
import { toast } from "sonner";
import PixModal from "./pix-modal";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: string;
  campaignTitle?: string;
}

export default function DonateModal({
  isOpen,
  onClose,
  campaignId = "mateus-campaign",
  campaignTitle = "Campanha do Mateus"
}: DonateModalProps) {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixData, setPixData] = useState<PixPayment | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    document: "",
    phone: "",
  });

  const predefinedAmounts = [
    { value: "50", label: "R$ 50" },
    { value: "100", label: "R$ 100" },
    { value: "200", label: "R$ 200" },
    { value: "500", label: "R$ 500" },
  ];

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount("");
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (amount || customAmount)) {
      setStep(2);
    } else if (step === 2) {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const donationAmount = amount ? parseFloat(amount) : parseFloat(customAmount);

      // Create donation item
      const donationItem: DonationItem = {
        amount: donationAmount,
        currency: 'brl',
        name: `Doação para ${campaignTitle}`,
        description: `Sua contribuição para ajudar: ${campaignTitle}`,
        quantity: 1,
      };

      if (paymentMethod === 'card') {
        // Use Stripe Checkout for card payments
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            donationItem,
            donorInfo,
            campaignId,
          }),
        });

        const { url } = await response.json();

        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Falha ao criar sessão de pagamento');
        }
      } else if (paymentMethod === 'pix') {
        // Generate real PIX code
        const response = await fetch('/api/generate-pix', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: donationAmount,
            description: `Doação ${campaignTitle}`,
            donorName: donorInfo.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao gerar PIX');
        }

        const pixData = await response.json();
        setPixData(pixData);
        setShowPixModal(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Erro no processamento", {
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      });
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setCustomAmount("");
    setPaymentMethod("pix");
    setStep(1);
    setPixData(null);
    setShowPixModal(false);
    setDonorInfo({
      name: "",
      email: "",
      document: "",
      phone: "",
    });
  };

  const handlePixModalClose = () => {
    setShowPixModal(false);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  if (showPixModal && pixData) {
    return (
      <PixModal
        isOpen={showPixModal}
        onClose={handlePixModalClose}
        pixData={pixData}
        amount={amount ? parseFloat(amount) : parseFloat(customAmount)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Fazer uma doação</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <Separator className="my-4" />

          {step === 1 && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Escolha um valor</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {predefinedAmounts.map((option) => (
                    <button
                      key={option.value}
                      className={`p-3 border rounded-md text-center ${amount === option.value ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                      onClick={() => handleAmountSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Outro valor"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Forma de pagamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card
                    className={`p-4 cursor-pointer ${paymentMethod === 'pix' ? 'border-green-500' : ''}`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.5 13.5L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.5 8.5L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 18L8.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 6L18.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.786 18.9623L7.09806 13.2744C6.96667 13.143 6.96667 12.9279 7.09806 12.7965L12.786 7.10859C12.9174 6.9772 13.1325 6.9772 13.2639 7.10859L18.9519 12.7965C19.0833 12.9279 19.0833 13.143 18.9519 13.2744L13.2639 18.9623C13.1325 19.0937 12.9174 19.0937 12.786 18.9623Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Pix</p>
                        <p className="text-sm text-gray-600">Instantâneo</p>
                      </div>
                    </div>
                  </Card>
                  <Card
                    className={`p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-green-500' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 10H2M22 12V8.2C22 7.0799 22 6.51984 21.782 6.09202C21.5903 5.7157 21.2843 5.40974 20.908 5.21799C20.4802 5 19.9201 5 18.8 5H5.2C4.0799 5 3.51984 5 3.09202 5.21799C2.7157 5.40973 2.40973 5.71569 2.21799 6.09202C2 6.51984 2 7.0799 2 8.2V15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.07989 19 5.2 19H18.8C19.9201 19 20.4802 19 20.908 18.782C21.2843 18.5903 21.5903 18.2843 21.782 17.908C22 17.4802 22 16.9201 22 15.8V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Cartão</p>
                        <p className="text-sm text-gray-600">Crédito ou débito</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Seus dados</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={donorInfo.name}
                    onChange={handleDonorInfoChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={donorInfo.email}
                    onChange={handleDonorInfoChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="document">CPF</Label>
                  <Input
                    id="document"
                    name="document"
                    value={donorInfo.document}
                    onChange={handleDonorInfoChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={donorInfo.phone}
                    onChange={handleDonorInfoChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              className="btn-home-1 w-full"
              onClick={handleNext}
              disabled={(!amount && !customAmount) && step === 1 || isProcessing}
            >
              {isProcessing
                ? "Processando..."
                : step === 1
                  ? "Continuar"
                  : paymentMethod === 'pix'
                    ? "Gerar PIX"
                    : "Ir para pagamento"
              }
            </button>

            {step === 2 && !isProcessing && (
              <button
                className="w-full text-center mt-3 text-gray-600 hover:text-gray-800"
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}