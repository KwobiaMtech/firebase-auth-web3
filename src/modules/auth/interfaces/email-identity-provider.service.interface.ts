import { EmailIdentityInterface } from './email-identity.inteface';

export const EmailIdentityProviderServiceToken = 'gopele-auth:EmailIdentityProviderService';

export interface EmailIdentityProviderServiceInterface {
  createIdentity(email: string): EmailIdentityInterface;
  saveIdentity(identity: EmailIdentityInterface): Promise<EmailIdentityInterface>;
  retrieveIdentity(email: string): Promise<EmailIdentityInterface>;
}
