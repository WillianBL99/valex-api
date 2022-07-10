
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

const cryptr = new Cryptr( "" + process.env.SECRET_CRYPTR );

export const internalCryptr = {
  encrypt,
  decrypt: cryptr.decrypt
}

function encrypt( value: string ) {
  //FIXEME: Retirar. Implementado para testar atualização do cartao
  console.log( value );
  return cryptr.encrypt( value );
}

export const internalBcrypt = {
  hashValue
}

async function hashValue( value: string ) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync( saltRounds );
  const hashedValue =  bcrypt.hashSync( value, salt );

  return hashedValue;
}
