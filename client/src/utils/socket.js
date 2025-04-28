import io from "socket.io-client"
import { BASE_URL,SOCKET_URL } from "./constants"

export const createSocketConnection=()=>{
    return io(SOCKET_URL)
}