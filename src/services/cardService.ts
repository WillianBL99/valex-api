import * as employeeRepository from "../repositories/employeeRepository.js";

export async function create( cpf: number, companyId: number ) {
  const findEmployee = await employeeRepository.findByCompanyIdAndCPF( cpf, companyId );
}