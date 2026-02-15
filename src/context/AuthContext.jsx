import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';

const AuthContext = createContext();

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

  async function register(email, password, name, role) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const profile = { name, role };
    saveProfile(result.user.uid, profile);
    setUserProfile(profile);
    return result;
  }

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = loadProfile(result.user.uid);
    setUserProfile(profile);
    return result;
  }

  async function loginWithGoogle(role) {
    const result = await signInWithPopup(auth, googleProvider);
    let profile = loadProfile(result.user.uid);
    if (!profile) {
      profile = { name: result.user.displayName || 'User', role: role || 'client' };
      saveProfile(result.user.uid, profile);
    }
    setUserProfile(profile);
    return result;
  }

  async function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  function updateUserProfile(updates) {
    if (!currentUser) return;
    const newProfile = { ...userProfile, ...updates };
    saveProfile(currentUser.uid, newProfile);
    setUserProfile(newProfile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = loadProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
