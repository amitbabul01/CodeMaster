const axios = require('axios');
const getLanguageById = (lang)=>{

    const language={
        "javascript":63,
        "python": 71,
    }

    return language[lang.toLowerCase()];
}

//submission = post my completecode and languageid and input and output

const submitBatch = async (submissions)=>{
    

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'x-rapidapi-key': process.env.JUDGE0_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        submissions
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return await fetchData();

}

const waiting = async(timer)=>{
    setTimeout(()=>{
        return 1;
    },timer)
}

//after post my completecode and languageid and input and output
//the post give token
//here we give the token to the get method and check and get submission==3
const submitToken= async (resultToken)=>{

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens:resultToken.join(","),//resultToken is an array but the get message want it in a string format
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': process.env.JUDGE0_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);//we fetch/axios our data here
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    while(true){

        const result = await fetchData();

        const IsresultObtained = result.submissions.every((r)=>r.status_id>2);

        if(IsresultObtained){
            return result.submissions;
        }
        await waiting(1000);
    }
}


module.exports={getLanguageById,submitBatch,submitToken};