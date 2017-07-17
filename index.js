const request = require('request');
const cheerio = require('cheerio');

request('https://itch.io/jam/gmtk-jam/entries', (error, response, html) => {
    if (error) {
        console.error(error);
        return;
    }
    const $ = cheerio.load(html);
    const grid = $('.browse_game_grid');
    const games = grid.children().map((index, item) => {
        const id = +(item.attribs['data-game_id']);
        const [link, , details] = item.children;
        const titleEl = details.children.filter(el => el.attribs['class'] === 'game_title')[0];
        const descriptionEl = details.children.filter(el => el.attribs['class'] === 'game_text')[0];
        const authorEl = details.children.filter(el => el.attribs['class'] === 'game_author')[0];
        const genreEl = details.children.filter(el => el.attribs['class'] === 'game_genre')[0];
        const platformEl = details.children.filter(el => el.attribs['class'] === 'game_platform')[0];
        const platforms = platformEl ? platformEl.children.filter(el => el.type === 'tag') : [];
        return {
            id,
            name: titleEl.children[0].children[0].nodeValue,
            description: descriptionEl && descriptionEl.children && descriptionEl.children.length ?
                descriptionEl.children[0].nodeValue :
                '',
            author: {
                url: authorEl.children[0].attribs['href'],
                name: authorEl.children[0].children[0].nodeValue
            },
            genre: genreEl && genreEl.children && genreEl.children.length ?
                genreEl.children[0].nodeValue :
                '',
            url: 'https://itch.io/jam/gmtk-jam/rate/' + id,
            realUrl: link.attribs['href'],
            platforms: platforms.map(platform => platform.attribs['class'].split(' ')[1])
        };
    }).toArray();
    console.log(games.length);
});