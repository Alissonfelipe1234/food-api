import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './products.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductService],
  exports: [ProductService, MongooseModule],
  controllers: [ProductsController]
  
})
export class ProductsModule {}
