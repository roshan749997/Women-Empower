// ==================== app/dashboard/contacts/page.tsx ====================
"use client";

import React, { useEffect, useState } from "react";
import { getContacts } from "@/app/lib/contactapi";
import ContactsTable from "@/app/component/dashboard/dashboardcontacttab/ContactsTable";
import type { Contact } from "@/app/types/dashboardcontacttab";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getContacts();
        if (isMounted) setContacts(data);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load contacts");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f3f5] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!contacts) {
    return (
      <div className="min-h-screen bg-[#f2f3f5] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Loading contacts...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4 md:p-6">
  <h1 className="text-2xl sm:text-3xl text-gray-900">Contact Messages</h1>
  <p className="text-gray-600 mt-1">Total contacts: {contacts.length}</p>
</div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ContactsTable initialContacts={contacts} />
        </div>
      </div>
    </div>
  );
}
