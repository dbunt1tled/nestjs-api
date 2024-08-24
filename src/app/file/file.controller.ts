import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nest-lab/fastify-multer';
import { documentRegExp, fileMaxUploadSize } from 'src/core/utils/constants';
import { FilesRequest } from 'src/app/message/dto/files.request';
import { FastifyReply } from 'fastify';
import { AuthUser } from 'src/core/decorator/auth.user.decorator';
import path from 'path';
import { User } from '../../../prisma/generated/main';
import fs from 'node:fs';
import { safePath, uuid4 } from 'src/core/utils';
import { responseAPI } from 'src/core/http/response.api';
import { PathParam } from 'src/app/file/dto/path.param';
import { FileService } from 'src/app/file/file.service';
import { FileConfig } from 'src/core/config-api/file.config';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileConfig: FileConfig,
    private readonly fileService: FileService,
  ) {}

  @Get('/*')
  async chatFiles(
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
        fileSize: fileMaxUploadSize,
      },
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(new RegExp(`\.(${documentRegExp})$`, 'iu'))
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
    const f: object[] = [];
    const uploadPath = path.join(
      this.fileConfig.chatPath.toString(),
      data.chatId.toString(),
      user.id.toString(),
    );
    try {
      await fs.promises.stat(uploadPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      await fs.promises.mkdir(uploadPath, { recursive: true });
    }
    await Promise.all(
      files.map(async (file) => {
        const id = uuid4();
        const fileName = `${id}${path.extname(file.originalname)}`;
        await fs.promises.writeFile(
          path.join(uploadPath, fileName),
          file.buffer,
        );
        f.push({
          id: id,
          fileName: `/${data.chatId}/${user.id}/${fileName}`,
          size: file.size,
          type: 'file',
        });
      }),
    );
    return res.status(HttpStatus.OK).send(responseAPI(f));
  }
}
