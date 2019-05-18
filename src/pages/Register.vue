<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step
          :name="1"
          title="Register account name"
          icon="settings"
          :done="step > 1"
          style="min-height: 250px;"
        >
          <div v-if="accountName">
            <span class="desc-text">Your have already an account name</span>
            <br>
            <q-btn v-bind:label="accountName "/>
          </div>
          <div v-else class="row">
            <q-input
              filled
              label="Input your name"
              style="width: 300px; margin-right: 20px;"
              v-model="inputAccountName"
            />
            <q-btn color="secondary" label="Submit" @click="setAccountName()"/>
          </div>
        </q-step>

        <q-step
          :name="2"
          title="Register delegate role"
          icon="create_new_folder"
          :done="step > 2"
          style="min-height: 250px;"
        >
          <div v-if="isDelegate">
            <span class="desc-text">You are already a delegate</span>
          </div>
          <div v-else>
            <span class="desc-text">You must register delegate role before you become a super node</span>
            <br>
            <q-btn color="secondary" label="Register delegate" @click="registerDelegate()"/>
          </div>
        </q-step>

        <q-step
          :name="3"
          title="Register team profile"
          icon="assignment"
          style="min-height: 250px;"
        >
          <div v-if="!profile" class="column q-gutter-sm" style="max-width: 600px;">
            <q-input filled label="Input organization name" v-model="inputOrgName"/>
            <q-input filled label="Input icon URL" v-model="inputIcon"/>
            <q-input filled label="Input banner URL" v-model="inputBanner"/>
            <q-input filled label="Input web site" v-model="inputWebsite"/>
            <q-input filled label="Input introduction" type="textarea" v-model="inputIntro"/>
            <q-btn
              label="Submit"
              color="secondary"
              style="max-width: 100px;"
              @click="registerProfile()"
            />
          </div>
          <div v-else>
            <div class="desc-text">Your team profile have already been set</div>
            <br>
            <q-markup-table separator="vertical" wrap-cells="false" flat>
              <tr>
                <td class="attr-key">Team Name</td>
                <td class="attr-value">{{ profile.name }}</td>
              </tr>
              <tr>
                <td class="attr-key">Team Icon</td>
                <td class="attr-value">{{ profile.icon }}</td>
              </tr>
              <tr>
                <td class="attr-key">Team Banner</td>
                <td class="attr-value">{{ profile.banner }}</td>
              </tr>
              <tr>
                <td class="attr-key">Team Website</td>
                <td class="attr-value">{{ profile.website }}</td>
              </tr>
              <tr>
                <td class="attr-key">Team Intro</td>
                <td class="attr-value">{{ profile.intro }}</td>
              </tr>
            </q-markup-table>
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn v-if="step < 3" @click="$refs.stepper.next()" color="primary" label="Next"/>
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </q-page>
</template>

<style scoped>
.desc-text {
  color: grey;
  font-size: 18px;
}

.attr-key {
  text-align: right;
  padding-right: 10px;
  color: grey;
  width: 120px;
}

.attr-value {
  padding-left: 10px;
}
</style>

<script>
import { log } from '../utils'

export default {
  name: 'PageRegister',
  data() {
    return {
      step: 1,
      profile: null,
      isDelegate: false,
      accountName: '',
      inputAccountName: '',
      inputOrgName: '',
      inputIcon: '',
      inputBanner: '',
      inputWebsite: '',
      inputIntro: ''
    }
  },
  methods: {
    setAccountName() {
      log('setAccountName', this.inputAccountName)
      this.$asch
        .setAccountName(this.inputAccountName)
        .then(result => {
          log('setAccountName result', result)
        })
        .catch(e => {
          log('failed to setAccountName', e)
        })
    },
    registerDelegate() {
      this.$asch
        .registerDelegate()
        .then(result => {
          log('registerDelegate result', result)
        })
        .catch(e => {
          log('failed to registerDelegate', e)
        })
    },
    registerProfile() {
      const profile = {
        name: this.inputOrgName,
        icon: this.inputIcon,
        banner: this.inputBanner,
        website: this.inputWebsite,
        intro: this.inputIntro
      }
      this.$asch.contract
        .registerProfile(profile)
        .then(result => {
          log('registerProfile result', result)
        })
        .catch(e => {
          log('failed to registerProfile', e)
        })
    },
    getAccountInfo() {
      const address = this.$asch.defaultAccount.address
      this.$api
        .getAccount(address)
        .then(result => {
          log('getAccount result', result)
          if (!result.account) {
            alert('AschPay not ready!')
            return
          }
          const account = result.account
          if (account.name) {
            this.accountName = account.name
          }
          this.isDelegate = account.isDelegate
          this.getTeamProfile()
        })
        .catch(e => {
          console.error('failed to get account', e)
        })
    },
    getTeamProfile() {
      if (this.accountName) {
        this.$asch.contract
          .getProfile(this.accountName)
          .then(result => {
            log('getTeamProfile result', result)
            this.profile = result.data
          })
          .catch(e => {
            console.error('failed to get team profile', e)
          })
      }
    }
  },
  mounted() {
    log('==================RegisterDelegate=================')
    this.getAccountInfo()
  }
}
</script>
