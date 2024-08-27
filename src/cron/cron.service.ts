import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../products/products.schema'
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private httpService: HttpService,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  @Cron("0 0 * * *")
  async handleCron() {

    const filesUrl = 'https://challenges.coode.sh/food/data/json/index.txt';

    try {
      const response = await lastValueFrom(
        this.httpService.get(filesUrl).pipe(
          map((response) => response.data),
          catchError((error) => {
            throw new Error(`Failed to fetch file list: ${error.message}`);
          }),
        ),
      );

      const fileUrls = response.split('\n').filter(Boolean);

      for (const fileUrl of fileUrls) {
        await this.importData(fileUrl);
      }

    } catch (error) {
      this.logger.error('Failed to import data', error.stack);
    }
  }

  private async importData(fileUrl: string) {
    const url = `https://challenges.coode.sh/food/data/json/${fileUrl}`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url).pipe(
          map((response) => response.data),
          catchError((error) => {
            throw new Error(`${error.message}`);
          }),
        ),
      );

      await this.productModel.bulkWrite(
        response.map((product) => ({
          updateOne: {
            filter: { code: product.code },
            update: { $set: product },
            upsert: true,
          },
        })),
      );
    } catch (error) {
      this.logger.error(error.stack);
      throw error;
    }
  }
}
