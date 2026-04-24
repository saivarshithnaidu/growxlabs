import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { CertificateClient } from "@/components/certificate/CertificateClient";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function CertificatePage({ params }: PageProps) {
  const { id: certId, locale } = await params;
  const supabase = await createClient();

  const { data: cert, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("cert_id", certId)
    .single();

  if (error || !cert) {
    notFound();
  }

  // Generate QR code for verification URL
  const verifyUrl = `https://growxlabs.tech/api/certificates/verify?id=${certId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 200,
    color: {
      dark: "#1a1a1a",
      light: "#ffffff",
    },
  });

  return (
    <CertificateClient 
      cert={cert} 
      qrCode={qrCodeDataUrl} 
    />
  );
}
