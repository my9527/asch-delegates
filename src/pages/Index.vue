<template>
  <PageDelegates/>
</template>

<style scoped>

</style>

<script>
export default {
  components: {
    PageDelegates: () => import('./Delegates')
  },
  name: 'PageIndex'
}
</script>
