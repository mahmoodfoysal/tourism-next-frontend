import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import { axiosSecure } from "@/hooks/useAxiosSecure";

// Define the User state
interface UserState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Robust helper to fetch token and sync user with backend.
 * Ensures the sync API is only called if the token fetch is successful.
 */
const authenticateAndSync = async (
  email: string,
  fullName: string,
  photoURL: string = "",
  shouldSync: boolean = false,
) => {
  try {
    // 1. Fetch JWT Token
    const tokenRes = await axiosSecure.post("/get-token", { email });
    const token = tokenRes.data.token;

    if (token) {
      sessionStorage.setItem("token", token);

      // 2. Sync with backend
      if (shouldSync) {
        await axiosSecure.post(
          "/api/tourism/insert-update-user-list",
          {
            email,
            full_name: fullName,
            photo_url: photoURL,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Authentication synchronization failed:", error);
    return false;
  }
};

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      fullName,
    }: { email: string; password: string; fullName: string },
    { rejectWithValue },
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: fullName });

      // New email registration always needs a sync
      const {
        uid,
        email: userEmail,
        displayName,
        photoURL,
      } = userCredential.user;
      await authenticateAndSync(email, fullName, photoURL || "", true);

      return { uid, email: userEmail, displayName, photoURL };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if it's a new account to avoid duplicate storage
      const additionalInfo = getAdditionalUserInfo(userCredential);
      const isNewUser = additionalInfo?.isNewUser || false;

      // Sync ONLY if the user is logging in for the first time
      const { uid, email, displayName, photoURL } = user;
      await authenticateAndSync(
        user.email || "",
        user.displayName || "Google User",
        photoURL || "",
        isNewUser,
      );

      return { uid, email, displayName, photoURL };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // For standard email login, we just fetch the token (sync was done during register)
      await authenticateAndSync(email, "", "", false);

      const {
        uid,
        email: userEmail,
        displayName,
        photoURL,
      } = userCredential.user;
      return { uid, email: userEmail, displayName, photoURL };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("token");
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
