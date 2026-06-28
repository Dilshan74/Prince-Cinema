
//API to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true });    
}


//API to get dashboard data for admin   
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await booking.find({isPaid: true});
        const activeShows = await show.find({date: {$gte: new Date()}}).populate('movie');
        const totalUsers = await user.countDocuments();
        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows: activeShows.length,
            totalUsers: totalUsers
        };
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error fetching dashboard data" });
    }   
}

//API to get all shows for admin
export const getAllShows = async (req, res) => {
    try {
        const shows = await show.find({showDate: {$gte: new Date()}}).populate('movie').sort({ showDate: 1, showTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error fetching shows" });
    }
}

//API to get all bookings for admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await booking.find({}).populate('user').populate({
            path: 'show',
            populate: {
                path: 'movie'
            }.sort({ createdAt: -1 })
        });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error fetching bookings" });
    }
}
