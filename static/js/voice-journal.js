
var vm = new Vue({
  el: '#voice-journal-app',
  data: {},
  asyncComputed: {
    archiveInfo: {
      async get () {
        const archive = new DatArchive(window.location)
        const archiveInfo = await archive.getInfo()
        return archiveInfo
      },
      default: {
        peers: 0
      }
    },
    async peers () {
      return await this.archiveInfo.peers
    },
    async version () {
      return await this.archiveInfo.version
    },
    async mtime () {
      let timestamp = await this.archiveInfo.mtime
      return moment().startOf(timestamp).fromNow()
    },
    async filesize () {
      let size = await this.archiveInfo.size
      return filesize(size, {round: 2})
    }
  }
})
