export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <header>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <p style={{ color: "#5c5c5c", margin: "8px 0 24px" }}>{lead}</p>
    </header>
  );
}
