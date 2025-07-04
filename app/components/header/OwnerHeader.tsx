'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const handleToggle = () => {
  if (typeof window !== 'undefined' && window.Helpers) {
    window.Helpers.toggleCollapsed();
  } else {
    console.warn("Sneat Helpers.js not loaded yet.");
  }
};

export default function OwnerMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuInitialized, setMenuInitialized] = useState(false);

  useEffect(() => {
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      alert("레스토랑 정보가 없습니다. 다시 로그인해주세요.");
      router.push("/auth/owner/login");
      return;
    }

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

    if (!menuInitialized && typeof window !== 'undefined' && window.Menu) {
      new window.Menu(document.querySelector('#layout-menu'), {
        orientation: 'vertical',
        closeChildren: false,
      });
      setMenuInitialized(true);
    }
  }, [router, searchParams, menuInitialized]);

  return (
    <>
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <span className="nav-item nav-link px-0 me-xl-4">
            <button onClick={handleToggle}>
              <Image src="/img/icons/main-menu.png" 
              alt="main menu icon"
              className="logo-top"
              width={300}
              height={300}
              />
            </button>
          </span>
        </div>

        {/* <a href="/auth/account" className="menu-link">Account</a> */}
        <a className="menu-link" href="/chat">
          <Image
          src='/img/icons/chat-gray.png'
          alt="Chat icon"
          style={{
            cursor:'pointer'
          }}
          width={30}
          height={30}
        />
        </a>
      </nav>

      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo">
          <a href="/restaurant/list" className="app-brand-link">
            <Image src="/img/logo/logo-gray.png" className="logo-nav" alt="logo" width={300} height={300}/>
          </a>
          <a onClick={handleToggle} className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
            <i className="bx bx-chevron-left bx-sm align-middle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7a1 1 0 00-1.41 1.42L10.59 12l-4.9 4.89a1 1 0 101.41 1.42L12 13.41l4.89 4.9a1 1 0 001.42-1.42L13.41 12l4.89-4.89a1 1 0 000-1.4z" />
              </svg>
            </i>
          </a>
        </div>

        <div className="menu-inner-shadow"></div>

        <ul className="menu-inner py-1">
          <li className="menu-header small text-uppercase">
            <span className="menu-header-text">Restaurant</span>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-dock-top"></i>
              <div data-i18n="Account Settings">Restaurant</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-dock-top"></i>
                  <div data-i18n="inventory">Inventory</div>
                </a>
                <ul className="menu-sub">
                  <li><a href="/inventory/list" className="menu-link">Stock</a></li>
                  <li><a href="/inventory/category/list" className="menu-link">Category</a></li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-dock-top"></i>
                  <div data-i18n="employee">Employee</div>
                </a>
                <ul className="menu-sub">
                  <li><a href="/employee/list" className="menu-link">Invite</a></li>
                  <li><a href="/schedule/list" className="menu-link">Schedule</a></li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="/announcement/list" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-collection"></i>
                  <div data-i18n="Basic">Announcement</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="/payroll/dashboard" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-collection"></i>
                  <div data-i18n="Basic">PayRoll</div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </>
  );
}