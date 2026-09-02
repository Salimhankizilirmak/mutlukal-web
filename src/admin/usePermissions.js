import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Fail closed: a user with NO row in admin_permissions (or any query error)
// has NO access to anything. Every admin account — including the primary
// one — needs an explicit row with the permissions it should have (see
// schema-v6-security-fix.sql). An earlier "no row = full access" convention
// was a real security hole: anyone who registered their own Supabase Auth
// account (public sign-up is on by default) automatically became a full
// admin with zero configuration.
const NO_ACCESS = {
  products: false,
  gallery: false,
  applications: false,
  leads: false,
  events: false,
  users: false,
  ads: false,
};

export default function usePermissions(userId) {
  const [perms, setPerms] = useState(null); // null = loading

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from('admin_permissions')
      .select('can_products, can_gallery, can_applications, can_leads, can_events, can_users, can_ads')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setPerms(NO_ACCESS);
          return;
        }
        setPerms({
          products: data.can_products,
          gallery: data.can_gallery,
          applications: data.can_applications,
          leads: data.can_leads,
          events: data.can_events,
          users: data.can_users,
          ads: data.can_ads,
        });
      })
      .catch(() => {
        if (!cancelled) setPerms(NO_ACCESS);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return perms; // null while loading
}
