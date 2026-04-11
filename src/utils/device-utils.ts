export function detectDevice(userAgent: string): "Mobile" | "Tablet" | "Desktop" {
  const isMobile = /iPhone|Android|Mobile/i.test(userAgent);
  const isTablet = /iPad|Tablet/i.test(userAgent);

  if (isTablet) return "Tablet";
  if (isMobile) return "Mobile";
  return "Desktop";
}
