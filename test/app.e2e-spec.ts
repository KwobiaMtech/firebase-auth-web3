import { TestClient } from './utils/test-client';

describe('AppController (e2e)', () => {
  let testClient: TestClient;

  beforeAll(async () => {
    testClient = new TestClient();
    await testClient.init();
  });

  afterAll(async () => {
    await testClient.close();
  });

  it('/ (POST) Default Test', async () => {
    console.log('default test');
  });
});
