import Icon from "@/components/icons";
import { waLink } from "@/lib/content";

export default function WhatsAppButton({
  message,
  className = "btn-primary",
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className={className}>
      <Icon name="whatsapp" />
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
