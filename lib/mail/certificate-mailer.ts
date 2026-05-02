import { Resend } from "resend";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendCertificateEmail(
  email: string,
  studentName: string,
  courseName: string,
  grade: string,
  certId: string
) {
  const certUrl = `https://growxlabs.tech/certificate/${certId}`;

  try {
    const { data, error } = await getResendClient().emails.send({
      from: "GrowXLabsTech Academy <academy@growxlabs.tech>",
      to: [email],
      subject: "Your GrowXLabsTech Certificate is Ready!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1a1a1a;">Congratulations, ${studentName}!</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            We are thrilled to inform you that you have successfully passed the final assessment for 
            <strong>${courseName}</strong> with a grade of <strong>${grade}</strong>.
          </p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Your official Certificate of Mastery is now available. You can view, download, or share it using the link below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${certUrl}" style="background-color: #00A86B; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
              View My Certificate
            </a>
          </div>
          <p style="font-size: 14px; color: #888; margin-top: 40px; border-top: 1px solid #eee; pt-20;">
            Certificate ID: ${certId}<br/>
            Verified by GrowXLabsTech Academy
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email delivery failure:", error);
    return { success: false, error };
  }
}