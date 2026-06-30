import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const location = useLocation();
    const navigate = useNavigate();

    // Get token from localStorage
    const getToken = () => token;

    // Fetch current user
    const fetchCurrentUser = async () => {
        try {
            if (!token) return;

            const response = await axios.get("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            // Token might be invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token]);

    // Set up interceptor to include token in all requests
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => axios.interceptors.request.eject(interceptor);
    }, [token]);

    const fetchIsAdmin = async () => {
        try {
            if (!token) {
                setIsAdmin(false);
                return;
            }

            // For now, just check if user exists
            setIsAdmin(true);

            if(!isAdmin && location.pathname.startsWith("/admin")) {
                navigate("/");
                toast.error("You are not authorized to access this page.");
            }
        } catch (error) {
            toast.error("Failed to verify admin status.");
            setIsAdmin(false);
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
            if (!token) return;

            const {data} = await axios.get("/api/user/favourites", {
                headers: { Authorization: `Bearer ${token}` }
            });
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
        if (token) {
            fetchFavourites();
        }
    }, [token]); 

    const value = { 
        axios,
        fetchIsAdmin,
        user, 
        getToken, 
        navigate, 
        isAdmin, 
        shows,
        favourites, 
        fetchFavourites,
        token,
        setToken
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

