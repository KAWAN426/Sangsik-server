"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = tslib_1.__importDefault(require("."));
const verifyContents = async (title, detail) => {
    const q = `title: ${title}, contents: ${detail}}`;
    const completion = await _1.default.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Review the provided content and if there are any definitive inaccuracies, write a brief explanation about these errors. If the content is reasonably accurate, respond with 'true' only. ${q}`,
            },
        ],
        model: "gpt-4",
    });
    return completion.choices[0].message.content;
};
exports.default = verifyContents;
//# sourceMappingURL=verifyContents.js.map