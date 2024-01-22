"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateId(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
async function generateUID(Model, length = 10) {
    while (true) {
        const uniqueId = generateId(length);
        const existingUser = await Model.findOne({ uniqueId });
        if (!existingUser)
            return uniqueId;
    }
}
exports.default = generateUID;
//# sourceMappingURL=uniqueIdGenerator.js.map