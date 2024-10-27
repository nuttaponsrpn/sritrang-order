export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', (el, _binding) => {
    const elem = el as HTMLElement
    elem.scrollIntoView()
  })
})
