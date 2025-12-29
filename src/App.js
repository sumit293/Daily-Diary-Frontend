import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateBlog from "./components/CreateBlog";
import BlogDetail from "./components/BlogDetail";
import PrivateDashboard from "./components/PrivateDashboard";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateBlog />} />
      <Route path="/private" element={<PrivateDashboard />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
    </Routes>
  );
}

export default App;
