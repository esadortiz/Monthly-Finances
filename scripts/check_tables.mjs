import { createClient } from '@supabase/supabase-js';

const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb3ZweHd3dG96Z3Fua21ydWNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUyNTU4NywiZXhwIjoyMDk5MTAxNTg3fQ.u_SwQe6r5kCUxGSRQ8EpklJWK5JLmVX6bavqkGezN6k';

const supabase = createClient(
  'https://wdovpxwwtozgqnkmruch.supabase.co',
  serviceKey,
  {
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'Authorization': 'Bearer ' + serviceKey,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const tables = ['cuentas', 'categorias', 'ingresos', 'gastos'];
for (const t of tables) {
  const { data, error } = await supabase.from(t).select('id').limit(1);
  if (error) {
    console.log(t + ': ERROR - ' + error.message);
  } else {
    console.log(t + ': ' + JSON.stringify(data));
  }
}
