"use client";

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";

interface RatingModalProps {
  storeName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  onDelete?: () => void;
  initialRating?: number;
  initialComment?: string;
  title?: string;
}

export function RatingModal({
  storeName,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialRating = 0,
  initialComment = "",
  title = "Você está avaliando",
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
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

        <p className="text-base mb-5 pr-8">
          {title} <span className="font-medium">{storeName}</span>
        </p>

        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Avaliar com ${value} estrela${value > 1 ? "s" : ""}`}
            >
              <Star
                size={32}
                className={
                  value <= (hoverRating || rating)
                    ? "fill-[#FFD700] text-[#FFD700]"
                    : "fill-transparent text-[#6A38F3]"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Avaliação da loja"
          rows={5}
          className="w-full resize-none rounded-lg bg-white p-3 text-sm mb-5 outline-none focus:ring-2 focus:ring-purple-300"
        />

        {onDelete && (
          <button
            onClick={onDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-full transition mb-3"
          >
            DELETAR
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-[#6A38F3] hover:bg-[#5228d4] disabled:bg-[#b9a3f7] text-white font-medium py-3 rounded-full transition"
        >
          Avaliar
        </button>
      </div>
    </div>
  );
}