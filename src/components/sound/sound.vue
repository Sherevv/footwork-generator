<div class="col-xs-12 well" v-cloak v-if="isAudio">
    <div class="sound-label" v-translate>Sound</div>
    <div class="sound-btns">
        <el-radio-group v-model="soundType">
            <el-radio-button :label="1">{{t('Rhythm')}}</el-radio-button>
            <el-radio-button :label="2">{{t('Metronome')}}</el-radio-button>
            <el-radio-button :label="3">{{t('Together')}}</el-radio-button>
        </el-radio-group>
    </div>
    <div class="settings_play-btn">
        <el-button type="danger" @click="toggleSound()">
            <it-svgicon v-if="!beats_on" icon="play" icon-class="icon-btn"></it-svgicon>
            <it-svgicon v-if="beats_on" icon="stop" icon-class="icon-btn"></it-svgicon>
        </el-button>
    </div>

    <div class="slider-div">
        <label class="slider-label">
            {{t('Tempo')}}
            <div class="slider">
                {{ bpm }}
                <el-slider v-model="bpm" :max="300" :min="30">
                </el-slider>
            </div>
        </label>
    </div>
</div>
