import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { Product } from './products.schema';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            getStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductService>(ProductService);
  });

  // Teste para o PUT /products/:code (Update product)
  it('should update a product and return the updated product', async () => {
    const code = '123';
    const updateData = { product_name: 'Updated Product' };
    const updatedProduct = { code, ...updateData } as Product;

    jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);

    expect(await controller.updateProduct(code, updateData)).toBe(updatedProduct);
    expect(service.update).toHaveBeenCalledWith(code, updateData);
  });

  it('should throw NotFoundException if product to update is not found', async () => {
    const code = '123';
    const updateData = { product_name: 'Updated Product' };

    jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

    await expect(controller.updateProduct(code, updateData)).rejects.toThrow(NotFoundException);
    expect(service.update).toHaveBeenCalledWith(code, updateData);
  });

  // Teste para o DELETE /products/:code (Soft delete product)
  it('should soft delete a product by setting status to trash', async () => {
    const code = '123';
    const deletedProduct = { code, status: 'trash' } as Product;

    jest.spyOn(service, 'softDelete').mockResolvedValue(deletedProduct);

    expect(await controller.deleteProduct(code)).toBe(deletedProduct);
    expect(service.softDelete).toHaveBeenCalledWith(code);
  });

  it('should throw NotFoundException if product to soft delete is not found', async () => {
    const code = '123';

    jest.spyOn(service, 'softDelete').mockRejectedValue(new NotFoundException());

    await expect(controller.deleteProduct(code)).rejects.toThrow(NotFoundException);
    expect(service.softDelete).toHaveBeenCalledWith(code);
  });

});
