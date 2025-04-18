import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useUserDataStore } from '../store/userDataStore';

interface BannerProps {
  theme: 'light' | 'dark';
}

const Banner: React.FC<BannerProps> = ({ theme }) => {
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

const handleLogout = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      console.log('Déconnecté avec succès');
      // Reset du store Zustand
      useUserDataStore.getState().resetUserData?.();
      refreshUser(); // pour forcer le refresh dans AuthContext
    } else {
      console.error('Échec de la déconnexion');
    }
  } catch (err) {
    console.error('Erreur lors de la déconnexion :', err);
  } finally {
    setMenuVisible(false);
  }
};

  const bannerStyles = {
    light: {
      backgroundColor: '#61C6FF',
    },
    dark: {
      backgroundColor: '#1f1f1f',
    },
  };

  if (!isLoggedIn || !user) {
    return (
      <View style={[styles.container, bannerStyles[theme]]}>
        <Image
          source={require('../assets/images/ecobuddy_nametag_2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.containerConnected, bannerStyles[theme]]}>
      <View style={styles.left}>
        <Image
          source={require('../assets/images/ecobuddy_nametag_2.png')}
          style={styles.logoConnected}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity style={styles.right} onPress={() => setMenuVisible(true)}>
        <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
        <Text style={styles.pseudo}>{user.pseudo ?? user.email}</Text>
      </TouchableOpacity>

      {/* Menu modal */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text style={styles.menuText}>Mon Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    height: 110,
  },
  containerConnected: {
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 80,
    paddingHorizontal: 16,
  },
  left: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logoConnected: {
    height: 80,
    width: 120,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 8,
  },
  pseudo: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    width: 180,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Banner;
