import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l'accès au serveur de dev depuis les autres appareils du
  // réseau local (sans quoi Next.js bloque le JS applicatif et les
  // documents restent inertes quand on ouvre le site depuis une autre
  // machine). flores.local est le nom mDNS/Avahi de cette machine
  // (sudo hostnamectl set-hostname flores) ; 192.168.1.* couvre l'accès
  // par IP sur le réseau Wi-Fi actuel — à ajuster si le sous-réseau change.
  allowedDevOrigins: ["flores.local", "192.168.1.*"],
};

export default nextConfig;
