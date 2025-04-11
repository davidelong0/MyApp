
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import Details from './components/Details'
import NotFound from './components/NotFound'
import CustomNavbar from './components/CustomNavbar';

function App() {


  return (
   
      <BrowserRouter>
      <div>
      <CustomNavbar/>
      <Routes>
        <Route path='/Home' element={<Home/>} />
        <Route path='/details/:id' element={<Details/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      </div>
      </BrowserRouter>
    
  )
}

export default App
