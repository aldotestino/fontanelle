import { Box } from '@chakra-ui/react';
import AuthContainer from '../components/AuthContainer';

function Profile() {
  return (
    <Box p={4} display="flex" justifyContent="center">
      <AuthContainer mt={4} />
    </Box>
  );
}

export default Profile;