import axios from 'axios'
import { CommandBase, CommandOptions } from 'eris'
import { Command } from '../../../structures/util'

export default class AddEmojiCommand extends Command {
  constructor() {
    super({
      name: 'addemoji',
      aliases: ['adicionaremoji'],
      permissions: [{
        entity: 'both',
        permissions: ['manageEmojisAndStickers']
      }],
      slash: new CommandBase()
        .setName('addemoji')
        .setDescription('Adds an emoji to your server')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('name')
            .setDescription('The name of the emoji')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('url')
            .setDescription('The URL of the image')
            .isRequired()
        )
    })
  }

  async run(ctx) {
    const name = ctx.args.get('name').value
    let source = ctx.args.get('url').value
    if (!name || !source) {
      return ctx.replyT('error', 'basic:missingArgs', {
        prefix: '/',
        commandName: this.name
      })
    }
    try {
      if (await ctx.getEmoji(source)) source = await ctx.getEmoji(source)?.url
      const buffer = await axios.get(source, { responseType: 'arraybuffer' }).then(d => Buffer.from(d.data, 'binary').toString('base64'))
      const image = `data:image/${url.substr(url.length - 3)};base64,${buffer}`

      const emoji = await ctx.message.guild.createEmoji({
        name,
        image
      })
      const getEmoji = await ctx.getEmoji(`<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`)
      ctx.send(`<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}> **|** ${ctx.message.author.mention}, ${ctx._locale('commands:addemoji.added')}`)
    } catch (err) {
      ctx.client.emit('error', (ctx.client, err))
      return ctx.replyT('error', 'commands:addemoji.error')
    }
  }
}
