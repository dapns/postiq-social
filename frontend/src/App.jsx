import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import MyPosts from "@/pages/MyPosts";
import "./styles/buttons.css";
import "./styles/globals.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* Add more routes here */}
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/myposts" element={<MyPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
