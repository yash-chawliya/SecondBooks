import axios from 'axios';

export const estimateDelivery = async (req, res) => {
    const { destination_pin } = req.body;
    
    const origin_pin = process.env.SOURCE_PINCODE;
    const api_token = process.env.DELHIVERY_API_TOKEN;

    if (!destination_pin || !/^\d{6}$/.test(destination_pin)) {
        return res.status(400).json({ message: 'A valid 6-digit destination pincode is required.' });
    }
    if (!api_token || !origin_pin) {
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const delhiveryApiUrl = `https://track.delhivery.com/api/dc/expected_tat?origin_pin=${origin_pin}&destination_pin=${destination_pin}&mot=S`;

    try {
        const response = await axios.get(delhiveryApiUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${api_token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const tat = response.data?.data?.tat;

        if (tat === undefined) {
             throw new Error('Invalid response structure from delivery API.');
        }

        res.status(200).json({ tat });
    } catch (error) {
        console.error("Delhivery API error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Could not estimate delivery date for this pincode.' });
    }
};
