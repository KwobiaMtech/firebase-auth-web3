import { TestClientBase } from './test-client-base';

export type LOGIN = {
  email?: string;
  password: string;
};

export interface CommonRestOptions {
  expectErrorCode?: string;
  path?: string;
}

export class TestClient extends TestClientBase {
  userId: string;
  authUser: any;

  async init(): Promise<void> {
    await super.init();
  }

  async login(login: LOGIN) {
    const resp = await this.httpRequest('post', '/api/login', {
      payload: {
        ...login,
      },
    });
    return resp;
  }
}
