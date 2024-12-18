import { createContext, useMemo ,useContext} from "react"
import io from "socket.io-client"
import { server } from "../constants/config"





const SocketContext = createContext()

const getSocket =() =>useContext(SocketContext)




const SocketProvider = ({children})=>{
    const socket = useMemo(()=>io(server,{withCredentials:true,transports: ["polling","websocket"]}),[])
    socket.on("connect", () => {
  const transport = socket.io.engine.transport.name; // in most cases, "polling"

  socket.io.engine.on("upgrade", () => {
    const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
  });
}); //

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    )
}


export {getSocket,SocketProvider}
