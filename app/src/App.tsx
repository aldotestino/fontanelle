import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './routes/Profile';
import Home from './routes/Home';
import Navbar from './components/Navbar';
import { useUserStore } from './stores/userStore';
import { User } from './utils/types';
import { useQuery } from 'react-query';
import UserApi from './api/userApi';
import { Center, Spinner } from '@chakra-ui/react';
import { PRIMARY_COLOR } from './utils/theme';

function App() {

  const { setUser } = useUserStore();

  const { isLoading } = useQuery<User>(['me'], UserApi.getSignedUser, {
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: values => {
      setUser(values);
    }
  });

  if(isLoading) {
    return (
      <Center h="100vh">
        <Spinner color={`${PRIMARY_COLOR}.600`} size="lg" />
      </Center>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        <Navbar />
      </BrowserRouter>
    </>
  );
}

export default App;
