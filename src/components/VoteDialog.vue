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
          <span>{{$t('VOTE_DIALOG_TIP_1')}}:</span>
          <span class="keyword">{{voteTarget}}</span>
        </div>
        <div>
          <span>{{$t('VOTE_DIALOG_TIP_2')}}</span>
          <span class="keyword">{{power}}</span>
          <span>{{$t('VOTE_DIALOG_TIP_3')}}.</span>
        </div>
        <div>
          <span>{{$t('VOTE_DIALOG_TIP_4')}}</span>
          <span class="keyword">0.1</span>
          <span>{{$t('VOTE_DIALOG_TIP_5')}}.</span>
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
