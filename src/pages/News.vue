<template>
  <q-page class="flex">
    <div class="news-list">
      <q-timeline>
        <q-timeline-entry heading class="text-center">Recently News</q-timeline-entry>
        <q-timeline-entry
          v-for="item of allNews"
          v-bind:key="item.id"
          v-bind:title="item.title"
          v-bind:subtitle="item.timestamp"
          v-bind:icon="'img:' + item.iconURL"
        >
          <div>
            <a
              v-bind:href="item.articleURL"
              style="text-decoration: none; color: black;"
            >{{ item.brief }}</a>
          </div>
          <div style="margin-top: 10px; text-align: center;">
            <q-btn
              v-bind:to="'/delegate/' + item.delegate"
              color="secondary"
              no-caps
              flat
            >Voting {{ item.author }}</q-btn>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </q-page>
</template>

<style scoped>
.news-list {
  width: 800px;
}
</style>

<script>
export default {
  name: 'PageNews',
  data() {
    return {
      allNews: [
        {
          id: '1',
          author: 'DRoute.Capital',
          delegate: 'droute',
          timestamp: new Date().toDateString(),
          title: 'IOST Developer Bounty Program Update: 18th Week',
          iconURL:
            'https://imgc.iotex.io/dokc3pa1x/image/upload/v1551069040/delegates/DRoute%20Capital/DRoute_Capital.png',
          articleURL: 'https://asch.io',
          brief:
            'This is the 18th week of IOST developer bounty program update. We are excited to see more and more developers build Dapps on IOST and going live with their applications.'
        },
        {
          id: '2',
          author: 'IOST Team',
          delegate: 'iost',
          timestamp: new Date().toDateString(),
          title: 'IOST Developer Bounty Program Update: 18th Week',
          iconURL: 'https://iost.biss.com/resource/medium-avatar.04a79958.png',
          articleURL: 'https://asch.io',
          brief:
            'This is the 18th week of IOST developer bounty program update. We are excited to see more and more developers build Dapps on IOST and going live with their applications.'
        },
        {
          id: '3',
          timestamp: new Date().toDateString(),
          author: 'Cobo Wallet',
          delegate: 'cobo',
          title: 'IOST Developer Bounty Program Update: 18th Week',
          articleURL: 'https://asch.io',
          iconURL:
            'https://imgc.iotex.io/dokc3pa1x/image/upload/w_32/v1551065416/delegates/Cobo%20Wallet/a2b347ab4f9243a616cbd7648a66126fd5e3d3b9.png',
          brief:
            'This is the 18th week of IOST developer bounty program update. We are excited to see more and more developers build Dapps on IOST and going live with their applications.'
        }
      ]
    }
  }
}
</script>
