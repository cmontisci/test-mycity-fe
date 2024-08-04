<template>
    <v-btn
      v-if="show"
      icon="mdi-logout"
      @click=logoutApi
      class="mx-3"
    ></v-btn>
</template>

<script>
import axios from '../services/axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isLoggedIn']),
    show() {
      // Usa il getter isLoggedIn per determinare se mostrare il bottone
      return this.isLoggedIn;
    },
  },
  methods: {
    async logoutApi() {
      try {
        await axios.post('/api/auth/user/logout', {});
        await this.$store.dispatch("logout");
        this.$router.push('/');
      } catch (error) {
        if (error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('Logout fallito. Riprovare');
        }
      }
    },
  }
}
</script>
