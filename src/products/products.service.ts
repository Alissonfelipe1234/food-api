import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll({ page, limit }): Promise<Product[]> {
    return this.productModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(code: string): Promise<Product> {
    const product = await this.productModel.findOne({ code }).exec();
    if (!product) {
      throw new NotFoundException(`Product with code ${code} not found`);
    }
    return product;
  }

  async update(code: string, updateData: any): Promise<Product> {
    const updatedProduct = await this.productModel
      .findOneAndUpdate({ code }, updateData, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with code ${code} not found`);
    }
    return updatedProduct;
  }

  async softDelete(code: string): Promise<Product> {
    const updatedProduct = await this.productModel
      .findOneAndUpdate({ code }, { status: 'trash' }, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with code ${code} not found`);
    }
    return updatedProduct;
  }

}
