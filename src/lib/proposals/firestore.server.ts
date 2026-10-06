// Minimal Cloud Firestore REST client authenticated with a service account (Worker-compatible).
import { SignJWT, importPKCS8 } from "jose";

type ServiceAccount = { project_id: string; client_email: string; private_key: string };

export function getServiceAccount(): ServiceAccount | null {
  const raw = process.env["FIREBASE_SERVICE_ACCOUNT"];
  if (!raw) return null;
  try {
    const sa = JSON.parse(raw) as ServiceAccount;
    if (!sa.project_id || !sa.client_email || !sa.private_key) return null;
    return sa;
  } catch {
    return null;
  }
}

let cached: { token: string; exp: number } | null = null;

async function accessToken(sa: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;
  const key = await importPKCS8(sa.private_key.replace(/\\n/g, "\n"), "RS256");
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/datastore" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`Falha na autenticação Firebase (${res.status}).`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, exp: now + json.expires_in };
  return json.access_token;
}

/* ---------- value encoding ---------- */
type FsValue = Record<string, unknown>;
function enc(v: unknown): FsValue {
  if (v === null || v === undefined) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } };
  return { mapValue: { fields: encFields(v as Record<string, unknown>) } };
}
const encFields = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, x]) => x !== undefined).map(([k, x]) => [k, enc(x)]));

function dec(v: FsValue): unknown {
  if ("nullValue" in v) return null;
  if ("booleanValue" in v) return v["booleanValue"];
  if ("integerValue" in v) return Number(v["integerValue"]);
  if ("doubleValue" in v) return v["doubleValue"];
  if ("stringValue" in v) return v["stringValue"];
  if ("timestampValue" in v) return v["timestampValue"];
  if ("arrayValue" in v) return ((v["arrayValue"] as { values?: FsValue[] }).values ?? []).map(dec);
  if ("mapValue" in v) return decFields((v["mapValue"] as { fields?: Record<string, FsValue> }).fields ?? {});
  return null;
}
const decFields = (f: Record<string, FsValue>) => Object.fromEntries(Object.entries(f).map(([k, x]) => [k, dec(x)]));

type RawDoc = { name: string; fields?: Record<string, FsValue> };
const toObj = <T>(d: RawDoc) => ({ id: d.name.split("/").pop()!, ...decFields(d.fields ?? {}) }) as T;

/* ---------- operations ---------- */
export class FirestoreNotConfigured extends Error {}

async function call(path: string, init: RequestInit = {}) {
  const sa = getServiceAccount();
  if (!sa) throw new FirestoreNotConfigured("FIREBASE_SERVICE_ACCOUNT não configurado.");
  const token = await accessToken(sa);
  const base = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`;
  return fetch(`${base}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(init.headers ?? {}) },
  });
}

async function fail(res: Response, what: string): Promise<never> {
  const body = await res.text();
  console.error(`Firestore ${what} falhou [${res.status}]: ${body.slice(0, 300)}`);
  throw new Error(`Erro na base de dados (${what}, ${res.status}).`);
}

export async function getDoc<T>(col: string, id: string): Promise<T | null> {
  const res = await call(`/${col}/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) await fail(res, "leitura");
  return toObj<T>(await res.json());
}

/** Creates a document only if it does not exist yet. Returns false when it already existed. */
export async function createDoc(col: string, id: string, data: Record<string, unknown>): Promise<boolean> {
  const res = await call(`/${col}?documentId=${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify({ fields: encFields(data) }),
  });
  if (res.status === 409) return false;
  if (!res.ok) await fail(res, "criação");
  return true;
}

export async function updateDoc(col: string, id: string, data: Record<string, unknown>) {
  const mask = Object.keys(data).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
  const res = await call(`/${col}/${encodeURIComponent(id)}?${mask}&currentDocument.exists=true`, {
    method: "PATCH",
    body: JSON.stringify({ fields: encFields(data) }),
  });
  if (!res.ok) await fail(res, "atualização");
}

export async function listDocs<T>(col: string, opts: { orderBy?: string; limit?: number; where?: [string, unknown] } = {}): Promise<T[]> {
  const structuredQuery: Record<string, unknown> = { from: [{ collectionId: col }], limit: opts.limit ?? 300 };
  if (opts.orderBy) structuredQuery["orderBy"] = [{ field: { fieldPath: opts.orderBy }, direction: "DESCENDING" }];
  if (opts.where) structuredQuery["where"] = { fieldFilter: { field: { fieldPath: opts.where[0] }, op: "EQUAL", value: enc(opts.where[1]) } };
  const res = await call(`:runQuery`, { method: "POST", body: JSON.stringify({ structuredQuery }) });
  if (!res.ok) await fail(res, "consulta");
  const rows = (await res.json()) as { document?: RawDoc }[];
  return rows.filter((r) => r.document).map((r) => toObj<T>(r.document!));
}
