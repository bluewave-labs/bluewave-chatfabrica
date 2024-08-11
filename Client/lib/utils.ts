import { type ClassValue, clsx } from "clsx"
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge"
import axios from "axios"

export const LEMON_SQUEEZY_ENDPOINT = "https://api.lemonsqueezy.com/v1/";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSessionToken(session: Session | null) {
  if (!session) return null;
  try {
    return session.user.accessToken;
  } catch (err) {
    return null;
  }
}

export const lemonSqueezyApiInstance = axios.create({
  baseURL: LEMON_SQUEEZY_ENDPOINT,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  },
});
