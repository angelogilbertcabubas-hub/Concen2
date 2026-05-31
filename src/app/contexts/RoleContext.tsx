import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Updated UserRole types to match the HCI documentation
export type UserRole = 'hr' | 'employee' | 'finance';

// 2. Expanded the User interface to include unique IDs, emails, and departments
export interface User {
  id: string;          // Added: Unique Employee ID
  email: string;       // Added: Unique Corporate Email
  department: string;  // Added: Department Name
  name: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
}

// 3. Updated the mock users with the new titles and their unique identifiers
export const roleUsers: Record<UserRole, User> = {
  hr: {
    id: 'HR-1042',
    email: 'c.webster@concentwo.com',
    department: 'Human Resources',
    name: 'Clairo Webster',
    role: 'hr',
    roleTitle: 'HR Officer', 
    avatar: 'CW',
  },
  employee: {
    id: 'CSR-8819',
    email: 'h.swift@concentwo.com',
    department: 'Customer Service',
    name: 'Hailey Swift',
    role: 'employee',
    roleTitle: 'Employee',
    avatar: 'HS',
  },
  finance: {
    id: 'FIN-2204',
    email: 'j.hozier@concentwo.com',
    department: 'Finance Operations',
    name: 'Jeff Hozier',
    role: 'finance',
    roleTitle: 'Finance Officer',
    avatar: 'JH',
  },
};

interface RoleContextType {
  user: User;
  switchRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  // Defaulting to 'employee' upon login
  const [user, setUser] = useState<User>(roleUsers.employee);

  const switchRole = (role: UserRole) => {
    setUser(roleUsers[role]);
  };

  return (
    <RoleContext.Provider value={{ user, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}