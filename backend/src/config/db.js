const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Conectando ao MongoDB em:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Erro na conexão MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
