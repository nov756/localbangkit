import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare, Send, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { UmkmItem, UmkmReview } from '../types';
import { INITIAL_REVIEWS_MAP } from '../data/initialReviews';
import { db, handleFirestoreError, OperationType, loginWithGoogle } from '../firebase';
import { collection, doc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

interface UmkmReviewModalProps {
  umkm: UmkmItem;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onReviewAdded?: (umkmId: string, newAvgRating: number, newCount: number) => void;
}

export const UmkmReviewModal: React.FC<UmkmReviewModalProps> = ({
  umkm,
  isOpen,
  onClose,
  user,
  onReviewAdded,
}) => {
  const [reviews, setReviews] = useState<UmkmReview[]>(() => {
    // Check localStorage fallback
    const saved = localStorage.getItem(`lokalbangkit_reviews_${umkm.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_REVIEWS_MAP[umkm.id] || [];
  });

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Firestore real-time listener for reviews of this UMKM
  useEffect(() => {
    if (!isOpen) return;

    let unsub: (() => void) | undefined;
    try {
      const reviewsCol = collection(db, 'umkm', umkm.id, 'reviews');
      const q = query(reviewsCol, orderBy('createdAt', 'desc'));

      unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: UmkmReview[] = [];
            snapshot.forEach((snap) => {
              fetched.push(snap.data() as UmkmReview);
            });
            setReviews(fetched);
            localStorage.setItem(`lokalbangkit_reviews_${umkm.id}`, JSON.stringify(fetched));

            // Notify parent about updated rating
            const totalRating = fetched.reduce((acc, r) => acc + r.rating, 0);
            const avg = Number((totalRating / fetched.length).toFixed(1));
            onReviewAdded?.(umkm.id, avg, fetched.length);
          } else {
            // If empty in Firestore, seed initial reviews if any
            const initialList = INITIAL_REVIEWS_MAP[umkm.id] || [];
            if (initialList.length > 0) {
              initialList.forEach(async (initRev) => {
                try {
                  await setDoc(doc(db, 'umkm', umkm.id, 'reviews', initRev.id), initRev);
                } catch (e) {
                  // ignore seeding error
                }
              });
            }
          }
        },
        (error) => {
          console.warn('Firestore reviews listener fallback:', error.message);
        }
      );
    } catch (e) {
      console.warn('Firestore reviews init:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [isOpen, umkm.id]);

  if (!isOpen) return null;

  const currentAverage =
    reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!comment.trim()) {
      setErrorMsg('Mohon tuliskan testimoni atau ulasan Anda.');
      return;
    }

    setIsSubmitting(true);

    const reviewId = `rev-${Date.now()}`;
    const newReview: UmkmReview = {
      id: reviewId,
      umkmId: umkm.id,
      userId: user?.uid || `guest-${Date.now()}`,
      userName: user?.displayName || 'Warga Sekitar (Anonim)',
      userPhoto: user?.photoURL || undefined,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Optimistic update
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`lokalbangkit_reviews_${umkm.id}`, JSON.stringify(updated));

    const total = updated.reduce((acc, r) => acc + r.rating, 0);
    const newAvg = Number((total / updated.length).toFixed(1));
    onReviewAdded?.(umkm.id, newAvg, updated.length);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'umkm', umkm.id, 'reviews', reviewId), newReview);
    } catch (err) {
      console.warn('Review saved locally. Firestore error:', err);
    }

    setIsSubmitting(false);
    setSuccessMsg(true);
    setComment('');
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Login error in review modal:', err);
      alert('Gagal login dengan Google: ' + (err?.message || 'Terjadi kesalahan'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                Testimoni & Rating Warga
              </span>
              <span className="text-xs text-slate-400">·</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="tabular-nums">{currentAverage}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">
                  ({reviews.length} ulasan)
                </span>
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {umkm.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {umkm.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Write a review section */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-red-600" />
                <span>Beri Rating & Testimoni</span>
              </h4>

              {/* User indicator or login prompt */}
              {user ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="text-[11px] text-slate-400">Sebagai:</span>
                  <span className="font-bold text-red-700 dark:text-red-400 truncate max-w-[120px]">
                    {user.displayName || 'Warga Terverifikasi'}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 hover:underline"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Masuk Google untuk Badge Terverifikasi</span>
                </button>
              )}
            </div>

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Terima kasih! Ulasan Anda telah berhasil disimpan dan dipublikasikan.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              {/* Interactive Star Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Pilih Nilai Bintang:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {rating} dari 5 Bintang
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <textarea
                  required
                  rows={2}
                  maxLength={400}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan kepuasan Anda: kualitas rasa, kerapian jasa, keramahan pedagang, dsb..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Testimoni</span>
                </button>
              </div>
            </form>
          </div>

          {/* Reviews list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ulasan Pelanggan & Tetangga ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Belum ada ulasan untuk UMKM ini. Jadilah warga pertama yang memberikan testimoni!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.userPhoto ? (
                          <img
                            src={rev.userPhoto}
                            alt={rev.userName}
                            className="w-5 h-5 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-[10px]">
                            {rev.userName[0]}
                          </div>
                        )}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {rev.userName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200 dark:text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1">{rev.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
