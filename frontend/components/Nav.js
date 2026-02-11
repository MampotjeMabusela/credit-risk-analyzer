import Link from "next/link";
import { useRouter } from "next/router";

const tabs = [
  { href: "/", label: "Simulator" },
  { href: "/dashboard", label: "Portfolio Dashboard" },
  { href: "/upload", label: "Upload Data" },
  { href: "/scores", label: "Scores" },
];

export default function Nav() {
  const router = useRouter();
  const pathname = router?.pathname ?? "/";

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        {tabs.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`app-nav-tab ${isActive ? "active" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
