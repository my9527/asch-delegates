<template>
    <div>
        <div class="account-info">
            <div class="labels">
                <div class="labelItem row" v-for="labelKey in keys" :key="labelKey" >
                    {{keyMap[labelKey]}}
                </div>
            </div>
            <div class="vals">
                <div class="valItem row" v-for="labelKey in keys" :key="labelKey" >
                    {{resolvedVals[labelKey] || '-'}}
                </div>
            </div>
        </div>
        <div class="flex flex-center">
            <q-btn 
                :disable="isWithdrawDisabled" 
                @click="withdraw" 
                class="submit-btn" 
                color="secondary" 
                label="提现"
                :loading="isWithdrawing"
            />
        </div>
        <q-inner-loading :showing="loading">
            <q-spinner-ios
                color="primary"
                size="2em"
            />
        </q-inner-loading>
    </div>
</template>

<style scoped>
    .account-info{
        padding: 72px;
        display: flex;
        width: 100%;
        font-size: 16px;

    }
    .labels{
        border-right: 1px #ebebeb solid;
        padding-right: 72px;
        display: flex;
        flex-direction: column;
        text-align: right;
        width: 50%;
    }
    
    .row + .row{
        margin-top: 12px;
    }
    .vals{
        padding-right: 72px;
        width: 50%;
    }
    .labelItem{
        color: #999999;
        display: flex;
        justify-content: flex-end;
    }
    .valItem{
        color: #333333;
        padding-left: 72px;
        white-space: nowrap;
    }
    .submit-btn{
        width: 80%;
    }
</style>

<script>
import { formatTime, xasToPrecision } from '../utils/index'
import { unlink } from 'fs'
import { setTimeout, clearTimeout } from 'timers'
import { async } from 'q'
const day_count = 8640
const time0 = Date.UTC(2016, 5, 27, 20, 0, 0, 0)
const one_day_seconds = 1000 * 60 * 60 * 24

