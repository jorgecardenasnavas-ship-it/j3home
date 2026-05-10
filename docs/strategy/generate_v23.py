"""
Generador del PDF "Nuevo rumbo de la plataforma" — Arquitectura Comercial V2.3
J3 Lab Coach · Documento estratégico interno
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Frame, PageTemplate, BaseDocTemplate,
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ────────────────────────────────────────────────────────────
# Paleta J3 (oficial)
# ────────────────────────────────────────────────────────────
VERDE = colors.HexColor("#1B3D2F")
CHAMPAN = colors.HexColor("#C9A96E")
CREMA = colors.HexColor("#F8F5EF")
NEGRO_VERDOSO = colors.HexColor("#0E1C16")
GRIS_TEXTO = colors.HexColor("#3A463E")
GRIS_SUAVE = colors.HexColor("#9AA29C")
LINEA = colors.HexColor("#D9D2C2")

OUTPUT_PATH = r"C:\Users\Jorge\Desktop\Code Claude\j3padel\mi-clon\docs\strategy\J3LabCoach_NuevoRumbo_V23.pdf"

# ────────────────────────────────────────────────────────────
# Estilos
# ────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

S = {}
S["EyebrowCover"] = ParagraphStyle(
    "EyebrowCover", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=10, leading=14,
    textColor=CHAMPAN, alignment=TA_LEFT, spaceAfter=8,
)
S["TitleCover"] = ParagraphStyle(
    "TitleCover", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=38, leading=42,
    textColor=NEGRO_VERDOSO, alignment=TA_LEFT, spaceAfter=14,
)
S["SubtitleCover"] = ParagraphStyle(
    "SubtitleCover", parent=styles["Normal"],
    fontName="Helvetica", fontSize=15, leading=20,
    textColor=VERDE, alignment=TA_LEFT, spaceAfter=24, italic=True,
)
S["MetaCover"] = ParagraphStyle(
    "MetaCover", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=14,
    textColor=GRIS_TEXTO, alignment=TA_LEFT, spaceAfter=2,
)

S["Eyebrow"] = ParagraphStyle(
    "Eyebrow", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=8, leading=12,
    textColor=CHAMPAN, alignment=TA_LEFT, spaceAfter=6,
)
S["H1"] = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=20, leading=24,
    textColor=VERDE, alignment=TA_LEFT, spaceBefore=8, spaceAfter=10,
)
S["H2"] = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=13, leading=17,
    textColor=NEGRO_VERDOSO, alignment=TA_LEFT, spaceBefore=12, spaceAfter=6,
)
S["H3"] = ParagraphStyle(
    "H3", parent=styles["Heading3"],
    fontName="Helvetica-Bold", fontSize=10.5, leading=14,
    textColor=VERDE, alignment=TA_LEFT, spaceBefore=8, spaceAfter=4,
)
S["Body"] = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=14.5,
    textColor=GRIS_TEXTO, alignment=TA_JUSTIFY, spaceAfter=6,
)
S["BodyLeft"] = ParagraphStyle(
    "BodyLeft", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=14.5,
    textColor=GRIS_TEXTO, alignment=TA_LEFT, spaceAfter=6,
)
S["Bullet"] = ParagraphStyle(
    "Bullet", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=14.5,
    textColor=GRIS_TEXTO, alignment=TA_LEFT,
    leftIndent=14, bulletIndent=2, spaceAfter=4,
)
S["Quote"] = ParagraphStyle(
    "Quote", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=12, leading=18,
    textColor=VERDE, alignment=TA_CENTER,
    spaceBefore=10, spaceAfter=10,
    leftIndent=20, rightIndent=20,
)
S["TableCell"] = ParagraphStyle(
    "TableCell", parent=styles["Normal"],
    fontName="Helvetica", fontSize=8.5, leading=12,
    textColor=GRIS_TEXTO, alignment=TA_LEFT,
)
S["TableCellBold"] = ParagraphStyle(
    "TableCellBold", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=8.5, leading=12,
    textColor=NEGRO_VERDOSO, alignment=TA_LEFT,
)
S["TableHeader"] = ParagraphStyle(
    "TableHeader", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=8.5, leading=11,
    textColor=CREMA, alignment=TA_LEFT,
)
S["Caption"] = ParagraphStyle(
    "Caption", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=8.5, leading=12,
    textColor=GRIS_SUAVE, alignment=TA_LEFT, spaceAfter=4,
)

# ────────────────────────────────────────────────────────────
# Cabecera y pie de página
# ────────────────────────────────────────────────────────────
def header_footer(canv, doc):
    canv.saveState()
    page_num = canv.getPageNumber()

    if page_num == 1:
        # La portada no tiene cabecera/pie estándar
        canv.restoreState()
        return

    # Header line
    canv.setStrokeColor(LINEA)
    canv.setLineWidth(0.5)
    canv.line(2 * cm, A4[1] - 1.5 * cm, A4[0] - 2 * cm, A4[1] - 1.5 * cm)

    # Header text
    canv.setFont("Helvetica-Bold", 7.5)
    canv.setFillColor(CHAMPAN)
    canv.drawString(2 * cm, A4[1] - 1.2 * cm, "J3 LAB COACH  ·  ARQUITECTURA COMERCIAL V2.3")

    canv.setFont("Helvetica", 7.5)
    canv.setFillColor(GRIS_SUAVE)
    canv.drawRightString(A4[0] - 2 * cm, A4[1] - 1.2 * cm, "Documento estratégico interno · Mayo 2026")

    # Footer line
    canv.setStrokeColor(LINEA)
    canv.line(2 * cm, 1.5 * cm, A4[0] - 2 * cm, 1.5 * cm)

    # Footer
    canv.setFont("Helvetica", 7.5)
    canv.setFillColor(GRIS_SUAVE)
    canv.drawString(2 * cm, 1.1 * cm, "Para Javi, Ale y Jorge Cárdenas")
    canv.setFillColor(VERDE)
    canv.setFont("Helvetica-Bold", 7.5)
    canv.drawRightString(A4[0] - 2 * cm, 1.1 * cm, f"{page_num}")

    canv.restoreState()


def cover_page(canv, doc):
    """Dibuja la portada"""
    canv.saveState()
    width, height = A4

    # Fondo crema en una banda superior
    canv.setFillColor(CREMA)
    canv.rect(0, height - 9 * cm, width, 9 * cm, fill=1, stroke=0)

    # Línea verde gruesa
    canv.setFillColor(VERDE)
    canv.rect(0, height - 9.3 * cm, width, 0.3 * cm, fill=1, stroke=0)

    # Línea champán fina
    canv.setFillColor(CHAMPAN)
    canv.rect(0, height - 9.45 * cm, width, 0.08 * cm, fill=1, stroke=0)

    # Marca "J3 LAB COACH" arriba
    canv.setFillColor(VERDE)
    canv.setFont("Helvetica-Bold", 11)
    canv.drawString(2 * cm, height - 2.2 * cm, "J3")
    canv.setFillColor(CHAMPAN)
    canv.setFont("Helvetica-Bold", 11)
    canv.drawString(2.55 * cm, height - 2.2 * cm, "LAB COACH")

    canv.setStrokeColor(CHAMPAN)
    canv.setLineWidth(0.6)
    canv.line(2 * cm, height - 2.45 * cm, 5.5 * cm, height - 2.45 * cm)

    # Eyebrow
    canv.setFillColor(CHAMPAN)
    canv.setFont("Helvetica-Bold", 9)
    canv.drawString(2 * cm, height - 4.5 * cm, "DOCUMENTO ESTRATÉGICO INTERNO")

    # Título
    canv.setFillColor(NEGRO_VERDOSO)
    canv.setFont("Helvetica-Bold", 38)
    canv.drawString(2 * cm, height - 6.2 * cm, "Nuevo rumbo")
    canv.drawString(2 * cm, height - 7.6 * cm, "de la plataforma")

    # Subtítulo
    canv.setFillColor(VERDE)
    canv.setFont("Helvetica-Oblique", 14)
    canv.drawString(2 * cm, height - 8.6 * cm, "Arquitectura comercial V2.3")

    # Bloque inferior con datos
    canv.setFillColor(CHAMPAN)
    canv.setFont("Helvetica-Bold", 8)
    canv.drawString(2 * cm, 4.8 * cm, "DESTINATARIOS")
    canv.setFillColor(NEGRO_VERDOSO)
    canv.setFont("Helvetica", 11)
    canv.drawString(2 * cm, 4.3 * cm, "Javi Cárdenas Navas — Co-fundador · CEO")
    canv.drawString(2 * cm, 3.85 * cm, "Ale — Proyecto de formación")
    canv.drawString(2 * cm, 3.4 * cm, "Jorge Cárdenas Navas — Co-fundador · CSO")

    canv.setFillColor(CHAMPAN)
    canv.setFont("Helvetica-Bold", 8)
    canv.drawString(2 * cm, 2.3 * cm, "FECHA")
    canv.setFillColor(NEGRO_VERDOSO)
    canv.setFont("Helvetica", 11)
    canv.drawString(2 * cm, 1.85 * cm, "Mayo 2026")

    # Línea inferior decorativa
    canv.setStrokeColor(VERDE)
    canv.setLineWidth(2)
    canv.line(2 * cm, 1.0 * cm, width - 2 * cm, 1.0 * cm)

    canv.restoreState()

# ────────────────────────────────────────────────────────────
# Helpers de tablas
# ────────────────────────────────────────────────────────────
def make_table_pretty(data, col_widths, header_rows=1):
    """Crea una tabla con estilos J3."""
    t = Table(data, colWidths=col_widths, repeatRows=header_rows)
    style_cmds = [
        # Header
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), VERDE),
        ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), CREMA),
        ("FONTNAME", (0, 0), (-1, header_rows - 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, header_rows - 1), 8.5),
        ("ALIGN", (0, 0), (-1, header_rows - 1), "LEFT"),
        ("VALIGN", (0, 0), (-1, header_rows - 1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        # Body
        ("FONTNAME", (0, header_rows), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, header_rows), (-1, -1), 8.5),
        ("TEXTCOLOR", (0, header_rows), (-1, -1), GRIS_TEXTO),
        ("VALIGN", (0, header_rows), (-1, -1), "TOP"),
        # Bordes
        ("LINEBELOW", (0, 0), (-1, 0), 1, VERDE),
        ("LINEBELOW", (0, header_rows), (-1, -2), 0.3, LINEA),
        # Zebras
        ("ROWBACKGROUNDS", (0, header_rows), (-1, -1), [CREMA, colors.white]),
        # Primera columna en negrita
        ("FONTNAME", (0, header_rows), (0, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, header_rows), (0, -1), NEGRO_VERDOSO),
    ]
    t.setStyle(TableStyle(style_cmds))
    return t


def make_simple_table(data, col_widths):
    """Tabla simple sin header destacado."""
    t = Table(data, colWidths=col_widths)
    style_cmds = [
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (-1, -1), GRIS_TEXTO),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, 0), (-1, 0), CHAMPAN),
        ("TEXTCOLOR", (0, 0), (-1, 0), NEGRO_VERDOSO),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8.5),
        ("LINEBELOW", (0, 0), (-1, 0), 1, NEGRO_VERDOSO),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREMA]),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, 1), (0, -1), NEGRO_VERDOSO),
    ]
    t.setStyle(TableStyle(style_cmds))
    return t

# ────────────────────────────────────────────────────────────
# Construcción del documento
# ────────────────────────────────────────────────────────────
def P(text, style="Body"):
    return Paragraph(text, S[style])


def cell(text, style="TableCell"):
    return Paragraph(text, S[style])


story = []

# ─── Portada (page 1, dibujada con onFirstPage) ───
story.append(Spacer(1, 22 * cm))  # placeholder para que la portada ocupe 1 página
story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA 2 — Resumen ejecutivo
# ═══════════════════════════════════════════════════════
story.append(P("RESUMEN EJECUTIVO", "Eyebrow"))
story.append(P("El nuevo rumbo, en una página", "H1"))

story.append(P(
    "J3 Lab Coach se reorganiza en <b>dos planes con propósitos distintos</b> y un sistema de progreso "
    "que dispara el upgrade de manera natural.", "Body"
))

story.append(P(
    "El <b>Plan Base</b> mantiene su modalidad mensual — la puerta de entrada que ya está captando volumen — "
    "y su modalidad anual para el cliente comprometido. Se rediseña en torno a dos capas de contenido: "
    "la Ruta 1 \"Fundamentos del oficio\" queda <b>desbloqueada en su totalidad desde el primer día</b>, "
    "y un <b>flujo semanal de contenido complementario</b> (directos pasados curados, newsletter, "
    "ejercicios y archivo seleccionado) se libera en lotes que solo avanzan si el cliente demuestra consumo real.", "Body"
))

story.append(P(
    "El <b>Plan Pro</b> se transforma en una <b>membresía premium con compromiso anual</b>. "
    "Deja de venderse como \"suscripción mensual\" y se posiciona como <b>pago único anual con facilidades de pago</b>. "
    "Da acceso completo a las tres rutas, al programa de directos por temáticas, al archivo histórico, "
    "a la comunidad y a consultas ilimitadas con el equipo formativo.", "Body"
))

story.append(P(
    "Se elimina la opción del Pro mensual cancelable mes a mes — el Pro siempre es un compromiso de 12 meses.", "Body"
))

story.append(P(
    "El <b>upgrade Base → Pro no se vende, se desbloquea</b>: el Pro solo es comprable después de que "
    "el cliente complete la Ruta 1 y obtenga el sello <i>Assistant Coach</i>. Esta mecánica de "
    "<b>gating por progreso</b> resuelve el problema histórico de baja conversión sin necesidad de "
    "subir presión comercial: el upgrade pasa de ser una decisión de marketing a ser el siguiente "
    "nivel natural en el Camino del coach.", "Body"
))

story.append(Spacer(1, 8))
story.append(P(
    "&ldquo;Empieza por el Base. Cuando estés listo, da el salto al Pro.&rdquo;", "Quote"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Producto
# ═══════════════════════════════════════════════════════
story.append(P("EL PRODUCTO", "Eyebrow"))
story.append(P("Dos planes, un Camino", "H1"))

story.append(P("Comparativa completa entre el Plan Base, el Plan Pro y el hito del Examen.", "Body"))
story.append(Spacer(1, 6))

producto_data = [
    [
        cell("Característica", "TableHeader"),
        cell("Plan Base", "TableHeader"),
        cell("Plan Pro", "TableHeader"),
        cell("Examen", "TableHeader"),
    ],
    [
        cell("Modelo de cobro"),
        cell("Suscripción mensual o pago único anual"),
        cell("Pago único anual con facilidades de pago"),
        cell("One-time"),
    ],
    [
        cell("Precio"),
        cell("19€/mes · 144€/año"),
        cell("540€ pago único · 580€ trimestral · 660€ mensual"),
        cell("490€"),
    ],
    [
        cell("Compromiso"),
        cell("Mes a mes o 12 meses"),
        cell("12 meses"),
        cell("—"),
    ],
    [
        cell("Sello"),
        cell("Rookie → Assistant Coach al completar Ruta 1"),
        cell("Coach + Cualificado (vivo)"),
        cell("Head Coach + Certificado"),
    ],
    [
        cell("Naturaleza"),
        cell("Currículum guiado en dos capas"),
        cell("Membresía premium con acceso libre"),
        cell("Hito"),
    ],
    [
        cell("Ruta 1 — Fundamentos del oficio"),
        cell("Acceso libre completo desde el día 1"),
        cell("Acceso libre completo"),
        cell("—"),
    ],
    [
        cell("Ruta 2"),
        cell("Visible pero bloqueada"),
        cell("Acceso libre completo"),
        cell("—"),
    ],
    [
        cell("Ruta 3 — Diseño del jugador y del coach"),
        cell("Visible como \"en construcción\""),
        cell("Acceso libre completo (7 masterclasses)"),
        cell("—"),
    ],
    [
        cell("Directos en vivo"),
        cell("NO"),
        cell("Sí, todos los del programa"),
        cell("—"),
    ],
    [
        cell("Archivo libre de directos pasados"),
        cell("NO"),
        cell("Sí, completo"),
        cell("—"),
    ],
    [
        cell("Directo curado semanal"),
        cell("Mínimo uno por semana, rotando temáticas"),
        cell("(No aplica — tienen archivo libre)"),
        cell("—"),
    ],
    [
        cell("Recursos descargables"),
        cell("Algunos seleccionados, integrados en lotes semanales"),
        cell("Todos, en acceso libre"),
        cell("—"),
    ],
    [
        cell("Consultas al equipo formativo"),
        cell("0"),
        cell("Ilimitadas"),
        cell("—"),
    ],
    [
        cell("Comunidad"),
        cell("No"),
        cell("Sí"),
        cell("—"),
    ],
]

col_widths = [4.0 * cm, 4.5 * cm, 5.5 * cm, 3.0 * cm]
story.append(make_table_pretty(producto_data, col_widths))

story.append(Spacer(1, 10))
story.append(P(
    "Productos fuera del alcance de esta V2.3 (se mantienen tal cual): Sesión Cero (49€), "
    "paquetes Mentor (Sprint / Acompañamiento / Programa) e insignia Verificado. Se revisarán en una segunda fase.",
    "Caption"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Modelo de cobro detallado
# ═══════════════════════════════════════════════════════
story.append(P("MODELO DE COBRO", "Eyebrow"))
story.append(P("Tarifas y modalidades de pago", "H1"))

story.append(P("Plan Base — dos modalidades", "H2"))

base_data = [
    [
        cell("Modalidad", "TableHeader"),
        cell("Precio", "TableHeader"),
        cell("Cuándo se ofrece", "TableHeader"),
        cell("Mensaje", "TableHeader"),
    ],
    [
        cell("Mensual"),
        cell("19€/mes"),
        cell("Modalidad principal en j3padel.com/join"),
        cell("\"Empieza tu Camino. Cancela cuando quieras.\""),
    ],
    [
        cell("Anual"),
        cell("144€/año"),
        cell("Revelada en el checkout como upsell"),
        cell("\"Paga anual y ahorra 84€ frente al mensual.\""),
    ],
]
story.append(make_table_pretty(base_data, [3.5 * cm, 2.5 * cm, 5.5 * cm, 5.5 * cm]))

story.append(Spacer(1, 8))
story.append(P(
    "<b>Estrategia de presentación:</b> la home y la landing muestran <b>solo el mensual</b> como puerta principal "
    "— un único precio, sin distracciones, sin parálisis de elección. La opción anual aparece "
    "<b>en el momento del checkout</b>, justo antes del pago, como ahorro evidente. Esto mantiene la fachada "
    "limpia que ya está funcionando y maximiza ARPU en el momento de máxima intención de compra.", "Body"
))

story.append(Spacer(1, 14))
story.append(P("Plan Pro — pago único anual con facilidades", "H2"))

pro_data = [
    [
        cell("Modalidad", "TableHeader"),
        cell("Cuota", "TableHeader"),
        cell("Total año", "TableHeader"),
        cell("Recargo vs único", "TableHeader"),
    ],
    [
        cell("Pago único anual"),
        cell("540€"),
        cell("540€  (45€/mes equiv.)"),
        cell("—"),
    ],
    [
        cell("4 pagos trimestrales"),
        cell("145€ × 4"),
        cell("580€  (48€/mes equiv.)"),
        cell("+7%"),
    ],
    [
        cell("12 cuotas mensuales"),
        cell("55€ × 12"),
        cell("660€  (55€/mes equiv.)"),
        cell("+22%"),
    ],
]
story.append(make_table_pretty(pro_data, [4.0 * cm, 3.5 * cm, 5.5 * cm, 4.0 * cm]))

story.append(Spacer(1, 8))
story.append(P(
    "<b>Posicionamiento:</b> el Pro <b>no es una suscripción</b>. Es un compromiso anual con J3 Lab Coach. "
    "Las cuotas son únicamente facilidades de pago para hacerlo accesible — no son cancelables mes a mes, "
    "no hay opción de \"darse de baja\" antes de cumplir el año. Quien entra al Pro entra durante 12 meses.", "Body"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — El programa de directos
# ═══════════════════════════════════════════════════════
story.append(P("EL PROGRAMA DE DIRECTOS", "Eyebrow"))
story.append(P("La parrilla del Pro", "H1"))

story.append(P(
    "Los directos no son una emisión genérica. Son un <b>programa con secciones temáticas estables</b>, "
    "y este es uno de los argumentos de venta más fuertes del Pro. Las temáticas confirmadas hasta ahora:", "Body"
))

tematicas = [
    ("Análisis de partidos", "Descomposición táctica de partidos profesionales o de alumnos."),
    ("Diseño de entrenamientos", "Cómo se construye una sesión con intención."),
    ("Progresiones micro", "Cómo encadenar tareas para construir un comportamiento."),
    ("Correcciones técnicas", "Qué corregir, cuándo y cómo."),
    ("Q&A con entrenadores", "Preguntas abiertas en directo a Javi, Ale y Jorge."),
    ("Mentor coach", "El proceso real de los entrenadores que están dentro del programa Mentor de pago."),
]

tem_data = [[cell("Sección", "TableHeader"), cell("Qué es", "TableHeader")]]
for nombre, desc in tematicas:
    tem_data.append([cell(nombre, "TableCellBold"), cell(desc)])
story.append(make_table_pretty(tem_data, [4.5 * cm, 12.5 * cm]))

story.append(Spacer(1, 6))
story.append(P("(Otros formatos a definir según evolucione la parrilla)", "Caption"))

story.append(Spacer(1, 14))
story.append(P("Mecánica según plan", "H2"))

story.append(P(
    "<b>Pro:</b> acceso a todos los directos en vivo + archivo permanente y libre. "
    "El cliente puede saltar entre temáticas a su antojo, repasar y profundizar.", "Body"
))
story.append(P(
    "<b>Base:</b> sin directos en vivo ni archivo libre. Cada semana, el sistema entrega "
    "<b>un directo pasado curado</b> dentro del lote, <b>rotando por las distintas temáticas</b>, "
    "para que el cliente Base vea la variedad del programa Pro sin abrirle la puerta entera. "
    "Es la mejor manera de empujar al upgrade sin levantar la mano.", "Body"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Cómo funciona el Plan Base (V2.3 — dos capas)
# ═══════════════════════════════════════════════════════
story.append(P("PLAN BASE", "Eyebrow"))
story.append(P("Dos capas de contenido", "H1"))

story.append(P(
    "El Plan Base se compone de <b>dos capas con lógica distinta</b>, y entender esa separación es clave "
    "para que el cliente perciba el valor correcto.", "Body"
))

story.append(P("Capa 1 — La Ruta 1: libre desde el día 1", "H2"))
story.append(P(
    "El cliente del Base tiene <b>toda la Ruta 1 \"Fundamentos del oficio\" desbloqueada desde el primer momento</b>. "
    "Puede consumirla a su ritmo, en el orden que quiera, las veces que quiera.", "Body"
))
story.append(P(
    "Es su <b>material troncal</b>: lo que define el oficio del coach según J3 y lo que tiene que "
    "completar — con sus tests y exámenes asociados — para ganarse el sello <i>Assistant Coach</i> y "
    "desbloquear la opción de pasar al Pro.", "Body"
))

story.append(P("Capa 2 — Contenido complementario: lotes semanales con condición de consumo", "H2"))
story.append(P(
    "Cada semana, el sistema libera al cliente un <b>lote de contenido complementario</b> que enriquece la formación troncal:", "Body"
))

bullets_lote = [
    "Un <b>directo pasado curado</b>, rotando por las temáticas del programa.",
    "Una pieza de <b>newsletter formativa</b>.",
    "<b>Ejercicios prácticos</b> seleccionados.",
    "<b>Contenido de archivo</b> previamente publicado que J3 considere relevante para esa semana.",
]
for b in bullets_lote:
    story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", S["Bullet"]))

story.append(Spacer(1, 4))
story.append(P("Cómo se gana el siguiente lote", "H3"))
story.append(P(
    "Si el cliente <b>consume el lote completo durante la semana</b> → la siguiente semana se le libera el siguiente. "
    "Si <b>no lo consume</b> → la siguiente semana <b>no se añade contenido nuevo</b>. El reloj se para "
    "hasta que se ponga al día.", "Body"
))

story.append(P("Filosofía detrás de las dos capas", "H3"))
story.append(P(
    "La Ruta 1 es del cliente desde el primer día — <b>el oficio no se dosifica</b>. Pero los matices, "
    "las aplicaciones prácticas, los ejemplos curados — eso <b>se gana por consumo demostrado</b>.", "Body"
))
story.append(P(
    "Eso da lo mejor de los dos modelos: <b>libertad</b> sobre el troncal — el cliente nunca se siente preso del sistema — "
    "y <b>progresión activa</b> sobre el complemento — el cliente siempre tiene algo nuevo entrando si está activo, "
    "y nada nuevo si se ha desconectado.", "Body"
))

story.append(P("Lo que el Plan Base NO tiene", "H3"))
no_tiene = [
    "Sin directos en vivo.",
    "Sin archivo libre de directos pasados (solo recibe el curado de su lote semanal).",
    "Sin acceso a Ruta 2 (visible pero bloqueada) ni a Ruta 3 (visible como \"en construcción\").",
    "Sin comunidad.",
    "<b>0 consultas</b> al equipo formativo.",
]
for b in no_tiene:
    story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", S["Bullet"]))

story.append(Spacer(1, 8))
story.append(P(
    "&ldquo;En J3 no se consume porque sí. Se avanza porque se ha hecho el trabajo.&rdquo;", "Quote"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Cómo funciona el Plan Pro
# ═══════════════════════════════════════════════════════
story.append(P("PLAN PRO", "Eyebrow"))
story.append(P("La membresía premium", "H1"))

story.append(P(
    "El Pro es lo contrario al Base en filosofía: el cliente tiene <b>la llave de todo y avanza a su ritmo</b>.", "Body"
))

contenido_pro = [
    "<b>Acceso libre y completo a las tres rutas</b> — Ruta 1, Ruta 2 y Ruta 3 con sus masterclasses publicadas y las que se vayan añadiendo.",
    "<b>Programa de directos completo en vivo</b>, con todas las temáticas de la parrilla.",
    "<b>Archivo permanente y libre</b> de toda la parrilla histórica de directos.",
    "<b>Todos los recursos descargables</b> (plantillas, ejercicios, PDFs).",
    "<b>Consultas ilimitadas</b> al equipo formativo (Javi, Ale y Jorge).",
    "<b>Acceso a la comunidad.</b>",
    "<b>Sello Coach + Cualificado vivo</b>, mientras se mantenga al día con los contenidos publicados y los tests/exámenes asociados.",
]
for b in contenido_pro:
    story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", S["Bullet"]))

story.append(Spacer(1, 14))

story.append(P("Cómo se gana el acceso al Pro", "H2"))
story.append(P(
    "El Pro <b>solo es comprable</b> después de que el cliente haya completado la Ruta 1 desde el Plan Base "
    "y se haya ganado el sello <i>Assistant Coach</i>. Antes de eso, el botón de compra del Pro "
    "<b>no aparece</b> en la plataforma.", "Body"
))
story.append(P(
    "Esta es la pieza clave: el upgrade no es una decisión comercial empujada por marketing — es la "
    "<b>consecuencia natural del progreso</b> del cliente en el Camino. Convierte el momento de upgrade "
    "en un momento de orgullo profesional, no de incomodidad ante un cobro.", "Body"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — El motor del modelo: gating por progreso
# ═══════════════════════════════════════════════════════
story.append(P("EL MOTOR DEL MODELO", "Eyebrow"))
story.append(P("Gating por progreso", "H1"))

story.append(P("El upgrade Base → Pro <b>no se vende, se desbloquea</b>:", "Body"))

pasos = [
    ("01", "Entrada al Base", "Rookie en Ruta 1, recibiendo lotes semanales complementarios."),
    ("02", "Al completar la Ruta 1", "Sello <i>Assistant Coach</i> + se habilita la opción de adquirir el Pro."),
    ("03", "Antes de eso", "El Pro no es comprable. <b>No hay atajo.</b>"),
    ("04", "Al pasar al Pro", "Desbloquea Rutas 2 y 3 + sello <i>Coach + Cualificado</i>."),
    ("05", "Al completar las 3 rutas", "Manteniendo el Cualificado activo, se habilita el Examen → Head Coach + Certificado."),
]
camino_data = [[cell("Paso", "TableHeader"), cell("Hito", "TableHeader"), cell("Qué pasa", "TableHeader")]]
for n, h, q in pasos:
    camino_data.append([cell(n, "TableCellBold"), cell(h, "TableCellBold"), cell(q)])
story.append(make_table_pretty(camino_data, [1.5 * cm, 4.5 * cm, 11.0 * cm]))

story.append(Spacer(1, 14))
story.append(P("El sello Cualificado vivo · período de gracia 30 días", "H2"))
story.append(P(
    "El sello <i>Coach + Cualificado</i> se mantiene mientras el cliente esté al día con los contenidos "
    "publicados y haya superado los tests/exámenes asociados.", "Body"
))
story.append(P(
    "Cuando un cliente se descuelga — no consume nuevo contenido o tiene un test pendiente sin aprobar — "
    "<b>dispone de 30 días</b> para ponerse al día. Si no actúa en ese plazo, el sello queda <b>inactivo</b>. "
    "Lo recupera automáticamente cuando se pone al día.", "Body"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Decisiones de simplificación + Migración
# ═══════════════════════════════════════════════════════
story.append(P("DECISIONES OPERATIVAS", "Eyebrow"))
story.append(P("Simplificación y migración", "H1"))

story.append(P("Simplificaciones del modelo", "H2"))
simpl = [
    "<b>Se elimina el Pro mensual cancelable mes a mes</b> como producto en venta. El Pro siempre es un compromiso anual de 12 meses, ofrecido con facilidades de pago.",
    "<b>Se elimina el descuento del 33% del Pro anual actual (396€).</b> El nuevo modelo de cobro escalado lo sustituye.",
    "<b>El Base mensual y el Base anual se mantienen ambos</b>, con presentación inteligente: mensual visible en la home, anual revelado en el checkout.",
]
for b in simpl:
    story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", S["Bullet"]))

story.append(Spacer(1, 14))
story.append(P("Migración de clientes Pro actuales", "H2"))
story.append(P(
    "A los clientes que ya están dentro del Pro a 49€/mes o 396€/año se les ofrece un esquema de "
    "<b>triple opción con fecha agresiva</b>:", "Body"
))

mig_data = [
    [cell("Opción", "TableHeader"), cell("Qué se ofrece", "TableHeader"), cell("Plazo", "TableHeader")],
    [cell("Grandfather mensual"), cell("Mantienen su cuota mensual actual (49€/mes) indefinidamente."), cell("Sin fecha límite")],
    [cell("Migración a anual antiguo"), cell("Pasan al precio anual antiguo de 396€/año."), cell("Antes del 17 de junio de 2026")],
    [cell("Precio nuevo"), cell("A partir del 18 de junio, los nuevos clientes y los que migren después solo entran al precio nuevo (540 / 580 / 660)."), cell("Desde el 18 de junio de 2026")],
]
story.append(make_table_pretty(mig_data, [4.5 * cm, 8.5 * cm, 4.0 * cm]))

story.append(Spacer(1, 8))
story.append(P(
    "Comunicación: email directo a la base actual con asunto claro, página de explicación interna con FAQ, "
    "y recordatorios en los días -10 y -3 antes del cierre del 17 de junio.", "Body"
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Mensajería para web y landing
# ═══════════════════════════════════════════════════════
story.append(P("COMUNICACIÓN EXTERNA", "Eyebrow"))
story.append(P("Mensajería para web y landing", "H1"))

story.append(P("Cuatro líneas maestras que todo el copy nuevo debe respetar:", "Body"))

lineas = [
    ("01", "No vendas un plan, vende un Camino.",
     "Assistant Coach → Coach Cualificado → Head Coach. El cliente no compra acceso a contenido, compra un recorrido profesional."),
    ("02", "El Pro se gana, no se compra.",
     "Comunicar abiertamente que el Pro requiere haber completado la Ruta 1. Esto eleva la marca: \"no entra cualquiera\"."),
    ("03", "El Base es un camino marcado, el Pro es la llave.",
     "El Base avanza al ritmo de J3 (lotes semanales con condición de consumo). El Pro avanza al ritmo del coach (acceso libre)."),
    ("04", "El Pro no es contenido, es un programa vivo.",
     "Tres rutas + parrilla de directos por temáticas + archivo + comunidad + consultas ilimitadas. Vendido como programa, no como suscripción."),
]
mens_data = [[cell("#", "TableHeader"), cell("Línea maestra", "TableHeader"), cell("Qué significa", "TableHeader")]]
for n, t, d in lineas:
    mens_data.append([cell(n, "TableCellBold"), cell(t, "TableCellBold"), cell(d)])
story.append(make_table_pretty(mens_data, [1.0 * cm, 5.5 * cm, 10.5 * cm]))

story.append(Spacer(1, 14))
story.append(P("Frase resumen para mensajería pública", "H3"))
story.append(P("&ldquo;Empieza por el Base. Cuando estés listo, da el salto al Pro.&rdquo;", "Quote"))

story.append(Spacer(1, 10))
story.append(P("Ajustes concretos en la web", "H2"))
ajustes = [
    "<b>j3padel.com/join</b>: solo el Base mensual a 19€ visible en home. Anual a 144€ revelado en el checkout como upsell.",
    "<b>/lab/coach</b>: explica el Camino, el programa de directos por temáticas y deja claro que el Pro requiere completar Ruta 1.",
    "En la sección de tarifas del Pro, presentar las <b>3 modalidades de pago</b> lado a lado con el ahorro destacado en el pago único.",
    "Eliminar todas las referencias a \"mensual\" como vía de compra del Pro.",
]
for b in ajustes:
    story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", S["Bullet"]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════
# PÁGINA — Pendientes y próximos pasos
# ═══════════════════════════════════════════════════════
story.append(P("EJECUCIÓN", "Eyebrow"))
story.append(P("Pendientes y próximos pasos", "H1"))

story.append(P("Pendientes de decisión", "H2"))
pendientes = [
    "Selección de qué recursos descargables van al Plan Base y cuáles solo al Pro. Inventario por parte del equipo formativo (Javi y Ale).",
    "Revisión de los productos Mentor (Sprint, Acompañamiento, Programa) y Sesión Cero. Siguiente fase, fuera de esta V2.3.",
]
for i, b in enumerate(pendientes, 1):
    story.append(Paragraph(f"<b>{i:02d}.</b>&nbsp;&nbsp;{b}", S["Bullet"]))

story.append(Spacer(1, 14))
story.append(P("Próximos pasos operativos", "H2"))

pasos_data = [
    [cell("Plazo", "TableHeader"), cell("Acción", "TableHeader"), cell("Responsable", "TableHeader")],
    [cell("Esta semana"), cell("Validar V2.3 con Javi y Ale · cerrar pendiente 1"), cell("Jorge")],
    [cell("7 días"), cell("Redactar email de migración a clientes Pro actuales · preparar FAQ interna"), cell("Jorge + copy")],
    [cell("10 días"), cell("Actualizar j3padel.com/join: Base mensual visible, anual en checkout"), cell("Equipo web")],
    [cell("10 días"), cell("Actualizar /lab/coach: Camino, programa de directos, mensajería del Pro como compromiso anual"), cell("Equipo web")],
    [cell("10 días"), cell("Implementar gating técnico: lotes semanales del Base, bloqueo de compra del Pro hasta completar Ruta 1, sello Cualificado vivo con 30 días de gracia, motor de cobro del Pro con 3 modalidades"), cell("Equipo plataforma")],
    [cell("14 días"), cell("Comunicación a clientes Pro actuales con fecha límite del 17 de junio"), cell("Jorge")],
    [cell("17 jun 2026"), cell("Cierre de la oferta de migración · activación del precio nuevo"), cell("Sistema")],
]
story.append(make_table_pretty(pasos_data, [2.5 * cm, 11.0 * cm, 3.5 * cm]))

story.append(Spacer(1, 16))
story.append(P(
    "Documento V2.3 cerrado. Listo para validación final con el equipo de formación.", "Caption"
))

# ────────────────────────────────────────────────────────────
# Build con cover personalizada
# ────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=2 * cm,
    rightMargin=2 * cm,
    topMargin=2.2 * cm,
    bottomMargin=2 * cm,
    title="J3 Lab Coach — Nuevo rumbo de la plataforma (V2.3)",
    author="J3 Lab Coach",
    subject="Arquitectura comercial",
)


def first_page(canv, doc):
    cover_page(canv, doc)


def later_pages(canv, doc):
    header_footer(canv, doc)


doc.build(story, onFirstPage=first_page, onLaterPages=later_pages)
print(f"PDF creado: {OUTPUT_PATH}")
