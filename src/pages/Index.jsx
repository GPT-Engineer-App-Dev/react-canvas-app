import { useState } from "react";
import { Container, Text, VStack, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, useToast } from "@chakra-ui/react"; // Add Select import
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useVenues } from "../integrations/supabase"; // Add useVenues import
import { FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const { data: events, isLoading, isError } = useEvents();
  const { data: venues } = useVenues(); // Fetch venues
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formState, setFormState] = useState({ name: "", date: "", description: "", venue_id: "", image_url: "", pdf_url: "" });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (currentEvent) {
        await updateEvent.mutateAsync({ ...formState, id: currentEvent.id });
        toast({ title: "Event updated.", status: "success", duration: 3000, isClosable: true });
      } else {
        await addEvent.mutateAsync(formState);
        toast({ title: "Event added.", status: "success", duration: 3000, isClosable: true });
      }
      setFormState({ name: "", date: "", description: "", venue_id: "", image_url: "", pdf_url: "" });
      setCurrentEvent(null);
      onClose();
    } catch (error) {
      toast({ title: "An error occurred.", description: error.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormState(event);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast({ title: "Event deleted.", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "An error occurred.", description: error.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Events</Text>
        <Button onClick={onOpen} colorScheme="teal">Add Event</Button>
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
                <Th>Venue</Th> {/* Change to Venue */}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event) => (
                <Tr key={event.id}>
                  <Td>{event.name}</Td>
                  <Td>{event.date}</Td>
                  <Td>{event.description}</Td>
                  <Td>{venues?.find((venue) => venue.id === event.venue_id)?.name || "N/A"}</Td> {/* Display venue name */}
                  <Td>
                    <IconButton icon={<FaEdit />} onClick={() => handleEdit(event)} mr={2} />
                    <IconButton icon={<FaTrash />} onClick={() => handleDelete(event.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentEvent ? "Edit Event" : "Add Event"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" mb={4}>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formState.name} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="date" mb={4}>
              <FormLabel>Date</FormLabel>
              <Input type="date" name="date" value={formState.date} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={formState.description} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="venue_id" mb={4}>
              <FormLabel>Venue</FormLabel>
              <Select name="venue_id" value={formState.venue_id} onChange={handleInputChange}>
                <option value="">Select Venue</option>
                {venues?.map((venue) => (
                  <option key={venue.id} value={venue.id}>{venue.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="image_url" mb={4}>
              <FormLabel>Image URL</FormLabel>
              <Input name="image_url" value={formState.image_url} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="pdf_url" mb={4}>
              <FormLabel>PDF URL</FormLabel>
              <Input name="pdf_url" value={formState.pdf_url} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {currentEvent ? "Update" : "Add"}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;