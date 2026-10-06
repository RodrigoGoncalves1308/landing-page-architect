import { describe, expect, it } from "vitest";
import { CATALOGO_DEMO, calcularProposta, pedidoInputSchema, type CatalogoItem } from "./shared";

const cat: CatalogoItem[] = CATALOGO_DEMO.map((c) => ({ ...c, moeda: "EUR" }));

describe("calcularProposta", () => {
  it("calcula vários itens com preços do catálogo", () => {
    const r = calcularProposta([{ catalogoId: "playlist-evento", quantidade: 1 }, { catalogoId: "curadoria-espaco", quantidade: 3 }], cat);
    expect(r.ok && r.totalCentimos).toBe(15000 + 3 * 6000);
  });
  it("encaminha para revisão quantidade desconhecida", () => {
    expect(calcularProposta([{ catalogoId: "curadoria-espaco", quantidade: null }], cat).ok).toBe(false);
  });
  it("rejeita item inexistente ou inativo", () => {
    expect(calcularProposta([{ catalogoId: "inventado", quantidade: 1 }], cat).ok).toBe(false);
    const inativo = cat.map((c) => (c.id === "artigo-editorial" ? { ...c, ativo: false } : c));
    expect(calcularProposta([{ catalogoId: "artigo-editorial", quantidade: 1 }], inativo).ok).toBe(false);
  });
  it("copia preços para a proposta (alterações posteriores não a afetam)", () => {
    const r = calcularProposta([{ catalogoId: "artigo-editorial", quantidade: 2 }], cat);
    cat[3]!.precoUnitarioCentimos = 1;
    expect(r.ok && r.linhas[0]!.precoUnitarioCentimos).toBe(18000);
  });
});

describe("validação do formulário", () => {
  it("rejeita email inválido e pedido vazio", () => {
    expect(pedidoInputSchema.safeParse({ nome: "Ana", email: "x", pedido: "" }).success).toBe(false);
    expect(pedidoInputSchema.safeParse({ nome: "Ana Teste", email: "ana@exemplo.pt", pedido: "Quero uma playlist para evento" }).success).toBe(true);
  });
});
