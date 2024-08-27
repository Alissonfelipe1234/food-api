import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CronService } from './cron.service';
import { Product, ProductSchema } from 'src/products/products.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        HttpModule,
    ],
    providers: [CronService]
})
export class CronModule {}
