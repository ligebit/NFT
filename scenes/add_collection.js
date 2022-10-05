const { Markup, Scenes } = require('telegraf');
const { deleteCollection, addCollections } = require('../collection_controller');



const sceneAddCollection = new Scenes.BaseScene('add_collection');

sceneAddCollection.enter(async (ctx) => {
    await ctx.reply('Введіть ID колекції, ціну та посилання через пробіли, наприклад: \n3 125 посилання ', Markup.inlineKeyboard([
        Markup.button.callback('Відміна', 'cancel_input')
    ]));
});

sceneAddCollection.action('cancel_input', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(`Відмінено`);
    return ctx.scene.leave();
});

sceneAddCollection.on('text', async (ctx) => {
    const text = ctx.message.text;

    const array = text.split(' ');

    if(array.length != 3) return ctx.reply(`Невірний ввід`);

    const result = await addCollections({
        id: array[0],
        price: array[1],
        link: array[2]
    });
    
    if(result) {
        await ctx.reply(`Колекцію id:${array[0]} додано`)
        return ctx.scene.leave();
    } else {
        return await ctx.reply(`Помилка додавання колекції id:${array[0]}. Id має бути унікальним`);
    }
});


module.exports = sceneAddCollection;