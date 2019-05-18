<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <div class="text-h4 text-center">FAQ</div>

      <br>
      <p class="question">1. {{$t('FAQ_1_1')}}?</p>
      <hr>{{$t('FAQ_1_2')}}
      <span class="red-bold">100 XAS</span>
      {{$t('FAQ_1_3')}}.
      <br>{{$t('FAQ_1_4')}}.
      <br>{{$t('FAQ_1_5')}}
      <span class="red-bold">21</span>
      {{$t('FAQ_1_6')}}.
      <br>{{$t('FAQ_1_7')}}.
      <br>{{$t('FAQ_1_8')}}.
      <br>

      <br>
      <p class="question">2. {{$t('FAQ_2_1')}}?</p>
      <hr>{{$t('FAQ_2_2')}} <a href="https://mainnet.asch.io">{{$t('FAQ_2_3')}}</a> or <a href="https://github.com/AschPlatform/asch-cli">{{$t('FAQ_2_4')}}</a>.
      <br>{{$t('FAQ_2_5')}} <a href="https://mainnet.asch.io">{{$t('FAQ_2_6')}}</a> or <a href="https://github.com/AschPlatform/asch-cli">{{$t('FAQ_2_7')}}</a>.
      <br>{{$t('FAQ_2_8')}}
      <a href="https://github.com/AschPlatform/asch-docs/blob/develop/install/en.md">{{$t('FAQ_2_9')}}</a>.
      <br>{{$t('FAQ_2_10')}}.
      <br>{{$t('FAQ_2_11')}}.
      <br>{{$t('FAQ_2_12')}}
      <a href="/register">{{$t('FAQ_2_13')}}</a>，{{$t('FAQ_2_14')}}.
      <br>

      <br>
      <p class="question">3. {{$t('FAQ_3_1')}}?</p>
      <hr>{{$t('FAQ_3_2')}}.
      <br>{{$t('FAQ_3_3')}}.
      <br>{{$t('FAQ_3_4')}}
      <a
        href="https://github.com/AschPlatform/asch-docs"
      >{{$t('FAQ_3_5')}}</a>.
      <br>{{$t('FAQ_3_6')}}.
      <br>

      <br>
      <p class="question">4. {{$t('FAQ_4_1')}}?</p>
      <hr>{{$t('FAQ_4_2')}}:
      <br>{{$t('FAQ_4_3')}}.
      <br>{{$t('FAQ_4_4')}}.
      <br>{{$t('FAQ_4_5')}}:
      <br>
      <q-markup-table style="width: 400px;">
        <thead>
          <tr>
            <th class="text-left">Reward(XAS)</th>
            <th class="text-left">Start Height</th>
            <th class="text-left">End Height</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of rewardMilstones" v-bind:key="item.m">
            <td>{{item.reward}}</td>
            <td class="text-left">{{rewardStartHeight + item.m * 3000000}}</td>
            <td
              class="text-left"
            >{{ item.m === 4 ? '∞' : rewardStartHeight + (item.m + 1) * 3000000 }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <br>{{$t('FAQ_4_6')}}:
      <ul>
        <li>{{$t('FAQ_4_7')}}. </li>
        <li>{{$t('FAQ_4_8')}}.</li>
        <li>{{$t('FAQ_4_9')}}. </li>
      </ul>{{$t('FAQ_4_10')}}.
      <br>{{$t('FAQ_4_11')}}.
      <br>{{$t('FAQ_4_12')}}.
      <br>{{$t('FAQ_4_13')}}.
      <br>

      <br>
      <p class="question">5. {{$t('FAQ_5_1')}}?</p>
      <hr>{{$t('FAQ_5_2')}}
      <span class="red-bold">1:1</span>{{$t('FAQ_5_3')}}.
      <br>{{$t('FAQ_5_4')}}.
      <br>{{$t('FAQ_5_5')}}
      <span class="red-bold">0.1 XAS</span>{{$t('FAQ_5_6')}}.
      <br>{{$t('FAQ_5_7')}}.
      <br>

      <!-- <q-list bordered>
        <div v-for="item of qas" v-bind:key="item.q">
          <q-expansion-item v-bind:label="item.q" header-class="text-primary">
            <q-card>
              <q-card-section>{{ item.a }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator/>
        </div>
      </q-list>-->
    </div>
  </q-page>
</template>

<style scoped>
.question {
  font-size: 20px;
  font-weight: bold;
}

.red-bold {
  color: red;
  font-weight: bold;
}
</style>

<script>
export default {
  name: 'PageHelp',
  data() {
    return {
      rewardStartHeight: 464500,
      rewardMilstones: [
        { m: 0, reward: 3.5 },
        { m: 1, reward: 3 },
        { m: 2, reward: 2 },
        { m: 3, reward: 1 },
        { m: 4, reward: 0.5 }
      ]
    }
  }
}
</script>
