"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import DropdownSelect from "@/components/DropdownSelect";

/** ---------------- 基本設定 ---------------- */
const PAGE_SIZE = 50;
const API_BASE = "https://guangfu250923.pttapp.cc/supplies?embed=all";

type NeedItem = {
  // 對應 supply_item_id（要送給後端）
  id: string;
  name: string;
  qty: number | string;
  unit: string;
};
type Need = {
  id: string;
  title: string;
  desc: string; // 以換行分隔的地址/電話/備註
  items: NeedItem[];
  tags: string[];
  organizationKey: string; // 識別單位的 id，由 name|address|phone 組成
  createdAt: string;
};

/** 表單中每個可提供的物資 */
type SupplyRow = {
  /** random 字串，純前端表單識別用 */
  id: string;
  /** 對應要傳給後端的 supply_item_id */
  supplyItemId: string;
  name: string;
  qty: string;
  unit: string;
  tag?: string;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";

const asString = (v: unknown): string | undefined =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : undefined;

function buildListUrl(offset: number) {
  const u = new URL(API_BASE);
  u.searchParams.set("limit", String(PAGE_SIZE));
  u.searchParams.set("offset", String(offset));
  return u.toString();
}

/** ---------------- 解析 Hydra 回應 → Need[] ---------------- */
type HydraCollection = {
  member?: unknown[];
  limit?: number;
  offset?: number;
  totalItems?: number;
  next?: string | null;
  previous?: string | null;
};

function parseHydraToNeeds(payload: unknown): {
  needs: Need[];
  page: Required<Pick<HydraCollection, "limit" | "offset" | "totalItems">> & {
    next: string | null;
    previous: string | null;
  };
} {
  const empty = {
    needs: [] as Need[],
    page: {
      limit: PAGE_SIZE,
      offset: 0,
      totalItems: 0,
      next: null as string | null,
      previous: null as string | null,
    },
  };
  if (!isRecord(payload)) return empty;

  const col = payload as HydraCollection;

  const rows = Array.isArray(col.member) ? col.member : [];
  const limit = typeof col.limit === "number" ? col.limit : PAGE_SIZE;
  const offset = typeof col.offset === "number" ? col.offset : 0;
  const totalItems =
    typeof col.totalItems === "number" ? col.totalItems : rows.length;
  const next = typeof col.next === "string" ? col.next : null;
  const previous = typeof col.previous === "string" ? col.previous : null;

  const needs: Need[] = rows
    .filter(
      // 只保留尚缺物資的需求單
      (rowU) =>
        isRecord(rowU) &&
        Array.isArray(rowU.supplies) &&
        rowU.supplies.length > 0 &&
        rowU.supplies[0].recieved_count < rowU.supplies[0].total_count
    )
    .map((rowU, idx) => {
      if (!isRecord(rowU)) {
        return {
          id: String(idx),
          title: `需求 ${idx}`,
          desc: "",
          items: [],
          tags: [],
          createdAt: "",
          organizationKey: "",
        };
      }
      const row = rowU as Record<string, unknown>;

      const id = asString(row["id"]) ?? String(idx);
      const name = asString(row["name"]) ?? `需求 ${id}`;
      const address = asString(row["address"]) ?? "";
      const phone = asString(row["phone"]) ?? "";
      const notes = asString(row["notes"]) ?? "";
      const createdAt = asString(row["created_at"]) ?? "";

      // supplies -> items + tags（僅顯示）
      const suppliesArr = Array.isArray(row["supplies"])
        ? (row["supplies"] as {
            id: string;
            name: string;
            supply_id: string; // 物資單 ID
            tag?: string;
            total_count: number;
            unit: string;
          }[])
        : [];

      const items: NeedItem[] = suppliesArr.filter(isRecord).map((it) => {
        const itemName = asString(it["name"]) ?? "未命名";
        const total = (it["total_count"] as number) ?? 0;
        const unit = asString(it["unit"]) ?? "";

        return {
          id: it.id,
          name: itemName,
          qty: total,
          unit,
        };
      });

      const tags = Array.from(
        new Set(
          suppliesArr
            .filter(isRecord)
            .map((it) => asString(it["tag"]) || "")
            .filter(Boolean) as string[]
        )
      );

      // desc 多行（NeedCard 用 whitespace-pre-line 顯示）
      const descLines = [address, phone && `連絡電話：${phone}`, notes].filter(
        Boolean
      );
      const desc = descLines.join("\n");

      // 單位 key（用於合併需求單：將同個單位的多張單，合併成一張需求單）
      const organizationKey = `${name}|${address}|${phone}`;

      return { id, title: name, desc, items, tags, organizationKey, createdAt };
    });

  /**
   * 合併同單位的需求單。
   * 參考物資媒合的合併方法：https://github.com/Pinkowo/hualien-bees/blob/521eebb037880a8cc54b00a25f535a49b0bbb43d/src/App.vue#L1447-L1469
   */
  const mergeRequestsByOrganization = (list: Need[]) => {
    const mergedMap = new Map();
    list.forEach((req) => {
      const key = req.organizationKey;
      const itemsWithSupplyId = req.items.map((item) => ({
        ...item,
        supplyId: req.id,
      }));
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        existing.items.push(...itemsWithSupplyId);
        if (req.createdAt > existing.createdAt) {
          existing.createdAt = req.createdAt;
        }
      } else {
        mergedMap.set(key, {
          ...req,
          items: itemsWithSupplyId,
        });
      }
    });
    return Array.from(mergedMap.values());
  };

  const mergedNeeds = mergeRequestsByOrganization(needs);

  return {
    needs: mergedNeeds,
    page: { limit, offset, totalItems, next, previous },
  };
}

