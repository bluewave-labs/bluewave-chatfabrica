# Base Image
FROM node:20

# Çalışma Dizini
WORKDIR /usr/src/app

# Bağımlılıkların Yüklenmesi
COPY package*.json ./
RUN npm install

# Kaynak Kodunun Kopyalanması
COPY . .

# Prisma Client'in Oluşturulması
RUN npm run db:generate

# Uygulamanın Derlenmesi
RUN npm run build

# Uygulamanın Çalıştırılması
CMD ["npm", "run", "start:prod"]