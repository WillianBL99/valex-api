import connection from "../config/database.js";

export interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

export async function findByCompanyIdAndCPF(cpf: string, companyId: number) {
  const result = await connection.query<Employee, [string, number]>(
    `SELECT * FROM employees WHERE cpf=$1 AND "companyId"=$2`,
    [ cpf, companyId ]
  );

  return result.rows[0];
}