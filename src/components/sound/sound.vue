<div class="col-xs-12 well" v-cloak>
    <div class="sound-label" v-translate>Sound</div>
    <div class="sound-btns">
        <el-button type="danger" @click="toggleSound()">
            <it-svgicon v-if="!beats_on" icon="play" icon-class="icon-btn"></it-svgicon>
            <it-svgicon v-if="beats_on" icon="stop" icon-class="icon-btn"></it-svgicon>
        </el-button>

        <el-radio-group v-model="isRhythmer">
            <el-radio-button :label="true">{{t('Rhythm')}}</el-radio-button>
            <el-radio-button :label="false">{{t('Metronome')}}</el-radio-button>
        </el-radio-group>
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
