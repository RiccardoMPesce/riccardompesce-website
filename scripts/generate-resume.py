"""Create conservative, editable OOXML portfolios from the exported bilingual portfolio."""

import argparse
import json
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


def build(content, language, destination):
    """Render the complete public portfolio using native Word paragraph styles."""
    italian = language == "it"
    labels = (
        ["Profilo professionale", "Competenze principali", "Esperienza professionale", "Formazione", "Progetti", "Strumenti e tecnologie", "Certificazioni e corsi", "Lingue", "Comunità e volontariato"]
        if italian else
        ["Professional Summary", "Core Competencies", "Professional Experience", "Education", "Projects", "Technical Toolkit", "Credentials and Courses", "Languages", "Community and Volunteering"]
    )
    doc = Document()
    # Word's default template carries a Title border that Google Docs can revive.
    for border in doc.styles.element.xpath(".//w:pBdr"):
        border.getparent().remove(border)
    section = doc.sections[0]
    section.page_width, section.page_height = Cm(21), Cm(29.7)
    section.top_margin = section.bottom_margin = Cm(1.8)
    section.left_margin = section.right_margin = Cm(1.9)
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.08
    normal.paragraph_format.widow_control = True
    lang = OxmlElement("w:lang")
    lang.set(qn("w:val"), "it-IT" if italian else "en-GB")
    normal.element.get_or_add_rPr().append(lang)
    for name, size in [("Title", 22), ("Subtitle", 11), ("Heading 1", 14), ("Heading 2", 11.5), ("Heading 3", 10.5)]:
        style = doc.styles[name]
        style.font.name = "Calibri"
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor(0, 0, 0)
        style.font.bold = name != "Subtitle"
        style.paragraph_format.space_before = Pt(12 if name == "Heading 1" else 7)
        style.paragraph_format.space_after = Pt(5)
        style.paragraph_format.keep_with_next = True
    doc.core_properties.title = "Riccardo Maria Pesce Portfolio completo" if italian else "Riccardo Maria Pesce Full Portfolio"
    doc.core_properties.author = "Riccardo Maria Pesce"
    doc.core_properties.subject = "Portfolio professionale completo" if italian else "Detailed professional portfolio"
    doc.core_properties.language = "it-IT" if italian else "en-GB"

    def paragraph(text, style=None):
        return doc.add_paragraph(text.replace("andsearch", "and search"), style)

    title = paragraph("Riccardo Maria Pesce", "Title")
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle = paragraph("Ingegnere informatico | Responsabile tecnico | Soluzioni di ingegneria e business" if italian else "Computer Engineer | Technical Lead | Engineering and Business Solutions", "Subtitle")
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for text in ["Catania, Italia | CET/CEST" if italian else "Catania, Italy | CET/CEST", "riccardompesce@gmail.com | https://riccardompesce.com", "https://linkedin.com/in/riccardomariapesce | https://github.com/RiccardoMPesce"]:
        p = paragraph(text)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.size = Pt(9)
    paragraph(labels[0], "Heading 1")
    paragraph(
        "Ingegnere informatico e responsabile tecnico con laurea magistrale conseguita con 110/110 e lode. Esperienza che collega progettazione dei sistemi, dati e delivery con esigenze degli stakeholder e decisioni commerciali nei settori assicurativo, gaming e media."
        if italian else
        "Computer engineer and technical lead with an M.Sc. awarded 110/110 with honours. Experience connects systems design, data and delivery with stakeholder needs and commercial decisions across insurance, gaming and media."
    )
    paragraph(
        "Esperienza in architettura delle soluzioni, studi di fattibilità, analisi dei requisiti, coordinamento di team e fornitori e delivery attenta al budget. Il percorso comprende intelligence commerciale, ingegneria dei dati e integrazione enterprise, su basi accademiche in automazione, controlli, elettronica, telecomunicazioni, IoT e intelligenza artificiale."
        if italian else
        "Experience spans solution architecture, feasibility studies, requirements analysis, team and vendor coordination, and budget-conscious delivery. The career combines commercial intelligence, data engineering and enterprise integration with academic foundations in automation, control, electronics, telecommunications, IoT and artificial intelligence."
    )
    paragraph(labels[1], "Heading 1")
    for capability in content["capabilities"]:
        paragraph(capability["title"], "Heading 2")
        paragraph(capability["description"])
        paragraph("; ".join(capability["items"]) + ".")
    paragraph(labels[2], "Heading 1")
    for role in content["experiences"]:
        paragraph(role["employer"], "Heading 2")
        p = paragraph(role["role"])
        p.runs[0].bold = True
        p.paragraph_format.keep_with_next = True
        p = paragraph(f'{role["period"]} | {role["location"]}')
        p.paragraph_format.keep_with_next = True
        paragraph(role["summary"])
        for contribution in role["contributions"]:
            paragraph(contribution, "List Bullet")
        paragraph(("Tecnologie: " if italian else "Technologies: ") + ", ".join(role["tools"]))
    paragraph(labels[3], "Heading 1")
    for degree in content["education"]:
        paragraph(degree["degree"], "Heading 2")
        paragraph(f'{degree["institution"]} | {degree["year"]} | {degree["credits"]} ' + ("CFU" if italian else "ECTS credits") + (f' | {degree["result"]}' if "result" in degree else ""))
        thesis = degree["thesis"]
        paragraph(thesis["label"], "Heading 3")
        paragraph(thesis["title"] or ("Titolo non disponibile" if italian else "Title unavailable"))
        paragraph(f'{thesis["credits"]} ' + ("CFU" if italian else "ECTS credits"))
        for part in thesis["sections"]:
            paragraph(part["heading"], "Heading 3")
            for text in part["paragraphs"]:
                paragraph(text)
        paragraph("Insegnamenti e attività accademiche" if italian else "Coursework and Academic Activities", "Heading 3")
        for course in degree["coursework"]:
            paragraph(f'{course["name"]} | {course["credits"]} ' + ("CFU" if italian else "ECTS credits") + (f' | Anno {course["year"]}' if italian else f' | Year {course["year"]}'), "Heading 3")
            description = paragraph(course["description"])
            # Keep the evidence URL with its course rather than orphaning it on a new page.
            description.paragraph_format.keep_with_next = bool(course["syllabus"])
            if course["syllabus"]:
                syllabus = course["syllabus"]
                p = paragraph(("Programma di riferimento " if italian else "Reference syllabus ") + syllabus["academicYear"] + ": " + syllabus["url"])
                for run in p.runs:
                    run.font.size = Pt(8.5)
        paragraph(
            "Le descrizioni sintetizzano i programmi storici indicati; l’edizione di riferimento non dimostra la frequenza in uno specifico anno o canale. Le competenze accademiche sono distinte dall’esperienza professionale."
            if italian else
            "Descriptions summarize the historical syllabi linked above; the reference edition does not establish attendance in a particular year or teaching channel. Academic foundations are distinct from professional experience."
        )
    paragraph(labels[4], "Heading 1")
    for project in content["projects"]:
        paragraph(project["name"], "Heading 2")
        paragraph(project["role"])
        paragraph(project["description"])
        paragraph(project["url"])
        paragraph(", ".join(project["tools"]))
    paragraph(labels[5], "Heading 1")
    for group in content["toolkit"]:
        paragraph(group["title"], "Heading 2")
        paragraph(group["tools"])
    paragraph(labels[6], "Heading 1")
    for credential in content["credentials"]:
        paragraph(f'{credential["name"]} | {credential["issuer"]} | {credential["issued"]}', "List Bullet")
    paragraph(labels[7], "Heading 1")
    paragraph("Italiano: madrelingua | Inglese: C1" if italian else "Italian: native | English: C1")
    paragraph(labels[8], "Heading 1")
    paragraph("Attività e associazioni durante gli studi: EESTEC e GDG Catania." if italian else "Academic activities and associations during studies included EESTEC and GDG Catania.")
    for activity in content["community"]:
        paragraph(f'{activity["role"]} | {activity["organization"]} | {activity["period"]}', "List Bullet")
    doc.save(destination)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    source = json.loads(args.source.read_text())
    args.output.mkdir(parents=True, exist_ok=True)
    for language in ("en", "it"):
        build(source[language], language, args.output / f"riccardo-pesce-full-portfolio-{language}.docx")
