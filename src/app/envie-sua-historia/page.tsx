"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function EnvieSuaHistoriaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    title: "",
    description: "",
    needsAmount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "História enviada com sucesso!",
        description: "Analisaremos sua história e entraremos em contato em breve.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        title: "",
        description: "",
        needsAmount: "",
      });

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Envie sua história</h1>
        <p className="text-gray-600 mb-8">
          Compartilhe sua história e necessidade conosco. Analisaremos cuidadosamente cada solicitação.
        </p>

        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Seus dados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Seu estado"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Sobre sua necessidade</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da campanha *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Um título breve e claro sobre sua necessidade"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição detalhada *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Descreva detalhadamente sua situação, necessidade e como a ajuda será utilizada"
                    className="w-full min-h-[200px] p-2 border rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="needsAmount">Valor necessário (R$) *</Label>
                  <Input
                    id="needsAmount"
                    name="needsAmount"
                    type="number"
                    value={formData.needsAmount}
                    onChange={handleChange}
                    required
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="btn-home-1 w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar minha história"}
              </button>
            </div>
          </form>
        </Card>

        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Como funciona o processo?</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Recebemos e avaliamos cada história cuidadosamente</li>
            <li>Entramos em contato para verificar informações e documentos</li>
            <li>Preparamos a campanha com seu acompanhamento</li>
            <li>A campanha é publicada e divulgada em nossos canais</li>
            <li>Fazemos a gestão transparente dos recursos arrecadados</li>
            <li>Ao final, compartilhamos os resultados da campanha</li>
          </ol>
        </div>
      </div>
    </div>
  );
}