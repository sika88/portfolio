import AvatarUploader from "./AvatarUploader";

export default function SiteHeader({ name }: { name: string }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#top" className="site-header__brand">
          {name}
        </a>
        <AvatarUploader name={name} />
      </div>
    </header>
  );
}