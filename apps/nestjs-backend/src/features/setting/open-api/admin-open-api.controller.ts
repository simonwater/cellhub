import { Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AdminOpenApiService } from './admin-open-api.service';

@Controller('api/admin')
@Permissions('instance|update')
export class AdminOpenApiController {
  constructor(private readonly adminService: AdminOpenApiService) {}

  @Patch('/plugin/:pluginId/publish')
  async publishPlugin(@Param('pluginId') pluginId: string): Promise<void> {
    await this.adminService.publishPlugin(pluginId);
  }

  @Patch('/plugin/:pluginId/unpublish')
  async unpublishPlugin(@Param('pluginId') pluginId: string): Promise<void> {
    await this.adminService.unpublishPlugin(pluginId);
  }

  @Post('/attachment/repair-table-thumbnail')
  async repairTableAttachmentThumbnail(): Promise<void> {
    await this.adminService.repairTableAttachmentThumbnail();
  }

  @Get('/debug/heap-snapshot')
  async getHeapSnapshot(@Res() res: Response): Promise<void> {
    await this.adminService.getHeapSnapshot(res);
  }
}
