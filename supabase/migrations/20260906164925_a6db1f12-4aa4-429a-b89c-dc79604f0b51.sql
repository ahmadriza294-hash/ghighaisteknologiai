CREATE TABLE public.site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  admin_password text NOT NULL DEFAULT 'gh1gh415',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT (id, data, updated_at) ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.site_content (id, data) VALUES ('main', '{}'::jsonb);