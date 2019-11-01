<template>
    <div class="page-ing">
        <div class="p-header">理事会成员</div>
        <div class="page-sub">
           <div v-for="(m, index) in selected" class="q-item-wrap" :key="index" >
               <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-avatar size="52px" color="cyan-1">
                            {{m.name|firstC}}
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label class="q-name" lines="1">{{m.name}}</q-item-label>
                        <q-item-label class="q-website" caption lines="2">
                            <span class="text-weight-bold">主页</span>
                            {{m.website}}
                        </q-item-label>
                    </q-item-section>
            </q-item>

           </div>
        </div>
        <div class="tip text-center">
            下次选举时间: {{nextSession}}(区块高度 {{councilInfo.sessionEnd + 1}})
        </div>
        <div class="p-header-b">理事会资金</div>
        <div class="tip info-tip"> 
            <div>
                <span>地址:{{cAddress}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                <span>余额:{{accountRest | clacNum}}</span>
            </div>
            <div>
                <q-btn :disable="dis || cAddress|shouldDisable(members, councilInfo)" color="primary" @click="showStartModal">发起交易</q-btn>
            </div>
        </div>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          @input="changeTab"
        >
          <q-tab name="to" label="待支出款项" />
          <q-tab name="his" label="已支出款项明细" />
          
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="to">
           <q-table
                :data="toData"
                :columns="columns"
                row-key="address"
                @request="getPendingList"
                :loading="isLoadingPending"
                :pagination.sync="pendingPagination"
            >
            <template v-slot:body-cell-operation="props">
                <q-td :props="props">
                    <q-btn color="primary" :disable="dis || props|shouldDisable(members, councilInfo)"  class="pointer" @click="sign(props)">签名</q-btn>
                </q-td>
            </template>
            <template v-slot:body-cell-remarks="props">
                <q-td :props="props">
                    <span>
                        {{props|remarksRender}} 
                        <q-tooltip>
                            {{props.row.remarks}}
                        </q-tooltip>
                    </span>
                </q-td>
            </template>
           </q-table>
          </q-tab-panel>

          <q-tab-panel name="his">
            <q-table
                :data="hisData"
                :columns="columnsHis"
                row-key="address"
                @request="getHisList"
                :loading="isLoadingHist"
                :pagination.sync="hisPagination"
            />
          </q-tab-panel>
        </q-tab-panels>
        
    </div>
</template>


<script>
import { formatTime, xasToPrecision } from '../utils/index'
import StartModalVue from './StartModal.vue'
const _xasToPrecision = (num) => {
    return xasToPrecision(num).toFixed(8)
}

const sleep = (delay = 1000) => new Promise(resolve=> {
    setTimeout(resolve, delay)
})
const START_TIME = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0)).getTime()
export default {
    props: ['councilInfo', 'members', 'dis'],

    data() {
        return {
            hasPlugin: true, 
            pendingPagination: {
                page: 1,
                rowsPerPage: 10,
                rowsNumber:0,
            },
            hisPagination: {
                page: 1,
                rowsPerPage: 10,
                rowsNumber:0,
            },
             tab: 'to',

             isLoadingPending: false,
             isLoadingHist: false,

             cAddress: 'GADQ2bozmxjBfYHDQx3uwtpwXmdhafUdkN',
             accountRest: 0,

             toData: [],
             hisData: [],

             columns: [{
                name: 's',
                // required: true,
                label: '交易号',
                align: 'left',
                field:  row => row.tid.slice(-12)
             },
             {
                 name: 'date',
                 label: '时间',
                 field: row => formatTime( START_TIME + row.timestamp * 1000),
             },
             {
                name: 'amount',
                required: true,
                label: '数额',
                field: row => _xasToPrecision(row.amount),
             },{
                name: 'address',
                required: true,
                label: '收款人地址',
                field: 'recipient'
             }, {
                 name: 'remarks',
                 label: '备注',
                 field: 'remarks',
             }, {
                 name: 'times',
                 label: '签名数',
                 field: 'signs'
             },{
                 name: 'operation',
                 label: '操作'
             }],
             columnsHis: [{
                 name: 'orderNum',
                 label: '交易号',
                 align: 'left',
                 field:  row => row.tid.slice(-12)
             }, {
                 name: 'date',
                 label: '时间',
                field: row => formatTime( START_TIME + row.timestamp * 1000),
             }, {
                 name: 'amount',
                 label: '数额',
                  field: row => _xasToPrecision(row.amount),
             },{
                name: 'address',
                required: true,
                label: '收款人地址',
                field: 'recipient'
             }, {
                 name: 'remarks',
                 label: '备注',
                 field: 'remarks',
             }]
        }
    },

    filters: {
        firstC: (str) => {
            if(!str){
                return ''
            }
            return str.slice(0, 1).toUpperCase()
        },
        clacNum: (num) => {
            return xasToPrecision(num)
        },
        formatT: (tim) => {
            return this.$asch.AschWeb.Utils.getTime(tim)
        },
        shouldDisable: (props, members, info) => {
            
            window.aschPay = window.aschPay || { defaultAccount: {
                address: '___no___'
            } }
            const defaultAddress = window.aschPay.defaultAccount.address
            return info.status === 0 || !(members.some(v => v.address === defaultAddress))
        },

        remarksRender:(props) => {
            const { row } = props
            const { remarks } = row
            return remarks.slice(0, 10)
        }
    },

    computed: {
        nextSession() {
             const { sessionEnd } = this.councilInfo
            return this.resolveHeightToTime(sessionEnd +  1)
        },
        selected() {
            return this.members.slice(0, 3)
        }
    },

    mounted() {
        this.init()
    },

    methods: {
        async init() {
            this.getPendingList({
                pagination: { page: 1 }
            })
            this.getRestAmount()
        },
        
        async getCurHeight() {
            const { height } = await this.$api.getBlockHeight()
             const { block } = await this.$api.getBlockDetail(height)
            // console.log('curHeight' , curHeight)
            this.curHeightBlock = block
        },
        resolveHeightToTime(targetHeight) {
            const { currentHeight } = this.councilInfo
            // const _time = Math.floor(((targetHeight - height) / day_count) * one_day_seconds + timestamp * 1000  + time0)
            const _time = Math.floor((targetHeight - currentHeight) * 10) * 1000 + Date.now()
            return formatTime(_time)
        },

        changeTab(nextTab) {
            if(nextTab === 'to') {
                this.getPendingList({
                pagination: { page: 1 }
            })
            } else {
                this.getHisList({
                pagination: { page: 1 }
            })
            }
        },

        getSelectedString() {
            return 'as'
        },

        async sign({ row }) {
            console.log(row)
            await this.$asch.signedForCouncil({
                type: 703,
                fee: 10000000,
                args: [row.tid],
            })
        },

        async getRestAmount() {
            const { account, success, error} = await this.$api.getRestAmount(this.cAddress)
            // console.log(result)
            if(success) {
                this.accountRest = account.xas
            } else {
                this.message(error || '获取理事会余额失败', 'error')
            }
        },

        showStartModal() {
            this.$q.dialog({
                component: StartModalVue,
                parent: this, // becomes child of this Vue node
                text: 'something',
                // ...more.props...
                }).onOk(async (formvals) => {
                    console.log(formvals)
                    const {
                        address,
                        amount,
                        remarks,
                    } = formvals
                    const {success, error} = await this.$asch.signedForCouncil({
                        type: 702,
                        fee: 100000000000,
                        args: [address, amount * 1e8, 'XAS', remarks, 0],

                    })
                    if(success) {
                        this.message('操作成功')
                        await sleep(3000)
                        if(this.type === 'to') {
                            this.getPendingList({ pagination: {
                                page: this.pendingPagination.page
                            } })
                        } else {
                            this.getHisList({ pagination: {
                                page: this.hisPagination.page
                            } })
                        }
                    } else {
                        this.message(error || '操作失败', 'error')
                    }
                }).onCancel(() => {
                    console.log('Cancel')
                }).onDismiss(() => {
                    console.log('Called on OK or Cancel')
                })
        },
        
        async getPendingList({ pagination }) {

            const { page } = pagination
            this.isLoadingPending = true
            const { rowsPerPage } = this.pendingPagination
            const size = rowsPerPage
           try{
                const { count, payments } = await this.$api.getPendingList({ limit: size, offset: (page  - 1) * size  } )
            this.pendingPagination.rowsNumber = count
            this.pendingPagination.page = page

            this.toData = payments
           } catch(e){
               console.log('error')
           }
            this.isLoadingPending = false
        },

        async getHisList({ pagination }) {
           this.isLoadingHist = true
           const { page } = pagination
           try {
                const { rowsPerPage } = this.hisPagination
                const size = rowsPerPage
                const { count, payments } = await this.$api.getFinanceRecords({ limit: size, offset: (page  - 1) * size  } )
                this.hisPagination.rowsNumber = count
                this.hisPagination.page = page
                this.hisData = payments
           } catch(e){
               console.log(e)
           }
           this.isLoadingHist = false
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
    
    },
}
</script>

<style scoped>
.page-ing{
    width: 100%;
    font-size: 16px;
    font-weight: normal;
}
.p-header, .p-header-b{
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 8px;    
    margin-top: 32px;
}
.p-header{
    margin-bottom: 64px;
}
.p-header-b{
    border-top: 1px solid #dfdfdf;
    padding-top: 16px;
    margin-top: 12px;
}
.page-sub{
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    width: 100%;
    font-size: 14px;
    margin-bottom: 24px;
    font-weight: 400;
}
.page-sub-timerange{
    /* display: flex; */

}
.btn-wrap{
    margin-top: 32px;
}
.voteBtn{
    width: 8em;
    
}
.pointer{
    cursor: pointer;
}
.tip {
    color: #999999;
    font-size: 13px;
}
.info-tip{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    margin-top: 16px;
}
.q-name{
    font-size: 14px;
}
.q-website{
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block!important;
}
.q-item-wrap{
    max-width: 33%;
}
</style>