import { client } from '../database';

const yukaDB = client.db('yuka');
const products = yukaDB.collection('products');

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

  console.log(product.categories.split(',').at(-1));

  return product.categories.split(',').at(-1);
}

