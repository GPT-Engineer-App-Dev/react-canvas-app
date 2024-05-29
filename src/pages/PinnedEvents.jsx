import { Container, Text, VStack, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, useToast } from "@chakra-ui/react";
import { useEvents, useUpdateEvent } from "../integrations/supabase";
import { FaThumbtack } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const PinnedEvents = () => {
  const { data: events, isLoading, isError } = useEvents();
  const updateEvent = useUpdateEvent();
  const toast = useToast();

  const handlePin = async (event) => {
    try {
      await updateEvent.mutateAsync({ ...event, is_pinned: !event.is_pinned });
      toast({ title: `Event ${event.is_pinned ? "unpinned" : "pinned"}.`, status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "An error occurred.", description: error.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Pinned Events</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : isError ? (
          <Text>Error loading events.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Venue</Th>
                <Th>Pin</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.filter(event => event.is_pinned).map((event) => (
                <Tr key={event.id}>
                  <Td>{event.name}</Td>
                  <Td>{event.date}</Td>
                  <Td>{event.description}</Td>
                  <Td>{event.venue_id}</Td>
                  <Td>
                    <IconButton icon={<FaThumbtack />} onClick={() => handlePin(event)} colorScheme={event.is_pinned ? "yellow" : "gray"} />
                  </Td>
                  <Td>
                    <RouterLink to={`/event/${event.id}`}>
                      <Button colorScheme="teal">View Details</Button>
                    </RouterLink>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Container>
  );
};

export default PinnedEvents;