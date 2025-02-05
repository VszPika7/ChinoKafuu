import { Listener } from '../../structures/events/Listener'

export default class VoiceChannelLeaveListener extends Listener {
  constructor() {
    super()
    this.event = 'voiceChannelSwitch'
  }

  async on(client, member, newChannel, oldChannel) {
    const guild = member.guild
    const voiceChannel = client.guilds.get(guild.id).channels.get(newChannel.id)
    const server = await client.database.guilds.getOrCreate(guild.id)
    const guildBot = client.guilds.get(guild.id).members.get(client.user.id)
    if (server.animu && voiceChannel.id === server.animuChannel) {
      if (client.player.has(guild.id)) return
      const song = await client.lavalink.join(voiceChannel.id)
      song.playAnimu()
      client.player.set(guild.id, song)
    }

    if (newChannel.id !== guildBot.voiceState.channelID) return
    if (newChannel.voiceMembers.filter(member => member.user.bot === false).length === 0) {
      await client.lavalink.manager.leave(guild.id)
      client.lavalink.manager.players.delete(guild.id)
      client.player.delete(guild.id)
      return
    }

    if (oldChannel.id !== guildBot.voiceState.channelID) return
    if (oldChannel.voiceMembers.filter(member => member.user.bot === false).length === 0) {
      await client.lavalink.manager.leave(guild.id)
      client.lavalink.manager.players.delete(guild.id)
      client.player.delete(guild.id)
      return
    }
  }
}
