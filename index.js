const { Telegraf, Markup, Scenes, session } = require('telegraf');
const { getAllCollections } = require('./collection_controller');
require('dotenv').config();

const sceneDeleteCollection = require('./scenes/delete_collection');
const sceneAddCollection = require('./scenes/add_collection');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session())
const stage = new Scenes.Stage([sceneDeleteCollection, sceneAddCollection]);
bot.use(stage.middleware())

//ВСТУПНА ІНФА
bot.start((ctx) => {
    ctx.replyWithPhoto({ source: 'src/1.JPG' },
        {
            caption: `💸Криптовалюта (сокращенно «крипта») — это форма виртуальной валюты, позволяющая осуществлять безопасные транзакции с помощью криптографических средств. 
💸В отличие от фиатных валют, таких как доллар США или евро, нет централизованного органа, который поддерживает или влияет на стоимость криптовалюты.

💸Большая часть крипты поддерживается через блокчейн, который действует как общедоступный журнал, распределенный по большому количеству компьютеров,
в котором записываются транзакции, контролируется создание новых монет и проверяется право собственности`,
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard([
                Markup.button.callback("Что такое NFT?", "more"),
            ]),
        });
});

bot.action("more", (ctx, next) => {
    ctx.replyWithPhoto({ source: 'src/2.JPG' },
        {
            caption: `💸NFT — это невзаимозаменяемый токен, аббревиатура аналогичной по смыслу англоязычной формулировки — non-fungible token 
💸Если 1 BTC или ETH равен определенному эквиваленту в той же криптовалюте или может дробиться на меньшие части, то каждый NFT эквивалентен только самому себе. При этом он может иметь цену, которую определяет рынок, но об этом позже
💸NFT — это цифровой сертификат, подтверждающий факт владения конкретным цифровым активом. 

💸Сам токен не содержит произведение искусства, а только ссылку на него и смарт-контракт, определяющий права владельца и возможности управления активом.
💸В блокчейн-сети можно найти информацию обо всех владельцах вплоть до текущего.
💸Изначально NFT задумывался как техническое средство для контроля авторами собственных произведений в глобальной сети, однако на практике ситуация сложилась иначе`,
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard([
                Markup.button.callback("Где купить NFT?", "more2"),
            ]),
        });
});

bot.action("more2", (ctx, next) => {
    ctx.replyWithPhoto({ source: 'src/3.JPG' },
        {
            caption: `💸Opensea это один из крупнейших цифровых рынков уникальных токенов. Опенсиа начала свою деятельность в 2017 при поддержке венчурного фонда Андре Горовица. Платформа располагает обширной библиотекой контента по всем направлениям.

💸Здесь представлено большинство доступных видов NFT начиная от цифрового искусства и заканчивая 3D-предметами коллекционирования и предметами, используемыми в видеоиграх. OpenSea полностью открыта для новичков, что облегчает начало работы.`,
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard([
                Markup.button.callback("Купить NFT", "buy"),
            ]),
        });
});

//ПОКУПКА НФТ
bot.action("buy", async (ctx) => {
    await ctx.reply(`💸Доступные для покупки коллекции :`);

    (await getAllCollections()).forEach((element) => {
        ctx.reply(`💸Ссылка на коллекцию - ${element.link}\n💸Цена : ${element.price}$`, Markup.inlineKeyboard([
            Markup.button.callback("Купить!", `buy_nft ${element.id}`),
        ]))
    })
});

bot.action(/buy_nft/, (ctx, next) => {
    const id = ctx.match.input.split(' ')[1];
    //через id можно вытянуть цену из коллекции

    return ctx.replyWithMarkdownV2(`💸Оплата происходит не через сайт, а напрямую на наш криптокошелек, таким образом вы :
\\- получаете NFT по заниженой цене
\\- не теряете деньги на комиссию
\\- экономите время
💸После оплаты, пожалуйста отправьте хэш транзакции и скриншот менеджеру : @manager
💸Кошелек для перевода *USDT в сети TRC20* : \`TR7NHqjeKQxGTCi8000000000000000\` `, {
        ...Markup.inlineKeyboard([
            Markup.button.callback('Я оплатил', 'paid'),
        ])
    })
})

bot.action("paid", (ctx, next) => {
    return ctx.reply('💸Спасибо за покупку! Не забудьте связаться с менеджером и ожидайте 15-30 минут', {
    })
})

//АДМІНКА (ДОБАВЛЯТИ НФТ)
bot.command('admin', async (ctx) => {
    //if(!process.env.ADMINS.includes(ctx.chat.id)) return;

    await ctx.reply('у розробці : добавити/видалити NFT', {
        ...Markup.inlineKeyboard([
            Markup.button.callback('Переглянути всі колекції', 'collection_list'),
            Markup.button.callback('Додати колекцію', 'add_collection'),
            Markup.button.callback('Видалити колекцію', 'collection_delete'),
        ])
    })
});

bot.action('collection_delete', (ctx, next) => {
    //if(!process.env.ADMINS.includes(ctx.chat.id)) return;
    return ctx.scene.enter('delete_collection');
});

bot.action('add_collection', (ctx, next) => {
    //if(!process.env.ADMINS.includes(ctx.chat.id)) return;
    return ctx.scene.enter('add_collection');
});

bot.action('collection_list', async (ctx, next) => {
    //if(!process.env.ADMINS.includes(ctx.chat.id)) return;
    const collections = await getAllCollections();

    return ctx.replyWithHTML(`${collections.map(item => `id:${item.id} | price:${item.price} | link:${item.link}`).join('\n')}`, { 
        disable_web_page_preview: true 
    })
});

//ЗАПУСК
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 