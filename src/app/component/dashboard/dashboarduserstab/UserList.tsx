'use client';

import React, { useState, useMemo } from 'react';
import { User } from '@/app/types/dashboarduserstab';
import SearchBar from './SearchBar';
import UserTableDesktop from './UserTableDesktop';
import UserCardsMobile from './UserCardsMobile';

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search with useMemo for performance
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNo.includes(searchTerm)
    );
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f2f3f5] p-4">
      <div className="max-w-7xl mx-auto">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {filteredUsers.length > 0 ? (
          <>
            <UserTableDesktop users={filteredUsers} />
            <UserCardsMobile users={filteredUsers} />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}