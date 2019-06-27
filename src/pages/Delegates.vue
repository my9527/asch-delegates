<template>
  <q-page class="flex column">
    <div class="row q-gutter-md items-center justify-center" style="margin-top: 10px;">
      <div class="text-weight-light">{{$t('Balance')}}:</div>
      <div>{{ unlockedBalance }}</div>
      <q-btn
        :label="$t('BTN_LOCK')"
        color="secondary"
        :disable="unlockedBalance === 0"
        @click="onLockClicked"
      />

      <q-separator vertical/>

      <div class="text-weight-light">{{$t('VotePower')}}:</div>
      <div>{{ votePower }}</div>
      <q-btn :label="$t('BTN_UNLOCK')" color="secondary" :disable="!canUnlock" @click="onUnlockClicked"/>
      <!-- <template v-if="isUnlockTimePassed">

      </template>
      <template v-else>
        <div class="text-weight-light">Unlock Time:</div>
        <div>{{ calcUnlockTime }}</div>
      </template>-->

      <q-separator vertical/>

      <template v-if="votedDelegate !== ''">
        <div class="text-weight-light">{{$t('Voted')}}:</div>
        <div>{{ votedDelegate }}</div>
      </template>
      <template v-else>
        <div class="text-weight-light">{{$t('Unvoted')}}</div>
      </template>
      <q-btn
        :label="$t('BTN_UNVOTE')"
        color="secondary"
        :disable="votedDelegate === ''"
        @click="unOnvoteClicked"
      />
    </div>
    <div class="banner">
      <a href="https://asch.io" target="_blank">
        <img src="/statics/banner.jpg" width="100%" height="100%">
      </a>
    </div>
    <div class="dashboard dark-bg">
      <table>
        <tbody>
          <tr>
            <td>
              <span style="color: grey">{{$t('SuperNodes')}}</span>
              <br>
              <br>
              <span>{{totalSuperNodes}}</span>
            </td>
            <td>
              <span style="color: grey">{{$t('TotalDelegates')}}</span>
              <br>
              <br>
              <span>{{totalDelegates}}</span>
            </td>
            <td>
              <span style="color: grey">{{$t('VotedCoins')}}</span>
              <br>
              <br>
              <span>{{totalVotes}}</span>
            </td>
            <td>
              <span style="color: grey">{{$t('VotedAccounts')}}</span>
              <br>
              <br>
              <span>{{votedAccounts}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <q-markup-table class="delegates-table" separator="none">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">{{$t('Name')}}</th>
          <th class="text-center">{{$t('Status')}}</th>
          <th class="text-right">{{$t('LastForging')}}</th>
          <th class="text-right">{{$t('Productivity')}}/{{$t('BlocksNumber')}}</th>
          <th class="text-right">{{$t('Votes')}}/{{$t('Ratio')}}</th>
          <th class="text-right">{{$t('Profits')}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of superNodes" :key="item.delegateName">
          <td class="text-left">
            <span :class="item.rank <= 21 ? 'super-node-rank' : ''">{{ item.rank }}</span>
            <span v-if="item.rank <= 21" class="super-node">SN</span>
          </td>
          <td class="text-left">
            <a :href="item.detailURL" class="delegate-name-cell row">
              <img v-if="item.icon" width="32" height="32" :src="item.icon" onerror="this.src='/statics/error.png'">
              <Jdenticon v-else :address="item.address" size="32"/>
              <div style="margin-left: 12px;">
                <span style="color: #3790ff; font-weight: bold;">{{ item.name }}</span>
                <br>
                <span style="color: grey">{{ item.delegateName }}</span>
              </div>
            </a>
          </td>
          <td class="text-center">
            <div :class="item.status ? 'online' : 'offline'"></div>
          </td>
          <td class="text-right">{{ item.lastForgingTime }}</td>
          <td class="text-right">{{ item.productivity }} / {{ item.producedBlocks }}</td>
          <td class="text-right">{{ item.votes }} / {{ item.votesRatio }}</td>
          <td class="text-right">
            {{ item.profits }}
            <span style="color: grey; font-weight: bold">XAS</span>
          </td>
          <td class="text-center">
            <q-btn color="secondary" @click="onVoteClicked(item)">{{$t('BTN_VOTE')}}</q-btn>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="page" :max="maxPages" :max-pages="10" :direction-links="true" @input="onPageChange"></q-pagination>
    </div>

    <VoteDialog ref="voteDialog"/>
    <LockDialog ref="lockDialog"/>
  </q-page>
</template>

<style lang="stylus" scoped>
.banner {
  height: 300px;
  margin-top: 10px;
}

.dashboard {
  height: 150px;
  border-radius: 10px;
  margin-top: 10px;
}

.dashboard table {
  width: 100%;
  height: 100%;
}

.dashboard td {
  color: white;
  text-align: center;
}

.delegates-table {
  margin-top: 20px;
}

.delegate-name-cell {
  text-decoration: none;
}

.online {
  background: green;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  margin: auto;
}

.offline {
  background: grey;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  margin: auto;
}

.super-node-rank {
  color: $purple;
  font-weight: bold;
}

.super-node {
  color: $purple;
  font-weight: bold;
  margin-left: 5px;
}
</style>

<script>
import { log } from '../utils'

export default {
  name: 'PageDelegates',
  components: {
    Jdenticon: () => import('../components/Jdenticon'),
    VoteDialog: () => import('../components/VoteDialog'),
    LockDialog: () => import('../components/LockDialog')
  },
  data() {
    return {
      timer: null,
      currentHeight: 0,
      votedDelegate: '',
      votingDelegate: '',
      votePower: 0,
      unlockHeight: 0,
      unlockedBalance: 0,

      page: 1,
      maxPages: 1,
      pageSize: 25,
      superNodes: [
        {
          rank: 1,
          // icon: 'https://www.asch.io/favicon.ico',
          icon: '',
          name: 'Asch Core Team',
          delegateName: 'asch_core',
          status: 1,
          lastForgingTime: Date.now(),
          producedBlocks: 12345,
          productivity: '99.9%',
          votes: '23,456,78',
          votesRatio: '9.8%',
          profits: 543543,
          detailURL: '/delegate/asch_core',
          address: 'ABuH9VHV3cFi9UKzcHXGMPGnSC4QqT2cZ5'
        }
      ],

      // voting summary
      totalSuperNodes: 0,
      totalDelegates: 0,
      totalVotes: 0,
      votedAccounts: 0
    }
  },
  methods: {
    onPageChange(page) {
      this.getDelegates(page)
    },
    async getDelegates(page) {
      try {
        log('getDelegates page', page)
        const result = await this.$api.getDelegatesWithProfile(
          (page - 1) * this.pageSize,
          this.pageSize
        )
        log('getDelegates result', result)
        this.maxPages = Math.ceil(result.totalCount / this.pageSize)
        this.superNodes = result.delegates.map(d => {
          const lastBlockTime = d.lastForgingBlock
            ? d.lastForgingBlock.timestamp
            : 0
          return {
            rank: d.rate,
            icon: d.profile ? d.profile.icon : '',
            delegateName: d.name,
            name: d.profile ? d.profile.name : '--',
            status: d.online,
            lastForgingTime: this.$asch.getRealTime(lastBlockTime),
            producedBlocks: d.producedBlocks,
            productivity: d.productivity + '%',
            votes: this.$asch.fromSatoshi(d.votes),
            votesRatio: d.approval.toPrecision(2) + '%',
            profits: this.$asch.fromSatoshi(d.rewards + d.fees),
            address: d.address,
            detailURL: `/delegate/${d.name}`
          }
        })
      } catch (e) {
        console.error('failed to get delegates', e)
      }
    },
    onVoteClicked(item) {
      log('onVoteClicked...')
      if (this.votePower === 0) {
        alert('You have no vote power. You may lock your XAS to obtain some.')
        return
      }
      if (this.votedDelegate === item.delegateName || this.votingDelegate === item.delegateName) {
        alert('You have voted this delegate')
        return
      }
      this.votingDelegate = item.delegateName
      this.$refs.voteDialog.show(
        'Voting',
        item.delegateName,
        this.votedDelegate,
        this.votePower
      )
    },
    onLockClicked() {
      this.$refs.lockDialog.show(
        this.unlockedBalance,
        this.$asch.latestBlock.height,
        this.$asch.cachedAccountInfo.lockHeight
      )
    },
    async onUnlockClicked() {
      if (this.unlockHeight > this.currentHeight) {
        alert(
          `You can not unlock your XAS before block height: ${
            this.unlockHeight
          }`
        )
        return
      }
      try {
        await this.$asch.unlock()
      } catch (e) {
        console.error('failed to unlock', e)
      }
    },
    async unOnvoteClicked() {
      try {
        await this.$asch.unvote(this.votedDelegate)
      } catch (e) {
        console.error('failed to unvote', e)
      }
    },
    async getAccountAndVotingInfo() {
      if (!this.$asch.ready) {
        await this.$asch.readyAsync()
      }
      const address = this.$asch.defaultAccount.address
      const results = await Promise.all([
        this.$api.getAccount(address),
        this.$api.getVotedDelegate(address)
      ])
      log('getAccountAndVotingInfo', results)
      const { account, latestBlock } = results[0]
      const delegate = results[1].delegates[0]
      if (account) {
        this.$asch.cachedAccountInfo = account
        this.votePower = this.$asch.fromSatoshi(account.weight)
        this.unlockHeight = account.lockHeight
        this.unlockedBalance = Math.floor(this.$asch.fromSatoshi(account.xas))
      }
      if (latestBlock) {
        this.$asch.latestBlock = latestBlock
        this.currentHeight = latestBlock.height
      }
      if (delegate) {
        this.votedDelegate = delegate.name
        this.votingDelegate = ''
      }
    },
    async getVotingSummary() {
      try {
        const result = await this.$api.getVotingSummary()
        this.totalSuperNodes = result.votingSummary.totalSuperNodes
        this.totalDelegates = result.votingSummary.totalDelegates
        this.totalVotes = this.$asch
          .fromSatoshi(result.votingSummary.totalVotes)
          .toFixed(0)
        this.votedAccounts = result.votingSummary.votedAccounts
      } catch (e) {
        console.error('failed to get voting summary', e)
      }
    },
    refresh() {
      this.getAccountAndVotingInfo()
      this.getDelegates(this.page)
      this.getVotingSummary()
    }
  },
  computed: {
    calcUnlockTime() {
      return '2019-06-10 12:00:00'
    },
    isUnlockTimePassed() {
      return true
    },
    canUnlock() {
      return this.votePower > 0
    }
  },
  mounted() {
    log('===============Delegates page mounted==============')
    this.refresh()
    this.timer = setInterval(() => this.refresh(), 10000)
    this.$asch.on('accountChanged', (newAccount, oldAccount) => {
      log('accountChanged:', newAccount.address, oldAccount.address)
      this.getAccountAndVotingInfo()
    })
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>
