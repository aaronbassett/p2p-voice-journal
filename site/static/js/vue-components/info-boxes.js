Vue.component('info-peers', {
  props: ['peerCount'],
  computed: {
    status: function() {
      const statuses = {
        good: 'Vlt-box__data--good',
        average: 'Vlt-box__data--average',
        bad: 'Vlt-box__data--bad'
      }

      if(this.peerCount >= 50) {
        return statuses.good
      } else if(this.peerCount >= 10) {
        return statuses.average
      } else {
        return statuses.bad
      }
    }
  },
  template: `<div class="Vlt-box Vlt-box--data">
              <h3>Peers</h3>
              <div class="Vlt-box__data" v-bind:class="status">{{ peerCount }}</div>
              <small class="Vlt-box__data-desc">current peers in swarm</small>
            </div>`
})

Vue.component('info-version', {
  props: ['version'],
  template: `<div class="Vlt-box Vlt-box--data">
              <h3>Version</h3>
              <div class="Vlt-box__data">{{ version }}</div>
              <small class="Vlt-box__data-desc">current page version</small>
            </div>`
})

Vue.component('info-mtime', {
  props: ['mtime'],
  template: `<div class="Vlt-box Vlt-box--data">
              <h3>Updated</h3>
              <div class="Vlt-box__data">{{ mtime }}</div>
              <small class="Vlt-box__data-desc">last received update</small>
            </div>`
})

Vue.component('info-size', {
  props: ['archiveSize'],
  template: `<div class="Vlt-box Vlt-box--data">
              <h3>Size</h3>
              <div class="Vlt-box__data">{{ archiveSize }}</div>
              <small class="Vlt-box__data-desc">size-on-disk of archive</small>
            </div>`
})
