import React, { useState } from 'react';
import { Alert } from 'react-native';
import { updatePackage } from '../../services/packages.service';
import { FormScreen } from './CrearPublicacionScreen';
import { formatApiError } from '../../utils/formatters';

export default function EditarPublicacionScreen({ route, navigation }) {
  const item = route.params.package;
  const [form, setForm] = useState({
    title: item.title ?? '', description: item.description ?? '', category: item.category ?? '', original_price: String(item.original_price ?? ''), discounted_price: String(item.discounted_price ?? ''), quantity_total: String(item.quantity_total ?? ''), quantity_available: String(item.quantity_available ?? ''), estimated_weight_kg: String(item.estimated_weight_kg ?? ''), pickup_start: String(item.pickup_start ?? '').replace('T', ' ').slice(0, 16), pickup_end: String(item.pickup_end ?? '').replace('T', ' ').slice(0, 16), expires_at: item.expires_at ? String(item.expires_at).replace('T', ' ').slice(0, 16) : '', image_url: item.image_url ?? '',
  });
  const [saving, setSaving] = useState(false); const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  async function save() {
    setSaving(true);
    try {
      await updatePackage(item.id, { ...form, original_price: Number(form.original_price), discounted_price: Number(form.discounted_price), quantity_total: Number(form.quantity_total), quantity_available: Number(form.quantity_available), estimated_weight_kg: Number(form.estimated_weight_kg || 0), expires_at: form.expires_at || null, image_url: form.image_url || null });
      Alert.alert('Listo', 'Publicación actualizada.', [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
    } catch (e) { Alert.alert('Error', formatApiError(e, 'No se pudo actualizar.')); }
    finally { setSaving(false); }
  }
  return <FormScreen title="Editar publicación" form={form} set={set} saving={saving} editing onSave={save} onCancel={() => navigation.goBack()} />;
}
