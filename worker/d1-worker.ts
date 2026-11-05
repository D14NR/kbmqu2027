
const TABLES = {
  accounts_cabang: {
    pk: "id_cabang",
    columns: [
      "nama_cabang", "role", "username", "password"
    ],
    search: ["nama_cabang", "username", "role"],
    sort: ["id_cabang", "nama_cabang", "role"],
    filter: ["role"],
    select: `
      SELECT id_cabang, nama_cabang, role, username,
             created_at, updated_at
      FROM accounts_cabang
    `
  },

  pengajar: {
    pk: "id_pengajar",
    columns: [
      "kode_pengajar", "nip_pengajar", "nama_pengajar",
      "jenjang_studi", "mata_pelajaran", "email_pengajar",
      "no_wa_pengajar", "asal_cabang", "username", "password"
    ],
    search: [
      "kode_pengajar", "nip_pengajar", "nama_pengajar",
      "email_pengajar", "no_wa_pengajar"
    ],
    sort: ["id_pengajar", "nama_pengajar", "kode_pengajar"],
    filter: ["asal_cabang", "jenjang_studi"],
    select: `
      SELECT p.id_pengajar, p.kode_pengajar, p.nip_pengajar,
        p.nama_pengajar, p.jenjang_studi, p.mata_pelajaran,
        p.email_pengajar, p.no_wa_pengajar, p.asal_cabang,
        c.nama_cabang, p.username, p.created_at, p.updated_at
      FROM pengajar p
      LEFT JOIN accounts_cabang c
        ON c.id_cabang = p.asal_cabang
    `
  },

  mata_pelajaran: {
    pk: "id_mata_pelajaran",
    columns: [
      "kategori", "jenjang_studi",
      "mata_pelajaran", "kode_mata_pelajaran"
    ],
    search: ["mata_pelajaran", "kode_mata_pelajaran", "kategori"],
    sort: ["id_mata_pelajaran", "mata_pelajaran"],
    filter: ["kategori", "jenjang_studi"],
    select: `
      SELECT * FROM mata_pelajaran
    `
  },

  jadwal_kbm: {
    pk: "id_kbm",
    columns: [
      "cabang_kbm", "asal_sekolah", "jenjang_studi",
      "kelas", "bulan_kbm", "tanggal_kbm", "hari_kbm",
      "sesi_kbm", "id_pengajar", "id_mata_pelajaran",
      "jam_mulai_kbm", "jam_selesai_kbm"
    ],
    search: [
      "j.asal_sekolah", "j.kelas", "p.nama_pengajar",
      "p.kode_pengajar", "m.mata_pelajaran"
    ],
    sort: ["id_kbm", "tanggal_kbm", "jam_mulai_kbm"],
    filter: [
      "cabang_kbm", "id_pengajar", "id_mata_pelajaran",
      "jenjang_studi", "kelas", "bulan_kbm", "tanggal_kbm"
    ],
    select: `
      SELECT j.*, c.nama_cabang,
        p.kode_pengajar, p.nip_pengajar, p.nama_pengajar,
        p.no_wa_pengajar,
        m.kategori, m.mata_pelajaran, m.kode_mata_pelajaran
      FROM jadwal_kbm j
      LEFT JOIN accounts_cabang c
        ON c.id_cabang = j.cabang_kbm
      LEFT JOIN pengajar p
        ON p.id_pengajar = j.id_pengajar
      LEFT JOIN mata_pelajaran m
        ON m.id_mata_pelajaran = j.id_mata_pelajaran
    `
  },

  izin_pengajar: {
    pk: "id_izin",
    columns: [
      "id_pengajar", "asal_cabang", "target_cabang",
      "tanggal_mulai_izin", "tanggal_selesai_izin",
      "keterangan", "status", "disetujui_cabang",
      "tanggal_disetujui"
    ],
    search: [
      "p.nama_pengajar", "p.kode_pengajar", "i.keterangan"
    ],
    sort: ["id_izin", "tanggal_mulai_izin"],
    filter: ["id_pengajar", "asal_cabang", "target_cabang", "status"],
    select: `
      SELECT i.*,
        p.kode_pengajar, p.nip_pengajar, p.nama_pengajar,
        a.nama_cabang AS nama_cabang_asal,
        t.nama_cabang AS nama_cabang_target,
        d.nama_cabang AS nama_cabang_penyetuju
      FROM izin_pengajar i
      LEFT JOIN pengajar p
        ON p.id_pengajar = i.id_pengajar
      LEFT JOIN accounts_cabang a
        ON a.id_cabang = i.asal_cabang
      LEFT JOIN accounts_cabang t
        ON t.id_cabang = i.target_cabang
      LEFT JOIN accounts_cabang d
        ON d.id_cabang = i.disetujui_cabang
    `
  },

  penempatan_pengajar_dicabang: {
    pk: "id_penempatan",
    columns: [
      "id_pengajar", "id_cabang",
      "hari", "jam_mulai", "jam_berakhir"
    ],
    search: ["p.nama_pengajar", "p.kode_pengajar", "c.nama_cabang"],
    sort: ["id_penempatan", "hari", "jam_mulai"],
    filter: ["id_pengajar", "id_cabang", "hari"],
    select: `
      SELECT x.*,
        p.kode_pengajar, p.nip_pengajar, p.nama_pengajar,
        c.nama_cabang
      FROM penempatan_pengajar_dicabang x
      LEFT JOIN pengajar p
        ON p.id_pengajar = x.id_pengajar
      LEFT JOIN accounts_cabang c
        ON c.id_cabang = x.id_cabang
    `
  },

  permintaan_pengajar_antar_cabang: {
    pk: "id_permintaan_pengajar",
    columns: [
      "id_pengajar", "asal_cabang",
      "tanggal_diminta", "cabang_peminta", "status"
    ],
    search: ["p.nama_pengajar", "p.kode_pengajar"],
    sort: ["id_permintaan_pengajar", "tanggal_diminta"],
    filter: ["id_pengajar", "asal_cabang", "cabang_peminta", "status"],
    select: `
      SELECT r.*,
        p.kode_pengajar, p.nip_pengajar, p.nama_pengajar,
        a.nama_cabang AS nama_cabang_asal,
        c.nama_cabang AS nama_cabang_peminta
      FROM permintaan_pengajar_antar_cabang r
      LEFT JOIN pengajar p
        ON p.id_pengajar = r.id_pengajar
      LEFT JOIN accounts_cabang a
        ON a.id_cabang = r.asal_cabang
      LEFT JOIN accounts_cabang c
        ON c.id_cabang = r.cabang_peminta
    `
  }
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

function cors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGIN || "*").split(",").map(x => x.trim());

  return {
    "Access-Control-Allow-Origin":
      allowed.includes("*") ? "*" :
      allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Custom-Auth, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function response(data, status, request, env) {
  const headers = cors(request, env);
  headers["Content-Type"] = "application/json; charset=utf-8";

  return new Response(JSON.stringify(data), { status, headers });
}

function validId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

async function getBody(request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? body : null;
  } catch {
    return null;
  }
}

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const method = request.method;

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: cors(request, env)
    });
  }

  if (!env.DB) {
    return response({ success: false, message: "Database DB belum terhubung" }, 500, request, env);
  }

  // =====================================
  // AUTENTIKASI
  // =====================================
  if (!env.AUTH_TOKEN) {
    return response({ success: false, message: "AUTH_TOKEN belum dikonfigurasi" }, 500, request, env);
  }

  const token =
    request.headers.get("X-Custom-Auth") ||
    request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");

  if (token !== env.AUTH_TOKEN) {
    return response({ success: false, message: "Akses tidak diizinkan" }, 401, request, env);
  }

  if (path === "/api/health" && method === "GET") {
    return response({
      success: true,
      message: "Worker dan D1 terhubung",
      timestamp: new Date().toISOString()
    }, 200, request, env);
  }

  const parts = path.split("/").filter(Boolean);

  if (parts[0] !== "api" || !parts[1]) {
    return response({ success: false, message: "Endpoint tidak ditemukan" }, 404, request, env);
  }

  const table = parts[1];
  const id = parts[2];
  const config = TABLES[table];

  if (!config) {
    return response({ success: false, message: "Nama tabel tidak dikenal" }, 404, request, env);
  }

  const db = env.DB;
  const pk = config.pk;

  try {

    // =====================================
    // GET: DETAIL ATAU SEMUA DATA
    // =====================================
    if (method === "GET") {
      let sql = config.select;
      const conditions = [];
      const bindings = [];

      if (id !== undefined) {
        if (!validId(id)) {
          return response({ success: false, message: "ID tidak valid" }, 400, request, env);
        }

        const alias = table === "jadwal_kbm" ? "j" :
          table === "izin_pengajar" ? "i" :
          table === "penempatan_pengajar_dicabang" ? "x" :
          table === "permintaan_pengajar_antar_cabang" ? "r" : "";

        conditions.push(`${alias ? alias + "." : ""}${pk} = ?`);
        bindings.push(Number(id));
      }

      // Pencarian
      const search = url.searchParams.get("search");

      if (search && config.search?.length) {
        conditions.push("(" + config.search.map(col => `${col} LIKE ?`).join(" OR ") + ")");
        config.search.forEach(() => bindings.push(`%${search}%`));
      }

      // Filter
      for (const col of config.filter || []) {
        const value = url.searchParams.get(col);
        if (value !== null && value !== "") {
          const alias = table === "jadwal_kbm" ? "j" :
            table === "izin_pengajar" ? "i" :
            table === "penempatan_pengajar_dicabang" ? "x" :
            table === "permintaan_pengajar_antar_cabang" ? "r" : "";

          conditions.push(`${alias ? alias + "." : ""}${col} = ?`);
          bindings.push(value);
        }
      }

      if (conditions.length) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      const sort = url.searchParams.get("sort") || pk;
      const order = url.searchParams.get("order")?.toUpperCase() === "DESC" ? "DESC" : "ASC";

      if (!config.sort.includes(sort)) {
        return response({ success: false, message: "Kolom pengurutan tidak diizinkan" }, 400, request, env);
      }

      const alias = table === "jadwal_kbm" ? "j" :
        table === "izin_pengajar" ? "i" :
        table === "penempatan_pengajar_dicabang" ? "x" :
        table === "permintaan_pengajar_antar_cabang" ? "r" : "";

      sql += ` ORDER BY ${alias ? alias + "." : ""}${sort} ${order}`;

      if (!id) {
        const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 50));
        const offset = (page - 1) * limit;

        const countSql = `SELECT COUNT(*) AS total FROM (${sql.replace(/ ORDER BY .*$/, "")}) AS result_count`;
        const count = await db.prepare(countSql).bind(...bindings).first();

        sql += " LIMIT ? OFFSET ?";
        bindings.push(limit, offset);

        const result = await db.prepare(sql).bind(...bindings).all();

        return response({
          success: true,
          data: result.results,
          pagination: {
            page,
            limit,
            total: count?.total || 0,
            total_pages: Math.ceil((count?.total || 0) / limit)
          }
        }, 200, request, env);
      }

      const result = await db.prepare(sql).bind(...bindings).first();

      if (!result) {
        return response({ success: false, message: "Data tidak ditemukan" }, 404, request, env);
      }

      return response({ success: true, data: result }, 200, request, env);
    }

    // =====================================
    // POST: TAMBAH DATA
    // =====================================
    if (method === "POST" && !id) {
      const body = await getBody(request);

      if (!body) {
        return response({ success: false, message: "Body JSON tidak valid" }, 400, request, env);
      }

      const keys = Object.keys(body).filter(k => config.columns.includes(k));

      if (!keys.length || keys.length !== Object.keys(body).length) {
        return response({
          success: false,
          message: "Kolom kosong atau terdapat kolom yang tidak diizinkan",
          allowed_columns: config.columns
        }, 400, request, env);
      }

      const placeholders = keys.map(() => "?").join(", ");
      const sql = `
        INSERT INTO ${table} (${keys.join(", ")})
        VALUES (${placeholders})
        RETURNING ${pk}
      `;

      const result = await db.prepare(sql)
        .bind(...keys.map(k => body[k]))
        .first();

      return response({
        success: true,
        message: "Data berhasil ditambahkan",
        id: result[pk]
      }, 201, request, env);
    }

    // =====================================
    // PUT: UPDATE DATA
    // =====================================
    if (method === "PUT" && id) {
      if (!validId(id)) {
        return response({ success: false, message: "ID tidak valid" }, 400, request, env);
      }

      const body = await getBody(request);

      if (!body) {
        return response({ success: false, message: "Body JSON tidak valid" }, 400, request, env);
      }

      const keys = Object.keys(body).filter(k => config.columns.includes(k));

      if (!keys.length || keys.length !== Object.keys(body).length) {
        return response({
          success: false,
          message: "Kolom kosong atau terdapat kolom yang tidak diizinkan",
          allowed_columns: config.columns
        }, 400, request, env);
      }

      const assignments = keys.map(k => `${k} = ?`).join(", ");

      const sql = `
        UPDATE ${table}
        SET ${assignments}, updated_at = CURRENT_TIMESTAMP
        WHERE ${pk} = ?
      `;

      const result = await db.prepare(sql)
        .bind(...keys.map(k => body[k]), Number(id))
        .run();

      if (!result.meta?.changes) {
        return response({ success: false, message: "Data tidak ditemukan atau tidak berubah" }, 404, request, env);
      }

      return response({
        success: true,
        message: "Data berhasil diperbarui",
        id: Number(id)
      }, 200, request, env);
    }

    // =====================================
    // DELETE: HAPUS DATA
    // =====================================
    if (method === "DELETE" && id) {
      if (!validId(id)) {
        return response({ success: false, message: "ID tidak valid" }, 400, request, env);
      }

      const result = await db.prepare(
        `DELETE FROM ${table} WHERE ${pk} = ?`
      ).bind(Number(id)).run();

      if (!result.meta?.changes) {
        return response({ success: false, message: "Data tidak ditemukan" }, 404, request, env);
      }

      return response({
        success: true,
        message: "Data berhasil dihapus",
        id: Number(id)
      }, 200, request, env);
    }

    return response({
      success: false,
      message: "Metode atau endpoint tidak sesuai"
    }, 405, request, env);

  } catch (error) {
    const message = String(error.message || error);

    if (/FOREIGN KEY constraint failed/i.test(message)) {
      return response({
        success: false,
        message: "Data tidak dapat diproses karena relasi dengan tabel lain tidak valid atau masih digunakan"
      }, 409, request, env);
    }

    if (/UNIQUE constraint failed/i.test(message)) {
      return response({
        success: false,
        message: "Data sudah terdaftar atau terdapat duplikasi"
      }, 409, request, env);
    }

    if (/NOT NULL constraint failed|CHECK constraint failed/i.test(message)) {
      return response({
        success: false,
        message: "Data tidak memenuhi ketentuan database",
        detail: message
      }, 400, request, env);
    }

    console.error("Worker Error:", error);

    return response({
      success: false,
      message: "Terjadi kesalahan pada server"
    }, 500, request, env);
  }
}

export default {
  async fetch(request, env) {
    return handle(request, env);
  }
};
