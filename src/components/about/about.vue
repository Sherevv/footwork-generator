<template>
  <div class="content-div about-div">
    <h1 class="page-heading" v-translate>About</h1>
    <p v-html="t('About_1')"></p>
    <p v-html="t('About_2')"></p>
    <p>
      <span v-translate>About_3</span
      ><a :href="'mailto:' + email">{{ email }}</a
      ><span v-translate>About_3_1</span><span v-translate>About_4</span>:
    </p>

    <it-contact-form :key="$translate.current"></it-contact-form>

    <p>
      <span v-translate>About_6</span>
      <it-svgicon icon="arrowDown"></it-svgicon>
    </p>

    <svg
      style="position: absolute; width: 0; height: 0; overflow: hidden"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <symbol id="icon-person" viewBox="0 0 1000 1000">
          <path
            d="M500,500c135.4,0,245-109.9,245-245c0-135.4-109.6-245-245-245S255,119.6,255,255C255,390.1,364.6,500,500,500z M500,622.5c-163.2,0-490,81.8-490,245V990h980V867.5C990,704.3,663.2,622.5,500,622.5z"
          />
        </symbol>
        <symbol id="icon-at" viewBox="0 0 1000 1000">
          <path
            d="M735.3,610.9c0,42.9,12.2,60,44.1,60c71.1,0,116.4-90.6,116.4-241.3c0-230.3-167.8-340.5-377.4-340.5c-215.5,0-411.6,144.5-411.6,417.7c0,260.9,171.5,403,434.9,403c89.4,0,149.5-9.8,241.3-40.4l19.7,82c-90.6,29.5-187.5,38-262.2,38C195,989.4,10,799.5,10,506.7C10,211.5,224.4,10.6,519.7,10.6C827.1,10.6,990,194.4,990,419.8c0,191.1-60,336.9-248.6,336.9c-85.8,0-142.1-34.3-149.5-110.3c-22,84.5-80.8,110.3-160.5,110.3c-106.6,0-196-82.1-196-247.4c0-166.6,78.5-269.5,219.3-269.5c74.7,0,121.3,29.4,142,76l35.6-64.9h102.9v360.2L735.3,610.9L735.3,610.9z M584.7,449.2c0-67.3-50.3-95.5-91.9-95.5c-45.3,0-95.5,36.7-95.5,144.5c0,85.8,38,133.5,95.5,133.5c40.4,0,91.9-25.7,91.9-96.8V449.2L584.7,449.2z"
          />
        </symbol>
        <symbol id="icon-message" viewBox="0 0 1000 1000">
          <path
            d="M956.3,21H43.5C24.9,21,10,36.1,10,54.6v649.5c0,18.5,15,33.6,33.5,33.6h134.1v207.9c0,13.8,8.5,26.2,21.4,31.1c3.9,1.7,8.1,2.3,12.2,2.3c9.1,0,18.2-3.8,24.7-10.8l212.3-230.5h508.3c18.5,0,33.6-15.1,33.6-33.6V54.6C989.9,36.1,974.8,21,956.3,21z M483.7,607.5H186v-83.9h297.8V607.5z M813.9,421.5H186v-83.9h627.9V421.5z M813.9,235.7H186v-83.9h627.9V235.7z"
          />
        </symbol>
        <symbol id="icon-arrowDown" viewBox="0 0 1000 1000">
          <path
            d="M951.3,416.9l-246.3-0.1L705,10H294.6v406.9H48.7L500,990L951.3,416.9z"
          />
        </symbol>
      </defs>
    </svg>
    <vue-headful
      :title="t('About') + ' | ' + t('TITLE')"
      :lang="$route.params.lang"
      :description="t('About_meta_description')"
    />
  </div>
</template>
<script src="./about.ts"></script>
