


export default defineNuxtPlugin((nuxtApp) => {
  
  //const { cart } = useCart()

  nuxtApp.$router.afterEach((to: any) => {
    console.log(to.fullPath)   
    if(to.fullPath == '/checkout') {
      console.log('begin checkout')
      //console.log(cart)
    }
  })
})
