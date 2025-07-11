import { Routes, Route } from 'react-router-dom';
import Profile from './components/Users/Profile';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/chat/Chat';
import UsersList from './components/Users/UsersList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
