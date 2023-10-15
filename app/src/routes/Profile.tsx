import { Box } from '@chakra-ui/react';
import AuthContainer from '../components/AuthContainer';
import { useUserStore } from '../stores/userStore';
import ProfileContainer from '../components/ProfileContainer';

function Profile() {

  const { isAuth } = useUserStore();

  return (
    <Box pt={4} minH="100vh" pb={28} display="flex" justifyContent="center">
      {isAuth ? <ProfileContainer /> : <AuthContainer />}
    </Box>
  );
}

export default Profile;