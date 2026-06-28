import { createContext, useState, useContext, useEffect } from "react";
import { useAuth, useUser } from '@clerk/react';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favourites, setFavourites] = useState([]);


    const {user} = useUser();
    const {getToken} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();


    const fetchIsAdmin = async () => {
        try {
            const {data} = await axios.get("/api/is-admin", {headers: {Authorization: `Bearer ${await getToken()}`}});

            setIsAdmin(data.isAdmin);

            if(!data.isAdmin && location.pathname.startsWith("/admin")) {
                navigate("/");
                toast.error("You are not authorized to access this page.");
            }
        } catch (error) {
            toast.error("Failed to verify admin status.");
        }
    };

    useEffect(() => {
        if(user) {
            fetchIsAdmin();
        }
    }, [user]);

    const fetchshows = async () => {
        try {
            const {data} = await axios.get("/api/show/all");
            if(data.success) {
                setShows(data.shows);
            } else {
                toast.error("Failed to fetch shows.");
            }
        } catch (error) {
            console.error("Error fetching shows:", error);
        }
    };


    const fetchFavourites = async () => {
        try {
            const {data} = await axios.get("/api/user/favourites", {headers: {Authorization: `Bearer ${await getToken()}`}});
            if(data.success) {
                setFavourites(data.movies);
            } else {
                toast.error("Failed to fetch favourites.");
            }
        } catch (error) {
            console.error("Error fetching favourites:", error);
        }
    };

    useEffect(() => {
        fetchshows();
        fetchFavourites();
    }, []); 


    const value = { 
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows,
        favourites, fetchFavourites
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

