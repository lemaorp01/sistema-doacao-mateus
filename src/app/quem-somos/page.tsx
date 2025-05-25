import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function QuemSomosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quem Somos</h1>

        <div className="mb-12 relative h-64 md:h-80 overflow-hidden rounded-lg">
          <Image
            src="https://ext.same-assets.com/3916209880/2375386878.png"
            alt="Sou Solidário"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
              Transformando solidariedade em impacto real
            </h2>
          </div>
        </div>

        <div className="prose max-w-none mb-12">
          <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
          <p className="text-gray-700 mb-6">
            Somos a primeira vaquinha do país a prestar contas de tudo que você doa. Com processos transparentes e seguros,
            garantimos que cada ato de generosidade seja direcionado de forma eficaz para quem precisa, proporcionando
            um impacto real e mensurável.
          </p>

          <p className="text-gray-700 mb-6">
            Acreditamos no poder transformador da solidariedade e na transparência como valor fundamental.
            Por isso, desenvolvemos um sistema único de acompanhamento, onde cada doação é rastreada
            e você pode ver exatamente como seu dinheiro está sendo utilizado.
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-semibold mb-4">Como Funcionamos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Verificação Rigorosa</h3>
              <p className="text-sm text-gray-700">
                Todas as histórias passam por um processo de verificação detalhado antes de serem publicadas.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Transparência Total</h3>
              <p className="text-sm text-gray-700">
                Prestamos contas de cada centavo doado, com relatórios claros sobre a destinação dos recursos.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Acompanhamento Contínuo</h3>
              <p className="text-sm text-gray-700">
                Compartilhamos atualizações regulares sobre cada campanha e seu impacto na vida dos beneficiados.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
          <p className="text-gray-700 mb-6">
            Nascemos da necessidade de criar um ambiente seguro e transparente para doações online no Brasil.
            Após observar diversos casos de pessoas com necessidades reais que não conseguiam obter ajuda devido
            à falta de confiança nos sistemas de arrecadação existentes, decidimos criar uma plataforma diferente.
          </p>

          <p className="text-gray-700 mb-6">
            Desde nossa fundação, já ajudamos centenas de famílias em todo o Brasil, arrecadando milhões de reais
            para tratamentos médicos, cirurgias emergenciais, reabilitações e outras necessidades urgentes.
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-semibold mb-4">Dados da Empresa</h2>
          <p className="text-gray-700 mb-2">
            <strong>Razão Social:</strong> Ajudar Vaquinhas Transparentes
          </p>
          <p className="text-gray-700 mb-2">
            <strong>CNPJ:</strong> 46.265.311/0001-83
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Endereço:</strong> São Paulo - SP
          </p>
          <p className="text-gray-700 mb-8">
            <strong>E-mail de contato:</strong> contato@sousolidario.com
          </p>
        </div>
      </div>
    </div>
  );
}