import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';

// Define the Multer file type explicitly if needed
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {}

  @Post('users')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded or file is invalid');
    }

    try {
      await this.importService.importUsersFromExcel(file.buffer);
      return { message: 'Import successful' };
    } catch (error) {
      console.error('File processing error:', error);
      throw new BadRequestException('Failed to process file');
    }
  }
}
