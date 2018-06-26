
<div class="content-div">
  <h1 class="page-heading" v-translate>Exercises</h1>
  <p v-translate>Exercises_desc</p>
  <el-button @click="unCollapseAccordion()" v-translate>Expand_all</el-button>
  <el-button @click="collapseAccordion()" v-translate>Collapse_all</el-button>
  <div class="accordion-block">
    <el-collapse v-model="activeItems">
      <el-collapse-item name="1">
        <template slot="title">
          #1 - <span v-translate>Exercise_1</span>
        </template>
        <p><span v-translate>Exercise_1_1</span>
          <span class="card blue card-sm">1</span>
          <span class="card red  card-sm">2</span>,
          <span v-translate>Exercise_1_2</span>
          <span class="card red  card-sm">2</span>
          <span class="card blue card-sm">1</span>
        </p>

        <p v-translate>Exercise_1_3</p>

        <div class="cards-block-sm">
          <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl">rock</div>
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
            <div class="card-lbl left-lbl">triple</div>
          </div>
          <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">step</div>
          </div>
        </div>

        <p v-translate>Exercise_1_4</p>

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
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
          </div>
          <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
          </div>
        </div>

        <p v-translate>Exercise_1_5</p>

        <div class="cards-block-sm">
          <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
            <div class="card-lbl">rock</div>
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
          <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
          </div>
        </div>
        <p v-translate>Exercise_1_6</p>

      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          #2 - <span v-translate>Exercise_2</span>
        </template>
        <p v-translate>Exercise_2_1</p>

        <p v-translate>Exercise_2_2</p>

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
            <span class="card white">0</span>

            <div class="card-lbl">hold</div>
            <div class="card-lbl left-lbl">kick</div>
          </div>
          <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">bllch</div>
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
            <span class="card white">0</span>

            <div class="card-lbl">hold</div>
            <div class="card-lbl left-lbl">kick</div>
          </div>
          <div class="card-block">
            <span class="card red">2</span>

            <div class="card-lbl">bllch</div>
            <div class="card-lbl right-lbl">bllch</div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          #3 - <span v-translate>Exercise_3</span>
        </template>
        <p v-translate>Exercise_3_1</p>
        <p v-translate>Exercise_3_2</p>
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
          </div>
        </div>
        <p v-translate>Exercise_3_3</p>
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
          </div>
          <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
          </div>
          <div class="card-block">
            <span class="card blue">1</span>

            <div class="card-lbl">step</div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          #4 - <span v-translate>Exercise_4</span>
        </template>
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
            <span class="card red">2</span>
            <div class="card-lbl">bllch</div>
          </div>
          <div class="card-block">
            <span class="card red">2</span>
            <div class="card-lbl">bllch</div>
          </div>
          <div class="card-block">
            <span class="card red">2</span>
            <div class="card-lbl">bllch</div>
          </div>
          <div class="card-block">
            <span class="card red">2</span>
            <div class="card-lbl">bllch</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</div>
