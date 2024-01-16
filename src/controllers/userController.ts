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
  req: TypedRequest<{}, {}>,
  res: TypedResponse
) => {
  const userData = {
    _id: "65a574fcf98fb95d7bfafd86",
    name: "Kawan0426",
    email: "cwstbp0426@gmail.com",
    picture:
      "https://yt3.ggpht.com/yti/AGOGRCoQygByYr5MvP4_coveyCKZUmjDWgF6XFuWfyDrqA=s88-c-k-c0x00ffffff-no-rj",
    loginMethod: "google",
    externalId: "65a574fcf98fb95d7bfafd86",
  };

  const result = await User.findOneAndUpdate(
    { _id: "65a574fcf98fb95d7bfafd86" },
    userData,
    {
      new: true,
      upsert: true,
      includeResultMetadata: true,
    }
  );

  res.status(200).send({
    data: result,
    status: "success",
    message: "구글 로그인용 토큰을 생성하는데 성공했습니다.",
  });
};
