import { NextRequest, NextResponse } from 'next/server';
import { getCampaignByHash, generateIpHash, getAllCampaigns } from './lib/campaign-randomizer';
export function middleware(request: NextRequest) {
  // Só aplicar redirecionamento na página inicial
  if (request.nextUrl.pathname === '/') {
    // Verifica se já tem um cookie de campanha atribuída
    const assignedCampaign = request.cookies.get('assigned-campaign')?.value;
    
    if (!assignedCampaign) {
      // Obtém IP do usuário (com fallback para desenvolvimento)
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'localhost';
      
      // Gera hash do IP para consistência
      const ipHash = generateIpHash(ip);
      
      // Seleciona campanha baseada no hash
      const selectedCampaign = getCampaignByHash(ipHash);
      
      // Se a campanha selecionada não for a homepage padrão, redireciona
      if (selectedCampaign.slug !== '/') {
        const response = NextResponse.redirect(new URL(selectedCampaign.slug, request.url));
        
        // Define cookie para manter consistência
        response.cookies.set('assigned-campaign', selectedCampaign.id, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        return response;
      } else {
        // Define cookie mesmo para homepage
        const response = NextResponse.next();
        response.cookies.set('assigned-campaign', selectedCampaign.id, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        return response;
      }
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};