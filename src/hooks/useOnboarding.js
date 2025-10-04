// fileName: src/hooks/useOnboarding.js (VERSIÓN FINAL Y ESTABLE)

import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../api/apiClient';

export const useOnboarding = (open, onClose) => {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState({ generos: [], sentimientos: [] });
  const [selections, setSelections] = useState({ generos: [], sentimientos: [], autores: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [artistResults, setArtistResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const steps = useMemo(() => [
    { title: '¡Bienvenido/a a Take a Break!', content: 'Para personalizar tu experiencia, cuéntanos un poco sobre tus gustos.' },
    { title: '¿Qué géneros musicales te gustan?', category: 'generos', options: options.generos },
    { title: 'Busca y elige a tus artistas favoritos', category: 'artistas', options: [] }, // options se deja vacío a propósito
    { title: '¿Cómo te sientes o qué buscas?', category: 'sentimientos', options: options.sentimientos },
    { title: '¡Todo listo!', content: 'Gracias por compartir tus preferencias. ¡Disfruta de la aplicación!' },
  // ✅ CORRECCIÓN CLAVE: Eliminamos 'artistResults' de las dependencias para romper el bucle.
  ], [options.generos, options.sentimientos]);

  // useEffect para cargar opciones iniciales (géneros, sentimientos)
  useEffect(() => {
    if (open) {
      const fetchInitialOptions = async () => {
        try {
          setLoading(true);
          setError('');
          const response = await apiClient.get('/api/v1/preferences/onboarding-options');
          
          const genresWithImages = response.data.generos.map(genre => ({
            name: genre,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(genre)}&background=random`
          }));
          const sentimentsWithImages = response.data.sentimientos.map(sentiment => ({
            name: sentiment,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(sentiment)}&background=random`
          }));

          setOptions({ generos: genresWithImages, sentimientos: sentimentsWithImages });
        } catch (err) {
          setError('No se pudieron cargar las opciones.');
        } finally {
          setLoading(false);
        }
      };
      fetchInitialOptions();
    }
  }, [open]);

  // useEffect para la búsqueda de artistas en tiempo real
  const currentCategory = steps[step]?.category;
  useEffect(() => {
    if (currentCategory !== 'artistas' || searchTerm.length < 3) {
      setArtistResults([]);
      return;
    }
    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await apiClient.get(`/api/v1/preferences/artists/search?q=${searchTerm}`);
        if (Array.isArray(response.data)) {
          setArtistResults(response.data);
        } else {
          setArtistResults([]);
        }
      } catch (err) {
        setArtistResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentCategory]); 

  // useEffect para limpiar la búsqueda al cambiar de paso
  useEffect(() => {
    setSearchTerm('');
  }, [step]);

  // --- El resto de las funciones de manejo de estado y envío ---
  const handleToggleSelection = (category, value) => {
    const valueToStore = value.name;
    const targetCategory = category === 'artistas' ? 'autores' : category;
    setSelections(prev => {
      const currentCategory = prev[targetCategory];
      const newCategory = currentCategory.includes(valueToStore)
        ? currentCategory.filter(item => item !== valueToStore)
        : [...currentCategory, valueToStore];
      return { ...prev, [targetCategory]: newCategory };
    });
  };

  const handleSubmit = useCallback(async () => {
    try {
      await apiClient.put('/api/v1/preferences/me/preferences', selections);
      onClose();
    } catch (err) {
      setError('Hubo un problema al guardar tus preferencias.');
    }
  }, [selections, onClose]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return {
    step, nextStep, prevStep, steps,
    options, selections, loading, error,
    searchTerm, setSearchTerm, artistResults, isSearching,
    handleToggleSelection, handleSubmit
  };
};