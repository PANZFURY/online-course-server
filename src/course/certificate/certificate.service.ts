import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Certificate } from "./entities/certificate.entity";
import { Course } from "../entities/course.entity";
import { FileService, FileType } from "src/file/file.service";

@Injectable()
export class CertificateService {
    constructor(
        @InjectModel(Certificate)
        private readonly certificateModel: typeof Certificate,
        @InjectModel(Course)
        private readonly courseModel: typeof Course,
        private readonly fileService: FileService,
    ) {}

    async createCertificate(courseId: number, userId: number, picture: Express.Multer.File): Promise<Certificate> {
        try {
            const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
            if (!picturePath) {
                throw new InternalServerErrorException('Failed to upload picture');
            }
            const course = await this.courseModel.findOne({where: {id: courseId}});
            if (!course) {
                throw new BadRequestException('Course was not found');
            }

            const concurrenceCertificate = await this.certificateModel.findOne({where: {userId, courseId}});
            if (concurrenceCertificate) {
                throw new BadRequestException('The certificate has already been receive');
            }

            const certificate = await this.certificateModel.create({
                courseId,
                userId,
                picture: picturePath
            })
            return certificate;
        } catch(e) {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteCertificate() {}

    async getOne() {}
}