<div class="content-div">
    <h1 class="page-heading" v-translate>Description</h1>

    <p v-translate>Description_1</p>

    <p><span class="card white card-sm">0</span> - <span v-translate>Description_2</span></p>

    <p><span class="card blue card-sm">1</span> - <span v-translate>Description_3</span></p>

    <p><span class="card red card-sm">2</span> - <span v-translate>Description_4</span></p>

    <p v-html="t('Description_6')"></p>

    <p v-html="t('Description_5')"></p>

    <p v-html="t('Description_9')"></p>

    <div class="cards-block-sm">
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl left-lbl">rock</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl right-lbl">step</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl left-lbl">triple</div>
        </div>
        <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">step</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl left-lbl">triple</div>
        </div>
        <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">step</div>
        </div>
    </div>
    <br/>

    <p v-html="t('Description_10')"></p>

    <div class="cards-block-sm">
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl left-lbl">rock</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl right-lbl">step</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl left-lbl">triple</div>
        </div>
        <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">step</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
        </div>
        <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl left-lbl">triple</div>
        </div>
        <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">step</div>
        </div>
    </div>

    <h3 v-translate>Description_how_it_works</h3>
    <div v-html="t('Description_hiw_1')"></div>

    <h3 v-translate>Description_settings</h3>
    <div v-html="t('Description_settings_1')"></div>
    <vue-headful :title="t('Description') + ' | ' + t('TITLE')" :lang="$route.params.lang" :description="t('Description_meta_description')"/>
</div>