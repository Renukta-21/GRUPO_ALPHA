const axios  = require("axios")
require('dotenv').config()

const getToken = async () => {
    try {
        const {data} = await axios.post("https://developers.syscom.mx/oauth/token", 
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.SECRET_KEY
            })
        )
        return data.access_token
    } catch (error) {
        console.log(error.response.data)
        throw new Error(error.response.data)
    }
}

const syscomAPI = axios.create({baseURL: "https://developers.syscom.mx/api/v1"})

syscomAPI.interceptors.request.use(async(config)=>{
    config.headers.Authorization = `Bearer ${await getToken()}`
    return config
})

module.exports = syscomAPI