import { createRouter, createWebHistory } from 'vue-router/auto'
//Automatic routes for `./src/pages/*.vue`
import { routes } from 'vue-router/auto-routes'
import store from '../store/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

// Guardia globale per verificare utente loggato
router.beforeEach((to, from, next) => {
  const loggedIn = store.getters.isLoggedIn;

  if (to.path !== '/' && !loggedIn) {
    // Se la rotta richiede autenticazione (diversa da /) e l'utente non è autenticato,
    // reindirizza alla pagina di login
    next('/');
  } else if (to.path === '/' && loggedIn) {
    // Se l'utente è autenticato e sta cercando di accedere alla pagina di login,
    // reindirizza alla home
    next('/persone');
  } else {
    // Altrimenti, continua con la navigazione
    next();
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
