"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "../data/dashboarduserstabdata";
import UserList from "../component/dashboard/dashboarduserstab/UserList";
import { User } from "../types/dashboarduserstab";

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getUsers();
        if (isMounted) setUsers(data);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load users");
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

  if (!users) {
    return (
      <div className="min-h-screen bg-[#f2f3f5] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Loading users...
          </div>
        </div>
      </div>
    );
  }

  return <UserList users={users} />;
}

// Metadata is not allowed in client components.
