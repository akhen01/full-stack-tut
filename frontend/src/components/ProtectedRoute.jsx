import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"

function ProtectedRoute({ children }){
    const [isAouthorized, setIsAoutherized] = useState(null);

    useEffect(() => {
        auth().catch(()=> setIsAoutherized(false))
    }, [])

    const refreshToken= async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if(res.status===200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAoutherized(true)
            }else{
                setIsAoutherized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAoutherized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token) {
            setIsAoutherized(false);
            return;
        }
        const decode = jwtDecode(token);
        const tokenExpiration = decode.exp;
        const now = Date.now() / 1000;

        if(tokenExpiration < now){
            await refreshToken();
        }
        else {
            setIsAoutherized(true);
        }
    };

    if (isAouthorized === null) {
        return <div>Loading...</div>;
    }

    return isAouthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;