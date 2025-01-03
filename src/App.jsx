import './App.css'

import {Routes,Route} from 'react-router-dom'
import SideBar from './views/SideBar'
import Login from './Login'

function App() {  

  return (
    
     <Routes> 
       <Route path='/' element={<Login></Login>}></Route>     
       <Route path='/expertisERP/*' element={<SideBar></SideBar>}></Route>       
     </Routes>
      
    
  )
}

export default App
