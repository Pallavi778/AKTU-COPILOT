// import React, { createContext, useState, useEffect } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Load user from localStorage on init
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('aktu_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token validity by calling profile API
          const { data } = await API.get('/auth/profile');
          if (data.success) {
            // Keep user local data updated but preserve token
            const updatedUser = { ...parsedUser, ...data.data };
            setUser(updatedUser);
            localStorage.setItem('aktu_user', JSON.stringify(updatedUser));
          }
        } catch (err) {
          console.error('Failed to validate token on mount', err);
          // Token expired or invalid
          localStorage.removeItem('aktu_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login action
  const login = async (email, password) => {
  setLoading(true);
  setError(null);

  try {
    const response = await API.post('/auth/login', {
      email,
      password,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    const loggedInUser = data.data;

    setUser(loggedInUser);

    localStorage.setItem(
      'aktu_user',
      JSON.stringify(loggedInUser)
    );

    return loggedInUser;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Login failed. Please check credentials.';

    setError(msg);

    throw new Error(msg);
  } finally {
    setLoading(false);
  }
};
  // Register action
  const register = async (
  name,
  email,
  password,
  branch,
  semester
) => {
  setLoading(true);
  setError(null);

  try {
    const response = await API.post('/auth/register', {
      name,
      email,
      password,
      branch,
      semester: Number(semester),
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    const newUser = data.data;

    setUser(newUser);

    localStorage.setItem(
      'aktu_user',
      JSON.stringify(newUser)
    );

    return newUser;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Registration failed';

    setError(msg);

    throw new Error(msg);
  } finally {
    setLoading(false);
  }
};

  // Logout action
  const logout = () => {
    localStorage.removeItem('aktu_user');
    setUser(null);
    setError(null);
  };

  // Update profile details
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put('/auth/profile', profileData);
      if (data.success) {
        // Keep token from updated payload or previous user state
        const updatedUser = { ...user, ...data.data };
        setUser(updatedUser);
        localStorage.setItem('aktu_user', JSON.stringify(updatedUser));
        setLoading(false);
        return updatedUser;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
