import { Request, Response } from "express";
import * as localDB from "../models/products";
import * as OFF from "../OFF";

export default {
  products: {
    get: async (req: Request, res: Response): Promise<void> => {
      const query = req.query.query;
      const queryType = req.query.type;

      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "A query is required!" });
        return;
      }

      if (
        !queryType ||
        typeof queryType !== "string" ||
        !["name", "code"].includes(queryType)
      ) {
        res.status(400).json({
          error: "A query type is required and must be 'name' or 'code'",
        });
        return;
      }

      try {
        console.log(`searching for product ${queryType}: ${query}`);
        let productCategory;
        
        if (queryType === "name") {
          productCategory =
            (await localDB.getProductCategoryByName(query)) ||
            (await OFF.getProductCategoryByName(query));
        } else {
          productCategory =
            (await localDB.getProductCategoryByCode(query)) ||
            (await OFF.getProductCategoryByCode(query));
        }

        console.log(`product category is : ${productCategory}`);

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
