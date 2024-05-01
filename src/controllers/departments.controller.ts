import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const db = new PrismaClient();

const getAllDepartments = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  return res.json(await db.department.findMany());
};

const getDepartmentById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const department = await db.department.findUnique({ where: { id } });

  if (!department)
    return res.status(404).json({ message: "Department not found" });

  return res.json(department);
};

const createDepartment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ message: "Invalid department data" });

  const departmentData = {
    name,
    description,
  };

  return res.json(await db.department.create({ data: departmentData }));
};

const updateDepartment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ message: "Invalid department data" });

  const departmentData = {
    name,
    description,
  };

  const department = await db.department.update({
    where: { id },
    data: departmentData,
  });

  if (!department)
    return res.status(404).json({ message: "Department not found" });

  return res.json(department);
};

const deleteDepartment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  const department = await db.department.delete({ where: { id } });

  if (!department)
    return res.status(404).json({ message: "Department not found" });

  return res.json(department);
};

export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
