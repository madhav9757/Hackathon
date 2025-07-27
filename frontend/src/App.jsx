import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