const KeyMap = {
    address: '地址',
    weight: '锁仓金额',
    lockHeight: '解锁高度',
    lockPeriod: '锁仓周期',
    shares: '份额',
    totalBonus: '总收益',
    lastWithdrawTime: '上次提现时间',
    nextWithdrawTime:'下次提现时间',
    withdrawedAmount:'已提现总额',
    nextWithdrawAmount: '下次可提现金额',
    leftTotalBonus: '剩余收益',
    withdrawCount: '已提现次数',
    pid: '项目编号',
    endTime: '项目结束时间'
}
const POLLING_INTERVAL = 10 * 1000
const HEIGHT_PER_DAY = 8640
const MAX_LOCK_PERIOD = 1000 * HEIGHT_PER_DAY
export default {
    name: 'activityAccount',
    props:['contract', 'accountInfo'],
    data() {
        return {
            keys: ['address', 'weight', 'lockHeight', 'lockPeriod','pid', 'endTime', 'shares', 
                'totalBonus', 'lastWithdrawTime', 'nextWithdrawTime', 'withdrawCount', 
                'withdrawedAmount', 'nextWithdrawAmount', 'leftTotalBonus'],
            isWithdrawing: false,
            project: {},
            keyMap: KeyMap,
            loading: false,
            investor: {},
            curHeightBlock: {},
        }
    },
    mounted(){
        this.init()
    },
    beforeDestroy() {
            console.log('page account destory')
            this.stopPolling()
    },    
    computed: {
        isWithdrawDisabled() {
            
            return !Object.keys(this.investor).length || this.investor.cleared || this.investor.nextWithdrawHeight > this.curHeightBlock.height
            || !this.investor.nextWithdrawHeight || !this.investor.nextWithdrawAmount
        },
        resolvedVals() {
            const vals = {}
            
            // console.log('get resolvedVals', this.investor, this.accountInfo)
            if(!Object.keys(this.investor).length || !this.accountInfo) {
                return vals
            }
            const {
                // adminAddress,
                lockAmount,
                lockHeight,
                shares,
                endHeight,
                lockPeriod,
                pid,
                withdrawedAmount,
                remainingAmont,
                withdrawCount,
                lastWithdrawHeight,
                nextWithdrawHeight,
                nextWithdrawAmount,
            } = this.investor

            vals.address = this.$asch.defaultAccount.address
            vals.weight = xasToPrecision(lockAmount)
            vals.lockHeight = lockHeight
            vals.shares = shares
            vals.endTime = `${this.resolveHeightToTime(endHeight)}(高度:${endHeight})`
            vals.lockPeriod = `${(lockPeriod / day_count).toFixed(2) || '-'}天(${lockPeriod})`
            vals.pid = `#${pid}`
            // vals.totalBonus = this.calcTotalBonus(this.investor.totalBonus) // 利息
            vals.totalBonus = xasToPrecision((remainingAmont || 0) + (withdrawedAmount || 0))
            vals.withdrawCount = `${withdrawCount || '-'}`
            vals.lastWithdrawTime = lastWithdrawHeight ? `${this.resolveHeightToTime(lastWithdrawHeight)}(高度:${lastWithdrawHeight || '-'})` : '-'  // 上次提取高度（时间）
            vals.nextWithdrawTime = nextWithdrawHeight ? `${this.resolveHeightToTime(nextWithdrawHeight)}(高度:${nextWithdrawHeight || '-'})` : '-'
            vals.nextWithdrawAmount = xasToPrecision(Math.min(nextWithdrawAmount, remainingAmont))
            if(this.investor.cleared){
                vals.nextWithdrawTime = null
                vals.nextWithdrawAmount = null
            } 
            vals.withdrawedAmount = xasToPrecision(withdrawedAmount)
            vals.leftTotalBonus = xasToPrecision(remainingAmont) + ''
            console.log('resolvedVals', vals)

            return vals
        },
    },
    methods: {

        async init() {
            this.loading = true
            await this.loadInfo()
           
            if(Object.keys(this.investor).length && !this.investor.cleared){
                this.pollingPage()
            }
            // await this.getProject()
            this.loading = false
        },

        async getCurHeight() {
            const { height } = await this.$api.getBlockHeight()
             const { block } = await this.$api.getBlockDetail(height)
            // console.log('curHeight' , curHeight)
            this.curHeightBlock = block
        },

        /**
         * 根据当前的高度去刷新investorInfo
         */
        async loadInfo(isRefresh = false) {
            await this.getCurHeight()
            await this.getInvestorInfo(isRefresh)
            // await this.getProject()
        },

        async pollingPage() {
            this.pollingTimer = setTimeout(() => {
                this.loadInfo(true)
                this.pollingPage()
            }, POLLING_INTERVAL)
        },

        stopPolling() {
            clearTimeout(this.pollingTimer)
            this.pollingTimer = null
        },

        
        async withdraw() {
            if(this.curHeightBlock.height < this.investor.nextWithdrawHeight){
                this.message('未达到分红高度')
                return
            }
            this.isWithdrawing = true
            const result = await this.contract.withdraw()
            if(result && result.success){
                this.message('提取成功')
                this.loadInfo()
            } else {
                this.message(result.error, 'error')
            }
            this.isWithdrawing = false
        },

        async getProject() {
            const {data, success, error} = await this.contract.getProjectInfo(this.investor.pid)
            if(success){
                this.project = data
            } else {
                console.log(error)
            }
        },

        async getInvestorInfo(isRefresh = false) {
            if(!isRefresh) {
                this.loading = true
            }
            try{
                const address = this.$asch.defaultAccount.address
                if(!address){
                   this.message('请登录后刷新页面', 'error')
                   this.loading = false
                   return
                }
                const { data, success, error } = await this.contract.getInvestorInfo(address, this.curHeightBlock.height)
                if(!success){
                    this.message(error, 'error')
                } else {
                    // let userInfo =  {...data}
                    // userInfo.address = address
                    this.investor = {
                        ...data,
                        address,
                    }
                }
                
            } catch(e){
                this.message(e.error, 'error')
            }
            this.loading = false
            
        },

        resolveHeightToTime(targetHeight) {
            const { height, timestamp } = this.curHeightBlock
            const _time = Math.floor(((targetHeight - height) / day_count) * one_day_seconds + timestamp * 1000  + time0)
            return formatTime(_time)
        },
        // calcTotalBonus() {
        //     const project = this.project
        //     return xasToPrecision(Math.floor((project.amount / project.totalShares) * this.investor.shares))
        // },
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