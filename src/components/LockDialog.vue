<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 800px; min-height: 120px">
      <q-card-section class="row items-center dialog-title">
        <div class="text-h6">Lock Balance</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup/>
      </q-card-section>
      <q-card-section class="justify-center">
        <br>
        <q-input
          ref="amountInput"
          filled
          type="number"
          v-model="lockAmount"
          hint="Lock amount"
          :rules="[
            val => !!val || 'Required',
            val => Number.isInteger(Number(val)) || 'Must be integer',
            val => val <= maxLockAmount || 'Must be less than the unlocked balance: ' + maxLockAmount
          ]"
        />
        <br>
        <q-input
          ref="dateInput"
          filled
          v-model="lockDate"
          hint="Lock date"
          @focus="showDatePicker"
          error-message="Invalid date"
          :error="!validDate"
        >
          <template v-slot:append>
            <q-icon name="event">
              <q-popup-proxy ref="datePicker">
                <q-date minimal v-model="lockDate" @input="hideDatePicker" :options="validateDate"/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <br>
        <div>
          <p>If you want to vote lately, please don't lock all of your balance</p>
          <p>最低锁仓高度为上次锁仓高度或当前区块高度顺延259200，大约为1个月</p>
          <p>最高锁仓高度为上次锁仓高度或当前高度顺延31104000，大约为10年</p>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="secondary" @click="onSubmit">OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="stylus" scoped>
.dialog-title {
  background: $secondary;
}
</style>

<script>
import { date } from 'quasar'
import constants from '../utils/constants'

export default {
  name: 'VoteDialog',
  data() {
    return {
      showDialog: false,
      lockAmount: 0,
      lockDate: '',
      maxLockAmount: 0,
      lastLockHeight: 0,
      currentHeight: 0
    }
  },
  computed: {
    validDate() {
      return this.validateDate(this.lockDate)
    }
  },
  methods: {
    show(maxLockAmount, currentHeight, lastLockHeight) {
      this.maxLockAmount = maxLockAmount
      this.currentHeight = currentHeight
      this.lastLockHeight = lastLockHeight
      this.lockDate = date.formatDate(
        this.getMinLockTime() + 86400000,
        'YYYY/MM/DD'
      )
      this.showDialog = true
    },
    async onSubmit() {
      if (
        !this.$refs.amountInput.validate() ||
        !this.$refs.dateInput.validate()
      ) {
        return
      }

      console.log('lock params', this.lockDate, this.lockAmount)
      const realAmount = this.$asch.toSatoshi(Number(this.lockAmount))
      const lockPeriod = new Date(this.lockDate) - Date.now()
      const lockHeight =
        this.currentHeight +
        Math.floor(lockPeriod / constants.BLOCK_INTERVAL_MS)
      console.log('lock transaction args', realAmount, lockHeight)
      try {
        await this.$asch.lock(lockHeight, realAmount)
        this.showDialog = false
      } catch (e) {
        console.error('failed to lock', e)
      }
    },
    validateDate(date) {
      const d = new Date(Date.parse(date))

      return new Date(date).getTime() > this.getMinLockTime()
    },
    hideDatePicker() {
      this.$refs.datePicker.hide()
    },
    showDatePicker() {
      this.$refs.datePicker.show()
    },
    getMinLockTime() {
      const minLockHeight =
        Math.max(this.lastLockHeight, this.currentHeight) +
        constants.MIN_LOCK_INTERVAL
      return (
        Date.now() +
        (minLockHeight - this.currentHeight) * constants.BLOCK_INTERVAL_MS
      )
    }
  },
  mounted() {}
}
</script>
