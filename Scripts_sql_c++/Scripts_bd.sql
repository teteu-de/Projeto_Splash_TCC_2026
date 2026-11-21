-- SPLASH - SCRIPT DE CRIACAO DO BANCO E DAS TABELAS (PostgreSQL)
--
-- COMO USAR:
-- 1) Se o banco ainda nao existir, conectado ao banco administrativo:
--      CREATE DATABASE splash;
-- 2) Conecte-se ao banco splash e execute o restante deste arquivo.
--
-- IMPORTANTE:
-- Este script cria estrutura, tarifas e quatro usuarios de teste em uma instalacao nova.
-- Ele NAO restaura o usuario original Matheus, hashes de senha existentes ou medicoes.
-- A senha temporaria dos quatro usuarios de teste e 12345678.
-- Para migrar dados reais do banco atual, faca backup pelo pgAdmin/pg_dump.
-- Pensado para uma instalacao nova; nao execute sobre tabelas existentes
-- sem revisar antes.

BEGIN;

CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    categoria_tarifaria VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_categoria_tarifaria_check
        CHECK (categoria_tarifaria IN ('vulneravel', 'social', 'social2', 'residencial'))
);

CREATE TABLE public.sensores (
    id SERIAL PRIMARY KEY,
    identificador VARCHAR(100) NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sensores_usuario_id_fkey
        FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT
);

CREATE TABLE public.consumo (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    sensor VARCHAR(100) NOT NULL,
    pulsos INTEGER NOT NULL DEFAULT 0,
    vazao NUMERIC(10,3) NOT NULL DEFAULT 0,
    consumo NUMERIC(12,3) NOT NULL DEFAULT 0,
    consumo_acumulado NUMERIC(12,3) NOT NULL DEFAULT 0,
    data_hora TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT consumo_usuario_id_fkey
        FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_consumo_usuario_data
    ON public.consumo (usuario_id, data_hora DESC);

CREATE INDEX idx_consumo_sensor_id
    ON public.consumo (sensor, id DESC);

CREATE TABLE public.tarifas (
    id SERIAL PRIMARY KEY,
    categoria_tarifaria VARCHAR(20) NOT NULL,
    faixa_min_m3 NUMERIC(10,3) NOT NULL,
    faixa_max_m3 NUMERIC(10,3),
    tarifa_fixa_agua NUMERIC(10,2) NOT NULL DEFAULT 0,
    valor_m3_agua NUMERIC(10,4) NOT NULL DEFAULT 0,
    tarifa_fixa_esgoto NUMERIC(10,2) NOT NULL DEFAULT 0,
    valor_m3_esgoto NUMERIC(10,4) NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tarifas_categoria_check
        CHECK (categoria_tarifaria IN ('vulneravel', 'social', 'social2', 'residencial')),
    CONSTRAINT tarifas_faixa_check
        CHECK (faixa_min_m3 >= 0 AND (faixa_max_m3 IS NULL OR faixa_max_m3 > faixa_min_m3))
);

CREATE INDEX idx_tarifas_categoria_ativa
    ON public.tarifas (categoria_tarifaria, ativo, faixa_min_m3);

-- Tarifas iniciais transcritas da tabela fornecida para o projeto.
-- As tarifas fixas cobrem a faixa inicial; valores variaveis sao por m3.
INSERT INTO public.tarifas (
    categoria_tarifaria, faixa_min_m3, faixa_max_m3,
    tarifa_fixa_agua, valor_m3_agua,
    tarifa_fixa_esgoto, valor_m3_esgoto
)
VALUES
    ('vulneravel', 0, 10, 8.74, 0, 8.74, 0),
    ('vulneravel', 10, 20, 0, 1.10, 0, 1.10),
    ('vulneravel', 20, 30, 0, 3.67, 0, 3.67),
    ('vulneravel', 30, 50, 0, 11.10, 0, 11.10),
    ('vulneravel', 50, NULL, 0, 12.26, 0, 12.26),

    ('social', 0, 10, 11.46, 0, 11.46, 0),
    ('social', 10, 20, 0, 2.18, 0, 2.18),
    ('social', 20, 30, 0, 7.79, 0, 7.79),
    ('social', 30, 50, 0, 11.10, 0, 11.10),
    ('social', 50, NULL, 0, 12.26, 0, 12.26),

    ('social2', 0, 10, 20.21, 0, 20.21, 0),
    ('social2', 10, 15, 0, 3.20, 0, 3.20),
    ('social2', 15, 20, 0, 6.40, 0, 6.40),
    ('social2', 20, 50, 0, 15.95, 0, 15.95),
    ('social2', 50, NULL, 0, 17.57, 0, 17.57),

    ('residencial', 0, 10, 40.42, 0, 40.42, 0),
    ('residencial', 10, 20, 0, 6.40, 0, 6.40),
    ('residencial', 20, 50, 0, 15.95, 0, 15.95),
    ('residencial', 50, NULL, 0, 17.57, 0, 17.57);


-- Usuarios de teste para instalacao nova.
-- Senha temporaria para os quatro usuarios: 12345678
-- pgcrypto gera hashes Blowfish/bcrypt compativeis com bcrypt no Node.js.
-- Em ambiente real, troque as senhas e nao compartilhe este arquivo.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.usuarios (nome, email, senha_hash, categoria_tarifaria)
VALUES
    ('Teste Vulnerável', 'teste.vulneravel@splash.com',
     crypt('12345678', gen_salt('bf', 12)), 'vulneravel'),
    ('Teste Social 1', 'teste.social1@splash.com',
     crypt('12345678', gen_salt('bf', 12)), 'social'),
    ('Teste Social 2', 'teste.social2@splash.com',
     crypt('12345678', gen_salt('bf', 12)), 'social2'),
    ('Teste Residencial', 'teste.residencial@splash.com',
     crypt('12345678', gen_salt('bf', 12)), 'residencial')
ON CONFLICT (email) DO NOTHING;

-- Associa o sensor Splash ao usuario de teste vulneravel.
INSERT INTO public.sensores (identificador, usuario_id, ativo)
SELECT 'Splash', id, TRUE
FROM public.usuarios
WHERE email = 'teste.vulneravel@splash.com'
ON CONFLICT (identificador) DO NOTHING;

COMMIT;

-- Consultas opcionais de conferencia:
-- SELECT * FROM public.usuarios;
-- SELECT * FROM public.sensores;
-- SELECT * FROM public.consumo ORDER BY id;
-- SELECT * FROM public.tarifas ORDER BY categoria_tarifaria, faixa_min_m3;
