import process from 'node:process';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { VerificationEmail } from '@/templates/verification-email';

const resend = new Resend(process.env.RESEND_KEY);

export async function sendVerificationEmail(baseUrl: string, name: string, email: string, code: string) {
  try {
    const emailHtml = render(VerificationEmail({ baseUrl, name, email, code }));
    const { data, error } = await resend.emails.send({
      from: 'Dropz <email@dropz.cc>',
      to: [email],
      subject: 'Dropz Email Verification',
      html: emailHtml,
    });
    if (error)
      return 500;
    if (data?.id)
      return 200;
    return 200;
  }
  catch (_err) {
    return 500;
  }
}
