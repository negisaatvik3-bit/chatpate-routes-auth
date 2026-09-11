import { homeImages } from "./images";

export const trips = [
  {
    title: "Bir × Barot Valley 2.0",
    slug: "bir-barot-valley-2-0",
    location: "Himachal Pradesh, India",
    dates: "4 — 6 Sept",
    duration: "3 Days",
    price: "₹8,999",
    image: homeImages.bir,
    alt: "Bir and Barot Valley",
  },
  {
    title: "Ghiyagi × Jibhi",
    slug: "ghiyagi-jibhi",
    location: "Himachal Pradesh, India",
    dates: "18 — 20 Sept",
    duration: "3 Days",
    price: "₹7,499",
    image: homeImages.jibhi,
    alt: "Ghiyagi Retreat and Jibhi",
  },
  {
    title: "Rishikesh",
    slug: "rishikesh",
    location: "Uttarakhand, India",
    dates: "27 — 28 Sept",
    duration: "2 Days", 
    price: "₹5,999",
    image: homeImages.rishikesh,
    alt: "Rishikesh",
  },
  {
    title: "Jim Corbett",
    slug: "jim-corbett",
    location: "Uttarakhand, India",
    dates: "11 — 13 Oct",
    duration: "3 Days",
    price: "₹8,599",
    image: homeImages.jim,
    alt: "Jim Corbett",
  },
  {
    title: "Udaipur",
    slug: "udaipur",
    location: "Rajasthan, India",
    dates: "30 Oct — 1 Nov",
    duration: "3 Days",
    price: "₹9,499",
    image: homeImages.udaipur,
    alt: "Udaipur",
  },
] as const;

export type Trip = (typeof trips)[number];