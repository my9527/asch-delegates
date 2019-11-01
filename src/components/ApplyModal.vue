<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
        <q-card-section>
        <div class="text-h6">申请成为候选人</div>
      </q-card-section>
      <q-card-section>
          <div>
              <q-form
                ref="ApplyForm"
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-md"
              >
                  <q-input
                    lazy-rules
                    :rules="[ validator ]"
                    v-model="website" label="请输入您的主页网址"></q-input>
              </q-form>
          </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn ghost color="primary" label="Cancel" @click="onCancelClick" />
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    // ...your custom props
  },
  data() {
      return {
          website: null,
      }
  },

  methods: {

      onSubmit() {

      },

      onReset() {

      },

      validator(val) {
          if(!/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test(val)){
              return '请输入正确的网址'
          }
          return true
      },

    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$refs.ApplyForm.validate().then(isSucess => {
          if(isSucess) {
            this.$emit('ok', this.website)
            this.hide()
          }
      })
      
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    }
  }
}
</script>