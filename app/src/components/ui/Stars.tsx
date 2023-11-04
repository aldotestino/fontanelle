import { Icon } from '@chakra-ui/react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconFull } from '@heroicons/react/24/solid';

interface StarsProps {
  stars: number
}

function Stars({ stars }: StarsProps) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} as={i < Math.floor(stars) ? StarIconFull : StarIcon} w={6} h={6} color={i < Math.floor(stars) ? 'yellow.500' : 'slate.500'} />
      ))}
    </>
  );
}

export default Stars;