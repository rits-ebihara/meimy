"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const lang_en_1 = require("./lang/lang_en");
const lang_ja_1 = require("./lang/lang_ja");
exports.langProfile = _1.Localization.create({
    en: lang_en_1.enResource,
    ja: lang_ja_1.jaResource,
    zh: lang_ja_1.jaResource,
});
