import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const db = new PrismaClient();

class Product {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;

  constructor(data: {
    id: string;
    name: string;
    description: string;
    price: number;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._price = data.price;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  set name(newName: string) {
    this._name = newName;
  }
  get description(): string {
    return this._description;
  }
  set description(newDescription: string) {
    this._description = newDescription;
  }
  get price(): number {
    return this._price;
  }
  set price(newPrice: number) {
    this._price = newPrice;
  }
}

const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  return res.json(await db.product.findMany());
};

const getProductById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) return res.status(404).json({ message: "Product not found" });

  return res.json(product);
};

const createProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, description, price } = req.body;

  if (!name || !description || !price)
    return res.status(400).json({ message: "Invalid product data" });

  const productData = {
    name,
    description,
    price,
  };

  return res.json(await db.product.create({ data: productData }));
};

const updateProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price)
    return res.status(400).json({ message: "Invalid product data" });

  const productData = {
    name,
    description,
    price,
  };

  const product = await db.product.update({
    where: { id },
    data: productData,
  });

  if (!product) return res.status(404).json({ message: "Product not found" });

  return res.json(product);
};

const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  const product = await db.product.delete({ where: { id } });

  if (!product) return res.status(404).json({ message: "Product not found" });

  return res.json(product);
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
