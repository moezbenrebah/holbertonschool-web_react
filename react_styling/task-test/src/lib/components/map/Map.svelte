<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getmapLoacation } from "$lib/api/maps";
    import maplibregl from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';

    export let address: string = "Tour Eiffel, Paris";

    // États du composant
    let loading: boolean = true;
    let error: string | null = null;
    let map: maplibregl.Map | null = null;

    onMount(async () => {
        try {
            loading = true;
            error = null;

            // 1. Géocodage de l'adresse
            const response = await getmapLoacation(address);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const results = await response.json();

            if (!results?.length) {
                throw new Error("Adresse non trouvée");
            }

            const [result] = results;
            const coords = { 
                lng: parseFloat(result.lon), 
                lat: parseFloat(result.lat) 
            };

            // 2. Initialisation de la carte
            map = new maplibregl.Map({
                container: 'map-container',
                style: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
                center: [coords.lng, coords.lat],
                zoom: 14
            });

            // 3. Ajout du marqueur
            new maplibregl.Marker()
                .setLngLat([coords.lng, coords.lat])
                .addTo(map);

        } catch (err) {
            error = err instanceof Error ? err.message : "Erreur inconnue";
            console.error("Erreur MapLibre:", err);
        } finally {
            loading = false;
        }
    });

    onDestroy(() => {
        map?.remove();
    });
</script>

<div class="map-wrapper">
    {#if loading}
        <div class="loading-overlay">
            <div class="spinner"></div>
            <p>Chargement de la carte...</p>
        </div>
    {:else if error}
        <div class="error-overlay">
            <p>⚠️ {error}</p>
            <button on:click={() => location.reload()}>Réessayer</button>
        </div>
    {/if}

    <div id="map-container" class:invisible={loading || error}></div>
</div>

<style>
    .map-wrapper {
        position: relative;
        height: 400px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }

    #map-container {
        height: 100%;
        width: 100%;
        transition: opacity 0.3s;
    }

    .invisible {
        opacity: 0;
        pointer-events: none;
    }

    .loading-overlay, .error-overlay {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.9);
        z-index: 10;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    .error-overlay button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>