const lengthOfNumber = ( length: number ) => new RegExp(`/(\d){${length}}/`);
const cvv = lengthOfNumber( 3 );
const password = lengthOfNumber( 4 );

export const regex = {
  cvv,
  password
}