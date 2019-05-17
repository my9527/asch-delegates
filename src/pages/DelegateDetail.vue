<template>
  <q-page class="flex column">
    <q-card style="margin-top: 20px;">
      <img v-if="!!info.banner" width="100%" v-bind:src="info.banner">
      <a v-else href="https://asch.io" target="_blank">
        <img width="100%" src="/statics/banner.jpg">
      </a>
      <q-markup-table separator="vertical">
        <tr>
          <td class="attr-key">Name</td>
          <td class="attr-value">{{ info.name }}</td>
        </tr>
        <tr>
          <td class="attr-key">Delegate Name</td>
          <td class="attr-value">{{ info.delegateName }}</td>
        </tr>
        <tr>
          <td class="attr-key">Address</td>
          <td class="attr-value">{{ info.address }}</td>
        </tr>
        <tr>
          <td class="attr-key">Website</td>
          <td class="attr-value">
            <a :href="info.website">{{ info.website }}</a>
          </td>
        </tr>
        <tr>
          <td class="attr-key">Rank</td>
          <td class="attr-value">{{ info.rank }}</td>
        </tr>
        <tr>
          <td class="attr-key">Status</td>
          <td class="attr-value">{{ info.status ? 'online' : 'offline'}}</td>
        </tr>
        <tr>
          <td class="attr-key">Last forging time</td>
          <td class="attr-value">{{ info.lastForgingTime }}</td>
        </tr>
        <tr>
          <td class="attr-key">Productivity</td>
          <td class="attr-value">{{ info.productivity }}</td>
        </tr>
        <tr>
          <td class="attr-key">Produced Blocks</td>
          <td class="attr-value">{{ info.producedBlocks }}</td>
        </tr>
        <tr>
          <td class="attr-key">Votes</td>
          <td class="attr-value">{{ info.votes }}</td>
        </tr>
        <tr>
          <td class="attr-key">Votes Ratio</td>
          <td class="attr-value">{{ info.votesRatio }}</td>
        </tr>
        <tr>
          <td class="attr-key">Profits</td>
          <td class="attr-value">{{ info.profits }}</td>
        </tr>
      </q-markup-table>
      <q-card-section style="text-align: center">
        <span style="font-weight: bold;">Introdution</span>
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
    <div class="news-list">
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
    </div>
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
      teamNews: [
        {
          id: '1',
          timestamp: new Date().toDateString(),
          title: 'IOST Developer Bounty Program Update: 18th Week',
          brief:
            'This is the 18th week of IOST developer bounty program update. We are excited to see more and more developers build Dapps on IOST and going live with their applications.'
        },
        {
          id: '2',
          timestamp: new Date().toDateString(),
          title: 'IOST Developer Bounty Program Update: 18th Week',
          brief:
            'This is the 18th week of IOST developer bounty program update. We are excited to see more and more developers build Dapps on IOST and going live with their applications.'
        },
        {
          id: '3',
          timestamp: new Date().toDateString(),
          title: 'IOST Developer Bounty Program Update: 18th Week',
          brief:
            'This is the 18th week of IOST developer bounty program update. We are excited to see more and more developers build Dapps on IOST and going live with their applications.'
        }
      ]
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.$api
      .getDelegateDetail(this.id)
      .then(result => {
        console.log('get delegate detail', result)
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
          banner: d.profile.banner,
          intro: d.profile ? d.profile.intro : '--'
        }
      })
      .catch(error => {
        console.error('failed to get delegate detail', error)
      })
  }
}
</script>
