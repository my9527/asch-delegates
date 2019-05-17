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
        <div>
          <span>You will vote the delegate:</span>
          <span class="keyword">{{voteTarget}}</span>
        </div>
        <div>
          <span>The operation will increase</span>
          <span class="keyword">{{power}}</span>
          <span>votes for your voted delegate.</span>
        </div>
        <div>
          <span>The operation will cost you</span>
          <span class="keyword">0.1</span>
          <span>XAS or equivalent NET resources.</span>
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

.keyword {
  font-weight: bold;
  margin: 0 5px 0 5px;
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
      try {
        await this.$asch.vote(this.voteTarget)
      } catch(e) {
        console.error('failed to submit vote transaction', e)
      }
    }
  },
  mounted() {}
}
</script>
