import { client } from '../database';

const yukaDB = client.db('yuka');
const products = yukaDB.collection<any>('products');

export async function getProductCategoryByName(productName: string): Promise<string|null> {
  const product = await products.findOne({ product_name: {
    $regex: productName, 
    $options: 'i'
  } });

  if(!product) {
    console.log('[Database::product]: product name not found in the database.')
    return null;
  }

  console.log('[Database::product]: product name found. extracting product category...');

  const categories = product.categories?.split(',');

  return categories?.slice(0, Math.ceil(categories.length / 2) + 1)?.join(',');
}

export async function getProductCategoryByCode(productCode: string): Promise<string|null> {
  const product = await products.findOne({_id: productCode});

  if(!product) {
    console.log('[Database::product]: product code not found in the database.')
    return null;
  }

  console.log('[Database::product]: product code found. extracting product category...');

  const categories = product.categories?.split(',');

  return categories?.slice(0, Math.ceil(categories.length / 2) + 1)?.join(',');
}
