import axios from 'axios';
import { client } from '../database';

const openFoodFactsApi = process.env.OFF_API_URL || 'https://world.openfoodfacts.org/cgi/search.pl';

export async function getProductCategoryByName(productName: string): Promise<string|null> {
  const params = new URLSearchParams({
    "search_terms": productName,
    "json": 'true'
  });

  const res = await axios.get(openFoodFactsApi, { params });

  if(!res.data?.products) {
    console.log('[API::OFF] product name not found in the database.');
    return null;
  }

  console.log('[API::product]: product name found. extracting product category...');

  const product = res.data?.products[0];

  // insert in database
  const db = client.db('yuka');
  const productsCollection = db.collection('products');

  await productsCollection.insertOne(product);

  // get product category
  const category = res.data.products.categories?.split(',')[-1];

  return category;
}

export async function getSubstitutes(category: string): Promise<any|null> {
  const params = new URLSearchParams({
    "search_terms": category,
    "json": 'true',
    "nutriment_0": "nutrition-score-fr",
    "nutriment_compare_0": "lt",
    "nutriment_value_0": "12"
  });

  const res = await axios.get(openFoodFactsApi, { params });

  if(!res.data?.products)
    return null;

  return res.data?.products
}