import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const db = new PrismaClient();

class Department {
  private _id: string;
  private _name: string;
  private _description: string;

  constructor(data: { id: string; name: string; description: string }) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
  }
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
  }

  set name(newName: string) {
    this._name = newName;
  }
  set description(newDescription: string) {
    this._description = newDescription;
  }
}

export interface DepartmentInterface {
  id: string;
  name: string;
  description: string;
}

const getAllDepartments = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const departments = await db.department.findMany();
  return res.json(departments.map((department) => new Department(department)));
};

const getDepartmentById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const department = await db.department.findUnique({ where: { id } });

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  return res.json(new Department(department));
};

const createDepartment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Invalid department data" });
  }

  const department = await db.department.create({
    data: { name, description },
  });
  return res.json(new Department(department));
};

const updateDepartment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Invalid department data" });
  }

  const department = await db.department.update({
    where: { id },
    data: { name, description },
  });

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  return res.json(new Department(department));
};

const deleteDepartment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  const department = await db.department.delete({ where: { id } });

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  return res.json(department);
};

export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
