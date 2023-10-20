import { HStack, Icon } from '@chakra-ui/react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconFull } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number
  setRating: React.Dispatch<React.SetStateAction<number>>
}

function StarRating({ rating, setRating }: StarRatingProps) {

  const [hover, setHover] = useState<number | null>(null);

  return (
    <HStack alignSelf="center" spacing={0}>
      {Array.from({ length: 5 }).map((_, index) => 
        <Icon
          onMouseEnter={() => setHover(index + 1)}
          onMouseLeave={() => setHover(null)}
          onClick={() => setRating(index + 1)}
          key={index} 
          as={(index + 1) <= (hover || rating) ? StarIconFull : StarIcon} 
          color={(index + 1) <= (hover || rating) ? 'yellow.500' : 'slate.500'}
          h={6} w={6} 
          cursor="pointer" 
        />
      )}
    </HStack>
  );
}

export default StarRating;