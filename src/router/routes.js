const routes = [
  {
    path: '/',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'bonus', component: () => import('pages/Bonus.vue') },
      { path: 'news', component: () => import('pages/News.vue') },
      { path: 'register', component: () => import('pages/Register.vue') },
      // { path: 'council', component: () => import('pages/Council.vue') },
      { path: 'FAQ', component: () => import('pages/FAQ.vue') },
      { path: 'delegate/:id', component: () => import('pages/DelegateDetail.vue') },
      { path: 'activity', component: () => import('pages/Activity.vue') },
      { path: 'council', component: () => import('pages/NewCouncil.vue') },

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
