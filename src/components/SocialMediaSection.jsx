import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Share2,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  Repeat2,
  ThumbsUp,
  Send,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react';

const SOCIAL_LINKS = {
  x: 'https://x.com/MutlukalGida',
  instagram: 'https://www.instagram.com/mutlukalgida/',
  facebook: 'https://www.facebook.com/mutlukalgida/?locale=tr_TR',
};

// Real photos for the Instagram mock cards — index-matched to social.igPosts
// in the translation files (text only comes from there).
const IG_IMAGES = ['/images/social/uretim-hatti.jpg', '/images/social/bize-katilin-ilan.jpg'];
const IG_GRADIENTS = ['from-[#F58529] via-[#DD2A7B] to-[#8134AF]', 'from-[#8134AF] via-[#515BD4] to-[#1B2A3A]'];
const IG_LIKES = [214, 132];
const X_STATS = [{ replies: 4, retweets: 9, likes: 26 }, { replies: 2, retweets: 14, likes: 41 }];
const FB_STATS = [{ likes: 58, comments: 6 }, { likes: 34, comments: 3 }];

export default function SocialMediaSection() {
  const { t } = useTranslation();

  return (
    <section id="sosyal-medya" className="py-24 bg-[#FAF3E3] text-[#1B2A3A] relative border-t border-[#C89438]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C89438]/35 text-[#C89438] text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Share2 className="w-3.5 h-3.5 text-[#C89438]" />
            <span>{t('social.eyebrow')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B2A3A] tracking-tight mb-4">
            {t('social.title')}
          </h2>
          <p className="text-base text-[#5C6B73] font-normal">
            {t('social.subtitle')}
          </p>
        </div>
        <p className="text-center text-xs text-[#5C6B73]/70 italic mb-16">
          {t('social.disclaimer')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <XCard t={t} />
          <FacebookCard t={t} />
          <InstagramCard t={t} />
        </div>
      </div>
    </section>
  );
}

function CardShell({ icon, label, href, children, t }) {
  return (
    <div className="rounded-2xl border border-[#C89438]/20 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <SocialCardHeader icon={icon} label={label} href={href} />
      <div className="flex-1">{children}</div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 mx-4 my-4 py-2.5 rounded-xl bg-[#1B2A3A] text-white font-bold text-xs hover:bg-[#C89438] transition-colors"
      >
        {t('social.viewAll')} <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function SocialCardHeader({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-5 py-4 border-b border-[#C89438]/15 bg-[#FAF3E3] group"
    >
      <span className="flex items-center gap-2 font-serif font-bold text-[#1B2A3A] group-hover:text-[#C89438] transition-colors">
        <Icon className="w-4 h-4 text-[#C89438]" />
        {label}
      </span>
      <ExternalLink className="w-3.5 h-3.5 text-[#C89438]/50 group-hover:text-[#C89438] transition-colors" />
    </a>
  );
}

/* ---------------------------------------------------------------------- */
/* X (Twitter) — feed of tweet rows                                       */
/* ---------------------------------------------------------------------- */
function XCard({ t }) {
  const posts = t('social.xPosts', { returnObjects: true });
  return (
    <CardShell icon={Twitter} label="X (Twitter)" href={SOCIAL_LINKS.x} t={t}>
      <div className="divide-y divide-[#C89438]/10">
        {posts.map((post, i) => (
          <div key={i} className="flex gap-3 px-4 py-3.5 hover:bg-[#FAF3E3]/40 transition-colors">
            <img
              src="/logo.png"
              alt="Mutlukal"
              className="w-10 h-10 rounded-full object-contain bg-white border border-[#C89438]/25 p-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[13px] flex-wrap">
                <span className="font-bold text-[#1B2A3A]">Mutlukal Gıda</span>
                <span className="text-[#5C6B73]">@MutlukalGida · {post.time}</span>
              </div>
              <p className="text-sm text-[#1B2A3A] mt-0.5 leading-snug">{post.text}</p>
              <div className="flex items-center gap-5 mt-2.5 text-[#5C6B73]">
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-3.5 h-3.5" /> {X_STATS[i]?.replies}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Repeat2 className="w-3.5 h-3.5" /> {X_STATS[i]?.retweets}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Heart className="w-3.5 h-3.5" /> {X_STATS[i]?.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

/* ---------------------------------------------------------------------- */
/* Facebook — feed of page-post rows                                      */
/* ---------------------------------------------------------------------- */
function FacebookCard({ t }) {
  const posts = t('social.fbPosts', { returnObjects: true });
  return (
    <CardShell icon={Facebook} label="Facebook" href={SOCIAL_LINKS.facebook} t={t}>
      <div className="divide-y divide-[#C89438]/10">
        {posts.map((post, i) => (
          <div key={i} className="px-4 py-3.5">
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src="/logo.png"
                alt="Mutlukal"
                className="w-9 h-9 rounded-full object-contain bg-white border border-[#C89438]/25 p-1 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#1B2A3A]">Mutlukal Gıda A.Ş.</div>
                <div className="text-[11px] text-[#5C6B73]">{post.time}</div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#5C6B73]/50 shrink-0" />
            </div>
            <p className="text-sm text-[#1B2A3A] leading-snug mb-2.5">{post.text}</p>
            <div className="flex items-center gap-5 text-[#5C6B73] pt-1 border-t border-[#C89438]/10">
              <span className="flex items-center gap-1.5 text-xs pt-2">
                <ThumbsUp className="w-3.5 h-3.5 text-[#1877F2]" /> {FB_STATS[i]?.likes}
              </span>
              <span className="flex items-center gap-1.5 text-xs pt-2">
                <MessageCircle className="w-3.5 h-3.5" /> {FB_STATS[i]?.comments}
              </span>
              <span className="flex items-center gap-1.5 text-xs pt-2">
                <Share2 className="w-3.5 h-3.5" /> {t('social.fbShare')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

/* ---------------------------------------------------------------------- */
/* Instagram — square-image feed rows                                     */
/* ---------------------------------------------------------------------- */
function InstagramCard({ t }) {
  const posts = t('social.igPosts', { returnObjects: true });
  return (
    <CardShell icon={Instagram} label="Instagram" href={SOCIAL_LINKS.instagram} t={t}>
      <div className="divide-y divide-[#C89438]/10">
        {posts.map((post, i) => (
          <div key={i}>
            <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-2">
              <img
                src="/logo.png"
                alt="Mutlukal"
                className="w-8 h-8 rounded-full object-contain bg-white border border-[#C89438]/25 p-0.5 shrink-0"
              />
              <span className="text-[13px] font-bold text-[#1B2A3A]">mutlukalgida</span>
            </div>
            <InstagramPostImage src={IG_IMAGES[i]} gradient={IG_GRADIENTS[i]} />

            <div className="px-4 pt-2 pb-3.5">
              <div className="flex items-center gap-4 text-[#1B2A3A] mb-1.5">
                <Heart className="w-4.5 h-4.5" />
                <MessageCircle className="w-4.5 h-4.5" />
                <Send className="w-4.5 h-4.5" />
                <Bookmark className="w-4.5 h-4.5 ml-auto rtl:ml-0 rtl:mr-auto" />
              </div>
              <div className="text-xs font-bold text-[#1B2A3A] mb-1">{IG_LIKES[i]} {t('social.igLikes')}</div>
              <p className="text-xs text-[#1B2A3A] leading-snug">
                <span className="font-bold">mutlukalgida</span> {post.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

// Shows the real photo when available; falls back to the gradient tile
// (e.g. before the image file has been added to the project) instead of a
// broken-image icon.
function InstagramPostImage({ src, gradient }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`h-40 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Instagram className="w-8 h-8 text-white/70" />
      </div>
    );
  }

  return (
    <div className="h-40 w-full overflow-hidden bg-[#FAF3E3]">
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
