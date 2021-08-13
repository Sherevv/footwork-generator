<template>
<span>
    <el-button class="gogenerate-btn" type="warning" @click="goToGenerator()">
        <it-svgicon icon="lightning" class="icon-lightning-single"></it-svgicon>
    </el-button>

    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <symbol id="icon-lightning" viewBox="0 0 512 512">
                <g>
                    <polygon points="320.557,215.066 203.181,512 246.321,215.066 	"/>
                    <polygon points="351.806,0 234.43,296.934 160.194,296.934 203.339,0 	"/>
                </g>
            </symbol>
        </defs>
    </svg>
</span>
</template>
<script src="./generate-btn.ts"></script>
<style src="./generate-btn.scss" lang="scss"></style>