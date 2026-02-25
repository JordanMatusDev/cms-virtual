import { useMemo, useState } from 'react';
import { type User } from '../schemas/user.schema';

type UserStatusFilter = 'all' | 'active' | 'inactive';

export const useUsersFilter = (users: User[] = []) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
   const [roleFilter, setRoleFilter] = useState('all');

   const roles = useMemo(() => {
      const uniqueRoles = new Set(users.map((user) => user.rol).filter(Boolean));
      return Array.from(uniqueRoles).sort((a, b) => a.localeCompare(b));
   }, [users]);

   const filteredUsers = useMemo(() => {
      const normalizedSearch = searchTerm.trim().toLowerCase();

      return users.filter((user) => {
         const fullName = `${user.name ?? ''} ${user.surnames ?? ''}`.trim().toLowerCase();
         const email = user.email.toLowerCase();
         const username = user.username.toLowerCase();
         const role = user.rol.toLowerCase();

         const matchesSearch =
            normalizedSearch.length === 0 ||
            fullName.includes(normalizedSearch) ||
            email.includes(normalizedSearch) ||
            username.includes(normalizedSearch) ||
            role.includes(normalizedSearch);

         const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && user.status) ||
            (statusFilter === 'inactive' && !user.status);

         const matchesRole = roleFilter === 'all' || user.rol === roleFilter;

         return matchesSearch && matchesStatus && matchesRole;
      });
   }, [users, searchTerm, statusFilter, roleFilter]);

   return {
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      roleFilter,
      setRoleFilter,
      roles,
      filteredUsers,
   };
};
