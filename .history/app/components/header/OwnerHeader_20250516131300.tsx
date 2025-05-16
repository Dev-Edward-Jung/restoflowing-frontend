"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export default function useRestaurantNavigationEnhancer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      alert("레스토랑 정보가 없습니다. 다시 로그인해주세요.");
      router.push("/auth/owner/login");
      return;
    }

    // 메뉴 링크에 restaurantId 파라미터 추가
    const links = document.querySelectorAll("a.menu-link");
    links.forEach(link => {
      const href = link.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        !href.includes("restaurantId=")
      ) {
        const separator = href.includes("?") ? "&" : "?";
        const newHref = `${href}${separator}restaurantId=${restaurantId}`;
        link.setAttribute("href", newHref);
      }
    });

  }, [router, searchParams]);


  return 
}