interface ImportMeta {
  glob<T = unknown>(
    pattern: string | string[],
    options: { eager: true; import?: string },
  ): Record<string, T>;
}
