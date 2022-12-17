const deepl = require('deepl-node');

module.exports = {
    detectors: new Map()
        .set("Bulgarien", "\u{1f1e7}\u{1f1ec}")
        .set("China", "\u{1f1e8}\u{1f1f3}")
        .set("D�nemark", "\u{1f1e9}\u{1f1f0}")
        .set("�sterreich", "\u{1f1e6}\u{1f1f9}")
        .set("Deutschland", "\u{1f1e9}\u{1f1ea}")
        .set("Frankreich", "\u{1f1eb}\u{1f1f7}"),

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
        const authKey = "e77845e9-4490-73c3-e7b5-7c9b827532a3:fx";
        const translator = new deepl.Translator(authKey);

        var language = 'de';
        switch (reaction.emoji.toString()) {
            case this.detectors.get("Bulgarien"):
                language = 'bg';
                break;
            case this.detectors.get("China"):
                language = 'zh'
                break;
            case this.detectors.get("D�nemark"):
                language = 'da';
                break;
            case this.detectors.get("�sterreich"):
            case this.detectors.get("Deutschland"):
                language = 'de';
                break;
            case this.detectors.get("Frankreich"):
                language = 'fr';
                break;
        }

        var content = reaction.message.content;
        console.log(`Translating ${content} to ${language}`);
        var res = "";
        (async () => {
            const result = await translator.translateText(content, null, language);
            await reaction.message.reply(result.text);
        })();
    }
};