import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import establishmentsService from '../../services/establishments.service';

export default function PanelScreen({ route }) {
    const { establishmentId } = route.params;
    const [form, setForm] = useState({ name: '', address: '', business_hours: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const response = await establishmentsService.getProfile(establishmentId);
            if (response.ok) {
                setForm(response.data);
            }
            setLoading(false);
        };
        loadData();
    }, [establishmentId]);

    const handleUpdate = async () => {
        await establishmentsService.update(establishmentId, form);
    };

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                value={form.name} 
                onChangeText={text => setForm({...form, name: text})} 
                placeholder="Nombre del local"
            />
            <TextInput 
                style={styles.input} 
                value={form.address} 
                onChangeText={text => setForm({...form, address: text})} 
                placeholder="Dirección"
            />
            <TextInput 
                style={styles.input} 
                value={form.business_hours} 
                onChangeText={text => setForm({...form, business_hours: text})} 
                placeholder="Horario de atención"
            />
            <Button title="Actualizar Información" onPress={handleUpdate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10, borderRadius: 5 }
});