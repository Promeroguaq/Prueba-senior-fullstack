// Script para liberar el puerto 3001 si quedó ocupado por un proceso anterior.
// Usamos execSync para que la ejecución sea secuencial y controlada.

const { execSync } = require("child_process");
const os = require("os");

const PORT = 3001;
const platform = os.platform();

console.log(`Buscando procesos en el puerto ${PORT}...`);

if (platform === "win32") {
  let netstatOutput = "";

  try {
    netstatOutput = execSync(`netstat -ano | findstr :${PORT}`, { encoding: "utf8" });
  } catch {
    // Si no hay procesos, netstat/findstr puede devolver código de salida distinto de cero.
    netstatOutput = "";
  }

  if (!netstatOutput.trim()) {
    console.log("No había procesos en el puerto 3001");
    process.exit(0);
  }

  const lineas = netstatOutput.split("\n").filter((linea) => linea.includes("LISTENING"));
  const pids = new Set();

  for (const linea of lineas) {
    const partes = linea.trim().split(/\s+/);
    const pid = parseInt(partes[partes.length - 1], 10);
    if (pid && pid > 0) {
      pids.add(pid);
    }
  }

  if (pids.size === 0) {
    console.log("No había procesos en el puerto 3001");
    process.exit(0);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
      console.log(`Proceso ${pid} terminado.`);
    } catch (error) {
      console.log(`No se pudo matar el proceso ${pid}: ${error.message}`);
    }
  }

  console.log("Puerto 3001 liberado");
} else {
  // En Linux/Mac usamos lsof para obtener los PIDs y los matamos uno por uno.
  let pids = "";

  try {
    pids = execSync(`lsof -ti:${PORT}`, { encoding: "utf8" }).trim();
  } catch {
    pids = "";
  }

  if (!pids) {
    console.log("No había procesos en el puerto 3001");
    process.exit(0);
  }

  for (const pid of pids.split("\n")) {
    try {
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
      console.log(`Proceso ${pid} terminado.`);
    } catch (error) {
      console.log(`No se pudo matar el proceso ${pid}: ${error.message}`);
    }
  }

  console.log("Puerto 3001 liberado");
}
