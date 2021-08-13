<template>
  <div>
    <h1 class="main-header"><span v-translate>Footwork_Generator</span> {{ version }}</h1>
    <div class="generator">
      <div class="cards">
        <div v-for="(card, i) in cards" class="card-block" :class="['row' + options.bit_count]">
          <div v-if="options.show_bits" class="card-index"><span class="badge">{{ i + 1 }}</span></div>
          <div v-if="i%options.bit_count === 0 && options.show_row_index" class="row-index">
            {{ Math.floor((i + 1) / options.bit_count) + 1 }}
          </div>
          <div class="card" :class="card.style">{{ card.num_string }}</div>
          <div v-if="options.step_names" class="card-lbl" :class="card.label_class">{{ card.step }}</div>
          <div v-if="options.manual_mode">
            <el-select class="bit-select" v-model="nums[i]" @change="rerender()">
              <el-option
                  v-for="j in classes"
                  :key="j.num"
                  :label="j.num_string"
                  :value="j.num"
                  size="mini">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="generator-btns">
        <div class="sound-btns-generator" v-if="isAudio">
          <el-button class="play-btn" type="danger" @click="toggleSound()">
            <it-svgicon v-show="!beats_on" icon="play" icon-class="icon-btn"></it-svgicon>
            <it-svgicon v-show="beats_on" icon="stop" icon-class="icon-btn"></it-svgicon>
          </el-button>
        </div>
        <div class="add-row-btn">
          <el-button type="success" @click="addBeats()">
            <it-svgicon icon="plus"></it-svgicon>
          </el-button>
        </div>
        <div class="del-row-btn" v-if="options.rows>1">
          <el-button type="success" @click="removeBeats()">
            <it-svgicon icon="minus"></it-svgicon>
          </el-button>
        </div>
        <div class="generator-btn">

          <el-button type="warning" @click="generate([])" :key="$translate.current">
            <it-svgicon icon="lightning"></it-svgicon>
            {{ t('Generate') }}
          </el-button>

        </div>

        <div class="share-btn">
          <el-button @click="toggleShareRhythm()" :title="t('Share_rhythm')">
            <it-svgicon icon="share" icon-class="icon-btn"></it-svgicon>
          </el-button>
        </div>
        <div v-show="isShowShareLink" class="link-copy-block">
          <div class="container">
            <el-input type="text" ref="sharedLink" autofocus="true" class="form-control sharedLink" v-model="shareLink">
              <template #append>
                <el-button type="success" @click="copyLink()">
                  <it-svgicon icon="copy"></it-svgicon>
                </el-button>
              </template>
            </el-input>
          </div>
          <p v-if="copySucceeded === 1">{{ t('copied') }}</p>
          <p v-if="copySucceeded === 2">{{ t('press_CTRL+C') }}</p>
        </div>
      </div>
    </div>


    <div class="info">

      <el-collapse ref="collapse">
        <el-collapse-item name="1" :key="$translate.current">
          <template #title>
            <it-svgicon icon="settings"></it-svgicon>
            <span v-translate class="settings-title">Settings</span>
          </template>

          <p>
            <it-svgicon icon="info"></it-svgicon>
            {{ t('About_options') }}
            <router-link v-bind:to="{name: 'Description', params:{lang: $translate.lang()}}">{{ t('Description') }}
            </router-link>
          </p>

          <div class="well">

            <p>
              <label class="label-radio">
                <el-switch v-model="options.manual_mode"
                           :inactive-color="swOffClr"></el-switch>
                {{ t('Manual_mode') }}</label>
            </p>

            <div class="row">
              <div class="col2">
                <p><label v-translate>Number_of_bits</label><br/>
                  <el-radio-group v-model="options.bit_count">
                    <el-radio-button :label="4">4</el-radio-button>
                    <el-radio-button :label="6">6</el-radio-button>
                    <el-radio-button :label="8">8</el-radio-button>
                  </el-radio-group>
                </p>

                <label v-translate>Steps</label>

                <p>
                  <label class="label-radio">
                    <el-switch v-model="options.rock_step" :inactive-color="swOffClr"
                               :disabled="options.manual_mode"></el-switch>
                    {{ t('Save_rock_step') }}</label>
                </p>

                <p>
                  <label class="label-radio">
                    <el-switch v-model="options.show_triple" :inactive-color="swOffClr"
                               :disabled="!options.step_names"
                    ></el-switch>
                    {{ t('Show_triple') }}</label>
                </p>

                <p><label class="label-radio">
                  <el-switch v-model="options.kick_instead_hold" :inactive-color="swOffClr"
                             :disabled="!options.step_names"></el-switch>
                  {{ t('kick_instead_hold') }}</label>
                </p>

                <p><label>{{ t('Syncopation_max') }}:</label>
                  <el-select v-model="options.syncopation" default-first-option>
                    <el-option
                        v-for="j in (options.bit_count+1)"
                        :key="j-1"
                        :label="j-1"
                        :value="j-1"
                        size="mini">
                    </el-option>
                  </el-select>
                </p>
              </div>
              <div class="col2">
                <p><label>{{ t('Evenness') }}:</label>
                  <el-select v-model="options.evenness" :key="$translate.current">
                    <el-option :label="t('No_matter')" value="no" :key="'no'"></el-option>
                    <el-option :label="t('Save_even')" value="even" :key="'even'"></el-option>
                    <el-option :label="t('Save_odd')" value="odd" :key="'odd'"></el-option>
                  </el-select>
                </p>

                <p>
                  <label class="label-radio">
                    <el-switch v-model="options.step_names" :inactive-color="swOffClr"></el-switch>
                    {{ t('Show_step_names') }}</label>
                </p>

                <p>
                  <label class="label-radio">
                    <el-switch v-model="options.show_bits" :inactive-color="swOffClr"></el-switch>
                    {{ t('Show_bits') }}</label>
                </p>

                <p>
                  <label class="label-radio">
                    <el-switch v-model="options.show_row_index" :inactive-color="swOffClr"></el-switch>
                    {{ t('Show_row_index') }}</label>
                </p>

                <p>
                  <label class="label-radio">
                    <el-switch v-model="options.couple" :inactive-color="swOffClr"
                               :disabled="!options.step_names"></el-switch>
                    {{ t('Group_two_steps') }}</label>
                </p>
              </div>
            </div>
          </div>

          <p v-if="!isAudio" v-translate>Sound_Error</p>

          <it-sound v-if="isAudio" :options="options" :beats="beats"
                    :isA="isAudio" :swOffClr="swOffClr"></it-sound>

        </el-collapse-item>
      </el-collapse>

    </div>
    <vue-headful :title="t('TITLE')"
                 :lang="$route.params.lang"
                 :description="t('META_DESCRIPTION')"
                 :keywords="t('META_KEYWORDS')"/>

    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol id="icon-play" viewBox="0 0 20 20">
          <polygon points="3,0 3,20 20, 10"/>
        </symbol>
        <symbol id="icon-stop" viewBox="0 0 20 20">
          <rect x="2" y="2" width="15" height="15"/>
        </symbol>
        <symbol id="icon-settings" viewBox="0 0 1000 1000">
          <g transform="matrix(1 0 0 -1 0 1952)">
            <path
                d="M80,1049.5c0-19.3,15.7-35,35-35c19.3,0,35,15.7,35,35l0,210H80V1049.5L80,1049.5z M150,1854.5c0,19.3-15.7,35-35,35c-19.3,0-35-15.7-35-35v-210h70L150,1854.5z M185,1609.5l-140,0c-19.3,0-35-15.7-35-35v-245c0-19.3,15.7-35,35-35h140c19.3,0,35,15.7,35,35v245C220,1593.8,204.3,1609.5,185,1609.5z M465,1049.5c0-19.3,15.7-35,35-35c19.3,0,35,15.7,35,35v70h-70V1049.5z M535,1854.5c0,19.3-15.7,35-35,35s-35-15.7-35-35v-350h70V1854.5z M570,1469.5H430c-19.3,0-35-15.7-35-35v-245c0-19.3,15.7-35,35-35h140c19.3,0,35,15.7,35,35v245C605,1453.8,589.3,1469.5,570,1469.5z M850,1049.5c0-19.3,15.7-35,35-35s35,15.7,35,35v350h-70V1049.5L850,1049.5z M920,1854.5c0,19.3-15.7,35-35,35c-19.3,0-35-15.7-35-35v-70h70V1854.5z M955,1749.5H815c-19.3,0-35-15.7-35-35v-245c0-19.3,15.7-35,35-35h140c19.3,0,35,15.7,35,35v245C990,1733.8,974.3,1749.5,955,1749.5z"/>
          </g>
        </symbol>
        <symbol id="icon-info" viewBox="0 0 1000 1000">
          <path
              d="M500,10C229.4,10,10,229.4,10,500s219.4,490,490,490s490-219.4,490-490S770.6,10,500,10z M576.9,680.3c-37,55.5-74.6,98.3-137.9,98.3c-43.2-7-60.9-38-51.6-69.5l81.4-269.7c2-6.6-1.3-13.6-7.4-15.8c-6-2.1-17.8,5.7-27.9,16.8l-49.2,59.2c-1.3-10-0.2-26.4-0.2-33c37-55.5,97.7-99.3,138.9-99.3c39.2,4,57.7,35.3,50.9,69.7l-82,271c-1.1,6.1,2.1,12.3,7.7,14.3c6,2.1,18.7-5.7,28.9-16.8l49.2-59.2C579.1,656.2,576.9,673.6,576.9,680.3z M565.9,328.1c-31.1,0-56.4-22.7-56.4-56.1c0-33.4,25.3-56,56.4-56c31.1,0,56.4,22.7,56.4,56C622.3,305.4,597,328.1,565.9,328.1z"/>
        </symbol>
        <symbol id="icon-plus" viewBox="0 0 100 100">
          <g>
            <rect height="40" width="100" x="0" y="30"/>
            <rect height="100" width="40" x="30" y="0"/>
          </g>
        </symbol>
        <symbol id="icon-minus" viewBox="0 0 100 100">
          <rect height="40" width="100" x="0" y="30"/>
        </symbol>
        <symbol id="icon-share" viewBox="0 0 24 24">
          <path
              d="M 20 0 C 17.789063 0 16 1.789063 16 4 C 16 4.277344 16.039063 4.550781 16.09375 4.8125 L 7 9.375 C 6.265625 8.535156 5.203125 8 4 8 C 1.789063 8 0 9.789063 0 12 C 0 14.210938 1.789063 16 4 16 C 5.203125 16 6.265625 15.464844 7 14.625 L 16.09375 19.1875 C 16.039063 19.449219 16 19.722656 16 20 C 16 22.210938 17.789063 24 20 24 C 22.210938 24 24 22.210938 24 20 C 24 17.789063 22.210938 16 20 16 C 18.796875 16 17.734375 16.535156 17 17.375 L 7.90625 12.8125 C 7.960938 12.550781 8 12.277344 8 12 C 8 11.722656 7.960938 11.449219 7.90625 11.1875 L 17 6.625 C 17.734375 7.464844 18.796875 8 20 8 C 22.210938 8 24 6.210938 24 4 C 24 1.789063 22.210938 0 20 0 Z "/>
        </symbol>
        <symbol id="icon-copy" viewBox="0 0 1000 1000">
          <path
              d="M691,160.8V10H269.5C206.3,72.6,143.1,135.2,80,197.8v641.4h227.9V990H920V160.8H691z M269.5,64.4v134.4H133.1C178.5,154,224,109.2,269.5,64.4z M307.9,801.2H117.5V236.8h190.5V47.9h344.5v112.9h-154c-63.5,62.9-127,125.9-190.5,188.8V801.2z M499.5,215.2v134.5H363.1v-1c45.1-44.5,90.2-89,135.3-133.5L499.5,215.2z M881.5,952h-535V386.6H538V198.8h343.5V952z"/>
        </symbol>
        <symbol id="icon-lightning" viewBox="0 0 512 512">
          <g>
            <polygon points="320.557,215.066 203.181,512 246.321,215.066 	"/>
            <polygon points="351.806,0 234.43,296.934 160.194,296.934 203.339,0 	"/>
          </g>
        </symbol>
      </defs>
    </svg>
  </div>
</template>
<script src="./generator.ts"></script>
<style src="./generator.scss" lang="scss"></style>