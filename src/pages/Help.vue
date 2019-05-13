<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <div class="text-h4 text-center text-bold">Asch Super Node FAQ</div>
      <br>
      <q-list bordered>
        <div v-for="item of qas" v-bind:key="item.q">
          <q-expansion-item v-bind:label="item.q" header-class="text-primary">
            <q-card>
              <q-card-section>{{ item.a }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator/>
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<style scoped>
</style>

<script>
export default {
  name: 'PageHelp',
  data() {
    return {
      qas: [
        {
          q: '1. What is super node and delegate ?',
          a: `Each account in Asch system can be registered as a delegator (100XAS is payable).

A delegator can accept any votes from coin holders. When the rate of vote reaches into top 101, the delegators can obtain the right to account(that is, the right of block production, which is equivalent to miners in Bitcoin. ) and get certain reward. The process of block production is called forging.

Forging does not need strong computing power like Bitcoin mining. Even the ordinary computer can be carried out to verify the algorithm of accounting right, which combines time slice verification, delegators random ranking, delegators signatures and pbft algorithm. More details refer to Asch consensus agreement. The delegators of top 101 are in turn to produce blocks in chronological order with a block interval of 10 seconds.When delegators in turn can not produce blocks because of exceptions, it will be postponed to next 10 seconds and produce by the next delegator.

Each 101 blocks as a cycle, forging order of the delegators will be random changed in each cycle. When the last block is produced, the benefit will be settled in this cycle and the ranking will also be refreshed. If delegators can not produce blocks because of the downtime, network errors and other reasons, they can not only get the benefits of the cycle, but also reduce productivity. Productivity is an indicator of the stability of a delegator, and lower productivity will affect the vote.

The delegators of the normal block production divide the benefit equally, including block rewards and transaction fees. The rankings and the votes do not affect the amount of the benefit. The benefit rate of the top 101 delegators is the same.`
        },
        {
          q: '2. how to become super node ?',
          a: `Each account in Asch system can be registered as a delegator (100XAS is payable).

A delegator can accept any votes from coin holders. When the rate of vote reaches into top 101, the delegators can obtain the right to account(that is, the right of block production, which is equivalent to miners in Bitcoin. ) and get certain reward. The process of block production is called forging.

Forging does not need strong computing power like Bitcoin mining. Even the ordinary computer can be carried out to verify the algorithm of accounting right, which combines time slice verification, delegators random ranking, delegators signatures and pbft algorithm. More details refer to Asch consensus agreement. The delegators of top 101 are in turn to produce blocks in chronological order with a block interval of 10 seconds.When delegators in turn can not produce blocks because of exceptions, it will be postponed to next 10 seconds and produce by the next delegator.

Each 101 blocks as a cycle, forging order of the delegators will be random changed in each cycle. When the last block is produced, the benefit will be settled in this cycle and the ranking will also be refreshed. If delegators can not produce blocks because of the downtime, network errors and other reasons, they can not only get the benefits of the cycle, but also reduce productivity. Productivity is an indicator of the stability of a delegator, and lower productivity will affect the vote.

The delegators of the normal block production divide the benefit equally, including block rewards and transaction fees. The rankings and the votes do not affect the amount of the benefit. The benefit rate of the top 101 delegators is the same.`
        },
        {
          q: '3. what is the duty of a super node ?',
          a: `Each account in Asch system can be registered as a delegator (100XAS is payable).

A delegator can accept any votes from coin holders. When the rate of vote reaches into top 101, the delegators can obtain the right to account(that is, the right of block production, which is equivalent to miners in Bitcoin. ) and get certain reward. The process of block production is called forging.

Forging does not need strong computing power like Bitcoin mining. Even the ordinary computer can be carried out to verify the algorithm of accounting right, which combines time slice verification, delegators random ranking, delegators signatures and pbft algorithm. More details refer to Asch consensus agreement. The delegators of top 101 are in turn to produce blocks in chronological order with a block interval of 10 seconds.When delegators in turn can not produce blocks because of exceptions, it will be postponed to next 10 seconds and produce by the next delegator.

Each 101 blocks as a cycle, forging order of the delegators will be random changed in each cycle. When the last block is produced, the benefit will be settled in this cycle and the ranking will also be refreshed. If delegators can not produce blocks because of the downtime, network errors and other reasons, they can not only get the benefits of the cycle, but also reduce productivity. Productivity is an indicator of the stability of a delegator, and lower productivity will affect the vote.

The delegators of the normal block production divide the benefit equally, including block rewards and transaction fees. The rankings and the votes do not affect the amount of the benefit. The benefit rate of the top 101 delegators is the same.`
        },
        {
          q: '4. Super node profit',
          a: `Each account in Asch system can be registered as a delegator (100XAS is payable).

A delegator can accept any votes from coin holders. When the rate of vote reaches into top 101, the delegators can obtain the right to account(that is, the right of block production, which is equivalent to miners in Bitcoin. ) and get certain reward. The process of block production is called forging.

Forging does not need strong computing power like Bitcoin mining. Even the ordinary computer can be carried out to verify the algorithm of accounting right, which combines time slice verification, delegators random ranking, delegators signatures and pbft algorithm. More details refer to Asch consensus agreement. The delegators of top 101 are in turn to produce blocks in chronological order with a block interval of 10 seconds.When delegators in turn can not produce blocks because of exceptions, it will be postponed to next 10 seconds and produce by the next delegator.

Each 101 blocks as a cycle, forging order of the delegators will be random changed in each cycle. When the last block is produced, the benefit will be settled in this cycle and the ranking will also be refreshed. If delegators can not produce blocks because of the downtime, network errors and other reasons, they can not only get the benefits of the cycle, but also reduce productivity. Productivity is an indicator of the stability of a delegator, and lower productivity will affect the vote.

The delegators of the normal block production divide the benefit equally, including block rewards and transaction fees. The rankings and the votes do not affect the amount of the benefit. The benefit rate of the top 101 delegators is the same.`
        },
        {
          q: '5. Asch consensus algorithms',
          a: `Each account in Asch system can be registered as a delegator (100XAS is payable).

A delegator can accept any votes from coin holders. When the rate of vote reaches into top 101, the delegators can obtain the right to account(that is, the right of block production, which is equivalent to miners in Bitcoin. ) and get certain reward. The process of block production is called forging.

Forging does not need strong computing power like Bitcoin mining. Even the ordinary computer can be carried out to verify the algorithm of accounting right, which combines time slice verification, delegators random ranking, delegators signatures and pbft algorithm. More details refer to Asch consensus agreement. The delegators of top 101 are in turn to produce blocks in chronological order with a block interval of 10 seconds.When delegators in turn can not produce blocks because of exceptions, it will be postponed to next 10 seconds and produce by the next delegator.

Each 101 blocks as a cycle, forging order of the delegators will be random changed in each cycle. When the last block is produced, the benefit will be settled in this cycle and the ranking will also be refreshed. If delegators can not produce blocks because of the downtime, network errors and other reasons, they can not only get the benefits of the cycle, but also reduce productivity. Productivity is an indicator of the stability of a delegator, and lower productivity will affect the vote.

The delegators of the normal block production divide the benefit equally, including block rewards and transaction fees. The rankings and the votes do not affect the amount of the benefit. The benefit rate of the top 101 delegators is the same.`
        }
      ]
    }
  }
}
</script>
