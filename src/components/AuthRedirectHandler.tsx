import { useEffect } from 'react';
import { navigate, navigationRef } from '../navigation/navigationRef';

const AuthRedirectHandler = () => {
  useEffect(() => {
    console.log('[AuthRedirectHandler] Initialisation du gestionnaire de redirection d\'authentification');
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
            // 🕐 attendre que la navigation soit prête
            const tryNavigate = () => {
              if (navigationRef.isReady()) {
                console.log('[AuthRedirectHandler] Navigation prête, redirection vers CompleteRegistration');
                navigate('CompleteRegistration');
              } else {
                console.log('[AuthRedirectHandler] Navigation pas encore prête, réessayer dans 100ms');
                setTimeout(tryNavigate, 100);
              }
            };

            tryNavigate();
          })
          .catch((err) => {
            console.error('[AuthRedirectHandler] Erreur auth callback :', err);
          });
      }
    }
  }, []);

  return null;
};

export default AuthRedirectHandler;
