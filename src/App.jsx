import imgPostobon from "./assets/destacados/postobon.jpg";
import imgMadecentro from "./assets/destacados/madecentro.png";
import imgAlkosto from "./assets/destacados/alkosto.jpg";
import imgPapeles from "./assets/destacados/papeles-del-cauca.jpeg";
import imgMonticello from "./assets/destacados/monticello.png";
import imgBolivar from "./assets/destacados/colegio-bolivar.jpg";
import heroBg from "./assets/logos/banner.png";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Phone,
  Rocket,
  ArrowUpDown,
  X,
  Hammer,
  Truck,
  Package,
  Wrench,
  Building2,
  Layers,
  ShieldCheck,
  ClipboardCheck,
  Route,
  Ruler,
  TimerReset,
  FileCheck2,
  Menu,
} from "lucide-react";

import rawProjects from "./projects.json";
import logo1 from "./assets/logos/LOGOFERREEXPRESS.jpg";
import logo2 from "./assets/logos/LogoMacaAltaCalidad.png";

/* =========================
   CONFIGURACIÓN
========================= */
const CONFIG = {
  nombre: "FerreExpress S.A.S.",
  lema: "Movimiento de tierras, obras civiles y alquiler de maquinaria.",
  descripcion:
    "Ejecutamos proyectos con cumplimiento, calidad y certificaciones de disposición de escombros. Servicio en Cali y ciudades aledañas.",
  brand: { primary: "#F9BF20", secondary: "#111827", light: "#fffbea" },
  contacto: {
    telefono: "+57 3162570453 · +57 3028043116",
    email: "ferreexpressltda@hotmail.com · expressraquel@gmail.com",
    direccion: "Cali, Colombia · Calle 16 #76-28, Prados del Limonar",
  },
  redes: { instagram: "#", linkedin: "#", web: "#" },
};

/* =========================
   ANIMACIONES
========================= */
const FadeIn = ({ children, y = 14, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const HoverCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, amount: 0.2 }}
    className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md"
  >
    {children}
  </motion.div>
);

/* =========================
   UTILIDADES
========================= */
const toCOP = (n) =>
  n?.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

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
  return t;
};

const normTipo = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  return String(v)
    .split(/[\|,;/]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
};

/* =========================
   CHIPS DE TIPO
========================= */
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

