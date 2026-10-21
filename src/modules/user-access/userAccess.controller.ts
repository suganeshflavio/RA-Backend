import { Request, Response } from "express";
import { assignUserAccessSchema } from "./userAccess.validation";
import { assignUserAccessService, getUserAccessByUserIdService } from "./userAccess.service";

export const assignUserAccess = async (
    req: Request,
    res: Response
) => {

    try {

        const payload = assignUserAccessSchema.parse(req.body);

        await assignUserAccessService(
            payload.userId,
            payload.courses
        );

        return res.status(200).json({
            success: true,
            message: "User access updated successfully"
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


export const getUserAccessByUserId = async (
  req: Request,
  res: Response
) => {
  try {

    const { userId } = req.params;

    const data = await getUserAccessByUserIdService(userId as string);

    return res.json({
      success: true,
      data
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


export const updateUserAccess = async (
  req: Request,
  res: Response
) => {

  try {

    const { userId } = req.params;

    const payload = assignUserAccessSchema.parse({
      ...req.body,
      userId
    });

    await assignUserAccessService(
      payload.userId,
      payload.courses
    );

    return res.json({
      success: true,
      message: "User access updated successfully"
    });

  } catch (error:any) {

    return res.status(400).json({
      success:false,
      message:error.message
    });

  }

};