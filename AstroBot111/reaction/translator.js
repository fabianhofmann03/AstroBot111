const deepl = require('deepl-node');
const { deepl_token } = require('../config.json');

module.exports = {
    detectors: new Map()
        .set("Bulgarien", "\u{1f1e7}\u{1f1ec}")
        .set("China", "\u{1f1e8}\u{1f1f3}")
        .set("Dänemark", "\u{1f1e9}\u{1f1f0}")
        .set("Österreich", "\u{1f1e6}\u{1f1f9}")
        .set("Deutschland", "\u{1f1e9}\u{1f1ea}")
        .set("Großbritannien", "\u{1f1ec}\u{1f1e7}")
        .set("England", "\u{1f3f4}\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}")
        .set("USA", "\u{1f1fa}\u{1f1f8}")
        .set("Estland", "\u{1f1ea}\u{1f1ea}")
        .set("Finnland", "\u{1f1eb}\u{1f1ee}")
        .set("Frankreich", "\u{1f1eb}\u{1f1f7}")
        .set("Griechenland", "\u{1f1ec}\u{1f1f7}"),

    async isValid(sign) {
        var isRight = false;
        this.detectors.forEach(test_sign => {
            if (test_sign == sign) {
                isRight = true;
            }
        });
        return isRight;
    },

    async execute(reaction) {
        const translator = new deepl.Translator(deepl_token);

        var language = 'de';
        switch (reaction.emoji.toString()) {
            case this.detectors.get("Bulgarien"):
                language = 'bg';
                break;
            case this.detectors.get("China"):
                language = 'zh'
                break;
            case this.detectors.get("Dänemark"):
                language = 'da';
                break;
            case this.detectors.get("Österreich"):
            case this.detectors.get("Deutschland"):
                language = 'de';
                break;
            case this.detectors.get("USA"):
                language = 'en-US';
                break;
            case this.detectors.get("England"):
            case this.detectors.get("Großbritannien"):
                language = 'en-GB';
                break;
            case this.detectors.get("Estland"):
                language = 'et';
                break;
            case this.detectors.get("Finnland"):
                language = 'fi';
                break;
            case this.detectors.get("Frankreich"):
                language = 'fr';
                break;
            case this.detectors.get("Griechenland"):
                language = 'el';
                break;
        }

        var content = reaction.message.content;
        console.log(`Translating "${content}" to ${language}`);
        var res = "";
        (async () => {
            const result = await translator.translateText(content, null, language);
            await console.log(`Translation: "${result.text}"`);
            await reaction.message.reply(result.text);
        })();
    }
};