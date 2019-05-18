<template>
  <q-page class="flex column">
    <q-card style="margin-top: 20px;">
      <img v-if="!!info.banner" width="100%" v-bind:src="info.banner">
      <a v-else href="https://asch.io" target="_blank">
        <img width="100%" src="/statics/banner.jpg">
      </a>
      <q-markup-table separator="vertical">
        <tr>
          <td class="attr-key">{{$t('Name')}}</td>
          <td class="attr-value">{{ info.name }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('DelegateName')}}</td>
          <td class="attr-value">{{ info.delegateName }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Address')}}</td>
          <td class="attr-value">{{ info.address }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Website')}}</td>
          <td class="attr-value">
            <a :href="info.website">{{ info.website }}</a>
          </td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Rank')}}</td>
          <td class="attr-value">{{ info.rank }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Status')}}</td>
          <td class="attr-value">{{ info.status ? 'online' : 'offline'}}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('LastForging')}}</td>
          <td class="attr-value">{{ info.lastForgingTime }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Productivity')}}</td>
          <td class="attr-value">{{ info.productivity }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('ProducedBlocks')}}</td>
          <td class="attr-value">{{ info.producedBlocks }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Votes')}}</td>
          <td class="attr-value">{{ info.votes }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('VotesRatio')}}</td>
          <td class="attr-value">{{ info.votesRatio }}</td>
        </tr>
        <tr>
          <td class="attr-key">{{$t('Profits')}}</td>
          <td class="attr-value">{{ info.profits }}</td>
        </tr>
      </q-markup-table>
      <q-card-section style="text-align: center">
        <span style="font-weight: bold;">{{$t('Introduction')}}</span>
        <br>
        <span style="color: grey;">{{ info.intro }}</span>
        <br>
        <br>
        <!-- <span style="font-weight: bold;">Statement</span>
        <br>
        <span style="color: grey;">{{ info.statement }}</span>
        <br>-->
      </q-card-section>
      <q-card-actions>
        <q-btn color="secondary" label="Vote" style="width: 100%; height: 50px;"/>
      </q-card-actions>
    </q-card>
    <div
      class="text-h6 text-center"
      style="margin-top: 10px; margin-bottom: 10px"
    >{{$t('ForgedBlocks')}}</div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Height</th>
          <th class="text-center">Hash</th>
          <th class="text-center">Timestamp</th>
          <th class="text-center">Transactions</th>
          <th class="text-right">Reward</th>
          <th class="text-right">Fees</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of forgedBlocks" :key="item.height">
          <td class="text-left">{{item.height}}</td>
          <td class="text-center">{{item.id}}</td>
          <td class="text-center">{{getRealTime(item.timestamp)}}</td>
          <td class="text-center">{{item.count}}</td>
          <td class="text-right">{{item.reward}}</td>
          <td class="text-right">{{item.fees}}</td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="page"
        :max="maxPages"
        :max-pages="10"
        :direction-links="true"
        @input="onPageChange"
      ></q-pagination>
    </div>
    <!-- <div class="news-list">
      <q-timeline>
        <q-timeline-entry heading class="text-center">Team Recently News</q-timeline-entry>
        <q-timeline-entry
          v-for="item of teamNews"
          v-bind:key="item.id"
          v-bind:title="item.title"
          v-bind:subtitle="item.timestamp"
        >
          <div>{{ item.brief }}</div>
        </q-timeline-entry>
      </q-timeline>
    </div>-->
  </q-page>
</template>

<style scoped>
.banner {
  margin-top: 10px;
}

.attr-key {
  text-align: right;
  padding-right: 50px;
  color: grey;
  width: 50%;
}

.attr-value {
  font-weight: bold;
  padding-left: 50px;
  width: 50%;
}

/* .news-list {
  max-width: 600px;
} */
</style>

<script>
import { log } from '../utils'

export default {
  name: 'PageDelegateDetail',
  data() {
    return {
      id: '',
      info: {
        rank: 1,
        icon: 'https://www.asch.io/favicon.ico',
        name: 'Asch Core Team',
        delegateName: 'asch_core',
        status: 1,
        lastForgingTime: Date.now(),
        producedBlocks: 12345,
        productivity: '99.9%',
        votes: '23,456,78',
        votesRatio: '9.8%',
        profits: 543543,
        address: 'ABuH9VHV3cFi9UKzcHXGMPGnSC4QqT2cZ5',
        banner: '',
        website: 'https://asch.io',
        intro:
          'The asch core team powered by our mathematically optimal network.'
      },
      forgedBlocks: [],
      page: 1,
      maxPages: 1,
      pageSize: 25
    }
  },
  methods: {
    onPageChange(page) {
      this.getForgedBlocks(page)
    },
    async getForgedBlocks(page) {
      try {
        const result = await this.$api.getForgedBlocks(this.info.delegateName, (page - 1) * this.pageSize, this.pageSize)
        this.maxPages = Math.ceil(result.count / this.pageSize)
        this.forgedBlocks = result.blocks
      } catch (e) {
        console.error('failed to get forged blocks', e)
      }
    },
    async getTeamProfile(){
      if (!this.$asch.ready) {
        await this.$asch.readyAsync()
      }
      try {
        const result = await this.$asch.contract.getProfile(this.info.delegateName)
        log('getProfile', result)
        const { name, banner, website, icon, intro } = result.data
        this.info.name = name
        this.info.banner = banner
        this.info.icon = icon
        this.info.website = website
        this.info.intro = intro
      } catch (e) {
        console.error('failed to get team profile from contrat', e)
      }
    },
    async getDelegateDetail() {
      try {
        const result = await this.$api.getDelegateDetail(this.id)
        log('get delegate detail', result)
        const d = result.delegate
        const lastBlockTime = d.lastForgingBlock
          ? d.lastForgingBlock.timestamp
          : 0
        this.info = {
          rank: d.rate,
          icon: d.profile ? d.profile.icon : '',
          delegateName: d.name,
          name: d.profile ? d.profile.nodeName : '--',
          status: d.online,
          lastForgingTime: this.$asch.getRealTime(lastBlockTime),
          producedBlocks: d.producedBlocks,
          productivity: d.productivity + '%',
          votes: this.$asch.fromSatoshi(d.votes),
          votesRatio: d.approval.toPrecision(2) + '%',
          profits: this.$asch.fromSatoshi(d.rewards + d.fees),
          address: d.address,
          website: d.profile ? d.profile.website : '--',
          banner: d.profile ? d.profile.banner : '',
          intro: d.profile ? d.profile.intro : '--'
        }
        this.getTeamProfile()
        this.getForgedBlocks(1)
      } catch (e) {
        console.error('failed to get delegate detail', e)
      }
    },
    getRealTime(epochTime) {
      return this.$asch.getRealTime(epochTime)
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getDelegateDetail()
  }
}
</script>
