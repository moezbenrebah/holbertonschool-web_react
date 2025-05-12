"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MessageCircleIcon, ShoppingCartIcon, MapPinIcon, Info, UserIcon, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hook/auth/useAuth';
import { useTokens } from '@/hook/auth/useTokens';
import { TokenDebug } from '@/components/TokenDebug';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserHomePage = () => {
  const router = useRouter();
  const session = useAuth();
  const { access, refresh, isLoading } = useTokens();
  const [accessGranted, setAccessGranted] = useState(false);

  console.log('👤 Session:', session);

  //----- Vérification du code d'accès -----//
  useEffect(() => {
    const verifyStoredCode = async () => {
      const storedCode = localStorage.getItem("accessCode");
      if (!storedCode) return;

      try {
        const response = await fetch(`/api/access-codes/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: storedCode }),
        });

        if (response.ok) {
          setAccessGranted(true);
        } else {
          localStorage.removeItem("accessCode");
          setAccessGranted(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du code:", error);
        setAccessGranted(false);
      }
    };

    verifyStoredCode();
  }, []);

  //----- Soumission du code d'accès -----//
  const handleAccessCodeSubmit = async (data: any) => {
    const codeSaisi = data.code;
    try {
      const response = await fetch("/api/verify-access-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeSaisi }),
      });
      if (response.ok) {
        localStorage.setItem("accessGranted", "true");
        setAccessGranted(true);
      } else {
        toast.error("Code invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code :", error);
      toast.error("Erreur lors de la vérification du code");
    }
  };

  if (isLoading) {
    return <div><LoadingSpinner /></div>;
  }


  const accommodation = {
    name: 'Villa bleu',
    city: 'Paris',
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 mt-10">
        <h1 className="text-4xl font-bold mb-4">Bienvenue dans votre espace Eazost</h1>
        <p>Retrouvez ici toutes les informations de votre location</p>
        <div className="space-y-4 items-center justify-center">
          <div className="flex flex-col items-center justify-center mt-10">
            <h2 className="text-3xl font-semibold text-center">{accommodation.name}</h2>
            <p className="text-center text-xl mb-2">{accommodation.city}</p>
          </div>
          <div className="grid grid-cols-3 gap-8 gap-y-12 items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <button
                className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow hover:shadow-gray-500 hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                onClick={() => router.push(`/homePage/cardinfo`)}
              >
                <Info className="w-40 h-40" />
              </button>
              <p className="text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48">Information</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                onClick={() => router.push(`/homePage/shop`)}
              >
                <ShoppingCartIcon className="w-40 h-40" />
              </button>
              <p className="text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48">Boutique</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                onClick={() => router.push(`/homePage/contact`)}
              >
                <MessageCircleIcon className="w-40 h-40" />
              </button>
              <p className="text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48">Contact</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                onClick={() => router.push(`/homePage/map`)}
              >
                <MapPinIcon className="w-40 h-40" />
              </button>
              <p className="text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48">Carte</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                onClick={() => router.push(`/homePage/profil`)}
              >
                <UserIcon className="w-40 h-40" />
              </button>
              <p className="text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48">Profil</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                onClick={() => router.push(`/homePage`)}
              >
                <ShoppingBag className="w-40 h-40" />
              </button>
              <p className="text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48">Commandes</p>
            </div>
          </div>
        </div>
      </div>

      {!accessGranted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">Bienvenue sur Eazost</h2>
            <p className="text-center text-gray-600 mb-6">
              Veuillez entrer votre code d'accès pour accéder à votre espace
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAccessCodeSubmit({ code: formData.get("code") });
              }}
            >
              <input
                type="text"
                name="code"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Entrez votre code"
                required
              />
              <Button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 shadow-lg"
              >
                Valider
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserHomePage;
