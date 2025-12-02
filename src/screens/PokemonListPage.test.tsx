import React from 'react';
import { act, fireEvent, render } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({
    pokemons: [{ id: '1', name: 'Bulbasaur' }],
    loading: false,
    error: null,
  }),
  useGetPokemonDetails: jest.fn().mockReturnValue({
    pokemonDetails: [],
    loadingDetails: false,
    errorDetails: null,
  }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('PokemonListPage', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });
  });

  test('it renders', () => {
    const { getByText } = render(<PokemonListPage />);
    getByText('Bulbasaur');
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1');
  });
  test.todo('typing in the search bar filters the results');
});