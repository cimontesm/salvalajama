import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../../api/client';

export default function ReportesScreen({ establishmentId }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await client.get(`/reports/establishment/${establishmentId}`);
                if (response.ok) {
                    setStats(response.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [establishmentId]);

    if (loading) return <ActivityIndicator size="large" />;
    if (!stats) return <Text>Error cargando estadísticas</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Métricas de Impacto</Text>
            <View style={styles.card}>
                <Text>Comidas Rescatadas: {stats.successful_rescues}</Text>
                <Text>Ingresos Estimados: ${stats.estimated_revenue}</Text>
                <Text>Total Reservas: {stats.total_reservations}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    card: { padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 }
});