import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (userOrEmail: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'casacas_admin_authenticated';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
        localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const isAuth =
        sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
        localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
      if (isAuth) {
        return {
          name: 'Leo - CASACAS LB',
          email: 'leo@casacaslb.com.ar',
          role: 'Administrador Principal'
        };
      }
    } catch {
      // ignore
    }
    return null;
  });

  const login = (userOrEmail: string, pass: string) => {
    const cleanUser = userOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Valid credentials requested: AdminsCasacaslb / GenZPass.123@@
    const isValidUser =
      cleanUser === 'adminscasacaslb' ||
      cleanUser === 'adminscasacaslb@gmail.com' ||
      cleanUser === 'genzmarketingdigital@gmail.com' ||
      cleanUser === 'admin';

    const isValidPass =
      cleanPass === 'GenZPass.123@@' ||
      cleanPass === 'casacas2026';

    if (isValidUser && isValidPass) {
      const userObj: AdminUser = {
        name: 'Leo - CASACAS LB',
        email: 'leo@casacaslb.com.ar',
        role: 'Administrador Principal'
      };
      setIsAuthenticated(true);
      setAdminUser(userObj);
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Credenciales inválidas. Compruebe el usuario y la contraseña ingresados.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
