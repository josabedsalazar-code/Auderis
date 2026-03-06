import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

interface Client {
  id: string;
  name: string;
}

interface Audit {
  id: string;
  title: string;
  scope?: string | null;
  status: string;
  createdAt: string;
  client: Client;
}

const Audits = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("");
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [clientsData, auditsData] = await Promise.all([
        apiRequest<Client[]>("/clients"),
        apiRequest<Audit[]>("/audits")
      ]);
      setClients(clientsData);
      setAudits(auditsData);
      if (clientsData.length > 0) {
        setClientId((prev) => prev || clientsData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar auditorías");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newAudit = await apiRequest<Audit>("/audits", {
        method: "POST",
        body: JSON.stringify({
          title,
          scope: scope || undefined,
          clientId
        })
      });
      setAudits((prev) => [
        {
          ...newAudit,
          client: clients.find((client) => client.id === clientId) ?? { id: clientId, name: "" }
        },
        ...prev
      ]);
      setTitle("");
      setScope("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear auditoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <header className="page-header">
        <h1>Auditorías</h1>
        <p>Registra auditorías internas y externas vinculadas a clientes.</p>
      </header>

      <div className="grid">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Nueva auditoría</h2>
          {error && <div className="alert">{error}</div>}
          <label>
            Título
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Alcance
            <textarea value={scope} onChange={(e) => setScope(e.target.value)} />
          </label>
          <label>
            Cliente
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading || !clientId}>
            {loading ? "Guardando..." : "Crear"}
          </button>
        </form>

        <div className="card">
          <h2>Listado</h2>
          <ul className="list">
            {audits.map((audit) => (
              <li key={audit.id}>
                <strong>{audit.title}</strong>
                <span>{audit.client?.name}</span>
                <small>{audit.status}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Audits;