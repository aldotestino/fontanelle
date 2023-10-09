import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './routes/Profile';
import Home from './routes/Home';
import Navbar from './components/Navbar';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        <Navbar />
      </BrowserRouter>
    </>
  );
}

export default App;
