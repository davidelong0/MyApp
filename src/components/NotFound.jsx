import { useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap'


const NotFound = ()=>{


    const navigate = useNavigate();  // Uso per fare navigazione

    
    return (
        <div className="text-center">
            <h1 >ERROR 404</h1>
            <Button onClick={()=>{
                navigate('/Home')  //il percorso per tornare in Home
            }}>coming home</Button>
        </div>
    )
}

export default NotFound