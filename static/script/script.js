function validateInputs(data) {
    const { Tn, Tx, Tavg, ss, RH_avg, ddd_x } = data;
    const errors = [];

    if (Tn < 21.6 || Tn > 28.0) {
        errors.push("Temperatur minimum harus di antara 21.6 - 28.0");
    }
    if (Tx < 24.8 || Tx > 35.5) {
        errors.push("Temperatur maksimum harus di antara 24.8 - 35.5");
    }
    if (Tavg < 24.2 || Tavg > 30.4) {
        errors.push("Temperatur rata-rata harus di antara 24.2 - 30.4");
    }
    if (ss < 0.0 || ss > 11.3) {
        errors.push("Lamanya penyinaran harus di antara 0.0 - 11.3");
    }
    if (RH_avg < 60.0 || RH_avg > 99.0) {
        errors.push("Kelembapan rata-rata harus di antara 60 - 99");
    }
    if (ddd_x < 0.0 || ddd_x > 360.0) {
        errors.push("Arah angin maksimum harus berada di antara 0 - 360");
    }
    if (!(Tx >= Tavg && Tavg >= Tn)) {
        errors.push("Harus dipenuhi Temperatur max >= Temperatur avg >= Temperatur min");
    }

    return errors;
}

async function getPrediction() {
    const form = document.getElementById('prediction-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = {
        ddd_car_C: 0,
        ddd_car_E: 0,
        ddd_car_N: 0,
        ddd_car_NE: 0,
        ddd_car_NW: 0,
        ddd_car_S: 0,
        ddd_car_SE: 0,
        ddd_car_SW: 0,
        ddd_car_W: 0,
    };

    formData.forEach((value, key) => {
        if (key === 'Bulan') {
            data[key] = parseInt(value);  
        } else if (key === 'ddd_car') {
            data[`ddd_car_${value}`] = 1; 
        } else {
            data[key] = parseFloat(value); 
        }
    });

    const errors = validateInputs(data);
    if (errors.length > 0) {
        document.getElementById('result').innerText = 'Error: ' + errors.join(', ');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        document.getElementById('result').innerText = 'Prediksi: ' + result.RR;
    } catch (error) {
        document.getElementById('result').innerText = 'Error: ' + error.message;
    }
}