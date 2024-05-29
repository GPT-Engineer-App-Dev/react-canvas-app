import { Container, Text, VStack } from "@chakra-ui/react";

const Index = () => {
  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Welcome to Your Blank Canvas</Text>
        <Text>Start building your amazing application here.</Text>
      </VStack>
    </Container>
  );
};

export default Index;