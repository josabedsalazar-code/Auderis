import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

interface Client {
  id: string;
  name: string;
  taxId?: string | null;
  contact?: string | null;
  createdAt: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const data = await apiRequest<Client[]>("/clients");
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar clientes");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newClient = await apiRequest<Client>("/clients", {
        method: "POST",
        body: JSON.stringify({
          name,
          taxId: taxId || undefined,
          contact: contact || undefined
        })
      });
      setClients((prev) => [newClient, ...prev]);
      setName("");
      setTaxId("");
      setContact("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <header className="page-header">
        <h1>Clientes</h1>
        <p>Gestiona los clientes auditados y su información principal.</p>
      </header>

      <div className="grid">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Nuevo cliente</h2>
          {error && <div className="alert">{error}</div>}
          <label>
            Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            RTN / Tax ID
            <input value={taxId} onChange={(e) => setTaxId(e.target.value)} />
          </label>
          <label>
            Contacto
            <input value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>

        <div className="card">
          <h2>Listado</h2>
          <ul className="list">
            {clients.map((client) => (
              <li key={client.id}>
                <strong>{client.name}</strong>
                <span>{client.taxId || "Sin RTN"}</span>
                <small>{client.contact || "Sin contacto"}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Clients;