import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskPage from './TaskPage';
import Header from './Header';
function App() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<TaskPage />} />
        </Routes>
      </Router>
    );
  }
export default App;