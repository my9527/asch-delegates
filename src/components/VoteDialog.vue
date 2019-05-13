<template>
  <q-dialog v-model="showDialog" @show="onShown()">
    <q-card style="width: 600px;">
      <q-card-section class="row items-center dialog-title">
        <div class="text-h6">{{ title }}</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup/>
      </q-card-section>
      <q-card-section>
        <br>
        <template v-if="voteTarget === votedDelegate">
          <div>
            You have voted this delegate:
            <span>{{voteTarget}}.</span><br>
            <span>You can not vote it again.</span>
          </div>
        </template>
        <template v-else-if="power === 0">
          <div>You have no vote power. You may lock your XAS to obtain some.</div>
        </template>
        <template v-else>
          <div>You will vote the delegate: <span>{{voteTarget}}</span></div>
          <div>The operation will increase {{power}} votes for your voted delegate.</div>
          <div>The operation will cost 0.1 XAS or equivalent NET resources.</div>
        </template>
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
export default {
  name: 'VoteDialog',
  data() {
    return {
      voteTarget: '',
      votedDelegate: '',
      showDialog: false,
      power: 0,
      title: 'Voting'
    }
  },
  computed: {},
  methods: {
    onShown() {
      console.log('VoteDialog onShown')
    },
    show(title, target, votedDelegate, power) {
      this.title = title
      this.voteTarget = target
      this.votedDelegate = votedDelegate
      this.power = power
      this.showDialog = true
    },
    async onSubmit() {
      this.showDialog = false
      if (this.voteTarget !== this.votedDelegate && this.power > 0) {

      }
    },
  },
  mounted() {}
}
</script>
