import { Command } from 'commander';
export const program = new Command();

program
    .option('-d, --debug', 'Variable destinada para debug', false)
    .option('-p, --port<port>', 'Puerto del servidor', 8080)
    .option('-m,--mode <mode>', 'Modo de trabajo', 'production')

program.parse();
console.log('Options:', program.opts());
console.log('Remaining arguments', program.args);

process.on('exit', code => { console.log('Estoy saliendo del proceso.') });