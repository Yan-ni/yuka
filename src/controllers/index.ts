import { Request, Response } from "express";
import * as localDB from '../models/products';
import * as OFF from '../OFF';

export default {
  products: {
    get: async (req: Request, res: Response): Promise<void> => {
      const productName = req.query.name;

      if (!productName || typeof productName !== "string") {
        res
          .status(400)
          .json({ error: "Product name is required and must be a string" });
        return;
      }

      try {
        console.log(`searching for product name: ${productName}`);
        let productCategory = await localDB.getProductCategoryByName(productName) || await OFF.getProductCategoryByName(productName);

        if (!productCategory) {
          res.sendStatus(404);
          return;
        }

        const subs = await OFF.getSubstitutes(productCategory);

        if (!subs) {
          res.sendStatus(404);
          return;
        }

        res.json(subs);
      } catch (error) {
        console.error("Error handling the request:", error);
        res.sendStatus(500);
        return;
      }
    },
  },
};
