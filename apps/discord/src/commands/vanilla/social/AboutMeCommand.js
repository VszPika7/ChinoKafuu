import { Command } from '../../../structures/util'

export default class AboutMeCommand extends Command {
  constructor() {
    super({
      name: 'aboutme',
      aliases: ['bio', 'sobremim']
    })
  }

  async run(ctx) {
    if (ctx.args.join(' ').length > 128) return ctx.replyT('error', 'commands:aboutme.bioLimit')
    const bio = ctx.args.join(' ').replace(/[`]/g, '')
    ctx.db.user.aboutme = bio
    ctx.db.user.save()
    await ctx.replyT('success', 'commands:aboutme.success', { bio: bio })
  }
}
