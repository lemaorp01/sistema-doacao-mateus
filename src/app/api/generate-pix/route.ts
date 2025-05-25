import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import crypto from 'crypto';

// Função para gerar um código identificador (txid) aleatório
function generateTxId() {
  return crypto.randomBytes(16).toString('hex');
}

// Função para criar um payload PIX
function createPixPayload(
  pixKey: string,
  description: string,
  merchantName: string,
  merchantCity: string,
  amount: number,
  txid: string
): string {
  // Valores fixos do payload
  const payloadFormat = '01';
  const merchantAccountInfoID = '26';
  const merchantAccountInfoGUI = '00';
  const merchantAccountInfoKey = '01';
  const merchantCategoryCode = '52040000';
  const transactionCurrency = '986'; // BRL
  const countryCode = 'BR';

  // Função auxiliar para formatar os campos
  const formatField = (id: string, value: string): string => {
    return `${id}${value.length.toString().padStart(2, '0')}${value}`;
  };

  // Construindo o merchant account info
  const pixGui = formatField(merchantAccountInfoGUI, 'br.gov.bcb.pix');
  const pixKey = formatField(merchantAccountInfoKey, pixKey);
  const merchantAccountInfo = formatField(merchantAccountInfoID, pixGui + pixKey);

  // Construindo outros campos
  const merchantNameField = formatField('59', merchantName);
  const merchantCityField = formatField('60', merchantCity);
  const amountField = formatField('54', amount.toFixed(2));
  const txidField = formatField('05', txid);
  const countryCodeField = formatField('58', countryCode);
  const categoryCodeField = formatField('52', merchantCategoryCode);
  const currencyField = formatField('53', transactionCurrency);
  const descriptionField = formatField('62', formatField('05', description));

  // Juntando todos os campos
  const payload = payloadFormat +
                 merchantAccountInfo +
                 merchantNameField +
                 merchantCityField +
                 amountField +
                 txidField +
                 countryCodeField +
                 categoryCodeField +
                 currencyField +
                 descriptionField +
                 '6304';

  // Calculando CRC16
  let crc = crc16(payload);

  // Retornando o payload completo
  return payload + crc;
}

// Função para calcular o CRC16 (checksum)
function crc16(payload: string): string {
  // Implementação simplificada do CRC16
  // Em produção, use uma biblioteca mais robusta
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    const c = payload.charCodeAt(i);
    crc ^= (c << 8);

    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export async function POST(req: NextRequest) {
  try {
    const { amount, description, donorName } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Valor é obrigatório' }, { status: 400 });
    }

    // Dados do recebedor (em produção, pegue de variáveis de ambiente)
    const pixKey = 'mateus@doacoes.org'; // Sua chave PIX
    const merchantName = 'Campanha do Mateus';
    const merchantCity = 'São Paulo';

    // Gera ID único para a transação
    const txid = generateTxId();

    // Cria o payload PIX
    const pixCopyPaste = createPixPayload(
      pixKey,
      description || 'Doação para o Mateus',
      merchantName,
      merchantCity,
      parseFloat(amount),
      txid
    );

    // Gera o QR Code como data URL
    const qrCodeImage = await QRCode.toDataURL(pixCopyPaste, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });

    // Data de expiração (24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return NextResponse.json({
      qrCodeImage,
      qrCodeText: pixCopyPaste,
      paymentId: txid,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return NextResponse.json({ error: 'Erro ao gerar PIX' }, { status: 500 });
  }
}