import { BadRequestException, Controller, Patch, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CertificateService } from "./certificate.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Certificate } from "./entities/certificate.entity";

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

    async deleteCertificate() {}

    async getOne() {}
}