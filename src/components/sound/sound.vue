<div class="sound-block" v-cloak v-if="isAudio">
    <div class="sound-label" v-translate>Sound</div>
    <div class="sound-btns">
        <el-button type="danger" @click="toggleSound()">
            <it-svgicon v-if="!beats_on" icon="play" icon-class="icon-btn"></it-svgicon>
            <it-svgicon v-if="beats_on" icon="stop" icon-class="icon-btn"></it-svgicon>
        </el-button>

        <el-radio-group v-model="soundType">
            <el-radio-button :label="1">{{t('Rhythm')}}</el-radio-button>
            <el-radio-button :label="2">{{t('Metronome')}}</el-radio-button>
            <el-radio-button :label="3">{{t('Together')}}</el-radio-button>
        </el-radio-group>
    </div>

    <p>
        <label class="label-radio">
            <el-switch v-model="isPlayAccent" :inactive-color="swOffClr"></el-switch>
            {{ t('Play_accent') }}</label>
        <el-radio-group v-model="accentBit">
            <el-radio-button :label="4">4</el-radio-button>
            <el-radio-button :label="6">6</el-radio-button>
            <el-radio-button :label="8">8</el-radio-button>
        </el-radio-group>
        {{ t('bits') }}
    </p>

    <div class="slider-div">
        <label class="slider-label">
            {{t('Tempo')}}
        </label>
        <div class="slider-bpm">{{ bpm }}</div>
        <div class="slider">
            <el-slider v-model="bpm" :max="300" :min="30">
            </el-slider>
            <div class="slider-start">30</div>
            <div class="slider-end">300</div>
        </div>
        <div class="slider-message">{{t(sliderMessage)}}</div>

    </div>
</div>
