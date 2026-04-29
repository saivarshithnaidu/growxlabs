import { Certificate } from "@/types/courses";

/**
 * Certification System for GrowX Labs
 * Handles ID generation and verification logic.
 */

export function generateCertificateId(courseCode: string): string {
  const year = new Date().getFullYear();
  const unique = Math.floor(10000 + Math.random() * 90000); // 5-digit unique
  return `GXL-${courseCode.toUpperCase()}-${year}-${unique}`;
}

export async function issueCertificate(userId: string, courseId: string, grade: string) {
  // Logic to store in Supabase Table 'certificates'
  // 1. Generate unique ID
  // 2. Map course name
  // 3. Store record
  // 4. Return success / ID
  
  const certId = generateCertificateId(courseId.slice(0, 4));
  
  // Real implementation would use supabaseClient here
  return {
    success: true,
    certificateId: certId,
    issuedAt: new Date()
  };
}

export async function verifyCertificate(certificateId: string) {
  const { supabaseAdmin } = await import("@/lib/supabase/admin");
  
  const { data, error } = await supabaseAdmin
    .from("certificates")
    .select("*")
    .eq("id", certificateId)
    .single();
  
  if (error || !data) {
    return {
      valid: false,
      timestamp: new Date(),
      error: "Certificate not found"
    };
  }
  
  return {
    valid: true,
    timestamp: new Date(),
    certificate: data
  };
}
