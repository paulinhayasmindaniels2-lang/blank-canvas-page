-- Tabela de planos (assinaturas do site)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text,
  preco_centavos integer not null default 0,
  periodo text not null default 'mensal' check (periodo in ('mensal', 'anual', 'vitalicio')),
  destaque boolean not null default false,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.plans is 'Planos de assinatura oferecidos pelo site';

-- Tabela de recursos (features) de cada plano
create table if not exists public.plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  descricao text not null,
  incluido boolean not null default true,
  ordem integer not null default 0,
  criado_em timestamptz not null default now()
);

comment on table public.plan_features is 'Recursos/benefícios listados em cada plano';

-- Tabela de assinaturas dos usuários
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  status text not null default 'ativa' check (status in ('ativa', 'cancelada', 'expirada', 'pendente')),
  iniciado_em timestamptz not null default now(),
  expira_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (user_id, plan_id, status)
);

comment on table public.subscriptions is 'Assinaturas de planos feitas pelos usuários';

create index if not exists idx_plan_features_plan_id on public.plan_features(plan_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_plan_id on public.subscriptions(plan_id);

-- Trigger para manter atualizado_em em dia
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_plans_atualizado_em on public.plans;
create trigger trg_plans_atualizado_em
  before update on public.plans
  for each row execute function public.set_atualizado_em();

drop trigger if exists trg_subscriptions_atualizado_em on public.subscriptions;
create trigger trg_subscriptions_atualizado_em
  before update on public.subscriptions
  for each row execute function public.set_atualizado_em();

-- RLS
alter table public.plans enable row level security;
alter table public.plan_features enable row level security;
alter table public.subscriptions enable row level security;

-- Planos e recursos são públicos para leitura (vitrine do site)
drop policy if exists "Planos visíveis publicamente" on public.plans;
create policy "Planos visíveis publicamente"
  on public.plans for select
  using (ativo = true);

drop policy if exists "Recursos de planos visíveis publicamente" on public.plan_features;
create policy "Recursos de planos visíveis publicamente"
  on public.plan_features for select
  using (true);

-- Assinaturas: cada usuário só vê e gerencia as suas próprias
drop policy if exists "Usuário vê suas assinaturas" on public.subscriptions;
create policy "Usuário vê suas assinaturas"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Usuário cria suas assinaturas" on public.subscriptions;
create policy "Usuário cria suas assinaturas"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza suas assinaturas" on public.subscriptions;
create policy "Usuário atualiza suas assinaturas"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Dados iniciais (seed) dos planos
insert into public.plans (slug, nome, descricao, preco_centavos, periodo, destaque, ordem)
values
  ('gratis', 'Grátis', 'Acesso às matérias essenciais do dia a dia.', 0, 'mensal', false, 1),
  ('assinante', 'Assinante', 'Acesso completo a todas as matérias e newsletters exclusivas.', 1990, 'mensal', true, 2),
  ('anual', 'Assinante Anual', 'Todo o conteúdo com desconto para pagamento anual.', 19900, 'anual', false, 3)
on conflict (slug) do nothing;

insert into public.plan_features (plan_id, descricao, incluido, ordem)
select p.id, f.descricao, f.incluido, f.ordem
from public.plans p
join (
  values
    ('gratis', 'Acesso a matérias gratuitas', true, 1),
    ('gratis', 'Newsletter semanal', true, 2),
    ('gratis', 'Conteúdo exclusivo para assinantes', false, 3),
    ('assinante', 'Acesso ilimitado a todas as matérias', true, 1),
    ('assinante', 'Newsletter diária exclusiva', true, 2),
    ('assinante', 'Sem anúncios', true, 3),
    ('assinante', 'Suporte prioritário', true, 4),
    ('anual', 'Acesso ilimitado a todas as matérias', true, 1),
    ('anual', 'Newsletter diária exclusiva', true, 2),
    ('anual', 'Sem anúncios', true, 3),
    ('anual', 'Suporte prioritário', true, 4),
    ('anual', '2 meses grátis no pagamento anual', true, 5)
) as f(slug, descricao, incluido, ordem) on f.slug = p.slug
on conflict do nothing;
