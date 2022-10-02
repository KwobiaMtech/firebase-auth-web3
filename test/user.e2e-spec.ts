import { TestClient } from './utils/test-client';
import { RegisterDto } from '../src/modules/auth/dto/auth.dto';

describe('UserAuthController (e2e)', () => {
  let testClient: TestClient;

  beforeAll(async () => {
    testClient = new TestClient();
    await testClient.init();
  });

  afterAll(async () => {
    await testClient.close();
  });

  it('/ (POST) Register User Test', async () => {
    const userData: RegisterDto = {
      email: 'patrick6@gmail.com',
      password: 'KoobiAdom7New',
      dateOfBirth: '1990-01-01',
    };
    const registerUser = await testClient.httpRequest('post', '/user/create', {
      payload: userData,
    });
    expect(registerUser.id).toBeDefined();
    expect(registerUser.idNumber).toBeDefined();
    expect(registerUser.dateOfBirth).toBeDefined();
  });

  it('/ (POST) User Login Test', async () => {
    const user = await testClient.login({
      email: 'example@gmail.com',
      password: 'Adom4Christ',
    });

    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();
  });
});
