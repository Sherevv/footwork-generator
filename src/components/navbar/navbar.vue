<template>
  <nav id="nav-main" class="nav-main" role="navigation" v-cloak>
    <input type="checkbox" id="nav-toggle" hidden/>
    <div class="container">
      <a class="navbar-brand" href="/">
        <div id="logo"></div>
        Footwork Generator</a>
      <label for="nav-toggle" class="nav-toggle" onclick>
        <svg class="icon-nav icon-bars" aria-hidden="true" role="img">
          <use href="#icon-bars" xlink:href="#icon-bars"></use>
        </svg>
        <svg class="icon-nav icon-close" aria-hidden="true" role="img">
          <use href="#icon-close" xlink:href="#icon-close"></use>
        </svg>
      </label>

      <div class="nav">
        <ul>
          <template v-for="link in links" v-bind:key="link">
            <li v-if="link.name" v-bind:class="{'active': $route.name === link.name}">
              <router-link v-bind:to="localizePath(link.name)">{{ t(link.name) }}</router-link>
            </li>
          </template>
        </ul>

        <ul class="nav-right lang-block">
          <li>
            <button class="lang-btn" @click="changeLanguage('en')">
              <div class="flag-en"></div>
              EN
            </button>
            <button class="lang-btn" @click="changeLanguage('ru')">
              <div class="flag-ru"></div>
              RU
            </button>
          </li>
        </ul>
      </div>
    </div>
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol id="icon-close" viewBox="0 0 25 32">
          <path class="path1"
                d="M23.179 23.607q0 0.714-0.5 1.214l-2.429 2.429q-0.5 0.5-1.214 0.5t-1.214-0.5l-5.25-5.25-5.25 5.25q-0.5 0.5-1.214 0.5t-1.214-0.5l-2.429-2.429q-0.5-0.5-0.5-1.214t0.5-1.214l5.25-5.25-5.25-5.25q-0.5-0.5-0.5-1.214t0.5-1.214l2.429-2.429q0.5-0.5 1.214-0.5t1.214 0.5l5.25 5.25 5.25-5.25q0.5-0.5 1.214-0.5t1.214 0.5l2.429 2.429q0.5 0.5 0.5 1.214t-0.5 1.214l-5.25 5.25 5.25 5.25q0.5 0.5 0.5 1.214z"></path>
        </symbol>
        <symbol id="icon-angle-down" viewBox="0 0 21 32">
          <path class="path1"
                d="M19.196 13.143q0 0.232-0.179 0.411l-8.321 8.321q-0.179 0.179-0.411 0.179t-0.411-0.179l-8.321-8.321q-0.179-0.179-0.179-0.411t0.179-0.411l0.893-0.893q0.179-0.179 0.411-0.179t0.411 0.179l7.018 7.018 7.018-7.018q0.179-0.179 0.411-0.179t0.411 0.179l0.893 0.893q0.179 0.179 0.179 0.411z"></path>
        </symbol>
        <symbol id="icon-bars" viewBox="0 0 27 32">
          <path class="path1"
                d="M27.429 24v2.286q0 0.464-0.339 0.804t-0.804 0.339h-25.143q-0.464 0-0.804-0.339t-0.339-0.804v-2.286q0-0.464 0.339-0.804t0.804-0.339h25.143q0.464 0 0.804 0.339t0.339 0.804zM27.429 14.857v2.286q0 0.464-0.339 0.804t-0.804 0.339h-25.143q-0.464 0-0.804-0.339t-0.339-0.804v-2.286q0-0.464 0.339-0.804t0.804-0.339h25.143q0.464 0 0.804 0.339t0.339 0.804zM27.429 5.714v2.286q0 0.464-0.339 0.804t-0.804 0.339h-25.143q-0.464 0-0.804-0.339t-0.339-0.804v-2.286q0-0.464 0.339-0.804t0.804-0.339h25.143q0.464 0 0.804 0.339t0.339 0.804z"></path>
        </symbol>
      </defs>
    </svg>
  </nav>
</template>
<script src="./navbar.ts"></script>
<style src="./navbar.scss" lang="scss"></style>