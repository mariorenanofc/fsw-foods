"use client";

import { useSearchParams } from "next/navigation";

const Restaurants = () => {
  const searchParams = useSearchParams();

  return searchParams.get("search");
};

export default Restaurants;
