import { BadRequestException, Controller, Delete, Patch, Post, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CertificateService } from "./certificate.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Certificate } from "./entities/certificate.entity";
import { Response } from "express";

@Controller('course/certificate')
export class CertificateController {
    constructor(
        private readonly certificateService: CertificateService,
    ) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('picture'))
    async createCertificate(@UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<Certificate> {
        const user = (req as any).user;
        if (!user) {
            throw new UnauthorizedException('You are not authorized');
        }
        
        const userId = user.id;
        if (!userId) {
            throw new UnauthorizedException('You are not authorized');
        }

        const {courseId} = (req as any).query;
        if (!courseId) {
            throw new BadRequestException('Invalid course ID');
        }

        const certificate = await this.certificateService.createCertificate(courseId, userId, file);
        return certificate;
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('picture'))
    async updateCertificate(@UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<Certificate> {
        const {id} = (req as any).params;
        if (!id) {
            throw new BadRequestException('Incorrect ID');
        }
        const certificate = await this.certificateService.updateCertificate(id, file);
        return certificate;
    }

    @Delete(':id')
    async deleteCertificate(@Req() req: Request, @Res() res: Response ): Promise<any> {
        const {id} = (req as any).params;
        if (!id) {
            throw new BadRequestException('Incorrect ID');
        }

        const certificate = await this.certificateService.deleteCertificate(id);
        return res.json({message: certificate});
    }

    async getOne() {}
}