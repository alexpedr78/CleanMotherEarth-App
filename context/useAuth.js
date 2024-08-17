import { useContext } from "react"
import { AuthContext } from "./AuthContextWrapper.js"
const useAuth = () => useContext(AuthContext)

export default useAuth
