
<template>
    <q-page class="flex page-activity">
         <div v-if="isLogined">
            <q-tabs @input="changeTab" v-model="selectedTab" align="left">
                 <q-tab  name="list" label="项目"  />
                 <q-tab  name="project" label="账户"  />
            </q-tabs>
            <q-tab-panels
                v-model="selectedTab" 
                animated
                transition-prev="jump-up"
                transition-next="jump-up">
                <q-tab-panel name="list" >
                    <div style="position:relative">
                        <AcItem 
                            v-for="ac in activities" 
                            :key="ac.id" 
                            :item="ac"
                            :curHeightBlock="curHeightBlock"
                            :loadingItem="loadingItem"
                            @clickActivity="getActivityDetail"
                        />
                        <q-inner-loading :showing="loading">
                            <q-spinner-ios
                                color="primary"
                                size="2em"
                            />
                        </q-inner-loading>
                    </div>
                    <div class="flex flex-center" v-if="activities.length==0 && !loading">
                        暂无数据
                    </div>
                    <div v-if="activities.length>0" class="flex flex-center pagination-wrapper">
                        <q-pagination
                            v-model="pagination.current"
                            @input="loadNextPage" 
                            :max="pagination.max"
                            :maxPages="6"
                            :boundary-numbers="true"
                            :boundary-links="true"
                         />
                    </div>
                    
                    
                </q-tab-panel>

                <q-tab-panel name="project">
                    <div>
                        <AcAccount
                        :tabName="selectedTab"
                        :accountInfo="accountInfo" 
                        :contract="contract" 
                    />
                    </div>
                </q-tab-panel>
            </q-tab-panels> 
        </div>
        <div v-if="!isLogined" class="loginTip">
            请使用Asch-Pay登录后刷新页面,如果未安装Asch-Pay,可击上方链接进行安装
        </div>
        
        <q-dialog v-model="showModal">
            <q-card>
                <q-card-section class="row items-center modal-title">
                <div class="text-h6">报名</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                <div class="modal-content" style="width:400px">
                    <div class="c-row">
                        <span class="c-row-label">已锁仓金额</span> <span class="c-row-val">{{lockHeight}}</span>
                    </div>
                    <div class="c-row">
                        <span class="c-row-label">锁定时间</span> <span class="c-row-val">{{lockedDuration}}</span>
                    </div>
                    <div class="c-row">
                        <span class="c-row-label">份额</span> <span class="c-row-val">{{shares}}</span>
                    </div>
                    <div class="c-row">
                        <span class="c-row-label">参与项目</span> <span class="c-row-val">#{{intentActivity.id}}</span>
                    </div>
                    <div class="warning">
                        <div>1、一旦参与，无法撤回</div>
                        <div>2、在本项目结束前，无法参与其他项目</div>
                    </div>
                </div>
                </q-card-section>
                <q-card-section class="flex flex-center">
                    <q-btn :loading="confirmingJoin" @click="confirmJoin" color="secondary" label="确认报名" />
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<style lang="css" scoped>
    /* :global(.q-tabs__content){
        border-bottom: 1px solid;
        margin-top: 50px;
    } */
    .pagination-wrapper {
        margin-top: 16px;
    }
    .page-activity >>> .q-tabs__content{
         border-bottom: 1px solid;
        margin-top: 50px;
    }

    .page-activity > button {
        display: inline-flex!important;
    }
    .page-activity > :global(.q-tab--active) {
        color: red!important
    }
    .modal-title{
        background-color: #20222c;
        color: white;
        padding-top: 12px;
        padding-bottom: 12px;
    }
    .modal-content{
        padding-top: 24px;
    }
    .c-row{
        display: flex;
        justify-content: center;
        font-size: 16px;

    }
    .c-row + .c-row{
        margin-top: 18px;
    }
    .c-row-label{
        color: #999999;
        width: 7em;
        margin-right: 6px;
    }
    .c-row-val{
        color: #4d4d4d;
        width: 20%;
        white-space: nowrap
    }
    .warning{
        font-weight: 18px;
        color: #de1111;
        margin-top: 24px;
        width: 80%;
        text-align: left;
        padding-left: 5em;
    }
    .loginTip{
        text-align: center;
        margin: 50px auto; 
    }
</style>

