import { Injectable } from '@nestjs/common';
const { exec, spawn } = require('child_process');
var readline = require('readline');

export interface GetFileListingQueryParams {
  directory: string;
  page: number;
}

export interface File {
  fullPath: string;
  fileName: string;
  size: number;
  attribute: string;
}

export interface FileListingResponse {
  total: number;
  lastPage: number;
  page: number;
  data: File[];
}

const OS = {
  window: 'window',
  linux: 'linux',
};

@Injectable()
export class FileListingService {
  async retrieveListing(
    directory: string,
    page: number,
  ): Promise<FileListingResponse> {
    if (process.env.OS === OS.window) {
      if (directory.endsWith('\\')) {
        directory = directory.substring(0, directory.length - 1);
      }
    } else {
      if (directory.endsWith('/')) {
        directory = directory.substring(0, directory.length - 1);
      }
    }

    var relativePath = directory;

    if (this.isRoot(directory)) {
      relativePath = '.';
    } else {
      if (this.isAbsolutePath(directory)) {
        relativePath = this.getRelativePath(directory);
      }

      if (process.env.OS === OS.window) {
        relativePath = this.convertWindowPath(directory);
      }
    }

    const totalFile = await this.getTotalFiles(relativePath);

    const offset = parseInt(process.env.PER_PAGE, 10) * page;

    if (page > 1 && offset > totalFile) {
      return this.emptyResponse(
        totalFile,
        Math.ceil(totalFile / parseInt(process.env.PER_PAGE)),
        page,
      );
    }

    const { stdout, stderr } = await exec(
      `ls -l ${process.env.TARGET_ROOT_DIR}/${relativePath} | head -n ${offset} | tail -n ${process.env.PER_PAGE}`,
    );

    var res = [];

    const rl = readline.createInterface({
      input: stdout,
      terminal: false,
    });

    for await (const line of rl) {
      const fragments = line.split(' ').filter((x) => x !== '');
      if (fragments.length > 2) {
        const glue = process.env.OS === OS.window ? '\\' : '/';
        res.push({
          fullPath: `${directory}${glue}${fragments[fragments.length - 1]}`,
          fileName: `${fragments[fragments.length - 1]}`,
          size: fragments[fragments.length - 5],
          attribute: `${fragments[0]}`,
        });
      }
    }

    return {
      total: totalFile,
      lastPage: Math.ceil(totalFile / parseInt(process.env.PER_PAGE)),
      page: page,
      data: res,
    };
  }

  async getTotalFiles(relativePath: string): Promise<number> {
    const { stdout, stderr } = await exec(
      `ls -l ${process.env.TARGET_ROOT_DIR}/${relativePath} | wc -l`,
    );

    const rl = readline.createInterface({
      input: stdout,
      terminal: false,
    });

    for await (const line of rl) {
      return parseInt(line, 10);
    }

    return 0;
  }

  emptyResponse(
    total: number,
    lastPage: number,
    currentPage: number,
  ): FileListingResponse {
    return {
      total: total,
      lastPage: lastPage,
      page: currentPage,
      data: [],
    };
  }

  isAbsolutePath(directory: string): boolean {
    return directory.startsWith(process.env.SOURCE_ROOT_DIR);
  }

  getRelativePath(absolutePath: string): string {
    return absolutePath.split(process.env.SOURCE_ROOT_DIR).pop();
  }

  isRoot(absolutePath: string): boolean {
    return absolutePath === process.env.SOURCE_ROOT_DIR;
  }

  convertWindowPath(windowFilePath: string): string {
    return windowFilePath.split('\\').join('/').split(' ').join('\\ ');
  }
}
