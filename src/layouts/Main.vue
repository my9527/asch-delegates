<template>
  <q-layout view="hhh Lpr fff">
    <q-header class="dark-bg" elevated>
      <q-toolbar class="q-pr-none">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu"></q-btn>
        <q-toolbar-title shrink>Asch Delegates</q-toolbar-title>

        <q-btn
          stretch
          flat
          no-caps
          v-for="item of navigations"
          v-bind:key="item.label"
          v-bind:label="item.label"
          v-bind:to="item.to"
          v-bind:class="item.label === currentPage ? 'active' : 'unactive'"
          @click="onNavBtnClicked(item)"
        />

        <q-space/>

        <q-btn-dropdown stretch flat v-bind:label="currentLang">
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
      <router-view/>
    </q-page-container>

    <div class="footer q-gutter-lg">
      <span>Copyright @2019</span>
      <a class="col" href="https://asch.io">Asch</a>
      <a class="col" href="https://asch.io">Github</a>
      <a class="col" href="https://asch.io">Mainnet</a>
      <a class="col" href="https://asch.io">Explorer</a>
      <a class="col" href="https://asch.io">Twitter</a>
      <a class="col" href="https://asch.io">Medium</a>
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
import { openURL, QBtnDropdown } from 'quasar'

export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      languages: [
        { lang: 'zh-cn', label: '简体中文', icon: 'map' },
        { lang: 'en-us', label: 'English', icon: 'directions' }
      ],
      currentLang: 'English',
      navigations: [
        { label: 'Vote', to: '/' },
        { label: 'Bonus', to: '/bonus' },
        { label: 'News', to: '/news' },
        { label: 'Register', to: '/register' },
        { label: 'Help', to: '/help' }
      ],
      currentPage: 'Vote'
    }
  },
  methods: {
    async init() {
      this.initAscPay()
    },
    openURL,
    onLanguageSelected(item) {
      console.log('onLanguageSelected', item)
      this.currentLang = item.label
    },
    onNavBtnClicked(item) {
      this.currentPage = item.label
    },
    initAscPay() {
      const interval = setInterval(() => {
        if (window.aschPay && window.aschPay.ready) {
          console.log('window.aschPay is ready')
          clearInterval(interval)
          this.$asch.setAschPay(window.aschPay)
        }
      }, 100)
    }
  },
  mounted() {
    console.log('====================Main mounted======================')
    this.init()
    const pathname = window.location.pathname
    if (pathname.length > 1) {
      const page = pathname.substr(1)
      this.currentPage = page[0].toUpperCase() + page.substr(1).toLowerCase()
    }
  }
}
</script>
