import { Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Divider, HStack, List, ListIcon, ListItem } from '@chakra-ui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { reportReasons } from '../../utils/constants';
import { GetFountainResponse } from '../../utils/types';
import { useMemo } from 'react';

function ReportsAccordion({ reports }: {reports: GetFountainResponse['reports']}) {

  const totalReports = useMemo(() => Object.values(reports).reduce((a, b) => a + b, 0), [{ ...reports }]);

  if (totalReports === 0) return null;

  return (
    <>
      <Divider w="full" borderColor="slate.200" />
      <Accordion w="full" allowToggle>
        <AccordionItem border="none">
          <h2>
            <AccordionButton borderRadius="md">
              <HStack flex={1}>
                <Text color="slate.500" fontWeight="bold">Segnalazioni:</Text>
                <Badge colorScheme={totalReports > 5 ? 'red' : 'yellow'}>{totalReports}</Badge>
              </HStack>
              <AccordionIcon color="slate.500" />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <List>
              {Object.entries(reports).filter(([, c]) => c != 0).map(([reason, count]) => (
                <ListItem key={reason}>
                  <ListIcon as={ExclamationTriangleIcon} w={5} h={5} color={count > 2 ? 'red.600' : 'yellow.600'} />
                  {reportReasons[parseInt(reason) - 1]}: {count}
                </ListItem>
              ))}
            </List>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default ReportsAccordion;