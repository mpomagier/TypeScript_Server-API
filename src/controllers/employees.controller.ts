import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const db = new PrismaClient();

class Employee {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _address: string;
  private _salary: number;

  constructor(data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    salary: number;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._email = data.email;
    this._phone = data.phone;
    this._address = data.address;
    this._salary = data.salary;
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
  get email(): string {
    return this._email;
  }
  set email(newEmail: string) {
    this._email = newEmail;
  }
  get phone(): string {
    return this._phone;
  }
  set phone(newPhone: string) {
    this._phone = newPhone;
  }
  get address(): string {
    return this._address;
  }
  set address(newAddress: string) {
    this._address = newAddress;
  }
  get salary(): number {
    return this._salary;
  }
  set salary(newSalary: number) {
    this._salary = newSalary;
  }
}

const getAllEmployees = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const employees = await db.employee.findMany();
  return res.json(employees.map((employee) => new Employee(employee)));
};

const getEmployeeById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const employee = await db.employee.findUnique({ where: { id } });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.json(new Employee(employee));
};

const createEmployee = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, email, phone, address, salary } = req.body;

  if (!name || !email || !phone || !address || !salary) {
    return res.status(400).json({ message: "Invalid employee data" });
  }

  const employee = await db.employee.create({
    data: { name, email, phone, address, salary },
  });
  return res.json(new Employee(employee));
};

const updateEmployee = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { name, email, phone, address, salary } = req.body;

  if (!name || !email || !phone || !address || !salary) {
    return res.status(400).json({ message: "Invalid employee data" });
  }

  const employee = await db.employee.update({
    where: { id },
    data: { name, email, phone, address, salary },
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.json(new Employee(employee));
};

const deleteEmployee = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  const employee = await db.employee.delete({ where: { id } });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.json(employee);
};

export {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
