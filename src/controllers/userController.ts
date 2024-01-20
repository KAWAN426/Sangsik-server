import User from "@/models/User";
import { TypedRequest, TypedResponse } from "@/types/express";

export const getUser = async (req: TypedRequest, res: TypedResponse) => {
  try {
    const user = await User.findById(req.params.id);
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
  } catch (err) {
    res.status(500).send({
      data: null,
      message: "사용자의 정보를 불러오는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const createUser = async (
  req: TypedRequest<
    {},
    { id: string; name: string; email: string; picture: string }
  >,
  res: TypedResponse
) => {
  const { id, name, email, picture } = req.body;
  const userData = {
    _id: id,
    name,
    email,
    picture,
    loginMethod: "google",
    externalId: id,
  };

  await User.findOneAndUpdate({ _id: id }, userData, {
    new: true,
    upsert: true,
  });

  res.status(200).send({
    data: null,
    status: "success",
    message: "새로운 사용자를 생성하는데 성공했습니다.",
  });
};
