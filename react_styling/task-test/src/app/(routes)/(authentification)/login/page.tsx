'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { signIn } from "next-auth/react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/*
Page de login
*/

// Interface pour les données de login
interface LoginInput {
  email: string;
  password: string;
}

// Interface pour le modal d'erreur
interface ErrorModalProps {
  message: string;
  actionLabel: string;
  actionUrl: string;
  onClose: () => void;
  email: string;
}

// Composant Modal d'erreur
const ErrorModal = ({ message, actionLabel, actionUrl, onClose, email }: ErrorModalProps) => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const handleAction = async () => {
    if (actionLabel === "Renvoyer l'email") {
      setIsResending(true);
      try {
        const response = await fetch('/api/auth/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          toast.success("Email de vérification renvoyé avec succès");
          router.push(actionUrl);
        } else {
          toast.error("Erreur lors du renvoi de l'email");
        }
      } catch (error) {
        toast.error("Erreur lors du renvoi de l'email");
      } finally {
        setIsResending(false);
      }
    } else {
      router.push(actionUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Fermer
          </button>
          <button
            onClick={handleAction}
            disabled={isResending}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-50"
          >
            {isResending ? "Envoi en cours..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Fonction pour la page de login
export default function LoginPage() {
	// Initialisation des données de login
  const [formData, setFormData] = useState<LoginInput>({ email: '', password: '' });
	// Initialisation du remember me
  const [rememberMe, setRememberMe] = useState(false);
	// Initialisation de la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);
	// Initialisation du chargement
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message: string;
    actionLabel: string;
    actionUrl: string;
  }>({
    show: false,
    message: '',
    actionLabel: '',
    actionUrl: ''
  });
  const router = useRouter();

	// Fonction pour la visibilité du mot de passe
  const toggleShowPassword = () => setShowPassword(!showPassword);

	// Fonction pour le submit du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        console.log("🔄 Tentative de connexion avec:", formData.email);
        const res = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false
        });

        if (res?.error) {
            let errorMessage = "";
            let actionLabel = "";
            let actionUrl = "";

            switch (res.error) {
                case "Email non vérifié":
                    errorMessage = "Votre email n'a pas été vérifié. Veuillez vérifier votre boîte de réception.";
                    actionLabel = "Renvoyer l'email";
                    actionUrl = "/verify-email-notice";
                    break;
                case "Utilisateur non trouvé":
                    errorMessage = "Aucun compte n'existe avec cet email.";
                    actionLabel = "Créer un compte";
                    actionUrl = "/registration";
                    break;
                case "Mot de passe incorrect":
                    errorMessage = "Le mot de passe est incorrect.";
                    actionLabel = "Mot de passe oublié";
                    actionUrl = "/forgot-password";
                    break;
                default:
                    errorMessage = "Une erreur est survenue lors de la connexion.";
                    actionLabel = "Besoin d'aide ?";
                    actionUrl = "/contact";
            }

            setErrorModal({
                show: true,
                message: errorMessage,
                actionLabel: actionLabel,
                actionUrl: actionUrl
            });
            setIsLoading(false);
            return;
        }

        if (res?.ok) {
            toast.success("Connexion réussie !");
            setIsLoading(false);
            router.push("/dashboard");
        }
    } catch (error) {
        console.error("🔴 Erreur:", error);
        setErrorModal({
            show: true,
            message: "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
            actionLabel: "Contacter le support",
            actionUrl: "/contact"
        });
        setIsLoading(false);
    }
  };

	// Fonction pour la connexion avec Google
  const handleGoogleSignIn = async () => {
    try {
        await signIn('google', {
            callbackUrl: '/dashboard'
        });
    } catch (error) {
        toast.error("Erreur lors de la connexion avec Google");
    }
  };

	// Fonction pour la connexion avec Facebook
  const handleFacebookSignIn = async () => {
    try {
      await signIn('facebook', {
        callbackUrl: '/dashboard',
        redirect: true
      });
    } catch (error) {
      toast.error("Erreur lors de la connexion avec Facebook");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {errorModal.show && (
        <ErrorModal
          message={errorModal.message}
          actionLabel={errorModal.actionLabel}
          actionUrl={errorModal.actionUrl}
          onClose={() => setErrorModal({ ...errorModal, show: false })}
          email={formData.email}
        />
      )}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 lg:flex-none xl:px-24">
        <div className="flex justify-center m-4">
		<Link href="/home">
          <Image
            className="mb-6 rounded-xl shadow-md border border-gray-300"
            src="/logo.png"
            alt="logo"
            priority
            width={150}
            height={150}
          />
        </Link>
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-6 mt-6 mb-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-amber-500 sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-amber-500 sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center"
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember_me"
                  className="h-4 w-4 rounded-xl"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>
              <a href="/aide-connexion" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-amber-600 hover:text-amber-400">
                Besoin d'aide pour vous connecter ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 mt-6 rounded-xl shadow-sm text-sm font-medium text-white ${
                isLoading ? "bg-amber-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500"
              }`}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex flex-col justify-center">
            <p className="text-center text-gray-500">Ou se connecter avec</p>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="mx-2 p-4 border border-gray-300 rounded-xl shadow-lg bg-white hover:bg-gray-50"
              >
                <span className="sr-only">Se connecter avec Facebook</span>
                <Image src="/images/facebook.svg" alt="" className="w-8 h-8" width={24} height={24}/>
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mx-2 p-4 border border-gray-300 rounded-xl shadow-lg bg-white hover:bg-gray-50"
              >
                <span className="sr-only">Se connecter avec Google</span>
                <Image src="/images/google.svg" alt="" className="w-8 h-8" width={24} height={24}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden relative flex-1 sm:block">
        <Image
          src="/photo1.jpg"
          alt="Photo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
