import { useState, useEffect } from 'react';
import { supabase } from '../src/components/supabaseClient.js';
import Auth from '../src/components/Auth.jsx';
import KanbanBoard from '../src/components/KanbanBoard.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0f0f13',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#4a4a60', fontFamily: 'DM Sans, sans-serif', fontSize: 15,
      }}>
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <KanbanBoard user={session.user} />;
}
