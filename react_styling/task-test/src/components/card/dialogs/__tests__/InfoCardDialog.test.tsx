import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionProvider } from 'next-auth/react';
import InfoCardDialog from '../InfoCardDialog';

describe('InfoCardDialog', () => {
  const mockOnAddInfoCard = vi.fn();
  const mockOnEditInfoCard = vi.fn();
  const mockOnDeleteInfoCard = vi.fn();

  it('devrait afficher le formulaire de création de carte', () => {
    render(
      <SessionProvider session={{ data: { user: { id: 1, email: 'test@test.com' } }, status: 'authenticated' }}>
        <InfoCardDialog
          id={1}
          onAddInfoCard={mockOnAddInfoCard}
          onEditInfoCard={mockOnEditInfoCard}
          onDeleteInfoCard={mockOnDeleteInfoCard}
        >
          <button>Ouvrir</button>
        </InfoCardDialog>
      </SessionProvider>
    );

    // Cliquer sur le bouton pour ouvrir le dialogue
    fireEvent.click(screen.getByText('Ouvrir'));

    // Vérifier que le titre est affiché
    expect(screen.getByText('Nouvelle carte')).toBeInTheDocument();

    // Vérifier que les champs du formulaire sont présents
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/catégorie/i)).toBeInTheDocument();
  });

  it('devrait appeler onAddInfoCard lors de la soumission du formulaire', async () => {
    mockOnAddInfoCard.mockResolvedValueOnce({ id: 1, title: 'Test' });

    render(
      <SessionProvider session={{ data: { user: { id: 1, email: 'test@test.com' } }, status: 'authenticated' }}>
        <InfoCardDialog
          id={1}
          onAddInfoCard={mockOnAddInfoCard}
          onEditInfoCard={mockOnEditInfoCard}
          onDeleteInfoCard={mockOnDeleteInfoCard}
        >
          <button>Ouvrir</button>
        </InfoCardDialog>
      </SessionProvider>
    );

    // Ouvrir le dialogue
    fireEvent.click(screen.getByText('Ouvrir'));

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/titre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Description' } });
    fireEvent.change(screen.getByLabelText(/catégorie/i), { target: { value: 'Electroménager' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText(/créer/i));

    // Vérifier que onAddInfoCard a été appelé avec les bonnes données
    await waitFor(() => {
      expect(mockOnAddInfoCard).toHaveBeenCalledWith(1, {
        title: 'Test',
        description: 'Description',
        category: 'Electroménager',
        accommodation_id: 1,
        photo_url: null
      });
    });
  });
});
