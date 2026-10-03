import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api, siteBase } from "@/shared/api";
import { session } from "@/shared/session";
import styles from "./AdminShell.module.css";

const links = [
  { to: "/bookings", label: "Заявки" },
  { to: "/sections", label: "Главная" },
  { to: "/menu", label: "Меню" },
  { to: "/gallery", label: "Галерея" },
  { to: "/navigation", label: "Навигация" },
  { to: "/venue", label: "Заведение" },
  { to: "/media", label: "Медиа" },
];

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const site = siteBase();

  return (
    <>
      <div className={styles.brand}>
        <img src="/logo.svg" alt="" width={38} height={44} />
        <div>
          <strong>СВОИ</strong>
          <span>Админка</span>
        </div>
      </div>
      <nav className={styles.links}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <a className={styles.sideAction} href={site} target="_blank" rel="noreferrer">
          Открыть сайт
        </a>
        <button
          className={styles.sideAction}
          type="button"
          onClick={() => {
            const refreshToken = session.refreshToken;
            session.clear();
            if (refreshToken) {
              void api("/api/auth/logout", {
                method: "POST",
                body: JSON.stringify({ refreshToken }),
              }).catch(() => undefined);
            }
            navigate("/login");
          }}
        >
          Выйти
        </button>
      </div>
    </>
  );
}

export const AdminShell = observer(function AdminShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={styles.nav}>
        <Nav />
      </aside>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <IconButton aria-label="Открыть меню" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <img src="/logo.svg" alt="СВОИ" width={28} height={33} style={{ filter: "invert(1)" }} />
        </div>
        <div className={styles.page}>
          <Outlet />
        </div>
      </main>
      <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 260, bgcolor: "#090909", color: "#F2F0EB", p: 2 } }}>
        <Nav onNavigate={() => setOpen(false)} />
      </Drawer>
    </div>
  );
});
