import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User 
} from "firebase/auth";
import { auth } from "../lib/firebase";

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export const authService = {
  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      console.error("Error registering user:", error);
      
      let errorMessage = "Failed to register.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email formatting.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please use at least 6 characters.";
          break;
        default:
          errorMessage = error.message;
      }
      
      return { user: null, error: errorMessage };
    }
  },

  /**
   * Log in an existing user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      console.error("Error logging in:", error);
      
      let errorMessage = "Failed to log in.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        default:
          errorMessage = error.message;
      }

      return { user: null, error: errorMessage };
    }
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<{ success: boolean; error: string | null }> {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error logging out:", error);
      return { success: false, error: error.message || "Failed to log out." };
    }
  }
};
