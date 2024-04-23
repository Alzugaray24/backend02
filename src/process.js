import { Command } from "commander";

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("-p <port>", "Puerto del servidor", 5000)
  .option("--mode <mode>", "Modo de trabajo", /^(dev|prod|test)$/, "dev")
  .requiredOption(
    "-u <user>",
    "Usuario que va a utilizar el aplicativo.",
    "No se ha declarado un usuario."
  );

program.parse();

process.on("exit", (code) => {
  console.log("Este codigo se ejecuta antes de salir del proceso.");
  console.log("Codigo de salida del proceso: " + code);
});

process.on("uncaughtException", (exception) => {
  console.log("Esta exception no fue capturada, o controlada.");
  console.log(`Exception no capturada: ${exception}`);
});

process.on("message", (message) => {
  console.log(
    "Este codigo se ejecutará cuando reciba un mensaje de otro proceso."
  );
  console.log(`Mensaje recibido: ${message}`);
});

export default program;
