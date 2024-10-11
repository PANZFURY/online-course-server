import { Injectable } from "@nestjs/common";
import { existsSync } from "fs";
import * as path from "path";
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
    IMAGE = 'image'
}

@Injectable()
export class FileService{
    createFile(type: FileType, file): string {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = uuid.v4() + '.' + fileExtension;
        const filePath = path.resolve(__dirname, '..', 'static');
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true});
        }
        fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
        return `${type}/${fileName}`;
    }
}