import { Controller, Get, Version } from '@nestjs/common'

@Controller('inventory')
export class InventoryController {
  @Get()
  @Version('1')
  findAll() {
    return 'inventarios'
  }
}
