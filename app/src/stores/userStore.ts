import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { User } from '../utils/types';

interface UserStore {
  user: User | null
  isAuth: boolean
  setUser: (user: User) => void
  deleteUser: () => void
}

const userStore = create<UserStore>(setState => ({
  user: null,
  isAuth: false,
  setUser: (user: User) => setState({ user, isAuth: true }),
  deleteUser: () => setState({ user: null, isAuth: false })
}));

export function useUserStore(): UserStore {
  return userStore(
    useShallow(({ user, setUser, isAuth, deleteUser }) => ({ user, setUser, isAuth, deleteUser }))
  );
}

