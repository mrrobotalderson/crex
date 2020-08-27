<template lang="pug">
  b-sidebar.pos.p10(sidebar-class="pos" width="200px" no-header bg-variant="white" visible)
    .flex-col
      .hoverable(@click="$router.push('/')")
        b-img(src="logo.png" fluid)
      .p15-top
      .flex-col(v-if="!admin")
        .p10-side.p5-ver
          router-link(to="/wallet") Wallet
        .p10-side.p5-ver
          router-link(to="/fund")  Fund
        .p10-side.p5-ver
          router-link(to="/referral")  Referral
</template>

<script>
export default {
  props: {
    admin: Boolean
  }
}
</script>