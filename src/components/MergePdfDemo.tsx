"use client";

import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";

const REPO_URL = "https://github.com/Jarvis-123/formatdesk-lite";

type FileEntry = {
  id: string;
  file: File;
  pages: number;
};

export function MergePdfDemo() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(async (list: FileList | null) => {
    if (!list?.length) return;
    setError(null);
    const next: FileEntry[] = [];

    for (const file of Array.from(list)) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        continue;
      }
      try {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        next.push({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
          pages: pdf.getPageCount(),
        });
      } catch {
        setError(`Could not read ${file.name} — is it a valid PDF?`);
      }
    }

    setFiles((prev) => [...prev, ...next]);
  }, []);

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function moveFile(id: string, dir: -1 | 1) {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  }

  async function mergeAndDownload() {
    if (files.length === 0) return;
    setMerging(true);
    setError(null);

    try {
      const merged = await PDFDocument.create();
      let totalPages = 0;

      for (const entry of files) {
        const bytes = await entry.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const indices = pdf.getPageIndices();
        const pages = await merged.copyPages(pdf, indices);
        pages.forEach((page) => merged.addPage(page));
        totalPages += indices.length;
      }

      const outBytes = await merged.save();
      const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);

      if (totalPages === 0) {
        setError("Merged PDF has no pages.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed.");
    } finally {
      setMerging(false);
    }
  }

  const totalPages = files.reduce((n, f) => n + f.pages, 0);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-10 md:py-14">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Client-side · MIT
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">FormatDesk Lite</h1>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Merge PDFs in your browser. Files never leave your device — no server upload, no
          Gotenberg. Public extract of a document-ops pattern.
        </p>
      </header>

      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-12 text-center transition-colors hover:border-[var(--accent)]"
      >
        <input
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="font-medium">Drop PDFs here or click to add</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Order below = merge order</p>
      </label>

      {error ? (
        <p className="rounded-xl border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <section className="space-y-3">
          <p className="text-sm text-[var(--muted)]">
            {files.length} file{files.length === 1 ? "" : "s"} · {totalPages} pages total
          </p>
          <ul className="space-y-2">
            {files.map((entry, index) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
              >
                <span className="text-xs font-mono text-[var(--muted)] w-6">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.file.name}</p>
                  <p className="text-xs text-[var(--muted)]">{entry.pages} pages</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveFile(entry.id, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(entry.id, 1)}
                    disabled={index === files.length - 1}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(entry.id)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={mergeAndDownload}
            disabled={merging}
            className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {merging ? "Merging…" : "Merge & download PDF"}
          </button>
        </section>
      ) : null}

      <footer className="text-xs text-[var(--muted)]">
        Built by Amit Singh · Pattern from internal Format Desk · no employer documents or server
        converters.
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block rounded text-[var(--fg)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          View source on GitHub
        </a>
      </footer>
    </div>
  );
}
