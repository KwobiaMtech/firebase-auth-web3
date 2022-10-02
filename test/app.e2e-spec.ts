import { TestClient } from './utils/test-client';

describe('AppController (e2e)', () => {
  let testClient: TestClient;

  before(async () => {
    testClient = new TestClient();
    await testClient.init();
  });

  after(async () => {
    await testClient.close();
  });

  it('/ (POST) Default Test', async () => {
    console.log('default test');
  });
});
