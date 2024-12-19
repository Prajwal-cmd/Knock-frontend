import { createContext, useMemo ,useContext} from "react"
import io from "socket.io-client"
import { server } from "../constants/config"





const SocketContext = createContext()

const getSocket =() =>useContext(SocketContext)




const SocketProvider = ({children})=>{
    const socket = useMemo(()=>io(server,{auth: {
    token: localStorage.getItem("token"), // Pass authentication token if required
  },path: "/socket.io/",withCredentials:true,}),[])
    

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    )
}


export {getSocket,SocketProvider}
