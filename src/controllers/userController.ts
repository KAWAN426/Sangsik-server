import { getGoogleLoginInfo } from "@/lib/googleLogin";
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

export const loginUser = async (
  req: TypedRequest<{}, { token: string }>,
  res: TypedResponse
) => {
  const token = req.body.token;

  const googleInfo = await getGoogleLoginInfo(token);
  if (!googleInfo)
    return res.status(500).send({
      data: null,
      message: "구글 로그인 정보를 가져오고 토큰을 만드는데 실패했습니다.",
      status: "error",
    });
  const { payload, userToken } = googleInfo;
  const { sub, name, email, picture } = payload;

  const userData = {
    _id: sub,
    name,
    email,
    picture,
    loginMethod: "google",
    externalId: sub,
  };

  const result = await User.findOneAndUpdate({ _id: sub }, userData, {
    new: true,
    upsert: true,
  });

  if (!result || !userToken)
    return res.status(500).send({
      data: null,
      status: "error",
      message: "구글 로그인 정보를 가져오는데 실패했습니다.",
    });

  res.status(200).send({
    data: { userToken },
    status: "success",
    message: "구글 로그인용 토큰을 생성하는데 성공했습니다.",
  });
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
