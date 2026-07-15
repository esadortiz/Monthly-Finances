import { Pool } from 'pg';

const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb3ZweHd3dG96Z3Fua21ydWNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUyNTU4NywiZXhwIjoyMDk5MTAxNTg3fQ.u_SwQe6r5kCUxGSRQ8EpklJWK5JLmVX6bavqkGezN6k';
const ref = 'wdovpxwwtozgqnkmruch';
const regions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'eu-central-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'sa-east-1', 'ca-central-1'];

async function tryRegion(region) {
  return new Promise(resolve => {
    const pool = new Pool({
      user: 'postgres.' + ref,
      password: key,
      host: 'aws-0-' + region + '.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });
    pool.query('SELECT 1 as test', (err, res) => {
      if (err) {
        console.log(region + ': ' + err.message.substring(0, 60));
      } else {
        console.log(region + ': SUCCESS');
      }
      pool.end();
      resolve(!err);
    });
  });
}

async function main() {
  for (const r of regions) {
    const ok = await tryRegion(r);
    if (ok) {
      console.log('\nFound region: ' + r);
      break;
    }
  }
}
main().catch(e => console.log(e));
