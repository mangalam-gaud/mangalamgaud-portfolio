import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Mail,
  Phone,
  MapPin,
};

export function Link({ url, children, external = false, iconKey, className }: { url: string; children: React.ReactNode; external?: boolean; iconKey?: string; className?: string }) {
  const Icon = iconKey && ICONS[iconKey] ? ICONS[iconKey] : ExternalLink;
  return (
    <a
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`text-accent hover:underline transition-colors inline-flex items-center gap-1.5 ${className ?? ""}`}
      aria-label={external ? `${children} (opens in new tab)` : undefined}
    >
      {children}
      <Icon className="w-4 h-4" aria-hidden="true" />
    </a>
  );
}

export { ExternalLink, Mail, Phone, MapPin };
