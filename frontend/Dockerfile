FROM node:20-slim

WORKDIR /app

RUN npm install --global pm2

COPY package*.json ./

RUN npm install --production

COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_REMOTE_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_REMOTE_API_URL=${NEXT_PUBLIC_REMOTE_API_URL}

RUN npm run build

EXPOSE 3000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]
