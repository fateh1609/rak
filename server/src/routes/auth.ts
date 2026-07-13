import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import { requireAuth, requireRole, signToken } from '../middleware/auth';

const router = Router();

const PROFILE_COLS = `id, full_name, email, mobile, role, agent_code, sponsor_id,
  rank, wallet_balance, kyc_verified, status, wallet_address_trc20, created_at`;

const nextAgentCode = async (): Promise<string> => {
  const { rows } = await query<{ max: string | null }>(
    `select max(substring(agent_code from 5)::int)::text as max from profiles where agent_code like 'AGT-%'`
  );
  const next = (parseInt(rows[0]?.max || '10500', 10) + 1).toString();
  return `AGT-${next}`;
};

/** Client self-registration. Optional agent_code links sponsor. */
router.post('/register', async (req, res) => {
  const { full_name, email, mobile, password, agent_code } = req.body || {};
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'full_name, email and password are required' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  let sponsorId: string | null = null;
  if (agent_code) {
    const { rows } = await query(
      `select id from profiles where agent_code = $1 and role = 'agent'`,
      [agent_code]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid agent code' });
    sponsorId = rows[0].id;
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await query(
      `insert into profiles (full_name, email, mobile, password_hash, role, sponsor_id)
       values ($1, lower($2), $3, $4, 'client', $5)
       returning ${PROFILE_COLS}`,
      [full_name, email, mobile || null, hash, sponsorId]
    );
    const profile = rows[0];
    res.status(201).json({ token: signToken(profile), profile });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    throw e;
  }
});

/** Agent recruits a downline agent (status pending until admin approves). */
router.post('/register-agent', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const { full_name, email, mobile, password } = req.body || {};
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'full_name, email and password are required' });
  }
  const hash = await bcrypt.hash(password, 10);
  const code = await nextAgentCode();
  try {
    const { rows } = await query(
      `insert into profiles (full_name, email, mobile, password_hash, role, sponsor_id, agent_code, status)
       values ($1, lower($2), $3, $4, 'agent', $5, $6, 'pending')
       returning ${PROFILE_COLS}`,
      [full_name, email, mobile || null, hash, req.user!.sub, code]
    );
    res.status(201).json({ profile: rows[0] });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    throw e;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const { rows } = await query(
    `select ${PROFILE_COLS}, password_hash from profiles where email = lower($1)`,
    [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.status === 'suspended') return res.status(403).json({ error: 'Account suspended' });
  if (user.status === 'pending') return res.status(403).json({ error: 'Account pending approval' });

  delete user.password_hash;
  res.json({ token: signToken(user), profile: user });
});

router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query(
    `select ${PROFILE_COLS} from profiles where id = $1`,
    [req.user!.sub]
  );
  if (!rows.length) return res.status(404).json({ error: 'Profile not found' });
  res.json({ profile: rows[0] });
});

/** Update own profile (limited fields). */
router.patch('/me', requireAuth, async (req, res) => {
  const { full_name, mobile, wallet_address_trc20 } = req.body || {};
  const { rows } = await query(
    `update profiles set
       full_name = coalesce($2, full_name),
       mobile = coalesce($3, mobile),
       wallet_address_trc20 = coalesce($4, wallet_address_trc20)
     where id = $1 returning ${PROFILE_COLS}`,
    [req.user!.sub, full_name || null, mobile || null, wallet_address_trc20 || null]
  );
  res.json({ profile: rows[0] });
});

export default router;
