import { NextFunction, Request, Response } from "express";
import { spotifyApi } from "../controller/music.controller";
import { ApiError } from "../utils/ApiError";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.spotifyAccessToken;
    if (!token) return next( 
        res
        .status(401)
        .json(new ApiError(401,"Please Login first"))
    );
    spotifyApi.setAccessToken(token);
    next();
  };