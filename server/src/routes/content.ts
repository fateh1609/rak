import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/updates', requireAuth, async (req, res) => {
  const role = req.user!.role;
  const { rows } = await query(
    `select u.*, a.full_name as author from updates u
     left join profiles a on a.id = u.created_by
     where u.audience = 'all' or u.audience = $1
     order by u.created_at desc limit 50`,
    [role === 'admin' ? 'all' : role]
  );
  res.json({ updates: rows });
});

router.post('/admin/updates', requireAuth, requireRole('admin'), async (req, res) => {
  const { title, body, audience } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });
  const { rows } = await query(
    `insert into updates (title, body, audience, created_by)
     values ($1, $2, $3, $4) returning *`,
    [title, body, audience || 'all', req.user!.sub]
  );
  res.status(201).json({ update: rows[0] });
});

router.post('/tickets', requireAuth, async (req, res) => {
  const { subject, message } = req.body || {};
  if (!subject || !message) return res.status(400).json({ error: 'subject and message required' });
  const { rows } = await query(
    `insert into tickets (user_id, subject, message) values ($1, $2, $3) returning *`,
    [req.user!.sub, subject, message]
  );
  res.status(201).json({ ticket: rows[0] });
});

router.get('/tickets/my', requireAuth, async (req, res) => {
  const { rows } = await query(
    `select * from tickets where user_id = $1 order by created_at desc`,
    [req.user!.sub]
  );
  res.json({ tickets: rows });
});

router.get('/admin/tickets', requireAuth, requireRole('admin'), async (_req, res) => {
  const { rows } = await query(
    `select t.*, u.full_name, u.email, u.role as user_role
     from tickets t join profiles u on u.id = t.user_id
     order by t.status = 'open' desc, t.created_at desc`
  );
  res.json({ tickets: rows });
});

router.patch('/admin/tickets/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { status, admin_reply } = req.body || {};
  const { rows } = await query(
    `update tickets set status = coalesce($2, status), admin_reply = coalesce($3, admin_reply)
     where id = $1 returning *`,
    [req.params.id, status || null, admin_reply || null]
  );
  if (!rows.length) return res.status(404).json({ error: 'Ticket not found' });
  res.json({ ticket: rows[0] });
});

export default router;
