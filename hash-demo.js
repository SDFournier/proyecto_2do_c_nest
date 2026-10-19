const bcrypt = require('bcrypt');

async function main() {
  const password = 'clave-segura-1';
  const first = await bcrypt.hash(password, 10);
  const second = await bcrypt.hash(password, 10);
  console.log('first', first);
  console.log('second', second);
  console.log('Mismo hash: ', first === second);
  console.log('correcta: ', await bcrypt.compare(password, first));
  console.log('incorrecta: ', await bcrypt.compare('otra-clave', first));
  for (const rounds of [4, 12, 16]) {
    const start = Date.now();
    await bcrypt.hash(password, rounds);
    const end = Date.now();
    console.log(`rounds: ${rounds} => ${end - start}ms`);
  }
}

main();
