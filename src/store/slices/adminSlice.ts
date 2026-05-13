import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  isAdmin: boolean;
  adminData: any | null;
  loading: boolean;
}

const initialState: AdminState = {
  isAdmin: false,
  adminData: null,
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminInfo: (
      state,
      action: PayloadAction<{ isAdmin: boolean; adminData?: any }>,
    ) => {
      state.isAdmin = action.payload.isAdmin;
      state.adminData = action.payload.adminData || null;
      state.loading = false;
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAdminInfo: (state) => {
      state.isAdmin = false;
      state.adminData = null;
      state.loading = false;
    },
  },
});

export const { setAdminInfo, setAdminLoading, clearAdminInfo } =
  adminSlice.actions;
export default adminSlice.reducer;
