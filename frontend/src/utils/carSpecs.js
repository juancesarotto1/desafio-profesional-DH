export const getCarSpecs = (carName) => {
    const name = carName?.toLowerCase() || '';

    // Model specific specs
    if (name.includes('tesla')) {
        return {
            consumption: '0 L/100km (Eléctrico)',
            transmission: 'Automática (Direct Drive)',
            fuelType: 'Eléctrico',
            engine: 'Dual Motor Performance',
            hp: '450 HP',
            drivetrain: 'Tracción Integral (AWD)',
            safety: '8 Airbags + Autopilot',
            stars: '5 Estrellas (Euro NCAP)'
        };
    }

    if (name.includes('audi r8')) {
        return {
            consumption: '13.1 L/100km',
            transmission: 'S-tronic 7 vel.',
            fuelType: 'Nafta Premium',
            engine: '5.2L V10 FSI',
            hp: '610 HP',
            drivetrain: 'Quattro (AWD)',
            safety: 'Frenos Cerámicos + 6 Airbags',
            stars: 'Supercar Spec'
        };
    }

    if (name.includes('jeep wrangler')) {
        return {
            consumption: '10.5 L/100km',
            transmission: 'Automática 8 vel.',
            fuelType: 'Nafta',
            engine: '2.0L Turbo I4',
            hp: '270 HP',
            drivetrain: '4x4 Command-Trac',
            safety: 'Control de Estabilidad + 4 Airbags',
            stars: '4 Estrellas'
        };
    }

    if (name.includes('mustang') || name.includes('ford mustang')) {
        return {
            consumption: '12.4 L/100km',
            transmission: 'Automática 10 vel.',
            fuelType: 'Nafta Premium',
            engine: '5.0L V8 Coyote',
            hp: '460 HP',
            drivetrain: 'Tracción Trasera (RWD)',
            safety: '8 Airbags + Pre-Collision Assist',
            stars: '5 Estrellas'
        };
    }

    if (name.includes('porsche')) {
        return {
            consumption: '9.8 L/100km',
            transmission: 'PDK 8 vel.',
            fuelType: 'Nafta Premium',
            engine: '3.0L Boxer 6',
            hp: '385 HP',
            drivetrain: 'Tracción Trasera (RWD)',
            safety: 'Porsche Stability Management',
            stars: '5 Estrellas'
        };
    }

    // Default fallback specs
    return {
        consumption: '7.5 L/100km',
        transmission: 'Automática',
        fuelType: 'Nafta',
        engine: '2.0L Turbo',
        hp: '184 HP',
        drivetrain: 'Integral (AWD)',
        safety: '7 Airbags + ABS',
        stars: '5 Estrellas'
    };
};
