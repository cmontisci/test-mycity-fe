<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar :elevation="2">
<!--      <template v-slot:prepend>-->
<!--        <v-app-bar-nav-icon></v-app-bar-nav-icon>-->
<!--      </template>-->

      <v-app-bar-title>My City - Test</v-app-bar-title>
      <template v-slot:append>
        <User />
        <Logout />
      </template>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup>
  import User from "@/components/User.vue";
  import Logout from "@/components/Logout.vue";
</script>