/** ---------------- Helpers ---------------- */
function cryptoRandomId() {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { crypto?: Crypto }).crypto?.getRandomValues ===
      "function"
  ) {
    const n = (globalThis as { crypto?: Crypto }).crypto!.getRandomValues(
      new Uint32Array(1)
    )[0];
    return (n >>> 0).toString(36);
  }
  return Math.random().toString(36).slice(2);
}

/** 送出：PATCH /supplies/:id（只送 name/address/phone/notes/pii_date） */
async function handleSubmitStationOnly(
  needId: string | null | undefined,
  data: {
    station: { name: string; phone: string; address: string; notes?: string };
    supplies: {
      id: string;
      unit: string;
      count: number;
    }[];
  },
  onOk?: () => void
) {
  if (!needId) {
    alert("請先在左側選擇一筆需求");
    return;
  }

  const { station, supplies } = data;

  if (!station.name?.trim() || !station.address?.trim()) {
    alert("請填寫物資站「名稱」、「地址」");
    return;
  }
  if (!station.phone?.trim()) {
    alert("請填寫物資站「電話」");
    return;
  }

  if (supplies.length === 0) {
    alert("請至少新增一筆可提供的物資");
    return;
  }

  if (supplies.some((s) => !s.id || s.count <= 0)) {
    alert("請確認每筆物資的名稱、數量皆已填寫");
    return;
  }

  const payloadList = supplies.map((supplyItem) => ({
    name: station.name.trim(),
    address: station.address.trim(),
    phone: (station.phone || "").trim(),
    notes: (station.notes || "").trim(),
    supply_item_id: supplyItem.id,
    provide_unit: supplyItem.unit,
    provide_count: supplyItem.count,
    pii_date: 0, // 依後端需求固定送 0
  }));

  try {
    // 因應 API 設計，每一筆物資需要各自打一次 API
    await Promise.all(
      payloadList.map(async (payload) => {
        const res = await fetch(
          `https://guangfu250923.pttapp.cc/supply_providers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            // 若改為 Cookie 驗證，需加 credentials: "include" 並請後端正確設定 CORS
            body: JSON.stringify({
              ...payload,
            }),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `POST 失敗：${res.status} ${res.statusText}\n${text}`
          );
        }
      })
    );

    alert("已更新物資站資訊！");
    onOk?.();
  } catch (e) {
    alert((e instanceof Error && e?.message) || "送出失敗");
  }
}

/** ---------------- 元件 ---------------- */
export default function ReliefFormPage() {
  const router = useRouter();

  // 登入門檻
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  // 物資站基本資訊（受控）
  const [stationName, setStationName] = useState("");
  const [stationPhone, setStationPhone] = useState("");
  const [stationAddress, setStationAddress] = useState("");
  const [stationNotes, setStationNotes] = useState("");

  // 右側「可提供的物資」動態列表
  const [supplies, setSupplies] = useState<SupplyRow[]>([
    {
      id: cryptoRandomId(),
      name: "",
      qty: "",
      unit: "",
      tag: "",
      supplyItemId: "",
    },
  ]);

  // 左側「需求清單」
  const [needs, setNeeds] = useState<Need[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // 選取中的需求 id（PATCH 用）
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
  // 選取中的需求單，底下所有需要的物資選項
  const [selectedNeedSupplyOptions, setSelectedNeedSupplyOptions] = useState<
    NeedItem[]
  >([]);

  const pageIndex = useMemo(() => Math.floor(offset / PAGE_SIZE) + 1, [offset]);

  // 登入檢查
  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = !!localStorage.getItem("line_oauth_state");
    setAuthed(flag);
    setAuthChecked(true);
  }, []);

  // 抓需求清單
  useEffect(() => {
    if (!authed) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const fetchList = async () => {
      setIsLoading(true);
      setErrMsg(null);
      try {
        const res = await fetch(buildListUrl(offset), {
          method: "GET",
          cache: "no-store",
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok)
          throw new Error(`API 錯誤：${res.status} ${res.statusText}`);

        const json: unknown = await res.json();
        const { needs: normalized, page } = parseHydraToNeeds(json);

        setNeeds(normalized);

        const more =
          (page.next && page.next.length > 0) ||
          page.offset + page.limit < page.totalItems;
        setHasNext(more);

        if (
          selectedNeedId &&
          !normalized.some((n) => n.id === selectedNeedId)
        ) {
          setSelectedNeedId(null);
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setErrMsg((err as Error).message ?? "發生未知錯誤");
        setNeeds([]);
        setHasNext(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
    return () => ac.abort();
  }, [offset, authed]);

  const goPrev = () => setOffset((o) => Math.max(0, o - PAGE_SIZE));
  const goNext = () => setOffset((o) => o + PAGE_SIZE);

  // 觸發 LINE SSO（未登入門擋頁用）
  const startLineLogin = () => {
    if (typeof window === "undefined") return;

    const next = encodeURIComponent(
      (window.location.pathname || "/") + (window.location.search || "")
    );

    const state = encodeURIComponent(JSON.stringify({ next }));
    window.location.href = `https://guangfu250923.pttapp.cc/auth/line/start?state=${encodeURIComponent(
      state
    )}&redirect_uri=${encodeURIComponent(
      `${window.location.origin}/auth/line/callback`
    )}`;
  };

  // 檢查中骨架
  if (!authChecked) {
    return (
      <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-600 shadow-sm">
          正在檢查登入狀態…
        </div>
      </main>
    );
  }

  // 未登入門擋頁
  if (!authed) {
    return (
      <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">需要先登入 LINE 才能填寫</h1>
          <p className="mt-2 text-sm text-slate-600">
            請先完成 LINE 登入後再回來此頁進行填寫。你也可以先返回首頁。
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
              onClick={() => (window.location.href = "/")}
            >
              返回首頁
            </button>
            <button
              type="button"
              className="rounded-xl border-0 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              onClick={startLineLogin}
            >
              前往 LINE 登入
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 已登入頁面
  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              物資站志工填單頁面
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {/* TODO: 等備註可以顯示時恢復文案 */}
              {/* 請填寫物資站資訊（會更新名稱、地址、電話與備註）。 */}
              請填寫物資站資訊（會更新名稱、地址、電話）。
            </p>
          </div>

          <div className="flex gap-2">
            <button
              disabled
              type="button"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm"
            >
              已登入
            </button>
            <button
              type="button"
              className="rounded-2xl border border-transparent bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 active:scale-[0.99]"
              onClick={() => {
                localStorage.removeItem("line_oauth_state");
                window.location.reload();
              }}
            >
              登出
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: 物資站基本資訊 + 需求清單 */}
          <section aria-labelledby="station-info" className="space-y-6">
            <Card>
              <CardHeader id="station-info">物資站資訊</CardHeader>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="物資站名稱"
                  id="stationName"
                  placeholder="例：光復里物資站"
                  value={stationName}
                  onChange={setStationName}
                />
                <Field
                  label="物資站電話"
                  id="stationPhone"
                  type="tel"
                  placeholder="例：0912-345-678"
                  value={stationPhone}
                  onChange={setStationPhone}
                />
                <Field
                  label="物資站地址"
                  id="stationAddress"
                  className="sm:col-span-2"
                  placeholder="例：花蓮縣光復鄉…"
                  value={stationAddress}
                  onChange={setStationAddress}
                />
                {/* 備註 notes */}
                {/* TODO: 由於前台目前空間不夠顯示備註欄為，因此暫時隱藏，不提供此功能 */}
                {/* <label className="block sm:col-span-2" htmlFor="stationNotes">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    備註（可選）
                  </span>
                  <textarea
                    id="stationNotes"
                    name="stationNotes"
                    placeholder="補充說明…"
                    value={stationNotes}
                    onChange={(e) => setStationNotes(e.target.value)}
                    className="min-h-[80px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                  />
                </label> */}
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between gap-3">
                <CardHeader>目前需求列表</CardHeader>

                {/* Pagination control */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    onClick={goPrev}
                    disabled={offset === 0 || isLoading}
                    aria-label="上一頁"
                  >
                    ← 上一頁
                  </button>
                  <div className="min-w-[90px] text-center text-sm text-slate-600">
                    第 <span className="font-semibold">{pageIndex}</span> 頁
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    onClick={goNext}
                    disabled={!hasNext || isLoading}
                    aria-label="下一頁"
                  >
                    下一頁 →
                  </button>
                </div>
              </div>

              {isLoading && <ListSkeleton />}
              {errMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  讀取失敗：{errMsg}
                </div>
              )}

              {!isLoading && !errMsg && (
                <>
                  {needs.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      這一頁目前沒有資料。
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {needs.map((n) => (
                        <li key={n.id}>
                          <NeedCard
                            data={n}
                            selected={selectedNeedId === n.id}
                            onSelect={() => {
                              setSelectedNeedId((prev) =>
                                prev === n.id ? null : n.id
                              );
                              setSelectedNeedSupplyOptions(n.items);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </Card>
          </section>

          {/* Right: 可提供的物資（僅前端紀錄） */}
          <section aria-labelledby="provide" className="space-y-6">
            <Card>
              <CardHeader id="provide">可提供的物資</CardHeader>

              <div className="space-y-3">
                {supplies.map((row) => (
                  <motion.div
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end border-b pb-3 border-gray-200"
                  >
                    <div className="sm:col-span-full">
                      <DropdownSelect
                        value={row.supplyItemId}
                        onChange={(value) =>
                          setSupplies((prevSupplies) =>
                            prevSupplies.map((supply) =>
                              supply.id === row.id
                                ? {
                                    ...supply,
                                    supplyItemId: value,
                                    unit:
                                      selectedNeedSupplyOptions.find(
                                        (o) => o.id === value
                                      )?.unit || "",
                                  }
                                : supply
                            )
                          )
                        }
                        defaultLabel="選擇物資名稱"
                        options={selectedNeedSupplyOptions.map((option) => {
                          return {
                            value: option.id,
                            label: option.name,
                          };
                        })}
                      />
                    </div>
                    <Field
                      label="數量"
                      id={`s-qty-${row.id}`}
                      type="number"
                      inputMode="numeric"
                      placeholder="例：10"
                      value={row.qty}
                      min={0}
                      onChange={(v) =>
                        setSupplies((s) =>
                          s.map((x) => (x.id === row.id ? { ...x, qty: v } : x))
                        )
                      }
                      className="sm:col-span-3"
                    />
                    <Field
                      label="量詞"
                      id={`s-unit-${row.id}`}
                      placeholder="例：箱 / 瓶 / 包"
                      value={row.unit}
                      onChange={(v) =>
                        setSupplies((s) =>
                          s.map((x) =>
                            x.id === row.id ? { ...x, unit: v } : x
                          )
                        )
                      }
                      className="sm:col-span-3"
                    />
                    <button
                      className="sm:col-span-2 text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={() =>
                        setSupplies((s) => s.filter((x) => x.id !== row.id))
                      }
                    >
                      刪除
                    </button>
                  </motion.div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    onClick={() =>
                      setSupplies((s) => [
                        ...s,
                        {
                          id: cryptoRandomId(),
                          supplyItemId: "",
                          name: "",
                          qty: "",
                          unit: "",
                          tag: "",
                        },
                      ])
                    }
                    aria-label="新增一列物資"
                  >
                    <span className="text-lg leading-none">＋</span> 新增一列
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  className="order-2 rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 sm:order-1"
                  onClick={() => router.push("/")}
                >
                  回首頁
                </button>

                <button
                  type="button"
                  className="order-1 rounded-2xl border-0 bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] sm:order-2 disabled:opacity-50"
                  disabled={!selectedNeedId || isLoading}
                  onClick={() =>
                    handleSubmitStationOnly(
                      selectedNeedId,
                      {
                        station: {
                          name: stationName,
                          phone: stationPhone,
                          address: stationAddress,
                          notes: stationNotes,
                        },
                        supplies: supplies.map((supply) => ({
                          id: supply.supplyItemId,
                          count: Number(supply.qty),
                          unit: supply.unit,
                        })),
                      },
                      () => setOffset((o) => o) // 送出成功後重抓目前頁
                    )
                  }
                >
                  送出
                </button>
              </div>
              <div className="mt-4 text-sm text-slate-500 text-right font-semibold">
                為保持每天都有最新的物資資訊，送出的物資記錄將於每日 22:00 清除
              </div>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}

/** ---------------- UI atoms ---------------- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {children}
    </div>
  );
}

function CardHeader({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2 id={id} className="mb-4 text-lg font-semibold tracking-tight">
      {children}
    </h2>
  );
}

function Field({
  label,
  id,
  className,
  type = "text",
  inputMode,
  placeholder,
  value,
  onChange,
  min,
}: {
  label: string;
  id: string;
  className?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  min?: number;
}) {
  return (
    <label className={`block ${className || ""}`} htmlFor={id}>
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        min={min}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
      />
    </label>
  );
}

/** 可點選、含原生核選方塊（a11y）、不顯示 ID，地址/電話分行 */
function NeedCard({
  data,
  selected,
  onSelect,
}: {
  data: Need;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div
      className={[
        "group flex gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4",
        "cursor-pointer transition shadow-sm hover:bg-slate-50",
        selected ? "ring-2 ring-emerald-500" : "ring-0",
      ].join(" ")}
      role="checkbox"
      aria-checked={!!selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      {/* 原生 checkbox：阻止冒泡，避免與外層 onClick 重複觸發 */}
      <div className="mt-0.5">
        <input
          type="checkbox"
          checked={!!selected}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          aria-label={`選取需求：${data.title}`}
          className="h-5 w-5 rounded-md border-slate-300 accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-base font-semibold">
            {data.title}
            {selected && (
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                已選
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {data.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 地址 / 電話 / 備註：以換行顯示 */}
        {data.desc && (
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
            {data.desc}
          </p>
        )}

        <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {data.items.map((it, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200"
            >
              <span className="truncate">{it.name}</span>
              <span className="shrink-0 tabular-nums text-slate-700">
                {it.qty} {it.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="animate-pulse">
          <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="mt-0.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-white"></span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-3/4 rounded bg-slate-200" />
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                <div className="h-8 rounded bg-white ring-1 ring-slate-200" />
                <div className="h-8 rounded bg-white ring-1 ring-slate-200" />
              </div>
              <div className="h-3 w-24 rounded bg-slate-200" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
