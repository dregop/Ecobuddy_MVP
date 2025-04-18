// src/components/AuthRedirectHandler.tsx
import { useEffect } from 'react';
import { navigate } from '../navigation/navigationRef';

const AuthRedirectHandler = () => {
  useEffect(() => {
    const hash = window?.location?.hash;

    if (hash?.startsWith('#access_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');

      if (token) {
        fetch(`${process.env.API_URL}/auth/callback?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          credentials: 'include',
        })
          .then(() => {
            navigate('CompleteRegistration');
          })
          .catch((err) => {
            console.error('[AuthRedirectHandler] Erreur auth callback :', err);
          });
      }
    }
  }, []);

  return null; // rien à afficher
};

export default AuthRedirectHandler;
