import { AsyncLocalStorage } from 'async_hooks';

interface contextStore {
  id: string;
}

const AsyncStorage = new AsyncLocalStorage<contextStore>();

export default AsyncStorage;
