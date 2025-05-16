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


  return (
    <nav
            class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
          >
            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <span class="nav-item nav-link px-0 me-xl-4">
                <i class="bx bx-menu bx-sm">
                  <!-- left Nav bar **needs to be edited later -->
                    <a href="javascript:void(0)">
                  <img src="/img/icons/main-menu.png" class="logo-top">
                    </a>
                </i>

              </span>
            </div>
        <form th:action="@{/page/owner/logout}" method="post" style="display: inline;">
            <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" />
            <button type="submit" class="btn btn-link" style="padding: 0; border: none; background: none;">
                <i class="bx bx-log-out"></i>
                <span class="align-middle">Log Out</span>
            </button>
        </form>
          </nav>
                  <!-- Menu -->
        <!-- Nav Bar -->
        <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
            <div class="app-brand demo">
              <a href="/page/restaurant/list" class="app-brand-link">
                  <img src="/img/logo/logo-gray.png" class = "logo-nav"alt="">
              </a>

              <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                <i class="bx bx-chevron-left bx-sm align-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7a1 1 0 00-1.41 1.42L10.59 12l-4.9 4.89a1 1 0 101.41 1.42L12 13.41l4.89 4.9a1 1 0 001.42-1.42L13.41 12l4.89-4.89a1 1 0 000-1.4z"/>
                    </svg>
                </i>
              </a>

            </div>

            <div class="menu-inner-shadow"></div>

            <ul class="menu-inner py-1">
              <!-- Dashboard -->
              <!-- <li class="menu-item active">
                <a href="index.html" class="menu-link">
                  <i class="menu-icon tf-icons bx bx-home-circle"></i>
                  <div data-i18n="Analytics">Dashboard</div>
                </a>
              </li> -->

              <!-- Layouts -->


              <li class="menu-header small text-uppercase">
                <span class="menu-header-text">Pages</span>
              </li>
              <li class="menu-item">
                <a href="javascript:void(0);" class="menu-link menu-toggle restaurant_link">
                  <i class="menu-icon tf-icons bx bx-dock-top"></i>
                  <div data-i18n="Account Settings">My Restaurant</div>
                </a>
                <ul class="menu-sub">
                    <li>
                        <a href="/page/restaurant/list" class="menu-link category_link">
                            <div data-i18n="Connections">Restaurant List</div>
                        </a>
                    </li>

                    <!--          inventory Slide down          -->
                    <li class="menu-item">
                        <a href="javascript:void(0);" class="menu-link menu-toggle restaurant_link">
                            <i class="menu-icon tf-icons bx bx-dock-top"></i>
                            <div data-i18n="inventory">Inventory</div>
                        </a>
                        <ul class="menu-sub">
                            <li>
                                <a href="/page/inventory/list" class="menu-link inventory_link">
                                    <div data-i18n="inventory">Inventory List</div>
                                </a>
                            </li>
                            <li>
                                <a href="/page/category/list" class="menu-link inventory_link">
                                    <div data-i18n="category">Category List</div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <!--           /inventory slide down         -->

                    <li class="menu-item">
                        <a href="javascript:void(0);" class="menu-link menu-toggle restaurant_link">
                            <i class="menu-icon tf-icons bx bx-dock-top"></i>
                            <div data-i18n="employee">Employee</div>
                        </a>
                        <ul class="menu-sub">
                            <li>
                                <a href="/page/employee/list" class="menu-link inventory_link">
                                    <div data-i18n="employee">Employee List</div>
                                </a>
                            </li>
                            <li>
                                <a href="/page/employee/schedule/list" class="menu-link inventory_link">
                                    <div data-i18n="employee">Employee Schedule</div>
                                </a>
                            </li>
                        </ul>
                    </li>


<!--                    <li>-->
<!--                        <a href="/page/payroll/list" class="menu-link payroll_link">-->
<!--                            <div data-i18n="Connections">Payroll(Not Ready)</div>-->
<!--                        </a>-->
<!--                    </li>-->
                    <li class="menu-item">
                        <a href="/page/announcement/list" class="menu-link">
                            <i class="menu-icon tf-icons bx bx-collection"></i>
                            <div data-i18n="Basic">Announcment</div>
                        </a>
                    </li>


                </ul>

              <!-- Components -->
<!--              <li class="menu-header small text-uppercase"><span class="menu-header-text">Not Ready</span></li>-->
              <!-- Cards -->
<!--              <li class="menu-item">-->
<!--                <a href="cards-basic.html" class="menu-link">-->
<!--                  <i class="menu-icon tf-icons bx bx-collection"></i>-->
<!--                  <div data-i18n="Basic">Announcment</div>-->
<!--                </a>-->
<!--              </li>-->
              <!-- User interface -->
            </ul>
          </aside>
          <!-- / Menu -->
          </div>
  )
}