"use client";

import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-[120px] animate-pulse rounded-lg border border-zinc-200 bg-zinc-50"
      aria-hidden
    />
  ),
});

export default RichTextEditor;
