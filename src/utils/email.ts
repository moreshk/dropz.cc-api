import { render } from '@react-email/render';
import { VerificationEmail } from '@/templates/verification-email';

export async function sendVerificationEmail(baseUrl: string, name: string, email: string, code: string) {
  try {
    const emailHtml = render(VerificationEmail({ baseUrl, name, email, code }));
    return emailHtml;
  }
  catch (_err) {
    return 500;
  }
}
