import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const { profile, loading: authLoading } = useAuth();
  const [hotelId, setHotelId] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    setHotelId(profile?.hotel_id || null);
  }, [profile, authLoading]);

  return (
    <HotelContext.Provider
      value={{
        hotelId,
        loading: authLoading
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);

  if (!context) {
    throw new Error("useHotel must be used inside HotelProvider");
  }

  return context; 
};