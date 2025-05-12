<script lang="ts">
import logo from "$lib/assets/logo/panoptique_logo_white.svg";
</script>

<header>
  <nav class="fixed top-0 z-50 h-18 w-full bg-th-blue border-b border-th-black-light">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between rtl:justify-end">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="{logo}" class="me-3 h-12" alt="Panoptique Logo" />
        </a>
        <button data-drawer-target="sidebar-nav-menu" data-drawer-toggle="sidebar-nav-menu" aria-controls="sidebar-nav-menu" type="button" class="inline-flex items-center p-2 text-sm text-th-white rounded-lg sm:hidden hover:bg-th-white focus:outline-none focus:ring-2 focus:ring-th-white ">
            <span class="sr-only">Ouvrir le menu</span>
            <svg class="w-9 h-9" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
      </div>
    </div>
  </nav>
</header>