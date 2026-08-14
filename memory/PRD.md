# PRD — SlanGO Quiz de Gírias (Flutter)

## Contexto
App Flutter educativo (`/app/slango_app`). O módulo de quiz apresenta 3 questões por gíria, agrupadas em sequência: **Significado → Impacto → Aplicação**.

## Requisitos ativos
1. Sequência agrupada por gíria (Significado → Impacto → Aplicação) — MANTIDA.
2. Ao errar QUALQUER uma das 3 questões da gíria, exibir a tela de explicação daquela gíria como feedback.
3. Na questão de Impacto, exibir sempre (acerto ou erro) uma caixinha informativa com o campo `impacto_motivo` da gíria.
4. Manter identidade visual (cardDark, borda roxo claro, ícone lightbulb, tipografia atual).

## O que foi implementado nesta sessão (Jan/2026)
- **Fix 1**: removida a deduplicação `_explicacoesJaVistas`. Agora `_explicacaoDeErroPendente()` retorna a explicação da gíria a cada resposta errada (Significado, Impacto ou Aplicação), inclusive múltiplas vezes na mesma gíria — conforme escolha do usuário (opção 1a).
- **Fix 2**: caixinha `impacto_motivo` movida de dentro de `_buildAlternativa` (que só renderizava colada à alternativa correta) para um bloco único abaixo da lista de alternativas via `_buildImpactoMotivoCard`. Aparece sempre que a questão é de impacto e há `impactoMotivo` — independente de acerto/erro (opção 2a).
- **Fix 3 (estilização)**: `_buildImpactoMotivoCard` reutiliza `cardDark`, borda `roxoClaro.withOpacity(0.45)`, sombra suave em `roxo`, ícone `Icons.lightbulb_outline_rounded` e mesma tipografia dos componentes de feedback. A borda passou de verde para roxo (cor primária/neutra do DS), já que a caixinha agora também aparece em respostas erradas — evita conflito visual com o painel vermelho de feedback.
- `ListView.separated` das alternativas convertido para `SingleChildScrollView + Column`, permitindo anexar a caixinha como último item sem alterar o comportamento de scroll (scroll-to-end continua funcionando via `_alternativasController`).

## Arquivos alterados
- `lib/quiz_page.dart` (única mudança)

## Modelo de dados (não alterado)
`Fase.impactoMotivo` já é parseado em `lib/fase/fase.dart` aceitando tanto `impactoMotivo` quanto `impacto_motivo` do JSON.

## Backlog / próximos passos
- Rodar `flutter analyze` + `flutter test` num ambiente com Flutter instalado (não disponível neste contêiner).
- Verificar em runtime que o backend está retornando `impacto_motivo` para todas as gírias — se algum item vier vazio, a caixinha não aparece (comportamento intencional).
- Considerar analytics para medir quantos usuários leem a explicação repetida na mesma gíria (base para ajustar frequência no futuro).