<script>
import Vue from 'vue'
import { setTimeout, clearTimeout } from 'timers'
import Mockjs from 'mockjs'
import { Promise } from 'q'
import { QSpinnerHourglass } from 'quasar'
import { getLockedDurationDay, xasToPrecision, formatTime } from '../utils/index'


const CONTRACT = 'test_bonus_v8'
const time0 = Date.UTC(2016, 5, 27, 20, 0, 0, 0)
const one_day_seconds = 1000 * 60 * 60 * 24
const day_count = 8640

const POLLING_INTERVAL = 10 * 1000

const sleep = (delay = 1000) => new Promise(resolve=> {
    setTimeout(resolve, delay)
})

export default {
    name: 'PageActivity',
    components: {
        AcItem: () => import('../components/AcItem'),
        AcAccount: () => import('../components/Account'),
    },
    data() {
        return {
            activities: [], //projects
            pagination: {
                pageSize: 11,// 实际单页数为 pageSize+1
                total: 0,
                current: 1,
                max: 1,
            },
            selectedTab: 'list', // 当前tab
            contract: null,      // contract handler
            investor: {},          // 当前用户
            intentActivity: {},         // 欲加入的项目
            loadingItem: null,
            loading: false,
            // curHeight: 0,
            curHeightBlock: {},
            loadingAcDetail: false, // 加载选中项目信息
            confirmingJoin: false,     // 确定加入该项目
            getingUserinfo: false,
            shares: 0,
            accountInfo: {},
            retryTime: 5,
            isLogined: true,
            listTimer: null, // 页面轮训 handler
            // userAccount: this.$asch.defaultAccount,
            // userAccount: window.aschPay.defaultAccount.,

        }
    },
    created() {
        this.$q.loading.show({
          spinnerSize: '2em',
          spinner: QSpinnerHourglass,
        })
        
        // this.$asch
    },

    mounted() {
        this.init()
    },

    beforeDestroy() {
        this.stopPolling()
    },

    computed: {
        showModal: {
            get(){
                return !!Object.keys(this.intentActivity).length
            },
            set(v){
                if(!v){
                    this.intentActivity = {}
                }
            }
        },
        lockedDuration() {
            return this.resolveHeightToTime(this.accountInfo.lockHeight)
        },
        lockHeight() {
            return xasToPrecision(this.accountInfo.weight)
        },
        showProjectPanel() {
            return this.selectedTab === 'project'
        },
        // userAddress() {
        //     return  this.$asch.defaultAccount.address
        // }
    },
    
    methods: {

        async init() {
            this.loading = true
            const hash = window.location.hash
            await this.getContract()
            if(!this.contract){
                this.pollingPage()
                this.$q.loading.hide()
                return
            }

            if(hash.match(/project/i)){
                this.selectedTab = 'project'
                this.changeTab('project')
                this.loading = false
                this.$q.loading.hide()
                return
            }
            await this.getACList()
            await this.getCurHeight()
            await this.getUserAccount()
            this.loading = false
            this.pollingPage()
            this.$q.loading.hide()
        },
        async getACList(isRefresh = false) {
            const { current, pageSize } = this.pagination
            // const _page_d = isRefresh ? 0 : 1
            let from = 0
            if(!isRefresh) {
                this.loading = true
                from = (current-1) * (pageSize + 1)
            } else {
                // 页面刷新, 不需要loading
                from = (this.pagination.current - 1) * (pageSize + 1)
            }
            const { data: {count, projects }} = await this.contract.queryProjects(pageSize, from)
            // 更新列表
            this.activities =  projects
            
            // 分页
            this.pagination = {
                pageSize,
                total: count,
                current: current,
                max: Math.ceil(count/(pageSize+1))
            }
            this.loading = false
        },

        /**
         * 下一页
         */
        async loadNextPage(page) {
            this.loading = true
            this.stopPolling()
            await this.getACList()
            this.pollingPage()
            
        },

        async getContract (isInit = false) {
            console.log('getContract', this.$asch)
        
            if(this.retryTime === 0){
                this.isLogined = false
                this.loading = false
                this.$q.loading.hide()
                return this.message('请先登录', 'error')

            }
            if(!this.checkAschIsReady() && this.retryTime > 0) {
                await sleep(2000)
                this.retryTime--
                
                return this.getContract(isInit)
            }
            this.watchAccount()
            // this._setHost()
            this.contract = await this.$asch.aschPay.createContractFromName(CONTRACT)
        },

        watchAccount () {
            const self = this
            window._address = window.aschPay.defaultAccount.address
            // 属性拦截，获取信息更改的
            Object.defineProperty(window.aschPay.defaultAccount, 'address', {
                set: function(v) {
                    this._address = v
                    window.location.reload(true)
                },
                get: function() {
                    return window._address
                }
            })
        },


        /**
         * Todo 临时用，待删除
         */
        _setHost() {
            // this.$asch.aschPay.api._provider._instance.defaults.baseURL = 'https://wallet.asch.io/'
        },

        // async getInvestorInfo() {
        //     this.getingUserinfo = true
        //     try{
        //         const address = this.$asch.defaultAccount.address
        //         console.log(address)
        //         const {data, success} = await this.contract.getInvestorInfo(address)
        //         if(success === false){
        //             this.message(userInfo.error, 'error')
        //         }else{
        //             let userInfo =  {...data}
        //             userInfo.address = address
        //             this.investor = userInfo
        //         }
                
        //     } catch(e){
        //         this.message(e.error, 'error')
        //     }
        //     this.getingUserinfo = false
            
        // },

        /**
         * 检测是否asch 是否已经ready
         */
        checkAschIsReady() {
            if(!this.$asch.aschPay || !this.$asch.aschPay.createContractFromName){
                return false
            } else {
                return true
            }
        },

        // tab 切换
        async changeTab(tabName) {
            window.location.hash = `#${tabName}`
            if(tabName === 'project'){
                this.stopPolling()
            } else {
                console.log('tab changed')
                await this.getACList(true)
                this.pollingPage()
            }
        },

        /**
         * 获取项目详情
         */
        async getActivityDetail (activity) {
            // this.loadingAcDetail = true
            this.loadingItem = activity.id
            try{
                await this.getUserAccount()
                const { lockHeight, weight } = this.accountInfo
                await this.getShares(lockHeight, weight, activity.id)
                // console.log(this.shares)
                if(this.shares === 0) {
                    this.message('不满足参与项目的条件', 'error')
                    return
                }
                const { data, success, error } = await this.contract.getProjectInfo(activity.id)
                if(success === false){
                    this.message(error, 'error')
                } else {
                    this.intentActivity = data
                    this.showModal = true
                }
               
            } catch(e){
                this.message('项目获取失败，请重试', 'error')
            }
                this.loadingItem = null
           
        },

        async confirmJoin() {
            // this.intentActivity
            this.confirmingJoin = true
            // if(this.curHeightBlock.height < this.intentActivity.launchHeight) {
            //     this.message('项目现在不可参与', 'error')
            //     this.confirmingJoin = false
            //     return
            // }
            if(this.shares === 0){
                return this.message('您的份额不满足参与条件')
            }
            // await sleep(3000)
            const result = await this.contract.invest(this.intentActivity.id)
            if(result && result.success){
                this.intentActivity = {}
                this.message('操作成功')
            } else {
                this.message(result.error, 'error')
            }
            this.confirmingJoin = false
            
        },

        async getCurHeight() {
            const { height } = await this.$api.getBlockHeight()
             const { block } = await this.$api.getBlockDetail(height)
            // console.log('curHeight' , curHeight)
            this.curHeightBlock = block
        },

        async getUserAccount() {
            const address = this.$asch.defaultAccount.address
            if(!address){
                return
            }
            const { account } = await this.$api.getAccountInfo(address)
            this.accountInfo = account || {}
        },

        async getShares(lockHeight, weight, id) {
            const { success, data, error } = await this.contract.measureShares(weight, lockHeight, id)
            if(success){
                this.shares = data
            } else {
                console.log(error)
            }
        },

        resolveHeightToTime(targetHeight) {
            const { height, timestamp } = this.curHeightBlock
            const _time = Math.floor(((targetHeight - height) / day_count) * one_day_seconds + timestamp * 1000  + time0)
            // console.log(targetHeight, _time)
            return formatTime(_time)
        },

        pollingPage() {
            this.listTimer = setTimeout(async () => {
                await this.getCurHeight(true)
                await this.getACList(true)
                this.pollingPage()
            }, POLLING_INTERVAL)
        },

        stopPolling() {
            clearTimeout(this.listTimer)
            this.listTimer = null
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
    }
}
</script>


