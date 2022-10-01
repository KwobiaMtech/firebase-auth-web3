import { EntityManager } from 'typeorm';

/**
 * This function allows to wrap any part of code in a transaction
 * If the passed entity manager is already transactional, it does nothing
 * @param em
 * @param runInTransaction
 */
export async function safeTransaction<T>(
  em: EntityManager,
  runInTransaction: (entityManager: EntityManager) => Promise<T>,
): Promise<T> {
  if (!em.queryRunner || !em.queryRunner?.isTransactionActive) {
    return em.transaction(runInTransaction);
  }
  return runInTransaction(em);
}
