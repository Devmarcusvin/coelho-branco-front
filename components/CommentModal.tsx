"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  initialComment?: string;
}

export function CommentModal({
  isOpen,
  onClose,
  onSubmit,
  initialComment = "",
}: CommentModalProps) {
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (isOpen) {
      setComment(initialComment);
    }
  }, [isOpen, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-100 rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800"
        >
          <X size={20} />
        </button>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comentário"
          rows={8}
          className="w-full resize-none rounded-lg bg-white p-3 text-sm mb-5 outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#6A38F3] hover:bg-[#5228d4] text-white font-medium py-3 rounded-full transition"
        >
          Avaliar
        </button>
      </div>
    </div>
  );
}