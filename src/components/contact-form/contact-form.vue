<template>
  <div id="contentForm" collapse="isCollapsed" v-cloak>
    <div id="form" class="content text">
      <form
        id="ContactForm"
        name="ContactForm"
        @submit.prevent="onSubmit"
        @keydown="formErrors.clear($event.target.name)"
        @change="onFormChange"
      >
        <fieldset>
          <div class="form-group">
            <el-input
              type="text"
              class="form-control"
              name="name"
              id="name"
              value=""
              :placeholder="t('Name')"
              v-model="contact.name"
            >
              <template #prepend>
                <it-svgicon icon="person" class="icon-form"></it-svgicon>
              </template>
            </el-input>
          </div>
          <div class="form-group">
            <el-input
              type="email"
              name="email"
              id="email"
              value=""
              placeholder="E-mail"
              v-model="contact.email"
            >
              <template #prepend>
                <it-svgicon icon="at" class="icon-form"></it-svgicon>
              </template>
            </el-input>
            <div v-if="formErrors.has('email')" class="error" v-translate>
              ContactForm_2
            </div>
          </div>
          <div class="form-group">
            <div
              class="
                input-group
                el-input el-input-group el-input-group--prepend
              "
            >
              <div class="el-input-group__prepend">
                <span class="ast">*</span><br />
                <it-svgicon icon="message" class="icon-form"></it-svgicon>
              </div>
              <el-input
                type="textarea"
                name="message"
                id="message"
                :rows="5"
                :placeholder="t('Message')"
                v-model="contact.message"
                required
              >
              </el-input>
            </div>
            <div v-if="formErrors.has('message')" class="error" v-translate>
              ContactForm_3
            </div>
          </div>
          <p v-html="t('ContactForm_1')"></p>

          <div class="error" v-show="is_form_errors || is_fail" v-translate>
            ContactForm_4
          </div>

          <div class="success" v-if="is_success" v-translate>ContactForm_5</div>

          <div class="form-loading" v-show="is_busy">
            <img class="spinner" src="/assets/images/loaderBig.gif" />
            Отправка данных / Sending data ..
          </div>

          <el-button
            type="primary"
            id="submitbtn"
            name="save"
            class="btn"
            @click="onSubmit()"
            :loading="is_busy"
            :disabled="formErrors.any() || is_busy"
          >
            {{ t('Send') }}
          </el-button>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script src="./contact-form.ts"></script>
<style src="./contact-form.scss" lang="scss"></style>
