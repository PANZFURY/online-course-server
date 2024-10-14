import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { User } from "src/user/entities/user.entity";

dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.path === '/course') {
            return next()
        }
        
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY) as User;
            (req as any).user = decoded;
        }
        catch(e) {
            throw new UnauthorizedException('Invalid token')
        }

        next()
    }
}