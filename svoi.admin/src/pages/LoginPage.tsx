import { Alert, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, errorText } from "@/shared/api";
import { session } from "@/shared/session";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          setError("");
          void api<{ accessToken: string; refreshToken: string }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ login, password }),
          })
            .then((data) => {
              session.setTokens(data.accessToken, data.refreshToken);
              navigate("/bookings");
            })
            .catch((reason: unknown) => setError(errorText(reason)))
            .finally(() => setPending(false));
        }}
      >
        <img src="/logo.svg" alt="" width={38} height={44} />
        <h1>СВОИ</h1>
        <p>Вход для сотрудника</p>
        <TextField label="Логин" value={login} onChange={(event) => setLogin(event.target.value)} required />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Button type="submit" variant="contained" disabled={pending}>
          {pending ? "Входим..." : "Войти"}
        </Button>
      </form>
    </main>
  );
}
