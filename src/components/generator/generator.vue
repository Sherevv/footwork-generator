<div>
    <h1 class="main-header"><span v-translate>Footwork_Generator</span> {{version}}</h1>
    <div class="generator">
        <div class="cards">
            <div v-for="(card, i) in cards" class="card-block">
                <div v-if="options.show_bits" class="card-index"><span class="badge">{{i + 1}}</span></div>
                <div class="card" :class="card.style">{{card.num}}</div>
                <div v-if="options.step_names" class="card-lbl" :class="card.label_class">{{card.step}}</div>
                <div v-if="options.manual_mode">
                    <el-select class="bit-select" v-model="nums[i]" @change="rerender()">
                        <el-option
                                v-for="j in [0,1,2]"
                                :key="j"
                                :label="j"
                                :value="j"
                                size="mini">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <div class="sound-btns-generator" v-if="isAudio">
            <el-button type="danger" @click="toggleSound()">
                <it-svgicon v-if="!beats_on" icon="play" icon-class="icon-btn"></it-svgicon>
                <it-svgicon v-if="beats_on" icon="stop" icon-class="icon-btn"></it-svgicon>
            </el-button>
        </div>
        <button class="btn btn-general btn-warning btn-lg generator-btn" @click="generate([])">{{t('Generate')}}
        </button>

    </div>


    <div class="info">

        <el-collapse>
            <el-collapse-item name="1">
                <template slot="title">
                    <it-svgicon icon="settings"></it-svgicon>
                    <span v-translate>Settings</span>
                </template>

                <p><it-svgicon icon="info"></it-svgicon> {{ t('About_options') }}
                    <router-link v-bind:to="{name: 'Description', params:{lang:$translate.lang}}">{{t('Description')}}
                    </router-link>
                </p>

                <div class="well">
                    <div class="row">
                        <div class="col2">
                            <p>
                                <label class="label-radio">
                                    <el-switch v-model="options.manual_mode"
                                               :inactive-color="swOffClr"></el-switch>
                                    {{ t('Manual_mode') }}</label>
                            </p>
                            <p><label v-translate>Number_of_bits</label><br/>
                                <el-radio-group v-model="options.bit_count">
                                    <el-radio-button :label="4">4</el-radio-button>
                                    <el-radio-button :label="6">6</el-radio-button>
                                    <el-radio-button :label="8">8</el-radio-button>
                                </el-radio-group>
                            </p>

                            <p><label>{{ t('Evenness') }}:</label>
                                <el-select v-model="options.evenness" default-first-option>
                                    <el-option :label="t('No_matter')" value="no"></el-option>
                                    <el-option :label="t('Save_even')" value="even"></el-option>
                                    <el-option :label="t('Save_odd')" value="odd"></el-option>
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
                                    <el-switch v-model="options.couple" :inactive-color="swOffClr"
                                               :disabled="!options.step_names"></el-switch>
                                    {{ t('Group_two_steps') }}</label>
                            </p>


                        </div>
                        <div class="col2"><label v-translate>Steps</label>

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
                        </div>
                    </div>
                </div>
                <p v-if="!isAudio" v-translate>Sound_Error</p>

                <it-sound v-if="isAudio" :options="options" :beats="beats"
                          :isA="isAudio"></it-sound>
            </el-collapse-item>
        </el-collapse>

    </div>

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
                    <path d="M80,1049.5c0-19.3,15.7-35,35-35c19.3,0,35,15.7,35,35l0,210H80V1049.5L80,1049.5z M150,1854.5c0,19.3-15.7,35-35,35c-19.3,0-35-15.7-35-35v-210h70L150,1854.5z M185,1609.5l-140,0c-19.3,0-35-15.7-35-35v-245c0-19.3,15.7-35,35-35h140c19.3,0,35,15.7,35,35v245C220,1593.8,204.3,1609.5,185,1609.5z M465,1049.5c0-19.3,15.7-35,35-35c19.3,0,35,15.7,35,35v70h-70V1049.5z M535,1854.5c0,19.3-15.7,35-35,35s-35-15.7-35-35v-350h70V1854.5z M570,1469.5H430c-19.3,0-35-15.7-35-35v-245c0-19.3,15.7-35,35-35h140c19.3,0,35,15.7,35,35v245C605,1453.8,589.3,1469.5,570,1469.5z M850,1049.5c0-19.3,15.7-35,35-35s35,15.7,35,35v350h-70V1049.5L850,1049.5z M920,1854.5c0,19.3-15.7,35-35,35c-19.3,0-35-15.7-35-35v-70h70V1854.5z M955,1749.5H815c-19.3,0-35-15.7-35-35v-245c0-19.3,15.7-35,35-35h140c19.3,0,35,15.7,35,35v245C990,1733.8,974.3,1749.5,955,1749.5z"/>
                </g>
            </symbol>
            <symbol id="icon-info" viewBox="0 0 1000 1000">
                <g>
                    <path d="M500,10C229.4,10,10,229.4,10,500s219.4,490,490,490s490-219.4,490-490S770.6,10,500,10z M576.9,680.3c-37,55.5-74.6,98.3-137.9,98.3c-43.2-7-60.9-38-51.6-69.5l81.4-269.7c2-6.6-1.3-13.6-7.4-15.8c-6-2.1-17.8,5.7-27.9,16.8l-49.2,59.2c-1.3-10-0.2-26.4-0.2-33c37-55.5,97.7-99.3,138.9-99.3c39.2,4,57.7,35.3,50.9,69.7l-82,271c-1.1,6.1,2.1,12.3,7.7,14.3c6,2.1,18.7-5.7,28.9-16.8l49.2-59.2C579.1,656.2,576.9,673.6,576.9,680.3z M565.9,328.1c-31.1,0-56.4-22.7-56.4-56.1c0-33.4,25.3-56,56.4-56c31.1,0,56.4,22.7,56.4,56C622.3,305.4,597,328.1,565.9,328.1z"/>
                </g>
            </symbol>
        </defs>
    </svg>
</div>