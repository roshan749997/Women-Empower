// ==================== app/lib/contactapi.ts ====================
import { Contact } from "../types/dashboardcontacttab";
import { getAuthHeaders } from "../lib/authApi";

// Fetch all contacts
export async function getContacts(token?: string): Promise<Contact[]> {
  const baseHeaders = getAuthHeaders();
  const headers: HeadersInit = {
    ...baseHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch("http://localhost:5000/v1/contact-details/", {
    cache: "no-store", // no caching in Next.js
    headers,
  });

  if (!res.ok) throw new Error("Failed to fetch contacts");

  const json = await res.json();
  return json.data;
}

// Delete a contact by ID
export async function deleteContact(id: string, token?: string): Promise<void> {
  const baseHeaders = getAuthHeaders();
  const headers: HeadersInit = {
    ...baseHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`http://localhost:5000/v1/contact-details/${id}`, {
    method: "DELETE",
    headers,
  });

   if (!res.ok) {
    const errorText = await res.text(); // log backend error
    throw new Error(`Failed to delete contact: ${errorText}`);
  }

  // Optional delay for smoother UI feedback
  await new Promise((resolve) => setTimeout(resolve, 300));
}
