import { useState } from "react";
import { Container, Text, VStack, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useVenues, useAddVenue, useUpdateVenue, useDeleteVenue } from "../integrations/supabase";
import { FaEdit, FaTrash } from "react-icons/fa";

const Venues = () => {
  const { data: venues, isLoading, isError } = useVenues();
  const addVenue = useAddVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentVenue, setCurrentVenue] = useState(null);
  const [formState, setFormState] = useState({ name: "", location: "", description: "" });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (currentVenue) {
        await updateVenue.mutateAsync({ ...formState, id: currentVenue.id });
        toast({ title: "Venue updated.", status: "success", duration: 3000, isClosable: true });
      } else {
        await addVenue.mutateAsync(formState);
        toast({ title: "Venue added.", status: "success", duration: 3000, isClosable: true });
      }
      setFormState({ name: "", location: "", description: "" });
      setCurrentVenue(null);
      onClose();
    } catch (error) {
      toast({ title: "An error occurred.", description: error.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleEdit = (venue) => {
    setCurrentVenue(venue);
    setFormState(venue);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteVenue.mutateAsync(id);
      toast({ title: "Venue deleted.", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "An error occurred.", description: error.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Venues</Text>
        <Button onClick={onOpen} colorScheme="teal">Add Venue</Button>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : isError ? (
          <Text>Error loading venues.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {venues.map((venue) => (
                <Tr key={venue.id}>
                  <Td>{venue.name}</Td>
                  <Td>{venue.location}</Td>
                  <Td>{venue.description}</Td>
                  <Td>
                    <IconButton icon={<FaEdit />} onClick={() => handleEdit(venue)} mr={2} />
                    <IconButton icon={<FaTrash />} onClick={() => handleDelete(venue.id)} />
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
          <ModalHeader>{currentVenue ? "Edit Venue" : "Add Venue"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" mb={4}>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formState.name} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="location" mb={4}>
              <FormLabel>Location</FormLabel>
              <Input name="location" value={formState.location} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={formState.description} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {currentVenue ? "Update" : "Add"}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Venues;