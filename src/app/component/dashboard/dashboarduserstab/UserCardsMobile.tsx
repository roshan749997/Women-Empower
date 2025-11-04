import React from 'react';
import { User } from '@/app/types/dashboarduserstab';

interface UserCardsMobileProps {
  users: User[];
}

export default function UserCardsMobile({ users }: UserCardsMobileProps) {
  return (
    <div className="lg:hidden space-y-4">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-lg shadow p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">{user.gender}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900 break-all">{user.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mobile No:</span>
              <p className="text-gray-900">{user.mobileNo}</p>
            </div>
      
            <div>
              <span className="font-medium text-gray-600">Joining Date:</span>
              <p className="text-gray-900">{user.joining_date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}