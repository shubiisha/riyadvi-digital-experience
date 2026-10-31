// ---------------------------------------------------------------------------
// Live request telemetry
// ---------------------------------------------------------------------------
// Keeps a bounded, in-process record of API traffic so the public /api/stack
// endpoint can report *real* observed numbers (request volume, latency, error
// rate) instead of static marketing copy. Deliberately ring-buffered: memory
// use stays flat no matter how long the container runs.
const MAX_SAMPLES = 400;
const startedAt = Date.now();

const state = {
  totalRequests: 0,
  apiRequests: 0,
  errorRequests: 0,
  // 4xx and 5xx are tracked separately on purpose. A 401/400/409 is the API
  // *correctly* rejecting a bad request (the verification suite fires plenty of
  // them deliberately); a 5xx is the server actually failing. Reporting only a
  // combined "error rate" makes a healthy service with disciplined input
  // validation look unstable, which is the opposite of what this endpoint exists
  // to prove.
  clientErrorRequests: 0,
  serverErrorRequests: 0,
  byRoute: new Map(),
  latencies: [],
};

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();

  state.totalRequests += 1;
  const isApi = req.path.startsWith('/api');
  if (isApi) state.apiRequests += 1;

  const done = () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

    if (res.statusCode >= 500) {
      state.errorRequests += 1;
      state.serverErrorRequests += 1;
    } else if (res.statusCode >= 400) {
      state.errorRequests += 1;
      state.clientErrorRequests += 1;
    }

    // Collapse /api/services/web-development -> /api/services for a useful
    // route histogram without unbounded key growth.
    const key = isApi ? '/' + req.path.split('/').filter(Boolean).slice(0, 2).join('/') : req.path;
    const current = state.byRoute.get(key) || { count: 0, totalMs: 0, lastStatus: 0 };
    current.count += 1;
    current.totalMs += durationMs;
    current.lastStatus = res.statusCode;
    state.byRoute.set(key, current);

    state.latencies.push(Number(durationMs.toFixed(2)));
    if (state.latencies.length > MAX_SAMPLES) state.latencies.shift();

    res.removeListener('finish', done);
    res.removeListener('close', done);
  };

  res.on('finish', done);
  res.on('close', done);

  next();
};

const getMetrics = () => {
  const sorted = [...state.latencies].sort((a, b) => a - b);
  const pct = (p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] : 0);

  const routes = [...state.byRoute.entries()]
    .map(([route, v]) => ({
      route,
      count: v.count,
      avgMs: Number((v.totalMs / v.count).toFixed(2)),
      lastStatus: v.lastStatus,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const sample = sorted.reduce((sum, v) => sum + v, 0);

  return {
    processUptimeSeconds: Number((process.uptime()).toFixed(1)),
    nodeVersion: process.version,
    memoryMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(1)),
    pid: process.pid,
    bootedAt: new Date(startedAt).toISOString(),
    totalRequests: state.totalRequests,
    apiRequests: state.apiRequests,
    errorRequests: state.errorRequests,
    errorRate: state.totalRequests ? Number(((state.errorRequests / state.totalRequests) * 100).toFixed(2)) : 0,
    latency: {
      samples: sorted.length,
      avgMs: sorted.length ? Number((sample / sorted.length).toFixed(2)) : 0,
      p50Ms: pct(0.5),
      p95Ms: pct(0.95),
      maxMs: sorted.length ? sorted[sorted.length - 1] : 0,
    },
    routes,
  };
};

module.exports = { metricsMiddleware, getMetrics };
