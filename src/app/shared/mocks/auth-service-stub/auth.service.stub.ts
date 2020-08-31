import { AuthService } from "app/auth/auth.service";

export const authServiceStub: AuthService | any = {
  login: jest.fn(),
  logout: jest.fn(),
  setAuthDetails: jest.fn(),
  setNewPassword: jest.fn(),
  isLoggedIn: jest.fn()
};
