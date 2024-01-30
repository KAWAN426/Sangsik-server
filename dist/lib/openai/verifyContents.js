"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = tslib_1.__importDefault(require("."));
const verifyContents = async (title, detail) => {
    const test1 = await aiTest(title, detail);
    if ((test1 === null || test1 === void 0 ? void 0 : test1.toLowerCase()) === "true" || (test1 === null || test1 === void 0 ? void 0 : test1.toLowerCase()) === "참")
        return test1;
    const test2 = await aiTest(title, detail);
    return test2;
};
const aiTest = async (title, detail) => {
    const q = `title: ${title}, contents: ${detail}}`;
    const completion = await _1.default.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Please review the content. If it lacks specific information or knowledge, provide a one-sentence guide in Korean. If there are inaccuracies, write a brief explanation in Korean. Respond with 'true' in English if the content is suitable. ${q}`,
            },
        ],
        model: "gpt-4",
    });
    let result = completion.choices[0].message.content;
    if (!result)
        return;
    if (result.startsWith('"') && result.endsWith('"')) {
        result = result.substring(1, result.length - 1);
    }
    if (result.startsWith(`'`) && result.endsWith(`'`)) {
        result = result.substring(1, result.length - 1);
    }
    return result;
};
exports.default = verifyContents;
//# sourceMappingURL=verifyContents.js.map