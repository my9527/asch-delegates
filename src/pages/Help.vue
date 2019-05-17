<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <div class="text-h4 text-center">Help</div>

      <br>
      <p class="question">1. 什么是受托人和超级节点?</p>
      <hr>受托人是阿希链系统中一种拥有特殊角色和标的识账户，任何账户都可以通过花费
      <span class="red-bold">100 XAS</span>
      或等值的NET资源注册成为受托人。
      <br>受托人不会获得区块奖励以及任何其他收益, 但受托人是成为超级节点的必要条件。
      <br>任何账户都可以投票给受托人，获得票数排名前
      <span class="red-bold">21</span>
      位的受托人就成为超级节点，超级节点拥有生产区块的权力，并可以因此获得收益。
      <br>由于阿希链采用了DPoS的共识机制，超级节点在区块共识环节不需要拥有很高的算力，只需要安装阿希链的服务器程序并配置好账户密钥即可。
      <br>在有些区块链系统中，受托人也被称为候选节点, 超级节点也被称为共识节点、超级代表或共识节点等。
      <br>

      <br>
      <p class="question">2. 如何成为超级节点?</p>
      <hr>第一步，注册账户名字，只有拥有名字的账户才可以注册成为受托人，可通过本网站或阿希链web客户端或命令行程序进行。
      <br>第二步，注册成受托人角色，可通过本网站或阿希链web客户端或命令行程序进行。
      <br>第三步，安装阿希链服务器程序，并配置受托人秘钥，可参考
      <a href="https://github.com/AschPlatform/asch-docs">这篇文档</a>。
      <br>第四步(可选)，在指定的智能合约中设置team profile，本条非强制，但有助于获得选票。
      <br>第五步，通过各种途径获得其他社区成员的投票。
      <br>本网站提供了一个
      <a href="/register">快捷注册页面</a>，可以帮助完成第一、二、四步。
      <br>

      <br>
      <p class="question">3. 超级节点的职责是什么?</p>
      <hr>超级节点的本职工作是维护服务器的健康运行，尽量保持在线和区块生产率。
      <br>如果超级节点的服务器因出现网络故障或宕机等问题导致没有正常产出区块，用户将得不到该时间段的区块奖励。
      <br>对于频繁出现故障的超级节点，投票者有义务撤销对他们的投票，超级节点丢失区块的信息会被记录在链上，任何人都可以查询，具体可参考
      <a
        href="https://github.com/AschPlatform/asch-docs"
      >HTTP API文档</a>。
      <br>除此之外，超级节点有义务关注链上提案系统并认真审查每一个提案的内容，并且有权利通过对提案进行表决，获得多数(2/3)超级节点认同的提案将被系统通过。
      <br>

      <br>
      <p class="question">4. 超级节点收益如何?</p>
      <hr>区块奖励会随着时间递减，具体时间则以未来的某一区块高度为准。
      <br>Asch系统的区块奖励从464500块开始，初始奖励3.5币，每300万块递减一次，大约为1年。
      <br>从12464500块以后，奖励不再递减，每年有略小于1.5%的通胀率。
      <br>下表列出了各个阶段的区块奖励
      <br>
      <q-markup-table style="width: 400px;">
        <thead>
          <tr>
            <th class="text-left">奖励(XAS)</th>
            <th class="text-left">起始区块高度</th>
            <th class="text-left">结束区块高度</th>
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
      <br>增发token做如下分配：
      <ul>
        <li>1. 20%用于区块生产奖励，平均分配给超级节点</li>
        <li>2. 20%用于竞选奖励，按照获取的选票数量线性分配</li>
        <li>3. 60%托管在理事会账户，用于动态激励，包括dapp生态激励，开发者激励等</li>
      </ul>上述分配比例并非固定，可通过链上治理系统进行调节。
      <br>超级节点的收益除了上述激励机制外，还包括系统的手续费分成。
      <br>超级节点的收益每个round结算一次，每个round的时间与超级节点个数相关，当前系统的超级节点个数为21，那么每个round时间为21个区块间隔时间，即210秒。
      <br>在每个round中，如果超级节点没有正常生产出区块，则无法获得当前round的区块奖励以及手续费分成。
      <br>

      <br>
      <p class="question">5. 如何投票?</p>
      <hr>任何账户可通过LOCK交易，将XAS
      <span class="red-bold">1:1</span>置换成VOTING POWER，然后就可以参与投票。
      <br>LOCK交易可以指定XAS数量以及解锁高度，LOCK交易可发起多次，但每次LOCK操作都至少增加259200个区块的锁定时间，大约为1个月。
      <br>LOCK交易需要花费
      <span class="red-bold">0.1 XAS</span>或等值的NET资源。
      <br>到达解锁高度后，账户不会自动解锁，依然保持LOCK状态以及VOTING POWER，用户手动解锁后，VOTING POWER转换为XAS，同时减去相应数量的被投票节点的选票。
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
