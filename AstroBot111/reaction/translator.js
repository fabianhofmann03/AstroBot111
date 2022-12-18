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
        .set("Griechenland", "\u{1f1ec}\u{1f1f7}")
        .set("Indonesien", "\u{1f1ee}\u{1f1e9}")
        .set("Italien", "\u{1f1ee}\u{1f1f9}")
        .set("Japan", "\u{1f1ef}\u{1f1f5}")
        .set("Lettland", "\u{1f1f1}\u{1f1fb}")
        .set("Litauen", "\u{1f1f1}\u{1f1f9}")
        .set("Niederlande", "\u{1f1f3}\u{1f1f1}")
        .set("Polen", "\u{1f1f5}\u{1f1f1}")
        .set("Portugal", "\u{1f1f5}\u{1f1f9}")
        .set("Rumänien", "\u{1f1f7}\u{1f1f4}")
        .set("Russland", "\u{1f1f7}\u{1f1fa}")
        .set("Schweden", "\u{1f1f8}\u{1f1ea}")
        .set("Slowakei", "\u{1f1f8}\u{1f1f0}")
        .set("Slowenien", "\u{1f1f8}\u{1f1ee}")
        .set("Spanien", "\u{1f1ea}\u{1f1f8}")
        .set("Tschechien", "\u{1f1e8}\u{1f1ff}")
        .set("Truthahn", "\u{1f983}")
        .set("Türkei", "\u{1f1f9}\u{1f1f7}")
        .set("Ukraine", "\u{1f1fa}\u{1f1e6}")
        .set("Ungarn", "\u{1f1ed}\u{1f1fa}"),

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
            case this.detectors.get("Indonesien"):
                language = 'id';
                break;
            case this.detectors.get("Italien"):
                language = 'it';
                break;
            case this.detectors.get("Japan"):
                language = 'ja';
                break;
            case this.detectors.get("Lettland"):
                language = 'lv';
                break;
            case this.detectors.get("Litauen"):
                language = 'lt';
                break;
            case this.detectors.get("Niederlande"):
                language = 'nl';
                break;
            case this.detectors.get("Polen"):
                language = 'pl';
                break;
            case this.detectors.get("Portugal"):
                language = 'pt';
                break;
            case this.detectors.get("Rumänien"):
                language = 'ro';
                break;
            case this.detectors.get("Russland"):
                language = 'ru';
                break;
            case this.detectors.get("Schweden"):
                language = 'sv';
                break;
            case this.detectors.get("Slowakei"):
                language = 'sk';
                break;
            case this.detectors.get("Slowenien"):
                language = 'sl';
                break;
            case this.detectors.get("Spanien"):
                language = 'es';
                break;
            case this.detectors.get("Tschechien"):
                language = 'cs';
                break;
            case this.detectors.get("Truthahn"):
            case this.detectors.get("Türkei"):
                language = 'tr';
                break;
            case this.detectors.get("Ukraine"):
                language = 'uk';
                break;
            case this.detectors.get("Ungarn"):
                language = 'hu';
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