import chalk from "chalk";

export type BannerType = "success" | "error" | "warning" | "info";

export interface BannerOptions {
  subtitle?: string;
}

export interface ArtBanner {
  art: string[];
  icon: string;
  defaultColor: (text: string) => string;
}

export class Banner {
  constructor(
    private type: BannerType,
    private message: string,
    private options?: BannerOptions
  ) {}

  render(): string {
    const icons = {
      success: "✓",
      error: "✗",
      warning: "⚠",
      info: "ℹ",
    };

    const colors = {
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue,
    };

    const icon = icons[this.type];
    const color = colors[this.type];

    const border = "━".repeat(50);
    const lines: string[] = [];

    lines.push(color(border));
    lines.push(color(`  ${icon} ${this.message}`));

    if (this.options?.subtitle) {
      lines.push(color(`  ${this.options.subtitle}`));
    }

    lines.push(color(border));

    return lines.join("\n");
  }
}

export class ArtisticBanner {
  constructor(
    private artBanner: ArtBanner,
    private message?: string,
    private subtitle?: string
  ) {}

  render(): string {
    const lines: string[] = [];
    
    // Add the ASCII art
    const artLines = this.artBanner.art.map(line =>
      this.artBanner.defaultColor(line)
    );
    lines.push(...artLines);

    // Add message if provided
    if (this.message) {
      lines.push("");
      lines.push(
        this.artBanner.defaultColor(
          `    ${this.artBanner.icon} ${this.message}`
        )
      );
    }

    // Add subtitle if provided
    if (this.subtitle) {
      lines.push(this.artBanner.defaultColor(`    ${this.subtitle}`));
    }

    return lines.join("\n");
  }
}

export function createBanner(
  type: BannerType,
  message: string,
  options?: BannerOptions
): string {
  return new Banner(type, message, options).render();
}

export function createArtisticBanner(
  artBanner: ArtBanner,
  message?: string,
  subtitle?: string
): string {
  return new ArtisticBanner(artBanner, message, subtitle).render();
}
