import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/products.schema'
import * as zlib from 'zlib';
import { promisify } from 'util';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

const gunzip = promisify(zlib.gunzip);

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  @Cron('12 2 * * *') // Executa diariamente à meia-noite
  async handleCron() {
    try {
      const indexUrl = 'https://challenges.coode.sh/food/data/json/index.txt';
      const indexResponse = await this.httpService.get(indexUrl).toPromise();
      const files = indexResponse.data.split('\n').map((file: string) => file.trim()).filter(Boolean);

      for (const file of files) {
        const fileUrl = `https://challenges.coode.sh/food/data/json/${file}`;
        const fileResponse: AxiosResponse<Buffer> = await this.httpService.get(fileUrl, { responseType: 'arraybuffer' }).toPromise();
        
        const decompressedBuffer = await gunzip(fileResponse.data);
        const jsonData = JSON.parse(decompressedBuffer.toString('utf-8'));

        if (Array.isArray(jsonData)) {
          for (const product of jsonData.slice(0, 100)) { // Limita a 100 produtos
            const existingProduct = await this.productModel.findOne({ code: product.code }).exec();
            if (existingProduct) {
              await this.productModel.updateOne({ code: product.code }, { ...product, imported_t: new Date() }).exec();
            } else {
              await this.productModel.create({ ...product, imported_t: new Date(), status: 'draft' });
            }
          }
        } else {
          this.logger.error(`Expected array but received: ${typeof jsonData}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to import data', error.stack);
    }
  }
}
