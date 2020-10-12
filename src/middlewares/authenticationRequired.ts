import { NextFunction, Request, Response } from "express";

export function authenticationRequired(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) return next();
    res.status(404).send();
}