import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TourPackage {
  id?: string | number;
  _id?: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  category: string;
  image: string;
  features: string[];
}

interface BookingState {
  selectedPackage: TourPackage | null;
}

const initialState: BookingState = {
  selectedPackage: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingPackage: (state, action: PayloadAction<TourPackage>) => {
      state.selectedPackage = action.payload;
    },
    clearBookingPackage: (state) => {
      state.selectedPackage = null;
    },
  },
});

export const { setBookingPackage, clearBookingPackage } = bookingSlice.actions;
export default bookingSlice.reducer;
