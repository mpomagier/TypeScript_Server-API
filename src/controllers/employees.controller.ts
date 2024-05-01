import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const db = new PrismaClient();

const getAllEmployees = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  return res.json(await db.employee.findMany());
};

const getEmployeeById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const employee = await db.employee.findUnique({ where: { id } });

  if (!employee) return res.status(404).json({ message: "Employee not found" });

  return res.json(employee);
};

const createEmployee = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, email, phone, address, salary } = req.body;

  if (!name || !email || !phone || !address || !salary)
    return res.status(400).json({ message: "Invalid employee data" });

  const employeeData = {
    name,
    email,
    phone,
    address,
    salary,
  };

  return res.json(await db.employee.create({ data: employeeData }));
};

const updateEmployee = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { name, email, phone, address, salary } = req.body;

  if (!name || !email || !phone || !address || !salary)
    return res.status(400).json({ message: "Invalid employee data" });

  const employeeData = {
    name,
    email,
    phone,
    address,
    salary,
  };

  const employee = await db.employee.update({
    where: { id },
    data: employeeData,
  });

  if (!employee) return res.status(404).json({ message: "Employee not found" });

  return res.json(employee);
};

const deleteEmployee = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  const employee = await db.employee.delete({ where: { id } });

  if (!employee) return res.status(404).json({ message: "Employee not found" });

  return res.json(employee);
};

export {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
