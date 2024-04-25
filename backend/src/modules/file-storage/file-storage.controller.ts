import { Controller, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "src/libs/decorators";
import { UserRole } from "src/libs/types";
import { RoleGuard } from "src/libs/guards";
import { UploadRdo } from "./rdo";
import { FileValidationPipe } from "src/libs/pipes";
import { FileFilterException } from "src/libs/exceptions";
import { ImageFile, VideoFile } from "src/app.const";
import { FileStorageService } from "./file-storage.service";

@ApiTags('Загрузка файлов')
@Controller('upload')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @ApiOperation({
    summary: 'Загрузка изображения'
  })
  @ApiResponse({
    type: UploadRdo,
    status: HttpStatus.CREATED,
    description: 'The file has been successfully uploaded',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilterException(ImageFile.MimeTypes, ImageFile.MaxSize),
    }),
  )
  public async uploadImage(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    return this.fileStorageService.saveFile(file);
  }

  @ApiOperation({
    summary: 'Загрузка видео'
  })
  @ApiResponse({
    type: UploadRdo,
    status: HttpStatus.CREATED,
    description: 'Видео успешно загружено',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @Role(UserRole.Coach)
  @UseGuards(RoleGuard)
  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilterException(VideoFile.MimeTypes),
    }),
  )
  public async uploadVideo(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    return this.fileStorageService.saveFile(file);
  }
}
