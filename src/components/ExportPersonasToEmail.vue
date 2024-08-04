<template>
  <v-btn
    class="mb-2 mx-4"
    color="primary"
    dark
    @click=exportToEmail
  >
    Export persone via email
  </v-btn>
</template>

<script>
import axios from '../services/axios';

export default {
  data: () => ({}),
    methods: {
      async exportToEmail() {
        try {
          const response = await axios.get('/api/export/personas');
          alert('Export inviato. Verificare.');
        } catch (error) {
          if (error.response.data.message) {
            console.log(error.response.data.message);
          }
          alert('Export fallito. Riprovare');
        }
      }
    }
}
</script>
