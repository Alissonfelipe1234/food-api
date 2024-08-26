import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  code: string;

  @Prop()
  url: string;

  @Prop()
  creator: string;

  @Prop()
  created_t: number;

  @Prop()
  created_datetime: Date;

  @Prop()
  last_modified_t: number;

  @Prop()
  last_modified_datetime: Date;

  @Prop()
  product_name: string;

  @Prop()
  generic_name: string;

  @Prop()
  quantity: string;

  @Prop()
  packaging: string;

  @Prop()
  packaging_tags: string[];

  @Prop()
  brands: string;

  @Prop()
  brands_tags: string[];

  @Prop()
  categories: string;

  @Prop()
  categories_tags: string[];

  @Prop()
  origins: string;

  @Prop()
  origins_tags: string[];

  @Prop()
  manufacturing_places: string;

  @Prop()
  manufacturing_places_tags: string[];

  @Prop()
  labels: string;

  @Prop()
  labels_tags: string[];

  @Prop()
  emb_codes: string;

  @Prop()
  emb_codes_tags: string[];

  @Prop()
  first_packaging_code_geo: string;

  @Prop()
  cities: string;

  @Prop()
  cities_tags: string[];

  @Prop()
  purchase_places: string;

  @Prop()
  stores: string;

  @Prop()
  countries: string;

  @Prop()
  countries_tags: string[];

  @Prop()
  ingredients_text: string;

  @Prop()
  traces: string;

  @Prop()
  traces_tags: string[];

  @Prop()
  serving_size: string;

  @Prop()
  no_nutriments: boolean;

  @Prop()
  additives_n: number;

  @Prop()
  additives: string;

  @Prop()
  additives_tags: string[];

  @Prop()
  ingredients_from_palm_oil_n: number;

  @Prop()
  ingredients_from_palm_oil: string;

  @Prop()
  ingredients_from_palm_oil_tags: string[];

  @Prop()
  ingredients_that_may_be_from_palm_oil_n: number;

  @Prop()
  ingredients_that_may_be_from_palm_oil: string;

  @Prop()
  ingredients_that_may_be_from_palm_oil_tags: string[];

  @Prop()
  nutrition_grade_fr: string;

  @Prop()
  main_category: string;

  @Prop()
  main_category_fr: string;

  @Prop()
  image_url: string;

  @Prop()
  image_small_url: string;

  @Prop()
  energy_100g: number;

  @Prop()
  energy_kj_100g: number;

  @Prop()
  energy_kcal_100g: number;

  @Prop()
  proteins_100g: number;

  @Prop()
  carbohydrates_100g: number;

  @Prop()
  sugars_100g: number;

  @Prop()
  fat_100g: number;

  @Prop()
  saturated_fat_100g: number;

  @Prop()
  fiber_100g: number;

  @Prop()
  sodium_100g: number;

  @Prop()
  nutrition_score_fr_100g: number;

  @Prop()
  nutrition_score_uk_100g: number;

  //campo para softdelete
  @Prop({ required: true, enum: ['created', 'deleted', 'published'] })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
