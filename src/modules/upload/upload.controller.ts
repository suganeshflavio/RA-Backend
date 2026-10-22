import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/errors/AppError";
import { uploadFileToB2, getB2SignedUrl } from "../../utils/b2";
import { env } from "../../config/env";
import prisma from "../../config/prisma";

export const uploadInlineImage = asyncHandler(async (req: Request, res: Response) => {

    if (!req.file) {
        throw new AppError("Image file is required", 400);
    }

    const uploaded = await uploadFileToB2(req.file, "inline-content");

    const image = await prisma.inlineImage.create({
        data: {
            fileId: uploaded.fileId,
            fileName: uploaded.fileName
        }
    });

    return successResponse(res, "Image uploaded successfully", {
        url: `${env.API_BASE_URL}/api/uploads/image/${image.id}`,
        publicId: image.id
    }, 201);

});

// Public, unauthenticated — this is what an <img src> embedded in stored
// rich-text HTML actually points at, so it must work for any viewer
// (browser, WebView) with no auth header. It just redirects to a
// freshly-minted signed B2 URL, so the stable link never expires even
// though the underlying B2 download URL does.
export const getInlineImage = asyncHandler(async (req: Request, res: Response) => {

    const image = await prisma.inlineImage.findUnique({
        where: { id: req.params.id as string }
    });

    if (!image) {
        throw new AppError("Image not found", 404);
    }

    const signedUrl = await getB2SignedUrl(image.fileName);

    return res.redirect(signedUrl);

});
