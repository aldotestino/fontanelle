import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react';
import { EllipsisVerticalIcon, ExclamationTriangleIcon, ShareIcon, StarIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '../stores/userStore';

interface FountainCardMenuProps {
  id: number;
  name: string;
  onOpenReport: () => void;
  onOpenVote: () => void;
}

function FountainCardMenu({ id, name, onOpenReport, onOpenVote }: FountainCardMenuProps) {

  const toast = useToast();

  const { isAuth } = useUserStore();
  
  async function onShare() {
    const dataToShare: ShareData = {
      title: 'Fontanelle',
      text: `Scopri la fontana "${name}"!`,
      url: `${window.location.origin}/?fountainId=${id}`
    };

    if(navigator.share && navigator.canShare(dataToShare)){
      await navigator.share(dataToShare);
    } else {
      await navigator.clipboard.writeText(dataToShare.url!);
      toast({
        variant: 'subtle',
        position: 'top-right',
        title: 'Condividi',
        description: 'URL copiato negli appunti.',
        status: 'info',
        isClosable: true
      });
    }
  }
  
  return (
    <Menu placement="top-end" closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        aria-label='Impostazioni'
        variant='ghost'
        icon={<Icon as={EllipsisVerticalIcon} h={6} w={6} />}
      />
      <MenuList>     
        <MenuItem onClick={onShare} icon={<Icon as={ShareIcon} w={5} h={5} />}>Condividi</MenuItem>
        {isAuth && <>
          <MenuItem onClick={onOpenVote} icon={<Icon as={StarIcon} w={5} h={5} />}>Valuta</MenuItem>
          <MenuItem onClick={onOpenReport} color="red.600" icon={<Icon as={ExclamationTriangleIcon} w={5} h={5} />}>Segnala</MenuItem>
        </>}
      </MenuList>
    </Menu>
  );
}

export default FountainCardMenu;