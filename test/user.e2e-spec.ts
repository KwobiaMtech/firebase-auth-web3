import { TestClient } from './utils/test-client';

describe('UserAuthController (e2e)', () => {
  let testClient: TestClient;

  beforeAll(async () => {
    testClient = new TestClient();
    await testClient.init();
  });

  afterAll(async () => {
    await testClient.close();
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
