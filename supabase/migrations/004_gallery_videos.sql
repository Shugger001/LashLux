-- Gallery media types: support images and videos (no destructive seed wipe)

alter table public.gallery
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image', 'video'));

alter table public.gallery
  add column if not exists poster_url text;

comment on column public.gallery.image_url is 'Primary media URL (image file or video file).';
comment on column public.gallery.poster_url is 'Optional poster/thumbnail for video items.';
