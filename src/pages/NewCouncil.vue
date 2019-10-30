<template>
  <q-page class="flex">
    <div class="flex " style="font-size: 24px; font-weight: bold;">
        <div v-if="!loading" style="width:100%">
            <Ing v-if="councilInfo.status !== 1" 
                @refreshMemer="getMembers" 
                :councilInfo="councilInfo" 
                :members="councilMembers"
                :dis="!hasPlugin"

            ></Ing>
            <Done v-if="councilInfo.status === 1" 
                @refreshMemer="getMembers" 
                :councilInfo="councilInfo" 
                :members="councilMembers"
                :dis="!hasPlugin"

            ></Done>
        </div>
    </div>
  </q-page>
</template>

<style scoped>
</style>

<script>

const CONTRACT = 'test_bonus_v8'
const time0 = Date.UTC(2016, 5, 27, 20, 0, 0, 0)
const one_day_seconds = 1000 * 60 * 60 * 24
const day_count = 8640

const POLLING_INTERVAL = 10 * 1000

const sleep = (delay = 1000) => new Promise(resolve=> {
    setTimeout(resolve, delay)
})

export default {
  name: 'PageNewCouncil',
  components: {
      Ing: () => import ('../components/NewCouncil_ing'),
      Done: () => import ('../components/NewCouncil_done'),
  },
  data(){
      return {
          hasPlugin: true,
          loading: true,
        //   contract: null,
          retryTime: 5,
          isPending: false,

          curHeightBlock: {},

          councilInfo: {}, // 领事会选举情况
          councilMembers: [], //领事会成员
      }
  },
  mounted() {
        this.init()
        this.pollingPage()
        setTimeout(() => {
            this.checkHasPlugin()
        }, 1000)
  },
  beforeDestroy() {
        this.stopPolling()
    },

  methods: {

        pollingPage() {
            this.listTimer = setTimeout(async () => {
                this.getCouncilInfo()
                this.getMembers()
                this.pollingPage()
            }, POLLING_INTERVAL)
        },

        stopPolling() {
            clearTimeout(this.listTimer)
            this.listTimer = null
        },

        checkHasPlugin() {
            this.hasPlugin = this.$asch && this.$asch.AschWeb
        },

      async init(){
            this.loading = true
            this.$q.loading.show()
            // await this.getContract(true)
            // if(!this.contract){
            //     this.$q.loading.hide()
            //     return
            // }
            // await this.getCurHeight()
            this.getCouncilInfo()
            this.getMembers()
            this.loading = false
            this.$q.loading.hide()
      },

      async getCurHeight() {
            const { height } = await this.$api.getBlockHeight()
             const { block } = await this.$api.getBlockDetail(height)
            // console.log('curHeight' , curHeight)
            this.curHeightBlock = block
        },

      checkAschIsReady() {
            if(!this.$asch.aschPay || !this.$asch.aschPay.createContractFromName){
                return false
            } else {
                return true
            }
        },

        resolveHeightToTime(targetHeight) {
            const { height, timestamp } = this.curHeightBlock
            const _time = Math.floor(((targetHeight - height) / day_count) * one_day_seconds + timestamp * 1000  + time0)
            return formatTime(_time)
        },


        message(msg, type = 'info') {
           const commonProps = {
                timeout: 2000,
                position: 'top',
                classes: 'text-center'
           }
           const typeProps = {
               error: {
                   color: 'red',
               },
               info: {},
           }
           this.$q.notify({
               ...commonProps,
               ...typeProps[type],
               message: msg,
           })
        },

        async getCouncilInfo() {
            try{
                const {success, councilInfo} = await this.$api.getCouncilInfo()
                if(success){
                    this.councilInfo = councilInfo
                }
            } catch(e) {
                this.message(e.message, 'error')
            }
            
        },

        async getMembers() {
            try {
                const { success, count, members } = await this.$api.getCouncilMember()
                if(success){
                    this.councilMembers = [...(members || [] )]
                }

            } catch(e) {
                console.log('获取成员失败')
            }
        }
  },
}
</script>
