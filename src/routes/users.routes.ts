import express from "express";

const router: import("express").Router = express.Router();

// GET
router.get("/me/letters/sent" catchAsync(async (req: any, res: Response) => {

    const user = req.user;

    return res.status(200).json({
      success: true,
      data: {
        uuid: user?.uuid,
        email: user?.email,
        name: user?.name,
        profileImage: user?.profileImage,
      },
      error: null,
    }); 
  })
);

export default router;
