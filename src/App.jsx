import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Phone,
  Rocket,
  ArrowUpDown,
  X,
} from "lucide-react";
import rawProjects from "./projects.json"; // ← dataset local

// ===== Config rápido (edita aquí) =====
const CONFIG = {
  nombre: "FerreExpress S.A.S.",
  lema: "Movimiento de tierras, obras civiles y alquiler de maquinaria.",
  descripcion:
    "Ejecutamos proyectos con cumplimiento, calidad y certificaciones de disposición de escombros. Servicio en Cali y ciudades aledañas.",
  brand: {
    primary: "#f9bf20", // Amarillo FerreExpress
    secondary: "#111827", // Gris muy oscuro
    light: "#fffbea",
  },
  contacto: {
    telefono: "+57 3162570453 | +57 3028043116",
    email: "ferreexpressltda@hotmail.com | expressraquel@gmail.com",
    direccion: "Cali, Colombia | Calle 16 #76-28, Prados del limonar",
  },
  redes: { instagram: "#", linkedin: "#", web: "#" },
};

// Utilidad para formatear moneda COP
const toCOP = (n) =>
  n?.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

// Normalizadores mínimos
const normFecha = (s) => {
  if (!s) return "";
  const t = String(s).trim();
  const m1 = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m1) return t;
  const m2 = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m2) {
    const dd = m2[1].padStart(2, "0");
    const mm = m2[2].padStart(2, "0");
    let yy = m2[3];
    if (yy.length === 2) yy = Number(yy) < 50 ? `20${yy}` : `19${yy}`;
    return `${yy}-${mm}-${dd}`;
  }
  return t; // deja casos tipo "mayo 2016" para preservar el año
};

const normTipo = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  return String(v)
    .split(/[\|,;/]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
};

