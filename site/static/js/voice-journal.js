Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}

var vm = new Vue({
  el: '#voice-journal-app',
  data: {},
  asyncComputed: {
    recordings: {
      async get () {
        const archive = new DatArchive(window.location)
        let allRecordings = await archive.readdir('/recordings', {recursive: true, stat: true})
        return allRecordings.filter(recording => recording.name.split(".")[1] == "mp3").map(recording => {
          recording.stat['humanSize'] = filesize(recording.stat.size, {round: 2})
          recording.stat['modifiedTime'] = moment(recording.stat.mtime).startOf().fromNow()
          recording.stat['createdTime'] = moment(recording.stat.ctime).startOf().fromNow()
          recording.stat['missingBlocks'] = (recording.stat.blocks - recording.stat.downloaded != 0)
          recording.stat['color'] = [
            'Vlt-card__image--indigo',
            'Vlt-card__image--green',
            'Vlt-card__image--teal',
            'Vlt-card__image--purple',
            'Vlt-card__image--orange',
            'Vlt-card__image--blue',
            'Vlt-card__image--blue-light',
          ].random()
          return {
            name: recording.name,
            stat: recording.stat
          }
        })
      },
    },
    archiveHistory: {
      async get () {
        const archive = new DatArchive(window.location)
        const completeHistory = archive.history({start: 0, reverse: true})
        return completeHistory
      }
    },
    archiveInfo: {
      async get () {
        const archive = new DatArchive(window.location)
        const archiveInfo = await archive.getInfo()
        return archiveInfo
      },
      default: {
        peers: 0,
        version: 0,
        mtime: 0,
        size: 0
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
      return moment(timestamp).startOf().fromNow()
    },
    async filesize () {
      let size = await this.archiveInfo.size
      return filesize(size, {round: 2})
    }
  },
  updated: function () {
    Array.from(document.querySelectorAll('audio')).map(p => {
      new Plyr(p, {
        controls:['play', 'current-time', 'mute', 'volume', 'settings']
      })
    })
  }
})


Volta.init(['accordion'])
