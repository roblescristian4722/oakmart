import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';

const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
})

export default storage;
