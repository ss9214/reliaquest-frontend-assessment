import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  weight: number;
  height: number;
  captureRate: number;
  stats: Array<{
    name: string;
    baseStat: number;
  }>;
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String) {
    pokemon(
      limit: 151
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (
  search?: string,
): {
  pokemons: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: {
      search: `(?i).*${search}.*` || '', // `.*${search}.*`,
    },
  });

  return {
    pokemons:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: p.pokemontypes.map((t: any) => t.type.typenames?.[0]?.name),
          sprite: p.pokemonsprites?.[0]?.sprites,
        }),
      ) ?? [],
    loading,
    error,
  };
};

export const useGetPokemonDetails = (id: string | null) => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: {
      id: id ? +id : null,
    },
    skip: !id,
  });

  return {
    pokemonDetails:
      data?.pokemon?.map(
        (p): PokemonDetail => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          captureRate: p.pokemonspecy.capture_rate,
          types: p.pokemontypes.map((t: any) => t.type.typenames?.[0]?.name),
          sprite: p.pokemonsprites?.[0]?.sprites,
          weight: p.weight,
          height: p.height,
          stats:
            p.pokemonstats?.map((stat: any) => ({
              name: stat.stat?.name,
              baseStat: stat.base_stat,
            })) || [],
        }),
      ) ?? [],
    loadingDetails: loading,
    errorDetails: error,
  };
};
