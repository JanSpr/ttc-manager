import { useEffect, useState } from "react";
import { fetchMembersAvailableForUser } from "../api/memberApi";
import { createUser, fetchUsers } from "../api/userApi";
import type { Member } from "../types/member";
import type { User, UserUpsertRequest } from "../types/user";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ein unbekannter Fehler ist aufgetreten.";
}

export default function ManagementUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<UserUpsertRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    active: true,
    memberId: 0,
    roles: [],
  });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);

      const [usersData, membersData] = await Promise.all([
        fetchUsers(),
        fetchMembersAvailableForUser(),
      ]);

      setUsers(usersData);
      setAvailableMembers(membersData);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateUser() {
    if (!form.memberId) {
      alert("Bitte ein Mitglied auswählen.");
      return;
    }

    try {
      await createUser(form);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        active: true,
        memberId: 0,
        roles: [],
      });

      await loadData();
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  }

  if (isLoading) {
    return <div>Lade Benutzer...</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <h1>Benutzerverwaltung</h1>

      <div style={{ marginBottom: "24px" }}>
        <h2>Neuen Benutzer erstellen</h2>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            placeholder="Vorname"
            value={form.firstName}
            onChange={(event) =>
              setForm({ ...form, firstName: event.target.value })
            }
          />

          <input
            placeholder="Nachname"
            value={form.lastName}
            onChange={(event) =>
              setForm({ ...form, lastName: event.target.value })
            }
          />

          <input
            placeholder="E-Mail"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />

          <input
            placeholder="Passwort"
            type="password"
            value={form.password ?? ""}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />

          <select
            value={form.memberId}
            onChange={(event) =>
              setForm({ ...form, memberId: Number(event.target.value) })
            }
          >
            <option value={0}>Mitglied auswählen</option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>

          <button type="button" onClick={handleCreateUser}>
            Benutzer erstellen
          </button>
        </div>
      </div>

      <div>
        <h2>Benutzer</h2>

        {users.length === 0 ? <div>Keine Benutzer vorhanden</div> : null}

        {users.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{user.fullName}</strong> ({user.username}) <br />
            {user.email} <br />
            Mitglied: {user.memberFullName ?? "-"}
          </div>
        ))}
      </div>
    </div>
  );
}