import { useParams } from "react-router-dom";
import { Container, Text, VStack, Box, Image, Divider, Heading, Spinner, useToast } from "@chakra-ui/react";
import { useEvent, useComments } from "../integrations/supabase";

const EventDetails = () => {
  const { id } = useParams();
  const { data: event, isLoading: eventLoading, isError: eventError } = useEvent(id);
  const { data: comments, isLoading: commentsLoading, isError: commentsError } = useComments(id);
  const toast = useToast();

  if (eventLoading || commentsLoading) {
    return <Spinner />;
  }

  if (eventError || commentsError) {
    toast({ title: "An error occurred.", description: "Unable to load event details.", status: "error", duration: 3000, isClosable: true });
    return <Text>Error loading event details.</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Heading>{event.name}</Heading>
        <Text>{event.date}</Text>
        <Image src={event.image_url} alt={event.name} />
        <Text>{event.description}</Text>
        <Divider />
        <Heading size="md">Comments</Heading>
        {comments.length === 0 ? (
          <Text>No comments yet.</Text>
        ) : (
          comments.map((comment) => (
            <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" width="100%">
              <Text>{comment.content}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default EventDetails;