import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Box, Flex, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Venues from "./pages/Venues.jsx";
import EventDetails from "./pages/EventDetails.jsx"; // Add this import

const Navbar = () => (
  <Box bg="teal.500" px={4} py={2}>
    <Flex h={16} alignItems="center" justifyContent="space-between">
      <Link as={RouterLink} to="/" color="white" fontWeight="bold" fontSize="lg">
        Home
      </Link>
      <Link as={RouterLink} to="/venues" color="white" fontWeight="bold" fontSize="lg">
        Venues
      </Link>
    </Flex>
  </Box>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/event/:id" element={<EventDetails />} /> {/* Add this route inside the <Routes> component */}
      </Routes>
    </Router>
  );
}

export default App;