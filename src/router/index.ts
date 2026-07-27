import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import ReclamacionesView from '../views/ReclamacionesView.vue'
import CategoryView from '../views/CategoryView.vue'
import OffersView from '../views/OffersView.vue'
import WishlistView from '../views/WishlistView.vue'
import MisPedidosView from '../views/MisPedidosView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/product/:id',
      component: ProductView
    },
    {
      path: '/categoria/:slug',
      component: CategoryView
    },
    {
      path: '/ofertas',
      component: OffersView
    },
    {
      path: '/checkout',
      component: CheckoutView
    },
    {
      path: '/reclamaciones',
      component: ReclamacionesView
    },
    {
      path: '/favoritos',
      component: WishlistView
    },
    {
      path: '/mis-pedidos',
      component: MisPedidosView
    },
    {
      // Catch-all: cualquier ruta no definida cae aquí
      path: '/:pathMatch(.*)*',
      component: NotFoundView
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router