// ===== util para normalizar textos (match imagen↔proyecto) =====
const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function TypeBadge({ label }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${getTypeStyle(
        label
      )}`}
    >
      {label}
    </span>
  );
}

const getTypeStyle = (t) => {
  const map = {
    Demolición: "bg-amber-50 text-amber-700 border-amber-200",
    Excavaciones: "bg-blue-50 text-blue-700 border-blue-200",
    "Movimiento de tierra": "bg-emerald-50 text-emerald-700 border-emerald-200",
    Urbanismo: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    Vías: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Edificaciones: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return map[t] || "bg-gray-50 text-gray-700 border-gray-200";
};

function ProjectModal({ item, onClose }) {
  // Accesibilidad: cerrar con Esc y bloquear scroll del body
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Ficha del proyecto
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <div className="text-xs text-gray-500">Cliente</div>
              <div className="text-base font-medium text-gray-900">
                {item.cliente || "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Obra</div>
              <div className="text-base text-gray-800">{item.obra || "—"}</div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500">Fecha</div>
                <div className="text-sm text-gray-800">{item.fecha || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Valor</div>
                <div className="text-sm text-gray-800">
                  {item.valor_cop ? toCOP(Number(item.valor_cop)) : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Contacto</div>
                <div className="text-sm text-gray-800">
                  {item.contacto || "—"}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Tipo</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(item.tipo || []).length ? (
                  (item.tipo || []).map((t, i) => (
                    <TypeBadge key={i} label={t} />
                  ))
                ) : (
                  <span className="text-sm text-gray-700">—</span>
                )}
              </div>
            </div>

            {item.descripcion && (
              <div>
                <div className="text-xs text-gray-500">Descripción</div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                  {item.descripcion}
                </p>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200"
            >
              Cerrar
            </button>
            <a
              href="#contacto"
              className="px-4 py-2 rounded-xl text-white"
              style={{ background: CONFIG.brand.primary }}
            >
              Cotizar este servicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIs({ data }) {
  const proyectos = data.length;
  const clientes = new Set(data.map((d) => d.cliente)).size;
  const total = data.reduce((acc, d) => acc + (Number(d.valor_cop) || 0), 0);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="rounded-2xl border border-gray-200 p-5 bg-white">
        <div className="text-sm text-gray-500">Proyectos</div>
        <div className="text-3xl font-semibold">{proyectos}</div>
      </div>
      <div className="rounded-2xl border border-gray-200 p-5 bg-white">
        <div className="text-sm text-gray-500">Clientes</div>
        <div className="text-3xl font-semibold">{clientes}</div>
      </div>
      <div className="rounded-2xl border border-gray-200 p-5 bg-white">
        <div className="text-sm text-gray-500">Total histórico</div>
        <div className="text-2xl font-semibold">{toCOP(total)}</div>
      </div>
    </div>
  );
}

function ProjectsExplorer({ data, onSort, sortBy, sortDir }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [tipo, setTipo] = useState("");

  // Paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modal
  const [selected, setSelected] = useState(null);

  const tipos = useMemo(
    () => Array.from(new Set(data.flatMap((d) => d.tipo || []))).sort(),
    [data]
  );
  const years = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((d) => (d.fecha || "").slice(0, 4))
            .filter((y) => /^\d{4}$/.test(y))
        )
      ).sort(),
    [data]
  );

  const filtered = useMemo(() => {
    const rows = data.filter((d) => {
      const matchQuery = (
        d.cliente +
        " " +
        d.obra +
        " " +
        (d.descripcion || "")
      )
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchYear = year ? (d.fecha || "").startsWith(year) : true;
      const matchTipo = tipo ? (d.tipo || []).includes(tipo) : true;
      return matchQuery && matchYear && matchTipo;
    });
    const dir = sortDir === "desc" ? -1 : 1;
    rows.sort((a, b) => {
      if (sortBy === "valor_cop")
        return ((Number(a.valor_cop) || 0) - (Number(b.valor_cop) || 0)) * dir;
      if (sortBy === "fecha")
        return (a.fecha || "").localeCompare(b.fecha || "") * dir;
      if (sortBy === "cliente")
        return (
          (a.cliente || "")
            .toLowerCase()
            .localeCompare((b.cliente || "").toLowerCase()) * dir
        );
      return 0;
    });
    return rows;
  }, [data, query, year, tipo, sortBy, sortDir]);

  // Reset página al cambiar filtros/orden
  useEffect(() => {
    setPage(1);
  }, [query, year, tipo, sortBy, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(total, startIdx + pageSize);
  const visible = filtered.slice(startIdx, endIdx);

  return (
    <div className="mt-6">
      {/* Controles */}
      <div className="grid md:grid-cols-5 gap-3">
        <input
          className="px-3 py-2 rounded-xl border border-gray-200"
          placeholder="Buscar por cliente, obra o descripción"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar proyectos"
        />
        <select
          className="px-3 py-2 rounded-xl border border-gray-200"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="Filtrar por año"
        >
          <option value="">Año</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded-xl border border-gray-200"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          aria-label="Filtrar por tipo de obra"
        >
          <option value="">Tipo de obra</option>
          {tipos.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded-xl border border-gray-200"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          aria-label="Tamaño de página"
        >
          <option value={10}>10 por página</option>
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
        <div className="px-3 py-2 rounded-xl border border-gray-200 flex items-center text-sm text-gray-600">
          {startIdx + 1}–{endIdx} de {total}
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden">
        <div className="max-h-[65vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="text-left p-3">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => onSort("fecha")}
                    aria-label="Ordenar por fecha"
                  >
                    Fecha <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => onSort("cliente")}
                    aria-label="Ordenar por cliente"
                  >
                    Cliente <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left p-3">Obra</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => onSort("valor_cop")}
                    aria-label="Ordenar por valor"
                  >
                    Valor <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left p-3">Contacto</th>
                <th className="text-left p-3">Ficha</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((d, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">{d.fecha || "—"}</td>
                  <td className="p-3">{d.cliente || "—"}</td>
                  <td className="p-3">{d.obra || "—"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(d.tipo || []).length ? (
                        (d.tipo || []).map((t, idx) => (
                          <TypeBadge key={idx} label={t} />
                        ))
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {d.valor_cop ? toCOP(Number(d.valor_cop)) : "—"}
                  </td>
                  <td className="p-3">{d.contacto || "—"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelected(d)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      Ver ficha
                    </button>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No se encontraron resultados con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-xs text-gray-500">
            {startIdx + 1}–{endIdx} de {total} resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <div className="text-sm text-gray-600">
              Página {page} / {totalPages}
            </div>
            <button
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <ProjectModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ===== ACTIVIDADES (secciones con carrusel + lightbox) ===== */
function ActivitiesSection() {
  // Carga todas las imágenes de /src/assets/obras
  const modules = import.meta.glob(
    "./assets/obras/**/*.{jpg,jpeg,png,webp,avif}",
    { eager: true }
  );

  // Agrupar por categoría: toma el nombre del archivo y le quita el número final
  const groups = useMemo(() => {
    const items = Object.entries(modules).map(([path, mod]) => {
      const file = path.split("/").pop() || "";
      const base = file.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");
      const category = base.replace(/\s+\d+$/i, "").trim(); // ej: "MOVIMIENTOS DE TIERRA 2" → "MOVIMIENTOS DE TIERRA"
      const numMatch = base.match(/(\d+)(?!.*\d)/); // último número
      const order = numMatch ? parseInt(numMatch[1], 10) : 0;
      return { src: mod.default, file, category, order };
    });

    // Agrupa por categoría
    const byCat = new Map();
    for (const it of items) {
      if (!byCat.has(it.category)) byCat.set(it.category, []);
      byCat.get(it.category).push(it);
    }

    // Orden: categorías alfabéticamente y fotos por número
    const result = Array.from(byCat.entries()).map(([category, arr]) => ({
      category,
      items: arr.sort(
        (a, b) => a.order - b.order || a.file.localeCompare(b.file, "es")
      ),
    }));
    return result.sort((a, b) =>
      a.category.localeCompare(b.category, "es", { sensitivity: "base" })
    );
  }, [modules]);

  // Lightbox por categoría
  const [open, setOpen] = useState(false);
  const [catIndex, setCatIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const currentList = groups[catIndex]?.items ?? [];
  const current = currentList[imgIndex];

  // Accesibilidad: Esc / flechas + bloqueo de scroll
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight")
        setImgIndex((i) => Math.min(currentList.length - 1, i + 1));
      if (e.key === "ArrowLeft")
        setImgIndex((i) => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, currentList.length]);

  if (!groups.length) return null;

  return (
    <section id="actividades" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
          Actividades de obra
        </h2>
        <p className="mt-3 text-gray-600">
          Evidencia fotográfica agrupada por actividad (carruseles horizontales).
        </p>

        <div className="mt-8 space-y-10">
          {groups.map((group, gi) => (
            <div key={group.category}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {group.category}
                </h3>
                <a
                  href="#proyectos"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Ver proyectos
                </a>
              </div>

              {/* Carrusel horizontal */}
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {group.items.map((img, ii) => (
                  <button
                    key={img.file}
                    onClick={() => {
                      setCatIndex(gi);
                      setImgIndex(ii);
                      setOpen(true);
                    }}
                    className="relative flex-none w-64 md:w-72 snap-start rounded-xl overflow-hidden border border-gray-200 bg-white"
                    aria-label={`Abrir imagen ${group.category} ${ii + 1}`}
                  >
                    <img
                      src={img.src}
                      alt={`${group.category} ${ii + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                      <div className="text-xs text-white/90 truncate">
                        {group.category} #{ii + 1}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {open && current && (
          <div
            className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={current.src}
                  alt={`${groups[catIndex].category} ${imgIndex + 1}`}
                  className="w-full h-auto object-contain bg-black"
                  style={{ maxHeight: "70vh" }}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm shadow"
                >
                  Cerrar (Esc)
                </button>
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                    disabled={imgIndex === 0}
                    className="m-2 rounded-full bg-white/90 px-3 py-2 text-sm shadow disabled:opacity-50"
                    aria-label="Anterior (←)"
                  >
                    ←
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() =>
                      setImgIndex((i) =>
                        Math.min(currentList.length - 1, i + 1)
                      )
                    }
                    disabled={imgIndex === currentList.length - 1}
                    className="m-2 rounded-full bg-white/90 px-3 py-2 text-sm shadow disabled:opacity-50"
                    aria-label="Siguiente (→)"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="p-4 text-sm text-gray-700">
                <div className="font-medium">{groups[catIndex].category}</div>
                <div className="text-gray-600">
                  Imagen {imgIndex + 1} de {currentList.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedProjects({ data }) {
  // Top 3 por valor (con valor > 0)
  const topValor = useMemo(
    () =>
      [...data]
        .filter((d) => Number(d.valor_cop) > 0)
        .sort((a, b) => Number(b.valor_cop) - Number(a.valor_cop))
        .slice(0, 3),
    [data]
  );

  // Top 3 más recientes (con fecha válida)
  const topRecientes = useMemo(
    () =>
      [...data]
        .filter((d) => d.fecha && /^\d{4}-\d{2}-\d{2}$/.test(d.fecha))
        .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""))
        .slice(0, 3),
    [data]
  );

  const Card = ({ item, etiqueta }) => (
    <div className="group rounded-2xl overflow-hidden border border-gray-200 bg-white">
      <div
        className="aspect-[4/3] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop)",
        }}
        aria-hidden="true"
      />
      <div className="p-4">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          {etiqueta}
        </div>
        <h3 className="mt-1 font-semibold text-gray-900">
          {item.obra || "Proyecto"}
        </h3>
        <div className="text-sm text-gray-600 mt-1">
          {item.cliente || "Cliente"}
        </div>
        <div className="text-sm text-gray-700 mt-2 flex items-center justify-between">
          <span>{item.fecha || "—"}</span>
          <span className="font-medium">
            {item.valor_cop ? toCOP(Number(item.valor_cop)) : "—"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-10">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
        Proyectos destacados
      </h3>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topValor.map((item, i) => (
          <Card key={"valor-" + i} item={item} etiqueta="Mayor valor" />
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topRecientes.map((item, i) => (
          <Card key={"reciente-" + i} item={item} etiqueta="Más reciente" />
        ))}
      </div>
    </div>
  );
}

