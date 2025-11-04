'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Contact } from '@/app/types/dashboardcontacttab';
import { deleteContact } from '@/app/lib/contactapi';

interface ContactsTableProps {
  initialContacts: Contact[];
}

export default function ContactsTable({ initialContacts }: ContactsTableProps) {
  const [contacts, setContacts] = React.useState<Contact[]>(initialContacts);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    setDeleting(id);

    try {
      await deleteContact(id); // Call API
      setContacts((prev) => prev.filter((c) => c.id !== id)); // Update state instantly
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">First Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Last Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Mobile No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Message</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{contact.first_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.last_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.mobileNo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.mail}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{contact.msg}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleting === contact.id}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {contact.first_name} {contact.last_name}
              </h3>
              <button
                onClick={() => handleDelete(contact.id)}
                disabled={deleting === contact.id}
                className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-900">
              <p><span className="font-semibold text-gray-500">Mobile:</span> {contact.mobileNo}</p>
              <p><span className="font-semibold text-gray-500">Email:</span> {contact.mail}</p>
              <p><span className="font-semibold text-gray-500">Message:</span> {contact.msg}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No contacts available</p>
        </div>
      )}
    </>
  );
}
