import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nest-lab/fastify-multer';
import { FastifyReply } from 'fastify';
import { AuthUser } from 'src/core/decorator/auth.user.decorator';
import path from 'path';
import fs from 'node:fs';
import { safePath } from 'src/core/utils';
import { PathParam } from 'src/app/file/dto/request/path.param';
import { FileService } from 'src/app/file/file.service';
import { FileConfig } from 'src/core/config-api/file.config';
import { FilesRequest } from 'src/app/file/dto/request/files-create.request';
import { PathInfo } from 'src/core/config-api/dto/path-info.dto';
import { HashService } from 'src/core/hash/hash.service';
import { NotFound } from 'src/core/exception/not-found';
import { FileStatus } from 'src/app/file/enum/file-status';
import { User, File } from '@prisma/client';
import { FileResponse } from 'src/app/file/response/file.response';
import { AuthBearerGuard } from 'src/app/auth/guard/auth-bearer.guard';

@Controller('files')
@UseGuards(AuthBearerGuard)
export class FileController {
  constructor(
    private readonly fileConfig: FileConfig,
    private readonly hashService: HashService,
    private readonly fileService: FileService,
    private readonly fileResponse: FileResponse,
  ) {}

  @Get('/*')
  async files(
    @Param() params: PathParam,
    @Headers() headers: any,
    @Res() res: FastifyReply,
  ) {
    const filePath = safePath(this.fileConfig.filePath, params['*']);
    const info = await this.fileService.fileInfo(filePath);
    const range = headers.range;
    if (!range) {
      const file = fs.createReadStream(filePath);
      res['raw'].setHeader('Content-Length', info.size);
      res['raw'].setHeader('Content-Type', 'application/octet-stream');
      res['raw'].setHeader(
        'Content-Disposition',
        `inline; filename="${path.basename(filePath)}"`,
      );

      return file.pipe(res['raw']);
    }
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : info.size - 1;
    const file = fs.createReadStream(filePath, { start, end });
    res['raw'].setHeader('Content-Range', `bytes ${start}-${end}/${info.size}`);
    res['raw'].setHeader('Accept-Ranges', 'bytes');
    res['raw'].setHeader('Content-Length', end - start + 1);
    res['raw'].setHeader('Content-Type', 'application/octet-stream');
    return file.pipe(res['raw']);
  }

  @Post('/')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: FileConfig.UPLOAD_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(
            new RegExp(`\.(${FileConfig.UPLOAD_FILE_PATTERN})$`, 'iu'),
          )
        ) {
          return cb(new Error('File type are not allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() data: FilesRequest,
    @Res() res: FastifyReply,
    @UploadedFiles() files: any[],
    @AuthUser() user: User,
  ) {
    const f: File[] = [];
    const fileInfo = new PathInfo({ userId: data.userId });
    const uploadPath = this.fileConfig.storagePath(fileInfo);
    const uploadDirFull = path.join(this.fileConfig.filePath, uploadPath);
    try {
      await this.fileService.fileInfo(uploadDirFull, true);
    } catch (error) {
      if (!(error instanceof NotFound)) {
        throw error;
      }
      await fs.promises.mkdir(uploadDirFull, { recursive: true });
    }
    await Promise.all(
      files.map(async (file) => {
        const id = this.hashService.uuid7();
        const fileName = `${this.hashService.uuid7()}${path.extname(file.originalname)}`;
        await fs.promises.writeFile(
          path.join(uploadDirFull, fileName),
          file.buffer,
        );
        const fileEntity = await this.fileService.create({
          id: id,
          path: path.join(uploadPath, fileName),
          type: data.type,
          userId: data.userId,
          ownerId: user.id,
          status: FileStatus.ACTIVE,
        });
        f.push(fileEntity);
      }),
    );
    return res.status(HttpStatus.OK).send(this.fileResponse.json({ model: f }));
  }
}