/* ===== GALERÍA con Lightbox (general) ===== */
function Gallery({ data }) {
  // Importa todas las imágenes de /src/assets/obras con Vite
  const modules = import.meta.glob("./assets/obras/**/*.{jpg,jpeg,png,webp,avif}", { eager: true });

  const images = useMemo(() => {
    const list = Object.entries(modules).map(([path, mod]) => {
      const file = path.split("/").pop() || "";
      const base = file.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");
      const match = data.find((p) =>
        normalize(base).includes(normalize(p.obra)) ||
        normalize(p.obra).includes(normalize(base))
      );
      const alt = match ? `${match.obra} — ${match.cliente}` : base.replace(/[-_]+/g, " ");
      return { src: mod.default, alt, project: match };
    });
    // Ordena por nombre de archivo para estabilidad
    return list.sort((a, b) => a.alt.localeCompare(b.alt, "es"));
  }, [modules, data]);

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // Accesibilidad: cerrar con Esc / flechas / bloquear scroll
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);

  if (!images.length) return null;

  return (
    <section id="galeria" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Galería de obras</h2>
        <p className="mt-3 text-gray-600">Evidencia visual de campo (lazy-load, captions y detalle).</p>

        {/* Grid responsivo con aspect-ratio para evitar CLS */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setOpen(true); }}
              className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white"
              aria-label={`Abrir imagen ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                style={{ aspectRatio: "4 / 3" }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                <div className="text-xs text-white/90 truncate">{img.alt}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {open && (
          <div
            className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <div
              className="max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={images[idx].src}
                  alt={images[idx].alt}
                  className="w-full h-auto object-contain bg-black"
                  style={{ maxHeight: "70vh" }}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm shadow"
                >
                  Cerrar (Esc)
                </button>
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={() => setIdx((i) => Math.max(0, i - 1))}
                    disabled={idx === 0}
                    className="m-2 rounded-full bg-white/90 px-3 py-2 text-sm shadow disabled:opacity-50"
                    aria-label="Anterior (←)"
                  >
                    ←
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setIdx((i) => Math.min(images.length - 1, i + 1))}
                    disabled={idx === images.length - 1}
                    className="m-2 rounded-full bg-white/90 px-3 py-2 text-sm shadow disabled:opacity-50"
                    aria-label="Siguiente (→)"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="p-4 text-sm text-gray-700">
                <div className="font-medium">{images[idx].alt}</div>
                {images[idx].project && (
                  <div className="mt-1 text-gray-600">
                    {images[idx].project.fecha} · {images[idx].project.tipo?.join(", ")} ·{" "}
                    {images[idx].project.valor_cop ? toCOP(images[idx].project.valor_cop) : "—"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [sending, setSending] = useState(false);
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("fecha");
  const [sortDir, setSortDir] = useState("asc");

  // Cargar proyectos desde JSON local (importado)
  useEffect(() => {
    const clean = (rawProjects || []).map((r) => ({
      ...r,
      fecha: normFecha(r.fecha),
      tipo: normTipo(r.tipo),
      valor_cop: r.valor_cop
        ? Number(String(r.valor_cop).replace(/[^\d]/g, ""))
        : 0,
    }));
    setData(clean);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => setSending(false), 1000);
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const totalHistorico = data.reduce(
    (acc, d) => acc + (Number(d.valor_cop) || 0),
    0
  );

  return (
    <div
      className="min-h-screen bg-white text-gray-800"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/75 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="#inicio"
            className="font-semibold tracking-tight text-gray-900"
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle"
              style={{ background: CONFIG.brand.primary }}
            />
            {CONFIG.nombre}
          </a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#servicios" className="hover:text-gray-900 text-gray-600">
              Servicios
            </a>
            <a href="#actividades" className="hover:text-gray-900 text-gray-600">
              Actividades
            </a>
            <a href="#proyectos" className="hover:text-gray-900 text-gray-600">
              Proyectos
            </a>
            <a href="#galeria" className="hover:text-gray-900 text-gray-600">
              Galería
            </a>
            <a href="#clientes" className="hover:text-gray-900 text-gray-600">
              Clientes
            </a>
            <a href="#contacto" className="hover:text-gray-900 text-gray-600">
              Contacto
            </a>
          </nav>
          <a
            href="#contacto"
            className="hidden md:inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-sm"
            style={{ background: CONFIG.brand.primary }}
          >
            Cotiza ahora <ArrowRight size={18} />
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="inicio" className="relative overflow-hidden">
        {/* Franja de marca */}
        <div
          className="h-1 w-full"
          style={{ background: CONFIG.brand.primary }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: CONFIG.brand.primary }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900"
            >
              {CONFIG.nombre}
            </motion.h1>
            <p className="mt-3 text-lg md:text-xl text-gray-600">
              {CONFIG.lema}
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {CONFIG.descripcion}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Demolición",
                "Excavaciones",
                "Movimiento de tierra",
                "Urbanismo",
                "Vías",
                "Edificaciones",
                "Bote de escombros certificado",
              ].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  <Check size={16} className="text-emerald-500" /> {t}
                </span>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <a
                href="#servicios"
                className="inline-flex items-center gap-2 text-white px-5 py-3 rounded-xl shadow-sm"
                style={{ background: CONFIG.brand.primary }}
              >
                Ver servicios <Rocket size={18} />
              </a>
              <a
                href="#proyectos"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200"
              >
                Ver proyectos <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video w-full rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total histórico</div>
              <div className="text-2xl font-semibold">
                {toCOP(totalHistorico) || "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Servicios
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Selecciona lo que necesitas. También ofrecemos alquiler de
            maquinaria, venta de materiales e interventoría.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                titulo: "Demolición",
                desc: "Planeación, permisos y ejecución segura.",
              },
              {
                titulo: "Excavaciones",
                desc: "Excavación y conformación de terrazas.",
              },
              {
                titulo: "Movimiento de tierra",
                desc: "Cortes, llenos, transporte.",
              },
              { titulo: "Urbanismo", desc: "Sardineles, andenes, paisajismo." },
              {
                titulo: "Vías",
                desc: "Placas huella, pavimentos, subrasantes.",
              },
              {
                titulo: "Edificaciones",
                desc: "Obras civiles y adecuaciones.",
              },
            ].map((s) => (
              <div
                key={s.titulo}
                className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {s.titulo}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {["Equipo propio", "Cumplimiento", "Certificaciones"].map(
                    (i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={16} className="mt-0.5 text-emerald-500" />{" "}
                        {i}
                      </li>
                    )
                  )}
                </ul>
                <a
                  href="#contacto"
                  className="mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200"
                >
                  Cotizar <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACTIVIDADES (por categoría) ===== */}
      <ActivitiesSection />

      {/* ===== PROYECTOS ===== */}
      <section id="proyectos" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Proyectos
              </h2>
              <p className="mt-3 text-gray-600">
                Listado completo con búsqueda, filtros y orden.
              </p>
            </div>
          </div>
          <FeaturedProjects data={data} />{/* destacados */}
          <KPIs data={data} />
          <ProjectsExplorer
            data={data}
            onSort={toggleSort}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        </div>
      </section>

      {/* ===== GALERÍA (general) ===== */}
      <Gallery data={data} />

      {/* ===== CLIENTES ===== */}
      <section id="clientes" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Clientes & Confianza
          </h2>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <figure
              key={n}
              className="rounded-2xl bg-white border border-gray-200 p-6"
            >
              <blockquote className="text-gray-700">
                "Excelente trabajo, comunicación clara y cumplimiento."
              </blockquote>
              <figcaption className="mt-4 text-sm text-gray-500">
                Empresa {n} · Sector
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              Hablemos
            </h2>
            <p className="mt-3 text-gray-600">
              Cuéntanos tu idea y armamos una propuesta.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} /> {CONFIG.contacto.telefono}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> {CONFIG.contacto.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {CONFIG.contacto.direccion}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 p-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nombre</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Correo</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600">Mensaje</label>
                <textarea
                  rows={4}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                  placeholder="Cuéntanos sobre tu proyecto"
                />
              </div>
              <button
                type="submit"
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white"
                style={{ background: CONFIG.brand.primary }}
                disabled={sending}
              >
                {sending ? "Enviando…" : "Enviar mensaje"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-gray-500">
            © {new Date().getFullYear()} {CONFIG.nombre}. Todos los derechos
            reservados.
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <a href={CONFIG.redes.instagram} className="hover:text-gray-900">
              Instagram
            </a>
            <a href={CONFIG.redes.linkedin} className="hover:text-gray-900">
              LinkedIn
            </a>
            <a href={CONFIG.redes.web} className="hover:text-gray-900">
              Sitio web
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}