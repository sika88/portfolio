import AvatarUploader from "./AvatarUploader";

const NAV = [
  ["Home", "#top"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
] as const;

export default function SiteHeader({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="pf-header">
      <div className="pf-header__inner">
        <a href="#top" className="pf-logo" aria-label={`${name} home`}>
          {initials}
        </a>
        <nav className="pf-nav" aria-label="Primary">
          {NAV.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <AvatarUploader name={name} />
      </div>
    </header>
  );
}