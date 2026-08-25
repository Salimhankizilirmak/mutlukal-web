import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// A user with NO row in admin_permissions is treated as a full/grandfather
// admin (this is how your own first account — created directly in the
// Supabase Dashboard — keeps access to everything). Any user created via
// the "Kullanıcılar" tab always gets an explicit row, so they only see
// what was checked for them.
const FULL_ACCESS = {
  products: true,
  gallery: true,
  applications: true,
  leads: true,
  events: true,
  users: true,
  ads: true,
};

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
      .then(({ data }) => {
        if (cancelled) return;
        if (!data) {
          setPerms(FULL_ACCESS);
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
