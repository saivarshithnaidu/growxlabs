import { jsPDF } from "jspdf";
import type { ArtifactGenerationRequest } from "../artifact.types";

/*
 * A real PDF: title, headed sections with wrapped text, and a simple table that breaks across
 * pages. The built-in Helvetica has no rupee glyph, so ₹ is written as "Rs.".
 */

const PAGE = { width: 595.28, height: 841.89, margin: 48 };
const INK = 20;
const MUTED = 110;
const RULE = 215;

const pdfSafe = (value: string) =>
  String(value ?? "")
    .replace(/₹\s?/g, "Rs. ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");

const stripMarkdown = (value: string) => value.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/^#+\s*/gm, "");

export class PdfGenerator {
  static generate(req: ArtifactGenerationRequest): Buffer {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const width = PAGE.width - PAGE.margin * 2;
    let y = PAGE.margin;

    const ensure = (needed: number) => {
      if (y + needed > PAGE.height - PAGE.margin) {
        doc.addPage();
        y = PAGE.margin;
      }
    };

    const paragraph = (text: string, size = 10.5, color = INK, gap = 6) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(color);
      for (const raw of pdfSafe(stripMarkdown(text)).split(/\n/)) {
        const lines = doc.splitTextToSize(raw || " ", width) as string[];
        for (const line of lines) {
          ensure(size * 1.45);
          doc.text(line, PAGE.margin, y + size);
          y += size * 1.45;
        }
      }
      y += gap;
    };

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(INK);
    for (const line of doc.splitTextToSize(pdfSafe(req.content.title), width) as string[]) {
      doc.text(line, PAGE.margin, y + 18);
      y += 24;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(MUTED);
    doc.text(`GrowX Labs  ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`, PAGE.margin, y + 6);
    y += 24;

    for (const section of req.content.sections || []) {
      if (section.heading) {
        ensure(30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(INK);
        doc.text(pdfSafe(section.heading), PAGE.margin, y + 12.5);
        y += 22;
      }
      paragraph(section.body);
    }

    if (!req.content.sections?.length && req.content.rawMarkdown) paragraph(req.content.rawMarkdown);

    if (req.content.table && req.content.table.headers.length) {
      const { headers, rows } = req.content.table;
      const colWidth = width / headers.length;
      const cellLines = (cells: string[]) => cells.map((c) => doc.splitTextToSize(pdfSafe(c), colWidth - 8) as string[]);
      const drawRow = (cells: string[], bold: boolean) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(9);
        const wrapped = cellLines(cells);
        const height = Math.max(...wrapped.map((l) => l.length)) * 12 + 8;
        ensure(height);
        wrapped.forEach((lines, i) => {
          doc.setTextColor(bold ? MUTED : INK);
          lines.forEach((line, j) => doc.text(line, PAGE.margin + i * colWidth + 4, y + 12 + j * 12));
        });
        y += height;
        doc.setDrawColor(RULE);
        doc.line(PAGE.margin, y, PAGE.margin + width, y);
      };
      ensure(40);
      y += 6;
      drawRow(headers, true);
      for (const row of rows) drawRow(headers.map((_, i) => row[i] ?? ""), false);
    }

    return Buffer.from(doc.output("arraybuffer"));
  }
}
