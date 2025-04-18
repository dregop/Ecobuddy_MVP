import { createNavigationContainerRef } from '@react-navigation/native';
import { AppStackParamList } from '../utils/types';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

export function navigate(name: keyof AppStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
