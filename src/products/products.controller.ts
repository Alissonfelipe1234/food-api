import { Controller, Get, Param, Put, Delete, Query, Body } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './products.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query('page') page = 1, @Query('limit') limit = 10): Promise<Product[]> {
    return this.productService.findAll({ page, limit });
  }

  @Get('/:code')
  async getProduct(@Param('code') code: string): Promise<Product> {
    return this.productService.findOne(code);
  }

  @Put('/:code')
  async updateProduct(@Param('code') code: string, @Body() updateData: any): Promise<Product> {
    return this.productService.update(code, updateData);
  }

  @Delete('/:code')
  async deleteProduct(@Param('code') code: string): Promise<Product> {
    return this.productService.softDelete(code);
  }

}
