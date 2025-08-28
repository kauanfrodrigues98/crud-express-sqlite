import { Router } from 'express';
import { initDB } from '../database/sqlite.js';
import { getCache, setCache, clearCache } from '../cache/cache.js';

const router = Router({
  caseSensitive: true
});

router.get('/run-migrations', async (req, res) => {
  const db = await initDB(false);
  try {
    res.send({
      message: 'Migrations executed with successfully',
    });
  } catch(error) {
    return res.status(500).send({
      status: 'error',
      message: 'There was an error running migrations',
      details: error.message,
    });
  } finally {
    await db.close();
    console.log('Database connection closed');
  }
});

router.get('/', async (req, res) => {
  // Primeiro tenta pegar do cache
  const cachedUsers = getCache('users');
  if (cachedUsers) {
    return res.json({ fromCache: true, data: cachedUsers });
  }

  const db = await initDB(false);
  try {
    const users = await db.all('SELECT * FROM users');

    setCache('users', users, 60000);

    res.send({
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch(error) {
    return res.status(500).send({
      status: 'error',
      message: 'There was an error retrieving users',
      details: error.message,
    });
  } finally {
    await db.close();
    console.log('Database connection closed');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await initDB(true);
  try {
    const user = await db.all('SELECT * FROM users WHERE id = ?', [id]);

    res.send({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch(error) {
    return res.status(500).send({
      status: 'error',
      message: 'There was an error retrieving the user',
      details: error.message,
    });
  } finally {
    await db.close();
    console.log('Database connection closed');
  }
});

router.post('/', async (req, res) => {
  const db = await initDB(false);
  try {
  const { name, email } = req.body;

  await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

  res.send({
      message: 'User created successfully',
    });
  } catch(error) {
    return res.status(500).send({
      status: 'error',
      message: 'There was an error creating the user',
      details: error.message,
    });
  } finally {
    await db.close();
    console.log('Database connection closed');
  }
});

router.patch('/:id', async (req, res) => {
  const db = await initDB(false);
  try {
  const { name } = req.body;
  const { id } = req.params;

  if(!name) {
    return res.status(400).send({
      status: 'error',
      message: 'Name is required'
    });
  }
  
  await db.run('UPDATE users SET name = ? WHERE id = ?', [name, id]);

  res.send({
      message: 'User updated successfully',
    });
  } catch(error) {
    return res.status(500).send({
      status: 'error',
      message: 'There was an error updating the user',
      details: error.message,
    });
  } finally {
    await db.close();
    console.log('Database connection closed');
  }
});

router.delete('/:id', async (req, res) => {
  const db = await initDB(false);
  try {
    const { id } = req.params;

    await db.run('DELETE FROM users WHERE id = ?', [id]);

    res.send({
      message: 'User deleted successfully',
    });
  } catch(error) {
    return res.status(500).send({
      status: 'error',
      message: 'There was an error deleting the user',
      details: error.message,
    });
  } finally {
    await db.close();
    console.log('Database connection closed');
  }
});

export default router;