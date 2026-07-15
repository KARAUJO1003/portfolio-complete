import type { AuthUserDto } from "@portfolio/contracts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserDto;
    }
  }
}

export {};
