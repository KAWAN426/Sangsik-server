"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUser = void 0;
const tslib_1 = require("tslib");
const User_1 = tslib_1.__importDefault(require("@/models/User"));
const getUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).send({
                data: user,
                message: "해당하는 사용자를 찾지 못했습니다.",
                status: "success",
            });
        res.status(200).send({
            data: user,
            message: "사용자의 정보를 성공적으로 불러왔습니다.",
            status: "success",
        });
    }
    catch (err) {
        res.status(500).send({
            data: null,
            message: "사용자의 정보를 불러오는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.getUser = getUser;
const createUser = async (req, res) => {
    const { id, name, email, picture } = req.body;
    const userData = {
        _id: id,
        name,
        email,
        picture,
        loginMethod: "google",
        externalId: id,
    };
    await User_1.default.findOneAndUpdate({ _id: id }, userData, {
        new: true,
        upsert: true,
    });
    res.status(200).send({
        data: null,
        status: "success",
        message: "새로운 사용자를 생성하는데 성공했습니다.",
    });
};
exports.createUser = createUser;
//# sourceMappingURL=userController.js.map