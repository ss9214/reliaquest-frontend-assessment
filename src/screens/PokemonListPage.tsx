import React, { useState } from 'react';
import { tss } from '../tss';
import { useGetPokemons, Pokemon, useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { Spin, Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { id: pokemonIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dynamicSearchTerm, setDynamicSearchTerm] = useState('');
  const { pokemons, loading, error } = useGetPokemons(searchTerm);
  const { pokemonDetails, loadingDetails, errorDetails } = useGetPokemonDetails(
    pokemonIdFromUrl || null,
  );

  const handleSearch = () => {
    setSearchTerm(dynamicSearchTerm);
  };

  const clickPokemon = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleCloseModal = () => {
    navigate('/list');
  };

  if (loading)
    return (
      <div className={classes.loadingContainer}>
        <Spin size="large" />
        <div className={classes.loadingText}>Loading Pokémon...</div>
      </div>
    );
  if (loadingDetails)
    return (
      <div className={classes.loadingContainer}>
        <Spin size="large" />
        <div className={classes.loadingText}>Loading Pokémon...</div>
      </div>
    );

  if (pokemons.length === 0) {
    return (
      <div className={classes.root}>
        <h1 className={classes.title}>Pokemon List</h1>
        <div className={classes.searchContainer}>
          <Input
            placeholder="Search for a Pokémon"
            value={dynamicSearchTerm}
            onChange={(e) => setDynamicSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            className={classes.searchInput}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className={classes.searchButton}
          >
            Search
          </Button>
        </div>
        <h1 className={classes.title}>No Pokémon Found</h1>
      </div>
    );
  }

  if (error) return <div className={classes.root}>Error: {error.message}</div>;

  if (errorDetails) return <div className={classes.root}>Error: {errorDetails.message}</div>;

  const pokemonDetail = pokemonDetails?.[0];

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Pokémon List</h1>
      <div className={classes.searchContainer}>
        <Input
          placeholder="Search for a Pokémon"
          value={dynamicSearchTerm}
          onChange={(e) => setDynamicSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
          className={classes.searchInput}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          className={classes.searchButton}
        >
          Search
        </Button>
      </div>
      <div className={classes.listContainer}>
        {pokemons?.map((pokemon) => (
          <div
            key={pokemon.id}
            className={classes.card}
            onClick={() => clickPokemon(pokemon)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                clickPokemon(pokemon);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {pokemon.sprite && (
              <img src={pokemon.sprite} alt={pokemon.name} className={classes.image} />
            )}
            <div className={classes.details}>
              <div className={classes.detailRow}>
                <span className={classes.label}>Number:</span> {pokemon.id}
              </div>
              <div className={classes.detailRow}>
                <span className={classes.label}>Name:</span> {pokemon.name}
              </div>
              <div className={classes.detailRow}>
                <span className={classes.label}>Types:</span>{' '}
                {pokemon.types?.filter(Boolean).join(', ') || 'Unknown'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!pokemonIdFromUrl}
        onCancel={handleCloseModal}
        onOk={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
        width={600}
        className={classes.modal}
      >
        {(() => {
          if (loadingDetails) {
            return (
              <div className={classes.modalLoadingContainer}>
                <Spin size="large" />
                <div className={classes.loadingText}>Loading Pokémon details...</div>
              </div>
            );
          }
          if (errorDetails) {
            return <div>Error: {errorDetails}</div>;
          }
          if (pokemonDetail) {
            return (
              <div className={classes.modalContent}>
                {pokemonDetail.sprite && (
                  <img
                    src={pokemonDetail.sprite}
                    alt={pokemonDetail.name}
                    className={classes.modalImage}
                  />
                )}
                <h2 className={classes.modalTitle}>{pokemonDetail.name}</h2>
                <div className={classes.modalDetails}>
                  <div className={classes.modalDetailRow}>
                    <span className={classes.modalLabel}>Number:</span> {pokemonDetail.id}
                  </div>
                  <div className={classes.modalDetailRow}>
                    <span className={classes.modalLabel}>Types:</span>{' '}
                    {pokemonDetail.types?.filter(Boolean).join(', ') || 'Unknown'}
                  </div>
                  <div className={classes.modalDetailRow}>
                    <span className={classes.modalLabel}>Height:</span> {pokemonDetail.height / 10}m
                  </div>
                  <div className={classes.modalDetailRow}>
                    <span className={classes.modalLabel}>Weight:</span> {pokemonDetail.weight / 10}
                    kg
                  </div>
                  <div className={classes.modalDetailRow}>
                    <span className={classes.modalLabel}>Capture Rate:</span>{' '}
                    {pokemonDetail.captureRate}
                  </div>
                  {pokemonDetail.stats && pokemonDetail.stats.length > 0 && (
                    <div className={classes.modalStatsSection}>
                      <h3 className={classes.modalSectionTitle}>Stats</h3>
                      {pokemonDetail.stats.map((stat) => (
                        <div
                          key={`${stat.name}-${stat.baseStat}`}
                          className={classes.modalDetailRow}
                        >
                          <span className={classes.modalLabel}>
                            {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:
                          </span>{' '}
                          {stat.baseStat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </Modal>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    color: theme.color.text.primary,
    marginBottom: 24,
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    maxWidth: 600,
    margin: '0 auto 24px',
  },
  searchInput: {
    flex: 1,
    maxWidth: 400,
  },
  searchButton: {
    minWidth: 100,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: 16,
  },
  loadingText: {
    color: theme.color.text.primary,
    fontSize: 16,
  },
  listContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  card: {
    backgroundColor: theme.color.surface,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  image: {
    width: '100%',
    maxWidth: 150,
    height: 'auto',
    marginBottom: 12,
  },
  details: {
    width: '100%',
    textAlign: 'left',
  },
  detailRow: {
    marginBottom: 8,
    fontSize: 14,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  label: {
    fontWeight: 'bold',
    color: theme.color.text.primary,
  },
  modal: {
    '& .ant-modal-content': {
      backgroundColor: theme.color.surface,
      color: theme.color.text.primary,
    },
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  modalImage: {
    width: '100%',
    maxWidth: 300,
    height: 'auto',
  },
  modalTitle: {
    color: theme.color.text.primary,
    fontSize: 28,
    fontWeight: 'bold',
    margin: 0,
  },
  modalDetails: {
    width: '100%',
    textAlign: 'left',
  },
  modalDetailRow: {
    marginBottom: 12,
    fontSize: 16,
    color: theme.color.text.primary,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: theme.color.text.primary,
  },
  modalStatsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
  },
  modalSectionTitle: {
    color: theme.color.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalLoadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    gap: 16,
  },
}));
