import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  components,
  directives,
})

const globalEnvironment = {
  global: {
    plugins: [vuetify],
  },
}

export default globalEnvironment
