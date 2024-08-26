import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as moment from 'moment';
import { Product } from './products.schema';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async importProducts(): Promise<void> {
    try {
      const files = await this.getFileList();
      for (const file of files) {
        const products = await this.fetchProductsFromFile(file);
        await this.saveProducts(products);
      }
    } catch (error) {
      this.logger.error('Error importing products', error.stack);
    }
  }

  private async getFileList(): Promise<string[]> {
    const response = await axios.get(
      'https://challenges.coode.sh/food/data/json/index.txt',
    );
    return response.data.split('\n').filter((line) => line.trim() !== '');
  }

  private async fetchProductsFromFile(filename: string): Promise<Product[]> {
    const response = await axios.get(
      `https://challenges.coode.sh/food/data/json/${filename}`,
    );
    const products = response.data;
    return products.slice(0, 100).map((product) => this.mapProduct(product));
  }

  private mapProduct(productData: any): Product {
    const product = new this.productModel({
      ...productData,
      created_datetime: new Date(),
      status: 'created',
    });
    return product;
  }

  private async saveProducts(products: Product[]): Promise<void> {
    for (const product of products) {
      await this.productModel.updateOne(
        { code: product.code },
        { $set: product },
        { upsert: true },
      );
    }
  }

  async getProducts() {
    return this.productModel.find().exec();
  }
  
  async getProductByCode(code: string) {
    return this.productModel.findOne({ code }).exec();
  }
  
  async updateProduct(code: string, updateData: Partial<Product>) {
    return this.productModel.updateOne({ code }, { $set: updateData }).exec();
  }

  async deleteProduct(code: string) {
    return this.productModel.updateOne({ code }, { $set: { status: 'deleted' } }).exec();
  }
}
