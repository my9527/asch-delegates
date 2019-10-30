<template>
  <q-layout view="hhh Lpr fff">
    <q-header class="dark-bg" elevated>
      <q-toolbar class="q-pr-none">
        <q-avatar>
          <img src="/statics/favicon.ico">
        </q-avatar>
        <q-toolbar-title shrink>Asch</q-toolbar-title>

        <q-btn
          stretch
          flat
          no-caps
          v-for="item of navigations"
          v-bind:key="item.label"
          v-bind:label="$t(item.label)"
          v-bind:to="item.to"
          v-bind:class="item.label === currentPage ? 'active' : 'unactive'"
          @click="onNavBtnClicked(item)"
        />

        <q-space/>
        <a style="color: white" target="blank" href="http://www.asch.io:3000/faucet/index.html">{{$t('Faucet')}}</a>

        <q-btn-dropdown stretch flat v-bind:label="langLabel">
          <q-list>
            <q-item
              v-for="item of languages"
              v-bind:key="item.lang"
              @click="onLanguageSelected(item)"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{item.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div v-if="!aschPayInstalled" style="width: 100%; text-align: center">
        <a
          target="blank"
          href="https://chrome.google.com/webstore/detail/aschpay/eibepfonpdkkelekmahbbhcfkeijlpop"
        >Clear here to install AschPay wallet</a>
      </div>

      <router-view/>
    </q-page-container>

    <div class="footer q-gutter-lg">
      <span>Copyright @2019</span>
      <a class="col" href="https://asch.io">Asch</a>
      <a class="col" href="https://github.com/AschPlatform">Github</a>
      <a class="col" href="https://mainnet.asch.io">Mainnet</a>
      <a class="col" href="https://explorer.asch.io">Explorer</a>
      <a class="col" href="https://twitter.com">Twitter</a>
      <a class="col" href="https://medium.com">Medium</a>
    </div>
  </q-layout>
</template>

<style scoped>
.active {
  color: white;
  font-weight: bold;
}

.unactive {
  color: grey;
}

.footer {
  width: 70%;
  height: 60px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  color: lightgray;
  font-size: 16px;
  text-align: center;
}

.footer a {
  text-decoration: none;
  color: lightgray;
}

.footer a:hover {
  color: #027be3;
}
</style>

<script>
import { QBtnDropdown } from 'quasar'
import { log } from '../utils'

export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      languages: [
        { lang: 'zh', label: '简体中文' },
        { lang: 'en', label: 'English' }
      ],
      lang: 'zh',
      navigations: [
        { label: 'Vote', to: '/' },
        { label: 'Register', to: '/register' },
        // { label: 'Bonus', to: '/bonus' },
        // { label: 'News', to: '/news' },
        { label: '分红', to: '/activity'},
        { label: '理事会', to: '/council'},
        { label: 'FAQ', to: '/FAQ' },

      ],
      currentPage: 'Vote',
      aschPayInstalled: true
    }
  },
  computed: {
    langLabel() {
      for (const item of this.languages) {
        if (item.lang === this.lang) {
          return item.label
        }
      }
      return 'English'
    }
  },
  methods: {
    async init() {
      let initLang = this.$q.localStorage.getItem('lang')
      if (!initLang && navigator.language) {
        initLang = navigator.language.split('-')[0].toLowerCase()
      }
      if (!initLang) {
        initLang = 'en'
      }
      this.setLanguage(initLang)
      this.initAscPay()
    },
    setLanguage(lang) {
      log('==================setLanguage', lang)
      this.$i18n.locale = this.lang = lang
      this.$q.localStorage.set('lang', lang)
    },
    onLanguageSelected(item) {
      log('onLanguageSelected', item.lang)
      this.setLanguage(item.lang)
    },
    onNavBtnClicked(item) {
      this.currentPage = item.label
    },
    initAscPay() {
      const checkAschPay = () => {
        if (!window.aschPay) {
          return
        }
        if (!window.aschPay.ready) {
          return
        }
        log('window.aschPay is ready')
        clearInterval(interval)
        this.$asch.setAschPay(window.aschPay)
      }
      checkAschPay()
      const interval = setInterval(checkAschPay, 100)

      setTimeout(() => {
        if (!window.aschPay) {
          this.aschPayInstalled = false
        }
      }, 2000)
    }
  },
  mounted() {
    log('====================Main mounted======================', this.$i18n)
    this.init()
    const pathname = window.location.pathname
    if (pathname.length > 1) {
      const page = pathname.substr(1)
      this.currentPage = page[0].toUpperCase() + page.substr(1).toLowerCase()
    }
  }
}
</script>
