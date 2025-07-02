import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/logs/Login';
import Register from './components/logs/Register';
import PrivateRoute from './components/logs/PrivateRoute';
import Chat from './components/chat/Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;