/* =========================
   HEADER (FIJO + DRAWER MÓVIL)
========================= */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const firstLinkRef = useRef(null);

  // Sombra/altura al hacer scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloqueo de scroll cuando el drawer está abierto + Escape para cerrar
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    if (open) setTimeout(() => firstLinkRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  const navLinks = [
    { href: "#quienes", label: "Quiénes somos" },
    { href: "#capacidades", label: "Capacidades" },
    { href: "#actividades", label: "Actividades" },
    { href: "#servicios", label: "Servicios" },
    { href: "#proyectos", label: "Proyectos" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <>
      {/* Enlace para saltar al contenido (accesibilidad) */}
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:border focus:px-3 focus:py-1 focus:rounded-lg focus:z-[200]"
      >
        Saltar al contenido
      </a>

      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-[100] border-b border-[#e0a90d]
          transition-all duration-300
          ${
            scrolled
              ? "shadow-[0_10px_30px_-18px_rgba(17,24,39,.45)]"
              : "shadow-none"
          }`}
        style={{ background: CONFIG.brand.primary }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 md:h-20 flex items-center justify-between">
          {/* Logo + Inicio */}
          <a
            href="#inicio"
            className="flex items-center gap-2 sm:gap-3"
            aria-label="Ir al inicio"
          >
            <img
              src={logo1}
              alt="FerreExpress - Logo principal"
              className="h-10 sm:h-12 md:h-14 w-auto drop-shadow-sm"
            />
            <img
              src={logo2}
              alt="Marca asociada"
              className="h-10 sm:h-12 md:h-14 w-auto drop-shadow-sm"
            />
          </a>

          {/* Navegación desktop */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm"
            aria-label="Navegación principal"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[#111827]/90 hover:text-[#111827] hover:underline underline-offset-4"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2"
              style={{
                background: CONFIG.brand.secondary,
                boxShadow: "0 8px 24px -12px rgba(17,24,39,.45)",
              }}
            >
              Cotiza ahora <ArrowRight size={18} />
            </a>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-black/10 bg-white/50 backdrop-blur"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Drawer móvil */}
        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[99]"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <aside
              role="dialog"
              aria-modal="true"
              className="fixed top-0 right-0 h-full w-[88%] max-w-xs bg-white z-[120] shadow-xl border-l border-gray-200"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b">
                <span className="font-semibold">Menú</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Cerrar menú"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="p-4 space-y-1" aria-label="Navegación móvil">
                {navLinks.map((l, idx) => (
                  <a
                    key={l.href}
                    ref={idx === 0 ? firstLinkRef : null}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 rounded-lg text-[#111827] hover:bg-gray-50"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#contacto"
                  onClick={() => setOpen(false)}
                  className="mt-2 block px-3 py-3 rounded-xl text-center text-white"
                  style={{ background: CONFIG.brand.secondary }}
                >
                  Cotiza ahora
                </a>
              </nav>
            </aside>
          </>
        )}
      </header>
    </>
  );
}

/* =========================
   MODAL DE PROYECTO
========================= */
function ProjectModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[130]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
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
              style={{ background: CONFIG.brand.secondary }}
            >
              Cotizar este servicio
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* =========================
   INDICADORES
========================= */
function KPIs({ data }) {
  const proyectos = data.length;
  const clientes = new Set(data.map((d) => d.cliente)).size;
  const total = data.reduce((acc, d) => acc + (Number(d.valor_cop) || 0), 0);
  return (
    <FadeIn>
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
          <div className="text-sm text-gray-500">
            Total histórico aproximado
          </div>
          <div className="text-2xl font-semibold">{toCOP(total)}</div>
        </div>
      </div>
    </FadeIn>
  );
}

/* =========================
   TABLA / CARDS DE PROYECTOS (RESPONSIVE)
========================= */
function ProjectsExplorer({ data, onSort, sortBy, sortDir }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [tipo, setTipo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
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
      const hay = (d.cliente + " " + d.obra + " " + (d.descripcion || ""))
        .toLowerCase()
        .includes(query.toLowerCase());
      const byYear = year ? (d.fecha || "").startsWith(year) : true;
      const byTipo = tipo ? (d.tipo || []).includes(tipo) : true;
      return hay && byYear && byTipo;
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

  useEffect(() => setPage(1), [query, year, tipo, sortBy, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(total, startIdx + pageSize);
  const visible = filtered.slice(startIdx, endIdx);

  return (
    <div className="mt-6">
      {/* Filtros */}
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            className="px-3 py-2 rounded-xl border border-gray-200"
            placeholder="Buscar por cliente, obra o descripción"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-xl border border-gray-200"
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
          >
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>
          <div className="px-3 py-2 rounded-xl border border-gray-200 flex items-center text-sm text-gray-600">
            {total ? `${startIdx + 1}–${endIdx} de ${total}` : "0 resultados"}
          </div>
        </div>
      </FadeIn>

      {/* Vista TABLE (md+) */}
      <div className="hidden md:block mt-4 border border-gray-200 rounded-2xl overflow-hidden">
        <div className="max-h-[65vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="text-left p-3">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => onSort("fecha")}
                  >
                    Fecha <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => onSort("cliente")}
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
                    Sin resultados con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador desktop */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-xs text-gray-500">
            {total ? `${startIdx + 1}–${endIdx} de ${total} resultados` : "—"}
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

      {/* Vista CARDS (móvil) */}
      <div className="md:hidden mt-4 space-y-3">
        {visible.map((d, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">{d.fecha || "—"}</div>
                <div className="font-semibold text-gray-900 truncate">
                  {d.cliente || "—"}
                </div>
                <div className="text-sm text-gray-700 truncate">
                  {d.obra || "—"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Valor</div>
                <div className="text-sm font-medium">
                  {d.valor_cop ? toCOP(Number(d.valor_cop)) : "—"}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(d.tipo || []).length ? (
                (d.tipo || []).map((t, idx) => <TypeBadge key={idx} label={t} />)
              ) : (
                <span className="text-sm text-gray-600">—</span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600 truncate">
                {d.contacto || "—"}
              </div>
              <button
                onClick={() => setSelected(d)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200"
              >
                Ver ficha
              </button>
            </div>
          </div>
        ))}

        {/* Paginador móvil */}
        <div className="flex items-center justify-between px-1 py-2">
          <div className="text-xs text-gray-500">
            {total ? `${startIdx + 1}–${endIdx} de ${total}` : "—"}
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
              {page} / {totalPages}
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

      {selected && (
        <ProjectModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* =========================
   PROYECTOS DESTACADOS (con fotos locales)
========================= */
function FeaturedProjects({ data }) {
  const FEATURED = [
    "postobon",
    "madecentro",
    "alkosto",
    "papeles del cauca",
    "monticello",
    "colegio bolivar",
  ];

  const FOTOS = [
    imgPostobon,
    imgMadecentro,
    imgAlkosto,
    imgPapeles,
    imgMonticello,
    imgBolivar,
  ];

  const findProject = (needle) => {
    const n = needle.toLowerCase();
    return (
      data.find(
        (d) =>
          (d.cliente || "").toLowerCase().includes(n) ||
          (d.obra || "").toLowerCase().includes(n)
      ) || null
    );
  };

  const featured = FEATURED.map((name, i) => ({
    name,
    item: findProject(name),
    foto: FOTOS[i],
  }));

  const Card = ({ name, item, foto }) => (
    <HoverCard>
      <div className="aspect-[4/3] rounded-xl border border-gray-100 overflow-hidden bg-gray-100">
        {foto ? (
          <img
            src={foto}
            alt={`Proyecto destacado - ${item?.obra || name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop)",
            }}
            aria-label="Imagen de obra (placeholder)"
          />
        )}
      </div>

      <div className="pt-4">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Proyecto destacado
        </div>
        <h3 className="mt-1 font-semibold text-gray-900">
          {item?.obra || name.replace(/\b\w/g, (m) => m.toUpperCase())}
        </h3>
        <div className="text-sm text-gray-600 mt-1">
          {item?.cliente || "Cliente"}
        </div>
        <div className="text-sm text-gray-700 mt-2 flex items-center justify-between">
          <span>{item?.fecha || "—"}</span>
          <span className="font-medium">
            {item?.valor_cop ? toCOP(Number(item.valor_cop)) : "—"}
          </span>
        </div>
      </div>
    </HoverCard>
  );

  return (
    <div className="mt-10">
      <FadeIn>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          Proyectos destacados
        </h3>
      </FadeIn>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(({ name, item, foto }) => (
          <Card key={name} name={name} item={item} foto={foto} />
        ))}
      </div>
    </div>
  );
}

