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
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

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
        } else {
            setUser(null);
            setFavourites([]);
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

    // Verify admin status with the backend using adminToken
    const fetchIsAdmin = async () => {
        try {
            const storedAdminToken = localStorage.getItem('adminToken');
            if (!storedAdminToken) {
                setIsAdmin(false);
                return false;
            }

            const response = await axios.get("/api/admin/is-admin", {
                headers: { Authorization: `Bearer ${storedAdminToken}` }
            });

            if (response.data.success) {
                setIsAdmin(true);
                setAdminToken(storedAdminToken);
                return true;
            } else {
                setIsAdmin(false);
                localStorage.removeItem('adminToken');
                setAdminToken(null);
                return false;
            }
        } catch (error) {
            setIsAdmin(false);
            localStorage.removeItem('adminToken');
            setAdminToken(null);
            return false;
        }
    };

    // Admin login function
    const adminLogin = async (email, password) => {
        try {
            const response = await axios.post("/api/admin/login", { email, password });
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                setAdminToken(response.data.token);
                setIsAdmin(true);
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    // Admin logout function
    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
        setIsAdmin(false);
        navigate('/');
    };

    useEffect(() => {
        if (adminToken) {
            fetchIsAdmin();
        } else {
            setIsAdmin(false);
        }
    }, []);

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
        adminLogin,
        adminLogout,
        adminToken,
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

