
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import * as moment from 'moment';
import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProductService', () => {
  let service: ProductService;
  let model: Model<Product>;

  const mockProduct = {
    code: '1234567890123',
    url: 'https://example.com',
    product_name: 'Test Product',
    created_t: moment().unix(),
    last_modified_t: moment().unix(),
    imported_t: new Date(),
    status: 'draft',
  };

  const productArray = [mockProduct];

  const mockProductModel = {
    new: jest.fn().mockResolvedValue(mockProduct),
    constructor: jest.fn().mockResolvedValue(mockProduct),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(productArray),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProduct),
    }),
    updateOne: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    model = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products = await service.getProducts();
      expect(products).toEqual(productArray);
    });
  });

  describe('getProductByCode', () => {
    it('should return a single product by code', async () => {
      const product = await service.getProductByCode('1234567890123');
      expect(product).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product by code', async () => {
      const updateData = { product_name: 'Updated Product' };
      await service.updateProduct('1234567890123', updateData);
      expect(mockProductModel.updateOne).toHaveBeenCalledWith(
        { code: '1234567890123' },
        { $set: updateData },
      );
    });
  });

  describe('deleteProduct', () => {
    it('should mark a product as trash by code', async () => {
      await service.deleteProduct('1234567890123');
      expect(mockProductModel.updateOne).toHaveBeenCalledWith(
        { code: '1234567890123' },
        { $set: { status: 'trash' } },
      );
    });
  });

  describe('importProducts', () => {
    it('should fetch and save products from files', async () => {
      const getFileListSpy = jest
        .spyOn(service as any, 'getFileList')
        .mockResolvedValue(['file1.json', 'file2.json']);
      const fetchProductsFromFileSpy = jest
        .spyOn(service as any, 'fetchProductsFromFile')
        .mockResolvedValue(productArray);
      const saveProductsSpy = jest
        .spyOn(service as any, 'saveProducts')
        .mockResolvedValue(undefined);

      await service.importProducts();

      expect(getFileListSpy).toHaveBeenCalled();
      expect(fetchProductsFromFileSpy).toHaveBeenCalledWith('file1.json');
      expect(fetchProductsFromFileSpy).toHaveBeenCalledWith('file2.json');
      expect(saveProductsSpy).toHaveBeenCalledWith(productArray);
    });
  });

  describe('fetchProductsFromFile', () => {
    it('should fetch products from a specific file', async () => {
      const mockResponse = { data: productArray };
      axios.get = jest.fn().mockResolvedValue({ mockResponse });

      const products = await (service as any).fetchProductsFromFile('file1.json');
      expect(products).toEqual(productArray);
    });
  });

  describe('getFileList', () => {
    it('should return a list of file names', async () => {
      const mockResponse = { data: 'file1.json\nfile2.json\n' };
      axios.get = jest.fn().mockResolvedValue({ mockResponse });

      const files = await (service as any).getFileList();
      expect(files).toEqual(['file1.json', 'file2.json']);
    });
  });
});
