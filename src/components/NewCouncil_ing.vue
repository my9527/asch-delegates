<template>
    <div class="page-ing">
        <div class="p-header">理事会选举</div>
        <div class="page-sub">
            <div class="page-sub-timerange">
                <div>本次选举开始时间: {{startTime}} (区块高度{{this.councilInfo.sessionBegin}})</div>
                <div>本次选举结束时间: {{endTime}} (区块高度{{this.endHeight}}) </div>
            </div>
            <q-btn :disable="dis" color="primary" class="re" @click="showApplyModal">
                申请成为候选人
            </q-btn>
        </div>
       <q-table
        :data="members"
        :columns="columns"
        row-key="address"
        selection="multiple"
        :selected.sync="selected"
        hide-bottom
       >
       <template v-slot:body-cell-selection="props">
        <q-th :props="props">
          操作
        </q-th>
      </template>
      <template v-slot:bottom>
        
      </template>
       </q-table>
       <div class="text-center btn-wrap">
           <q-btn :disable="dis" color="primary " class="voteBtn full-width" @click="vote" label="投票" />
       </div>
        
    </div>
</template>


<script>
import { formatTime, getUnsignedTrx } from '../utils/index'
import ApplyModalVue from './ApplyModal.vue'
import { async } from 'q'



export default {

     props: ['councilInfo', 'members', 'dis'],
    data() {
        return {
            topSelection: null,
            curHeightBlock: {},
            selected: [],
            pagination:null,
            columns: [
                {
                name: 'seniority',
                required: true,
                label: '排名',
                align: 'left',
                field: row => row.name,
                
                },
                { name: 'name', align: 'center', label: '名称', field: 'name', sortable: true },
                { name: 'addr', label: '地址', field: 'address', sortable: true },
                { name: 'votes', label: '得票数', field: 'votes' },
                // { name: 'operation', label: 'P操作', field: '操作' },
            ],
            // data: [{
            //     name: 'Frozen Yogurt',
            //     calories: 159,
            //     fat: 6.0,
            //     carbs: 24,
            //     protein: 4.0,
            //     sodium: 87,
            //     calcium: '14%',
            //     iron: '1%'
            // }]
        }
    },

    computed: {
        startTime() {
            return this.resolveHeightToTime(this.councilInfo.sessionBegin)
        },
        endTime() {
            const { sessionBegin, electionDuration } = this.councilInfo
            return this.resolveHeightToTime(this.endHeight)
        },
        endHeight() {
            const { sessionBegin, electionDuration } = this.councilInfo
            return sessionBegin +  electionDuration - 1
        }
    },

    methods: {
        async init() {

        },

        pLabelrender() {
            return ''
        },
        
        resolveHeightToTime(targetHeight) {
            const { currentHeight } = this.councilInfo
            // const _time = Math.floor(((targetHeight - height) / day_count) * one_day_seconds + timestamp * 1000  + time0)
            const _time = Math.floor((targetHeight - currentHeight) * 10) * 1000 + Date.now()
            return formatTime(_time)
        },

        getSelectedString() {
            return 'as'
        },

        showApplyModal() {
            this.$q.dialog({
                component: ApplyModalVue,
                parent: this, // becomes child of this Vue node
                text: 'something',
                // ...more.props...
                }).onOk( async (website) => {
                   const { success, error } = await this.$asch.signedForCouncil({
                        type: 700,
                        fee: 100000000000,
                        args: [website],
                    })
                    if(success) {
                        this.message('申请成功')
                    } else {
                        this.message(error || '申请失败', 'error')
                    }
                    this.$emit('refreshMemer')
                }).onCancel(() => {
                console.log('Cancel')
                }).onDismiss(() => {
                console.log('Called on OK or Cancel')
                })
        },
        vote() {
            this.$q.dialog({
                title: '确认',
                message: '您将为领事会成员投票，本操作将消耗1XAS，一旦提交，无法撤销',
                cancel: true,
                persistent: true,
                ok: {
                    text: '确认'
                },
                cancel: {
                    text: '取消',
                    flat: true,
                }
            }).onOk(async () => {
                const _selec = this.selected.map(v => v.name).join(',')

                const { success, error } = await this.$asch.signedForCouncil({
                        type: 701,
                        fee: 100000000000,
                        args: [_selec],
                    })
                    if(success) {
                        this.message('投票成功')
                    } else {
                        this.message(error || '投票失败', 'error')
                    }
                    this.$emit('refreshMemer')
                // console.log(this.selected)
                // console.log('>>>> OK')
            }).onOk(() => {
                // console.log('>>>> second OK catcher')
            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
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
.p-header{
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 8px;
    margin-top: 32px;
}
.page-sub{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    text-indent: 2em;
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
.re{
    cursor: pointer;
}
</style>