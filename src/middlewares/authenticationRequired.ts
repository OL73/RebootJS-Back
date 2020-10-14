import { NextFunction, Request, Response } from "express";

// middleware permet de vérifier si le user est authentifié
export function authenticationRequired(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) return next();
    res.status(401).send();
}