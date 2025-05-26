# 📝 TODO App – Teste Prático
 Este é um sistema de gestão de tarefas (Todo List) desenvolvido como teste prático para desenvolvedores.

# 📦 Tecnologias Utilizadas
- Node.js 18+
- React
- MongoDB
- Docker & Docker Compose

# 🚀 Como Executar Localmente
1. Clonar o repositório
  - Abrir o Git Bash e executar o seguinte comando
   ```
   git clone git@github.com:UserCardinot/SuricattoTeste.git
   ```

2. Rodar o projeto manualmente:

2.1 **Backend**
```
cd backend
npm install
npm run dev 
```
2.2 **Frontend**  
```
cd frontend
npm install
npm start
```

🐳 Rodando com Docker
```
 - docker-compose up --build
```

**A aplicação estará disponível em:**

Frontend: http://localhost

Backend: http://localhost:3001

MongoDB: mongodb://localhost:27017

# 🧪 Rodando Testes

**Backend**
```
- cd backend
- npm test
```
# ⚠️ Problemas Conhecidos
1. CORS precisou ser configurado diretamente no Program.cs pois, em ambiente de produção, requisições entre domínios diferentes podem ser bloqueadas pelo navegador se o CORS não estiver corretamente configurado.
   1. Foi resolvido com:
      
   ```
   const cors = require('cors');
   app.use(cors());
    ```
2. Foi criado um arquivo .env para resolver o problema de variáveis de ambiente que podem causar falhas na conexão com o banco de dados ou na comunicação frontend-backend.
   1. Foi Resolvido com:
      
   ```
    MONGO_URI=mongodb://localhost:27017/nomedobanco
    PORT=3001
   ```

3. Devido o MongoDB não ter autenticação por padrão foi necessário criar um usuário admin no banco, além de configurar com as variáveis de autenticação no *docker-compose.yml*
   1. Foi Resolvido com:
      
   ```
   MONGO_INITDB_ROOT_USERNAME: admin
   MONGO_INITDB_ROOT_PASSWORD: admin123
   ```
4. Build do frontend precisa ser compilado antes de ser servido em produção.
   1. Foi Resolvido com:

   ```
   cd frontend
   npm run build
   ```
5. O Nginx precisa estar configurado para servir o frontend e redirecionar as requisições da API para o backend.
   1. Foi resolvido com:

   ```
      server {
      listen 80;
      server_name localhost;
    
      location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri /index.html;
      }
    
      location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
      }
    }
    ```

# 🚀 Deploy
Após já ter o repositório clonado em sua máquina os seguintes passos foram executados para a realização do deploy no Docker:
```
cd suricattoteste
docker-compose up --build -d
```

e para realizar a verificação se os containers estão rodando, basta realizar o comando no terminal:
```
docker ps
```

💡 Melhorias Sugeridas

1. Cadastro de responsável pela task
2. Adicionar autenticação de usuários
3. Adicionar logs e monitoramento
4. Acessibilidade

👨‍💻 Autor
Desenvolvido como um teste prático para contratação e executado por Lucas Cardinot da Silva.

