const QUEUE_KEY = "elementopia_sync_queue";

export function getSyncQueue() {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(QUEUE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn("[OfflineSync] Failed to read sync queue from localStorage:", e);
        return [];
    }
}

export function enqueueSync({ type, url, method = "POST", payload }) {
    if (typeof window === "undefined") return;
    try {
        const queue = getSyncQueue();
        const item = {
            id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: type || "GENERIC_TELEMETRY",
            url,
            method,
            payload,
            queuedAt: new Date().toISOString(),
            retries: 0
        };
        queue.push(item);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        notifyQueueChange(queue.length);
        console.info(`[OfflineSync] Enqueued offline item (${item.type}). Pending in FIFO queue: ${queue.length}`);
    } catch (e) {
        console.warn("[OfflineSync] Failed to enqueue item to offline queue:", e);
    }
}

export async function syncOrEnqueue({ type, url, method = "POST", payload }) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        enqueueSync({ type, url, method, payload });
        return { status: "queued", offline: true };
    }

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
        }

        return { status: "success", data: await res.json().catch(() => ({})) };
    } catch (err) {
        console.warn(`[OfflineSync] Direct dispatch failed for ${type}. Enqueuing to offline FIFO queue:`, err.message);
        enqueueSync({ type, url, method, payload });
        return { status: "queued", error: err.message };
    }
}

let isFlushing = false;

export async function flushSyncQueue() {
    if (isFlushing) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;

    const queue = getSyncQueue();
    if (queue.length === 0) return;

    isFlushing = true;
    console.info(`[OfflineSync] Network connected. Flushing ${queue.length} pending telemetry items in FIFO order...`);

    const remaining = [...queue];

    while (remaining.length > 0) {
        const item = remaining[0];
        try {
            const res = await fetch(item.url, {
                method: item.method || "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item.payload)
            });

            if (res.ok) {
                remaining.shift();
                localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
                notifyQueueChange(remaining.length);
                console.info(`[OfflineSync] Successfully flushed item (${item.type})`);
            } else if (res.status >= 400 && res.status < 500) {
                console.warn(`[OfflineSync] Dropping client-rejected item (${item.type}): HTTP ${res.status}`);
                remaining.shift();
                localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
                notifyQueueChange(remaining.length);
            } else {
                item.retries = (item.retries || 0) + 1;
                localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
                console.warn(`[OfflineSync] Server error (${res.status}) on ${item.type}. Halting FIFO queue.`);
                break;
            }
        } catch (err) {
            console.warn(`[OfflineSync] Network lost during flush of ${item.type}. Halting:`, err.message);
            break;
        }
    }

    isFlushing = false;
}

function notifyQueueChange(count) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("elementopia:sync-queue-updated", { detail: { pendingCount: count } }));
    }
}

export function initOfflineSync() {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => {
        console.info("[OfflineSync] 'online' event detected. Triggering queue flush...");
        void flushSyncQueue();
    });

    window.addEventListener("focus", () => {
        void flushSyncQueue();
    });

    void flushSyncQueue();
}