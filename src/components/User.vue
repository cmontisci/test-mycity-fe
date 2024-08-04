<template>
  <span v-if="show" class="mx-3">{{ user?.email }}</span>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters(['isLoggedIn', 'getUser']),
    show() {
      return this.isLoggedIn;
    },
    user() {
      return this.getUser;
    },
  },
}
</script>
