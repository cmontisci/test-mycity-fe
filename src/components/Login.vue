<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="600"
    >
      <div class="text-center py-4">
        <h1 class="text-h3 font-weight-bold">Login</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="email"
                  label="Email"
                  class="py-3"
                  required
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  class="py-3"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!valid" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import axios from '../services/axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      valid: false,
      rules: {
        required: value => !!value || 'Campo obbligatorio.',
        email: value => {
          const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
          return pattern.test(value) || 'E-mail non valida.';
        }
      }
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          let data = {
            email: this.email,
            password: this.password
          }
          const response = await axios.post('/api/auth/user/login', data);

          // Salva il token e recupera i dati utente
          await this.$store.dispatch("setToken", response.data.access_token);
          // Recupera i dati dell'utente solo dopo aver impostato il token
          await this.getUser()

          if(this.isLoggedIn) {
            this.$router.push('/persone');
          }
        } catch (error) {
          if(error?.response?.data?.message){
            alert(error.response.data.message);
          } else {
            alert('Accesso fallito');
          }
        }
      }
    },

    async getUser() {
      try {
        const response = await axios.get('/api/auth/user/profile');
        await this.$store.dispatch("setUser", response.data);
      } catch (error) {
        if(error?.response?.data?.message){
          console.log(error.response.data.message);
        }
      }
    }
  }
}
</script>
