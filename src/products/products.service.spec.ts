import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './products.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: Model<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should return all products with pagination', async () => {
    const result = [{ code: '123', product_name: 'Test Product' }];
    jest.spyOn(productModel, 'find').mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(result),
    } as any);

    expect(await service.findAll({ page: 1, limit: 10 })).toBe(result);
  });

  it('should return one product by code', async () => {
    const result = { code: '123', product_name: 'Test Product' };
    jest.spyOn(productModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(result),
    } as any);

    expect(await service.findOne('123')).toBe(result);
  });

  it('should soft delete a product by setting status to trash', async () => {
    const code = '123';
    const result = { code, status: 'trash' } as Product;

    jest.spyOn(productModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(result),
    } as any);

    expect(await service.softDelete(code)).toBe(result);
  });

  it('should throw NotFoundException if product to soft delete is not found', async () => {
    const code = '123';

    jest.spyOn(productModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.softDelete(code)).rejects.toThrow(NotFoundException);
  });

  // Teste para o update
  it('should update a product', async () => {
    const code = '123';
    const updateData = { product_name: 'Updated Product' };
    const result = { code, ...updateData } as Product;

    jest.spyOn(productModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(result),
    } as any);

    expect(await service.update(code, updateData)).toBe(result);
  });

  it('should throw NotFoundException if product to update is not found', async () => {
    const code = '123';
    const updateData = { product_name: 'Updated Product' };

    jest.spyOn(productModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.update(code, updateData)).rejects.toThrow(NotFoundException);
  });
});
