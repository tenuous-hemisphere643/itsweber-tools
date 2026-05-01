import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

export interface StorageCodec<T> {
  serialize: (value: T) => string;
  deserialize: (raw: string) => T;
}

export const stringCodec: StorageCodec<string> = {
  serialize: (value) => value,
  deserialize: (raw) => raw,
};

export function jsonCodec<T>(): StorageCodec<T> {
  return {
    serialize: (value) => JSON.stringify(value),
    deserialize: (raw) => JSON.parse(raw) as T,
  };
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
  codec: StorageCodec<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const codecRef = useRef(codec);
  codecRef.current = codec;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? codec.deserialize(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, codecRef.current.serialize(value));
    } catch {
      // localStorage may be disabled or quota exceeded — silent fallback
    }
  }, [key, value]);

  return [value, setValue];
}
