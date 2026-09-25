import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerReview } from '../types';
import { reviewsData } from '../data/products';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface ReviewsContextType {
  reviews: CustomerReview[];
  approvedReviews: CustomerReview[];
  pendingReviews: CustomerReview[];
  isLoading: boolean;
  submitReview: (reviewData: Omit<CustomerReview, 'id' | 'status' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  approveReview: (reviewId: string) => Promise<void>;
  rejectReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

const REVIEWS_STORAGE_KEY = 'casacas_customer_reviews';
const FIRESTORE_DOC_PATH = { collection: 'site_content', doc: 'reviews' };

const initialSeedReviews: CustomerReview[] = reviewsData.map((r, i) => ({
  id: `rev-seed-${r.id || i + 1}`,
  author: r.author,
  origin: r.origin,
  stars: r.stars,
  text: r.text,
  status: 'approved',
  createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
  isAnonymous: false,
  featured: Boolean(r.featured)
}));

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialSeedReviews;
    } catch {
      return initialSeedReviews;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firestore in real-time
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const syncFirestore = async () => {
      try {
        const reviewDocRef = doc(db, FIRESTORE_DOC_PATH.collection, FIRESTORE_DOC_PATH.doc);
        const snapshot = await getDoc(reviewDocRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.items)) {
            setReviews(data.items);
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data.items));
          }
        } else {
          // Initialize Firestore with seed reviews
          await setDoc(reviewDocRef, {
            items: initialSeedReviews,
            updatedAt: new Date().toISOString()
          });
          setReviews(initialSeedReviews);
          localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(initialSeedReviews));
        }

        // Real-time listener
        unsubscribe = onSnapshot(reviewDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (Array.isArray(data?.items)) {
              setReviews(data.items);
              localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data.items));
            }
          }
        });
      } catch (err) {
        console.warn('Firestore offline o en espera para reseñas, usando almacenamiento local:', err);
      } finally {
        setIsLoading(false);
      }
    };

    syncFirestore();

    return () => {
      unsubscribe();
    };
  }, []);

  const saveReviewsToCloud = async (newReviews: CustomerReview[]) => {
    setReviews(newReviews);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(newReviews));
    try {
      const reviewDocRef = doc(db, FIRESTORE_DOC_PATH.collection, FIRESTORE_DOC_PATH.doc);
      await setDoc(reviewDocRef, {
        items: newReviews,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error al guardar reseñas en Firestore:', err);
    }
  };

  // Submit new review (ALWAYS PENDING initially for moderation)
  const submitReview = async (reviewData: Omit<CustomerReview, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'pending', // Moderation required before publishing!
      createdAt: new Date().toISOString()
    };

    const updated = [newReview, ...reviews];
    await saveReviewsToCloud(updated);

    return {
      success: true,
      message: '¡Gracias por compartir tu opinión! Tu reseña ha sido enviada y será publicada en la web una vez que nuestro equipo la verifique.'
    };
  };

  // Admin approves review
  const approveReview = async (reviewId: string) => {
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status: 'approved' as const } : r));
    await saveReviewsToCloud(updated);
  };

  // Admin rejects review
  const rejectReview = async (reviewId: string) => {
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status: 'rejected' as const } : r));
    await saveReviewsToCloud(updated);
  };

  // Admin permanently deletes review
  const deleteReview = async (reviewId: string) => {
    const updated = reviews.filter((r) => r.id !== reviewId);
    await saveReviewsToCloud(updated);
  };

  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        approvedReviews,
        pendingReviews,
        isLoading,
        submitReview,
        approveReview,
        rejectReview,
        deleteReview
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
