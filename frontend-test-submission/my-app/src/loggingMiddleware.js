// Custom Logging Middleware (No console.log directly)
export function createLogger(moduleName) {
  return {
    info: (message, data = {}) => {
      const logEntry = {
        level: "INFO",
        module: moduleName,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      document.dispatchEvent(new CustomEvent("app-log", { detail: logEntry }));
    },
    error: (message, data = {}) => {
      const logEntry = {
        level: "ERROR",
        module: moduleName,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      document.dispatchEvent(new CustomEvent("app-log", { detail: logEntry }));
    }
  };
}


document.addEventListener("app-log", (e) => {
  const { level, module, message, data, timestamp } = e.detail;
  const logArea = document.getElementById("log-area");
  if (logArea) {
    logArea.innerText += `[${timestamp}] [${level}] [${module}] ${message} ${JSON.stringify(data)}\n`;
  }
});
