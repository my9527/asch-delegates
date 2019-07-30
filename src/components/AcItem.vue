

<template>
    <div class="listItem" >
        <div class="item-title">
            #{{info.id}}
        </div>
        <div class="item-content">
            <div class="col">
                <div class="colItem">
                    <span class="colItem-label">开始时间</span>
                    <span class="colItem-val">{{startTime || '-'}}(高度: {{info.launchHeight || '-'}})</span>
                </div>
                <div class="colItem">
                    <span class="colItem-label">结束时间</span>
                    <span class="colItem-val">{{endTime || '-'}}(高度: {{info.endHeight || '-'}})</span>
                </div>
                <div class="colItem">
                    <span class="colItem-label">最小锁仓金额</span>
                    <span class="colItem-val">{{minLockAmount || '-'}}</span>
                </div>
                <div class="colItem">
                    <span class="colItem-label">总金额</span>
                    <span class="colItem-val">{{totalAmount || '-'}}</span>
                </div>
            </div>
            <div class="col">
                <div class="colItem">
                    <span class="colItem-label">提现频率</span>
                    <span class="colItem-val">{{withdrawFreq || '-'}}天</span>
                </div>
                <div class="colItem">
                    <span class="colItem-label">总份额</span>
                    <span class="colItem-val">{{info.totalShares || '-'}}</span>
                </div>
                <div class="colItem">
                    <span class="colItem-label">参与用户数</span>
                    <span class="colItem-val">{{info.totalInvestors || '-'}}</span>
                </div>
                <div class="colItem">
                    <span class="colItem-label">已领取总额</span>
                    <span class="colItem-val">{{totalWithdrawed || '-'}}</span>
                </div>
            </div>
        </div>
        <div v-if="canJoin" class="flex flex-center footer">
             <q-btn :loading="isLoading" @click="onClick(info)" class="submit-btn" color="secondary" label="报名" />
        </div>

        <div class="item-statu">
            <q-btn class="submit-btn" :style="acStatu.style" color="#f0f0f0" :label="acStatu.txt" />
        </div>
    </div>
</template>

<style scoped>
    .listItem{
        width: 100%;
        padding: 20px 44px;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 4px 16px 0 rgba(0,118,237,0.20);
        position: relative;
    }
    .item-statu{
        position: absolute;
        right: -6px;
        top: 6px;
    }
    .listItem + .listItem {
        margin-top: 20px; 
    }
    .item-title{
        color: purple;
        font-size: 20px;
    }
    .item-content{
        width: 100%;
        display: flex;
    }
    .col{
        /* width: 50%; */
        font-size: 18px;
        white-space: nowrap;
    }
    .colItem + .colItem{
        margin-top: 12px;
    }
    .colItem-label {
        color: #999999;
        margin-right: 30px;
        display: inline-block;
        width: 6em;
        white-space: nowrap;
    }
    .colItem-val{
        color: #4d4d4d;
    }
    .submit-btn{
        display: inline-flex;
        width: 140px;
        text-align: center;
        padding-top: 8px;
        padding-bottom: 8px;

    }
    .footer{
        margin-top: 30px;
    }
</style>

<script>
import { formatTime, xasToPrecision } from '../utils/index.js'
const day_count = 8640
const time0 = Date.UTC(2016, 5, 27, 20, 0, 0, 0)
const one_day_seconds = 1000 * 60 * 60 * 24

export default {
    name: 'ActivityItem',

    props: ['item', 'curHeightBlock', 'loadingItem'],

    data() {
        return {
            info: this.item,
            loading: false,

            // col1: [''],
            // col2: ['totalShares','totalInvestors','totalWithdrawed','withdrawInterval'],
        }
    },
    computed:{
        withdrawFreq() {
            return (this.info.withdrawInterval / day_count).toFixed(2)
        },
        startTime(){
            return this.resolveHeightToTime(this.info.launchHeight)
        },
        endTime(){
            return this.resolveHeightToTime(this.info.endHeight)
        },
        isLoading() {
            return this.loadingItem === this.item.id
        },
        totalAmount() {
            return xasToPrecision(this.info.amount)
        },
        totalWithdrawed() {
            return xasToPrecision(this.info.totalWithdrawed)
        },
        canJoin() {
            // const {  launchHeight } = this.info
            return this.info.launchHeight > this.curHeightBlock.height
        },
        minLockAmount() {
            return xasToPrecision(this.info.minLockAmount)
        },
        acStatu() {
            const statusMap = {
                pre: {
                    txt: '报名中',
                    style: 'background: #ebab29; color: white'
                },
                on: {
                    txt: '进行中',
                    style: 'background: #018001; color: white'
                },
                end: {
                    txt: '已到期',
                    style: 'background: #65a965; color: white'
                }
            }
            const { registerHeight, launchHeight, endHeight } = this.info
            const height = this.curHeightBlock.height
            let _st = 'pre'
            if( height >  launchHeight && height < endHeight) {
                _st = 'on'
            } else if( height > endHeight ){
                _st = 'end'
            }
            return statusMap[_st]
        }
    },
    methods: {
        onClick(activity) {
            this.$emit('clickActivity', activity)
        },
        resolveHeightToTime(targetHeight) {
            const { height, timestamp } = this.curHeightBlock
            const _time = Math.floor(((targetHeight - height) / day_count) * one_day_seconds + timestamp * 1000  + time0)
            // console.log(targetHeight, _time)
            return formatTime(_time)
        },
    }

}
</script>