import { createContext, useMemo ,useContext} from "react"
import io from "socket.io-client"
import { server } from "../constants/config"





const SocketContext = createContext()

const getSocket =() =>useContext(SocketContext)




const SocketProvider = ({children})=>{
    const socket = useMemo(()=>io("https://kbe-rishis-projects-e7f56ed1.vercel.app/",{withCredentials:true,}),[])
    

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    )
}


export {getSocket,SocketProvider}
