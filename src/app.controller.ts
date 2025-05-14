import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Général')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Page d'accueil" })
  @ApiResponse({
    status: 200,
    description: 'Message de bienvenue',
    type: String,
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
