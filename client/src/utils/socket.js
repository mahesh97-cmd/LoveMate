import io from "socket.io-client"
import {SOCKET_URL } from "./constants"

export const createSocketConnection=()=>{
    return io(import.meta.env.VITE_BASE_KEY)
}