import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthContext } from '../types/index.js';
import { store } from '../store/memory-store.js';

/**
 * Simple auth middleware that extracts tenant and user context from headers.
 * In production this would validate a JWT token. For the challenge,
 * we use headers to keep setup simple.
 *
 * Required headers:
 *   X-Tenant-Id: the tenant identifier
 *   X-User-Id: the user identifier
 *   X-User-Role: admin | staff | sitter (defaults to staff)
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const tenantId = request.headers['x-tenant-id'] as string | undefined;
  const userId = request.headers['x-user-id'] as string | undefined;
  const role = (request.headers['x-user-role'] as string) || 'staff';

  if (!tenantId || !userId) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Missing X-Tenant-Id or X-User-Id headers',
    });
  }

  const tenant = store.getTenant(tenantId);
  if (!tenant) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid tenant',
    });
  }

  if(!['admin', 'staff', 'sitter'].includes(role)) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid role',
    });
  }

  const authContext: AuthContext = {
    tenantId,
    userId,
    role: role as AuthContext['role'],
  };

  // Attach to request for downstream handlers
  (request as any).auth = authContext;
}
