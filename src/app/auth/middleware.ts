// 5. Create a middleware.ts for Session Handling:

// Ensure the file is .ts.

// middleware.ts
import {
  auth
} from "@/auth"; // Import the auth function

export default auth; // Export the auth middleware directly

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};