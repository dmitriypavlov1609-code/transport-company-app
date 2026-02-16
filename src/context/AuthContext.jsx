import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const DEMO_SESSION_KEY = 'tp_demo_session';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // { name, role }
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage
  function loadProfile(uid) {
    try {
      const stored = localStorage.getItem(`tp_profile_${uid}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Save profile to localStorage
  function saveProfile(uid, profile) {
    localStorage.setItem(`tp_profile_${uid}`, JSON.stringify(profile));
  }

  async function loginDemo(role, name) {
    const demoUser = {
      uid: `demo-${role}`,
      email: `demo-${role}@transport.pro`,
      isDemo: true,
    };
    const demoProfile = { name: name || 'Demo User', role };
    setCurrentUser(demoUser);
    setUserProfile(demoProfile);
    saveProfile(demoUser.uid, demoProfile);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
    return { user: demoUser };
  }

  async function logout() {
    localStorage.removeItem(DEMO_SESSION_KEY);
    setUserProfile(null);
    setCurrentUser(null);
  }

  function updateUserProfile(updates) {
    if (!currentUser) return;
    const newProfile = { ...userProfile, ...updates };
    saveProfile(currentUser.uid, newProfile);
    setUserProfile(newProfile);
  }

  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(DEMO_SESSION_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        setCurrentUser(session.user || null);
        if (session.user?.uid) {
          const profile = loadProfile(session.user.uid) || session.profile || null;
          setUserProfile(profile);
        } else {
          setUserProfile(session.profile || null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    } catch {
      setCurrentUser(null);
      setUserProfile(null);
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    loginDemo,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
