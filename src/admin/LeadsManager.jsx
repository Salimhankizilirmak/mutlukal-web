import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, Mail, Phone } from 'lucide-react';

export default function LeadsManager({ table, title }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setRows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const handleDelete = async (row) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    const { error: delErr } = await supabase.from(table).delete().eq('id', row.id);
    if (delErr) setError('Silinemedi: ' + delErr.message);
    else load();
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold mb-6">{title}</h2>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      {loading ? (
        <div className="text-sm text-[#5C6B73]">Yükleniyor…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-[#5C6B73] bg-white p-6 rounded-2xl border border-[#C89438]/25">Henüz kayıt yok.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#C89438]/25 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-serif font-bold text-base">{r.full_name || r.name}</div>
                  <div className="text-[11px] text-[#5C6B73] mt-0.5">
                    {new Date(r.created_at).toLocaleString('tr-TR')}
                  </div>
                </div>
                <button onClick={() => handleDelete(r)} className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#5C6B73]">
                {r.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C89438]" /> {r.email}
                  </span>
                )}
                {r.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C89438]" /> {r.phone}
                  </span>
                )}
                {r.company && <span className="font-semibold">{r.company}</span>}
                {r.position && <span className="font-semibold">Pozisyon: {r.position}</span>}
                {r.product && <span className="font-semibold">Ürün: {r.product}</span>}
              </div>

              {r.message && <p className="text-sm text-[#1B2A3A] mt-3 leading-relaxed">{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
