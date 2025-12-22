import * as fs from "fs";
import * as path from "path";

export class Logger {
  private logDir: string;
  private sessionID: string;
  private logFile: string;

  constructor(projectDir: string, sessionID: string) {
    this.sessionID = sessionID;
    this.logDir = path.join(projectDir, ".tmp", "my-little-plugin");
    this.logFile = path.join(this.logDir, `${sessionID}.log`);
    
    this.ensureLogDir();
    this.log("Session started");
  }

  private ensureLogDir(): void {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch {}
  }

  log(message: string, data?: unknown): void {
    try {
      const timestamp = new Date().toISOString();
      const dataStr = data ? ` ${JSON.stringify(data)}` : "";
      const logEntry = `[${timestamp}] ${message}${dataStr}\n`;
      fs.appendFileSync(this.logFile, logEntry);
    } catch {}
  }

  getLogPath(): string {
    return this.logFile;
  }

  getLogDir(): string {
    return this.logDir;
  }

  readLogs(lines: number = 50): string {
    try {
      const content = fs.readFileSync(this.logFile, "utf-8");
      const allLines = content.split("\n").filter(l => l.trim());
      const recentLines = allLines.slice(-lines);
      return recentLines.join("\n");
    } catch {
      return "No logs yet.";
    }
  }

  static getAllSessions(projectDir: string): string[] {
    try {
      const logDir = path.join(projectDir, ".tmp", "my-little-plugin");
      if (!fs.existsSync(logDir)) return [];
      return fs.readdirSync(logDir)
        .filter(f => f.endsWith(".log"))
        .map(f => f.replace(".log", ""));
    } catch {
      return [];
    }
  }
}
