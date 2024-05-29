import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Venues from "./pages/Venues.jsx"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
      <Route path="/venues" element={<Venues />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
