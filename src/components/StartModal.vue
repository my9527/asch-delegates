<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
        <q-card-section>
        <div class="text-h6">发起交易</div>
      </q-card-section>
      <q-card-section>
          <div>
              <q-form
                ref="StartForm"
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-md"
              >
                  <q-input
                    lazy-rules
                    :rules="[ validatorRequired ]"
                    v-model="address" label="收款人地址"></q-input>
                    <q-input
                    :rules="[ validatorRequired, validatorAmount ]"
                    v-model="amount" label="金额(XAS)"></q-input>
                    <q-input
                    lazy-rules
                    v-model="remarks" label="备注"></q-input>
              </q-form>
          </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" label="Cancel" @click="onCancelClick" />          
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
          address: null,
          amount: null,
          type: null,
          remarks: null,
      }
  },

  methods: {

      onSubmit() {

      },

      onReset() {

      },

      validatorRequired(val) {
          if(!val){
              return '不能为空'
          }
          return true
      },

      validatorAmount(val) {
          if(!/^(\+|\-)?[0-9]+(\.?[0-9]{0,8})?$/.test(val)){
              return '请输入正确的数字,最大支持8位小数'
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
      
      this.$emit('hide')
    },

    onOKClick () {
      
      const {
          address,
          amount,
          remarks,
      } = this
      this.$refs.StartForm.validate().then(isSucess => {
          if(isSucess) {
            this.$emit('ok', {
              address,
              amount,
              remarks,
            })
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