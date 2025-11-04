import React from 'react';
import { User } from '@/app/types/dashboarduserstab';

interface UserTableDesktopProps {
  users: User[];
}

export default function UserTableDesktop({ users }: UserTableDesktopProps) {
  return (
    <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              FIRST<br />NAME
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              LAST<br />NAME
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              GENDER
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              EMAIL
            </th>
         
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              MOBILE NO
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              JOINING<br />DATE
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.firstName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.lastName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.gender}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.email}
              </td>
             
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.mobileNo}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.joining_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}