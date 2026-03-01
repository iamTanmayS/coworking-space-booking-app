import pool from '../config/db/db.js';

async function run() {
    try {
        console.log('Running migration...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS operators (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                avatar TEXT,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Migrate existing owners to operators so FK constraint succeeds
            INSERT INTO operators (id, name, email, phone, avatar, is_verified)
            SELECT DISTINCT u.id, u.name, u.email, u.phone_number, u.profile_image, u.email_verified
            FROM users u
            INNER JOIN spaces s ON u.id = s.owner_id
            ON CONFLICT (email) DO NOTHING;

            -- Drop old constraint (if it exists)
            ALTER TABLE spaces DROP CONSTRAINT IF EXISTS spaces_owner_id_fkey;

            -- Add new constraint
            ALTER TABLE spaces ADD CONSTRAINT spaces_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES operators(id) ON DELETE CASCADE;
        `);
        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

run();
