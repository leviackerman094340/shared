/**
 * Service Badge Utility
 * Provides consistent badge configuration for service names
 */

export interface ServiceBadge {
  letter: string;
  color: string;
}

export function getServiceBadge(serviceName: string): ServiceBadge {
  const name = serviceName.toLowerCase();
  
  if (name.includes("netflix")) {
    return { letter: "N", color: "bg-red-600" };
  }
  if (name.includes("spotify")) {
    return { letter: "S", color: "bg-green-500" };
  }
  if (name.includes("disney")) {
    return { letter: "D", color: "bg-blue-600" };
  }
  if (name.includes("hbo")) {
    return { letter: "H", color: "bg-blue-600" };
  }
  if (name.includes("amazon")) {
    return { letter: "A", color: "bg-orange-500" };
  }
  if (name.includes("apple")) {
    return { letter: "A", color: "bg-gray-800" };
  }
  if (name.includes("youtube")) {
    return { letter: "Y", color: "bg-red-500" };
  }
  if (name.includes("xbox")) {
    return { letter: "X", color: "bg-black" };
  }
  if (name.includes("adobe")) {
    return { letter: "A", color: "bg-red-600" };
  }
  if (name.includes("playstation")) {
    return { letter: "P", color: "bg-blue-800" };
  }
  if (name.includes("twitter")) {
    return { letter: "X", color: "bg-black" };
  }
  if (name.includes("icloud")) {
    return { letter: "I", color: "bg-black" };
  }
  if (name.includes("google")) {
    return { letter: "G", color: "bg-yellow-400" };
  }
  if (name.includes("canva")) {
    return { letter: "C", color: "bg-purple-600" };
  }
  if (name.includes("linkedin")) {
    return { letter: "L", color: "bg-blue-700" };
  }
  if (name.includes("udemy")) {
    return { letter: "U", color: "bg-purple-700" };
  }
  if (name.includes("duolingo")) {
    return { letter: "D", color: "bg-green-700" };
  }
  if (name.includes("tinder")) {
    return { letter: "T", color: "bg-pink-500" };
  }
  if (name.includes("tradingview")) {
    return { letter: "T", color: "bg-black" };
  }
  if (name.includes("dropbox")) {
    return { letter: "D", color: "bg-blue-700" };
  }
  if (name.includes("notion")) {
    return { letter: "N", color: "bg-black" };
  }
  if (name.includes("coursera")) {
    return { letter: "C", color: "bg-blue-700" };
  }
  if (name.includes("nintendo")) {
    return { letter: "N", color: "bg-red-600" };
  }
  if (name.includes("masterclass")) {
    return { letter: "M", color: "bg-black" };
  }
  if (name.includes("skillshare")) {
    return { letter: "S", color: "bg-green-900" };
  }
  if (name.includes("capcut")) {
    return { letter: "C", color: "bg-black" };
  }
  if (name.includes("booking.com")) {
    return { letter: "B", color: "bg-blue-800" };
  }
  if (name.includes("agoda")) {
    return { letter: "A", color: "bg-blue-600" };
  }
  if (name.includes("airbnb")) {
    return { letter: "A", color: "bg-pink-600" };
  }
  if (name.includes("zoom")) {
    return { letter: "Z", color: "bg-blue-600" };
  }
  
  // Default badge
  return {
    letter: serviceName.charAt(0).toUpperCase(),
    color: "bg-gray-600",
  };
}
