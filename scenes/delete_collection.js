const { Markup, Scenes } = require('telegraf');
const { deleteCollection } = require('../collection_controller');



const sceneDeleteCollection = new Scenes.BaseScene('delete_collection');

sceneDeleteCollection.enter(async (ctx) => {
    await ctx.reply('Введіть ID колекції, яку хочете видалити:', Markup.inlineKeyboard([
        Markup.button.callback('Відміна', 'cancel_input')
    ]));
});

sceneDeleteCollection.action('cancel_input', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(`Відмінено`);
    return ctx.scene.leave();
});

sceneDeleteCollection.on('text', async (ctx) => {
    const id = ctx.message.text;

    const result = await deleteCollection(id);
    
    if(result) {
        await ctx.reply(`колекцію id:${id} видалено`)
        return ctx.scene.leave();
    } else {
        return await ctx.reply(`колекцію id:${id} не знайдено`);
    }
});


module.exports = sceneDeleteCollection;