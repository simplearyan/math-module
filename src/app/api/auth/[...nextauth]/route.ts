// app/api/auth/[...nextauth]/route.ts
import {
  handlers
} from "@/auth"; // Referring to the auth.ts we just created

export const {
  GET,
  POST
} = handlers;

// Important for Cloudflare Pages (Edge Runtime)
export const runtime = "edge";
