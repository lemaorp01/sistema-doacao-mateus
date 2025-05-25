"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer bg-[#15346a] text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
          <div className="w-full md:w-auto text-center md:text-left">
            <p className="mb-4 md:mb-0 md:mr-8">Campanha de Apoio ao Mateus 2025 - Todos os direitos reservados.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
            <Link
              href="/anexos/politica-privacidade-ajudar.pdf"
              className="text-white underline hover:text-blue-200 transition"
              target="_blank"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/anexos/termos-uso-ajudar.pdf"
              className="text-white underline hover:text-blue-200 transition"
              target="_blank"
            >
              Termos de Uso
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>O dinheiro arrecadado será usado para:</p>
          <ul className="mt-2 space-y-1">
            <li>✅ Cirurgia Particular de Correção da Coluna</li>
            <li>✅ Transporte para Consultas e Tratamentos</li>
            <li>✅ Melhorias Urgentes na Casa da Família</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}