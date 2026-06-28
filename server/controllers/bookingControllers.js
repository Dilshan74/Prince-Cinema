import Show from "../models/show";


//Function to check availability of seats for a specific show
const checkSeatAvailability = async (ShowId, selectedSeats) => {
  try {
    // Find the show by its ID
    const showData = await Show.findById(ShowId);
    if(!showData) return false; // Show not found

    const occupiedSeats = showData.occupiedSeats || [];

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
    return !isAnySeatTaken; // Return true if all selected seats are available
  } catch (error) {
    console.log("Error checking seat availability:", error);
    return false; // Return false in case of an error
  }   
}

export const createBooking = async (req, res) => {
  try {
    const {userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const {origin } = req.headers;

    //check if the seat is available for the selected show
    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: "One or more selected seats are already booked." });
    }

    //Get the show data
    const showData = await Show.findById(showId).populate('movie');

    // Create a new booking 
    const newBooking = await BookingsTable.create({
      user: userId,
      show: showId,
      amount: showData.price * selectedSeats.length,
      bookedSeats: selectedSeats,

    })

    selectedSeats.map(seat => {
      showData.occupiedSeats[seat] = userId;
    })

    showData.markModified('occupiedSeats');
    await showData.save();

    //Stripe Gateway Integration
    res.json({ success: true, message: "Booking created successfully"});

  } catch (error) {
    console.log(error.message) ;
    res.json({ success: false, message: "Error creating booking" });
  }
}

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error fetching occupied seats" });
  } 
}

