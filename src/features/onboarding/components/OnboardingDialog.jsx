// fileName: src/features/onboarding/components/OnboardingDialog.jsx (VERSIÓN FINAL Y ROBUSTA)

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, CircularProgress, Slide, Grid, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { SelectionCard } from './SelectionCard'; // Asumimos que SelectionCard.jsx existe


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- Componente interno para renderizar los pasos con listas ---
const SelectionStep = ({ stepData, hookProps }) => {
  const {
    searchTerm, setSearchTerm, artistResults, isSearching,
    selections, handleToggleSelection
  } = hookProps;

  const category = stepData.category;
  let itemsToDisplay = [];
  if (category === 'artistas') {
    itemsToDisplay = artistResults;
  } else {
    itemsToDisplay = stepData.options || [];
  }
  
  const filteredItems = itemsToDisplay.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TextField
        fullWidth
        placeholder={`Buscar en ${category}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
      />
      <Grid container spacing={2}>
        {filteredItems.map(option => (
          <Grid item xs={6} sm={4} md={3} key={option.name}>
            <SelectionCard
              label={option.name}
              image={option.image}
              isSelected={selections[category === 'artistas' ? 'autores' : category].includes(option.name)}
              onClick={() => handleToggleSelection(category, option)}
            />
          </Grid>
        ))}
        {isSearching && <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', p:2}}><CircularProgress size={24} /></Box>}
      </Grid>
    </>
  );
};

const OnboardingDialog = ({ open, onClose }) => {
  const hookProps = useOnboarding(open, onClose);
  const { step, nextStep, prevStep, steps, loading, error, handleSubmit } = hookProps;

  const currentStepData = steps[step];

  return (
    <Dialog open={open} TransitionComponent={Transition} fullWidth maxWidth="md">
      <DialogTitle>{currentStepData?.title}</DialogTitle>
      <DialogContent dividers sx={{ minHeight: '400px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          // ✅ CORRECCIÓN: Verificamos si el paso tiene una categoría.
          // Si la tiene, renderizamos el componente de selección.
          // Si no, renderizamos el contenido simple (como el texto de bienvenida).
          currentStepData.category 
            ? <SelectionStep stepData={currentStepData} hookProps={hookProps} />
            : currentStepData.content
        )}
      </DialogContent>
      <DialogActions>
        {step > 0 && step < steps.length - 1 && <Button onClick={prevStep}>Atrás</Button>}
        <Box sx={{ flexGrow: 1 }} />
        {step < steps.length - 1 ? (
          <Button onClick={nextStep} variant="contained">Siguiente</Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained">Finalizar</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingDialog;