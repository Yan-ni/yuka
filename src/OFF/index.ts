import axios from 'axios';
import { client } from '../database';

const openFoodFactsApi = process.env.OFF_API_SEARCH_URL || 'https://world.openfoodfacts.org';

export async function getProductCategoryByName(productName: string): Promise<string|null> {
  const params = new URLSearchParams({
    "search_terms": productName,
    "json": 'true',
    "fields":"_id,categories,image_small_url,product_name,nutriscore_grade"
  });

  const res = await axios.get(`${openFoodFactsApi}/cgi/search.pl`, { params });

  if(res.data?.count === 0) {
    console.log('[API::OFF] product name not found in the database.');
    return null;
  }

  console.log('[API::OFF]: product name found. extracting product category...');

  const product = res.data?.products[0];

  // insert in database
  const db = client.db('yuka');
  const productsCollection = db.collection('products');

  await productsCollection.insertOne(product).catch(() => {});

  // get product category
  

  const categories = product.categories?.split(',');
  const category = categories?.slice(0, Math.ceil(categories.length / 2))?.join(',');

  return category;
}

export async function getProductCategoryByCode(productCode: string): Promise<string|null> {
  const params = new URLSearchParams({
    "fields":"_id,categories,image_small_url,product_name,nutriscore_grade"
  });

  const res = await axios.get(`${openFoodFactsApi}/api/v0/product/${productCode}.json`, {params});

  if(!res.data?.product) {
    console.log('[API::OFF] product code not found in the database.');
    return null;
  }

  console.log('[API::OFF]: product code found. extracting product category...');

  const product = res.data.product;

  // insert in database
  const db = client.db('yuka');
  const productsCollection = db.collection('products');

  await productsCollection.insertOne(product).catch(() => {});

  // get product category
  

  const categories = product.categories?.split(',');
  const category = categories?.slice(0, Math.ceil(categories.length / 2))?.join(',');

  return category;
}

export async function getSubstitutes(category: string): Promise<any|null> {
  const params = new URLSearchParams({
    "search_terms": category,
    "json": 'true',
    "nutriment_0": "nutrition-score-fr",
    "nutriment_compare_0": "lt",
    "nutriment_value_0": "12",
    "fields":"_id,categories,image_small_url,product_name,nutriscore_grade"
  });

  const res = await axios.get(`${openFoodFactsApi}/cgi/search.pl`, { params });

  if(!res.data?.products)
    return null;

  return res.data?.products
}