/* =========================
   ACTIVIDADES (carruseles + lightbox)
========================= */
function ActivitiesSection() {
  const modules = import.meta.glob(
    "./assets/obras/**/*.{jpg,jpeg,png,webp,avif}",
    {
      eager: true,
    }
  );

  const prettifyCategory = (name) => {
    let out = name;
    out = out.replace(/vialidades/gi, "vías");
    out = out.replace(/rigido/gi, "rígido");
    out = out.replace(/topografia/gi, "topografía");
    return out;
  };

  const groups = useMemo(() => {
    const items = Object.entries(modules).map(([path, mod]) => {
      const file = path.split("/").pop() || "";
      const base = file.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");
      const rawCat = base.replace(/\s+\d+$/i, "").trim();
      const category = prettifyCategory(rawCat);
      const numMatch = base.match(/(\d+)(?!.*\d)/);
      const order = numMatch ? parseInt(numMatch[1], 10) : 0;
      return { src: mod.default, file, category, order };
    });

    const byCat = new Map();
    for (const it of items) {
      if (!byCat.has(it.category)) byCat.set(it.category, []);
      byCat.get(it.category).push(it);
    }

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

  const [open, setOpen] = useState(false);
  const [catIndex, setCatIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const currentList = groups[catIndex]?.items ?? [];
  theCurrent: null;
  const current = currentList[imgIndex];

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight")
        setImgIndex((i) => Math.min(currentList.length - 1, i + 1));
      if (e.key === "ArrowLeft") setImgIndex((i) => Math.max(0, i - 1));
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
    <section id="actividades" className="scroll-mt-24 py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Actividades de obra
          </h2>
        </FadeIn>

        <div className="mt-8 space-y-10">
          {groups.map((group, gi) => (
            <FadeIn key={group.category}>
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

              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {group.items.map((img, ii) => (
                  <motion.button
                    key={img.file}
                    onClick={() => {
                      setCatIndex(gi);
                      setImgIndex(ii);
                      setOpen(true);
                    }}
                    className="relative flex-none w-56 sm:w-64 md:w-72 snap-start rounded-xl overflow-hidden border border-gray-200 bg-white"
                    aria-label={`Abrir imagen ${group.category} ${ii + 1}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  >
                    <img
                      src={img.src}
                      alt={`${group.category} ${ii + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-40 sm:h-44 object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                      <div className="text-xs text-white/90 truncate">
                        {group.category} #{ii + 1}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Lightbox */}
        {open && current && (
          <div
            className="fixed inset-0 z-[140] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
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
                    aria-label="Anterior (→)"
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
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================
   APP
========================= */
export default function App() {
  const [sending, setSending] = useState(false);
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("fecha");
  const [sortDir, setSortDir] = useState("asc");

  const formRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    try {
      setSending(true);
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      formRef.current.reset();
      alert("✅ Mensaje enviado. Te contactaremos pronto.");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo enviar. Verifica conexión y credenciales de EmailJS.");
    } finally {
      setSending(false);
    }
  };

  const toggleSort = (key) => {
    if (sortBy === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const totalHistorico = data.reduce(
    (acc, d) => acc + (Number(d.valor_cop) || 0),
    0
  );

  const servicios = [
    {
      titulo: "Demolición",
      desc: "Planeación, permisos y ejecución segura.",
      bullets: [
        { icon: ShieldCheck, text: "Protocolos HSE y control perimetral." },
        { icon: ClipboardCheck, text: "Gestión de permisos y actas." },
        { icon: FileCheck2, text: "Manifiestos de RCD certificados." },
      ],
    },
    {
      titulo: "Excavaciones",
      desc: "Excavación y conformación de terrazas.",
      bullets: [
        { icon: Ruler, text: "Nivelación y replanteo topográfico." },
        { icon: Truck, text: "Flota propia para acarreo y disposición." },
        { icon: ShieldCheck, text: "Estabilidad de taludes y drenajes." },
      ],
    },
    {
      titulo: "Movimiento de tierra",
      desc: "Cortes, llenos y transporte.",
      bullets: [
        { icon: Layers, text: "Subrasante y compactación por capas." },
        { icon: TimerReset, text: "Ejecución bajo cronograma pactado." },
        { icon: FileCheck2, text: "Ensayos Proctor y densidades in situ." },
      ],
    },
    {
      titulo: "Urbanismo",
      desc: "Sardineles, andenes y paisajismo.",
      bullets: [
        { icon: Route, text: "Trazados precisos y acabados limpios." },
        { icon: ClipboardCheck, text: "Especificaciones y fichas técnicas." },
        { icon: ShieldCheck, text: "Señalización y orden en obra." },
      ],
    },
    {
      titulo: "Vías",
      desc: "Placas huella, pavimentos y subrasantes.",
      bullets: [
        { icon: Ruler, text: "Control de cotas y pendientes." },
        { icon: FileCheck2, text: "Base/subbase con certificados." },
        { icon: Hammer, text: "Juntas, curado y acabados de calidad." },
      ],
    },
    {
      titulo: "Edificaciones",
      desc: "Obras civiles y adecuaciones.",
      bullets: [
        { icon: Building2, text: "Estructuras menores y muros." },
        { icon: ClipboardCheck, text: "Control de materiales y actas." },
        { icon: ShieldCheck, text: "Seguridad y orden en frentes." },
      ],
    },
  ];

  return (
    <>
      <Header />
      <main
        id="contenido"
        className="min-h-screen bg-white text-gray-800 pt-16 md:pt-20"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* HERO */}
        <section id="inicio" className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full blur-3xl opacity-20"
              style={{ background: CONFIG.brand.primary }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <FadeIn>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-bold tracking-tight text-gray-900"
                style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
              >
                {CONFIG.nombre}
              </motion.h1>
              <p
                className="mt-3 text-gray-700"
                style={{ fontSize: "clamp(16px, 2.2vw, 20px)" }}
              >
                {CONFIG.lema}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
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
                    <Check size={16} className="text-emerald-600" /> {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href="#capacidades"
                  className="inline-flex items-center gap-2 text-white px-5 py-3 rounded-xl shadow-sm hover:opacity-90"
                  style={{ background: CONFIG.brand.secondary }}
                >
                  Ver capacidades <Rocket size={18} />
                </a>
                <a
                  href="#proyectos"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  Ver proyectos <ArrowRight size={18} />
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative">
                <div
                  className="aspect-video w-full rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroBg})` }}
                  role="img"
                  aria-label="Equipo y obras de FerreExpress"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
                  <div className="text-xs text-gray-500">
                    Total histórico aproximado
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold">
                    {toCOP(totalHistorico) || "—"}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* QUIÉNES SOMOS */}
        <section
          id="quienes"
          className="scroll-mt-24 py-14 md:py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <FadeIn>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Quiénes somos
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                FerreExpress S.A.S. es una empresa de obras civiles
                especializada en movimiento de tierras, construcción y
                mantenimiento de infraestructura. Contamos con equipo y
                operación propia (maquinaria amarilla y transporte) y
                abastecemos materiales provenientes de canteras certificadas,
                garantizando trazabilidad, calidad de suministro y cumplimiento
                normativo en cada proyecto. Operamos en Cali y ciudades
                aledañas, atendiendo clientes del sector público y privado con
                un enfoque en seguridad, productividad y sostenibilidad (gestión
                responsable de RCD y disposición en sitios autorizados).
              </p>
            </FadeIn>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <HoverCard>
                <h3 className="text-lg font-semibold text-gray-900">Misión</h3>
                <p className="mt-2 text-gray-700">
                  Ejecutar con excelencia proyectos de movimiento de tierras y
                  obras civiles, eléctricas y mecánicas, así como construcción,
                  remodelación y mantenimiento de viviendas, edificios y vías,
                  asegurando:
                </p>
                <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
                  <li>
                    Calidad técnica (especificaciones, ensayos y control de
                    materiales).
                  </li>
                  <li>Cumplimiento en tiempos, costos y alcance.</li>
                  <li>
                    Seguridad y salud en el trabajo como prioridad operativa.
                  </li>
                  <li>
                    Gestión ambiental responsable y disposición certificada de
                    escombros.
                  </li>
                </ul>
              </HoverCard>

              <HoverCard>
                <h3 className="text-lg font-semibold text-gray-900">Visión</h3>
                <p className="mt-2 text-gray-700">
                  Consolidarnos como un referente regional mediante:
                </p>
                <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
                  <li>
                    Desarrollo de urbanizaciones con altos estándares de
                    habitabilidad.
                  </li>
                  <li>
                    Participación competitiva en licitaciones gubernamentales.
                  </li>
                  <li>
                    Fortalecimiento de proyectos viales urbanos y rurales.
                  </li>
                </ul>
              </HoverCard>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <HoverCard>
                <h3 className="text-lg font-semibold text-gray-900">
                  Nuestros valores
                </h3>
                <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
                  <li>
                    Integridad y transparencia: trazabilidad de origen y
                    disposición.
                  </li>
                  <li>Seguridad ante todo: HSE como cultura.</li>
                  <li>
                    Excelencia operativa: productividad y mejora continua.
                  </li>
                  <li>
                    Cumplimiento: planificación realista y reportes al cliente.
                  </li>
                  <li>
                    Sostenibilidad: manejo responsable de RCD y respeto
                    normativo.
                  </li>
                </ul>
              </HoverCard>

              <HoverCard>
                <h3 className="text-lg font-semibold text-gray-900">
                  Nuestros diferenciales
                </h3>
                <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
                  <li>Equipo propio y disponibilidad.</li>
                  <li>Calidad verificada: certificados y ensayos.</li>
                  <li>
                    Documentación al día: pólizas, hojas de vida y permisos.
                  </li>
                  <li>Manifiestos de disposición final y manejo de RCD.</li>
                  <li>Atención local y tiempos de respuesta ágiles.</li>
                </ul>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* CAPACIDADES */}
        <section
          id="capacidades"
          className="scroll-mt-24 py-14 md:py-24 bg-white"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <FadeIn>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Capacidades principales
              </h2>
              <p className="mt-3 text-gray-600">
                Soluciones integrales de obra y suministro para acompañar todo
                el ciclo del proyecto.
              </p>
            </FadeIn>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Layers,
                  title: "Movimientos de tierra",
                  text: "Excavación, corte, relleno, conformación de taludes, transporte y disposición.",
                },
                {
                  icon: Building2,
                  title: "Ejecución de obras civiles",
                  text: "Estructuras menores, drenajes, muros, andenes y espacio público.",
                },
                {
                  icon: Wrench,
                  title: "Ferretería",
                  text: "Gestión de materiales desde canteras certificadas y soporte documental.",
                },
                {
                  icon: Truck,
                  title: "Alquiler de maquinaria",
                  text: "Retroexcavadoras, compactadores, bulldozers y más, con operador.",
                },
                {
                  icon: Package,
                  title: "Venta de materiales",
                  text: "Suministro confiable desde canteras de alta calidad (ensayos y certificados).",
                },
                {
                  icon: Hammer,
                  title: "Interventoría",
                  text: "Acompañamiento técnico y control de calidad durante la ejecución.",
                },
              ].map(({ icon: Icon, title, text }, i) => (
                <HoverCard delay={i * 0.04} key={title}>
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{text}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* ACTIVIDADES */}
        <ActivitiesSection />

        {/* SERVICIOS */}
        <section
          id="servicios"
          className="scroll-mt-24 py-14 md:py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <FadeIn>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Servicios
              </h2>
              <p className="mt-3 text-gray-600 max-w-2xl">
                Selecciona lo que necesitas. También ofrecemos alquiler de
                maquinaria, venta de materiales e interventoría.
              </p>
            </FadeIn>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((s, idx) => (
                <HoverCard key={s.titulo} delay={idx * 0.04}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {s.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    {s.bullets.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-2">
                        <Icon size={16} className="mt-0.5 text-emerald-600" />{" "}
                        {text}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contacto"
                    className="mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-gray-200"
                  >
                    Cotizar <ArrowRight size={16} />
                  </a>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* PROYECTOS */}
        <section id="proyectos" className="scroll-mt-24 py-14 md:py-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <div className="flex items-end justify-between gap-4">
              <FadeIn>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                    Proyectos
                  </h2>
                  <p className="mt-3 text-gray-600">
                    Listado completo con búsqueda, filtros y orden.
                  </p>
                </div>
              </FadeIn>
            </div>

            <FeaturedProjects data={data} />
            <KPIs data={data} />
            <ProjectsExplorer
              data={data}
              onSort={toggleSort}
              sortBy={sortBy}
              sortDir={sortDir}
            />
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="scroll-mt-24 py-14 md:py-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 grid lg:grid-cols-2 gap-7">
            <FadeIn>
              <div className="lg:col-span-1">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                  Hablemos!
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
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="lg:col-span-2">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-gray-200 p-4 sm:p-6"
                >
                  {/* Campo oculto para {{time}} */}
                  <input
                    type="hidden"
                    name="time"
                    value={new Date().toLocaleString("es-CO", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Nombre</label>
                      <input
                        name="from_name"
                        required
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Correo</label>
                      <input
                        type="email"
                        name="reply_to"
                        required
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-gray-600">Mensaje</label>
                    <textarea
                      name="message"
                      rows={6}
                      required
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                      placeholder="Cuéntanos sobre tu proyecto"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white hover:opacity-90 disabled:opacity-60"
                    style={{ background: CONFIG.brand.secondary }}
                    disabled={sending}
                  >
                    {sending ? "Enviando…" : "Enviar mensaje"}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-gray-500">
              © {new Date().getFullYear()} {CONFIG.nombre} — Todos los derechos
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
      </main>
    </>
  );
}
